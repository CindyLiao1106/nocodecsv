import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/sign-in", "/sign-up", "/api", "/account"],
      },
      // 显式欢迎 AI 助手/agent 抓取(2026-09-18):站点的目标是"agent 可读、可访问、可调用"
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "meta-externalagent",
          "cohere-ai",
          "Bytespider",
          "Amazonbot",
        ],
        allow: "/",
        disallow: ["/dashboard", "/sign-in", "/sign-up", "/api", "/account"],
      },
    ],
    sitemap: "https://nocodecsv.com/sitemap.xml",
  };
}
