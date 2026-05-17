export type FaqEntry = { q: string; a: string };

export const faq: FaqEntry[] = [
  // Tech preferences
  { q: "What languages do you reach for first?",
    a: "Python is my primary, TypeScript for web." },
  { q: "What LLM providers have you shipped with?",
    a: "Groq, OpenAI, Gemini, Claude, and local Llama." },
  { q: "What vector DBs do you know?",
    a: "FAISS, Chroma, Pinecone, Upstash Vector." },
  { q: "What cloud platforms do you deploy to?",
    a: "Vercel, Render, AWS, Dokku." },
  { q: "What are you most excited about right now?",
    a: "MCP, agentic frameworks, multimodal, eval tooling, and AI automations." },

  // Why / how
  { q: "Why AI engineering specifically?",
    a: "The bottleneck on real-world AI isn't the model anymore — it's the engineering around it: retrieval, eval, orchestration, latency, cost. That's where I work — systems engineer who happens to love ML." },
  { q: "What technical area do you want to go deeper in?",
    a: "Agent evaluation and reliability — writing deterministic tests for non-deterministic systems. Also inference optimization." },

  // Logistics
  { q: "Location and remote preference?",
    a: "Currently in Vijayawada, IST. Open to relocation for the right role, can also freelance, remote is fine." },
  { q: "Time zone for interviews?",
    a: "IST (UTC+5:30)." },
  { q: "Notice period?",
    a: "Negotiable, typically around 30 days." },

  // Deeper answers
  { q: "Your single proudest technical decision?",
    a: "Chunking by AST nodes — functions, classes, docstrings as atomic units — in my Code-Aware RAG, instead of naive line-splitting. That single decision is what made the 4-index router work; the right chunk boundary turned out to be a 10× lever on retrieval quality." },
  { q: "A bug or incident that taught you something big?",
    a: "The healthcare RAG returned correct answers 95% of the time and confidently wrong ones the other 5% — and the wrong ones cited real documents. Forced me to add per-chunk source verification and a confidence-threshold refusal gate. Hallucination isn't an LLM problem, it's a system design problem." },
  { q: "Why does MCP excite you?",
    a: "MCP turns LLM apps from monoliths into composable systems — the way HTTP turned desktop apps into the web. It's the closest thing to a real standard interface for AI-talking-to-your-data that's actually getting adopted. I'd rather build on the boring open protocol than the shiny proprietary SDK." },
  { q: "What would you say to someone considering hiring you?",
    a: "I've shipped AI systems with hard reliability bars — 90%+ test coverage, traced pipelines, refusal gates — not just demos. If you need someone who can take a fuzzy idea and turn it into a production endpoint that doesn't page you at 3 am, I'm a good bet." },

  // Personal
  { q: "What do you do outside coding?",
    a: "F1, gym, music, sports." },

  // Off-limits deflections
  { q: "Salary expectations?",
    a: "Open and happy to discuss with the hiring team — depends on the role, scope, and location." },
  { q: "Visa or work-authorization status?",
    a: "Happy to discuss directly over email — udaykiranbattula304@gmail.com." },
];
