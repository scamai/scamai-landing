import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lead = {
  name?: string;
  email?: string;
  company?: string;
  useCase?: string;
  volume?: string;
  message?: string;
};

const SALES_TO = process.env.SALES_EMAIL_TO || "sales@scam.ai";
const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || "ScamAI <no-reply@scam.ai>";
const SLACK_WEBHOOK = process.env.SLACK_SALES_WEBHOOK;

async function notifySlack(lead: Lead) {
  if (!SLACK_WEBHOOK) return;
  try {
    await fetch(SLACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `:tada: New enterprise lead — ${lead.name} @ ${lead.company} (${lead.useCase ?? "no use case"})\n${lead.email}\nVolume: ${lead.volume ?? "n/a"}\n${lead.message ?? ""}`,
      }),
    });
  } catch (err) {
    console.error("[/api/enterprise-lead] slack failed:", err);
  }
}

export async function POST(req: Request) {
  const lead = (await req.json().catch(() => ({}))) as Lead;
  if (!lead.name || !lead.email || !lead.company) {
    return NextResponse.json({ error: "Name, email, company required" }, { status: 400 });
  }

  const subject = `Enterprise lead — ${lead.company} (${lead.useCase ?? "unknown"})`;
  const text = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company}`,
    `Use case: ${lead.useCase ?? "—"}`,
    `Volume: ${lead.volume ?? "—"}`,
    "",
    lead.message ?? "",
  ].join("\n");

  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: SALES_TO,
        replyTo: lead.email,
        subject,
        text,
      });
    } else {
      console.log("[enterprise-lead] (no RESEND_API_KEY, logged instead)", subject, text);
    }
    await notifySlack(lead);
  } catch (err) {
    console.error("[/api/enterprise-lead] send failed:", err);
    return NextResponse.json({ error: "Failed to send lead" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
