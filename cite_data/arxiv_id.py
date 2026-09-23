import sys, urllib.request, ssl, re, time
import xml.etree.ElementTree as ET
UA = "Mozilla/5.0 (compatible; research-bot/1.0)"
ctx = ssl.create_default_context(); ctx.check_hostname=False; ctx.verify_mode=ssl.CERT_NONE
NS = {'a': 'http://www.w3.org/2005/Atom'}

for aid in sys.argv[1:]:
    url = f"http://export.arxiv.org/api/query?id_list={aid}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        x = urllib.request.urlopen(req, timeout=45, context=ctx).read().decode('utf-8','replace')
        root = ET.fromstring(x)
        for e in root.findall('a:entry', NS):
            t = re.sub(r'\s+',' ', e.find('a:title',NS).text)
            s = re.sub(r'\s+',' ', e.find('a:summary',NS).text)
            idu = e.find('a:id',NS).text
            pub = e.find('a:published',NS).text[:10]
            print('='*20)
            print(f"TITLE: {t}\nID: {idu}\nDATE: {pub}")
            print(f"ABSTRACT: {s}")
    except Exception as ex:
        print('FAIL', aid, type(ex).__name__, str(ex)[:120])
    time.sleep(2)
