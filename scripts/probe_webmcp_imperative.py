#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""线上实测:命令式 WebMCP 工具能被 agent 发现并【真的执行】

为什么只能在线测:WebMCP 只在拿到 Origin-Trial 令牌的 origin 上启用
(nocodecsv.com 已下发),本地 localhost 测不出来。

检查(每条都断言,失败即退出码 1)
  1. getTools() 里能找到 splitCsvText / convertJsonCsvText,且 inputSchema 参数非空
     (这正是声明式 API 做不到的那一点 —— 之前的 schema 是空 properties)
  2. executeTool 真调用:传 CSV 文本 → 拆分结果与 Python 独立算出的期望值逐行一致
  3. executeTool 真调用:传 JSON 文本 → 转换结果与独立期望一致
  4. 反向测试:传空文本 → 必须返回 ok=false(证明工具真在跑,不是返回罐头文案)

用法: /opt/data/cadenv/bin/python scripts/probe_webmcp_imperative.py
"""
import csv
import argparse
import io
import json
import os
import sys

os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/data/.playwright-browsers")
from playwright.sync_api import sync_playwright  # noqa: E402

SPLIT_URL = "https://nocodecsv.com/tools/csv-splitter"
CONV_URL = "https://nocodecsv.com/tools/json-csv-converter"
# --base 可覆盖:本地跑必然失败(令牌绑定 https://nocodecsv.com:443,localhost 不启用 WebMCP)
# —— 那次失败本身是"检测不是空转"的证明。

SPLIT_CSV = "name,amount\nalpha,1\nbeta,2\ngamma,3\ndelta,4\necho,5\n"
SPLIT_ROWS_PER_FILE = 2

SPLIT_JSON = '[{"name":"alpha","meta":{"score":1}},{"name":"beta","meta":{"score":2}}]'

# 第三方脚本(广告/分析/鉴权)与本测试无关:挡掉可避免 headless 崩溃与 CSP 噪音,
# 也让"页面能不能被 agent 用"这件事不被广告脚本干扰。
BLOCK_HOSTS = (
    "doubleclick.net",
    "googleads",
    "googlesyndication",
    "adtrafficquality",
    "google-analytics",
    "vercel-insights",
    "clerk",
    "clerk.accounts.dev",
)


def block_third_party(page) -> None:
    def handler(route):
        url = route.request.url
        if any(h in url for h in BLOCK_HOSTS):
            route.abort()
        else:
            route.continue_()

    page.route("**/*", handler)


GET_TOOLS = """async (name) => {
  const mc = (document.modelContext ?? navigator.modelContext);
  if (!mc || !mc.getTools) return { err: 'WebMCP not available on this page' };
  const tools = await mc.getTools();
  const t = tools.find(x => x.name === name);
  return {
    allNames: tools.map(x => x.name),
    found: !!t,
    inputSchema: t ? t.inputSchema : null,
    description: t ? (t.description || '').slice(0, 200) : null,
    annotations: t ? t.annotations : null,
  };
}"""

EXEC = """async ({ name, args }) => {
  const mc = (document.modelContext ?? navigator.modelContext);
  if (!mc || !mc.executeTool) return { err: 'executeTool unavailable' };
  const tools = await mc.getTools();
  const tool = tools.find(x => x.name === name);
  if (!tool) return { err: 'tool not found: ' + name };
  const attempts = [
    () => mc.executeTool(tool, args),
    () => mc.executeTool({ name: name }, args),
    () => mc.executeTool(name, args),
  ];
  let lastErr = null;
  for (let i = 0; i < attempts.length; i++) {
    try {
      const r = await attempts[i]();
      return { via: i + 1, result: typeof r === 'string' ? r : JSON.stringify(r) };
    } catch (e) { lastErr = String(e); }
  }
  return { err: 'all executeTool signatures failed: ' + lastErr };
}"""


def expected_split(csv_text: str, rows_per_file: int):
    """用 Python 自己算一遍期望结果(独立于站点实现)"""
    rows = list(csv.reader(io.StringIO(csv_text.strip())))
    header, data = rows[0], rows[1:]
    parts = []
    for i in range(0, len(data), rows_per_file):
        chunk = data[i : i + rows_per_file]
        buf = io.StringIO()
        w = csv.writer(buf, lineterminator="\n")
        w.writerow(header)
        w.writerows(chunk)
        parts.append((chunk, buf.getvalue().strip()))
    return header, data, parts


def main() -> int:
    global SPLIT_URL, CONV_URL
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="https://nocodecsv.com")
    args = ap.parse_args()
    base = args.base.rstrip("/")
    SPLIT_URL = f"{base}/tools/csv-splitter"
    CONV_URL = f"{base}/tools/json-csv-converter"

    failures = []
    header, data, parts = expected_split(SPLIT_CSV, SPLIT_ROWS_PER_FILE)
    print("=== 独立期望(Python) ===")
    print(f"表头 {header};数据行 {len(data)};rowsPerFile={SPLIT_ROWS_PER_FILE} → 期望 {len(parts)} 个文件")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_context().new_page()
        block_third_party(page)
        console_errors = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)

        # ---------- 1. 发现工具 ----------
        print("\n=== 1. getTools() 发现命令式工具 ===")
        for url, tool_name in ((SPLIT_URL, "splitCsvText"), (CONV_URL, "convertJsonCsvText")):
            page.goto(url, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(3000)
            info = page.evaluate(GET_TOOLS, tool_name)
            print(f"  {url.split('//')[-1]} → {json.dumps(info, ensure_ascii=False)[:400]}")
            if info.get("err"):
                failures.append(f"{tool_name}: {info['err']}")
                continue
            if not info.get("found"):
                failures.append(f"{tool_name}: 没被注册(页面上的工具:{info.get('allNames')})")
                continue
            props = ((info.get("inputSchema") or {}).get("properties") or {})
            if not props:
                failures.append(f"{tool_name}: inputSchema.properties 为空(等于声明式 API 的老问题)")
            else:
                print(f"    ✅ 参数非空: {list(props.keys())}")

        # ---------- 2. 真调用:拆 CSV ----------
        print("\n=== 2. executeTool 实调 splitCsvText ===")
        page.goto(SPLIT_URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2500)
        out = page.evaluate(EXEC, {"name": "splitCsvText", "args": {"csvText": SPLIT_CSV, "rowsPerFile": SPLIT_ROWS_PER_FILE}})
        if out.get("err"):
            failures.append(f"splitCsvText 调用失败: {out['err']}")
            print("  ❌", out["err"])
        else:
            print(f"  调用方式 #{out['via']}")
            payload = json.loads(out["result"])
            print(f"  ok={payload.get('ok')} fileCount={payload.get('fileCount')} "
                  f"delimiter={payload.get('delimiter')!r} totalDataRows={payload.get('totalDataRows')}")
            if not payload.get("ok"):
                failures.append(f"splitCsvText 返回 ok=false: {payload.get('error')}")
            else:
                if payload.get("fileCount") != len(parts):
                    failures.append(f"splitCsvText 文件数 {payload.get('fileCount')} ≠ 期望 {len(parts)}")
                got = payload.get("files") or []
                for idx, (chunk, expected_csv) in enumerate(parts):
                    if idx >= len(got):
                        failures.append(f"splitCsvText 缺少第 {idx + 1} 个文件")
                        continue
                    actual = (got[idx].get("csv") or "").strip()
                    if actual != expected_csv:
                        failures.append(
                            f"splitCsvText 第 {idx + 1} 个文件内容不符\n     实际: {actual!r}\n     期望: {expected_csv!r}"
                        )
                    elif got[idx].get("rows") != len(chunk):
                        failures.append(f"splitCsvText 第 {idx + 1} 个文件 rows 字段={got[idx].get('rows')} ≠ {len(chunk)}")
                if all((f.get("csv") or "").startswith("name,amount") for f in got):
                    print("  ✅ 每个文件都带表头,且内容与独立期望逐行一致")
                else:
                    failures.append("splitCsvText: 不是每个文件都重复了表头")

        # ---------- 3. 真调用:JSON→CSV ----------
        print("\n=== 3. executeTool 实调 convertJsonCsvText ===")
        page.goto(CONV_URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2500)
        out = page.evaluate(EXEC, {"name": "convertJsonCsvText", "args": {"text": SPLIT_JSON, "direction": "json2csv"}})
        if out.get("err"):
            failures.append(f"convertJsonCsvText 调用失败: {out['err']}")
            print("  ❌", out["err"])
        else:
            payload = json.loads(out["result"])
            print(f"  ok={payload.get('ok')} rows={payload.get('rows')} columns={payload.get('columns')} "
                  f"columnNames={payload.get('columnNames')}")
            if not payload.get("ok"):
                failures.append(f"convertJsonCsvText 返回 ok=false: {payload.get('error')}")
            else:
                expected_csv = "name,meta.score\nalpha,1\nbeta,2"
                actual = (payload.get("output") or "").strip()
                if actual != expected_csv:
                    failures.append(
                        f"convertJsonCsvText 输出不符\n     实际: {actual!r}\n     期望: {expected_csv!r}"
                    )
                else:
                    print("  ✅ 嵌套对象已扁平化为 meta.score,输出与独立期望一致")

        # ---------- 4. 反向测试:空输入 ----------
        print("\n=== 4. 反向测试(空 csvText 必须报错,证明工具真在跑)===")
        page.goto(SPLIT_URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2500)
        out = page.evaluate(EXEC, {"name": "splitCsvText", "args": {"csvText": "", "rowsPerFile": 2}})
        if out.get("err"):
            failures.append(f"splitCsvText 空输入调用异常: {out['err']}")
        else:
            payload = json.loads(out["result"])
            if payload.get("ok") is False and payload.get("error"):
                print(f"  ✅ 空输入被拒: {payload['error']}")
            else:
                failures.append(f"splitCsvText 空输入没有报错(可能是罐头响应): {payload}")

        if console_errors:
            print("\nℹ 页面 console error:")
            for e in console_errors[:10]:
                print("   -", e[:160])
        browser.close()

    print("\n" + "=" * 60)
    if failures:
        print("❌ FAIL:")
        for f in failures:
            print("   -", f)
        return 1
    print("✅ PASS:两个命令式工具在线上可被发现、可被实际调用,输出与独立期望一致")
    return 0


if __name__ == "__main__":
    sys.exit(main())
