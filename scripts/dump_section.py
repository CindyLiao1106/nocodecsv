#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""打印某 awesome-list README 指定分区附近的原文行(选插入位置用)。
用法:python3 dump_section.py <owner/repo> <分区标题关键词> [前后行数]
"""
import json
import sys
import urllib.request

TOKEN = None
for line in open("/opt/data/.env", encoding="utf-8", errors="ignore"):
    if line.startswith("GITHUB_TOKEN="):
        TOKEN = line.split("=", 1)[1].strip()
H = {"User-Agent": "Mozilla/5.0", "Accept": "application/vnd.github+json", "Authorization": "Bearer " + TOKEN}


def get(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers=H), timeout=45) as r:
        return r.read().decode("utf-8", "ignore")


repo, kw = sys.argv[1], sys.argv[2]
span = int(sys.argv[3]) if len(sys.argv) > 3 else 24
info = json.loads(get(f"https://api.github.com/repos/{repo}"))
br = info["default_branch"]
txt = None
for name in ("README.md", "readme.md"):
    try:
        txt = get(f"https://raw.githubusercontent.com/{repo}/{br}/{name}")
        break
    except Exception:  # noqa: BLE001
        pass
lines = txt.splitlines()
for i, l in enumerate(lines):
    if l.strip().startswith("#") and kw.lower() in l.lower():
        print(f"--- {repo} 第 {i+1} 行: {l.strip()} ---")
        for j in range(i, min(i + span, len(lines))):
            print(f"{j+1:>5}| {lines[j]}")
        print()
