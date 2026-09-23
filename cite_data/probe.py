import sys, concurrent.futures, urllib.request, ssl, os

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
OUT = "/opt/data/cad_work/nocodecsv_workspace/cite_data/raw3"
os.makedirs(OUT, exist_ok=True)

def fetch(item):
    name, url = item
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    })
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with urllib.request.urlopen(req, timeout=45, context=ctx) as r:
            data = r.read()
            p = os.path.join(OUT, name + ".html")
            open(p, "wb").write(data)
            return f"{name} | HTTP {r.status} | {len(data)}B | {url}"
    except Exception as e:
        return f"{name} | FAIL {type(e).__name__} {str(e)[:90]} | {url}"

pairs = []
for line in sys.stdin:
    line = line.strip()
    if not line or line.startswith("#"):
        continue
    name, url = line.split(" ", 1)
    pairs.append((name, url))

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
    for res in ex.map(fetch, pairs):
        print(res)
