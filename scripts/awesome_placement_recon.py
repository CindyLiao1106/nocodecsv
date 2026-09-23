#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""对 GO 名单里的 awesome-list 做【收录规则 + 插入位置】侦察。

输出:每个目标 ① license/规则要点 ② README 里可用分区(含 CSV/CLI/工具 关键词)
③ 该分区的现有条目样例(照它的格式写)④ 是否已收录 csv-peek。
用法:python3 awesome_placement_recon.py <owner/repo> [<owner/repo> ...]
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
H = {
    "User-Agent": "Mozilla/5.0 (compatible; placement-recon)",
    "Accept": "application/vnd.github+json",
    "Authorization": "Bearer " + TOKEN,
}


def api(path):
    try:
        with urllib.request.urlopen(urllib.request.Request("https://api.github.com" + path, headers=H), timeout=45) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return {"__http__": e.code}


def raw(repo, path, branch):
    url = f"https://raw.githubusercontent.com/{repo}/{branch}/{path}"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=45) as r:
            return r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return f"__HTTP_{e.code}__"


KEY = ("csv", "cli", "command line", "command-line", "tool", "utility", "utilities",
       "data prof", "profiling", "etl", "explor", "python", "quality", "validation")


def recon(repo):
    info = api(f"/repos/{repo}")
    if info.get("__http__"):
        print(f"!! {repo} -> HTTP {info['__http__']}")
        return
    br = info["default_branch"]
    print("=" * 96)
    print(f"■ {repo}  ★{info['stargazers_count']} · license={(info.get('license') or {}).get('spdx_id')} · pushed={info['pushed_at'][:10]}")
    print(f"  {info.get('description')}")

    for cf in ("contributing.md", "CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/contributing.md"):
        c = raw(repo, cf, br)
        if not c.startswith("__HTTP"):
            lines = [l.strip() for l in c.splitlines() if l.strip()]
            print(f"\n  ── {cf}({len(c)} 字符,前 25 行)──")
            for l in lines[:25]:
                print("   |", l[:150])
            break
    else:
        print("\n  ── 无 contributing 文件 ──")

    # 找 README
    readme = None
    for name in ("README.md", "readme.md", "Readme.md"):
        t = raw(repo, name, br)
        if not t.startswith("__HTTP"):
            readme, readme_name = t, name
            break
    if not readme:
        print("  !! README 取不到")
        return
    print(f"\n  ── {readme_name} {len(readme)} 字符 ──")
    print("  已收录 csv-peek? ->", "YES" if re.search(r"csv-peek", readme, re.I) else "no")

    heads = [(m.start(), m.group(0).strip()) for m in re.finditer(r"^#{2,3}[^\n]*", readme, re.M)]
    print(f"  分区数 {len(heads)}")
    # 命中关键词的分区:打印该区现有条目
    for i, (pos, h) in enumerate(heads):
        name = h.lstrip("# ").strip()
        if not any(k in name.lower() for k in KEY):
            continue
        end = heads[i + 1][0] if i + 1 < len(heads) else len(readme)
        seg = readme[pos:end]
        entries = [l for l in seg.splitlines() if l.strip().startswith(("-", "*"))]
        if not entries:
            continue
        print(f"\n  ── 可用分区: {name}  ({len(entries)} 条) ──")
        for l in entries[:12]:
            print("   ", l.strip()[:160])
        if len(entries) > 12:
            print(f"    ...(共 {len(entries)} 条)")


if __name__ == "__main__":
    for r in sys.argv[1:]:
        recon(r)
