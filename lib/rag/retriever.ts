export type StoredChunk = {
  id: string;
  text: string;
  vector: number[];
  source: string;
  type: "resume" | "project" | "faq" | "linkedin";
  tier: "primary" | "secondary";
  title: string;
};

export type ScoredChunk = StoredChunk & { score: number };

export type RetrieveOptions = {
  tier?: "primary" | "secondary";
  type?: StoredChunk["type"];
};

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

export class Retriever {
  constructor(private readonly chunks: StoredChunk[]) {}

  topK(query: number[], k: number, opts: RetrieveOptions = {}): ScoredChunk[] {
    if (k <= 0) return [];
    const pool = this.chunks.filter((c) =>
      (!opts.tier || c.tier === opts.tier) &&
      (!opts.type || c.type === opts.type)
    );
    const scored = pool.map((c) => ({ ...c, score: cosine(query, c.vector) }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k);
  }

  static async load(): Promise<Retriever> {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.resolve(process.cwd(), "data", "embeddings.json");
    const raw = await readFile(file, "utf8");
    return new Retriever(JSON.parse(raw));
  }
}
