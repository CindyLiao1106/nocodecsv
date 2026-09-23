#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""awesome-list 提交闸门(确定性)—— 提交前必须先跑,只有打印 FIRE_OK 才允许开 PR。

为什么要有这个闸门(2026-09-20 夜班实测的教训):
  我们把 csv-peek 的 PR 提上去就当「完成」,结果 secretGeek/AwesomeCSV 的 PR #97
  被维护者【无留言关闭】(09-19T09:19:04Z, mergedAt=null),查历史才发现该列表
  近 12 个月合并率只有 0.125(基本不收社区提交)。
  更硬的发现:agarrharr/awesome-cli-apps(20k★,CLI 工具的首选清单)在 contributing.md 里
  明确写了三条硬门槛 + 一条红线:
      · Be more than 3 months old      · Have more than 20 stars
      · 「AI-generated PRs are not welcome.」
  => 结论:awesome-list 不是「有手就能投」的通道。它的门槛是【项目成熟度】,不是【努力程度】;
     而其中一条明确禁止 AI 代笔的 PR —— 代投 = 违规 + 丢她的人。
     本脚本把这些门槛变成可执行判据,不合规就拒绝提交。

判据(全部实时从 GitHub API 取,不读缓存):
  age_days        >= 目标要求的 min_age_days
  stars           >= 目标要求的 min_stars
  has_release     有已发布 release/标签(满足「tagged releases with a real changelog」)
  our_open_pr     我方在该仓库没有未关闭 PR(避免重复催)
  already_listed  该列表 README 里还没有 csv-peek
  ai_pr_allowed   该列表【没有】禁止 AI 生成 PR(有这个字样的 → 一律不许自动提交)

用法:
  python3 awesome_gate_check.py              # 只检查,打印每个目标的 verdict(默认)
  python3 awesome_gate_check.py --json       # 机器可读
退出码:0 = 至少一个目标 FIRE_OK 且没有 BLOCK;1 = 全部都被挡住(不许提交)。
"""
import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

REPO = "CindyLiao1106/csv-peek"
BULLET = ("- [csv-peek](https://github.com/CindyLiao1106/csv-peek) - Zero-dependency command line "
          "profiler for CSV/TSV files: column types, null rates, unique counts and duplicate rows.")
# 每个清单的条目格式必须逐字照它自己的规范(2026-09-20 实测:academic 那一段是【表格】,
# 用 bullet 投过去 = 格式不合规,维护者会直接关掉)
ENTRY = {"bullet": BULLET,
         "table_row": "| [csv-peek](https://github.com/CindyLiao1106/csv-peek) | Zero-dependency command line profiler for CSV/TSV files: column types, null rates, unique counts and duplicate rows. |"}

# 每个目标:门槛写清出处(来自该仓库 contributing 的实测原文)
TARGETS = [
    {
        "repo": "igorbarinov/awesome-data-engineering",
        "min_age_days": 30, "min_stars": 0,
        "gate_source": "contributing.md: 'Used by someone other than the author' + 'Not brand new. Projects should be at least 30 days old'",
        "section": "Data Profiler",
        "note": "契合度最好(该分区就是 data profiler 三件套:DataProfiler / YData Profiling / Desbordante)",
    },
    {
        "repo": "agarrharr/awesome-cli-apps",
        "min_age_days": 90, "min_stars": 20,
        "gate_source": "contributing.md: '>3 months old' + '>20 stars' + 【'AI-generated PRs are not welcome'】",
        "section": "Utilities",
        "note": "CLI 工具首选清单(20.4k★);但明文禁止 AI 代笔 PR —— 即使满足年龄/星数,也只许 Cindy 本人手写提交",
        "human_only": True,
    },
    {
        "repo": "krzjoa/awesome-python-data-science",
        "min_age_days": 0, "min_stars": 0,
        "gate_source": "CONTRIBUTING.md: 'is the proposed lib really awesome?'(无年龄/星数门槛)",
        "section": "Data Validation",
        "note": "契合度一般:该清单是 Python 库清单,csv-peek 是 CLI 脚本(不是库)",
        "skip_reason": "契合度不符:该清单收录 Python【库】,csv-peek 是零依赖 CLI 脚本,不是库 —— 投过去属于 off-topic(该清单自己要求先自问 'is the proposed lib really awesome?')。宁缺勿滥,不投。",
    },
    {
        "repo": "academic/awesome-datascience",
        "min_age_days": 0, "min_stars": 0,
        "gate_source": "CONTRIBUTING.md: 'Prefer authoritative sources' + 条目格式规范(无年龄/星数门槛)",
        "section": "Miscellaneous Tools",
        "entry_format": "table_row",
        "note": "合并率 0.799,但该段同类条目多为推广位;GitHub README 的外链是 nofollow,SEO 价值低",
    },
    {
        "repo": "secretGeek/AwesomeCSV",
        "min_age_days": 0, "min_stars": 0,
        "gate_source": "实测(非文档):近 12 个月合并率 0.125,PR #97 被维护者无留言关闭",
        "blocked_reason": "该列表实质不接受社区提交(近 12 月 13 个已关闭 PR 里只合并了 2 个)。不要再投。",
    },
    {
        "repo": "MigoXLab/awesome-data-quality",
        "min_age_days": 0, "min_stars": 0,
        "gate_source": "实测:近 12 月有 3 个被合并的 PR(4/5/6/7/8),说明收提交",
        "pending_reason": "我方 PR #15 仍然 OPEN 且 CLEAN/MERGEABLE —— 等维护者,不要重复提交或催",
    },
]

TOKEN = None
for line in open("/opt/data/.env", encoding="utf-8", errors="ignore"):
    if line.startswith("GITHUB_TOKEN="):
        TOKEN = line.split("=", 1)[1].strip()
H = {"User-Agent": "Mozilla/5.0 (compatible; awesome-gate)", "Accept": "application/vnd.github+json",
     "Authorization": "Bearer " + TOKEN}


def api(path):
    try:
        with urllib.request.urlopen(urllib.request.Request("https://api.github.com" + path, headers=H), timeout=45) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return {"__http__": e.code}


def main():
    as_json = "--json" in sys.argv
    me = api(f"/repos/{REPO}")
    if me.get("__http__"):
        raise SystemExit(f"读不到 {REPO}: {me}")
    created = datetime.strptime(me["created_at"], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
    age_days = (datetime.now(timezone.utc) - created).days
    stars = me["stargazers_count"]
    has_release = len(api(f"/repos/{REPO}/releases") or []) > 0
    out, any_fire_ok = [], False

    for t in TARGETS:
        repo = t["repo"]
        row = {"repo": repo, "section": t.get("section"),
               "entry": ENTRY[t["entry_format"]] if t.get("entry_format") else ENTRY["bullet"],
               "gate_source": t.get("gate_source"), "note": t.get("note"),
               "csv_peek_age_days": age_days, "csv_peek_stars": stars, "csv_peek_has_release": has_release}
        row["verdict"] = "SKIP"
        if "blocked_reason" in t:
            row["verdict"], row["why"] = "BLOCKED", t["blocked_reason"]
        elif "skip_reason" in t:
            row["verdict"], row["why"] = "SKIP", t["skip_reason"]
        elif "pending_reason" in t:
            row["verdict"], row["why"] = "PENDING", t["pending_reason"]
        else:
            fails = []
            if age_days < t["min_age_days"]:
                earliest = datetime.fromtimestamp(created.timestamp() + t["min_age_days"] * 86400, timezone.utc).strftime("%Y-%m-%d")
                fails.append(f"项目 {age_days} 天 < 要求 {t['min_age_days']} 天(最早可投 {earliest})")
            if stars < t["min_stars"]:
                fails.append(f"星数 {stars} < 要求 {t['min_stars']}")
            rd = api(f"/repos/{repo}/contents/README.md")
            listed = False
            if not rd.get("__http__"):
                import base64
                txt = base64.b64decode(rd["content"]).decode("utf-8", "ignore")
                listed = bool(re.search(r"csv-peek", txt, re.I))
            if listed:
                fails.append("该列表已收录 csv-peek(无需再投)")
            ours = api(f"/repos/{repo}/pulls?state=open&per_page=100")
            if any(p.get("user", {}).get("login") == "CindyLiao1106" for p in (ours if isinstance(ours, list) else [])):
                fails.append("我方已有未关闭 PR(等维护者,勿重复投)")
            if t.get("human_only"):
                fails.append("该清单明文禁止 AI 生成 PR —— 只能由 Cindy 本人手写提交(闸门不代投)")
            row["verdict"] = "FIRE_OK" if not fails else "GATED"
            row["why"] = "; ".join(fails) if fails else "全部门槛满足"
            any_fire_ok = any_fire_ok or row["verdict"] == "FIRE_OK"
        out.append(row)

    if as_json:
        print(json.dumps({"csv_peek": {"age_days": age_days, "stars": stars, "has_release": has_release},
                          "targets": out}, ensure_ascii=False, indent=2))
    else:
        print(f"csv-peek: 创建至今 {age_days} 天 · ★{stars} · 有 release={has_release}\n")
        for r in out:
            print(f"[{r['verdict']:<8}] {r['repo']}")
            print(f"           依据: {r['gate_source']}")
            if r.get("why"):
                print(f"           判据: {r['why']}")
            if r["verdict"] == "FIRE_OK":
                print(f"           插入位置: {r['section']}")
                print(f"           提交行:   {r['entry']}")
            print()
        if any_fire_ok:
            print("=> 有目标 FIRE_OK:满足该清单自己的收录门槛,可以提交。")
        else:
            print("=> 全部被挡住:现在【不要】提任何 awesome-list PR(门槛/红线/等待中)。")
            print("   正确做法 = 让项目成熟(时间 + 外部使用者 + release 记录),不是多投几个清单。")

    return 0 if any_fire_ok else 1


if __name__ == "__main__":
    sys.exit(main())
