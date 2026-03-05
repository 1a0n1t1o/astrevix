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
