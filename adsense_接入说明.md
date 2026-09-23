# AdSense 接入说明(nocodecsv)

> **状态**:代码已就绪,等你拿到发布商 ID 填一个环境变量即可生效
> **完成**:2026-09-13

---

## 一、已经做好的

```
✅ /contact 页面(AdSense 要求有联系方式页)
   → 含 4 类联系主题 + 隐私/条款内链 + ContactPage 结构化数据
   → 已接进页脚导航 + sitemap.xml

✅ AdSense 组件 src/components/ads/adsense.tsx
   → 用环境变量控制:没配置就不渲染(不留空框)
   → 防止重复 push 的报错
   → 支持 in-article / banner / responsive 三种

✅ AdSense 脚本已接进 layout.tsx
   → 只有配置了 NEXT_PUBLIC_ADSENSE_CLIENT 才加载
   → 用 next/script 的 afterInteractive 策略(不拖慢首屏)

✅ 站点基础已达标:
   /about ✅  /privacy ✅  /terms ✅  /contact ✅(新增)
   42 篇博客 ← 内容丰富,通过率高
```

---

## 二、你需要做的(3 步)

### 第 1 步:申请 AdSense(10 分钟)

```
1. 打开 adsense.google.com → 用你的 Google 账号登录
2. 填网站地址:nocodecsv.com
   国家/地区:选你的收款地区
3. 接受条款 → 提交申请
4. 等审核(通常 3 天 - 2 周)

⚠️ 审核期间:
   · 它会给一段验证代码 → 你不用管,我已经把机制做好了
   · 只要告诉我你的 ID,我自动接上
```

### 第 2 步:拿到发布商 ID

```
审核通过后,在 AdSense 后台右上角能看到:
  ca-pub-XXXXXXXXXXXXXXXX

把这个发我
```

### 第 3 步:我配置 + 部署

```
① 我把它写进 .env.local:NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXX
② 建 3 个广告位(在 AdSense 后台创建 ad unit,拿到 slot ID):
   · 博客文章中间(in-article)
   · 博客文章底部
   · 工具页面下方
③ 我把 slot ID 填进页面
④ 推送部署
```

---

## 三、广告位规划(我的建议)

```
【博客文章页】(42 篇,收入主力)
  · 文章开头下方   → 1 个 in-article
  · 文章中间       → 1 个 in-article(长文才放)
  · 文章末尾       → 1 个 banner
  
【首页】
  · 工具区下方     → 1 个 banner
  · 不放首屏!     ← 影响转化,而且 AdSense 也不喜欢

【dashboard(工具页)】
  · 只在结果区下方放 1 个
  · 分析过程中不放(会干扰使用)

⛔ 不要做(会被封号或降权):
  · 弹窗广告 · 自动播放视频广告 · 遮挡内容
  · 自己点自己的广告(必封!)
  · 超过 3 个广告位挤在一起
```

---

## 四、⚠️ 关于收入预期(必须说实话)

```
AdSense 收入 = 流量 × 点击率 × 单次点击收益

nocodecsv 这类"数据工具"内容:
  · 每 1000 次浏览大约 $1-8(要看地区,欧美流量高)
  · 点击率通常 0.5%-2%
  
举例:
  每月 1 万浏览 → 约 $10-80/月
  每月 10 万浏览 → 约 $100-800/月

→ 结论:【流量才是关键,不是广告本身】
   没有流量,装 AdSense 一个月可能只有 $1-2

★ 所以正确顺序:
   ① 先做内容和 SEO/GEO(我们正在做的 Citation Hub 就是这个)
   ② 流量起来后 AdSense 才有意义
   ③ AdSense 是【顺带的收入】,不是目标
```

**另一个更值钱的思路**:
```
nocodecsv 目前是免费工具 → 有流量后,卖 Pro 订阅
  比 AdSense 赚钱多得多(AdSense $5/千人 vs 订阅 $15/月/人)
  
→ 建议:AdSense 先装上(有总比没有好),
        重心还是放【订阅转化 + 流量增长】
```

---

## 五、环境变量(给你参考)

```bash
# .env.local
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

配好后:
```
· AdSense 脚本自动加载
· 页面上配置了 slot 的广告位自动显示
· 没配 slot 的地方不显示(不留空框)
· 本地开发时不显示(不影响你调试)
```
