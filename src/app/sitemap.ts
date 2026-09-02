import type { MetadataRoute } from "next";

const BASE_URL = "https://nocodecsv.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // 各页面使用真实最后修改日期，避免误导搜索引擎反复抓取未变化页面
  const homeLastModified = new Date();
  const seoLastModified = "2026-08-04";

  return [
    { url: BASE_URL, lastModified: homeLastModified, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/pricing`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },

    // SEO 工具页
    { url: `${BASE_URL}/tools/csv-analyzer`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/excel-data-analysis`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/spreadsheet-charts`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },

    // 博客文章（按各自发布日期）
    { url: `${BASE_URL}/blog/how-to-analyze-csv-with-ai-free`, lastModified: "2026-08-01", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/best-ai-tools-for-excel-analysis`, lastModified: "2026-08-01", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/ai-data-visualization-guide`, lastModified: "2026-08-02", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/spreadsheet-automation-with-ai`, lastModified: "2026-08-02", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/free-alternative-to-chatgpt-code-interpreter`, lastModified: "2026-08-03", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/merge-csv-files-free`, lastModified: "2026-08-30", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/csv-to-json-free-online`, lastModified: "2026-08-30", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/excel-formula-generator-ai`, lastModified: "2026-08-30", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/how-to-clean-dirty-csv-data`, lastModified: "2026-08-31", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/free-csv-viewer-online`, lastModified: "2026-08-31", changeFrequency: "monthly" as const, priority: 0.7 },

    { url: `${BASE_URL}/blog/analyze-survey-data-csv-with-ai`, lastModified: "2026-09-01", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/import-csv-to-sqlite-free`, lastModified: "2026-09-01", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/visualize-sales-data-csv`, lastModified: "2026-09-02", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/convert-csv-to-excel-without-excel`, lastModified: "2026-09-02", changeFrequency: "monthly" as const, priority: 0.7 },
    // 法律页面
    { url: `${BASE_URL}/privacy`, lastModified: "2026-08-01", changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: "2026-08-01", changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
