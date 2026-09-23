
import re, sys, os, json, html as _html

def strip_html(path):
    raw = open(path, encoding='utf-8', errors='ignore').read()
    raw = re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>', ' ', raw)
    txt = re.sub(r'(?s)<[^>]+>', ' ', raw)
    txt = _html.unescape(txt)
    txt = re.sub(r'[ \t\xa0]+', ' ', txt)
    txt = re.sub(r'\n\s*\n+', '\n', txt)
    return txt.strip()

def find(path, patterns, win=260):
    t = strip_html(path)
    out=[]
    for p in patterns:
        for m in re.finditer(p, t, re.I):
            s=max(0,m.start()-win); e=min(len(t), m.end()+win)
            out.append(f"[{p}] ...{t[s:e]}...")
    return out
