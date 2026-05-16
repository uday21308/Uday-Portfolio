import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SourceCitations } from "./SourceCitations";

const sources = [
  { title: "FAQ entry", source: "faq", score: 0.9 },
  { title: "Healthcare README", source: "github:Healthcare-RAG-Assistant", score: 0.8 },
];

describe("SourceCitations", () => {
  it("shows collapsed count by default", () => {
    render(<SourceCitations sources={sources} />);
    expect(screen.getByText(/2 sources cited/)).toBeInTheDocument();
    expect(screen.queryByText("FAQ entry")).toBeNull();
  });
  it("expands on click", () => {
    render(<SourceCitations sources={sources} />);
    fireEvent.click(screen.getByText(/2 sources cited/));
    expect(screen.getByText("FAQ entry")).toBeInTheDocument();
    expect(screen.getByText("Healthcare README")).toBeInTheDocument();
  });
  it("renders nothing for empty", () => {
    const { container } = render(<SourceCitations sources={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
