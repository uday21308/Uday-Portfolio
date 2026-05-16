import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CostLine } from "./CostLine";

describe("CostLine", () => {
  it("renders cost with 6 decimals, tokens, latency, model", () => {
    render(<CostLine cost={0.000312} totalTokens={142} latencyMs={412} model="llama-3.3-70b-versatile" />);
    const text = screen.getByTestId("cost-line").textContent ?? "";
    expect(text).toContain("$0.000312");
    expect(text).toContain("142 tok");
    expect(text).toContain("412 ms");
    expect(text).toContain("llama-3.3-70b-versatile");
  });
  it("renders nothing when cost is 0 and tokens are 0", () => {
    const { queryByTestId } = render(<CostLine cost={0} totalTokens={0} latencyMs={0} model="x" />);
    expect(queryByTestId("cost-line")).toBeNull();
  });
});
