import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import * as Sentry from "@sentry/nextjs";
import { getDb } from "@/lib/db";
import { getClientIp } from "@/lib/security/client-ip";

// ─── Playground data collection ──────────────────────────────────────────────
//
// Receives uploaded face images and faceswap session recordings from the
// landing-page playground and stores them:
//   files  → Vercel Blob, private store (auth: BLOB_STORE_ID + Vercel OIDC,
//            injected by the store↔project connection — no RW token needed)
//   index  → Neon Postgres playground_sessions table (auto-created on first write)
//
// Blobs are PRIVATE (user faces + recordings): raw blob URLs are not publicly
// fetchable. Readers must presign — see /api/share/[session_id].
//
// Body: { type: "face"|"recording", data: "<base64>", session_id: string,
//         mime_type?: string }

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME_EXT: Record<string, string> = {
  "video/webm": "webm",
  "video/mp4": "mp4",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Accepted upload kinds — anything else is rejected before touching blob/DB.
const ALLOWED_TYPES = new Set(["face", "recording"]);

// session_id is interpolated into the blob path (playground/<type>/<id>-...);
// constrain it to a safe, non-traversable charset so it can't escape the prefix.
const SESSION_ID_RE = /^[a-zA-Z0-9_-]{1,80}$/;

// Cap the decoded payload at ~10 MB. base64 inflates by ~4/3, so 10 MB decoded
// ≈ 13.98 M chars encoded; reject anything beyond ~14 M chars up front so we
// never buffer a huge attacker-supplied blob into memory.
const MAX_BASE64_LEN = 14_000_000;

// Per-IP backstop: 30 uploads / hour / IP. NOTE: in-memory map — resets on
// serverless cold start (interim measure).
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

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

async function ensureTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS playground_sessions (
      id         SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      type       TEXT NOT NULL,
      blob_url   TEXT NOT NULL,
      mime_type  TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_pg_sessions_created ON playground_sessions(created_at DESC)`;
}

export async function POST(req: NextRequest) {
  try {
    if (!checkRateLimit(getClientIp(req))) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as {
      type?: string;
      data?: string;
      session_id?: string;
      mime_type?: string;
    };

    const { type, data, session_id = "anon", mime_type } = body;
    if (!type || !data) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });

    // Validate type — only known upload kinds reach blob storage / the DB.
    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ ok: false, error: "invalid type" }, { status: 400 });
    }

    // Validate session_id (path component) before it's used in the blob key.
    if (!SESSION_ID_RE.test(session_id)) {
      return NextResponse.json({ ok: false, error: "invalid session_id" }, { status: 400 });
    }

    // Cap payload size before decoding (~10 MB decoded).
    if (typeof data !== "string" || data.length > MAX_BASE64_LEN) {
      return NextResponse.json({ ok: false, error: "payload too large" }, { status: 413 });
    }

    // Decode base64 → Buffer
    const buffer = Buffer.from(data, "base64");

    // Derive MIME and file extension
    const resolvedMime = mime_type ?? (type === "face" ? "image/jpeg" : "video/webm");
    const ext = MIME_EXT[resolvedMime] ?? "bin";
    const filename = `playground/${type}/${session_id}-${Date.now()}.${ext}`;

    // Upload to Vercel Blob — store is private-access (scam-landing-playground);
    // access:"public" is rejected outright ("Cannot use public access on a private store")
    const blob = await put(filename, buffer, {
      access: "private",
      contentType: resolvedMime,
    });

    // Save metadata to Neon
    await ensureTable();
    const sql = getDb();
    await sql`
      INSERT INTO playground_sessions (session_id, type, blob_url, mime_type)
      VALUES (${session_id}, ${type}, ${blob.url}, ${resolvedMime})
    `;

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    // Don't surface storage errors to the client — collection is best-effort.
    // But DO report to Sentry: silent failure here cost us every playground
    // upload between 2026-06-02 and 2026-06-06 (access:"public" vs private store).
    Sentry.captureException(err, {
      tags: { route: "playground/collect" },
      extra: { hasBlobStoreId: Boolean(process.env.BLOB_STORE_ID) },
    });
    console.error("[playground/collect]", err);
    return NextResponse.json({ ok: false });
  }
}
