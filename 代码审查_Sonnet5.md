# NoCodeCSV 代码审查

## 🔴 致命

**sitemap.ts / blog/page.tsx / related-posts.ts 三处数据源不同步** · `find-and-replace-in-csv`、`count-rows-in-csv-file` 存在于集群注册表却不在 sitemap 和博客索引里,成孤儿页,收录慢是必然结果,直接对应"收录很少"现状 · 把 `sitemap.ts` 和 `blog/page.tsx` 的列表改为从 `related-posts.ts` 的 `ALL_POST_SLUGS` 自动生成,单一数据源

**llms.txt 手写且已过期**,只列约一半文章(缺 chat-with-csv、csv-vs-excel、opencode-go-review 等) · AI 搜索引擎按此文件判断可引用内容范围,内容少一半 = GEO 流量少一半 · 改成 `route.ts` 动态生成,或 cron 发文后自动 append

**layout.tsx 对 /dashboard 等功能页也全局注入 AdSense 脚本** · 无内容的 SPA 工具页挂广告是 AdSense"内容质量/广告比例"政策高危项,账号刚恢复经不起二次封号,一旦封号收入归零 · 只在 blog/tools 等内容页手动引入 `<Script>`,dashboard 路由不加载

**首页唯一 CTA 指向 /dashboard**,Clerk 的 fallback redirect 配置暗示上传前需登录 · 陌生访客遇注册墙会直接流失,砍掉转化率最关键一步(先试用) · 增加免登录 demo,或先出示例结果再要求注册

## 🟠 重要

**header.tsx 整体 "use client" + useUser()** · 登录状态要等 hydration 后才出现,视觉跳动降低首屏信任感 · 拆出 Server Component 做静态 nav,仅登录按钮部分 client 化

**robots.ts 未 disallow /dashboard /api /sign-in** · 浪费爬虫预算,登录墙页面可能被索引拉低整站质量分 · 加 disallow 规则,对应页面 metadata 加 `robots: noindex`

**AdSense client id 在 adsense.tsx 与 layout.tsx 重复硬编码** · 以后换号/多站点易漏改一处,导致展示错误账号广告触发违规 · 抽成 `src/lib/ads.ts` 共享常量,两处 import

**package.json 里 lucide-react 版本号 "^1.28.0" 可疑**(该库长期在 0.x) · 可能装错包或 build 失败,阻断部署即阻断一切收入 · 核对 lockfile 实际解析版本,修正为真实版本号

**blog/[slug] 详情页未见 Article/BlogPosting 结构化数据**(仅博客首页有 CollectionPage) · 缺 datePublished/author 会削弱 AI 摘要引用与富媒体展示几率 · 补充对应 JSON-LD

## 🟡 次要

**sitemap.ts 里多篇文章共用同一写死日期**("2026-08-04") · 弱化新鲜度信号,非致命 · 改为真实发布日期变量

**footer.tsx 版权文字仍是 "DataAnalyzer AI"**,与品牌 NoCodeCSV 不一致 · 削弱 EEAT 实体识别 · 统一品牌名

**CSP 长期停留 Report-Only 且允许 unsafe-inline/unsafe-eval** · XSS 防护形同摆设 · 观察上报数据后切换为强制 CSP

## 只能做 3 件(按 ROI)

1. **统一 sitemap/博客索引/相关文章三处数据源** —— 解决"收录很少"的根因,成本最低
2. **把 AdSense 移出 /dashboard** —— 保护刚恢复的账号,防止收入直接归零
3. **打通免登录试用路径** —— 解决首屏转化流失,决定访客能否变成注册用户