// ─── Trustworthy client IP extraction ────────────────────────────────────────
//
// On Vercel the proxy APPENDS the real connecting IP as the LAST entry of
// x-forwarded-for. Reading the FIRST entry (the old `split(",")[0]` pattern) is
// spoofable: a caller can send `X-Forwarded-For: 1.2.3.4` and the platform
// simply appends the true IP after it, so the first entry is fully attacker-
// controlled. That lets one client trivially evade per-IP rate limits.
//
// Preference order:
//   1. x-real-ip            — single value set by the Vercel edge, not spoofable
//   2. last x-forwarded-for entry — the real IP Vercel appends
//   3. "unknown"            — no header present (local/dev)

type HeaderLike = { headers: { get(name: string): string | null } };

export function getClientIp(req: HeaderLike): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) return realIp.trim();

  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return "unknown";
}
