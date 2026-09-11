import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import { extractChartData, cleanAnswer } from "@/lib/ai";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: "https://api.deepseek.com",
});

const DAILY_FREE_LIMIT = 3;

/** 截断 CSV 到合理大小 */
function truncateCSV(csvContent: string) {
  const lines = csvContent.split("\n");
  const header = lines[0];
  const dataLines = lines.slice(1, 3001);
  const sample = [header, ...dataLines].join("\n");
  return {
    truncated: sample.length > 50000 ? sample.slice(0, 50000) : sample,
    isTruncated: csvContent.length > sample.length || sample.length > 50000,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to analyze data." }, { status: 401 });
    }

    // 用量检查
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isPro = user.publicMetadata?.plan === "pro";

    if (!isPro) {
      const today = new Date().toISOString().split("T")[0];
      const lastReset = (user.publicMetadata?.lastAnalysisDate as string) || "";
      const used = lastReset === today ? ((user.publicMetadata?.analysesUsed as number) || 0) : 0;

      if (used >= DAILY_FREE_LIMIT) {
        return NextResponse.json({
          error: `You've reached the daily limit of ${DAILY_FREE_LIMIT} free analyses. Upgrade to Pro for unlimited use.`,
          usage: { used, remaining: 0, limit: DAILY_FREE_LIMIT, isPro: false, isSignedIn: true },
        }, { status: 429 });
      }

      await client.users.updateUser(userId, {
        publicMetadata: { ...user.publicMetadata, analysesUsed: used + 1, lastAnalysisDate: today },
      });
    }

    // 解析请求
    const { csvContent, question } = await req.json();
    if (!csvContent || !question) {
      return NextResponse.json({ error: "CSV content and question are required." }, { status: 400 });
    }
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });
    }

    // 截断 + 构建 prompt
    const { truncated, isTruncated } = truncateCSV(csvContent);
    const note = isTruncated ? "(Note: large file was truncated to 3000 rows / 50000 chars)" : "";

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      system: `You are a data analyst. Answer the user's question about this CSV data.
${note}

CSV content:
\`\`\`csv
${truncated}
\`\`\`

Rules:
1. Compute numbers from the data directly — do not guess.
2. If a table helps, use markdown table format.
3. If a chart helps, append it in this exact format:
---CHART---
{"type":"bar","title":"Title","labels":["A","B"],"datasets":[{"label":"Value","data":[1,2]}]}
---END---
Valid chart types: bar, line, pie, scatter.
4. Keep the answer concise — under 300 words.`,
      prompt: question,
    });

    const chart = extractChartData(text);
    const answer = cleanAnswer(text);

    const today = new Date().toISOString().split("T")[0];
    const usedAfter = isPro ? 0 : ((user.publicMetadata?.analysesUsed as number) || 0);
    const remainingAfter = isPro ? Infinity : Math.max(0, DAILY_FREE_LIMIT - usedAfter);

    return NextResponse.json({
      answer,
      chart,
      usage: { used: usedAfter, remaining: remainingAfter, limit: DAILY_FREE_LIMIT, isPro, isSignedIn: true },
    });
  } catch (err: any) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: err.message || "Analysis failed." }, { status: 500 });
  }
}
