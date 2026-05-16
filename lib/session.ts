import { nanoid } from "nanoid";

export const SESSION_COOKIE = "uday_ai_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function newSessionId(): string {
  return nanoid();
}

export function isValidSessionId(id: unknown): id is string {
  return typeof id === "string" && /^[A-Za-z0-9_-]{21}$/.test(id);
}
