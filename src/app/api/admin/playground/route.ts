import { NextRequest, NextResponse } from "next/server";
import { validateSession, unauthorizedResponse } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const ok = await validateSession();
  if (!ok) return unauthorizedResponse();

  const sql = getDb();
  const rows = await sql`
    SELECT id, session_id, type, blob_url, mime_type, created_at
    FROM playground_sessions
    ORDER BY created_at DESC
    LIMIT 200
  `;
  return NextResponse.json({ sessions: rows });
}

export async function DELETE(req: NextRequest) {
  const ok = await validateSession();
  if (!ok) return unauthorizedResponse();

  const { id } = (await req.json()) as { id: number };
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const sql = getDb();
  await sql`DELETE FROM playground_sessions WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
