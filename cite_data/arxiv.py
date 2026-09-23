import sys, urllib.request, ssl, re, json, time
UA = "Mozilla/5.0 (compatible; research-bot/1.0)"
ctx = ssl.create_default_context(); ctx.check_hostname=False; ctx.verify_mode=ssl.CERT_NONE

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45, context=ctx) as r:
        return r.read().decode('utf-8', 'replace')

import xml.etree.ElementTree as ET
NS = {'a': 'http://www.w3.org/2005/Atom'}

queries = sys.argv[1:]
for q in queries:
    url = f"http://export.arxiv.org/api/query?search_query={urllib.parse.quote(q)}&max_results=5"
    try:
        x = get(url)
        root = ET.fromstring(x)
        print('=' * 25, q)
        for e in root.findall('a:entry', NS):
            t = re.sub(r'\s+', ' ', e.find('a:title', NS).text)
            s = re.sub(r'\s+', ' ', e.find('a:summary', NS).text)
            idu = e.find('a:id', NS).text
            pub = e.find('a:published', NS).text[:10]
            print(f"* {t} | {idu} | {pub}")
            print(f"  {s[:650]}")
    except Exception as ex:
        print('FAIL', q, type(ex).__name__, str(ex)[:100])
    time.sleep(2)
