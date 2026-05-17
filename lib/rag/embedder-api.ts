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
// HF deprecated the /pipeline/feature-extraction/{model} route — current
// stable endpoint is /models/{model}. Same auth, similar body shape.
const ENDPOINT = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

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
      // wait_for_model avoids 503 on cold starts (initial load 20-30s);
      // sentence-similarity tasks should return pooled vectors directly.
      options: { wait_for_model: true },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HF Inference API failed: ${res.status} ${body.slice(0, 200)}`);
  }

  // sentence-transformers models on the /models/ endpoint return either:
  //   number[]                 — pooled + normalized sentence vector (preferred)
  //   number[][]               — single-batch wrapper around the above
  //   number[][][]             — token-level vectors needing mean-pool
  const data = (await res.json()) as unknown;

  if (Array.isArray(data) && typeof data[0] === "number") {
    return data as number[];
  }
  if (Array.isArray(data) && Array.isArray(data[0]) && typeof (data[0] as unknown[])[0] === "number") {
    return data[0] as number[];
  }
  if (
    Array.isArray(data) &&
    Array.isArray(data[0]) &&
    Array.isArray((data[0] as unknown[])[0])
  ) {
    // Token-level — mean-pool to a single vector
    const tokens = data[0] as number[][];
    const dim = tokens[0].length;
    const vec = new Array<number>(dim).fill(0);
    for (const t of tokens) for (let i = 0; i < dim; i++) vec[i] += t[i];
    for (let i = 0; i < dim; i++) vec[i] /= tokens.length;
    return vec;
  }
  throw new Error(`Unexpected HF response shape: ${JSON.stringify(data).slice(0, 120)}`);
}
