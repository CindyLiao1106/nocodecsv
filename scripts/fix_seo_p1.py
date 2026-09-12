#!/usr/bin/env python3
"""
nocodecsv SEO P1 fixer:
  1) add publisher.logo to Article JSON-LD (all articles)
  2) add BreadcrumbList JSON-LD (all articles)
  3) add FAQPage JSON-LD for articles that have a VISIBLE FAQ section but no schema
Pure text transforms on src/app/blog/<slug>/page.tsx. No article body text touched.
"""
import os, re, sys, json, html, glob

ROOT = "/opt/data/cad_work/nocodecsv_workspace"
BLOG = os.path.join(ROOT, "src/app/blog")
DRY = "--apply" not in sys.argv

# ---------- breadcrumb display names (canonical, from src/lib/related-posts.ts) ----------
rp = open(os.path.join(ROOT, "src/lib/related-posts.ts"), encoding="utf-8").read()
POST_TITLES = dict(re.findall(r"'([a-z0-9-]+)':\s*'((?:[^'\\]|\\.)*)',", rp))
POST_TITLES = {k: v.replace("\\'", "'") for k, v in POST_TITLES.items()}

ENT = {"&rarr;": "\u2192", "&larr;": "\u2190", "&mdash;": "\u2014", "&ndash;": "\u2013",
       "&hellip;": "\u2026", "&nbsp;": " ", "&amp;": "&", "&gt;": ">", "&lt;": "<",
       "&quot;": '"', "&apos;": "'", "&#39;": "'", "&#x27;": "'"}

def plain(s: str) -> str:
    s = re.sub(r"\{'[^']*'\}", " ", s)
    s = re.sub(r'\{"[^"]*"\}', " ", s)
    s = re.sub(r"<[^>]+>", " ", s)
    for a, b in ENT.items():
        s = s.replace(a, b)
    s = html.unescape(s)
    s = s.replace("\u00a0", " ")
    return re.sub(r"\s+", " ", s).strip()

# ---------- FAQ extraction from the VISIBLE jsx ----------
def extract_faq(src: str):
    m = re.search(r"export default function", src)
    jsx = src[m.start():] if m else src
    # find the FAQ <h2>
    hit = None
    for h in re.finditer(r"<h2[^>]*>(.*?)</h2>", jsx, re.S):
        txt = plain(h.group(1))
        if "FAQ" in txt or "Frequently Asked" in txt:
            hit = h
            break
    if not hit:
        return None
    region = jsx[hit.end():]
    # bound: next <h2 ...> or a JSX comment (author byline / divider)
    ends = [len(region)]
    for pat in (r"<h2[^>]*>", r"\{/\*"):
        mm = re.search(pat, region)
        if mm:
            ends.append(mm.start())
    region = region[: min(ends)]
    # pair h3 question with the following <p>
    qa = []
    for chunk in re.split(r"<h3[^>]*>", region)[1:]:
        qend = chunk.find("</h3>")
        if qend == -1:
            continue
        q = plain(chunk[:qend])
        rest = chunk[qend + 5:]
        pm = re.search(r"<p[^>]*>(.*?)</p>", rest, re.S)
        if not pm:
            continue
        a = plain(pm.group(1))
        if q and a:
            qa.append((q, a))
    return qa or None

# ---------- JSON-LD source generators (JSON is valid TS object literal) ----------
def js_const(name: str, obj: dict) -> str:
    body = json.dumps(obj, ensure_ascii=False, indent=2)
    return f"const {name} = {body};\n"

def breadcrumb_obj(canonical: str, name: str) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://nocodecsv.com"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://nocodecsv.com/blog"},
            {"@type": "ListItem", "position": 3, "name": name, "item": canonical},
        ],
    }

PUB_OLD = '  publisher: { "@type": "Organization", name: "NoCodeCSV" },\n'
PUB_NEW = (
    '  publisher: {\n'
    '    "@type": "Organization",\n'
    '    name: "NoCodeCSV",\n'
    '    logo: {\n'
    '      "@type": "ImageObject",\n'
    '      url: "https://nocodecsv.com/og-image.png",\n'
    '      width: 1200,\n'
    '      height: 630,\n'
    '    },\n'
    '  },\n'
)

SCRIPT_ANCHOR = (
    '      <script\n'
    '        type="application/ld+json"\n'
    '        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}\n'
    '      />\n'
)

def script_tag(var: str) -> str:
    return ('      <script\n'
            '        type="application/ld+json"\n'
            f'        dangerouslySetInnerHTML={{{{ __html: JSON.stringify({var}) }}}}\n'
            '      />\n')

changed, faq_added, bc_added, logo_added = [], [], [], []
faq_failed = []

for path in sorted(glob.glob(os.path.join(BLOG, "*", "page.tsx"))):
    slug = path.split(os.sep)[-2]
    src = orig = open(path, encoding="utf-8").read()
    notes = []

    canonical = None
    cm = re.search(r'canonical:\s*"(https://nocodecsv\.com/blog/[^"]+)"', src)
    if cm:
        canonical = cm.group(1)

    # ---- 1. publisher.logo ----
    if PUB_OLD in src:
        src = src.replace(PUB_OLD, PUB_NEW, 1)
        notes.append("publisher.logo")
        logo_added.append(slug)
    elif "icon.png" in src:
        src = src.replace("https://nocodecsv.com/icon.png", "https://nocodecsv.com/og-image.png")
        notes.append("publisher.logo(url fixed ->og-image.png)")
        logo_added.append(slug)

    # ---- 2. FAQPage (only when a visible FAQ exists and schema is absent) ----
    faq_src = None
    if '"@type": "FAQPage"' not in src:
        qa = extract_faq(src)
        if qa:
            obj = {"@context": "https://schema.org", "@type": "FAQPage",
                   "mainEntity": [{"@type": "Question", "name": q,
                                   "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in qa]}
            json.loads(json.dumps(obj))          # prove valid JSON
            faq_src = js_const("faqJsonLd", obj)
            notes.append(f"FAQPage({len(qa)} Q)")
            faq_added.append(slug)
        else:
            faq_failed.append(slug)

    # ---- 3. BreadcrumbList ----
    bc_src = None
    if '"@type": "BreadcrumbList"' not in src:
        assert canonical, f"no canonical in {slug}"
        name = POST_TITLES.get(slug)
        assert name, f"no POST_TITLES entry for {slug}"
        obj = breadcrumb_obj(canonical, name)
        json.loads(json.dumps(obj))
        bc_src = js_const("breadcrumbJsonLd", obj)
        notes.append("BreadcrumbList")
        bc_added.append(slug)

    # ---- insert new consts before `export default function` ----
    if faq_src or bc_src:
        i = src.index("export default function")
        block = (bc_src or "") + ("\n" if bc_src and faq_src else "") + (faq_src or "") + "\n"
        src = src[:i] + block + src[i:]

    # ---- insert <script> tags after the existing jsonLd script ----
    extra = []
    if bc_src:
        extra.append(script_tag("breadcrumbJsonLd"))
    if faq_src:
        extra.append(script_tag("faqJsonLd"))
    if extra:
        if SCRIPT_ANCHOR in src:
            src = src.replace(SCRIPT_ANCHOR, SCRIPT_ANCHOR + "".join(extra), 1)
        else:
            # this page defines jsonLd but never renders it (opencode-go) —
            # render it too, then place all script tags right after <article ...>
            am = re.search(r"<article[^>]*>\n", src)
            assert am, f"no article-open anchor in {slug}"
            rendered = script_tag("jsonLd") + "".join(extra)
            src = src[:am.end()] + rendered + src[am.end():]
            notes.append("rendered jsonLd script (was dead code)")

    if src != orig:
        changed.append((slug, notes))
        if not DRY:
            open(path, "w", encoding="utf-8").write(src)

print(("DRY RUN — " if DRY else "APPLIED — ") + f"files changed: {len(changed)}")
for s, n in changed:
    print(f"  {s:46} {', '.join(n)}")
print(f"\nFAQPage added: {len(faq_added)}")
print(f"BreadcrumbList added: {len(bc_added)}")
print(f"publisher.logo set/fixed: {len(logo_added)}")
print(f"visible FAQ but no schema AND extraction failed: {faq_failed}")
