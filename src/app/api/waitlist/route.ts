import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { upsertSubscriber } from "@/lib/db/contacts";
import { htmlEscape } from "@/lib/security/html-escape";
import { getClientIp } from "@/lib/security/client-ip";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const NOTIFY_EMAILS = ["dennisng@scam.ai", "benren@scam.ai"];

// Rate limit: max 5 requests per IP per hour. Each accepted call fires TWO
// Resend emails (subscriber confirmation + internal notification), so abuse is
// a direct cost vector. NOTE: in-memory map — resets on serverless cold start
// (interim backstop; a persistent KV limiter is a follow-up).
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
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

type WaitlistEntry = {
  email: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referrer?: string;
  timestamp: string;
};

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await req.json();
  const { email, utm_source, utm_medium, utm_campaign, utm_content, referrer } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const entry: WaitlistEntry = {
    email: normalizedEmail,
    ...(utm_source && { utm_source }),
    ...(utm_medium && { utm_medium }),
    ...(utm_campaign && { utm_campaign }),
    ...(utm_content && { utm_content }),
    ...(referrer && { referrer }),
    timestamp: new Date().toISOString(),
  };

  console.log("[waitlist]", JSON.stringify(entry));

  // Persist to Neon (same subscribers table as newsletter — source column
  // distinguishes waitlist signups). Email notifications alone are not
  // queryable; this makes waitlist counts visible in the DB.
  try {
    await upsertSubscriber(normalizedEmail, "waitlist-scam-insurance", referrer, ip);
  } catch (err) {
    console.error("[waitlist] DB insert failed:", err);
  }

  if (resend) {
    // Confirmation email to the subscriber
    resend.emails.send({
      from: "ScamAI <hello@scam.ai>",
      to: [normalizedEmail],
      bcc: NOTIFY_EMAILS,
      subject: "You're on the scam.ai waitlist!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1a1a1a;">
          <div style="padding: 40px 32px 24px;">
            <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px;">Welcome to the waitlist!</h1>
            <p style="font-size: 14px; color: #666; margin: 0 0 28px;">You're in — we'll let you know as soon as scam.ai is ready.</p>

            <div style="background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
              <p style="font-size: 14px; color: #333; margin: 0 0 12px; line-height: 1.6;">
                As an early adopter, you'll get your <strong>first 3 months free</strong> when we launch.
              </p>
              <p style="font-size: 14px; color: #333; margin: 0; line-height: 1.6;">
                scam.ai blocks scam calls, texts, and emails before they reach you — and backs it up with insurance-backed reimbursement if anything gets through.
              </p>
            </div>

            <p style="font-size: 13px; color: #888; margin: 0;">
              Questions? Just reply to this email.
            </p>
          </div>

          <div style="padding: 20px 32px; background: #f7f8fa; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #999; margin: 0;">
              ScamAI &mdash; <a href="https://scam.ai" style="color: #245FFF; text-decoration: none;">scam.ai</a>
            </p>
          </div>
        </div>
      `,
      text: `Welcome to the scam.ai waitlist!\n\nYou're in — we'll let you know as soon as scam.ai is ready.\n\nAs an early adopter, you'll get your first 3 months free when we launch.\n\nscam.ai blocks scam calls, texts, and emails before they reach you — and backs it up with insurance-backed reimbursement if anything gets through.\n\nQuestions? Just reply to this email.\n\nScamAI — https://scam.ai`,
    }).catch((err) => console.error("[waitlist] Confirmation email failed:", err));

    // Internal notification to the team.
    // Every user-controlled value is htmlEscape'd before interpolation so a
    // crafted UTM/referrer/email can't inject markup or script into the email
    // a team member opens.
    resend.emails.send({
      from: "ScamAI <hello@scam.ai>",
      to: NOTIFY_EMAILS,
      subject: `[Waitlist] New signup: ${htmlEscape(normalizedEmail)}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px;">
          <h2 style="font-size: 16px; margin: 0 0 16px;">New Waitlist Signup</h2>
          <table style="font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">Email</td><td>${htmlEscape(normalizedEmail)}</td></tr>
            ${utm_source ? `<tr><td style="padding: 4px 12px 4px 0; color: #888;">Source</td><td>${htmlEscape(utm_source)}</td></tr>` : ""}
            ${utm_medium ? `<tr><td style="padding: 4px 12px 4px 0; color: #888;">Medium</td><td>${htmlEscape(utm_medium)}</td></tr>` : ""}
            ${utm_campaign ? `<tr><td style="padding: 4px 12px 4px 0; color: #888;">Campaign</td><td>${htmlEscape(utm_campaign)}</td></tr>` : ""}
            ${utm_content ? `<tr><td style="padding: 4px 12px 4px 0; color: #888;">Content</td><td>${htmlEscape(utm_content)}</td></tr>` : ""}
            ${referrer ? `<tr><td style="padding: 4px 12px 4px 0; color: #888;">Referrer</td><td>${htmlEscape(referrer)}</td></tr>` : ""}
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">Time</td><td>${entry.timestamp}</td></tr>
          </table>
        </div>
      `,
      text: `New Waitlist Signup\n\nEmail: ${normalizedEmail}\n${utm_source ? `Source: ${utm_source}\n` : ""}${utm_medium ? `Medium: ${utm_medium}\n` : ""}${utm_campaign ? `Campaign: ${utm_campaign}\n` : ""}${referrer ? `Referrer: ${referrer}\n` : ""}Time: ${entry.timestamp}`,
    }).catch((err) => console.error("[waitlist] Internal notification failed:", err));
  }

  return NextResponse.json({ success: true });
}
