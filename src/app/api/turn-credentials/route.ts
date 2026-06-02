import { NextResponse } from "next/server";

// ─── TURN credentials proxy ─────────────────────────────────────────────────
//
// WebRTC NAT traversal needs TURN relay credentials (STUN-only fails on ~25% of
// symmetric-NAT / CGNAT networks — exactly the booth/hotel/mobile networks at a
// trade show). The faker-100 brand backend issues short-lived (1h) Cloudflare
// TURN credentials to anonymous users at /api/turn-credentials. We proxy it
// server-side so we don't have to hold CLOUDFLARE_TURN_KEY_ID/API_TOKEN here.
//
// Falls back to public Google STUN if the upstream is unreachable, so the demo
// degrades to "works on most home/office NATs" rather than failing hard.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM =
  process.env.FACESWAP_TURN_UPSTREAM || "https://liveface.app/api/turn-credentials";

const STUN_ONLY = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export async function GET() {
  try {
    const upstream = await fetch(UPSTREAM, {
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!upstream.ok) return NextResponse.json(STUN_ONLY, { headers: { "Cache-Control": "no-store" } });
    const data = await upstream.json();
    if (!data?.iceServers) return NextResponse.json(STUN_ONLY, { headers: { "Cache-Control": "no-store" } });
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(STUN_ONLY, { headers: { "Cache-Control": "no-store" } });
  }
}
