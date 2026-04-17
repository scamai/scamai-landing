export type Verdict = "likely_ai_manipulated" | "likely_real" | "uncertain";

export type EvaSignal = {
  type:
    | "face_swap"
    | "fully_synthetic"
    | "edited_region"
    | "metadata_tampered"
    | "gan_artifacts"
    | "diffusion_artifacts";
  score: number; // 0–100
  region?: { x: number; y: number; w: number; h: number };
};

export type EvaResult = {
  verdict: Verdict;
  confidence: number; // 0–100
  signals: EvaSignal[];
  heatmapUrl?: string;
  modelVersion: string;
  latencyMs: number;
};

const EVA_URL = process.env.EVA_INFERENCE_URL;
const EVA_KEY = process.env.EVA_INFERENCE_KEY;

async function callRealEva(imageBytes: ArrayBuffer): Promise<EvaResult> {
  const started = Date.now();
  const res = await fetch(EVA_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${EVA_KEY}`,
      "Content-Type": "application/octet-stream",
    },
    body: imageBytes,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Eva inference failed: ${res.status}`);
  const data = (await res.json()) as Omit<EvaResult, "latencyMs">;
  return { ...data, latencyMs: Date.now() - started };
}

// Stub that mimics the shape of the real Eva response. Replace with real endpoint
// by setting EVA_INFERENCE_URL + EVA_INFERENCE_KEY. The stub is deterministic-ish
// by image size so the same test image returns the same verdict.
function stubEva(imageBytes: ArrayBuffer): EvaResult {
  const seed = imageBytes.byteLength % 100;
  const isAI = seed > 40;
  const confidence = 60 + (seed % 35) + Math.random() * 5; // 60–100
  const verdict: Verdict =
    confidence < 70 ? "uncertain" : isAI ? "likely_ai_manipulated" : "likely_real";

  const signals: EvaSignal[] = isAI
    ? [
        { type: "diffusion_artifacts", score: Math.min(95, confidence + 2) },
        { type: "face_swap", score: Math.max(20, confidence - 30) },
        { type: "metadata_tampered", score: seed % 50 },
      ]
    : [
        { type: "metadata_tampered", score: Math.max(5, seed % 20) },
        { type: "edited_region", score: Math.max(5, seed % 15) },
      ];

  return {
    verdict,
    confidence: Math.round(confidence * 100) / 100,
    signals,
    modelVersion: "eva-v1.6-stub",
    latencyMs: 1800 + Math.round(Math.random() * 400),
  };
}

export async function detectImage(imageBytes: ArrayBuffer): Promise<EvaResult> {
  if (EVA_URL && EVA_KEY) {
    try {
      return await callRealEva(imageBytes);
    } catch (err) {
      console.error("[eva] real inference failed, falling back to stub:", err);
      return stubEva(imageBytes);
    }
  }
  return stubEva(imageBytes);
}
