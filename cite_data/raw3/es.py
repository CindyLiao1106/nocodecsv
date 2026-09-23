
import asyncio, sys
from playwright.async_api import async_playwright
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
JS = '\n() => {\n  const BAD = [\'support.ecosia.org\',\'support.google.com\',\'ecosia.org\',\'google.com/preferences\',\'accounts.google\',\'policies.google\'];\n  const norm = s => (s||\'\').split(\'\\n\').join(\' \').split(\'\\t\').join(\' \').replace(/  +/g,\' \').trim();\n  const out=[];\n  document.querySelectorAll(\'article.result\').forEach(e=>{\n    const links=[...e.querySelectorAll(\'a[href^="http"]\')].filter(a=>!BAD.some(b=>a.href.includes(b)) && a.innerText.trim().length>12);\n    if(!links.length) return;\n    const a=links[links.length-1];\n    out.push({t:norm(a.innerText).slice(0,160), u:a.href, d:norm(e.innerText).slice(0,380)});\n  });\n  return out;\n}\n'
async def main():
    q=sys.argv[1]
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox","--disable-dev-shm-usage"])
        ctx = await b.new_context(user_agent=UA, locale="en-US")
        pg = await ctx.new_page()
        await pg.goto("https://www.ecosia.org/search?q="+q.replace(" ","+"), wait_until="domcontentloaded", timeout=45000)
        await pg.wait_for_timeout(5000)
        try:
            await pg.click("text=Accept all", timeout=3000)
            await pg.wait_for_timeout(2000)
        except Exception:
            pass
        items = await pg.evaluate(JS)
        seen=set(); c=0
        for it in items:
            if it["u"] in seen:
                continue
            seen.add(it["u"]); c+=1
            print("["+str(c)+"] "+it["t"])
            print("    "+it["u"])
            print("    "+it["d"][:280])
            if c>=8:
                break
        if not items:
            print("NORESULTS")
        await b.close()
asyncio.run(main())
