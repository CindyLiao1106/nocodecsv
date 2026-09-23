
import asyncio, json, sys
from playwright.async_api import async_playwright
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
QUERIES=json.load(open("/opt/data/cad_work/nocodecsv_workspace/cite_data/raw3/queries.json"))
async def search(ctx, q):
    for attempt in range(3):
        pg = await ctx.new_page()
        try:
            await pg.goto("https://search.brave.com/search?q="+q.replace(" ","+"), wait_until="domcontentloaded", timeout=45000)
            await pg.wait_for_timeout(5000)
            items = await pg.evaluate("""() => {
              const out=[];
              document.querySelectorAll('div.snippet').forEach(e=>{
                const a=e.querySelector('a[href^="http"]'); if(!a) return;
                const t=e.querySelector('.title, .snippet-title');
                const d=e.querySelector('.snippet-description, .snippet-content');
                const tt=(t?t.innerText:(a.innerText||'')).trim(); if(!tt) return;
                out.push({t:tt,u:a.href,d:(d?d.innerText:'').trim().slice(0,320)});
              });
              return out;
            }""")
            await pg.close()
            if items: return items
        except Exception as e:
            try: await pg.close()
            except Exception: pass
        await asyncio.sleep(6)
    return []
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx = await b.new_context(user_agent=UA, locale="en-US")
        for tag,q in QUERIES:
            res = await search(ctx, q)
            print("##### "+tag+" :: "+q)
            seen=set(); c=0
            for it in res:
                if it["u"] in seen: continue
                seen.add(it["u"]); c+=1
                print("  ["+str(c)+"] "+it["t"].replace("\n"," ")[:130])
                print("      "+it["u"])
                if it["d"]: print("      "+it["d"].replace("\n"," ")[:280])
                if c>=6: break
            if not res: print("  NORESULTS")
            await asyncio.sleep(4)
        await b.close()
asyncio.run(main())
