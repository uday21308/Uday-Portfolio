/**
 * Runtime embedder — calls the HuggingFace Inference API.
 *
 * Why this exists separately from `embedder.ts`:
 *   - `embedder.ts` uses `@huggingface/transformers` (ONNX native runtime).
 *     Works in Node CI / Vercel build env. Used at build time by build-kb.
 *   - Vercel serverless containers do NOT ship `libonnxruntime.so.1`, so the
 *     local package fails to load at runtime.
 *   - This file uses HF's hosted Inference API instead — just `fetch`, no
 *     native deps. Same model (`all-MiniLM-L6-v2`), so 384-dim vectors are
 *     bitwise-compatible with the ones in `data/embeddings.json`.
 *
 * Required env var: HF_API_KEY (free tier — huggingface.co → Settings →
 * Access Tokens → "New token" with "Read" role).
 */
export const EMBED_DIM = 384;

const MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2";
const ENDPOINT = `https://api-inference.huggingface.co/pipeline/feature-extraction/${MODEL_ID}`;

export async function embed(text: string): Promise<number[]> {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    throw new Error(
      "HF_API_KEY env var is required at runtime. Get a free token at https://huggingface.co/settings/tokens",
    );
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: text,
      // Wait for model warm-up (cold loads can take 20-30s); without this
      // HF returns 503 on first call after the model has been idle.
      options: { wait_for_model: true },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HF Inference API failed: ${res.status} ${body.slice(0, 200)}`);
  }

  // HF's feature-extraction pipeline returns either:
  //   - number[]            (single text input, plain vector)
  //   - number[][]          (batched or pooled outputs)
  // We always send a single text, so we expect number[] of length EMBED_DIM.
  const data = (await res.json()) as number[] | number[][];
  if (Array.isArray(data[0])) {
    // Shouldn't happen with our request shape, but normalize defensively.
    return data[0] as number[];
  }
  return data as number[];
}
