
import sys, asyncio
from playwright.async_api import async_playwright

async def main():
    q = sys.argv[1]
    engine = sys.argv[2] if len(sys.argv)>2 else "ddg"
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox","--disable-dev-shm-usage"])
        pg = await (await b.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36", locale="en-US")).new_page()
        if engine=="ddg":
            await pg.goto("https://duckduckgo.com/?q="+q.replace(" ","+")+"&ia=web", wait_until="domcontentloaded", timeout=45000)
        else:
            await pg.goto("https://www.bing.com/search?q="+q.replace(" ","+"), wait_until="domcontentloaded", timeout=45000)
        await pg.wait_for_timeout(4000)
        items = await pg.evaluate("""() => {
          const out=[];
          document.querySelectorAll('article[data-testid="result"], li.b_algo').forEach(e=>{
            const a=e.querySelector('a[data-testid="result-title-a"], h2 a');
            if(!a) return;
            const sn=e.querySelector('[data-result="snippet"], .b_caption p');
            out.push({t:a.innerText, u:a.href, d: sn? sn.innerText : ''});
          });
          return out.slice(0,12);
        }""")
        for it in items:
            print("-", it["t"].replace("\n"," "))
            print("  ", it["u"])
            print("  ", (it["d"] or "")[:200].replace("\n"," "))
        if not items:
            print("NO RESULTS; title=", await pg.title())
        await b.close()

asyncio.run(main())
