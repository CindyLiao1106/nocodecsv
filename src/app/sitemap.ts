import type { MetadataRoute } from "next";

const BASE_URL = "https://nocodecsv.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: BASE_URL, lastModified, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/dashboard`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },

    // SEO 工具页
    { url: `${BASE_URL}/tools/csv-analyzer`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/excel-data-analysis`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/spreadsheet-charts`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },

    // 博客文章
    { url: `${BASE_URL}/blog/how-to-analyze-csv-with-ai-free`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/best-ai-tools-for-excel-analysis`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/ai-data-visualization-guide`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/spreadsheet-automation-with-ai`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/free-alternative-to-chatgpt-code-interpreter`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },

    // 法律页面
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
