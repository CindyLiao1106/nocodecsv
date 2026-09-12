#!/usr/bin/env python3
"""Ground-truth check: parse every <script type="application/ld+json"> from the BUILT HTML."""
import os, re, json, glob, html

OUT = "/opt/data/cad_work/nocodecsv_workspace/.next/server/app/blog"
rows, failures = [], []
for f in sorted(glob.glob(os.path.join(OUT, "*.html"))):
    slug = os.path.basename(f)[:-5]
    doc = open(f, encoding="utf-8").read()
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', doc, re.S)
    types, ok = [], True
    for b in blocks:
        try:
            o = json.loads(html.unescape(b))
            t = o.get("@type")
            types.append(t)
            if t == "Article" and "logo" not in o.get("publisher", {}):
                failures.append((slug, "Article without publisher.logo"))
            if t == "BreadcrumbList":
                pos = [e.get("position") for e in o.get("itemListElement", [])]
                if pos != [1, 2, 3]:
                    failures.append((slug, f"breadcrumb positions {pos}"))
                if o["itemListElement"][-1]["item"] != f"https://nocodecsv.com/blog/{slug}":
                    failures.append((slug, "breadcrumb last item != canonical"))
        except Exception as e:
            ok = False
            failures.append((slug, f"JSON.parse FAIL: {e}"))
    rows.append((slug, types, ok))

print(f"built HTML pages checked: {len(rows)}")
n = len(rows)
print(f"  pages with Article      : {sum(1 for _, t, _ in rows if 'Article' in t)}/{n}")
print(f"  pages with FAQPage      : {sum(1 for _, t, _ in rows if 'FAQPage' in t)}/{n}")
print(f"  pages with BreadcrumbList: {sum(1 for _, t, _ in rows if 'BreadcrumbList' in t)}/{n}")
print(f"  total ld+json blocks    : {sum(len(t) for _, t, _ in rows)}")
print()
print(f"problems: {len(failures)}")
for f_ in failures: print("   ", f_)
print()
no_faq = [s for s, t, _ in rows if "FAQPage" not in t]
print("pages without FAQPage:", no_faq)
no_article = [s for s, t, _ in rows if "Article" not in t]
print("pages without Article:", no_article)
