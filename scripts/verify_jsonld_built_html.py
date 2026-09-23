#!/usr/bin/env python3
"""
产物级 JSON-LD 验证 —— 最强证据层（零依赖，只读）。

原理：跑过真 build 之后，Next.js 把每个静态页预渲染成 .next/server/app/**/*.html。
那些 HTML 里就是**最终发给 Google 的字节**，直接从里面抽 <script type="application/ld+json">
喂给 json.loads —— 同时证明「渲染了 + JSON 合法 + 覆盖数」。

用法:
    node ./node_modules/next/dist/bin/next build          # 先构建（workspace 有 node_modules 时必跑）
    python3 verify_jsonld_built_html.py <仓库根> [产物目录=相对路径]

例:
    python3 verify_jsonld_built_html.py /opt/data/cad_work/nocodecsv_workspace .next/server/app/blog

检查项:
  * 每个 ld+json 块能被 JSON.parse（0 失败才算过）
  * Article 是否存在，且 publisher.logo 是否齐（缺了报出来）
  * BreadcrumbList 的 position 是否 1..N 严格递增，末级 item 是否 == 该页 <link rel="canonical">
  * 汇总各 @type 的覆盖数 + 少了哪个页面

为什么不能只看源码：本项目实测过 opencode-go-review-cheap-ai-models 定义了 const jsonLd
却整份文件没有对应 <script> 标签 —— 源码里有、页面上 0 条。只有产物层能发现这种。
"""
import os, re, sys, json, glob, html

def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    root = sys.argv[1]
    rel = sys.argv[2] if len(sys.argv) > 2 else ".next/server/app"
    base = os.path.join(root, rel)
    files = sorted(glob.glob(os.path.join(base, "**", "*.html"), recursive=True))
    if not files:
        print(f"❌ 没找到任何 HTML：{base}\n   先跑 `node ./node_modules/next/dist/bin/next build`")
        sys.exit(1)

    rows, failures = [], []
    for f in files:
        page = os.path.relpath(f, base)
        doc = open(f, encoding="utf-8", errors="replace").read()
        blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', doc, re.S)
        cm = re.search(r'<link rel="canonical" href="([^"]+)"', doc)
        canonical = cm.group(1) if cm else None
        types = []
        for b in blocks:
            try:
                o = json.loads(html.unescape(b))
            except Exception as e:
                failures.append((page, f"JSON.parse FAIL: {e}")); continue
            t = o.get("@type")
            types.append(t)
            if t == "Article" and "logo" not in o.get("publisher", {}):
                failures.append((page, "Article 的 publisher 缺 logo"))
            if t == "BreadcrumbList":
                items = o.get("itemListElement", [])
                if [i.get("position") for i in items] != list(range(1, len(items) + 1)):
                    failures.append((page, f"breadcrumb position 不是 1..{len(items)}"))
                if canonical and items and items[-1].get("item") != canonical:
                    failures.append((page, f"breadcrumb 末级 {items[-1].get('item')} != canonical {canonical}"))
        rows.append((page, types))

    n = len(rows)
    kinds = {}
    for _, ts in rows:
        for t in ts:
            kinds[t] = kinds.get(t, 0) + 1
    print(f"页面数: {n}    ld+json 块总数: {sum(len(t) for _, t in rows)}")
    for t, c in sorted(kinds.items(), key=lambda kv: -kv[1]):
        print(f"  {t or '(无 @type)'}: {c}/{n}")
    missing = {t: [p for p, ts in rows if t not in ts] for t in kinds}
    for t, ps in missing.items():
        if ps:
            print(f"  缺 {t} 的页面 ({len(ps)}): {ps}")
    print(f"\n问题数: {len(failures)}")
    for p, m in failures:
        print("   ", p, "→", m)
    sys.exit(1 if failures else 0)

if __name__ == "__main__":
    main()
