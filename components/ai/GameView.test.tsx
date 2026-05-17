import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

globalThis.fetch = vi.fn(async () =>
  new Response(JSON.stringify({ valid: true, nextWord: "tokenizer", reaction: "nice" }), { status: 200 })
) as any;

import { GameView } from "./GameView";

describe("GameView", () => {
  it("shows starting bot word", () => {
    render(<GameView />);
    expect(screen.getByTestId("bot-word")).toBeInTheDocument();
  });
  it("submits user word and shows next bot word", async () => {
    render(<GameView />);
    fireEvent.change(screen.getByPlaceholderText(/your word/i), { target: { value: "attention" } });
    fireEvent.click(screen.getByText(/play/i));
    await waitFor(() => expect(screen.getByText("tokenizer")).toBeInTheDocument());
  });
});
