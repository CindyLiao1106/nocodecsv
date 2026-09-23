
import sys, asyncio
from playwright.async_api import async_playwright
async def main():
    q=sys.argv[1]
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx = await b.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36", locale="en-US")
        for name,url in [
            ("brave", "https://search.brave.com/search?q="+q.replace(" ","+")),
            ("mojeek","https://www.mojeek.com/search?q="+q.replace(" ","+")),
            ("ecosia","https://www.ecosia.org/search?q="+q.replace(" ","+")),
            ("startpage","https://www.startpage.com/sp/search?query="+q.replace(" ","+")),
        ]:
            pg = await ctx.new_page()
            try:
                await pg.goto(url, wait_until="domcontentloaded", timeout=35000)
                await pg.wait_for_timeout(4500)
                txt = await pg.evaluate("()=>document.body.innerText.slice(0,1500)")
                tt = await pg.title()
                print("##### " + name + " | title=" + tt[:60])
                print(txt.replace("\n"," | ")[:1200])
            except Exception as e:
                print("##### " + name + " ERR " + str(e)[:150])
            await pg.close()
        await b.close()
asyncio.run(main())
