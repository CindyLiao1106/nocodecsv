#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用「构建产物的真实 HTML」判定 FAQ 一致性 —— 这是用户和 Google 真正看到的东西。
背景: `verify_jsonld_source.py` 是在**源码**上判的,它把 JSX 表达式 `{x}` 抹成空格,
所以凡是 FAQ 用 `.map()` 渲染的页面,它都看不见文字 → 可能整片误报(112 处)。
本探针只读构建产物,不修改任何文件。

用法: python3 /opt/data/cad_work/_verify_faq_built.py [slug ...]   (默认全部文章)
"""
import os, re, sys, json, glob, html

ROOT = "/opt/data/cad_work/nocodecsv_workspace"
ADIR = os.path.join(ROOT, ".next/server/app/blog")


def visible_text(doc: str) -> str:
    doc = re.sub(r"<script[^>]*>.*?</script>", " ", doc, flags=re.S | re.I)
    doc = re.sub(r"<style[^>]*>.*?</style>", " ", doc, flags=re.S | re.I)
    doc = re.sub(r"<!--.*?-->", " ", doc, flags=re.S)
    doc = re.sub(r"<[^>]+>", " ", doc)
    return re.sub(r"\s+", " ", html.unescape(doc)).strip()


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def main():
    slugs = sys.argv[1:] or sorted(os.path.basename(p)[:-len(".html")]
                                   for p in glob.glob(os.path.join(ADIR, "*.html")))
    bad, ok, nofaq = [], 0, []
    for slug in slugs:
        p = os.path.join(ADIR, slug + ".html")
        if not os.path.exists(p):
            continue
        doc = open(p, encoding="utf-8", errors="ignore").read()
        blocks = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', doc, re.S | re.I)
        faq = None
        for b in blocks:
            try:
                o = json.loads(b)
            except Exception:
                continue
            cands = o if isinstance(o, list) else [o]
            for c in cands:
                if isinstance(c, dict) and c.get("@type") == "FAQPage":
                    faq = c
        if not faq:
            nofaq.append(slug); continue
        vis = visible_text(doc)
        miss = []
        for q in faq.get("mainEntity", []):
            qt, at = norm(q.get("name", "")), norm(q.get("acceptedAnswer", {}).get("text", ""))
            if qt not in vis:
                miss.append(("Q", qt[:80]))
            if at[:70] not in vis:
                miss.append(("A", at[:80]))
        if miss:
            bad.append((slug, len(miss), len(faq.get("mainEntity", [])), miss[:2]))
        else:
            ok += 1
    print(f"有 FAQPage 且**逐字可见**的页面: {ok}")
    print(f"有不一致(渲染后仍对不上)的页面: {len(bad)}")
    total = sum(b[1] for b in bad)
    print(f"不一致条目总数: {total}")
    for slug, n, tot, ex in bad:
        print(f"  {slug}: {n}/{tot*2} 处不符 例:{ex}")
    print(f"没有 FAQPage 的页面: {len(nofaq)} {nofaq[:5]}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
