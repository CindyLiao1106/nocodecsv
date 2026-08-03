import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const DAILY_FREE_LIMIT = 3;

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { used: 0, remaining: DAILY_FREE_LIMIT, limit: DAILY_FREE_LIMIT, isPro: false, isSignedIn: false }
    );
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const isPro = user.publicMetadata?.plan === "pro";

  if (isPro) {
    return NextResponse.json({ used: 0, remaining: Infinity, limit: Infinity, isPro: true, isSignedIn: true });
  }

  const today = new Date().toISOString().split("T")[0];
  const lastReset = (user.publicMetadata?.lastAnalysisDate as string) || "";
  const rawUsed = (user.publicMetadata?.analysesUsed as number) || 0;
  const used = lastReset === today ? rawUsed : 0;
  const remaining = Math.max(0, DAILY_FREE_LIMIT - used);

  return NextResponse.json({ used, remaining, limit: DAILY_FREE_LIMIT, isPro: false, isSignedIn: true });
}
