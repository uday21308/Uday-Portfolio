import { describe, it, expect } from "vitest";
import { calcCost, PRICING } from "./cost";

describe("calcCost", () => {
  it("computes Groq Llama 3.3 70B cost correctly", () => {
    const cost = calcCost("llama-3.3-70b-versatile", 1_000_000, 1_000_000);
    expect(cost).toBeCloseTo(0.59 + 0.79, 6);
  });
  it("scales linearly with token count", () => {
    const c1 = calcCost("llama-3.3-70b-versatile", 100, 50);
    const c2 = calcCost("llama-3.3-70b-versatile", 200, 100);
    expect(c2).toBeCloseTo(c1 * 2, 8);
  });
  it("returns 0 for unknown models", () => {
    expect(calcCost("nope-9000", 1000, 1000)).toBe(0);
  });
  it("PRICING table has the default model", () => {
    expect(PRICING).toHaveProperty("llama-3.3-70b-versatile");
  });
});
