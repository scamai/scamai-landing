import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { detectImage } from "@/lib/detection/eva-client";
import { generateScanSlug } from "@/lib/detection/slug";
import { getAnonIdentity, countAnonScans, ANON_SCAN_LIMIT } from "@/lib/detection/fingerprint";
import { insertScan, getScanByHash, countScansByUserThisMonth } from "@/lib/db/scans";
import { getSession } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const FREE_MONTHLY_LIMIT = 20;

function bytesToDataUrl(bytes: ArrayBuffer, mime: string) {
  const b64 = Buffer.from(bytes).toString("base64");
  return `data:${mime};base64,${b64}`;
}

async function fetchFromUrl(url: string): Promise<{ bytes: ArrayBuffer; mime: string }> {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only http/https URLs allowed");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const mime = res.headers.get("content-type") || "application/octet-stream";
  if (!mime.startsWith("image/")) throw new Error("URL did not return an image");
  const ab = await res.arrayBuffer();
  if (ab.byteLength > MAX_UPLOAD_BYTES) throw new Error("Image too large (4MB max)");
  return { bytes: ab, mime };
}

export async function POST(req: Request) {
  const started = Date.now();
  let bytes: ArrayBuffer | null = null;
  let mime = "image/jpeg";
  let sourceUrl: string | null = null;

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json({ error: "Image too large (4MB max)" }, { status: 413 });
      }
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "File must be an image" }, { status: 400 });
      }
      bytes = await file.arrayBuffer();
      mime = file.type;
    } else {
      const body = (await req.json().catch(() => ({}))) as { url?: string };
      if (!body.url) {
        return NextResponse.json({ error: "Provide 'file' (multipart) or 'url' (JSON)" }, { status: 400 });
      }
      sourceUrl = body.url;
      const fetched = await fetchFromUrl(body.url);
      bytes = fetched.bytes;
      mime = fetched.mime;
    }

    if (!bytes) return NextResponse.json({ error: "No image data" }, { status: 400 });

    const imageHash = createHash("sha256").update(Buffer.from(bytes)).digest("hex");

    // Hash dedup: if this exact image was already scanned, return the existing result instantly
    const existing = await getScanByHash(imageHash);
    if (existing) {
      return NextResponse.json({
        slug: existing.slug,
        verdict: existing.verdict,
        confidence: Number(existing.confidence),
        signals: (existing.signals as { list?: unknown[] })?.list ?? [],
        modelVersion: existing.model_version,
        latencyMs: 0,
        ttfrMs: Date.now() - started,
        isPublic: existing.is_public,
        cached: true,
        reachedAnonLimit: false,
        anonScansUsed: 0,
        anonScansLimit: ANON_SCAN_LIMIT,
        shareUrl: `/scan/${existing.slug}`,
      });
    }

    // Auth + quota enforcement
    const session = await getSession();
    let userId: number | null = null;

    if (session) {
      userId = session.userId;
      if (session.plan === "free") {
        const monthlyCount = await countScansByUserThisMonth(session.userId);
        if (monthlyCount >= FREE_MONTHLY_LIMIT) {
          return NextResponse.json({
            error: "Monthly scan limit reached",
            limit: FREE_MONTHLY_LIMIT,
            used: monthlyCount,
            upgradeUrl: "/pricing",
          }, { status: 429 });
        }
      }
    }

    // Anon gate: only enforce if not logged in
    const anon = await getAnonIdentity();
    const prevAnonCount = !session ? await countAnonScans(anon.fingerprint) : 0;

    if (!session && prevAnonCount >= ANON_SCAN_LIMIT) {
      return NextResponse.json({
        error: "Free scan limit reached — sign in to continue",
        reachedAnonLimit: true,
        anonScansUsed: prevAnonCount,
        anonScansLimit: ANON_SCAN_LIMIT,
      }, { status: 429 });
    }

    const result = await detectImage(bytes);
    const slug = generateScanSlug();

    const imageUrl = bytesToDataUrl(bytes, mime);
    const ttfrMs = Date.now() - started;

    const scan = await insertScan({
      slug,
      imageHash,
      imageUrl,
      sourceUrl,
      verdict: result.verdict,
      confidence: result.confidence,
      signals: { list: result.signals, latencyMs: result.latencyMs },
      heatmapUrl: result.heatmapUrl ?? null,
      userId,
      anonFingerprint: session ? null : anon.fingerprint,
      ttfrMs,
      modelVersion: result.modelVersion,
      isPublic: true,
    });

    const anonScansUsed = session ? 0 : prevAnonCount + 1;
    const reachedAnonLimit = !session && anonScansUsed >= ANON_SCAN_LIMIT;

    return NextResponse.json({
      slug: scan.slug,
      verdict: scan.verdict,
      confidence: Number(scan.confidence),
      signals: result.signals,
      modelVersion: result.modelVersion,
      latencyMs: result.latencyMs,
      ttfrMs,
      isPublic: scan.is_public,
      cached: false,
      reachedAnonLimit,
      anonScansUsed,
      anonScansLimit: ANON_SCAN_LIMIT,
      shareUrl: `/scan/${scan.slug}`,
    });
  } catch (err) {
    console.error("[/api/scan] error:", err);
    const message = err instanceof Error ? err.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
