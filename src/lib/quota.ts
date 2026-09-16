import { clerkClient } from "@clerk/nextjs/server";

/**
 * 配额与套餐判定(唯一样本)
 *
 * 修复要点(2026-09-17 安全审计 F1/F2):
 *  - 原实现:读元数据 → 判断 → 写回 used+1,是"读改写",并发请求会读到同一个旧值而全部通过。
 *  - 现实现:优先用【原子自增】(Upstash Redis REST,INCR + 按天 TTL);
 *            没有 Redis 时降级为「单飞(in-flight)互斥 + 成功后才计数」——并发会被挡住,
 *            且失败不再白扣次数(F2)。
 *  - 另加 planExpiresAt 到期校验:退款/取消后即使 plan 字段残留 'pro',过期即失效(F4 兜底)。
 *
 * 需要的环境变量(可选,配了就自动启用原子计数):
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

export const DAILY_FREE_LIMIT = 3;
const INFLIGHT_WINDOW_SECONDS = 45; // 单次 AI 分析的最长占用窗口
const PLAN_DAYS = 31;               // 一次付款覆盖的天数

export type Plan = "free" | "pro" | "business";

export type QuotaState = {
  plan: Plan;
  isPro: boolean;
  used: number;
  limit: number;          // Infinity 表示不限
  remaining: number;      // Infinity 表示不限
  signedIn: boolean;
  /** 是否已启用原子计数(Upstash) */
  atomic: boolean;
};

const FREESTATE: QuotaState = {
  plan: "free", isPro: false, used: 0, limit: DAILY_FREE_LIMIT,
  remaining: DAILY_FREE_LIMIT, signedIn: false, atomic: false,
};

function today(): string {
  return new Date().toISOString().split("T")[0];
}

/** 兼容两种命名:Upstash 直连(UPSTASH_REDIS_REST_*)与 Vercel KV(KV_REST_API_*) */
export function redisCreds(): { url: string; token: string } | null {
  const pairs = [
    [process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN],
    [process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN],
  ];
  for (const [url, token] of pairs) {
    if (url && token) return { url, token };
  }
  return null;
}

function redisConfigured(): boolean {
  return redisCreds() !== null;
}

/** Upstash REST:执行一条命令 */
async function redis(command: (string | number)[]): Promise<unknown> {
  const creds = redisCreds();
  if (!creds) throw new Error("redis not configured");
  const { url, token } = creds;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

/** 原子自增:返回自增后的值 */
async function redisIncr(key: string, ttlSeconds: number): Promise<number> {
  const n = Number(await redis(["INCR", key]));
  if (n === 1) {
    // 首次写入时挂 TTL(按天键,天然跨天重置)
    await redis(["EXPIRE", key, ttlSeconds]);
  }
  return n;
}

function planIsActive(meta: Record<string, unknown>): boolean {
  const plan = (meta?.plan as string) || "free";
  if (plan === "free") return false;
  const exp = meta?.planExpiresAt as string | undefined;
  if (!exp) return true; // 老数据没有到期字段:视为有效(管理员手工开通的长期账号)
  const t = Date.parse(exp);
  return Number.isFinite(t) ? t > Date.now() : true;
}

export function isProMeta(meta: Record<string, unknown>): boolean {
  const plan = (meta?.plan as string) || "free";
  return (plan === "pro" || plan === "business") && planIsActive(meta);
}

export async function getQuota(userId: string | null): Promise<QuotaState> {
  if (!userId) return FREESTATE;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = (user.publicMetadata || {}) as Record<string, unknown>;

  if (isProMeta(meta)) {
    return { plan: (meta.plan as Plan) || "pro", isPro: true, used: 0, limit: Infinity,
             remaining: Infinity, signedIn: true, atomic: redisConfigured() };
  }

  const day = today();
  let used = 0;
  if (redisConfigured()) {
    try {
      used = Number(await redis(["GET", `quota:${userId}:${day}`])) || 0;
    } catch {
      used = 0;
    }
  } else {
    const lastReset = (meta?.lastAnalysisDate as string) || "";
    used = lastReset === day ? ((meta?.analysesUsed as number) || 0) : 0;
  }

  return {
    plan: "free", isPro: false, used,
    limit: DAILY_FREE_LIMIT, remaining: Math.max(0, DAILY_FREE_LIMIT - used),
    signedIn: true, atomic: redisConfigured(),
  };
}

/**
 * 占位:在真正调用 AI **之前**调用。
 *  - 原子模式:直接 INCR;超限则回滚(超过限额时不消耗)。
 *  - 降级模式:写 in-flight 时间戳当互斥锁(45 秒窗口),并发第二个请求会被拒。
 * 返回 {ok, used} 或 {ok:false, reason}
 */
export async function acquireSlot(userId: string): Promise<{ ok: true; used: number } | { ok: false; reason: "limit" | "busy" }> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = (user.publicMetadata || {}) as Record<string, unknown>;
  const day = today();

  if (isProMeta(meta)) return { ok: true, used: 0 };

  if (redisConfigured()) {
    const used = await redisIncr(`quota:${userId}:${day}`, 90000);
    if (used > DAILY_FREE_LIMIT) {
      await redis(["DECR", `quota:${userId}:${day}`]); // 超限不消耗
      return { ok: false, reason: "limit" };
    }
    return { ok: true, used };
  }

  // 降级模式:单飞互斥 + 非原子计数(尽力而为,已在代码注释与审计报告中标注)
  const inflight = (meta?.inflightAt as string) || "";
  if (inflight) {
    const t = Date.parse(inflight);
    if (Number.isFinite(t) && Date.now() - t < INFLIGHT_WINDOW_SECONDS * 1000) {
      return { ok: false, reason: "busy" };
    }
  }
  const used = ((meta?.lastAnalysisDate as string) === day ? ((meta?.analysesUsed as number) || 0) : 0);
  if (used >= DAILY_FREE_LIMIT) return { ok: false, reason: "limit" };

  await client.users.updateUser(userId, {
    publicMetadata: { ...meta, inflightAt: new Date().toISOString() },
  });
  return { ok: true, used };
}

/**
 * 结算:AI 调用**成功后**调用(F2 修复:失败不再白扣次数)。
 *  - 原子模式:次数已在 acquireSlot 里 INCR,这里只清 in-flight(无需操作)。
 *  - 降级模式:写 used+1 并清 in-flight。
 */
export async function settleSlot(userId: string, success: boolean): Promise<void> {
  if (redisConfigured()) return; // 原子模式:acquire 时已计数,失败时由调用方 releaseSlot 回滚

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = (user.publicMetadata || {}) as Record<string, unknown>;
  const day = today();

  if (!success) {
    await client.users.updateUser(userId, {
      publicMetadata: { ...meta, inflightAt: null },
    });
    return;
  }

  const used = ((meta?.lastAnalysisDate as string) === day ? ((meta?.analysesUsed as number) || 0) : 0);
  await client.users.updateUser(userId, {
    publicMetadata: { ...meta, analysesUsed: used + 1, lastAnalysisDate: day, inflightAt: null },
  });
}

/** 失败回滚(仅原子模式需要:把已 INCR 的次数减回去) */
export async function releaseSlot(userId: string): Promise<void> {
  if (!redisConfigured()) return;
  try {
    await redis(["DECR", `quota:${userId}:${today()}`]);
  } catch {
    // 回滚失败不阻断主流程;次数会在次日 TTL 到期后自然重置
  }
}

/** 订阅/付款写入元数据时的到期时间计算 */
export function planExpiry(): string {
  return new Date(Date.now() + PLAN_DAYS * 24 * 3600 * 1000).toISOString();
}
