import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/security/client-ip";

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

// Per-IP backstop: 60 credential fetches / minute / IP. NOTE: in-memory map —
// resets on serverless cold start (interim measure).
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || record.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

export async function GET(req: NextRequest) {
  if (!checkRateLimit(getClientIp(req))) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Cache-Control": "no-store" } }
    );
  }
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
