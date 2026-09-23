import sys, os, re, json

OUT = "/opt/data/cad_work/nocodecsv_workspace/cite_data/raw3"
os.makedirs(OUT, exist_ok=True)

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

def run(pairs):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox", "--disable-blink-features=AutomationControlled"])
        ctx = browser.new_context(user_agent=UA, viewport={"width": 1440, "height": 900},
                                  locale="en-US", extra_http_headers={"Accept-Language": "en-US,en;q=0.9"})
        ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        for name, url in pairs:
            page = ctx.new_page()
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=45000)
                page.wait_for_timeout(4000)
                try:
                    page.mouse.wheel(0, 4000); page.wait_for_timeout(1500)
                    page.mouse.wheel(0, -8000); page.wait_for_timeout(1000)
                except Exception:
                    pass
                html = page.content()
                txt = page.inner_text("body") if page.query_selector("body") else ""
                open(os.path.join(OUT, name + ".html"), "w", encoding="utf-8").write(html)
                open(os.path.join(OUT, name + ".txt"), "w", encoding="utf-8").write(txt)
                print(f"OK {name} | html {len(html)} | text {len(txt)} | {url}")
            except Exception as e:
                print(f"FAIL {name} | {type(e).__name__} {str(e)[:110]} | {url}")
            finally:
                page.close()
        browser.close()

if __name__ == "__main__":
    pairs = []
    for line in sys.stdin:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        name, url = line.split(" ", 1)
        pairs.append((name, url))
    run(pairs)
