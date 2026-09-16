import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * 管理员工具:按邮箱手动开通/取消 Pro
 * 用途:①webhook 没配好时的人工兜底 ②给老客户补开 ③退款后降级
 *
 * 鉴权:请求头 x-admin-secret 必须等于环境变量 ADMIN_SECRET(未设置则一律 403)
 */
export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers.get("x-admin-secret") !== secret) {
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

  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      ...user.publicMetadata,
      plan,
      planSource: "admin",
      planSince: new Date().toISOString(),
      adminNote: body.note || null,
    },
  });

  return NextResponse.json({
    ok: true,
    userId: user.id,
    email,
    plan,
    before: user.publicMetadata?.plan ?? "free",
  });
}
