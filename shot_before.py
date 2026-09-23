#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""阶段 B:拍改前截图(首页 + 手机版)"""
import asyncio, os

OUT = '/opt/data/cad_work/nocodecsv_workspace/screenshots'
os.makedirs(OUT, exist_ok=True)

async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox', '--disable-dev-shm-usage'])
        # 桌面
        pg = await b.new_page(viewport={'width': 1440, 'height': 900})
        await pg.goto('https://nocodecsv.com/', wait_until='networkidle', timeout=60000)
        await pg.screenshot(path=f'{OUT}/before_desktop.png')
        await pg.screenshot(path=f'{OUT}/before_desktop_full.png', full_page=True)
        print(f"  ✅ 桌面版: {OUT}/before_desktop.png")
        await pg.close()
        # 手机
        pg2 = await b.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True)
        await pg2.goto('https://nocodecsv.com/', wait_until='networkidle', timeout=60000)
        await pg2.screenshot(path=f'{OUT}/before_mobile.png')
        print(f"  ✅ 手机版: {OUT}/before_mobile.png")
        await pg2.close()
        await b.close()

asyncio.run(main())
