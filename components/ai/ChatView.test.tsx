import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const sendMock = vi.fn();
vi.mock("./useChatStream", () => ({
  useChatStream: () => ({
    messages: [
      { role: "user", content: "hi" },
      { role: "assistant", content: "Hello!", sources: [{ title: "FAQ", source: "faq", score: 0.9 }], usage: { cost: 0.0001, totalTokens: 50, latencyMs: 200, model: "llama-3.3-70b-versatile" } },
    ],
    pendingAssistant: null,
    send: sendMock,
    isStreaming: false,
  }),
}));

import { ChatView } from "./ChatView";

describe("ChatView", () => {
  beforeEach(() => sendMock.mockReset());

  it("renders the message thread", () => {
    render(<ChatView />);
    expect(screen.getByText("hi")).toBeInTheDocument();
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
  it("shows cost line on assistant message", () => {
    render(<ChatView />);
    expect(screen.getByTestId("cost-line").textContent).toContain("$0.000100");
  });
  it("send button calls hook.send", async () => {
    render(<ChatView />);
    fireEvent.change(screen.getByPlaceholderText(/Ask me anything/i), { target: { value: "what is RAG?" } });
    fireEvent.click(screen.getByText(/Send/i));
    await waitFor(() => expect(sendMock).toHaveBeenCalledWith("what is RAG?"));
  });
});
