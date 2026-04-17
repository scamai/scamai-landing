import { NextResponse } from "next/server";
import { getScanBySlug, recordScanEvent } from "@/lib/db/scans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const scan = await getScanBySlug(slug);
  if (!scan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!scan.is_public) {
    return NextResponse.json({ error: "Private scan" }, { status: 403 });
  }
  return NextResponse.json({
    slug: scan.slug,
    verdict: scan.verdict,
    confidence: Number(scan.confidence),
    signals: scan.signals,
    modelVersion: scan.model_version,
    imageUrl: scan.image_url,
    sourceUrl: scan.source_url,
    createdAt: scan.created_at,
  });
}

// PATCH handles share-toggle actions. Auth not yet wired for end users — TODO.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const scan = await getScanBySlug(slug);
  if (!scan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { action?: "share" | "unshare" | "embed" | "view" };
  if (!body.action) return NextResponse.json({ error: "Missing action" }, { status: 400 });
  await recordScanEvent(scan.id, body.action, req.headers.get("referer"));
  return NextResponse.json({ ok: true });
}
