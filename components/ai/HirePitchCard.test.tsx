import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HirePitchCard } from "./HirePitchCard";

const data = {
  fitScore: 8,
  strengths: ["RAG depth", "Production reliability", "MCP fluency"],
  tailoredBullets: ["Shipped X", "Built Y", "Owned Z"],
  coverParagraph: "I'd be a strong fit because...",
};

describe("HirePitchCard", () => {
  it("renders fit score", () => {
    render(<HirePitchCard data={data} />);
    expect(screen.getByText("8")).toBeInTheDocument();
  });
  it("renders all strengths and bullets", () => {
    render(<HirePitchCard data={data} />);
    for (const s of data.strengths) expect(screen.getByText(s)).toBeInTheDocument();
    for (const b of data.tailoredBullets) expect(screen.getByText(b)).toBeInTheDocument();
  });
  it("renders cover paragraph", () => {
    render(<HirePitchCard data={data} />);
    expect(screen.getByText(data.coverParagraph)).toBeInTheDocument();
  });
});
