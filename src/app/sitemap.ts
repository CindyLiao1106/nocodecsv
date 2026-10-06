import type { MetadataRoute } from "next";
import { ALL_POST_SLUGS, POST_DATES } from "@/lib/related-posts";

const BASE_URL = "https://nocodecsv.com";

/**
 * 真实的最后修改日期（2026-10-06 用 `git log -1 --format=%cs -- <文件>` 逐页核对后改正）。
 *
 * 为什么改：原来 /pricing 和 6 个工具页共用一个写死的 "2026-08-04"，
 * 但它们的真实改动日期都比这个晚（最晚 2026-10-05）—— 而 /pricing 在 Google
 * 那边的记录还停在「2026-08-04 抓到时带 noindex」。
 * lastmod 落后于真实改动 = 页面改了却没告诉搜索引擎，它就不来重抓。
 *
 * 维护方式（改完某个页面顺手做一行）：
 *   git log -1 --format=%cs -- src/app/<路径>/page.tsx
 * 把结果填进这张表。没登记的页面退回 POST_DATES（博客发布日期）。
 *
 * 例外：首页仍用构建时间（new Date()）—— 它是全站入口，每次发布都值得让
 * 搜索引擎重看一眼；其余页面一律用真实改动日期，避免「没改却说改了」。
 */
const UPDATED: Record<string, string> = {
  "/pricing": "2026-09-16",
  "/blog": "2026-09-14",
  "/tools/csv-analyzer": "2026-10-05",
  "/tools/csv-delimiter-converter": "2026-09-19",
  "/tools/csv-splitter": "2026-09-19",
  "/tools/json-csv-converter": "2026-09-19",
  "/tools/excel-data-analysis": "2026-10-05",
  "/tools/spreadsheet-charts": "2026-09-11",
  "/ai-analytics-statistics": "2026-09-20",
  "/agent-ready": "2026-09-23",
  "/privacy": "2026-09-11",
  "/terms": "2026-09-11",
  "/contact": "2026-09-13",
  // 2026-09-12 改过正文（原来是 08-01 的发布日）
  "/blog/how-to-analyze-csv-with-ai-free": "2026-09-12",
};

/** 取真实改动日期；没登记的退回 fallback（博客用发布日期）。 */
const at = (path: string, fallback: string) =>
  `${UPDATED[path] ?? fallback}T00:00:00.000Z`;

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLastModified = new Date();

  // 博客文章：单一数据源 ALL_POST_SLUGS + POST_DATES，杜绝漏 slug
  const blogPosts: MetadataRoute.Sitemap = ALL_POST_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: at(`/blog/${slug}`, POST_DATES[slug] ?? "2026-08-01"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: homeLastModified, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/pricing`, lastModified: at("/pricing", "2026-08-04"), changeFrequency: "monthly" as const, priority: 0.8 },

    // 博客枢纽页（所有文章的入口，被抓取的必经节点）
    { url: `${BASE_URL}/blog`, lastModified: at("/blog", "2026-09-12"), changeFrequency: "weekly" as const, priority: 0.8 },

    // SEO 工具页
    { url: `${BASE_URL}/tools/csv-analyzer`, lastModified: at("/tools/csv-analyzer", "2026-08-04"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/csv-delimiter-converter`, lastModified: at("/tools/csv-delimiter-converter", "2026-08-04"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/csv-splitter`, lastModified: at("/tools/csv-splitter", "2026-08-04"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/json-csv-converter`, lastModified: at("/tools/json-csv-converter", "2026-08-04"), changeFrequency: "monthly" as const, priority: 0.8 },

    // 引用枢纽页（统计数据页，赚免费外链的核心资产）
    { url: `${BASE_URL}/ai-analytics-statistics`, lastModified: at("/ai-analytics-statistics", "2026-09-14"), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/agent-ready`, lastModified: at("/agent-ready", "2026-09-18"), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/tools/excel-data-analysis`, lastModified: at("/tools/excel-data-analysis", "2026-08-04"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/spreadsheet-charts`, lastModified: at("/tools/spreadsheet-charts", "2026-08-04"), changeFrequency: "monthly" as const, priority: 0.8 },

    // 博客文章（按各自发布日期，来自 src/lib/related-posts.ts 的单一数据源）
    ...blogPosts,

    // 法律页面
    { url: `${BASE_URL}/privacy`, lastModified: at("/privacy", "2026-08-01"), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: at("/terms", "2026-08-01"), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: at("/contact", "2026-09-13"), changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
