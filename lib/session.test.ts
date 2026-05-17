import { describe, it, expect } from "vitest";
import { newSessionId, isValidSessionId, SESSION_COOKIE } from "./session";

describe("session helpers", () => {
  it("generates 21-char nanoid", () => {
    const id = newSessionId();
    expect(id).toHaveLength(21);
  });
  it("validates good ids", () => {
    expect(isValidSessionId(newSessionId())).toBe(true);
  });
  it("rejects bad ids", () => {
    expect(isValidSessionId("")).toBe(false);
    expect(isValidSessionId("a b c")).toBe(false);
    expect(isValidSessionId("x".repeat(100))).toBe(false);
  });
  it("exports stable cookie name", () => {
    expect(SESSION_COOKIE).toBe("uday_ai_session");
  });
});
