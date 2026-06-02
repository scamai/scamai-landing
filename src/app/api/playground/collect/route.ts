import { NextRequest, NextResponse } from "next/server";

// ─── Playground data collection proxy ───────────────────────────────────────
//
// Receives uploaded face images and faceswap session recordings from the
// landing-page playground and forwards them to the Aries GPU server for
// storage. All calls are fire-and-forget from the client perspective.
//
// Expected body:
//   { type: "face" | "recording", data: "<base64>", session_id: string,
//     mime_type?: string, timestamp?: string }

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ARIES_BASE =
  process.env.ARIES_BASE_URL ||
  process.env.NEXT_PUBLIC_FACESWAP_WS?.replace(/^wss?:\/\//, "https://").replace(/\/$/, "") ||
  "https://api.liveface.app";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const res = await fetch(`${ARIES_BASE}/playground/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        source: "scamai-landing",
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(30_000),
    });

    return NextResponse.json({ ok: res.ok, status: res.status });
  } catch {
    // Best-effort — don't surface errors to the client
    return NextResponse.json({ ok: false });
  }
}
