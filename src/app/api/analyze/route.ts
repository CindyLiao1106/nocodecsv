import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import { extractChartData, cleanAnswer } from "@/lib/ai";
import { buildAnalyzePrompt } from "@/lib/analyze-shared";
import { acquireSlot, settleSlot, releaseSlot, getQuota, DAILY_FREE_LIMIT } from "@/lib/quota";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Please sign in to analyze data." }, { status: 401 });
  }

  // 请求体大小上限(防超大 body 滥用;截断在下游仍会执行)
  const raw = await req.text();
  if (raw.length > 2_000_000) {
    return NextResponse.json({ error: "File too large. Please split the file first." }, { status: 413 });
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
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }

  // 配额占位:原子自增(有 Upstash)或单飞互斥(降级)—— 见 lib/quota.ts 说明
  let slot: Awaited<ReturnType<typeof acquireSlot>>;
  try {
    slot = await acquireSlot(userId);
  } catch (err) {
    console.error("Quota acquire failed:", err);
    return NextResponse.json({ error: "Could not verify your usage. Please retry." }, { status: 503 });
  }
  if (!slot.ok) {
    const q = await getQuota(userId).catch(() => null);
    return NextResponse.json(
      {
        error: slot.reason === "busy"
          ? "Another analysis is still running for your account. Please wait a moment and retry."
          : `You've reached the daily limit of ${DAILY_FREE_LIMIT} free analyses. Upgrade to Pro for unlimited use.`,
        usage: q
          ? { used: q.used, remaining: q.remaining, limit: q.limit, isPro: q.isPro, isSignedIn: true }
          : { used: 0, remaining: 0, limit: DAILY_FREE_LIMIT, isPro: false, isSignedIn: true },
      },
      { status: slot.reason === "busy" ? 409 : 429 }
    );
  }

  // 截断 + 构建 prompt:与免注册通道 /api/analyze-guest 共用 lib/analyze-shared.ts
  // (同一套截断规则 + 同一套提示注入防护;分成两份迟早会漂移,一条修了另一条没修)
  const { system } = buildAnalyzePrompt(csvContent);

  try {
    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      system,
      prompt: question,
    });

    const chart = extractChartData(text);
    const answer = cleanAnswer(text);

    // 成功后才结算(F2:失败不白扣次数;原子模式下这步为空操作)
    await settleSlot(userId, true).catch(() => {});

    const q = await getQuota(userId).catch(() => null);
    return NextResponse.json({
      answer,
      chart,
      usage: q
        ? { used: q.used, remaining: q.remaining, limit: q.limit, isPro: q.isPro, isSignedIn: true }
        : { used: 0, remaining: 0, limit: DAILY_FREE_LIMIT, isPro: false, isSignedIn: true },
    });
  } catch (err) {
    // 失败:释放占位(原子模式回滚计数;降级模式只清 in-flight)
    await releaseSlot(userId).catch(() => {});
    await settleSlot(userId, false).catch(() => {});
    console.error("Analyze error:", err);
    return NextResponse.json({ error: "Analysis failed. Please retry." }, { status: 500 });
  }
}
