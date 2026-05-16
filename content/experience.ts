export type ExperienceEntry = {
  dateRange: string;
  role: string;
  company: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    dateRange: "MAR 2026 — NOW",
    role: "AI / ML Engineer",
    company: "Mindcres Technologies",
    bullets: [
      "Architecting *25-state* voice + web grievance bot for an Indian state-government portal · Gemini · Sarvam AI · Exotel WebSocket telephony",
      "*4 microservices* · FastAPI async · provider-swap toolkit for LLM / OCR / Speech · YAML-driven prompts · Redis rate limiting",
      "Refactoring 7,000+ line monolith into modular services · *90%+* Pytest coverage · Langfuse observability",
    ],
  },
  {
    dateRange: "SEP 2025 — FEB 2026",
    role: "AI Engineer Intern",
    company: "Spinnaker Analytics · Remote · US",
    bullets: [
      "8-stage RAG pipeline · *93.3%* retrieval precision · FAISS + sentence-transformers",
      "Equity Filings Agent · 10-K/10-Q automation · adapter-pattern loaders",
      "FastMCP server · 3 agentic tools · Claude Desktop integration",
    ],
  },
];
