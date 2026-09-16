import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { timingSafeEqual } from "node:crypto";
import { planExpiry } from "@/lib/quota";

/**
 * 管理员工具:按邮箱手动开通/取消套餐
 * 用途:①webhook 未及时送达时的人工兜底 ②给老客户补开 ③退款后立即降级
 *
 * 鉴权(2026-09-17 审计 F3 加固):
 *  - x-admin-secret 与 ADMIN_SECRET 用 timingSafeEqual 比较(消除时序侧信道)
 *  - ADMIN_SECRET 必须 ≥ 32 字符,否则视为未配置(403),避免弱密钥
 *  - 同一实例内对失败尝试做窗口限流(10 次/10 分钟 → 429)
 */

const MIN_SECRET_LEN = 32;
const FAIL_WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 10;

const failBuckets = new Map<string, number[]>();

function throttled(key: string): boolean {
  const now = Date.now();
  const bucket = (failBuckets.get(key) || []).filter((t) => now - t < FAIL_WINDOW_MS);
  failBuckets.set(key, bucket);
  return bucket.length >= MAX_FAILS;
}

function noteFailure(key: string): void {
  const now = Date.now();
  const bucket = (failBuckets.get(key) || []).filter((t) => now - t < FAIL_WINDOW_MS);
  bucket.push(now);
  failBuckets.set(key, bucket);
}

function secretsMatch(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    // 长度不同也走一次等长比较,避免长度侧的短路差异
    const pad = Buffer.alloc(a.length);
    timingSafeEqual(a, pad);
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!secret || secret.length < MIN_SECRET_LEN) {
    console.error("[admin] ADMIN_SECRET missing or shorter than 32 chars");
    return NextResponse.json(
      { ok: false, error: "admin disabled: ADMIN_SECRET must be set to at least 32 characters" },
      { status: 403 }
    );
  }
  if (throttled(ip)) {
    return NextResponse.json({ ok: false, error: "too many attempts" }, { status: 429 });
  }
  if (!secretsMatch(req.headers.get("x-admin-secret"), secret)) {
    noteFailure(ip);
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let body: { email?: string; plan?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const plan = (body.plan || "pro").trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }
  if (!["free", "pro", "business"].includes(plan)) {
    return NextResponse.json({ ok: false, error: "plan must be free|pro|business" }, { status: 400 });
  }

  const client = await clerkClient();
  const found = await client.users.getUserList({ emailAddress: [email] });
  const user = found.data?.[0];
  if (!user) {
    return NextResponse.json({ ok: false, error: "no clerk user with that email" }, { status: 404 });
  }

  const before = (user.publicMetadata?.plan as string) ?? "free";
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      ...user.publicMetadata,
      plan,
      planSource: "admin",
      planSince: new Date().toISOString(),
      // 手工开通付费套餐也带到期时间,避免"永远 Pro"
      planExpiresAt: plan === "free" ? null : planExpiry(),
      adminNote: body.note || null,
    },
  });

  const res = NextResponse.json({ ok: true, userId: user.id, email, plan, before });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
