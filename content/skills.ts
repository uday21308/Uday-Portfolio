export type SkillCategory = {
  label: string;
  items: string[];
};

export const skills: SkillCategory[] = [
  {
    label: "LLMs · GenAI",
    items: [
      "Gemini",
      "OpenAI",
      "Claude",
      "Groq",
      "LangChain",
      "LiteLLM",
      "MCP",
      "RAG",
      "Agentic systems",
    ],
  },
  {
    label: "ML · Vision",
    items: ["PyTorch", "TensorFlow", "Keras", "DenseNet", "Transfer Learning", "TFLite", "NLP"],
  },
  {
    label: "Backend · Data",
    items: [
      "FastAPI",
      "async/asyncpg",
      "PostgreSQL",
      "Redis",
      "SQLAlchemy",
      "FastMCP",
      "Pydantic",
    ],
  },
  {
    label: "DevOps · Obs",
    items: [
      "Docker",
      "Dokku",
      "GitHub Actions",
      "Langfuse",
      "LangSmith",
      "Pytest",
      "Android Studio",
    ],
  },
];

export const tagUsage: Record<string, string[]> = {
  // LLMs · GenAI
  Gemini: ["AI-Powered Equity Filings Agent"],
  OpenAI: ["AI-Powered Equity Filings Agent", "Healthcare RAG Assistant"],
  Claude: ["Expense Tracker MCP", "AI-Powered Equity Filings Agent", "Uday AI hybrid (this site)"],
  Groq: ["Uday AI hybrid (this site)"],
  LangChain: ["AI-Powered Equity Filings Agent"],
  LiteLLM: ["Voice Grievance Bot (Mindcres)"],
  MCP: ["Expense Tracker MCP", "Uday AI hybrid (this site)"],
  RAG: [
    "Healthcare RAG Assistant",
    "E-Commerce Voice Bot",
    "AI-Powered Equity Filings Agent",
    "Uday AI hybrid (this site)",
  ],
  "Agentic systems": ["AI-Powered Equity Filings Agent", "Expense Tracker MCP"],

  // ML · Vision
  PyTorch: ["Academic projects · coursework"],
  TensorFlow: ["Academic projects · coursework"],
  Keras: ["Academic projects · coursework"],
  DenseNet: ["Academic projects · coursework"],
  "Transfer Learning": ["Academic projects · coursework"],
  TFLite: ["Academic projects · coursework"],
  NLP: ["AI-Powered Equity Filings Agent", "Healthcare RAG Assistant"],

  // Backend · Data
  FastAPI: ["Voice Grievance Bot (Mindcres)", "Healthcare RAG Assistant"],
  "async/asyncpg": ["Voice Grievance Bot (Mindcres)"],
  PostgreSQL: ["Voice Grievance Bot (Mindcres)"],
  Redis: ["Voice Grievance Bot (Mindcres)", "Uday AI hybrid (this site)"],
  SQLAlchemy: ["Voice Grievance Bot (Mindcres)"],
  FastMCP: ["Expense Tracker MCP"],
  Pydantic: ["Voice Grievance Bot (Mindcres)", "Healthcare RAG Assistant"],

  // DevOps · Obs
  Docker: ["Voice Grievance Bot (Mindcres)"],
  Dokku: ["Voice Grievance Bot (Mindcres)"],
  "GitHub Actions": ["Uday AI hybrid (this site)"],
  Langfuse: ["Healthcare RAG Assistant"],
  LangSmith: ["E-Commerce Voice Bot"],
  Pytest: ["Voice Grievance Bot (Mindcres · 2300+ tests)"],
  "Android Studio": ["Academic projects · coursework"],
};
