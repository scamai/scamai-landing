import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCAMAI_BASE = "https://api.scam.ai";
const AI_IMAGE_ENDPOINT = `${SCAMAI_BASE}/api/defence/ai-image-detection/detect-file`;
const FACESWAP_ENDPOINT = `${SCAMAI_BASE}/api/defence/faceswap/upload-detect`;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

const API_KEY = process.env.SCAMAI_API_KEY ?? "";

/** Calls the AI-image detector. Returns { detected, confidence } or null on failure. */
async function detectAIImage(file: Blob, filename: string) {
  const form = new FormData();
  form.append("file", file, filename);
  form.append("save", "false");
  form.append("usecase_environment", JSON.stringify({ threshold: 0.5 }));
  form.append("ai_model_info", JSON.stringify({ requested_by: "scam.ai/landing" }));

  const res = await fetch(AI_IMAGE_ENDPOINT, {
    method: "POST",
    headers: { "x-api-key": API_KEY },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ai-image detect ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return {
    detected: !!json.detected,
    confidence: Number(json.confidence ?? 0),
    threshold: Number(json?.result?.payload?.threshold_used ?? 0.5),
    processingMs: Number(json?.result?.payload?.processing_time_ms ?? 0),
  };
}

/** Calls the face-swap detector. Returns face-level findings. */
async function detectFaceSwap(file: Blob, filename: string) {
  const form = new FormData();
  form.append("files", file, filename);

  const res = await fetch(FACESWAP_ENDPOINT, {
    method: "POST",
    headers: { "x-api-key": API_KEY },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`faceswap detect ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  const faces = json?.ml_response?.results?.[0]?.faces ?? [];
  return {
    detected: json.verdict === "fake",
    confidence: Number(json.confidence ?? 0),
    numFaces: Number(json.num_faces ?? faces.length ?? 0),
    faces: faces.map((f: { face_index: number; coordinates: unknown; blended_fakeness_score: number }) => ({
      faceIndex: f.face_index,
      coordinates: f.coordinates,
      score: Number(f.blended_fakeness_score ?? 0),
    })),
    modelVersion: json?.service?.version ?? null,
  };
}

export async function POST(req: Request) {
  const started = Date.now();

  if (!API_KEY) {
    return NextResponse.json(
      { error: "Server is missing SCAMAI_API_KEY env var." },
      { status: 500 },
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Send the image as multipart/form-data with field 'file'." },
        { status: 400 },
      );
    }
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No 'file' field in upload." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image." }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Image exceeds 10 MB." }, { status: 413 });
    }

    // Read once, hand the same bytes to both detectors as fresh Blobs.
    const bytes = await file.arrayBuffer();
    const aiBlob = new Blob([bytes], { type: file.type });
    const fsBlob = new Blob([bytes], { type: file.type });

    const [aiResult, fsResult] = await Promise.allSettled([
      detectAIImage(aiBlob, file.name),
      detectFaceSwap(fsBlob, file.name),
    ]);

    const ai = aiResult.status === "fulfilled" ? aiResult.value : null;
    const faceSwap = fsResult.status === "fulfilled" ? fsResult.value : null;

    // Combined verdict: either signal triggers AI-edited
    const aiSignal = ai?.detected ?? false;
    const swapSignal = faceSwap?.detected ?? false;
    const combinedConfidence = Math.max(
      ai?.confidence ?? 0,
      faceSwap?.confidence ?? 0,
    );

    const verdict = aiSignal || swapSignal ? "Likely AI-edited" : "Likely real";
    const confidencePct = Math.round(combinedConfidence * 100);

    return NextResponse.json({
      verdict,
      confidencePct,
      aiImage: ai,
      faceSwap,
      hadAiError: aiResult.status === "rejected" ? String(aiResult.reason).slice(0, 200) : null,
      hadFsError: fsResult.status === "rejected" ? String(fsResult.reason).slice(0, 200) : null,
      latencyMs: Date.now() - started,
    });
  } catch (err) {
    console.error("[/api/scan/detect] error:", err);
    const message = err instanceof Error ? err.message : "Detection failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
