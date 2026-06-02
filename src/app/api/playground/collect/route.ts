import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getDb } from "@/lib/db";

// ─── Playground data collection ──────────────────────────────────────────────
//
// Receives uploaded face images and faceswap session recordings from the
// landing-page playground and stores them:
//   files  → Vercel Blob  (BLOB_READ_WRITE_TOKEN env var required)
//   index  → Neon Postgres playground_sessions table (auto-created on first write)
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
    const body = (await req.json()) as {
      type?: string;
      data?: string;
      session_id?: string;
      mime_type?: string;
    };

    const { type, data, session_id = "anon", mime_type } = body;
    if (!type || !data) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });

    // Decode base64 → Buffer
    const buffer = Buffer.from(data, "base64");

    // Derive MIME and file extension
    const resolvedMime = mime_type ?? (type === "face" ? "image/jpeg" : "video/webm");
    const ext = MIME_EXT[resolvedMime] ?? "bin";
    const filename = `playground/${type}/${session_id}-${Date.now()}.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: "public",
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
    // Don't surface storage errors to the client — collection is best-effort
    console.error("[playground/collect]", err);
    return NextResponse.json({ ok: false });
  }
}
