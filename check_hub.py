#!/usr/bin/env python3
"""Verify the hub page's GROUPS list: count, clusters, slug uniqueness vs repo slugs."""
import re, sys

src = open("/opt/data/prompts/nocodecsv_blog_hub_page.tsx", encoding="utf-8").read()
# group labels + blurb
labels = re.findall(r'label: "([^"]+)",\n\s*blurb:', src)
posts = re.findall(r'\{ slug: "([^"]+)", title: "([^"]+)", blurb: "([^"]+)" \}', src)
print("clusters:", labels)
print("posts found:", len(posts))
slugs = [p[0] for p in posts]
dups = {s for s in slugs if slugs.count(s) > 1}
print("duplicate slugs:", dups or "none")

# expected: every repo blog dir slug
import json
d = json.load(open("/opt/data/cad_work/nocodecsv_workspace/blogdir.json"))
repo = sorted(x["name"] for x in d if x["type"] == "dir")
missing = [s for s in repo if s not in slugs]
extra = [s for s in slugs if s not in repo]
print("repo slugs:", len(repo))
print("in repo but not on hub:", missing or "none")
print("on hub but not in repo (new):", extra or "none")
print("total posts on hub:", len(slugs))
# itemListElement count in jsonLd
print("jsonLd uses allPosts.length:", "numberOfItems: allPosts.length" in src)
