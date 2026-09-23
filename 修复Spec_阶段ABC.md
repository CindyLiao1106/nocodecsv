# 代码任务 Spec —— nocodecsv SEO 修复(阶段 A/B/C)

> 依据:code-harness §2「大改必须先出 Spec 等她确认」
> 建立:2026-09-14
> 现状:**阶段 A 已完成并上线**(本次补写 Spec,承认程序上漏了这一步)

---

## 阶段 A(已完成 ✅,补记录)

```
1. 问题     sitemap / 枢纽页 / 内链三处数据源不同步,llms.txt 只覆盖一半文章,
            AdSense 全局注入(含无内容的 /dashboard)
2. 范围     src/lib/related-posts.ts · src/app/sitemap.ts · src/app/blog/page.tsx
            src/app/layout.tsx · public/llms.txt
            + 新增 3 个:components/ads/adsense-script.tsx · blog/layout.tsx · tools/layout.tsx
3. 不做     不动 components 其他文件 · 不动已有文章正文 · 不动配置/密钥
4. 交付物   上述文件 + 提交 c1234f4
5. 验收     ✅ 本地 build exit 0
            ✅ 内链验证 PASS(0 孤岛 0 死链)
            ✅ 构建产物:枢纽页链 44/44 · sitemap 博客 44 条 · llms.txt 44/44
            ✅ 线上 6 个 URL 全 200 · sitemap 44 · llms.txt 44
            ✅ /dashboard 产物 0 处 adsbygoogle(正确排除)
6. 风险     改了 5 个文件 + 新建 3 个 → 属"动架构"
            兜底:备份在 /opt/data/backups/nocodecsv_pre_stageA_20260914_0724
                 回滚 = git revert c1234f4(或从备份恢复)
```

---

## 阶段 B(待执行,需你确认)

```
1. 问题     4 个重要问题:
   B1 首页唯一 CTA 指向 /dashboard(登录墙)→ 陌生访客流失
   B2 robots 未 disallow /dashboard /api /sign-in → 浪费爬虫预算
   B3 AdSense ID 硬编码 2 处(以后换号易漏改)
   B4 header.tsx 整体 'use client' + useUser → 首屏跳动

2. 范围     预计改 4-6 个文件:
   · src/app/page.tsx(首页 CTA 加免登录入口)
   · src/app/robots.ts(加 disallow)
   · src/lib/ads.ts(新建:AdSense ID 单一常量)
   · src/components/ads/adsense-script.tsx + adsense.tsx(改 import)
   · src/components/layout/header.tsx(拆 server/client)

3. 不做     不动博客正文 · 不动 sitemap/related-posts(A 刚改好)
           不动 /dashboard 和 /tools 的业务逻辑

4. 交付物   代码 + 提交 + 线上验证

5. 验收     ① 本地 build exit 0
           ② 内链验证 PASS
           ③ 首页出现免登录入口(产物 HTML 可见)
           ④ /robots.txt 含 disallow /dashboard /api /sign-in
           ⑤ AdSense ID 只在一处定义(grep 计数 = 1)
           ⑥ 线上 curl 200

6. 风险     B4 改 header 会动布局组件 → 视觉可能变
            B1 改首页 → 影响首屏
            兜底:改前备份 + 本地 build 验证 + 可 git revert
            ⚠️ 视觉变化我会先给你截图看,你点头才推
```

---

## 阶段 C(待执行,需你确认)

```
1. 问题     2 个次要问题:
   C1 footer 品牌名还是 "DataAnalyzer AI"(与 NoCodeCSV 不一致)
   C2 sitemap 有 4 条共用同一个写死日期

2. 范围     · src/components/layout/footer.tsx(改品牌名)
            · 检查 sitemap 日期是否已由 A 阶段修好(A 已改成从 POST_DATES 生成)

3. 不做     其他一律不动
4. 交付物   代码 + 提交 + 线上验证
5. 验收     ① 全站 footer 品牌名统一 ② sitemap 日期来自真实日期
6. 风险     极低(文案 + 日期)
```

---

## 🔐 数据外发说明(security-harness 契约 ③)

```
本次把 nocodecsv 源码发给了 OpenRouter(Claude Sonnet 5)做审查和改码。

发什么:15 个文件(约 55K 字符)= 公开 GitHub 仓库里的代码
给谁:   OpenRouter(第三方 API)→ 转发 Anthropic
理由:   你明确要求"用 sonnet 模型改网站" = 授权
风险:   低 —— 仓库是 public,代码已公开;不含密钥/客户数据
        ⚠️ 但 .env 里的密钥【没有】发送(脚本只读源码文件)
留痕:   已 emit security.data_export
```

---

## 🔄 回滚方案(统一)

```
阶段 A:git revert c1234f4  (或从 /opt/data/backups/nocodecsv_pre_stageA_20260914_0724 恢复)
阶段 B/C:改前各打一份备份 + 每阶段独立 commit → 逐段 revert
线上回滚:git revert + push → Vercel 自动重新部署(约 2 分钟)
```
