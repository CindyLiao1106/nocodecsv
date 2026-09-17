#!/usr/bin/env python3
"""
源码级 JSON-LD 验证（零依赖，只读）+ 覆盖率统计 + 「schema 文字 vs 页面可见文字」一致性。

★ 为什么不能直接 json.loads 源码里的对象字面量：
  这些文件用的是 JS/TS 写法 —— **裸 key**（`headline: "..."`）。json.loads 必然报
  `Expecting property name enclosed in double quotes`。**那是解析器的问题，不是 schema 的问题**。
  （实测：38 个文件会报 54 个「失败」，全是假错。）

  正确姿势 = 花括号配对抽出字面量 → 落成临时 .js → 交给 node:
        const o = require(tmp);            // eval 真字面量
        const s = JSON.stringify(o);       // 页面运行时就是这么做的
        const back = JSON.parse(s);        // 这才证明产物是合法 JSON

  ✗ 绝不要用正则给裸 key 加引号：`([{,])\\s*(\\w+)\\s*:` 会命中字符串值里的 `, word:`，
    报出假的 trailing comma（本技能里同一类坑已撞见两次）。

用法:
    python3 verify_jsonld_source.py <仓库根> [文章目录=src/app/blog]

做四件事:
  1. 覆盖率：每个 @type 有多少页（Article / FAQPage / BreadcrumbList）
  2. 渲染断言：定义了 const 却没有对应 JSON.stringify(<var>) 标签 → 死代码，页面输出 0 条
  3. Article 的 publisher.logo 是否齐
  4. FAQ 一致性 + **诚实分组**：把「本次新增的不一致」和「修复前就有的不一致」分开报
     （用 `git show HEAD:<path>` 判断某页 schema 修复前是否已存在）

  ⚠️ **本脚本判 FAQ 一致性是「源码级近似」，会高估**：它把 JSX 表达式 `{x}` 抹成空格，
     所以凡是 FAQ 用 `.map()`/组件渲染的页面，页面文字它根本看不见。
     2026-09-18 实测：源码级报 112 处，而**构建产物里其实是 148 处**（且其中 4 页整段没渲染）。
     → **要判「schema 说的内容用户到底看不看得见」，用 `scripts/verify_faq_built.py`（构建产物级，权威）**；
       本脚本的 `修复前旧有` 数字只当趋势看，别当事实。

退出码 1 = 有真问题（回环失败 / 死代码 / 本次新增的不一致 / 缺 logo）。
"""
import os, re, sys, json, glob, html, shutil, subprocess, tempfile

VARS = ("jsonLd", "breadcrumbJsonLd", "faqJsonLd")   # 需要校验的常量名
NODE = shutil.which("node") or "/usr/local/bin/node"

ENT = {"&rarr;": "\u2192", "&larr;": "\u2190", "&mdash;": "\u2014", "&ndash;": "\u2013",
       "&hellip;": "\u2026", "&nbsp;": " ", "&amp;": "&", "&gt;": ">", "&lt;": "<",
       "&quot;": '"', "&apos;": "'", "&#39;": "'", "&#x27;": "'"}


def plain(s: str) -> str:
    """JSX 片段 → 纯文本（与页面渲染文字对齐）。"""
    s = re.sub(r"\{'[^']*'\}", " ", s)
    s = re.sub(r'\{"[^"]*"\}', " ", s)
    s = re.sub(r"<[^>]+>", " ", s)
    for a, b in ENT.items():
        s = s.replace(a, b)
    return re.sub(r"\s+", " ", html.unescape(s).replace("\u00a0", " ")).strip()


def grab_literal(src: str, var: str):
    """花括号配对抽 `const <var> = {...}` 的原始字面量；跳过字符串与注释。"""
    m = re.search(rf"const {var} = ", src)
    if not m:
        return None
    i = src.index("{", m.end())
    depth, j, instr, esc, line, block = 0, i, None, False, False, False
    while j < len(src):
        c = src[j]
        nxt = src[j + 1] if j + 1 < len(src) else ""
        if line:
            if c == "\n": line = False
        elif block:
            if c == "*" and nxt == "/": block = False; j += 1
        elif instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == instr: instr = None
        else:
            if c in "\"'": instr = c
            elif c == "/" and nxt == "/": line = True; j += 1
            elif c == "/" and nxt == "*": block = True; j += 1
            elif c == "{": depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    break
        j += 1
    return src[i:j + 1]


_CACHE = {}


def preexisting(path: str, root: str) -> bool:
    """该文件在 HEAD 版本里是否已经有 FAQPage（用于把不一致分成本次新增 / 旧有）。"""
    if path in _CACHE:
        return _CACHE[path]
    rel = os.path.relpath(path, root)
    r = subprocess.run(["git", "show", f"HEAD:{rel}"], cwd=root, capture_output=True, text=True)
    _CACHE[path] = (r.returncode == 0 and '"@type": "FAQPage"' in r.stdout)
    return _CACHE[path]


DRIVER = """
const fs = require('fs');
const outPath = process.argv[2];
const files = process.argv.slice(3);
const out = [];
for (const f of files) {
  const rec = { file: f };
  try {
    const o = require(f);                          // eval 真字面量
    rec.parsed = JSON.parse(JSON.stringify(o));    // 运行时契约
    rec.ok = true;
  } catch (e) { rec.ok = false; rec.err = String(e); }
  out.push(rec);
}
fs.writeFileSync(outPath, JSON.stringify(out));
"""


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    root = sys.argv[1]
    reldir = sys.argv[2] if len(sys.argv) > 2 else "src/app/blog"
    adir = os.path.join(root, reldir)
    files = sorted(glob.glob(os.path.join(adir, "*", "page.tsx")))
    if not files:
        print(f"❌ 没找到文章页：{adir}"); sys.exit(1)

    # ---- 抽出所有字面量，一次性交给 node 做 eval + round-trip ----
    tmp = tempfile.mkdtemp()
    cases = []
    for p in files:
        slug = os.path.basename(os.path.dirname(p))
        src = open(p, encoding="utf-8").read()
        for v in VARS:
            raw = grab_literal(src, v)
            if raw is None:
                continue
            fp = os.path.join(tmp, f"{slug}__{v}.js")
            open(fp, "w", encoding="utf-8").write("module.exports = " + raw + ";\n")
            cases.append((slug, p, src, v, fp))

    driver = os.path.join(tmp, "_run.js")
    out_json = os.path.join(tmp, "_out.json")
    open(driver, "w", encoding="utf-8").write(DRIVER)
    r = subprocess.run([NODE, driver, out_json] + [c[4] for c in cases],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print("node 驱动失败：", r.stderr[:1500]); sys.exit(1)
    byfile = {d["file"]: d for d in json.load(open(out_json))}

    counts, bad_rt, unrendered, no_logo = {}, [], [], []
    faq_mismatch, seen = [], set()
    for slug, p, src, v, fp in cases:
        d = byfile[fp]
        if not d["ok"]:
            bad_rt.append((slug, v, d["err"][:140])); continue
        obj = d["parsed"]
        t = obj.get("@type")
        counts[t] = counts.get(t, 0) + 1
        if f"JSON.stringify({v})" not in src:
            unrendered.append((slug, v))           # ★ 死代码：源码里有，页面输出 0 条
        if t == "Article" and "logo" not in obj.get("publisher", {}):
            no_logo.append(slug)
        if t == "FAQPage":
            visible = plain(src[src.index("export default function"):])
            for q in obj.get("mainEntity", []):
                qt = plain(q.get("name", ""))
                at = plain(q.get("acceptedAnswer", {}).get("text", ""))
                if qt not in visible or at[:70] not in visible:
                    if (slug, qt[:70]) not in seen:
                        seen.add((slug, qt[:70]))
                        faq_mismatch.append((slug, qt[:70], preexisting(p, root)))

    old_mm = sorted({(s, q) for s, q, pre in faq_mismatch if pre})
    new_mm = sorted({(s, q) for s, q, pre in faq_mismatch if not pre})

    n = len(files)
    print(f"文章页数: {n}")
    for t, c in sorted(counts.items(), key=lambda kv: -kv[1]):
        print(f"  {t or '(无 @type)'}: {c}/{n}")
    print(f"\nJSON.stringify → JSON.parse 回环：{len(cases)} 个字面量，失败 {len(bad_rt)}")
    for b in bad_rt:
        print("   FAIL", b)
    print(f"定义了却没渲染（死代码，页面实际 0 条）: {len(unrendered)} {unrendered}")
    print(f"Article 缺 publisher.logo: {len(no_logo)} {sorted(set(no_logo))}")
    print(f"\n本次新增 schema 的不一致: {len(new_mm)}   ← 必须为 0")
    for m in new_mm:
        print("   NEW", m)
    print(f"修复前旧有 schema 的不一致: {len(old_mm)}   ← 如实报为遗留项，"
          f"涉及 {len({m[0] for m in old_mm})} 篇: {sorted({m[0] for m in old_mm})}")
    shutil.rmtree(tmp, ignore_errors=True)
    sys.exit(1 if (bad_rt or unrendered or new_mm or no_logo) else 0)


if __name__ == "__main__":
    main()
