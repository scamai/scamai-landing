import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { upsertSubscriber } from "@/lib/db/contacts";
import { htmlEscape } from "@/lib/security/html-escape";
import { getClientIp } from "@/lib/security/client-ip";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

const NOTIFY_EMAILS = ["dennisng@scam.ai", "benren@scam.ai"];

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

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

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawEmail = (body.email as string)?.replace(/[\r\n]/g, "").trim();
  const source = (body.source as string)?.replace(/[\r\n]/g, "").trim().slice(0, 64) || "footer";
  const referrer = (body.referrer as string)?.replace(/[\r\n]/g, "").trim().slice(0, 256);

  if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const email = rawEmail.toLowerCase().slice(0, 320);
  const timestamp = new Date().toISOString();

  console.log("[newsletter]", JSON.stringify({ email, source, referrer, ip, timestamp }));

  // Store in Neon Postgres
  try {
    await upsertSubscriber(email, source, referrer, ip);
  } catch (err) {
    console.error("[newsletter] DB insert failed:", err);
  }

  if (resend) {
    // Add to Resend audience for campaign targeting
    if (resendAudienceId) {
      resend.contacts.create({
        email,
        audienceId: resendAudienceId,
        unsubscribed: false,
      }).catch((err) => console.error("[newsletter] Resend contact create failed:", err));
    }

    resend.emails.send({
      from: "ScamAI <hello@scam.ai>",
      to: [email],
      bcc: NOTIFY_EMAILS,
      subject: "You're subscribed to ScamAI",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1a1a1a;">
          <div style="padding: 40px 32px 24px;">
            <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px;">Welcome to ScamAI</h1>
            <p style="font-size: 14px; color: #666; margin: 0 0 28px;">You're subscribed — weekly insights on deepfakes, synthetic media, and AI security are on their way.</p>

            <div style="background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
              <p style="font-size: 14px; color: #333; margin: 0 0 12px; line-height: 1.6;">
                Each issue covers the latest AI threats, new generator releases, and notable incidents — written by the ScamAI Research team.
              </p>
              <p style="font-size: 14px; color: #333; margin: 0; line-height: 1.6;">
                You can unsubscribe at any time by replying to this email.
              </p>
            </div>

            <p style="font-size: 13px; color: #888; margin: 0;">
              Questions? Just reply.
            </p>
          </div>

          <div style="padding: 20px 32px; background: #f7f8fa; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #999; margin: 0;">
              ScamAI &mdash; <a href="https://scam.ai" style="color: #245FFF; text-decoration: none;">scam.ai</a>
            </p>
          </div>
        </div>
      `,
      text: `Welcome to ScamAI\n\nYou're subscribed — weekly insights on deepfakes, synthetic media, and AI security are on their way.\n\nEach issue covers the latest AI threats, new generator releases, and notable incidents — written by the ScamAI Research team.\n\nYou can unsubscribe at any time by replying to this email.\n\nScamAI — https://scam.ai`,
    }).catch((err) => console.error("[newsletter] Confirmation email failed:", err));

    // Internal notification. User-controlled values (email, source, referrer)
    // are htmlEscape'd so crafted input can't inject markup/script into the
    // email a team member opens. (ip/timestamp are server-derived.)
    resend.emails.send({
      from: "ScamAI <hello@scam.ai>",
      to: NOTIFY_EMAILS,
      subject: `[Newsletter] New subscriber: ${htmlEscape(email)}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px;">
          <h2 style="font-size: 16px; margin: 0 0 16px;">New Newsletter Subscriber</h2>
          <table style="font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">Email</td><td>${htmlEscape(email)}</td></tr>
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">Source</td><td>${htmlEscape(source)}</td></tr>
            ${referrer ? `<tr><td style="padding: 4px 12px 4px 0; color: #888;">Referrer</td><td>${htmlEscape(referrer)}</td></tr>` : ""}
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">IP</td><td>${ip}</td></tr>
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">Time</td><td>${timestamp}</td></tr>
          </table>
        </div>
      `,
      text: `New Newsletter Subscriber\n\nEmail: ${email}\nSource: ${source}\n${referrer ? `Referrer: ${referrer}\n` : ""}IP: ${ip}\nTime: ${timestamp}`,
    }).catch((err) => console.error("[newsletter] Internal notification failed:", err));
  }

  return NextResponse.json({ success: true });
}
