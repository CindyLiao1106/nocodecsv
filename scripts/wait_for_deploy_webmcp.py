#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""等线上真的变成新版 —— 判据是【产物里的新字符串】,不是"我推了"

坑(已踩过):平台显示 Ready ≠ 自定义域名已生效;只看 commit 或部署状态会误报。
所以这里轮询线上 HTML 与其引用的 chunk,直到出现本次新增的工具名。

用法: /opt/data/cadenv/bin/python scripts/wait_for_deploy_webmcp.py [--url https://nocodecsv.com/tools/csv-splitter] [--timeout 900]
退出码:0 = 新版已上线;1 = 超时仍未上线(如实报告,不猜)。
"""
import argparse
import re
import sys
import time
import urllib.request

NEEDLE = "splitCsvText"


def fetch(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "nocodecsv-deploy-check/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "ignore")


def check(url: str) -> tuple[bool, str]:
    try:
        html = fetch(url)
    except Exception as e:
        return False, f"页面取不到: {type(e).__name__} {e}"
    if NEEDLE in html:
        return True, "页面 HTML 里直接含工具名"
    # Next 把组件放进客户端 chunk —— 顺着 <script src> 找
    srcs = re.findall(r'<script[^>]+src="([^"]+\.js[^"]*)"', html)
    for src in srcs[:40]:
        full = src if src.startswith("http") else url.split("/tools/")[0] + ("" if src.startswith("/") else "/") + src
        try:
            body = fetch(full)
        except Exception:
            continue
        if NEEDLE in body:
            return True, f"命中客户端 chunk: {full.split('/')[-1][:40]}"
    return False, f"已取页面与 {len(srcs)} 个 chunk,均未见 {NEEDLE}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="https://nocodecsv.com/tools/csv-splitter")
    ap.add_argument("--timeout", type=int, default=900)
    ap.add_argument("--interval", type=int, default=30)
    args = ap.parse_args()

    start = time.time()
    attempt = 0
    while time.time() - start < args.timeout:
        attempt += 1
        ok, why = check(args.url)
        elapsed = int(time.time() - start)
        print(f"[{elapsed:>4}s] 第 {attempt} 次: {'✅ 已上线' if ok else '… 等构建'} — {why}", flush=True)
        if ok:
            print(f"\n✅ 新版已上线(用时 {elapsed}s):{why}")
            return 0
        time.sleep(args.interval)

    print(f"\n❌ 超时 {args.timeout}s 仍未在线上看到 {NEEDLE} —— 如实报告:未验证到上线")
    return 1


if __name__ == "__main__":
    sys.exit(main())
