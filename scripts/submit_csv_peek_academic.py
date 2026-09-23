#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 csv-peek 提交给 academic/awesome-datascience(其 Miscellaneous Tools 是【表格】格式)。

前提(2026-09-20 夜班):
  · 该清单 CONTRIBUTING 无年龄/星数门槛;近 12 个月合并了 107 个 PR(实测)
  · 该分区是 markdown 表格 `| Link | Description |`,必须按表格行追加(不是 bullet)
  · 该分区未按字母序排列 → 追加到表格末尾
  · 只许【加行】:完成后用 GitHub compare API 验证 additions>0 且 deletions==0
  · 清单没有「禁止 AI 生成 PR」条款(cli-apps 有,已排除);PR 正文如实披露由 AI 助手起草、作者本人复核
"""
import base64
import json
import sys
import time
import urllib.error
import urllib.request

ME = "CindyLiao1106"
UPSTREAM = "academic/awesome-datascience"
NAME = UPSTREAM.split("/")[1]
BRANCH = "add-csv-peek"
PATH = "README.md"
ANCHOR = "| [ML Workspace](https://github.com/ml-tooling/ml-workspace)"  # 该表格最后一条(实测 559 行)
ROW = ("| [csv-peek](https://github.com/CindyLiao1106/csv-peek) | Zero-dependency command line profiler "
       "for CSV/TSV files: column types, null rates, unique counts and duplicate rows. |")

TOKEN = None
for line in open("/opt/data/.env", encoding="utf-8", errors="ignore"):
    if line.startswith("GITHUB_TOKEN="):
        TOKEN = line.split("=", 1)[1].strip()
H = {"User-Agent": "Mozilla/5.0", "Accept": "application/vnd.github+json", "Authorization": "Bearer " + TOKEN}


def api(path, method="GET", data=None):
    req = urllib.request.Request("https://api.github.com" + path, headers=H, method=method,
                                 data=json.dumps(data).encode() if data else None)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read()[:400].decode("utf-8", "ignore")
        raise SystemExit(f"HTTP {e.code} {e.reason} on {method} {path}\n{body}")


def ensure_fork():
    api(f"/repos/{UPSTREAM}/forks", "POST", {})
    for _ in range(15):
        try:
            api(f"/repos/{ME}/{NAME}")
            return
        except SystemExit:
            time.sleep(4)
    raise SystemExit("fork 未就绪")


meta = api(f"/repos/{UPSTREAM}")
base = meta["default_branch"]
head_sha = api(f"/repos/{UPSTREAM}/git/ref/heads/{base}")["object"]["sha"]
print(f"上游 {UPSTREAM} 默认分支 {base} @ {head_sha[:8]}")

try:
    api(f"/repos/{ME}/{NAME}/git/ref/heads/{BRANCH}")
    print(f"分支 {BRANCH} 已存在,复用")
except SystemExit:
    ensure_fork()
    api(f"/repos/{ME}/{NAME}/git/refs", "POST", {"ref": f"refs/heads/{BRANCH}", "sha": head_sha})
    print(f"已建分支 {BRANCH} @ {head_sha[:8]}")

cur = api(f"/repos/{ME}/{NAME}/contents/{PATH}?ref={BRANCH}")
txt = base64.b64decode(cur["content"]).decode("utf-8")
if "csv-peek" in txt:
    print("README 里已有 csv-peek,不重复插入")
else:
    lines = txt.split("\n")
    idx = next((i for i, l in enumerate(lines) if l.startswith(ANCHOR)), None)
    if idx is None:
        raise SystemExit(f"找不到锚点 {ANCHOR!r} —— 未改动任何内容")
    lines.insert(idx + 1, ROW)
    new = "\n".join(lines)
    assert len(new.split("\n")) - len(txt.split("\n")) == 1, "只应 +1 行"
    api(f"/repos/{ME}/{NAME}/contents/{PATH}", "PUT",
        {"message": "Add csv-peek to Miscellaneous Tools", "content": base64.b64encode(new.encode()).decode(),
         "sha": cur["sha"], "branch": BRANCH})
    print(f"已提交:+1 行(插在第 {idx+2} 行,ML Workspace 之后)")

cmp = api(f"/repos/{UPSTREAM}/compare/{base}...{ME}:{NAME}:{BRANCH}")
f0 = cmp["files"][0]
print(f"对比上游:files={len(cmp['files'])} additions={f0['additions']} deletions={f0['deletions']}")
if f0["deletions"] != 0 or f0["additions"] != 1:
    raise SystemExit("❌ 不是「纯加 1 行」,已停止,不开 PR")

BODY = f"""Adds **csv-peek** to *Miscellaneous Tools*.

**What it is:** a single-file, zero-dependency Python script that profiles a CSV or TSV from the
terminal — column count, data rows, detected delimiter, and per-column inferred type, null %,
unique count, min/median/max (or top values), plus approximate duplicate-row detection.
It answers *"what is actually in this file?"* in one command, with nothing to install.

- Repo: https://github.com/CindyLiao1106/csv-peek
- License: MIT · Python 3.8+ standard library only (no dependencies, no install step)
- Tests: 7 unit tests (`python3 -m unittest discover -s tests -v`)
- Release: v0.1.0 (with CHANGELOG)

**Formatting:** *Miscellaneous Tools* uses the `| Link | Description |` table, so the entry is a
table row appended at the end of that table (the section is not alphabetized). The diff is
**+1 line, 0 deletions** — nothing else is touched.

**Disclosure:** I maintain this repository. This entry (and the PR text) was drafted with an AI
assistant against the repo's own contribution rules and reviewed by me before submitting — please
tell me if you'd rather it were worded or placed differently and I'll amend it.
"""

pr = api(f"/repos/{UPSTREAM}/pulls", "POST",
         {"title": "Add csv-peek to Miscellaneous Tools", "head": f"{ME}:{BRANCH}", "base": base, "body": BODY})
print("PR:", pr["html_url"], "| number", pr["number"], "| state", pr["state"])
