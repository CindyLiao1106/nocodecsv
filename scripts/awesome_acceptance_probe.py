#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""awesome-list 收录行为探针 —— 「这个列表到底收不收社区提交?」

起因(2026-09-20 夜班实测):secretGeek/AwesomeCSV 的 PR #97 被维护者
【无留言直接关闭】(closedAt 2026-09-19T09:19:04Z, mergedAt=null)。
查它的历史 PR 才发现:98/97/96/95/94/93/92/91/89/88/87/84/83 全是 CLOSED 未合并
-> 该列表【实质不接受社区提交】。而在那之前,我们把 PR 提上去就记成了「完成」。
=> 教训:投 PR 之前必须先量这个列表的【历史合并行为】,不能只看它长得像 awesome list。

判据(全部来自 GitHub API 实测,不是印象):
  merged_recent  = 最近 12 个月内被合并的 PR 数        (要 >0 才说明这条路是活的)
  merge_rate     = 最近 12 个月已关闭 PR 里被合并的比例 (awesome list 常见两种极值:
                   ~1.0 = 基本都收; 0.0 = 基本都不收,别浪费时间)
  last_merged_at = 最近一次合并的时间                  (太久没动 = 维护者已停)
  archived       = 已归档则跳过
  has_contributing = 有无 contributing 文件(有规则可依 = 更好写合规 PR)

输出:JSON(落盘可复核) + 人读表格。
用法:python3 awesome_acceptance_probe.py [--out <path>]
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

OUT_DEFAULT = "/opt/data/cad_work/citation_outreach/awesome_acceptance_20260920.json"

# 候选列表:CSV/数据/CLI/开发者工具 生态里【工具类提交可能被接受】的清单
CANDIDATES = [
    "MigoXLab/awesome-data-quality",      # 已投 PR #15(仍 OPEN)
    "secretGeek/AwesomeCSV",              # 已投 PR #97(已被关闭,本探针的触发者)
    "agarrharr/awesome-cli-apps",
    "jsbroks/awesome-dataset-tools",
    "igorbarinov/awesome-data-engineering",
    "lorien/awesome-web-scraping",
    "krzjoa/awesome-python-data-science",
    "vinta/awesome-python",
    "mahseema/awesome-ai-tools",
    "e2b-dev/awesome-ai-agents",
    "steven2358/awesome-generative-ai",
    "krishnaik06/Awesome-Data-Analysis",
    "sindresorhus/awesome",
    "pawroman/awesome-datascience-ideas",
    "academic/awesome-datascience",
    "awesomedata/awesome-public-datasets",
    "CindyLiao1106/csv-peek",             # 自己仓库,做对照基线
]


def token():
    for line in open("/opt/data/.env", encoding="utf-8", errors="ignore"):
        if line.startswith("GITHUB_TOKEN="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("no GITHUB_TOKEN in /opt/data/.env")


TOKEN = token()
H = {
    "User-Agent": "Mozilla/5.0 (compatible; acceptance-probe)",
    "Accept": "application/vnd.github+json",
    "Authorization": "Bearer " + TOKEN,
}


def api(path, retries=3):
    url = "https://api.github.com" + path
    last = None
    for _ in range(retries):
        try:
            req = urllib.request.Request(url, headers=H)
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return {"__http__": 404}
            if e.code in (403, 429, 500, 502, 503):
                last = e
                time.sleep(3)
                continue
            return {"__http__": e.code}
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(2)
    return {"__http__": "fail", "__err__": str(last)[:120]}


def probe(repo):
    now = datetime.now(timezone.utc)
    win12 = now - timedelta(days=365)
    info = api(f"/repos/{repo}")
    if info.get("__http__"):
        return {"repo": repo, "error": info.get("__http__")}

    row = {
        "repo": repo,
        "stars": info.get("stargazers_count"),
        "archived": bool(info.get("archived")),
        "pushed_at": info.get("pushed_at"),
        "default_branch": info.get("default_branch"),
        "license": (info.get("license") or {}).get("spdx_id"),
        "description": (info.get("description") or "")[:90],
    }

    # contributing 文件(常见四种命名)
    cf = None
    for name in ("contributing.md", "CONTRIBUTING.md", "docs/contributing.md", ".github/CONTRIBUTING.md"):
        r = api(f"/repos/{repo}/contents/{name}")
        if not r.get("__http__"):
            cf = name
            break
    row["has_contributing"] = cf

    # PR 合并行为:取最近 3 页已关闭 PR(100/页),按时间窗过滤
    merged, closed_unmerged, recent = 0, 0, []
    oldest_seen = None
    for page in (1, 2, 3):
        prs = api(f"/repos/{repo}/pulls?state=closed&per_page=100&page={page}&sort=updated&direction=desc")
        if not isinstance(prs, list) or not prs:
            break
        stop = False
        for pr in prs:
            closed_at = pr.get("closed_at")
            if not closed_at:
                continue
            try:
                ct = datetime.strptime(closed_at, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
            except ValueError:
                continue
            oldest_seen = ct
            if ct < win12:
                stop = True
                continue
            recent.append(pr)
            if pr.get("merged_at"):
                merged += 1
            else:
                closed_unmerged += 1
        if stop:
            break
        time.sleep(0.4)
    row["closed_prs_12mo"] = len(recent)
    row["merged_prs_12mo"] = merged
    row["closed_unmerged_12mo"] = closed_unmerged
    row["merge_rate_12mo"] = round(merged / len(recent), 3) if recent else None
    merged_dates = sorted(p["merged_at"] for p in recent if p.get("merged_at"))
    row["last_merged_at"] = merged_dates[-1] if merged_dates else None
    row["sample_merged_titles"] = [p["title"][:60] for p in recent if p.get("merged_at")][:3]
    row["sample_closed_titles"] = [p["title"][:60] for p in recent if not p.get("merged_at")][:3]
    # 是否有我们自己的未关闭 PR
    own = api(f"/repos/{repo}/pulls?state=open&per_page=100")
    row["our_open_pr"] = [
        {"number": p["number"], "title": p["title"][:60], "author": p["user"]["login"]}
        for p in (own if isinstance(own, list) else [])
        if p.get("user", {}).get("login") == "CindyLiao1106"
    ]
    return row


def verdict(r):
    """给一条可执行结论:GO(值得投) / MAYBE(要人工看规则) / NO(别浪费时间)"""
    if r.get("archived"):
        return "NO", "仓库已归档"
    mr = r.get("merge_rate_12mo")
    m = r.get("merged_prs_12mo") or 0
    if r.get("our_open_pr"):
        return "HOLD", "我方已有未关闭 PR,等维护者"
    if m == 0:
        return "NO", "近 12 个月 0 个被合并的 PR(实质不收提交)"
    if mr is not None and mr < 0.15:
        return "NO", f"合并率 {mr}(基本都关闭)"
    if mr is not None and mr >= 0.5:
        return "GO", f"合并率 {mr} · 近 12 月合并 {m} 个"
    return "MAYBE", f"合并率 {mr} · 近 12 月合并 {m} 个(需逐条对规则)"


def main():
    out_path = OUT_DEFAULT
    if "--out" in sys.argv:
        out_path = sys.argv[sys.argv.index("--out") + 1]
    rows = []
    for repo in CANDIDATES:
        r = probe(repo)
        if r.get("error"):
            r["verdict"], r["reason"] = "ERR", str(r["error"])
        else:
            r["verdict"], r["reason"] = verdict(r)
        rows.append(r)
        print(f"{r['verdict']:<5} {repo:<40} {r.get('reason', '')}")
        time.sleep(0.5)

    payload = {
        "_doc": "awesome-list 收录行为实测(判据见脚本 docstring);verdict GO = 数据支持投 PR",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "rows": rows,
    }
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print("\n落盘:", out_path, os.path.getsize(out_path), "字节")
    go = [r["repo"] for r in rows if r.get("verdict") == "GO"]
    maybe = [r["repo"] for r in rows if r.get("verdict") == "MAYBE"]
    print("GO   :", go)
    print("MAYBE:", maybe)


if __name__ == "__main__":
    main()
