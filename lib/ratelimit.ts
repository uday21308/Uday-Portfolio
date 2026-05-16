import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const chatLimiter = new Ratelimit({
  redis: redis(),
  limiter: Ratelimit.slidingWindow(60, "1 h"),
  prefix: "rl:chat",
  analytics: false,
});

export const mcpLimiter = new Ratelimit({
  redis: redis(),
  limiter: Ratelimit.slidingWindow(30, "1 h"),
  prefix: "rl:mcp",
  analytics: false,
});

export const hireLimiter = new Ratelimit({
  redis: redis(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "rl:hire",
  analytics: false,
});

export function ipFromRequest(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "anonymous";
}
