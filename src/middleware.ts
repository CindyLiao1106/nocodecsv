import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * ⚠️ 重要（2026-09-17，别改回去）：matcher 只允许匹配"真的需要登录态"的路由。
 *
 * 原因（这是 Google 一直不收录本站的根因）：
 *   Clerk 中间件一旦作用在**公开页面**上，它会对没有 Clerk cookie 的请求（包括 Googlebot）
 *   返回 handshake 响应，而那个响应带 `X-Robots-Tag: noindex, nofollow`。
 *   Google 抓到时就会记成「Excluded by 'noindex' tag」→ 页面永远进不了索引。
 *   （外部用 curl 测不出来，因为不带 cookie 的普通请求命中 Vercel 缓存、根本不会跑中间件。）
 *
 * 修复方式：把 matcher 收窄到下面的受保护路由。公开页（/ · /blog* · /tools/* ·
 *   /ai-analytics-statistics · /pricing · /about · /privacy 等）不再经过 Clerk，
 *   因此不会再返回 noindex 头。
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/analyze(.*)",
  "/api/usage(.*)",
  "/api/admin(.*)",
  "/api/paypal(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      const { userId, redirectToSignIn } = await auth();
      if (!userId) {
        return redirectToSignIn({ returnBackUrl: req.url });
      }
    }
  },
  { signInUrl: "/sign-in", signUpUrl: "/sign-up" }
);

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/api/analyze(.*)",
    "/api/usage(.*)",
    "/api/admin(.*)",
    "/api/paypal(.*)",
  ],
};
