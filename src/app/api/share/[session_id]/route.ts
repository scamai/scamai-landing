import { NextRequest, NextResponse } from "next/server";
import { issueSignedToken, presignUrl } from "@vercel/blob";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Recordings live in a PRIVATE blob store (user faces/recordings — see
// /api/playground/collect). Raw blob URLs 403 in the browser, so we presign
// a short-lived GET URL per request. ShareClient re-fetches this endpoint on
// every page load, so a 1h expiry never strands a viewer mid-session.
const PRESIGN_TTL_MS = 60 * 60 * 1000;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> }
) {
  const { session_id } = await params;
  if (!session_id) return NextResponse.json({ error: "missing session_id" }, { status: 400 });

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT blob_url, mime_type
      FROM playground_sessions
      WHERE session_id = ${session_id} AND type = 'recording'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (!rows.length) return NextResponse.json({ error: "not_found" }, { status: 404 });

    // Blob pathname = URL path (put() returns <store>.blob.vercel-storage.com/<pathname>)
    const pathname = decodeURIComponent(new URL(rows[0].blob_url).pathname.slice(1));
    const signedToken = await issueSignedToken({
      pathname,
      operations: ["get"],
      validUntil: Date.now() + PRESIGN_TTL_MS,
    });
    const { presignedUrl } = await presignUrl(signedToken, {
      operation: "get",
      pathname,
      access: "private",
    });

    return NextResponse.json({ url: presignedUrl, mime_type: rows[0].mime_type });
  } catch (err) {
    const msg = String((err as Error)?.message ?? "");
    // Table doesn't exist yet — treat as not_found, not server error
    if (msg.includes("does not exist") || msg.includes("relation")) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
