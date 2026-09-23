
import sys, asyncio, os, re, html as _html
from playwright.async_api import async_playwright
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
async def main():
    url=sys.argv[1]; out=sys.argv[2]; timeout=int(sys.argv[3]) if len(sys.argv)>3 else 45000
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx = await b.new_context(user_agent=UA, locale="en-US", viewport={"width":1400,"height":900})
        pg = await ctx.new_page()
        try:
            await pg.goto(url, wait_until="domcontentloaded", timeout=timeout)
        except Exception as e:
            print("GOTO_ERR "+str(e)[:150])
        await pg.wait_for_timeout(3500)
        try:
            await pg.evaluate("()=>{window.scrollTo(0,document.body.scrollHeight)}")
            await pg.wait_for_timeout(1500)
        except Exception: pass
        txt = await pg.evaluate("()=>document.body.innerText")
        open(out,'w',encoding='utf-8').write(txt)
        print("OK len="+str(len(txt))+" title="+(await pg.title())[:90])
        await b.close()
asyncio.run(main())
