"use client";
import { useState } from "react";

const CONFIG = `{
  "mcpServers": {
    "uday-portfolio": {
      "url": "https://uday-kiran-battula.vercel.app/api/mcp"
    }
  }
}`;

const FALLBACK = `{
  "mcpServers": {
    "uday-portfolio": {
      "command": "npx",
      "args": ["mcp-remote", "https://uday-kiran-battula.vercel.app/api/mcp"]
    }
  }
}`;

const TOOLS = [
  {
    name: "ask_uday",
    desc: "Ask anything about Uday's projects, background, or skills.",
    ex: `ask_uday({ question: "Tell me about Uday's RAG experience." })`,
  },
  {
    name: "list_projects",
    desc: "Get every project Uday has shipped with tier and one-line summary.",
    ex: `list_projects({})`,
  },
  {
    name: "get_project",
    desc: "Pull the full content for a single project.",
    ex: `get_project({ name: "Healthcare-RAG-Assistant" })`,
  },
  {
    name: "match_jd",
    desc: "Paste a JD, get a structured fit analysis.",
    ex: `match_jd({ jd: "Senior AI Engineer...", company: "Acme", role: "Sr AI Eng" })`,
  },
];

export default function ConnectPage() {
  return (
    <main className="min-h-screen px-6 md:px-10 py-16 max-w-4xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] font-extrabold uppercase text-4xl md:text-5xl mb-3">
        Connect Claude Desktop to my portfolio
      </h1>
      <p className="text-[var(--color-fg-muted)] mb-10 max-w-2xl">
        My portfolio runs an <strong>MCP server</strong>. If you use Claude
        Desktop, you can wire it up and ask questions about my work from inside
        your own Claude — the same RAG pipeline that powers the chat widget on
        this site.
      </p>

      <Section title="1. Add this to your Claude Desktop config">
        <p className="text-sm text-[var(--color-fg-muted)] mb-2">
          Open{" "}
          <code className="font-[family-name:var(--font-mono)] text-xs">
            ~/Library/Application Support/Claude/claude_desktop_config.json
          </code>{" "}
          (macOS) or{" "}
          <code className="font-[family-name:var(--font-mono)] text-xs">
            %APPDATA%\Claude\claude_desktop_config.json
          </code>{" "}
          (Windows) and merge in:
        </p>
        <Copy code={CONFIG} />
        <p className="text-xs text-[var(--color-fg-muted)] mt-3">
          If the URL form doesn&apos;t work (older Claude Desktop versions), use
          the{" "}
          <code className="font-[family-name:var(--font-mono)]">mcp-remote</code>{" "}
          proxy:
        </p>
        <Copy code={FALLBACK} />
      </Section>

      <Section title="2. Restart Claude Desktop">
        <p className="text-sm">
          Then ask Claude something like{" "}
          <em>
            &quot;Use the uday-portfolio tools to tell me about his RAG
            work&quot;
          </em>{" "}
          or{" "}
          <em>
            &quot;Use match_jd to evaluate this job description: ...&quot;
          </em>
          .
        </p>
      </Section>

      <Section title="Available tools">
        <ul className="space-y-3">
          {TOOLS.map((t) => (
            <li
              key={t.name}
              className="border border-[var(--color-accent)]/15 rounded-lg p-3"
            >
              <div className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent-cyan)]">
                {t.name}
              </div>
              <div className="text-sm text-[var(--color-fg-muted)] mb-2 mt-1">
                {t.desc}
              </div>
              <code className="block font-[family-name:var(--font-mono)] text-[11px] bg-[var(--color-bg-elevated)] p-2 rounded">
                {t.ex}
              </code>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Source">
        <p className="text-sm">
          Want to fork this pattern? Source at{" "}
          <a
            href="https://github.com/uday21308/Uday-Portfolio"
            className="underline hover:text-[var(--color-accent-cyan)]"
          >
            github.com/uday21308/Uday-Portfolio
          </a>
          .
        </p>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="font-[family-name:var(--font-display-alt)] text-xl mb-3 uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Copy({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre className="font-[family-name:var(--font-mono)] text-xs bg-[var(--color-bg-elevated)] border border-[var(--color-accent)]/15 rounded-lg p-3 overflow-x-auto">
        {code}
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
