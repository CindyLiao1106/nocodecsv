#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""闸门(构建产物级):命令式 WebMCP 工具真的被打进产物了吗?

判据为什么放在【产物】上而不是源码上:
  源码里写了 ≠ 上线了(可能没被引用/被 tree-shake/构建报错中途退出)。
  本脚本只读 .next 构建产物,不看 src。

检查项
  1. 客户端 chunk 里存在两个工具名的注册调用(registerTool)
  2. inputSchema 的参数名真的进了产物(csvText / rowsPerFile / direction)
  3. 两个工具页的预渲染 HTML 仍在:form[toolname] / input#toolFileInput / 关键 UI 文案
  4. 反向测试:对副本注入已知坏例(抹掉一个工具名)→ 必须退出码 1

用法
  python3 scripts/verify_webmcp_imperative_built.py            # 校验 .next
  python3 scripts/verify_webmcp_imperative_built.py --root /tmp/next   # 指定产物目录

退出码:0 = 全部通过;1 = 有失败项。
"""
import argparse
import re
import shutil
import sys
import tempfile
from pathlib import Path

TOOL_NAMES = ["splitCsvText", "convertJsonCsvText"]
SCHEMA_KEYS = ["csvText", "rowsPerFile", "direction"]

PAGES = {
    "/tools/csv-splitter": {
        "html": "tools/csv-splitter.html",
        "must_have": [
            'toolname="splitLargeCsv"',        # 声明式工具仍在(渐进增强不回归)
            'id="toolFileInput"',
            "Split &amp; Download",
        ],
    },
    "/tools/json-csv-converter": {
        "html": "tools/json-csv-converter.html",
        "must_have": [
            'id="toolFileInput"',
            'id="toolTextInput"',
        ],
    },
}


def find_html(root: Path, rel: str) -> Path | None:
    for base in ("server/app", "server/pages"):
        p = root / base / rel
        if p.exists():
            return p
    return None


def js_corpus(root: Path) -> str:
    """把所有客户端 chunk 拼起来(压缩过的单行文件,用 count 判断出现次数)"""
    chunks = sorted((root / "static").rglob("*.js"))
    return "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in chunks)


def check(root: Path) -> list[str]:
    problems: list[str] = []

    if not (root / "static").exists():
        return [f"{root}/static 不存在 —— 看起来不是 next build 的产物目录"]

    corpus = js_corpus(root)
    if not corpus.strip():
        problems.append("客户端 chunk 为空 —— 无法判断工具是否打进去")

    for name in TOOL_NAMES:
        # 注册调用形如 registerTool({name:"splitCsvText" 或压缩后 name:"splitCsvText"
        pattern = re.compile(r'(?:registerTool\(|name:\s*")[^"]*' + re.escape(name))
        hits = len(pattern.findall(corpus))
        if hits == 0:
            problems.append(f"chunk 里找不到工具名 {name} 的注册调用")
        else:
            print(f"  ✅ {name}: 产物中出现 {hits} 次")

    for key in SCHEMA_KEYS:
        n = corpus.count(f'"{key}"')
        n2 = corpus.count(f"{key}:")
        if n + n2 == 0:
            problems.append(f"inputSchema 参数名 {key} 没进产物")
        else:
            print(f"  ✅ 参数 {key}: 出现 {n + n2} 次")

    reg = corpus.count("registerTool")
    print(f"  ℹ registerTool 出现 {reg} 次")
    if reg == 0:
        problems.append("产物里没有 registerTool 调用")

    for route, spec in PAGES.items():
        p = find_html(root, spec["html"])
        if p is None:
            problems.append(f"{route}: 预渲染 HTML 不存在({spec['html']})")
            continue
        html = p.read_text(encoding="utf-8", errors="ignore")
        for needle in spec["must_have"]:
            if needle not in html:
                problems.append(f"{route}: HTML 里缺少 {needle!r}")
        if not problems:
            print(f"  ✅ {route}: HTML 关键元素齐({len(spec['must_have'])} 项)")

    return problems


def payload_size(root: Path) -> str:
    total = sum(p.stat().st_size for p in (root / "static").rglob("*.js"))
    return f"{total / 1024:.0f} KB"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".next", help="next build 产物目录(默认 .next)")
    args = ap.parse_args()
    root = Path(args.root).resolve()

    print(f"== 构建产物闸门:命令式 WebMCP 工具 ==\n产物目录: {root}(客户端 JS {payload_size(root) if (root / 'static').exists() else '?'})")

    problems = check(root)
    if problems:
        print("\n❌ FAIL:")
        for x in problems:
            print("   -", x)
        return 1
    print("\n✅ PASS:两个命令式工具(含参数 schema)已进产物,页面关键元素无回归")

    # ---- 反向测试:证明这个闸门真的会失败 ----
    print("\n== 反向测试(注入已知坏例,期望退出码 1)==")
    with tempfile.TemporaryDirectory() as tmp:
        clone = Path(tmp) / "next"
        shutil.copytree(root, clone, symlinks=True)
        # 坏例:把其中一个工具名从产物里抹掉(模拟 tree-shake 掉/没被打包)
        target = None
        for p in sorted((clone / "static").rglob("*.js")):
            t = p.read_text(encoding="utf-8", errors="ignore")
            if TOOL_NAMES[0] in t:
                p.write_text(t.replace(TOOL_NAMES[0], "XXXXX_REMOVED"), encoding="utf-8")
                target = p
                break
        if target is None:
            print("   ⚠️ 无法注入坏例(副本里找不到工具名)—— 闸门可疑")
            return 1
        bad = check(clone)
        if not bad:
            print("   ❌ 注入了坏例却仍然 PASS —— 闸门在空转!")
            return 1
        print(f"   ✅ 坏例被抓住({Path(target).name}):{bad[0]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
