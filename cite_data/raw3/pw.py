
import sys, asyncio
from playwright.async_api import async_playwright
async def main():
    q = sys.argv[1]; url = sys.argv[2]
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx = await b.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36", locale="en-US")
        pg = await ctx.new_page()
        try:
            await pg.goto(url.replace("QUERY", q.replace(" ","+")), wait_until="domcontentloaded", timeout=40000)
        except Exception as e:
            print("GOTO ERR:", str(e)[:200])
        await pg.wait_for_timeout(3500)
        print("TITLE:", await pg.title())
        items = await pg.evaluate("""() => {
          const out=[];
          document.querySelectorAll('li.b_algo, article[data-testid="result"], div.result, li.result').forEach(e=>{
            const a=e.querySelector('h2 a, a[data-testid="result-title-a"], a.result__a, a.title');
            if(!a) return;
            const sn=e.querySelector('.b_caption p, [data-result="snippet"], .result__snippet');
            out.push({t:(a.innerText||'').trim(), u:a.href, d:(sn?sn.innerText:'').trim()});
          });
          return out.slice(0,12);
        }""")
        for it in items:
            print("-", it["t"].replace("\n"," ")[:120]); print("  ", it["u"]); print("  ", (it["d"] or "")[:220].replace("\n"," "))
        if not items: print("NORESULTS")
        await b.close()
asyncio.run(main())
