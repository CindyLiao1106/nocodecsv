
import asyncio, json
from playwright.async_api import async_playwright
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
OUT="/opt/data/cad_work/nocodecsv_workspace/cite_data/raw3"
JOBS=json.load(open(OUT+"/jobs.json"))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx = await b.new_context(user_agent=UA, locale="en-US", viewport={"width":1400,"height":1000})
        for tag,url in JOBS:
            pg = await ctx.new_page()
            try:
                await pg.goto(url, wait_until="domcontentloaded", timeout=55000)
                await pg.wait_for_timeout(3500)
                for _ in range(4):
                    await pg.evaluate("()=>window.scrollTo(0,document.body.scrollHeight)")
                    await pg.wait_for_timeout(900)
                txt = await pg.evaluate("()=>document.body.innerText")
                open(OUT+"/P_"+tag+".txt","w",encoding="utf-8").write(txt)
                print("OK "+tag+" len="+str(len(txt))+" title="+(await pg.title())[:70])
            except Exception as e:
                print("ERR "+tag+" "+str(e)[:130])
            await pg.close()
        await b.close()
asyncio.run(main())
