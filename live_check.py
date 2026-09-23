#!/usr/bin/env python3
import re, urllib.request

def get(u):
    req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read().decode("utf-8", "replace")

hub = get("https://nocodecsv.com/blog")
links = sorted(set(re.findall(r'href="/blog/([a-z0-9-]+)"', hub)))
print("hub: blog links =", len(links))
print("hub: CollectionPage =", hub.count("CollectionPage"), "| ItemList =", hub.count("ItemList"))
print("hub: missing from hub vs 38 expected:", 38 - len(links))

for s in ("transpose-csv-file", "extract-email-addresses-from-csv"):
    h = get(f"https://nocodecsv.com/blog/{s}")
    print(f"\n{s}:")
    print("  FAQPage:", h.count("FAQPage"), "| BreadcrumbList:", h.count("BreadcrumbList"))
    print("  rel=nofollow sponsored:", h.count('rel="nofollow sponsored noopener"'))
    print("  href=/blog link:", len(re.findall(r'href="/blog"', h)))
    print("  word-ish count:", len(re.findall(r"[A-Za-z]{3,}", re.sub(r"<[^>]+>", " ", h))))

sm = get("https://nocodecsv.com/sitemap.xml")
locs = re.findall(r"<loc>([^<]+)</loc>", sm)
print("\nsitemap total URLs:", len(locs))
for want in ("/blog", "/blog/transpose-csv-file", "/blog/extract-email-addresses-from-csv"):
    print(f"  {want}:", "YES" if any(l.rstrip('/').endswith(want) or l.endswith(want + "/") for l in locs) else "NO")
