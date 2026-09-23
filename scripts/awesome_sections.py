#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""列出某个 awesome-list 的全部分区(含条目数),用于选插入位置。
用法:python3 awesome_sections.py <owner/repo> [关键词]
"""
import json
import re
import sys
import urllib.error
import urllib.request

TOKEN = None
for line in open("/opt/data/.env", encoding="utf-8", errors="ignore"):
    if line.startswith("GITHUB_TOKEN="):
        TOKEN = line.split("=", 1)[1].strip()
H = {"User-Agent": "Mozilla/5.0", "Accept": "application/vnd.github+json", "Authorization": "Bearer " + TOKEN}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=45) as r:
        return r.read().decode("utf-8", "ignore")


def main():
    repo = sys.argv[1]
    kw = sys.argv[2].lower() if len(sys.argv) > 2 else None
    info = json.loads(get(f"https://api.github.com/repos/{repo}"))
    br = info["default_branch"]
    for name in ("README.md", "readme.md"):
        try:
            txt = get(f"https://raw.githubusercontent.com/{repo}/{br}/{name}")
            break
        except urllib.error.HTTPError:
            txt = None
    if not txt:
        raise SystemExit("no README")
    heads = [(m.start(), m.group(0).strip()) for m in re.finditer(r"^#{2,4}[^\n]*", txt, re.M)]
    print(f"■ {repo} · {name} · {len(txt)} 字符 · {len(heads)} 个分区\n")
    for i, (pos, h) in enumerate(heads):
        end = heads[i + 1][0] if i + 1 < len(heads) else len(txt)
        seg = txt[pos:end]
        entries = [l for l in seg.splitlines() if l.strip().startswith(("-", "*")) and "](" in l]
        label = h.lstrip("# ").strip()
        if kw and kw not in label.lower():
            continue
        print(f"{label[:58]:<58} 条目 {len(entries):>4}   偏移 {pos}")
        if kw:
            for l in entries[:20]:
                print("      ", l.strip()[:150])


if __name__ == "__main__":
    main()
