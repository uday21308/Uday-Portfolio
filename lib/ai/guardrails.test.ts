import { describe, it, expect } from "vitest";
import { sweep, REJECTION } from "./guardrails";

describe("guardrails.sweep", () => {
  it("redacts $-prefixed salary figures", () => {
    expect(sweep("I'm targeting $90k")).toContain(REJECTION.salary);
  });
  it("redacts INR lakh figures", () => {
    expect(sweep("Around 18 lakh per annum")).toContain(REJECTION.salary);
  });
  it("redacts INR crore figures", () => {
    expect(sweep("Maybe 1 crore CTC")).toContain(REJECTION.salary);
  });
  it("leaves clean text untouched", () => {
    const s = "I built a healthcare RAG with 93.3% precision.";
    expect(sweep(s)).toBe(s);
  });
  it("does not redact dates that contain digits", () => {
    const s = "I worked there from 2021 to 2025.";
    expect(sweep(s)).toBe(s);
  });
});
