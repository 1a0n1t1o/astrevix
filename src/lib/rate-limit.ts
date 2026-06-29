// Simple in-memory rate limiter for API routes.
// Resets per cold start on Vercel (serverless), which is fine for basic brute-force protection.

const requestMap = new Map<string, { count: number; resetAt: number }>();

// Clean up stale entries every 5 minutes to prevent memory leaks in long-running dev server
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requestMap.entries()) {
      if (value.resetAt < now) {
        requestMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function rateLimit(
  ip: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = requestMap.get(ip);

  if (!entry || entry.resetAt < now) {
    requestMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: maxRequests - entry.count };
}

/**
 * Durable, cross-instance rate limiter backed by Upstash Redis (REST API, no SDK).
 * Falls back to the in-memory limiter above when Upstash isn't configured or on
 * any store error, so the app never hard-fails on the rate-limit path.
 *
 * Fixed-window counter: INCR the key, set the TTL only on the first hit (EXPIRE NX).
 */
export async function durableRateLimit(
  key: string,
  maxRequests: number,
  windowSec: number
): Promise<{ success: boolean }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return rateLimit(key, maxRequests, windowSec * 1000);
  }

  try {
    const redisKey = `rl:${key}`;
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, String(windowSec), "NX"],
      ]),
      cache: "no-store",
    });

    if (!res.ok) {
      return rateLimit(key, maxRequests, windowSec * 1000);
    }

    const data = (await res.json()) as Array<{ result?: number }>;
    const count = data?.[0]?.result ?? 0;
    return { success: count <= maxRequests };
  } catch {
    // Store unreachable → fall back rather than blocking real users.
    return rateLimit(key, maxRequests, windowSec * 1000);
  }
}
