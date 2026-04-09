import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Rate limit: max 10 requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

// Short-lived tokens: token → { link, expiresAt }
const tokenStore = new Map<string, { link: string; expiresAt: number }>();
const TOKEN_TTL = 60_000; // 60 seconds

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
const DATASETS: Record<string, { name: string; link: string; citation: string }> = {
  "rwfs": {
    name: "Real-World Faceswap Dataset (RWFS)",
    link: "https://drive.google.com/file/d/1A-RPa61f5ROJ0ovcXWW1fNFZgunaAOyd/view?usp=sharing",
    citation: `@inproceedings{ren2025deepfake,
  title={Do deepfake detectors work in reality?},
  author={Ren, Simiao and Patil, Disha and Zewde, Kidus and Ng, Tsang Dennis and Xu, Hengwei and Jiang, Shengkai and Desai, Ramini and Cheng, Ning-Yau and Zhou, Yining and Muthukrishnan, Ragavi},
  booktitle={Proceedings of the 4th workshop on security implications of deepfakes and cheapfakes},
  pages={21--26},
  year={2025}
}`,
  },
  "aiforge-doc": {
    name: "AIForge-Doc",
    link: "https://drive.google.com/file/d/1M1GZAdpdRPqlGJe9lJpLkmnxAEh4y1k1/view",
    citation: `@article{wu2026aiforge,
  title={AIForge-Doc: A Benchmark for Detecting AI-Forged Tampering in Financial and Form Documents},
  author={Wu, Jiaqi and Zhou, Yuchen and Xu, Muduo and Liang, Zisheng and Ren, Simiao and Xue, Jiayu and Yang, Meige and Chen, Siying and Huan, Jingheng},
  journal={arXiv preprint arXiv:2602.20569},
  year={2026}
}`,
  },
  "age-estimation": {
    name: "Adversarial Age Estimation Attack Dataset",
    link: "https://drive.google.com/file/d/1QcbykqEs2zkknZexgkzWxGltWDE9smbr/view?usp=sharing",
    citation: `@article{shen2026can,
  title={Can a Teenager Fool an AI? Evaluating Low-Cost Cosmetic Attacks on Age Estimation Systems},
  author={Shen, Xingyu and Duong, Tommy and An, Xiaodong and Zhao, Zengqi and Hu, Zebang and Hu, Haoyu and Wang, Ziyou and Guo, Finn and Ren, Simiao},
  journal={arXiv preprint arXiv:2602.19539},
  year={2026}
}`,
  },
  "gpt4o-receipt": {
    name: "Fully-Synthetic AI-Generated Receipt (GPT-4o-receipt)",
    link: "https://drive.google.com/file/d/1Q7Qa-0jkjLXDjzrluFExOgVKmQn_a40T/view?usp=sharing",
    citation: `@article{zhang2026gpt4o,
  title={GPT4o-Receipt: A Dataset and Human Study for AI-Generated Document Forensics},
  author={Zhang, Yan and Ren, Simiao and Raj, Ankit and Wei, En and Ng, Dennis and Shen, Alex and Xu, Jiayue and Zhang, Yuxin and Marotta, Evelyn},
  journal={arXiv preprint arXiv:2603.11442},
  year={2026}
}`,
  },
  "gaze-estimation": {
    name: "Simulated Gaze Estimation for Reading Dataset",
    link: "https://drive.google.com/file/d/17O4W0xdxijDaq2H21BkfKAAxgvC2Fhip/view?usp=sharing",
    citation: `@article{zewde2026synthetic,
  title={A Synthetic Eye Movement Dataset for Script Reading Detection: Real Trajectory Replay on a 3D Eye Simulator},
  author={Zewde, Kidus and Zhou, Yuchen and Ng, Dennis and Tiangratanakul, Neo and Duong, Tommy and Raj, Ankit and Zhang, Yuxin and Shen, Xingyu and Ren, Simiao},
  journal={arXiv preprint arXiv:XXXX.XXXXX},
  year={2026},
  note={Authors affiliated with ScamAI}
}`,
  },
};

// GET /api/dataset-access?token=xxx → redirect to Google Drive (one-time use)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required." }, { status: 400 });
  }

  const entry = tokenStore.get(token);
  if (!entry) {
    return NextResponse.json({ error: "Invalid or expired token." }, { status: 403 });
  }

  // One-time use: delete immediately
  tokenStore.delete(token);

  // Check expiry
  if (Date.now() > entry.expiresAt) {
    return NextResponse.json({ error: "Token expired. Please request access again." }, { status: 410 });
  }

  // Clean up any stale tokens
  for (const [key, val] of tokenStore) {
    if (Date.now() > val.expiresAt) tokenStore.delete(key);
  }

  return NextResponse.redirect(entry.link);
}

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

    // Generate a short-lived token instead of exposing the link
    const token = crypto.randomBytes(32).toString("hex");
    tokenStore.set(token, { link: dataset.link, expiresAt: Date.now() + TOKEN_TTL });

    // Fire-and-forget emails: (1) dataset link to user, (2) access log to team
    if (resend) {
      // Email the user with the dataset download link
      resend.emails.send({
        from: "ScamAI Research <data@scam.ai>",
        to: [email],
        cc: ["benren@scam.ai", "dennisng@scam.ai"],
        subject: `Your dataset access: ${dataset.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1a1a1a;">
            <div style="padding: 40px 32px 24px;">
              <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px;">Dataset Access Granted</h1>
              <p style="font-size: 14px; color: #666; margin: 0 0 28px;">Thank you for your interest in our research.</p>

              <div style="background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
                <p style="font-size: 13px; color: #666; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.05em;">Dataset</p>
                <p style="font-size: 16px; font-weight: 600; margin: 0 0 16px;">${dataset.name}</p>
                <a href="${dataset.link}" style="display: inline-block; background: #245FFF; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                  Download Dataset
                </a>
              </div>

              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-bottom: 24px;">
                <p style="font-size: 13px; color: #888; margin: 0 0 12px; font-weight: 600;">How to Cite</p>
                <pre style="background: #f1f3f5; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-size: 12px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; color: #333; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; line-height: 1.5; margin: 0;">${dataset.citation}</pre>
              </div>

              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                <p style="font-size: 13px; color: #888; margin: 0 0 12px; font-weight: 600;">Usage Terms</p>
                <ul style="font-size: 13px; color: #666; margin: 0; padding-left: 18px; line-height: 1.7;">
                  <li>Use solely for non-commercial research purposes</li>
                  <li>Cite the associated publication in any resulting work</li>
                  <li>Do not redistribute the dataset</li>
                </ul>
              </div>
            </div>

            <div style="padding: 20px 32px; background: #f7f8fa; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #999; margin: 0;">
                ScamAI Research &mdash; <a href="https://scam.ai/research" style="color: #245FFF; text-decoration: none;">scam.ai/research</a>
              </p>
            </div>
          </div>
        `,
        text: `Dataset Access Granted\n\nDataset: ${dataset.name}\n\nDownload: ${dataset.link}\n\nHow to Cite:\n${dataset.citation}\n\nUsage Terms:\n- Use solely for non-commercial research purposes\n- Cite the associated publication in any resulting work\n- Do not redistribute the dataset\n\nScamAI Research — https://scam.ai/research`,
      }).catch((err) => console.error("[Dataset Access] User email failed:", err));

      // Internal access log to the team
      resend.emails.send({
        from: "ScamAI Research <data@scam.ai>",
        to: ["dennisng@scam.ai", "benren@scam.ai"],
        subject: `[Log] Dataset accessed: ${dataset.name}`,
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
      }).catch((err) => console.error("[Dataset Access] Log email failed:", err));
    }

    return NextResponse.json({ ok: true, token });
  } catch (err) {
    console.error("[Dataset Access] Error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
