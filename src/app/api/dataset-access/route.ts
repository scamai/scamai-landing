import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Rate limit: max 10 requests per IP per hour
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

// All published datasets — single source of truth for the email
const DATASETS: Record<string, { name: string; link: string }> = {
  "rwfs": {
    name: "Real-World Faceswap Dataset (RWFS)",
    link: "https://drive.google.com/file/d/1A-RPa61f5ROJ0ovcXWW1fNFZgunaAOyd/view?usp=sharing",
  },
  "aiforge-doc": {
    name: "AIForge-Doc",
    link: "https://drive.google.com/file/d/1M1GZAdpdRPqlGJe9lJpLkmnxAEh4y1k1/view",
  },
  "age-estimation": {
    name: "Adversarial Age Estimation Attack Dataset",
    link: "https://drive.google.com/file/d/1QcbykqEs2zkknZexgkzWxGltWDE9smbr/view?usp=sharing",
  },
  "gpt4o-receipt": {
    name: "Fully-Synthetic AI-Generated Receipt (GPT-4o-receipt)",
    link: "https://drive.google.com/file/d/1Q7Qa-0jkjLXDjzrluFExOgVKmQn_a40T/view?usp=sharing",
  },
  "gaze-estimation": {
    name: "Simulated Gaze Estimation for Reading Dataset",
    link: "https://drive.google.com/file/d/17O4W0xdxijDaq2H21BkfKAAxgvC2Fhip/view?usp=sharing",
  },
};

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    const email = (body.email as string)?.replace(/[\r\n]/g, "").trim().slice(0, 320);
    const datasetId = (body.datasetId as string)?.replace(/[\r\n]/g, "").trim();
    const agreed = body.agreed === true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Valid email required." }, { status: 400 });
    }
    if (!agreed) {
      return NextResponse.json({ ok: false, error: "You must agree to the data usage terms." }, { status: 400 });
    }

    const dataset = datasetId ? DATASETS[datasetId] : null;
    if (!dataset) {
      return NextResponse.json({ ok: false, error: "Unknown dataset." }, { status: 400 });
    }

    console.log("[Dataset Access]", { email, dataset: dataset.name, ip });

    // Return the link immediately — the user sees it on the page
    const responsePayload = { ok: true, link: dataset.link };

    // Send a notification log to the team (fire-and-forget, don't block the user)
    if (resend) {
      resend.emails.send({
        from: "ScamAI Research <noreply@test.get-reality.com>",
        to: ["dennisng@scam.ai", "benren@scam.ai"],
        subject: `Dataset accessed: ${dataset.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px;">
            <h2 style="font-size: 16px; margin: 0 0 16px;">Dataset Access Log</h2>
            <table style="font-size: 14px; border-collapse: collapse;">
              <tr><td style="padding: 4px 12px 4px 0; color: #888;">Dataset</td><td>${dataset.name}</td></tr>
              <tr><td style="padding: 4px 12px 4px 0; color: #888;">Email</td><td>${email}</td></tr>
              <tr><td style="padding: 4px 12px 4px 0; color: #888;">IP</td><td>${ip}</td></tr>
              <tr><td style="padding: 4px 12px 4px 0; color: #888;">Time</td><td>${new Date().toISOString()}</td></tr>
            </table>
          </div>
        `,
        text: `Dataset Access Log\n\nDataset: ${dataset.name}\nEmail: ${email}\nIP: ${ip}\nTime: ${new Date().toISOString()}`,
      }).catch((err) => console.error("[Dataset Access] Notification email failed:", err));
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error("[Dataset Access] Error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
