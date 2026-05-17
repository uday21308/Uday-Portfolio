/**
 * Runtime embedder — uses HuggingFace's official Inference SDK.
 *
 * Why this exists separately from `embedder.ts`:
 *   - `embedder.ts` uses `@huggingface/transformers` (local ONNX runtime).
 *     Works in Node CI / Vercel build env. Used at build time by build-kb.
 *   - Vercel serverless containers do NOT ship `libonnxruntime.so.1`, so the
 *     local package fails to load at runtime.
 *   - This file uses the hosted Inference Providers API via the official
 *     `@huggingface/inference` SDK. Same model (`all-MiniLM-L6-v2`), so
 *     384-dim vectors stay compatible with `data/embeddings.json`.
 *
 * Required env var: HF_API_KEY (get at https://huggingface.co/settings/tokens).
 * The token should be a fine-grained token with "Make calls to Inference
 * Providers" permission (or a legacy read token that still has access).
 *
 * HF deprecated direct api-inference.huggingface.co URLs in favor of the
 * router (router.huggingface.co/hf-inference/...). Using the SDK shields us
 * from future URL changes.
 */
import { InferenceClient } from "@huggingface/inference";

export const EMBED_DIM = 384;
const MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2";

let _client: InferenceClient | null = null;
function client(): InferenceClient {
  if (!_client) {
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
      throw new Error(
        "HF_API_KEY env var is required at runtime. Get a fine-grained token with 'Make calls to Inference Providers' permission at https://huggingface.co/settings/tokens",
      );
    }
    _client = new InferenceClient(apiKey);
  }
  return _client;
}

export async function embed(text: string): Promise<number[]> {
  const result = await client().featureExtraction({
    model: MODEL_ID,
    inputs: text,
    provider: "hf-inference",
  });

  // featureExtraction returns either number[] (pooled vector) or number[][]
  // (token-level) depending on the model. all-MiniLM-L6-v2 has built-in
  // mean-pooling so we expect flat number[]; handle both defensively.
  if (Array.isArray(result) && typeof result[0] === "number") {
    return result as number[];
  }
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0] as number[];
  }
  throw new Error(`Unexpected HF embedding shape: ${JSON.stringify(result).slice(0, 120)}`);
}
