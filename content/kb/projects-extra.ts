export type ProjectExtra = {
  slug: string;
  title: string;
  tier: "primary" | "secondary";
  body: string;
};

export const projectsExtra: ProjectExtra[] = [
  {
    slug: "code-aware-rag",
    title: "Code-Aware RAG Assistant for Codebase Intelligence",
    tier: "primary",
    body: `Architected a Multi-Index RAG system with 4 specialized FAISS indexes using Python's AST module to extract functions, classes, and docstrings as atomic units, combined with a keyword-scoring query router classifying intent into 4 routes — reducing irrelevant chunk retrieval by targeting only the relevant index per query type.

Engineered hybrid retrieval pipeline combining FAISS semantic search, BM25, and MMR via Reciprocal Rank Fusion with tiktoken token budget capped at 1,500 tokens, query expansion generating 3 variants per question, and Groq Llama 3.1 delivering answers in 2–3 seconds across any project folder with LangSmith observability tracing all pipeline stages.`,
  },
  {
    slug: "car-damage-detection",
    title: "Car Damage Detection & Mobile Deployment",
    tier: "secondary",
    body: `Trained a 6-class vehicle-damage classifier (cracks, dents, scratches, glass shatter, flat tyres, lamp breakage) on a Kaggle dataset of ~400 images per class, fine-tuning a pretrained DenseNet-169 backbone with a custom classifier head — raising baseline CNN accuracy from 82% to 95% via data augmentation, hyperparameter tuning, and per-class confusion-matrix analysis.

Exported the trained model to TensorFlow Lite and shipped it inside a native Android app (Kotlin, Android Studio) for on-device offline inference, enabling field damage assessment for insurance-claim automation without server round-trips.`,
  },
  {
    slug: "studio-mcu",
    title: "STUDIO MCU — Responsive Entertainment Platform",
    tier: "secondary",
    body: `Developed a responsive entertainment platform using HTML5, CSS3, and vanilla JavaScript with modular component architecture, supporting ticket booking, merchandise purchasing, and movie reviews.

Implemented mobile-first design with CSS Grid and Flexbox, ensuring optimal viewing experience across devices with 100% responsive breakpoints.`,
  },
];
