import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AIProvider } from "@/components/providers/AIProvider";
import { AutoGreet } from "./AutoGreet";

describe("AutoGreet", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });
  afterEach(() => vi.useRealTimers());

  it("does not show before 8s", () => {
    render(<AIProvider><AutoGreet delayMs={8000} /></AIProvider>);
    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("shows after 8s", () => {
    render(<AIProvider><AutoGreet delayMs={8000} /></AIProvider>);
    act(() => { vi.advanceTimersByTime(8000); });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("does not fire if already greeted in session", () => {
    sessionStorage.setItem("uday_ai_greeted", "1");
    render(<AIProvider><AutoGreet delayMs={8000} /></AIProvider>);
    act(() => { vi.advanceTimersByTime(8000); });
    expect(screen.queryByRole("status")).toBeNull();
  });
});
