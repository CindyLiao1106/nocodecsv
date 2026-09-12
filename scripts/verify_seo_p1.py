#!/usr/bin/env python3
"""
Verify nocodecsv SEO P1 fixes at source level.
For every `const <name> = {...};` JSON-LD literal: eval it as JS in node, then
JSON.stringify it and JSON.parse the result — exactly what the page does at runtime.
Then check coverage + that FAQ schema text matches the page's visible text.
"""
import os, re, json, html, glob, subprocess, tempfile, shutil

BLOG = "/opt/data/cad_work/nocodecsv_workspace/src/app/blog"
ENT = {"&rarr;": "\u2192", "&mdash;": "\u2014", "&ndash;": "\u2013", "&hellip;": "\u2026",
       "&nbsp;": " ", "&amp;": "&", "&gt;": ">", "&lt;": "<", "&quot;": '"',
       "&apos;": "'", "&#39;": "'"}

def plain(s):
    s = re.sub(r"\{'[^']*'\}", " ", s)
    s = re.sub(r'\{"[^"]*"\}', " ", s)
    s = re.sub(r"<[^>]+>", " ", s)
    for a, b in ENT.items():
        s = s.replace(a, b)
    s = html.unescape(s).replace("\u00a0", " ")
    return re.sub(r"\s+", " ", s).strip()

def grab(src, var):
    m = re.search(rf"const {var} = ", src)
    if not m:
        return None
    i = src.index("{", m.end())
    depth, j, instr, esc = 0, i, None, False
    while j < len(src):
        c = src[j]
        if instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == instr: instr = None
        else:
            if c in "\"'": instr = c
            elif c == "{": depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    break
        j += 1
    return src[i:j + 1]

# ---- collect every literal, eval them all in one node process ----
cases, tmp = [], tempfile.mkdtemp()
for path in sorted(glob.glob(os.path.join(BLOG, "*", "page.tsx"))):
    slug = path.split(os.sep)[-2]
    src = open(path, encoding="utf-8").read()
    for var in ("jsonLd", "breadcrumbJsonLd", "faqJsonLd"):
        raw = grab(src, var)
        if raw is None:
            continue
        fp = os.path.join(tmp, f"{slug}__{var}.js")
        open(fp, "w", encoding="utf-8").write("module.exports = " + raw + ";\n")
        cases.append((slug, var, fp))

driver = os.path.join(tmp, "_run.js")
open(driver, "w", encoding="utf-8").write("""
const fs=require('fs'),path=require('path');
const out=[];
for (const f of process.argv.slice(2)) {
  const rec={file:f};
  try {
    const o = require(f);
    const s = JSON.stringify(o);
    const back = JSON.parse(s);            // the runtime contract
    rec.ok = true; rec.json = s; rec.type = back["@type"] || null;
    rec.parsed = back;
  } catch (e) { rec.ok=false; rec.err=String(e); }
  out.push(rec);
}
fs.writeFileSync(process.argv[2] ? '/tmp/_ld_out.json' : '/tmp/_ld_out.json', JSON.stringify(out));
""")

res = subprocess.run(["node", driver] + [c[2] for c in cases], capture_output=True, text=True)
if res.returncode != 0:
    print("node driver failed:", res.stderr[:2000]); raise SystemExit(1)
data = json.load(open("/tmp/_ld_out.json"))
byfile = {d["file"]: d for d in data}

total = article = logo = faq = bc = 0
bad, mismatch, unrendered = [], [], []
faqlists = {}
for slug, var, fp in cases:
    d = byfile[fp]
    if not d["ok"]:
        bad.append((slug, var, d["err"][:120])); continue
    obj = d["parsed"]
    if var == "jsonLd" and obj.get("@type") == "Article":
        total += 0
    if obj.get("@type") == "Article":
        article += 1
        if "logo" in obj.get("publisher", {}): logo += 1
    if obj.get("@type") == "BreadcrumbList":
        bc += 1
    if obj.get("@type") == "FAQPage":
        faq += 1
        faqlists[slug] = len(obj["mainEntity"])
        src = open(os.path.join(BLOG, slug, "page.tsx"), encoding="utf-8").read()
        if f"JSON.stringify({var})" not in src:
            unrendered.append((slug, var))
        visible = plain(src[src.index("export default function"):])
        for q in obj["mainEntity"]:
            qt, at = plain(q["name"]), plain(q["acceptedAnswer"]["text"])
            if qt not in visible or at[:70] not in visible:
                mismatch.append((slug, qt[:70]))

narticles = len(glob.glob(os.path.join(BLOG, "*", "page.tsx")))
# split FAQ text mismatches into "newly added by this fix" vs "pre-existing schema we did not touch"
import subprocess as _sp
def preexisting_faq(slug):
    try:
        old = _sp.run(["git", "show", f"HEAD:src/app/blog/{slug}/page.tsx"],
                      cwd=BLOG, capture_output=True, text=True).stdout
        return '"@type": "FAQPage"' in old
    except Exception:
        return False
new_mm = [m for m in mismatch if not preexisting_faq(m[0])]
old_mm = [m for m in mismatch if preexisting_faq(m[0])]

print(f"article page.tsx files          : {narticles}")
print(f"Article schema (rendered JSON)  : {article}/{narticles}")
print(f"publisher.logo in Article       : {logo}/{narticles}")
print(f"FAQPage schema (rendered JSON)  : {faq}/{narticles}")
print(f"BreadcrumbList (rendered JSON)  : {bc}/{narticles}")
print()
print(f"JSON.stringify -> JSON.parse ran on {len(cases)} literals; failures: {len(bad)}")
for b in bad: print("   FAIL", b)
print(f"schema defined but not rendered  : {len(unrendered)} {unrendered[:5]}")
print()
print(f"NEW FAQ schema text vs visible page mismatches : {len(new_mm)} {new_mm[:5]}")
print(f"PRE-EXISTING FAQ schema mismatches (untouched) : {len(old_mm)} "
      f"{sorted(set(m[0] for m in old_mm))}")
print()
print("FAQ-rich pages:", json.dumps(faqlists, indent=1))
shutil.rmtree(tmp, ignore_errors=True)
