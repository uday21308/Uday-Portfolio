import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AIProvider, useAI } from "./AIProvider";

function Probe() {
  const { isOpen, open, close, mode, setMode } = useAI();
  return (
    <div>
      <span data-testid="open">{String(isOpen)}</span>
      <span data-testid="mode">{mode}</span>
      <button onClick={open}>open</button>
      <button onClick={close}>close</button>
      <button onClick={() => setMode("game")}>game</button>
    </div>
  );
}

describe("AIProvider", () => {
  it("starts closed in chat mode", () => {
    render(<AIProvider><Probe /></AIProvider>);
    expect(screen.getByTestId("open").textContent).toBe("false");
    expect(screen.getByTestId("mode").textContent).toBe("chat");
  });
  it("open/close work", () => {
    render(<AIProvider><Probe /></AIProvider>);
    fireEvent.click(screen.getByText("open"));
    expect(screen.getByTestId("open").textContent).toBe("true");
    fireEvent.click(screen.getByText("close"));
    expect(screen.getByTestId("open").textContent).toBe("false");
  });
  it("setMode switches mode", () => {
    render(<AIProvider><Probe /></AIProvider>);
    fireEvent.click(screen.getByText("game"));
    expect(screen.getByTestId("mode").textContent).toBe("game");
  });
});
