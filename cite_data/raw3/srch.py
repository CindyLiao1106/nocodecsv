
import re, sys, html, urllib.parse, subprocess, json, base64
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
DIR="/opt/data/cad_work/nocodecsv_workspace/cite_data/raw3"

def fetch(url, out, timeout=30):
    cmd=["curl","-sSL","--max-time",str(timeout),"-A",UA,"-H","Accept-Language: en-US,en;q=0.9","-w","%{http_code}","-o",out,url]
    r=subprocess.run(cmd,capture_output=True,text=True)
    return r.stdout.strip()

def _unwrap(u):
    if "bing.com/ck/a" in u:
        m=re.search(r'[?&]u=a1([^&]+)', u)
        if m:
            s=m.group(1)
            s+="="*(-len(s)%4)
            try: return base64.urlsafe_b64decode(s).decode('utf-8','ignore')
            except Exception: pass
    return u

def bing(q, n=10, page=0):
    enc=urllib.parse.quote_plus(q)
    out=f"{DIR}/bing_tmp.html"
    fetch(f"https://www.bing.com/search?q={enc}&count=30&first={page*10+1}", out)
    raw=open(out,encoding='utf-8',errors='ignore').read()
    res=[]
    for m in re.finditer(r'<li class="b_algo".*?</li>', raw, re.S):
        blk=m.group(0)
        a=re.search(r'<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', blk, re.S)
        if not a: continue
        url=_unwrap(html.unescape(a.group(1)))
        title=html.unescape(re.sub(r'<[^>]+>','',a.group(2))).strip()
        p=re.search(r'<p[^>]*>(.*?)</p>', blk, re.S)
        desc=html.unescape(re.sub(r'<[^>]+>','',p.group(1))).strip() if p else ''
        res.append({"title":title,"url":url,"desc":desc[:300]})
        if len(res)>=n: break
    return res

if __name__=="__main__":
    q=sys.argv[1]; n=int(sys.argv[2]) if len(sys.argv)>2 else 10
    for r in bing(q,n):
        print("-", r["title"])
        print("  ", r["url"])
        if r["desc"]: print("  ", r["desc"][:180])
