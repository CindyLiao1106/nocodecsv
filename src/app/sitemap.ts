import type { MetadataRoute } from "next";
import { ALL_POST_SLUGS, POST_DATES } from "@/lib/related-posts";

const BASE_URL = "https://nocodecsv.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // 各页面使用真实最后修改日期，避免误导搜索引擎反复抓取未变化页面
  const homeLastModified = new Date();
  const seoLastModified = "2026-08-04T00:00:00.000Z";

  // 博客文章：单一数据源 ALL_POST_SLUGS + POST_DATES，杜绝漏 slug
  const blogPosts: MetadataRoute.Sitemap = ALL_POST_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: `${POST_DATES[slug] ?? "2026-08-01"}T00:00:00.000Z`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: homeLastModified, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/pricing`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },

    // 博客枢纽页（所有文章的入口，被抓取的必经节点）
    { url: `${BASE_URL}/blog`, lastModified: "2026-09-12T00:00:00.000Z", changeFrequency: "weekly" as const, priority: 0.8 },

    // SEO 工具页
    { url: `${BASE_URL}/tools/csv-analyzer`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/csv-delimiter-converter`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/csv-splitter`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },

    // 引用枢纽页（统计数据页，赚免费外链的核心资产）
    { url: `${BASE_URL}/ai-analytics-statistics`, lastModified: "2026-09-14T00:00:00.000Z", changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/tools/excel-data-analysis`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/spreadsheet-charts`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },

    // 博客文章（按各自发布日期，来自 src/lib/related-posts.ts 的单一数据源）
    ...blogPosts,

    // 法律页面
    { url: `${BASE_URL}/privacy`, lastModified: "2026-08-01T00:00:00.000Z", changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: "2026-08-01T00:00:00.000Z", changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: "2026-09-13T00:00:00.000Z", changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
