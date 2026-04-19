import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSession } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLACK_WEBHOOK = process.env.SLACK_FEEDBACK_WEBHOOK;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { message?: string };
  const message = body.message?.trim();

  if (!message || message.length < 3) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const session = await getSession();
  const userId = session?.userId ?? null;
  const email = session?.email ?? null;

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO feedback (user_id, email, message)
      VALUES (${userId}, ${email}, ${message})
    `;
  } catch (err) {
    console.error("[/api/feedback] db insert failed:", err);
  }

  if (SLACK_WEBHOOK) {
    try {
      await fetch(SLACK_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `💬 User feedback${email ? ` from ${email}` : " (anonymous)"}:\n${message}`,
        }),
      });
    } catch (err) {
      console.error("[/api/feedback] slack failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
