#!/usr/bin/env python3
"""探针:核实 /ai-analytics-statistics 线上页是否真的含第 3 批(55 条)数字。

背景:cite_data/核实表_第3批.md 有 32 条已核实数据(2026-09-14 抓),
页面源码日期是 2026-09-14 23:25(晚于第 3 批)。本探针只回答一件事:
线上页面里到底有多少条已核实数字?哪些还没有?

判据:从核实表_第3批.md 里抽出所有粗体数值,去线上 HTML 里逐个查。
"""
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path("/opt/data/cad_work/nocodecsv_workspace")
BATCH3 = ROOT / "cite_data" / "核实表_第3批.md"
URL = "https://nocodecsv.com/ai-analytics-statistics"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (probe)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", "replace")


def numbers_from_batch3(text):
    """抽 **12.34%** / **1091亿美元** 这类粗体数值。"""
    out = []
    for m in re.finditer(r"\*\*([^*]+)\*\*", text):
        v = m.group(1).strip()
        if re.search(r"\d", v):
            out.append(v)
    return out


def main():
    b3 = BATCH3.read_text(encoding="utf-8")
    nums = numbers_from_batch3(b3)
    # 只取每条的首个数字片段做匹配(粗体里可能是一整句)
    probes = []
    for v in nums:
        for piece in re.findall(r"\d+(?:[.,]\d+)?%?", v):
            if len(piece) >= 3:
                probes.append(piece)
    probes = sorted(set(probes))

    status, html = fetch(URL)
    print(f"线上 {URL} -> HTTP {status} / {len(html)} 字节")

    hit, miss = [], []
    for p in probes:
        (hit if p in html else miss).append(p)

    print(f"\n第 3 批核实数字共 {len(probes)} 个待查")
    print(f"  线上命中 {len(hit)} 个")
    print(f"  线上缺失 {len(miss)} 个")
    if miss:
        print("\n缺失明细:")
        for p in miss:
            print(f"  - {p}")

    # 页面自报的条数
    m = re.search(r"(\d+)\s*(?:Verified Data Points|verified data points)", html)
    print(f"\n页面标题自报条数: {m.group(1) if m else '未找到'}")
    print("\n结论判据:命中率高 = 第 3 批数据已在线上(无需再写页面)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
