import { NextRequest, NextResponse } from "next/server";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import { extractChartData, cleanAnswer } from "@/lib/ai";
import { buildAnalyzePrompt } from "@/lib/analyze-shared";
import {
  checkGuestQuota,
  releaseGuest,
  clientIp,
  GUEST_DAILY_LIMIT,
  GUEST_MAX_CSV_CHARS,
} from "@/lib/guest-quota";

/**
 * /api/analyze-guest —— 免注册试用通道(2026-10-05)
 *
 * 为什么存在:站上首页与 /tools/csv-analyzer 从 9 月起就写着
 * 「Try the free CSV analyzer — no account needed」,但 /dashboard 一直由 Clerk
 * 保护 —— 文案承诺了、功能不存在。搜索里正好有一批人搜
 * "ai csv analyzer ... no signup no account",点进来撞上登录墙就走。
 * 这里把承诺兑现:不登录、不填邮箱,一样能跑分析。
 *
 * 与 /api/analyze(登录版)的关系:
 *   共用 src/lib/analyze-shared.ts 的截断规则与提示词(=同一套注入防护),
 *   差别只有三处 —— 用量按 IP 记(而不是按 Clerk userId)、每天 2 次(登录是 3 次)、
 *   请求体上限更小(200k 字符 vs 2MB)。
 *
 * ⚠️ 不放在 middleware 的 matcher 里:这样这个路由完全不经过 Clerk,
 *    公开页也就不会被 Clerk 的 handshake 加 noindex 头(见 middleware.ts 顶部注释)。
 */
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > GUEST_MAX_CSV_CHARS + 10_000) {
    return NextResponse.json(
      { error: "File too large for the no-signup preview. Split the file first, or sign in free to analyze up to 25MB." },
      { status: 413 }
    );
  }

  let payload: { csvContent?: string; question?: string };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { csvContent, question } = payload;
  if (!csvContent || !question) {
    return NextResponse.json({ error: "CSV content and question are required." }, { status: 400 });
  }
  if (csvContent.length > GUEST_MAX_CSV_CHARS) {
    return NextResponse.json(
      { error: "File too large for the no-signup preview. Split the file first, or sign in free to analyze up to 25MB." },
      { status: 413 }
    );
  }
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }

  const ip = clientIp(req);
  const quota = await checkGuestQuota(ip);
  if (!quota.ok) {
    return NextResponse.json(
      {
        error: quota.error,
        usage: { used: GUEST_DAILY_LIMIT, remaining: 0, limit: GUEST_DAILY_LIMIT, isPro: false, isSignedIn: false },
      },
      { status: quota.status }
    );
  }

  const { system } = buildAnalyzePrompt(csvContent);

  try {
    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      system,
      prompt: question,
    });

    const chart = extractChartData(text);
    const answer = cleanAnswer(text);
    const remaining = Math.max(0, GUEST_DAILY_LIMIT - quota.used);

    return NextResponse.json({
      answer,
      chart,
      guest: true,
      usage: {
        used: quota.used,
        remaining,
        limit: GUEST_DAILY_LIMIT,
        isPro: false,
        isSignedIn: false,
      },
    });
  } catch (err) {
    await releaseGuest(ip).catch(() => {});
    console.error("Guest analyze error:", err);
    return NextResponse.json({ error: "Analysis failed. Please retry." }, { status: 500 });
  }
}
