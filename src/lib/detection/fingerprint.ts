import { cookies, headers } from "next/headers";
import { createHash, randomBytes } from "crypto";

const ANON_COOKIE = "scamai_anon";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export type AnonIdentity = {
  fingerprint: string; // stable hash used for the 2-scan gate
  anonId: string; // raw cookie value
  remoteIp: string;
};

function readIp(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return h.get("x-real-ip") || "0.0.0.0";
}

export async function getAnonIdentity(): Promise<AnonIdentity> {
  const h = await headers();
  const c = await cookies();

  let anonId = c.get(ANON_COOKIE)?.value;
  if (!anonId) {
    anonId = randomBytes(16).toString("hex");
    c.set(ANON_COOKIE, anonId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }

  const ip = readIp(h);
  const ua = h.get("user-agent") || "";
  const fingerprint = createHash("sha256")
    .update(`${anonId}|${ip}|${ua}`)
    .digest("hex");

  return { fingerprint, anonId, remoteIp: ip };
}

// Counts anonymous scans for this fingerprint. Caller decides whether to block.
export async function countAnonScans(fingerprint: string): Promise<number> {
  const { getDb } = await import("@/lib/db");
  const sql = getDb();
  const rows = await sql`
    SELECT COUNT(*)::int AS n
    FROM scans
    WHERE anon_fingerprint = ${fingerprint}
      AND user_id IS NULL
      AND created_at > NOW() - INTERVAL '30 days'
  `;
  return Number((rows[0] as { n: number })?.n ?? 0);
}

export const ANON_SCAN_LIMIT = 2;
