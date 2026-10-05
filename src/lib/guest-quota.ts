/**
 * 免注册访客的用量闸门(Guest mode quota)。
 *
 * 为什么需要它:站上从 9 月起就写着「no account needed」,但 /dashboard 一直被
 * Clerk 挡着 —— 文案是真话的时候功能还不存在(2026-10-05 查实并补上)。
 * 补上功能就要有闸门,否则 DeepSeek 的调用成本对任何人不设防。
 *
 * 设计(故意保守):
 *   · 每个 IP 每天 GUEST_DAILY_LIMIT 次(比登录用户 3 次少,登录有额外好处:历史/导出)
 *   · 全站每天 GUEST_GLOBAL_DAILY_LIMIT 次 —— 熔断,防有人拿代理池刷
 *   · Redis(Upstash)没配 ⇒ 免注册通道【关闭】(fail closed),提示去注册;
 *     宁可少一个入口,也不留一个不计数的开口子
 *   · 分析失败时 releaseGuest() 把次数还回去(和 /api/analyze 的 F2 修复同一条纪律:
 *     失败不白扣)
 *
 * 计数键按 UTC 日期分片 + 48h TTL,不需要额外清理。
 */
import { redisCreds } from "./quota";

export const GUEST_DAILY_LIMIT = 2;
export const GUEST_GLOBAL_DAILY_LIMIT = 300;
/** 访客单次请求的 CSV 上限(比登录用户 2MB 小):成本上限优先。 */
export const GUEST_MAX_CSV_CHARS = 200_000;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 极简 Upstash REST 客户端:成功返回 number,任何异常返回 null(调用方一律当失败处理)。 */
async function redis(...parts: (string | number)[]): Promise<number | null> {
  const c = redisCreds();
  if (!c) return null;
  try {
    const url = `${c.url}/${parts.map((p) => encodeURIComponent(String(p))).join("/")}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${c.token}` }, cache: "no-store" });
    if (!res.ok) return null;
    const j = (await res.json()) as { result?: unknown };
    return typeof j?.result === "number" ? j.result : null;
  } catch {
    return null;
  }
}

/** 访客 IP:Vercel 一定带 x-forwarded-for;取第一段(最左 = 真实客户端)。 */
export function clientIp(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for") || "";
  const ip = (fwd.split(",")[0] || h.get("x-real-ip") || h.get("cf-connecting-ip") || "").trim();
  return ip || "unknown";
}

export type GuestCheck = { ok: true; used: number } | { ok: false; status: number; error: string };

export async function checkGuestQuota(ip: string): Promise<GuestCheck> {
  const day = today();
  const key = `guest:analyze:${ip}:${day}`;
  const n = await redis("incr", key);

  if (n === null) {
    return {
      ok: false,
      status: 503,
      error:
        "Free guest mode is unavailable right now. Signing in is free and takes a few seconds (no credit card).",
    };
  }
  if (n === 1) await redis("expire", key, 172800);
  if (n > GUEST_DAILY_LIMIT) {
    return {
      ok: false,
      status: 429,
      error: `You've used today's ${GUEST_DAILY_LIMIT} free guest analyses. Sign in free to get 3 a day plus saved history and exports — no credit card.`,
    };
  }

  const gkey = `guest:analyze:global:${day}`;
  const g = await redis("incr", gkey);
  if (g === 1) await redis("expire", gkey, 172800);
  if (typeof g === "number" && g > GUEST_GLOBAL_DAILY_LIMIT) {
    await redis("decr", key); // 熔断时把这次还给这个 IP
    return {
      ok: false,
      status: 429,
      error:
        "Free guest mode is at capacity right now. Signing in is free (no credit card), or try again tomorrow.",
    };
  }

  return { ok: true, used: n };
}

/** 分析失败时还次数。 */
export async function releaseGuest(ip: string): Promise<void> {
  const day = today();
  await redis("decr", `guest:analyze:${ip}:${day}`);
  await redis("decr", `guest:analyze:global:${day}`);
}
