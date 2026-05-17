import { pipeline, env } from "@huggingface/transformers";

// Pin to ONNX backend, allow remote model fetch on first use
env.allowLocalModels = false;
env.useBrowserCache = false;

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
export const EMBED_DIM = 384;

let extractorPromise: Promise<any> | null = null;
function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", MODEL_ID, {
      dtype: "fp32",
    });
  }
  return extractorPromise;
}

export async function embed(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  // Sequential to keep memory predictable on Vercel cold-start
  const out: number[][] = [];
  for (const t of texts) out.push(await embed(t));
  return out;
}
