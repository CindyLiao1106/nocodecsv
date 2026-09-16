import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getQuota } from "@/lib/quota";

export async function GET() {
  const { userId } = await auth();

  try {
    const q = await getQuota(userId);
    return NextResponse.json({
      used: q.used,
      remaining: q.remaining,
      limit: q.limit,
      isPro: q.isPro,
      plan: q.plan,
      isSignedIn: q.signedIn,
      atomic: q.atomic,
    });
  } catch (err) {
    console.error("Usage error:", err);
    // 取不到用量时不谎报 0:返回 503 让前端提示重试
    return NextResponse.json({ error: "Could not read usage. Please retry." }, { status: 503 });
  }
}
