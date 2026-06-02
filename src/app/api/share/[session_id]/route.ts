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
      SELECT blob_url, mime_type, created_at
      FROM playground_sessions
      WHERE session_id = ${session_id} AND type = 'recording'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (!rows.length) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ url: rows[0].blob_url, mime_type: rows[0].mime_type });
  } catch {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
