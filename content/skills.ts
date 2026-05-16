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
