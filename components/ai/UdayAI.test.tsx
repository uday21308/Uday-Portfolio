import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AIProvider } from "@/components/providers/AIProvider";
import { UdayAI } from "./UdayAI";

function r() { render(<AIProvider><UdayAI /></AIProvider>); }

describe("UdayAI", () => {
  it("renders the launcher pill when closed", () => {
    r();
    expect(screen.getByRole("button", { name: /open uday ai/i })).toBeInTheDocument();
  });
  it("opens panel on launcher click", () => {
    r();
    fireEvent.click(screen.getByRole("button", { name: /open uday ai/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
  it("renders the 3 tool links in the header when open", () => {
    r();
    fireEvent.click(screen.getByRole("button", { name: /open uday ai/i }));
    expect(screen.getByRole("link", { name: /tailored fit pitch/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /bug dodger/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /claude desktop/i })).toBeInTheDocument();
  });
  it("closes on Escape", () => {
    r();
    fireEvent.click(screen.getByRole("button", { name: /open uday ai/i }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
