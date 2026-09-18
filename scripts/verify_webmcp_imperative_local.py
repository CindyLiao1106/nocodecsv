#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""本地验证:命令式工具「注册出来的东西」和「被调用后返回的东西」是否正确

为什么要这一层:
  WebMCP 只在拿到源试验令牌的 origin(nocodecsv.com)上启用,本地 localhost 测不出来;
  但我们可以**假装**浏览器支持 —— 用 addInitScript 在页面脚本之前塞一个
  navigator.modelContext 桩,把 registerTool 的入参抓下来,然后在页面里直接调 execute。
  → 这样在本地就能验证:工具名 / inputSchema / annotations / 注销 signal / 真实输出。
  (线上那一步仍然要做,它证明的是"真 Chrome 也认",两件事不能互相替代。)

用法:
  npx next start -p 4311
  /opt/data/cadenv/bin/python scripts/verify_webmcp_imperative_local.py [--base http://127.0.0.1:4311]

退出码:0 = 全通过。
"""
import argparse
import csv
import io
import json
import os
import sys

os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/data/.playwright-browsers")
from playwright.sync_api import sync_playwright  # noqa: E402

CSV_TEXT = "name,amount\nalpha,1\nbeta,2\ngamma,3\ndelta,4\necho,5\n"
JSON_TEXT = '[{"name":"alpha","meta":{"score":1}},{"name":"beta","meta":{"score":2}}]'

STUB = """
window.__registered = [];
window.__execs = [];
Object.defineProperty(navigator, 'modelContext', {
  configurable: true,
  value: {
    registerTool: function (tool, options) {
      window.__execs.push(tool.execute);
      window.__registered.push({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
        hasExecute: typeof tool.execute === 'function',
        signalIsAbort: !!(options && options.signal && typeof options.signal.aborted === 'boolean'),
      });
      return Promise.resolve();
    },
  },
});
"""

READ_TOOLS = "() => window.__registered || []"



def expected_split(csv_text: str, rows_per_file: int):
    rows = list(csv.reader(io.StringIO(csv_text.strip())))
    header, data = rows[0], rows[1:]
    parts = []
    for i in range(0, len(data), rows_per_file):
        chunk = data[i : i + rows_per_file]
        buf = io.StringIO()
        w = csv.writer(buf, lineterminator="\n")
        w.writerow(header)
        w.writerows(chunk)
        parts.append(buf.getvalue().strip().replace("\n", "\r\n"))
    return header, data, parts


def wait_for_text(page, needle: str, timeout_ms: int = 20000) -> bool:
    remaining = timeout_ms
    while remaining > 0:
        try:
            if needle in page.inner_text("body"):
                return True
        except Exception:
            pass
        page.wait_for_timeout(250)
        remaining -= 250
    return False


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:4311")
    args = ap.parse_args()
    base = args.base.rstrip("/")

    failures: list[str] = []
    header, data, parts = expected_split(CSV_TEXT, 2)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        ctx = browser.new_context()
        ctx.add_init_script(STUB)
        page = ctx.new_page()

        # ---------- 1. CSV 拆分页 ----------
        print("=== 1. /tools/csv-splitter 注册的 splitCsvText ===")
        page.goto(f"{base}/tools/csv-splitter", wait_until="domcontentloaded", timeout=60000)
        wait_for_text(page, "Drop your file here")
        page.wait_for_timeout(1500)
        regs = page.evaluate(READ_TOOLS)
        print(f"  注册到的工具:{[r['name'] for r in regs]}")
        if not regs:
            failures.append("页面没有调用 registerTool(桩没被命中)")
        else:
            r = regs[0]
            if r["name"] != "splitCsvText":
                failures.append(f"工具名是 {r['name']},期望 splitCsvText")
            if not r["hasExecute"]:
                failures.append("工具没有 execute 函数")
            if not r["signalIsAbort"]:
                failures.append("registerTool 没有传注销用 AbortSignal")
            props = list(((r.get("inputSchema") or {}).get("properties") or {}).keys())
            if props != ["csvText", "rowsPerFile"]:
                failures.append(f"inputSchema 参数是 {props},期望 ['csvText','rowsPerFile']")
            required = (r.get("inputSchema") or {}).get("required")
            if required != ["csvText"]:
                failures.append(f"required 是 {required},期望 ['csvText']")
            ann = r.get("annotations") or {}
            if ann.get("readOnlyHint") is not True:
                failures.append("annotations.readOnlyHint 应为 true(该工具不改站点状态)")
            if len(r.get("description") or "") < 40:
                failures.append("description 太短,agent 难以判断何时调用")
            if not failures:
                print(f"  ✅ schema={props} required={required} annotations={ann}")

            # 真调 execute
            out = page.evaluate(
                """async ({ csvText, rowsPerFile }) => {
                    const fn = window.__execs && window.__execs[0];
                    if (!fn) return { err: 'execute not captured' };
                    // 官方调用约定:execute(argsObject) —— 参数是一个对象,不是位置参数
                    return { result: await fn({ csvText, rowsPerFile }) };
                }""",
                {"csvText": CSV_TEXT, "rowsPerFile": 2},
            )
            if out.get("err"):
                failures.append(f"取 execute 失败:{out['err']}")
            else:
                payload = json.loads(out["result"])
                if not payload.get("ok"):
                    failures.append(f"execute 返回 ok=false: {payload.get('error')}")
                else:
                    if payload.get("fileCount") != len(parts):
                        failures.append(f"fileCount={payload.get('fileCount')} ≠ 期望 {len(parts)}")
                    got = payload.get("files") or []
                    for i, exp in enumerate(parts):
                        actual = (got[i].get("csv") or "").strip() if i < len(got) else ""
                        if actual != exp:
                            failures.append(
                                f"第 {i + 1} 个文件内容不符\n     实际: {actual!r}\n     期望: {exp!r}"
                            )
                    if not failures:
                        print(f"  ✅ execute 实调通过:{payload.get('fileCount')} 个文件、表头重复、内容与独立期望一致")

            # 负向:空输入
            out = page.evaluate(
                """async () => {
                    const fn = window.__execs && window.__execs[0];
                    return { result: await fn({ csvText: '', rowsPerFile: 2 }) };
                }""",
            )
            payload = json.loads(out["result"])
            if payload.get("ok") is False and payload.get("error"):
                print(f"  ✅ 负向:空输入被拒 → {payload['error']}")
            else:
                failures.append(f"空输入没有报错(疑似罐头响应):{payload}")

        # ---------- 2. JSON ⇄ CSV 页 ----------
        print("\n=== 2. /tools/json-csv-converter 注册的 convertJsonCsvText ===")
        page.goto(f"{base}/tools/json-csv-converter", wait_until="domcontentloaded", timeout=60000)
        wait_for_text(page, "Paste JSON here")
        page.wait_for_timeout(1500)
        regs = page.evaluate(READ_TOOLS)
        print(f"  注册到的工具:{[r['name'] for r in regs]}")
        if not regs:
            failures.append("转换页没有调用 registerTool")
        else:
            r = regs[0]
            if r["name"] != "convertJsonCsvText":
                failures.append(f"工具名是 {r['name']},期望 convertJsonCsvText")
            props = list(((r.get("inputSchema") or {}).get("properties") or {}).keys())
            if set(props) != {"text", "direction"}:
                failures.append(f"inputSchema 参数是 {props},期望 text + direction")
            direction_enum = (
                ((r.get("inputSchema") or {}).get("properties") or {}).get("direction") or {}
            ).get("enum")
            if direction_enum != ["json2csv", "csv2json"]:
                failures.append(f"direction enum 是 {direction_enum},期望 ['json2csv','csv2json']")
            out = page.evaluate(
                """async ({ text, direction }) => {
                    const fn = window.__execs && window.__execs[0];
                    if (!fn) return { err: 'execute not captured' };
                    return { result: await fn({ text, direction }) };
                }""",
                {"text": JSON_TEXT, "direction": "json2csv"},
            )
            if out.get("err"):
                failures.append(f"取 execute 失败:{out['err']}")
            else:
                payload = json.loads(out["result"])
                expected_csv = "name,meta.score\r\nalpha,1\r\nbeta,2"
                if not payload.get("ok"):
                    failures.append(f"convertJsonCsvText 返回 ok=false: {payload.get('error')}")
                elif (payload.get("output") or "").strip() != expected_csv:
                    failures.append(
                        f"转换输出不符\n     实际: {(payload.get('output') or '')!r}\n     期望: {expected_csv!r}"
                    )
                else:
                    print("  ✅ execute 实调通过:嵌套对象扁平化为 meta.score,输出与独立期望一致")
            if not failures:
                print(f"  ✅ schema={props} enum={direction_enum}")

        browser.close()

    print("\n" + "=" * 60)
    if failures:
        print("❌ FAIL:")
        for f in failures:
            print("   -", f)
        return 1
    print("✅ PASS:两个命令式工具的注册内容(schema/annotations/注销 signal)与真实输出都已验证")
    return 0


if __name__ == "__main__":
    sys.exit(main())
