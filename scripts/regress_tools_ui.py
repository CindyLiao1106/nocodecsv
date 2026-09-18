#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""回归测试:两个工具页的【人工操作路径】在改动后仍然正常

为什么需要:本次把拆分算法从组件里抽到了 @/lib/csv-split-core(让 WebMCP 工具与页面按钮共用),
嵌入组件本身是风险点。这个脚本真点按钮、真读下载内容,证明"重构没有改坏 UI"。

用法:
  # 先起本地生产服务: npx next start -p 4311
  /opt/data/cadenv/bin/python scripts/regress_tools_ui.py [--base http://127.0.0.1:4311]

退出码:0 = 全通过;1 = 有失败。
"""
import argparse
import csv
import io
import os
import sys
import tempfile

os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/data/.playwright-browsers")
from playwright.sync_api import sync_playwright  # noqa: E402

CSV_TEXT = "name,amount\nalpha,1\nbeta,2\ngamma,3\ndelta,4\necho,5\n"
JSON_TEXT = '[{"name":"alpha","meta":{"score":1}},{"name":"beta","meta":{"score":2}}]'

# 第三方脚本(广告/分析/鉴权)与本回归无关,且在 headless 下会让页面崩溃
# (实测:线上跑到第二个工具页时 Page crashed)。挡掉才能稳定复跑。
BLOCK_HOSTS = (
    "doubleclick.net",
    "googleads",
    "googlesyndication",
    "adtrafficquality",
    "google-analytics",
    "vercel-insights",
    "clerk",
)


def block_third_party(page) -> None:
    page.route(
        "**/*",
        lambda route: route.abort()
        if any(h in route.request.url for h in BLOCK_HOSTS)
        else route.continue_(),
    )


def expected_parts(csv_text: str, rows_per_file: int):
    rows = list(csv.reader(io.StringIO(csv_text.strip())))
    header, data = rows[0], rows[1:]
    parts = []
    for i in range(0, len(data), rows_per_file):
        chunk = data[i : i + rows_per_file]
        buf = io.StringIO()
        w = csv.writer(buf, lineterminator="\n")
        w.writerow(header)
        w.writerows(chunk)
        # Papa.unparse 用 RFC 4180 的 \r\n;比较时统一换行符,避免把编码差异判成功能回归
        parts.append(buf.getvalue().strip().replace("\n", "\r\n"))
    return header, data, parts


def wait_for_text(page, needle: str, timeout_ms: int = 20000) -> bool:
    """等页面出现某段文字(比固定 sleep 稳:CDN 慢的线上尤其需要)"""
    deadline = timeout_ms
    step = 250
    while deadline > 0:
        try:
            if needle in page.inner_text("body"):
                return True
        except Exception:
            pass
        page.wait_for_timeout(step)
        deadline -= step
    return False


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:4311")
    args = ap.parse_args()
    base = args.base.rstrip("/")

    failures: list[str] = []
    header, data, parts = expected_parts(CSV_TEXT, 2)

    with tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False, encoding="utf-8") as fh:
        fh.write(CSV_TEXT)
        csv_path = fh.name

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        ctx = browser.new_context()
        page = ctx.new_page()
        block_third_party(page)
        console_errors: list[str] = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        bad_responses: list[str] = []
        page.on(
            "response",
            lambda r: bad_responses.append(f"{r.status} {r.url[:110]}") if r.status >= 400 else None,
        )

        # ---------- 1. CSV 拆分页 ----------
        print("=== 1. /tools/csv-splitter(上传 → 拆分 → 读回下载内容)===")
        page.goto(f"{base}/tools/csv-splitter", wait_until="domcontentloaded", timeout=60000)
        wait_for_text(page, "Drop your file here", 20000)  # 等 React 水合完成,避免事件还没挂上
        page.set_input_files("#toolFileInput", csv_path)
        if not wait_for_text(page, f"{len(data)} data rows", 20000):
            failures.append("拆分页上传后没有渲染出数据行数(是否解析失败?)")

        body = page.inner_text("body")
        if f"{len(data)} data rows" not in body:
            failures.append(f"拆分页没有显示 '{len(data)} data rows'(解析失败?)")
        else:
            print(f"  ✅ 解析出 {len(data)} 行数据")

        # 设置每文件 2 行
        rows_input = page.locator('input[type="number"]').first
        try:
            rows_input.fill("2", timeout=15000)
            page.wait_for_timeout(300)
        except Exception:
            failures.append("找不到『Rows per file』数字输入框")

        btn = page.get_by_role("button", name="Split & Download")
        if btn.count() == 0:
            failures.append("拆分页找不到 'Split & Download' 按钮")
        else:
            btn.first.click()
            page.wait_for_timeout(2500)
            links = page.locator('table a[download]')
            n = links.count()
            print(f"  生成文件数:{n}(期望 {len(parts)})")
            if n != len(parts):
                failures.append(f"生成 {n} 个文件,期望 {len(parts)} 个")
            content_ok = n == len(parts)
            for i in range(min(n, len(parts))):
                href = links.nth(i).get_attribute("href")
                text = page.evaluate("async (u) => await (await fetch(u)).text()", href).strip()
                if text != parts[i]:
                    content_ok = False
                    failures.append(
                        f"第 {i + 1} 个文件内容不符\n     实际: {text!r}\n     期望: {parts[i]!r}"
                    )
            if content_ok:
                print("  ✅ 每个文件都带表头,内容与独立期望逐行一致")

        # ---------- 2. JSON ⇄ CSV 页 ----------
        print("\n=== 2. /tools/json-csv-converter(粘贴 JSON → 转换)===")
        page.goto(f"{base}/tools/json-csv-converter", wait_until="domcontentloaded", timeout=60000)
        try:
            page.fill("#toolTextInput", JSON_TEXT, timeout=15000)
        except Exception:
            failures.append("找不到 #toolTextInput(旧版本页面或控件缺失)")
        page.wait_for_timeout(300)
        conv = page.get_by_role("button", name="Convert to CSV")
        if conv.count() == 0:
            failures.append("转换页找不到 'Convert to CSV' 按钮")
        else:
            conv.first.click()
            page.wait_for_timeout(2500)
            body = page.inner_text("body")
            missing = [x for x in ("meta.score", "alpha", "beta", "2 rows") if x not in body]
            for needle in missing:
                failures.append(f"转换结果里缺少 {needle!r}")
            if not missing:
                print("  ✅ 嵌套对象扁平化为 meta.score,预览表 2 行可见")

        # ---------- 3. 关键控件仍在(agent 可定位) ----------
        print("\n=== 3. 关键控件仍在 DOM ===")
        for url, sel in (
            ("/tools/csv-splitter", "#toolFileInput"),
            ("/tools/json-csv-converter", "#toolFileInput"),
            ("/tools/json-csv-converter", "#toolTextInput"),
            ("/tools/csv-splitter", "form[toolname]"),
        ):
            page.goto(f"{base}{url}", wait_until="domcontentloaded", timeout=60000)
            if page.locator(sel).count() == 0:
                failures.append(f"{url} 缺少 {sel}")
            else:
                print(f"  ✅ {url} → {sel}")

        if console_errors:
            print("\nℹ console error:")
            for e in console_errors[:10]:
                print("   -", e[:160])
        if bad_responses:
            print("\nℹ HTTP >= 400 的响应:")
            for r in sorted(set(bad_responses))[:15]:
                print("   -", r)
        browser.close()

    print("\n" + "=" * 60)
    if failures:
        print("❌ FAIL:")
        for f in failures:
            print("   -", f)
        return 1
    print("✅ PASS:两个工具页的人工路径无回归(上传/拆分/下载内容、粘贴/转换/预览)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
