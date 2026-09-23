
import asyncio, sys
from playwright.async_api import async_playwright
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
async def main():
    q=sys.argv[1]
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx = await b.new_context(user_agent=UA, locale="en-US")
        pg = await ctx.new_page()
        await pg.goto("https://www.ecosia.org/search?q="+q.replace(" ","+"), wait_until="domcontentloaded", timeout=45000)
        await pg.wait_for_timeout(5000)
        try:
            await pg.click("text=Accept all", timeout=3000); await pg.wait_for_timeout(2000)
        except Exception: pass
        info = await pg.evaluate("""() => {
          const sels=['article.result','div.result','li.result','div[data-test-id]','main a[href^="http"]'];
          const rep={};
          for(const s of sels){ rep[s]=document.querySelectorAll(s).length; }
          const all=[...document.querySelectorAll('main a[href^="http"], #main a[href^="http"]')].slice(0,25).map(a=>({h:a.href,t:(a.innerText||'').trim().slice(0,90)}));
          return {rep, all};
        }""")
        print(info["rep"])
        for a in info["all"]:
            print("  -", a["t"], "|", a["h"])
        await b.close()
asyncio.run(main())
