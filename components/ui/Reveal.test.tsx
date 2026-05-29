import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  it("renders children", () => {
    const { getByText } = render(<Reveal>hello</Reveal>);
    expect(getByText("hello")).toBeInTheDocument();
  });

  it("accepts all 5 variant values without error", () => {
    const variants = ["slide-left", "slide-right", "lift", "bloom", "mask"] as const;
    for (const v of variants) {
      const { unmount } = render(<Reveal variant={v}>x</Reveal>);
      unmount();
    }
  });

  it("accepts replay prop", () => {
    const { unmount } = render(<Reveal replay={false}>x</Reveal>);
    unmount();
  });

  it("accepts custom x/y/scale overrides", () => {
    const { unmount } = render(<Reveal x={-50} y={20} scale={0.8}>x</Reveal>);
    unmount();
  });
});
