import type { NextConfig } from "next";

// C28: 安全响应头（SEO/GEO 结构检查项）
// CSP 先用 Report-Only 上线：不阻断任何请求，只上报，确认无副作用后再切换为正式 CSP。
// WebMCP 源试验令牌(2026-09-18 注册)
//   · 绑定 origin:https://nocodecsv.com   · 功能:WebMCP   · 到期:2026-11-17
//   · 作用:让 Chrome 在该域名上启用 WebMCP —— 页面上的 <form toolname="…"> 才会被识别为 AI 可调用工具
//   · 续期或换域名:重新在 developer.chrome.com/origintrials 注册,替换下面这串
const WEBMCP_TRIAL_TOKEN =
  "AiO4UfD2GWVo9+dSMcLeP6XnyubzoSy/m1BpaviiEstK28uCJjfea4n3E+G5J5crsoOSssnpZAEDfRupLKoDUwMAAABNeyJvcmlnaW4iOiJodHRwczovL25vY29kZWNzdi5jb206NDQzIiwiZmVhdHVyZSI6IldlYk1DUCIsImV4cGlyeSI6MTc5NDg3MzYwMH0=";

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
  // WebMCP 源试验令牌:全站下发,使 Chrome 启用 WebMCP(未启用该特性的浏览器会忽略此头)
  { key: "Origin-Trial", value: WEBMCP_TRIAL_TOKEN },
];

const nextConfig: NextConfig = {
  // 短链:引用邀约用 —— 点开即把对方(omnibound)联系表单的字段全部预填好
  // 生成脚本: /opt/data/scripts/_make_prefill_link.py
  async redirects() {
    return [
      {
        source: "/omnibound",
        destination:
          "https://www.omnibound.ai/contact-us?full_name=Cindy+Liao&email=info%40nocodecsv.com&company=NoCodeCSV&what_can_we_help_you_with=General+Inquiry&message=Hi+Omnibound+team%2C%0A%0AI+read+your+agentic+marketing+statistics+piece+-+the+section+built+on+Gartner%27s+paywalled%0Aprojections+is+one+of+the+few+that+separates+vendor-reported+figures+from+official+surveys.%0A%0AI+put+together+a+page+of+statistics+on+AI+and+data+analysis+where+every+figure+links+to+the%0Aorganisation+that+published+it%2C+with+its+scope+and+year+stated+-+a+free%2C+source-linked%0Aalternative+to+the+paywalled+analyst+numbers%3A%0A%0Ahttps%3A%2F%2Fnocodecsv.com%2Fai-analytics-statistics%0A%0ATwo+examples%3A+20.0%25+of+EU+enterprises+used+AI+in+2025+%28Eurostat%2C+official+survey%29%2C+and+18%25+of%0AUS+firms+used+it+in+at+least+one+business+function+%28US+Census%2C+2026%29+-+against+78%25+in%0Aself-reported+global+surveys.+The+gap+is+scope%2C+not+disagreement.%0A%0AFree+to+use%2C+no+attribution+required.+If+a+figure+looks+wrong%2C+tell+me+and+I+will+correct+it.%0A%0ABest%2C%0ACindy%0ANoCodeCSV%0Ahttps%3A%2F%2Fnocodecsv.com%2Fai-analytics-statistics",
        permanent: false,
      },
    ];
  },
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
