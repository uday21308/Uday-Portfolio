import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function redis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

export type StoredExchange = { role: "user" | "assistant"; content: string; ts: number };

export async function loadHistory(sessionId: string, limit = 10): Promise<StoredExchange[]> {
  const key = `session:${sessionId}`;
  const items = await redis().lrange<StoredExchange>(key, -limit, -1);
  return items ?? [];
}

export async function appendExchange(sessionId: string, exchange: StoredExchange): Promise<void> {
  const key = `session:${sessionId}`;
  await redis().rpush(key, exchange);
  await redis().expire(key, 60 * 60 * 24 * 30);
}
