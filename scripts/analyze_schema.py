#!/usr/bin/env python3
"""Analyze nocodecsv blog articles: FAQ visible text, FAQPage schema, BreadcrumbList, publisher.logo."""
import os, re, json, sys

BLOG = "/opt/data/cad_work/nocodecsv_workspace/src/app/blog"

def analyze(path):
    src = open(path, encoding="utf-8").read()
    d = {}
    # schema flags
    d["has_article"] = '"@type": "Article"' in src
    d["has_faqpage_schema"] = '"@type": "FAQPage"' in src
    d["has_breadcrumb"] = '"@type": "BreadcrumbList"' in src
    d["publisher_has_logo"] = bool(re.search(r'publisher:\s*\{[^}]*logo', src, re.S))
    # visible FAQ: find the JSX region (after default function) and look for h3
    m = re.search(r'export default function', src)
    jsx = src[m.start():] if m else src
    # strip the script blocks (schema) - they don't contain <h3>
    h3s = re.findall(r'<h3[^>]*>(.*?)</h3>', jsx, re.S)
    # find FAQ heading in visible jsx
    faq_heads = re.findall(r'<h2[^>]*>(.*?)</h2>', jsx, re.S)
    d["h3_count"] = len(h3s)
    d["h3s"] = [re.sub(r'<[^>]+>', '', x).strip() for x in h3s]
    d["has_faq_heading"] = any('FAQ' in h or 'Frequently Asked' in h for h in faq_heads)
    return d

rows = []
for slug in sorted(os.listdir(BLOG)):
    p = os.path.join(BLOG, slug, "page.tsx")
    if not os.path.isfile(p):
        continue
    d = analyze(p)
    d["slug"] = slug
    rows.append(d)

print(f"TOTAL articles: {len(rows)}")
print()
print(f"{'slug':45} {'Article':7} {'FAQsch':6} {'h3':3} {'FAQsect':7} {'Bread':5} {'logo':4}")
for d in rows:
    print(f"{d['slug']:45} {str(d['has_article']):7} {str(d['has_faqpage_schema']):6} {d['h3_count']:<3} {str(d['has_faq_heading']):7} {str(d['has_breadcrumb']):5} {str(d['publisher_has_logo']):4}")

print()
print("=== COUNTS ===")
print("Article:", sum(1 for d in rows if d['has_article']), "/", len(rows))
print("FAQPage:", sum(1 for d in rows if d['has_faqpage_schema']), "/", len(rows))
print("BreadcrumbList:", sum(1 for d in rows if d['has_breadcrumb']), "/", len(rows))
print("publisher.logo:", sum(1 for d in rows if d['publisher_has_logo']), "/", len(rows))

print()
print("=== VISIBLE FAQ (has h3 >=2, no FAQPage schema) ===")
need = [d['slug'] for d in rows if d['h3_count'] >= 2 and not d['has_faqpage_schema']]
for s in need: print(" ", s, "h3=", next(d['h3_count'] for d in rows if d['slug']==s))
print("count:", len(need))

print()
print("=== No FAQ section AND no FAQPage schema ===")
none_ = [d['slug'] for d in rows if not d['has_faqpage_schema'] and d['h3_count'] < 2]
for s in none_: print(" ", s)
print("count:", len(none_))
