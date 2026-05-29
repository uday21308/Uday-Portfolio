import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollLitParagraph } from "./ScrollLitParagraph";

describe("ScrollLitParagraph", () => {
  it("splits plain text into word spans", () => {
    const { container } = render(<ScrollLitParagraph text="hello world" />);
    const spans = container.querySelectorAll(".sl-word");
    expect(spans).toHaveLength(2);
    expect(spans[0].textContent).toBe("hello");
    expect(spans[1].textContent).toBe("world");
  });

  it("preserves italic accent markers", () => {
    const { container } = render(<ScrollLitParagraph text="I work at *Mindcres* now" />);
    const italics = container.querySelectorAll("em");
    expect(italics).toHaveLength(1);
    expect(italics[0].textContent).toBe("Mindcres");
  });

  it("renders className on paragraph", () => {
    const { container } = render(<ScrollLitParagraph text="x" className="custom-class" />);
    expect(container.querySelector("p.custom-class")).not.toBeNull();
  });
});
