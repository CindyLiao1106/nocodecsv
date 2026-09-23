
import sys, asyncio, json, re
from playwright.async_api import async_playwright
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

async def main():
    q=sys.argv[1]
    n=int(sys.argv[2]) if len(sys.argv)>2 else 12
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx = await b.new_context(user_agent=UA, locale="en-US")
        pg = await ctx.new_page()
        await pg.goto("https://search.brave.com/search?q="+q.replace(" ","+"), wait_until="domcontentloaded", timeout=45000)
        await pg.wait_for_timeout(4500)
        items = await pg.evaluate("""() => {
          const out=[];
          document.querySelectorAll('div.snippet').forEach(e=>{
            const a=e.querySelector('a[href^="http"]');
            if(!a) return;
            const t=e.querySelector('.title, .snippet-title');
            const d=e.querySelector('.snippet-description, .snippet-content');
            const tt=(t?t.innerText:(a.innerText||'')).trim();
            if(!tt) return;
            out.push({t:tt, u:a.href, d:(d?d.innerText:'').trim().slice(0,320)});
          });
          return out;
        }""")
        seen=set(); c=0
        for it in items:
            if it["u"] in seen: continue
            seen.add(it["u"]); c+=1
            print("["+str(c)+"] "+it["t"].replace("\n"," ")[:140])
            print("    "+it["u"])
            if it["d"]: print("    "+it["d"].replace("\n"," ")[:300])
            if c>=n: break
        if not items: print("NORESULTS | "+ (await pg.title()))
        await b.close()
asyncio.run(main())
