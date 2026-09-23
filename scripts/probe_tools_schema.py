#!/usr/bin/env python3
"""probe_tools_schema.py — 线上 dump 每个 WebMCP 工具的名字 + inputSchema

区分「声明式(表单加 toolname)」与「命令式(registerTool)」两种工具在 agent 眼里
的区别,重点是输入参数是否为空。

用法: /opt/data/cadenv/bin/python scripts/probe_tools_schema.py
注意: getTools() 返回 Promise,必须 await(2026-09-19 踩坑:同步调用拿到空结果)。
"""
import json
import os

os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/data/.playwright-browsers")
from playwright.sync_api import sync_playwright  # noqa: E402

PAGES = [
    "https://nocodecsv.com/tools/csv-splitter",
    "https://nocodecsv.com/tools/csv-delimiter-converter",
    "https://nocodecsv.com/tools/json-csv-converter",
    "https://nocodecsv.com/tools/csv-analyzer",
    "https://nocodecsv.com/agent-ready",
]

BLOCK = ("doubleclick.net", "googleads", "googlesyndication", "google-analytics",
         "vercel-insights", "clerk", "adtrafficquality")

DUMP = """async () => {
  const mc = (document.modelContext ?? navigator.modelContext);
  if (!mc || !mc.getTools) return { supported: false };
  const tools = await mc.getTools();
  const forms = Array.from(document.querySelectorAll('form[toolname]'))
    .map(f => f.getAttribute('toolname'));
  return {
    supported: true,
    declarativeForms: forms,
    tools: tools.map(t => {
      let s = t.inputSchema;
      if (typeof s === 'string') { try { s = JSON.parse(s); } catch (e) {} }
      const props = (s && s.properties) ? Object.keys(s.properties) : [];
      const req = (s && s.required) ? s.required : [];
      return { name: t.name, params: props, required: req,
               schemaType: typeof t.inputSchema,
               desc: (t.description || '').slice(0, 90) };
    }),
  };
}"""


def main():
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True, args=["--no-sandbox", "--enable-features=WebMCPTesting"])
        ctx = b.new_context()
        pg = ctx.new_page()
        pg.route("**/*", lambda r: r.abort() if any(h in r.request.url for h in BLOCK) else r.continue_())
        for url in PAGES:
            print(f"\n### {url}")
            try:
                pg.goto(url, wait_until="load", timeout=90000)
                pg.wait_for_timeout(3500)
                r = pg.evaluate(DUMP)
            except Exception as e:
                print("  ERR", str(e)[:160]); continue
            if not r.get("supported"):
                print("  navigator.modelContext 不存在"); continue
            print("  表单声明(HTML 里的 form[toolname]):", r.get("declarativeForms"))
            for t in r.get("tools") or []:
                print(f"  · {t['name']:22s} params={t['params']} required={t['required']} schemaType={t['schemaType']}")
                print(f"    desc: {t['desc']}")
        b.close()


if __name__ == "__main__":
    main()
