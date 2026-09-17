#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
全站链接体检（确定性闸门，只读 + 出报告）
=========================================

为什么需要它:
  - `verify_blog_internal_links.mjs` 只管 /blog 内部互链（源码级）。
  - 站上其它地方的链接从没人系统查过：首页 / 工具页 / 页脚 / 文章正文。
    · 指向站内不存在的路由 → 用户点进去 404（真死链）
    · 指向站外已失效的站点 → 404 / DNS 不解析（伤 E-E-A-T 与抓取预算）
    · **亚马逊联盟链接漏了 tag= 或 tag 写错 → 有流量也没佣金**（收入直接归零，肉眼看不出来）
  - 之前踩过 `publisher.logo` 指向 404 的坑：说明「引用的东西真的存在吗」这类检查值钱。

做法（三段，先确定性后网络）:
  1. 从 `next build` 产物 HTML 抽 <a href>/<img src>/<script src>（= 用户和爬虫真正看到的），
     站内链接对**构建产物 + Next 文件约定**逐一比对（离线、100% 确定、无网络抖动）。
  2. 亚马逊链接做**联盟 tag 审计**（tag 是否存在 / 是否唯一 / rel 是否标注 sponsored）。
  3. 站外链接发真实 HTTP 请求（HEAD→GET 兜底、跟随跳转），记状态码。
     403/405/429/503 = "被反爬挡住，未验证"，**不算死链** —— 不能把挡爬虫判成链接坏了。

踩过的坑（本脚本已修，别改回去）:
  · 构建 HTML 里的 `&amp;` 必须 html.unescape 再请求，否则测的是错的 URL（假的 503）。
  · `src/app/favicon.ico` 这类 **Next 文件约定** 不在 public/，但它线上确实 200
    （实测 https://nocodecsv.com/favicon.ico → 200）→ 漏了它会把每个页面都误报成死链。
  · HEAD 被拒(405/403/503)不能直接判死，要退回 GET 再判。

用法:
    python3 scripts/audit_links.py <仓库根> [--skip-external] [--json out.json]
出口: 0 = 无确认死链且联盟 tag 无问题；1 = 有确认问题
注意: 跑前先 export PATH="/usr/local/bin:$PATH"（node 在 /usr/local/bin）
"""
import os, re, sys, json, ssl, html, collections, urllib.request, urllib.error
import concurrent.futures as futures

HTML_DIRS = [".next/server/app"]
SELF_HOSTS = {"nocodecsv.com", "www.nocodecsv.com"}
AMAZON_HOSTS = {"www.amazon.com", "amazon.com"}
AFFILIATE_TAG = "nocodecsv-20"

SOFT_CODES = {401, 403, 405, 406, 429, 503}          # 被反爬/限流挡住 → 未验证，不算死链
SPECIAL = ("mailto:", "tel:", "javascript:", "#", "data:")

# Next.js 文件约定：放在 src/app 下但不是 public/，线上却可达
NEXT_CONVENTIONS = ("favicon.ico", "icon.png", "icon.svg", "icon.jpg", "apple-icon.png",
                    "opengraph-image.png", "opengraph-image.jpg", "twitter-image.png",
                    "manifest.json", "manifest.webmanifest", "robots.txt", "sitemap.xml")

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

A_TAG = re.compile(r"<a\s([^>]*)>", re.I)
ASSET_TAG = re.compile(r"<(?:img|script|source|link)\s([^>]*)>", re.I)
HREF = re.compile(r'href\s*=\s*"([^"]*)"', re.I)
SRC = re.compile(r'src\s*=\s*"([^"]*)"', re.I)
REL = re.compile(r'rel\s*=\s*"([^"]*)"', re.I)


def norm_route(p: str) -> str:
    p = p.split("#")[0].split("?")[0]
    if not p.startswith("/"):
        p = "/" + p
    if len(p) > 1 and p.endswith("/"):
        p = p[:-1]
    return p


def build_route_set(root: str):
    """构建产物里真实存在的路由 + 动态路由前缀 + public/ 静态文件 + Next 文件约定。"""
    static_routes, dynamic_prefixes = set(), set()
    appdir = os.path.join(root, ".next/server/app")
    for dp, _, fns in os.walk(appdir):
        for fn in fns:
            if not fn.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(dp, fn), appdir)[:-len(".html")]
            if "[" in rel:
                dynamic_prefixes.add("/" + rel.split("[")[0].strip("/"))
            else:
                static_routes.add("/" if rel == "index" else "/" + rel)
    # 源码里的文件约定（favicon.ico 等）—— 构建产物里可能没有独立 .html
    appsrc = os.path.join(root, "src/app")
    for dp, _, fns in os.walk(appsrc):
        # ★ dp 本身就是 src/app 时，文件才是根级约定（favicon.ico 等）。
        #   早先写成 dirname(dp)==appsrc → 永远不成立，导致 favicon 被误报成死资源。
        for fn in fns:
            if fn in NEXT_CONVENTIONS and os.path.abspath(dp) == os.path.abspath(appsrc):
                static_routes.add("/" + fn)
    public = set()
    for dp, _, fns in os.walk(os.path.join(root, "public")):
        for fn in fns:
            public.add("/" + os.path.relpath(os.path.join(dp, fn), os.path.join(root, "public")))
    return static_routes, dynamic_prefixes, public


def check_external(url: str, timeout=15):
    """HEAD 优先，被拒则退回 GET。返回 dict，不抛异常。"""
    ctx = ssl.create_default_context()
    last = None
    for method in ("HEAD", "GET"):
        try:
            req = urllib.request.Request(url, method=method, headers={
                "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,*/*",
                "Accept-Language": "en-US,en;q=0.9"})
            with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
                return {"url": url, "status": r.status, "final": r.geturl(), "err": None}
        except urllib.error.HTTPError as e:
            if method == "HEAD" and e.code in SOFT_CODES:
                last = f"HTTP {e.code}"
                continue                      # HEAD 被拒 → 用 GET 再判一次
            return {"url": url, "status": e.code, "final": getattr(e, "url", url), "err": None}
        except Exception as e:
            last = f"{type(e).__name__}: {e}"
            continue
    return {"url": url, "status": None, "final": url, "err": last or "unknown"}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    root = args[0] if args else "."
    do_ext = "--skip-external" not in sys.argv
    json_out = sys.argv[sys.argv.index("--json") + 1] if "--json" in sys.argv else None

    htmls = sorted(os.path.join(dp, fn) for d in HTML_DIRS
                   for dp, _, fns in os.walk(os.path.join(root, d)) for fn in fns
                   if fn.endswith(".html"))
    if not htmls:
        print(f"❌ 没找到构建产物，先跑 npx next build（{HTML_DIRS}）"); sys.exit(2)
    print(f"构建产物 HTML: {len(htmls)} 个（= 每个页面用户/爬虫实际看到的链接）")

    static_routes, dyn_prefixes, public = build_route_set(root)
    print(f"站内可达路由: {len(static_routes)} 静态 + 动态前缀 {sorted(dyn_prefixes)}")
    print(f"public/ 静态资源: {len(public)} 个\n")

    internal = collections.defaultdict(set)
    external = collections.defaultdict(set)
    schema_urls = collections.defaultdict(set)
    amazon_missing_tag, amazon_bad_tag, amazon_ok, amazon_plain = [], [], 0, []
    assets_missing = collections.defaultdict(set)

    for h in htmls:
        route = os.path.relpath(h, os.path.join(root, ".next/server/app"))[:-len(".html")]
        route = "/" if route == "index" else "/" + route
        src = open(h, encoding="utf-8", errors="ignore").read()

        for attrs in A_TAG.findall(src):
            m = HREF.search(attrs)
            if not m:
                continue
            u = html.unescape(m.group(1)).strip()      # ★ 必须 unescape（&amp; → &）
            rel = (REL.search(attrs).group(1).lower() if REL.search(attrs) else "")
            if not u or u.startswith(SPECIAL):
                continue
            if u.startswith("/"):
                internal[norm_route(u)].add(route)
            elif u.startswith("http"):
                host = u.split("/")[2].lower()
                if host in SELF_HOSTS:
                    internal[norm_route("/" + "/".join(u.split("/")[3:]))].add(route)
                else:
                    external[host].add(u.split("#")[0])
                    if host in AMAZON_HOSTS:
                        q = dict(kv.split("=", 1) for kv in u.split("?", 1)[-1].split("&") if "=" in kv) \
                            if "?" in u else {}
                        if not q.get("tag"):
                            amazon_missing_tag.append((route, u[:110]))
                        elif q["tag"] != AFFILIATE_TAG:
                            amazon_bad_tag.append((route, q["tag"], u[:110]))
                        else:
                            amazon_ok += 1
                            if "sponsored" not in rel and "nofollow" not in rel:
                                amazon_plain.append((route, u[:110]))
            # 站内资源（图片/脚本）单独记
        for attrs in ASSET_TAG.findall(src):
            m = SRC.search(attrs) or HREF.search(attrs)
            if not m:
                continue
            u = html.unescape(m.group(1)).strip()
            if u.startswith("/") and not u.startswith("//"):
                assets_missing[norm_route(u)].add(route)

        # ★ 结构化数据里的 URL（这一类正是 publisher.logo→404 那个坑：HTML 里没有
        #   <img src>，所以只有扫 JSON-LD 才看得见）。白名单字段名，避免把 @context 之类拉进来。
        for block in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>',
                               src, re.S | re.I):
            for key, val in re.findall(r'"(url|logo|image|@id|contentUrl|thumbnailUrl)"\s*:\s*"([^"]+)"',
                                       block):
                u = html.unescape(val).strip()
                if u.startswith("/"):
                    schema_urls[norm_route(u)].add(route)
                elif u.startswith("http"):
                    host = u.split("/")[2].lower()
                    if host in SELF_HOSTS:
                        schema_urls[norm_route("/" + "/".join(u.split("/")[3:]))].add(route)
                    else:
                        external[host].add(u.split("#")[0])

    def reachable(link: str) -> bool:
        if link in static_routes or link in public:
            return True
        for pre in dyn_prefixes:
            if pre and link.startswith(pre):
                return True
        return link.startswith("/_next/") or link.startswith("/api/")

    dead_internal = {k: sorted(v) for k, v in internal.items() if not reachable(k)}
    dead_assets = {k: sorted(v) for k, v in assets_missing.items() if not reachable(k)}
    dead_schema = {k: sorted(v) for k, v in schema_urls.items() if not reachable(k)}
    linked = set(internal) | set(assets_missing) | set(schema_urls)
    orphans = sorted(r for r in static_routes if r not in linked
                     and not r.startswith("/_") and r not in ("/404", "/robots.txt", "/sitemap.xml"))

    print(f"站内唯一链接目标: {len(internal)} 个")
    print(f"  ❌ 指向不存在路由的死链: {len(dead_internal)}")
    for link, srcs in sorted(dead_internal.items()):
        print(f"     {link}   ← 来自 {len(srcs)} 个页面, 例: {srcs[:3]}")
    print(f"  ❌ 指向不存在资源的引用(图片/脚本): {len(dead_assets)}")
    for link, srcs in sorted(dead_assets.items()):
        print(f"     {link}   ← 来自 {len(srcs)} 个页面, 例: {srcs[:3]}")
    print(f"  ❌ 结构化数据里指向不存在资源的 URL: {len(dead_schema)}")
    for link, srcs in sorted(dead_schema.items()):
        print(f"     {link}   ← 来自 {len(srcs)} 个页面, 例: {srcs[:3]}")
    print(f"  ℹ️ 无一页链接到的页面(孤岛): {len(orphans)} {orphans}\n")

    print("亚马逊联盟链接 tag 审计（收入直接相关）")
    print(f"  ✅ tag={AFFILIATE_TAG} 正确: {amazon_ok} 处")
    print(f"  ❌ 完全没带 tag（有流量也没佣金）: {len(amazon_missing_tag)}")
    for r, u in amazon_missing_tag: print(f"     {r}  {u}")
    print(f"  ❌ tag 写错: {len(amazon_bad_tag)}")
    for r, t, u in amazon_bad_tag: print(f"     {r}  tag={t}  {u}")
    print(f"  ⚠️ 带了 tag 但没标 rel=sponsored/nofollow（联盟披露）: {len(amazon_plain)}")
    for r, u in amazon_plain[:10]: print(f"     {r}  {u}")

    ext_urls = sorted({u for s in external.values() for u in s})
    print(f"\n站外唯一域名: {len(external)} 个 · 唯一 URL: {len(ext_urls)} 个")
    for h in sorted(external):
        print(f"   {h}  ({len(external[h])})")

    results, dead_ext, soft = [], [], []
    if do_ext and ext_urls:
        print(f"\n正在发真实 HTTP 请求（{len(ext_urls)} 个，并发 8）...")
        with futures.ThreadPoolExecutor(max_workers=8) as ex:
            results = list(ex.map(check_external, ext_urls))
        for r in sorted(results, key=lambda x: (x["status"] or 999)):
            ok = r["status"] and 200 <= r["status"] < 400
            if not ok and r["status"] in SOFT_CODES:
                soft.append(r); tag = "🔒 挡住(未验证)"
            elif not ok:
                dead_ext.append(r); tag = "❌ 死链"
            else:
                tag = "✅"
            print(f"  {tag} {r['status'] or 'ERR'} {r['url'][:88]}"
                  + (f"  → {r['err']}" if r["err"] else ""))
    elif not do_ext:
        print("\n(--skip-external: 跳过站外请求)")

    ok_ext = [r for r in results if r["status"] and 200 <= r["status"] < 400]
    print("\n" + "=" * 62)
    print(f"结论: 站内死链 {len(dead_internal)} · 站内死资源 {len(dead_assets)} · "
          f"结构化数据死 URL {len(dead_schema)} · "
          f"联盟 tag 缺失 {len(amazon_missing_tag)} · tag 错误 {len(amazon_bad_tag)} · "
          f"站外确认死链 {len(dead_ext)} · 站外被挡(未验证) {len(soft)} · 站外正常 {len(ok_ext)}")
    if json_out:
        json.dump({"dead_internal": dead_internal, "dead_assets": dead_assets,
                   "dead_schema_urls": dead_schema,
                   "amazon_missing_tag": amazon_missing_tag, "amazon_bad_tag": amazon_bad_tag,
                   "amazon_ok": amazon_ok, "amazon_missing_rel": amazon_plain,
                   "dead_external": dead_ext, "blocked": soft, "external_all": results,
                   "orphans": orphans, "internal_targets": len(internal),
                   "external_urls": len(ext_urls)},
                  open(json_out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"报告 JSON: {json_out}")
    bad = (dead_internal or dead_assets or dead_schema or amazon_missing_tag
           or amazon_bad_tag or dead_ext)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
