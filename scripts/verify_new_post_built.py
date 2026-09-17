#!/usr/bin/env python3
"""独立探针:检查 next build 产出的新文章 HTML 是否真的含三套 JSON-LD + 亚马逊 tag + 合规声明。
只读。"""
import glob, json, os, re, sys

root = "/opt/data/cad_work/nocodecsv_workspace"
slug = "best-wireless-keyboard-and-mouse-for-excel-under-30"
cands = glob.glob(f"{root}/.next/**/blog/{slug}*.html", recursive=True)
if not cands:
    print("❌ 没找到构建产物 HTML"); sys.exit(1)
p = cands[0]
h = open(p, encoding="utf-8").read()
print("产物:", os.path.relpath(p, root), "·", len(h), "字节")

blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)
types = []
for b in blocks:
    try:
        o = json.loads(b)
    except Exception as e:
        print("❌ JSON-LD 解析失败:", e); sys.exit(1)
    types.append(o.get("@type"))
print("JSON-LD 块:", types)

faq = next((json.loads(b) for b in blocks if '"FAQPage"' in b), None)
print("FAQPage 问题数:", len(faq["mainEntity"]) if faq else "缺失")

art = next((json.loads(b) for b in blocks if '"Article"' in b), None)
if art:
    print("Article headline:", art.get("headline", "")[:70])
    print("Article publisher.logo:", art.get("publisher", {}).get("logo", {}).get("url"))

print("亚马逊 tag=nocodecsv-20 链接数:", h.count("tag=nocodecsv-20"))
print("合规声明出现次数:", h.count("As an Amazon Associate I earn from qualifying purchases."))
print("canonical:", (re.search(r'<link rel="canonical" href="([^"]+)"', h) or [None, "缺失"])[1])
rob = re.search(r'<meta name="robots" content="([^"]+)"', h)
print("robots meta:", rob.group(1) if rob else "(无)")
h1 = re.search(r"<h1[^>]*>(.*?)</h1>", h, re.S)
print("h1:", re.sub(r"<[^>]+>", "", h1.group(1)).strip()[:90] if h1 else "缺失")
print("站内 <a href=\"/blog/...\"> 条数:", len(set(re.findall(r'href="(/blog/[^"]+)"', h))))
