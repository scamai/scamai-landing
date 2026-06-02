import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    return NextResponse.json({ url: rows[0].blob_url, mime_type: rows[0].mime_type });
  } catch (err) {
    const msg = String((err as Error)?.message ?? "");
    // Table doesn't exist yet — treat as not_found, not server error
    if (msg.includes("does not exist") || msg.includes("relation")) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
