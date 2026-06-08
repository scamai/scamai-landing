import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// ─── Cookie-consent rate beacon ─────────────────────────────────────────────
//
// Records ONLY an anonymous, cookieless accept/decline decision (plus a coarse
// country from the edge header) so we can measure what fraction of visitors opt
// out of analytics entirely — a number GA/PostHog can never report, because
// declined users never load them. No cookies, no IP, no identifiers: this is
// aggregate consent telemetry under legitimate interest, not user tracking.
//
// Fired from CookieConsent.tsx on both accept and decline (best-effort).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS consent_events (
      id         SERIAL PRIMARY KEY,
      decision   TEXT NOT NULL,
      country    TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_consent_created ON consent_events(created_at DESC)`;
}

export async function POST(req: NextRequest) {
  try {
    const { decision } = (await req.json()) as { decision?: string };
    if (decision !== "accepted" && decision !== "declined") {
      return NextResponse.json({ ok: false, error: "invalid decision" }, { status: 400 });
    }

    // Coarse country only (edge-provided); never the IP.
    const country = req.headers.get("x-vercel-ip-country") ?? null;

    await ensureTable();
    const sql = getDb();
    await sql`INSERT INTO consent_events (decision, country) VALUES (${decision}, ${country})`;

    return NextResponse.json({ ok: true });
  } catch {
    // Best-effort telemetry — never surface to the client.
    return NextResponse.json({ ok: false });
  }
}
