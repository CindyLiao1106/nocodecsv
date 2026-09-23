#!/usr/bin/env python3
"""Verify pushed source files, then poll live URLs until deployed."""
import subprocess, sys, time, urllib.request

sys.path.insert(0, "/opt/data/cad_work/nocodecsv_workspace")
from gh_helper import get_file

checks = {
    "src/app/blog/page.tsx": ["export default function BlogIndex", "CollectionPage", "ItemList"],
    "src/app/sitemap.ts": ["/blog`", "blog/transpose-csv-file", "blog/extract-email-addresses-from-csv"],
    "src/lib/related-posts.ts": ["'transpose-csv-file': 'convert'", "'extract-email-addresses-from-csv': 'clean'",
                                  "'merge-csv-files-free': 'ops'", "'opencode-go-review-cheap-ai-models': 'ai'",
                                  "const rotate = (arr: string[], seed: string)"],
    "src/components/layout/header.tsx": ['href="/blog"'],
    "src/components/layout/footer.tsx": ['href="/blog"', "All Guides"],
    "src/app/blog/transpose-csv-file/page.tsx": ["BreadcrumbList", "FAQPage", "Tools mentioned in this guide", "RelatedPosts"],
    "src/app/blog/extract-email-addresses-from-csv/page.tsx": ["BreadcrumbList", "FAQPage", "Tools mentioned in this guide", "RelatedPosts"],
}
print("### SOURCE VERIFY ###")
ok = True
for path, needles in checks.items():
    c, sha, meta = get_file(path)
    if c is None:
        print(f"  MISSING {path} {meta}"); ok = False; continue
    miss = [n for n in needles if n not in c]
    print(f"  {path}: {'OK' if not miss else 'MISSING ' + str(miss)}")
    if miss: ok = False
print("source:", "ALL OK" if ok else "PROBLEMS")

urls = [
    "https://nocodecsv.com/blog",
    "https://nocodecsv.com/blog/transpose-csv-file",
    "https://nocodecsv.com/blog/extract-email-addresses-from-csv",
    "https://nocodecsv.com/sitemap.xml",
]
print("\n### LIVE DEPLOY POLL ###")
for attempt in range(12):
    time.sleep(20)
    status = {}
    for u in urls:
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as r:
                status[u] = r.status
        except Exception as e:
            status[u] = getattr(e, "code", str(e)[:30])
    print(f"  t+{20*(attempt+1)}s:", status)
    if all(v == 200 for v in status.values()):
        print("  ALL LIVE 200")
        break
