import re, sys

path = sys.argv[1]
pat = sys.argv[2]
before = int(sys.argv[3]) if len(sys.argv) > 3 else 300
after = int(sys.argv[4]) if len(sys.argv) > 4 else 300
txt = open(path, encoding='utf-8', errors='replace').read()
n = 0
for m in re.finditer(pat, txt, re.I):
    n += 1
    a = max(0, m.start()-before); b = min(len(txt), m.end()+after)
    print('---')
    print(re.sub(r'\s+', ' ', txt[a:b]))
    if n >= 40:
        break
print(f"[matches: {n}]")
