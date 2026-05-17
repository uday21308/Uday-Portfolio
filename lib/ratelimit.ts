import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

/**
 * Minimal limiter shape used by route handlers. Both the real Upstash
 * Ratelimit class and our dev no-op satisfy this.
 */
type Limiter = { limit: (key: string) => Promise<{ success: boolean }> };

/**
 * In development we don't want self-inflicted 429s during iteration.
 * Production keeps the real Upstash limiters as genuine abuse protection.
 */
const isProd = process.env.NODE_ENV === "production";

const NOOP_LIMITER: Limiter = {
  limit: async () => ({ success: true }),
};

function realLimiter(window: number, prefix: string): Ratelimit {
  return new Ratelimit({
    redis: redis(),
    limiter: Ratelimit.slidingWindow(window, "1 h"),
    prefix,
    analytics: false,
  });
}

export const chatLimiter: Limiter = isProd ? realLimiter(60, "rl:chat") : NOOP_LIMITER;
export const mcpLimiter: Limiter = isProd ? realLimiter(30, "rl:mcp") : NOOP_LIMITER;
export const hireLimiter: Limiter = isProd ? realLimiter(5, "rl:hire") : NOOP_LIMITER;

export function ipFromRequest(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "anonymous";
}
