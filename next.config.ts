import type { NextConfig } from "next";

// C28: 安全响应头（SEO/GEO 结构检查项）
// CSP 先用 Report-Only 上线：不阻断任何请求，只上报，确认无副作用后再切换为正式 CSP。
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://api.deepseek.com https://vitals.vercel-insights.com",
  "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  // HSTS —— 强制 HTTPS（含子域，preload 便于进入浏览器预载列表）
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // 防 MIME 嗅探
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 防点击劫持（与 CSP frame-ancestors 双保险）
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // 控制 Referer 泄漏
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // CSP（先 Report-Only）
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
  // 最小权限
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
