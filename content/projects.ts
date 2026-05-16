export type Project = {
  year: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
};

export const projects: Project[] = [
  {
    year: "2026",
    title: "Healthcare RAG Assistant",
    description:
      "8-stage RAG pipeline over 69 clinical documents (345 chunks) · sentence-transformers + FAISS · *93.3%* retrieval precision · section re-ranking + token-overlap validation + 25% confidence threshold for safety-first clinical decision support.",
    tags: ["FAISS", "sentence-transformers", "RAG", "Python"],
    link: "https://github.com/uday21308/Healthcare-RAG-Assistant",
  },
  {
    year: "2025",
    title: "E-Commerce Voice Bot",
    description:
      "Full-stack voice assistant · React + Web Speech API · 4 intents · classification router preventing hallucinated order IDs · ChromaDB RAG over 500-item / 30+ category inventory · LangSmith tracing for full audit trail.",
    tags: ["React", "ChromaDB", "RAG", "LangSmith"],
    link: "https://github.com/uday21308/Ecommerce-AI-voice-text-Assistant",
  },
  {
    year: "2026",
    title: "AI-Powered Equity Filings Agent",
    description:
      "10-K / 10-Q automation · adapter-pattern document loaders · lexicon-based scoring · strict grounding prompts to prioritize precision over recall · structured reports in seconds vs hours of manual reading.",
    tags: ["LLM", "Adapters", "Finance NLP", "Python"],
    link: "https://github.com/uday21308/AI-Powered-Equity-Filings-Summarization-Risk-Insight-Agent",
  },
  {
    year: "2026",
    title: "Expense Tracker MCP",
    description:
      "Model Context Protocol server over STDIO transport (FastMCP) · 3 agentic tools with SQLite persistence · Claude Desktop integration · protocol-level LLM-tool invocation from natural-language intent without hardcoded validation.",
    tags: ["FastMCP", "Claude", "SQLite", "MCP"],
    link: "https://github.com/uday21308/Expense-Tracker-MCP",
  },
];
