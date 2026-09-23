import re, sys
path = sys.argv[1]
txt = open(path, encoding='utf-8', errors='replace').read()
pats = sys.argv[2:]
for pat in pats:
    print('=' * 20, pat)
    n = 0
    for m in re.finditer(pat, txt, re.I):
        n += 1
        a = max(0, m.start()-200); b = min(len(txt), m.end()+260)
        print('---', re.sub(r'\s+', ' ', txt[a:b]))
        if n >= 6:
            break
    print(f"[{n} matches]")
