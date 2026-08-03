# Product Hunt 发布计划 — DataAnalyzer AI

> 目标：发布日进入 Top 5，拿到 200+ upvotes，验证产品 idea。

---

## 一、Tagline（一句话口号）

**主选**：
> Chat with your CSV. Upload any spreadsheet, ask questions in plain English, get instant charts.

**备选**：
> The AI data analyst that reads your spreadsheets so you don't have to.

---

## 二、Description（产品详情，给 Product Hunt 的描述）

```
DataAnalyzer AI lets you talk to your data like you'd talk to a colleague.

📂 Drop a CSV, Excel, or TSV file
💬 Ask questions in plain English ("Which product has the highest profit margin?")
📊 Get instant charts — bar, line, pie, scatter
🔒 Files processed in memory, never stored

How it's different from ChatGPT:
→ Purpose-built for spreadsheet analysis — no copy-pasting, no prompt engineering
→ Auto-generates publication-ready charts
→ Handles 25MB+ files with smart truncation
→ Clean, focused UI that doesn't get in your way

Free tier: 3 analyses/day
Pro: $15/mo unlimited
```

---

## 三、First Comment（创始人故事，发布后第一时间自己评论）

```
👋 Hey Product Hunt! I built DataAnalyzer AI because I was tired of this workflow:

1. Export CSV from Shopify/Stripe/Google Analytics
2. Open Excel, make pivot tables
3. Copy-paste into ChatGPT
4. Ask it to make a chart
5. Screenshot the chart
6. Paste into a doc

That's 6 steps for ONE question. And then someone asks "what about Q2?" — repeat.

So I built a tool that collapses all of that into:
→ Drag file → Ask question → Get chart. Done.

The demo GIF shows a real scenario: a Shopify owner whose profit dropped 32% in June-July. She uploads her sales CSV, asks "Why did my profit drop?", and in 10 seconds the AI shows: Nevada returns spiked, shipping doubled, discounts ate margins.

Tech stack: Next.js + DeepSeek + Recharts. Deployed on Vercel. Files never touch a database — everything is in-memory and discarded after the request.

I'd love your feedback, your brutal honesty, and your upvotes if you think this is useful! 🙏

P.S. — The first 50 people who comment "data" get a free month of Pro. Just DM me on Twitter @[your-handle] after commenting.
```

---

## 四、截图计划（5 张静态图 + 1 个 GIF）

### 截图 1：Landing Page Hero
- 展示首页 Hero 区域
- 清爽的标题 + CTA 按钮
- **卖点**：专业感、不复杂

### 截图 2：Upload Flow
- 拖拽文件上传后的状态
- 显示文件名、列数、行数、数据预览表格
- **卖点**：所见即所得，上传即预览

### 截图 3：Ask Question → Result
- 侧边是数据预览，中间一个输入框写着 "Which product category has the highest profit margin?"
- 下面是 AI 回答 + 柱状图
- **卖点**：一句话出图，零学习成本

### 截图 4：Multi-chart View
- 展示一个分析结果带饼图和折线图
- **卖点**：AI 自动判断用什么图表类型

### 截图 5：Pricing Page
- Free / Pro ($15/mo) / Business ($49/mo)
- **卖点**：Freemium，有付费意愿信号

### GIF（最重要！）：完整演示
- 见下文「录屏脚本」

---

## 五、录屏脚本（30-40 秒 GIF）

### 准备
1. 打开 Chrome 无痕窗口（清除 Cookie，确保干净）
2. 打开 `http://localhost:3000`
3. 准备好 `demo-ecommerce-sales.csv` 在桌面上
4. 打开录屏工具（推荐 Screen Studio 或 OBS）

### 脚本（按时间线）

| 时间 | 画面 | 操作 |
|------|------|------|
| 0:00 | Landing page hero | 展示首页，鼠标缓慢划过标题 |
| 0:05 | Click "Get Started" / "Try Free" | 跳转到 Dashboard |
| 0:08 | Drag & drop | 从桌面拖拽 `demo-ecommerce-sales.csv` 到上传区 |
| 0:12 | File loaded | 显示文件信息：752 rows, 16 columns + 数据预览 |
| 0:15 | Click query input | 光标定位到输入框 |
| 0:17 | Type question | 输入：`Why did my profit per order drop from ~$48 to ~$27 in June-July? Show me the key reasons with charts.` |
| 0:22 | Press Enter | 加载动画 |
| 0:24 | Results appear | AI 回答：3 个原因，带饼图和柱状图 |
| 0:30 | Scroll results | 慢慢滚动，展示图表 |
| 0:35 | Zoom out / fade | 展示 logo + "DataAnalyzer AI" + URL |

### 关键要求
- **速度**：鼠标移动不要太快，让观众能跟上
- **不要出现 Cursor/VSCode**：全程在浏览器内操作
- **URL 栏要干净**：用 localhost 或者已部署的生产 URL
- **GIF 分辨率**：1200x800 或 1280x800
- **帧率**：15fps 够了，重点是清晰

---

## 六、发布 Checklist

### 发布前 3 天
- [ ] 部署到 Vercel（生产环境 URL）
- [ ] 配置域名
- [ ] 设置 Clerk production 环境
- [ ] 设置 DeepSeek API Key 在 Vercel 环境变量
- [ ] 创建 Product Hunt 账号（如果还没有）
- [ ] 准备 Twitter/LinkedIn 发布贴

### 发布前 1 天
- [ ] 在 Product Hunt 创建 "Coming Soon" 页面
- [ ] 录制 GIF（按上面的脚本）
- [ ] 截 5 张静态图
- [ ] 写 First Comment（上面已经写好了）
- [ ] 准备好 Product Hunt 的 Maker 简介

### 发布时间
- **最佳**：周二/周三 太平洋时间 00:01 AM（美西凌晨）
- **对应北京时间**：周二/周三 下午 3:01 PM
- **次选**：周四 太平洋时间 00:01 AM

### 发布日
- [ ] 00:01 AM PT 发布
- [ ] 立刻发 First Comment
- [ ] 发 Twitter 帖
- [ ] 发 LinkedIn 帖
- [ ] 发 Reddit：r/SaaS、r/SideProject、r/DataIsBeautiful
- [ ] 发 Hacker News Show HN
- [ ] DM 之前收集的早期用户让他们去投票
- [ ] 回复每一个 Product Hunt 评论（当天不要睡！）

### 发布后
- [ ] 写 Thank-you 邮件给投票用户
- [ ] 分析 Product Hunt 流量 → 注册转化率
- [ ] 收集用户反馈
- [ ] 总结发布复盘文档

---

## 七、Social Media 文案

### Tweet 1（发布前预热）
```
I built something.

Upload a CSV → ask a question in plain English → get charts.

No Excel. No pivot tables. No prompt engineering.

Launching on @ProductHunt tomorrow. 🚀
```

### Tweet 2（发布时刻）
```
🚀 LIVE on Product Hunt!

DataAnalyzer AI — chat with your spreadsheets.

Drop a CSV, ask "Which product has the highest margin?", and get a chart in seconds.

Powered by DeepSeek. Free tier: 3 analyses/day.

Check it out 👇
[Product Hunt link]
```

### LinkedIn
```
I'm launching my first SaaS on Product Hunt today — DataAnalyzer AI.

The problem: business owners sit on hundreds of CSV files but can't extract insights without an analyst or Excel wizardry.

The solution: upload a file, ask a question in plain English, and get charts and answers in seconds.

Free tier: 3 analyses/day. Pro: $15/mo unlimited.

Would mean a lot if you checked it out and dropped a vote 🙏

[Product Hunt link]
```

---

## 八、演示用数据文件

`demo-ecommerce-sales.csv` — 752 笔订单，7 个月电商销售数据。

包含的列：order_id, date, customer_email, product, category, quantity, unit_price, discount_pct, revenue, cogs, shipping_cost, returned, region, marketing_channel, customer_acquisition_cost, is_repeat_customer

**演示用问题**（Product Hunt GIF 里展示哪个都可以）：

| 问题 | 预期 AI 回答 |
|------|-------------|
| `Why did my profit per order drop from ~$48 to ~$27 in June-July?` | Nevada Electronics 退货率 18%、International 运费翻倍、Fashion 折扣 35% |
| `Which product category has the highest profit margin?` | 柱状图：各品类利润率对比 |
| `Show monthly revenue and profit trend` | 折线图：收入上升但利润下降（剪刀差） |
| `What percentage of orders are returned by region?` | 饼图：各区域退货占比 |
| `Which marketing channel has the best ROI?` | 柱状图：各渠道 CAC vs Revenue |
