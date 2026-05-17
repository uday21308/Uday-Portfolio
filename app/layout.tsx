import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { AIProvider } from "@/components/providers/AIProvider";
import { Cursor } from "@/components/ui/Cursor";
import { Nav } from "@/components/ui/Nav";
import { UdayAI } from "@/components/ai/UdayAI";
import { AutoGreet } from "@/components/ai/AutoGreet";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://uday-kiran-battula.vercel.app"),
  title: {
    default: "Uday Kiran Battula — AI / ML Engineer",
    template: "%s · Uday Kiran Battula",
  },
  description:
    "AI / ML engineer at Mindcres. Voice agents, RAG pipelines, MCP tools, and the production glue that makes them stop being demos.",
  keywords: [
    "AI engineer",
    "ML engineer",
    "LLM",
    "RAG",
    "MCP",
    "voice agents",
    "Uday Kiran Battula",
  ],
  authors: [{ name: "Uday Kiran Battula" }],
  openGraph: {
    type: "website",
    url: "https://uday-kiran-battula.vercel.app",
    title: "Uday Kiran Battula — AI / ML Engineer",
    description:
      "AI / ML engineer building voice agents, RAG pipelines, and MCP systems in production.",
    siteName: "Uday Kiran Battula",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uday Kiran Battula — AI / ML Engineer",
    description: "AI / ML engineer building voice agents, RAG, and MCP systems in production.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <LenisProvider>
          <AIProvider>
            <Nav />
            {children}
            <UdayAI />
            <AutoGreet delayMs={8000} />
          </AIProvider>
        </LenisProvider>
        <Cursor />
      </body>
    </html>
  );
}
