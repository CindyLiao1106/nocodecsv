#!/usr/bin/env python3
"""Validate TSX blog pages: JSON-LD parses, tag balance, FAQ parity."""
import json, re, sys

def block(src, varname):
    m = re.search(r"const %s = (\{.*?\n\});" % re.escape(varname), src, re.S)
    return m.group(1) if m else None

def js_obj_to_json(src):
    """Convert a JS object literal (bare keys, trailing commas) to JSON."""
    out = []; i = 0; n = len(src); in_str = False; esc = False
    while i < n:
        c = src[i]
        if in_str:
            out.append(c)
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': in_str = False
            i += 1; continue
        if c == '"':
            in_str = True; out.append(c); i += 1; continue
        if c in "{,":
            out.append(c); i += 1
            j = i
            while j < n and src[j] in " \t\n\r": j += 1
            if j < n and (src[j].isalpha() or src[j] == "_"):
                k = j
                while k < n and (src[k].isalnum() or src[k] == "_"): k += 1
                m = k
                while m < n and src[m] in " \t\n\r": m += 1
                if m < n and src[m] == ":":
                    out.append(src[i:j]); out.append('"' + src[j:k] + '"'); i = k; continue
            continue
        out.append(c); i += 1
    s = "".join(out)
    s = re.sub(r",(\s*[}\]])", r"\1", s)   # JS allows trailing commas, JSON does not
    return json.loads(s)

for f in sys.argv[1:]:
    src = open(f, encoding="utf-8").read()
    print(f"\n=== {f.split('/')[-1]} ===")
    ok = True
    for v in ("jsonLd", "breadcrumbJsonLd", "faqJsonLd"):
        b = block(src, v)
        if b is None:
            print(f"  {v}: MISSING"); ok = False; continue
        try:
            d = js_obj_to_json(b)
            n = len(d.get("mainEntity", [])) if v == "faqJsonLd" else "-"
            print(f"  {v}: JSON OK (@type={d.get('@type')}, mainEntity={n})")
        except Exception as e:
            print(f"  {v}: JSON FAIL -> {e}"); ok = False
    for tag in ("article", "div", "ul", "ol", "table", "thead", "tbody", "tr"):
        o = len(re.findall(r"<%s[ >]" % tag, src)); c = src.count("</%s>" % tag)
        flag = "" if o == c else "  <-- MISMATCH"
        if o != c: ok = False
        print(f"  <{tag}>: {o}/{c}{flag}")
    stripped = re.sub(r"`[^`]*`", "", src)
    print(f"  brackets: {{={stripped.count('{')}/{stripped.count('}')} (={stripped.count('(')}/{stripped.count(')')}")
    vis = len(re.findall(r"<h3>", src))
    try:
        sch = len(js_obj_to_json(block(src, "faqJsonLd"))["mainEntity"])
    except Exception:
        sch = -1
    print(f"  FAQ parity: visible h3={vis} schema={sch} {'OK' if vis == sch else 'MISMATCH'}")
    print(f"  -> {'PASS' if ok else 'FAIL'}")
