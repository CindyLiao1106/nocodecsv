# SEO 夜间任务指令

你是一名资深 SEO 工程师，正在优化 **nocodecsv.com**（Next.js 16 项目，站点根目录即本目录）。请按以下流程**自主执行**，直到全部完成。你正处于无人值守模式，**不要停下来向我询问任何问题**。

## 任务清单

### 1. Sitemap 同步（最高优先级）
- 扫描 `src/app` 下所有页面路由（含 `page.tsx`）和 `src/app/blog/*/` 下的所有博客文章
- 更新 `src/app/sitemap.ts`，确保包含**所有**可索引页面，没有任何遗漏或失效 URL
- 新增页面时按现有格式补充 `url` / `lastModified` / `changeFrequency` / `priority`
- 检查 URL 是否与现有路由一致，发现失效 URL 立即移除

### 2. Metadata 检查与修复
对 `src/app/layout.tsx` 和每个页面的 `export const metadata` 逐页检查并修复：
- **title**：60 字符以内，自然包含核心关键词（如 CSV analyzer、Excel analysis、AI data）
- **description**：150 字符以内，包含关键词和行动号召
- **canonical**：页面指向 `https://nocodecsv.com/<路径>` 的规范链接
- **openGraph**：title / description / type / url / siteName 完整
- **twitter card**：补充 `summary_large_image` 类型
- 为每个页面生成独立的 `generateMetadata`（不要所有页面共用根布局的 title/description）

### 3. 结构化数据（JSON-LD）
- 博客文章页：添加 **Article** 类型 JSON-LD（headline、datePublished、author、description）
- 首页：添加 **WebSite + SoftwareApplication** 类型 JSON-LD（关于产品，抓取页面真实信息）
- 工具页：添加 **SoftwareApplication** 类型 JSON-LD

### 4. 内链优化
- 检查每篇博客文章正文是否链向其他博客文章或工具页
- 每篇文章补充 **2-3 个**语义相关的自然内链（用中文锚文本也可，但保持页面语言一致）
- 首页/工具页如果缺内链，补充相关引导

### 5. 图片 alt 检查
- 扫描所有页面中的 `<img>`，确保每个都有描述性 `alt` 属性
- 缺失的补上，空的补上

### 6. IndexNow 收录推送
- 运行 `powershell -ExecutionPolicy Bypass -File scripts/seo/push-indexnow.ps1` 将全部 URL 推送给 Bing
- 确认输出 "推送成功 (HTTP 200/202)"，若推送失败说明 key 文件未部署，提示用户

### 7. 构建验证
- 运行 `pnpm build`，确保 TypeScript 类型检查 + 生产构建全部通过
- 若失败，阅读错误信息并修复，重新构建，**直到成功为止**

### 8. Git 提交
- 构建通过后，`git add` 全部改动并 commit，提交信息格式：
  ```
  seo(nightly): <简述本轮改动>
  ```
- 若确认没有任何改动，输出"无变更"，**不要**创建空提交

## 完成标准
- `pnpm build` 100% 通过
- sitemap 覆盖所有可索引页面
- 每个页面 metadata 合规（title ≤ 60 / description ≤ 150 / OG / twitter）
- JSON-LD 结构化数据已就位
- IndexNow 推送成功（HTTP 200/202）
- 改动已 commit（或确认无变更）

## 输出
最后输出一段简短总结（中文）：
1. 本轮修复/改进了哪些问题
2. 修改了哪些文件（清单）
3. `pnpm build` 是否通过
4. commit hash（如有）
