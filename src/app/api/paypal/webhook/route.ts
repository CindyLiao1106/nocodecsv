import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { planExpiry } from "@/lib/quota";

/**
 * PayPal 付款 → 自动开通 / 降级
 *
 * 安全:必须通过 PayPal 官方验签(verify-webhook-signature)才写状态;验签失败一律 400(fail closed)
 * 生命周期(2026-09-17 审计 F4 修复):
 *   开通类:PAYMENT.SALE.COMPLETED / CHECKOUT.ORDER.COMPLETED /
 *           BILLING.SUBSCRIPTION.ACTIVATED / BILLING.SUBSCRIPTION.PAYMENT.COMPLETED
 *   撤销类:PAYMENT.SALE.REFUNDED / PAYMENT.CAPTURE.REFUNDED /
 *           BILLING.SUBSCRIPTION.CANCELLED / SUSPENDED / EXPIRED  → 立即降级为 free
 *   同时写入 planExpiresAt(一次付款覆盖 31 天),这样即使漏掉撤销事件,权益也会自然到期。
 *
 * 需要的环境变量(Vercel):
 *   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID
 *   PAYPAL_ENV = "live" | "sandbox"(默认 live)
 */

const API_BASE = (process.env.PAYPAL_ENV === "sandbox")
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

const PROVISION_EVENTS = new Set([
  "PAYMENT.SALE.COMPLETED",
  "CHECKOUT.ORDER.COMPLETED",
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.PAYMENT.COMPLETED",
]);

const REVOKE_EVENTS = new Set([
  "PAYMENT.SALE.REFUNDED",
  "PAYMENT.CAPTURE.REFUNDED",
  "PAYMENT.CAPTURE.REVERSED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.EXPIRED",
]);

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
    event?.summary?.payer_email ||
    r?.custom ||
    undefined;
  const amount = r?.amount?.total || r?.amount?.value || r?.amount_with_breakdown?.gross_amount?.value;
  const currency = r?.amount?.currency || r?.amount_with_breakdown?.gross_amount?.currency_code;
  const plan = r?.plan_id || r?.plan?.id;
  return { email: typeof email === "string" ? email.toLowerCase() : undefined, amount, currency, plan };
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const verified = await verifySignature(req, rawBody);
  if (!verified) {
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
  const isProvision = PROVISION_EVENTS.has(type);
  const isRevoke = REVOKE_EVENTS.has(type);
  if (!isProvision && !isRevoke) {
    return NextResponse.json({ ok: true, ignored: type });
  }

  const { email, amount, currency, plan } = extractPayer(event);
  if (!email) {
    console.warn("[paypal-webhook] no payer email in event", type);
    return NextResponse.json({ ok: true, warning: "no payer email" });
  }

  const client = await clerkClient();
  try {
    const found = await client.users.getUserList({ emailAddress: [email] });
    const user = found.data?.[0];
    if (!user) {
      // 付款时还没注册:交给 /welcome 说明页 + 人工路径处理
      console.log("[paypal-webhook] no matching account:", email, type);
      return NextResponse.json({ ok: true, note: "no matching account" });
    }

    if (isRevoke) {
      await client.users.updateUserMetadata(user.id, {
        publicMetadata: {
          ...user.publicMetadata,
          plan: "free",
          planRevokedAt: new Date().toISOString(),
          planRevokeReason: type,
          payerEmail: email,
        },
      });
      console.log("[paypal-webhook] revoked", user.id, email, type);
      return NextResponse.json({ ok: true, revoked: true });
    }

    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        ...user.publicMetadata,
        plan: "pro",
        planSource: "paypal",
        planSince: new Date().toISOString(),
        planExpiresAt: planExpiry(),
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
