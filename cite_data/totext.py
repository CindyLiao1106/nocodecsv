import sys, os, re
from bs4 import BeautifulSoup

def text(path):
    h = open(path, 'rb').read()
    try:
        s = h.decode('utf-8')
    except Exception:
        s = h.decode('latin-1')
    soup = BeautifulSoup(s, 'lxml')
    for t in soup(['script', 'style', 'noscript']):
        t.decompose()
    txt = soup.get_text('\n')
    txt = re.sub(r'\n\s*\n+', '\n', txt)
    return txt

if __name__ == '__main__':
    path = sys.argv[1]
    txt = text(path)
    print(f"### {path} :: {len(txt)} chars")
    if len(sys.argv) > 2:
        pat = sys.argv[2]
        for m in re.finditer(pat, txt, re.I):
            a = max(0, m.start()-350); b = min(len(txt), m.end()+350)
            print('---')
            print(txt[a:b].replace('\n', ' '))
    else:
        print(txt[:6000])
