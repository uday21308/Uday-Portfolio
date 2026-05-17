import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameView } from "./GameView";

describe("GameView (Bug Dodger)", () => {
  it("renders the start overlay by default", () => {
    render(<GameView />);
    // title appears in both header and overlay → match by overlay-only Start button
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
    expect(screen.getByText(/help the ai engineer dodge/i)).toBeInTheDocument();
  });

  it("shows the status header with score", () => {
    render(<GameView />);
    expect(screen.getByText(/space or tap to jump/i)).toBeInTheDocument();
    // initial score is 00000
    expect(screen.getByText(/BEST 00000 · 00000/i)).toBeInTheDocument();
  });

  it("exposes the arena as a clickable region", () => {
    render(<GameView />);
    expect(screen.getByRole("button", { name: /game arena/i })).toBeInTheDocument();
  });
});
