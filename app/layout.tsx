import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { LenisProvider } from "@/components/providers/LenisProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uday Kiran Battula — AI / ML Engineer",
  description:
    "AI/ML engineer building voice agents, RAG pipelines, and MCP systems in production.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
