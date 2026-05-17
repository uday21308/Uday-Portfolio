import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SourceCitations } from "./SourceCitations";

const sources = [
  { title: "What's your strongest project?", source: "faq", score: 0.9 },
  { title: "Healthcare-RAG-Assistant — Pipeline", source: "github:Healthcare-RAG-Assistant", score: 0.8 },
];

describe("SourceCitations", () => {
  it("shows collapsed count by default", () => {
    render(<SourceCitations sources={sources} />);
    expect(screen.getByText(/2 sources$/)).toBeInTheDocument();
    expect(screen.queryByText(/Healthcare RAG Assistant/i)).toBeNull();
  });

  it("expands on click and shows polished source names", () => {
    render(<SourceCitations sources={sources} />);
    fireEvent.click(screen.getByText(/2 sources$/));
    // GitHub source rendered with cleaned name (no "github:" prefix, hyphens stripped)
    expect(screen.getByText(/Healthcare RAG Assistant/)).toBeInTheDocument();
    // FAQ source includes the question text as a subtitle
    expect(screen.getByText(/FAQ/)).toBeInTheDocument();
    expect(screen.getByText(/strongest project/i)).toBeInTheDocument();
  });

  it("does not show the score percentage", () => {
    render(<SourceCitations sources={sources} />);
    fireEvent.click(screen.getByText(/2 sources$/));
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it("singular label when only one source", () => {
    render(<SourceCitations sources={[sources[0]]} />);
    expect(screen.getByText(/1 source$/)).toBeInTheDocument();
  });

  it("renders nothing for empty", () => {
    const { container } = render(<SourceCitations sources={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
