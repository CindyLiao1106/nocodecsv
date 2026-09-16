import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * PayPal 付款 → 自动开通 Pro
 *
 * 流程:PayPal 后台配置 webhook 指向本路由 → PayPal 用官方 API 验签 → 我们写 Clerk 用户档案
 * 安全:必须验签通过才写;验签失败一律 400(fail closed)
 *
 * 需要的环境变量(Vercel 上配置):
 *   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID
 *   PAYPAL_ENV = "live" | "sandbox"(默认 live)
 */

const API_BASE = (process.env.PAYPAL_ENV === "sandbox")
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

async function getAccessToken(): Promise<string | null> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) return null;
  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

async function verifySignature(req: Request, rawBody: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const token = await getAccessToken();
  if (!webhookId || !token) return false;

  const body = {
    transmission_id: req.headers.get("paypal-transmission-id"),
    transmission_time: req.headers.get("paypal-transmission-time"),
    cert_url: req.headers.get("paypal-cert-url"),
    auth_algo: req.headers.get("paypal-auth-algo"),
    transmission_sig: req.headers.get("paypal-transmission-sig"),
    webhook_id: webhookId,
    webhook_event: JSON.parse(rawBody),
  };
  const res = await fetch(`${API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return false;
  const json = (await res.json()) as { verification_status?: string };
  return json.verification_status === "SUCCESS";
}

/** 从各种 PayPal 事件里抠出付款人邮箱 + 金额 */
function extractPayer(event: any): { email?: string; amount?: string; currency?: string; plan?: string } {
  const r = event?.resource ?? {};
  const email =
    r?.payer?.email_address ||
    r?.subscriber?.email_address ||
    r?.custom ||
    event?.summary?.payer_email ||
    undefined;
  const amount = r?.amount?.total || r?.amount?.value || r?.amount_with_breakdown?.gross_amount?.value;
  const currency = r?.amount?.currency || r?.amount_with_breakdown?.gross_amount?.currency_code;
  const plan = r?.plan_id || r?.plan?.id || (r?.amount?.total ? `oneoff:${r.amount.total}` : undefined);
  return { email: typeof email === "string" ? email.toLowerCase() : undefined, amount, currency, plan };
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const verified = await verifySignature(req, rawBody);
  if (!verified) {
    // 没配 webhook_id / 验签失败:不写任何状态
    console.warn("[paypal-webhook] signature verification failed or not configured");
    return NextResponse.json({ ok: false, error: "signature verification failed" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const type: string = event?.event_type ?? "";
  const PROVISION_EVENTS = new Set([
    "PAYMENT.SALE.COMPLETED",
    "CHECKOUT.ORDER.COMPLETED",
    "BILLING.SUBSCRIPTION.ACTIVATED",
    "BILLING.SUBSCRIPTION.PAYMENT.COMPLETED",
  ]);

  if (!PROVISION_EVENTS.has(type)) {
    return NextResponse.json({ ok: true, ignored: type });
  }

  const { email, amount, currency, plan } = extractPayer(event);
  if (!email) {
    console.warn("[paypal-webhook] no payer email in event", type);
    return NextResponse.json({ ok: true, warning: "no payer email" });
  }

  // 按邮箱找 Clerk 用户并升级
  const client = await clerkClient();
  try {
    const found = await client.users.getUserList({ emailAddress: [email] });
    const user = found.data?.[0];
    if (!user) {
      // 付款时还没注册:交给 /welcome 认领页处理
      console.log("[paypal-webhook] paid but no account yet:", email);
      return NextResponse.json({ ok: true, note: "no matching account; claim flow will handle" });
    }
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        ...user.publicMetadata,
        plan: "pro",
        planSource: "paypal",
        planSince: new Date().toISOString(),
        payerEmail: email,
        lastPayment: { amount, currency, plan, eventType: type },
      },
    });
    console.log("[paypal-webhook] upgraded", user.id, email);
    return NextResponse.json({ ok: true, upgraded: true });
  } catch (err) {
    console.error("[paypal-webhook] clerk error", err);
    return NextResponse.json({ ok: false, error: "clerk error" }, { status: 500 });
  }
}
