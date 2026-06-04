// ─── Showcase Data ───────────────────────────────────────────────
// Design-gallery glue over the production share-card source of truth.
// Copy, tiers, and odds live in src/lib/share-card.ts.

export { PAIRS, TIERS, tierBorderCSS, type CopyPair, type TierDef } from "@/lib/share-card";

// Preview-only QR (gallery renders an <img>; the exporter generates offline).
export const qrUrl = (size = 200) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&qzone=1&data=https://scam.ai`;

// Fixed placeholder face (real deepfake frame in production).
export const FACE = "https://randomuser.me/api/portraits/men/32.jpg";

// Deterministic seeded pick (stable per card, re-rolls on seed change).
export function pick<T>(arr: T[], id: number, seed: number, salt = 0): T {
  const i = (id * 7 + seed * 13 + salt * 31) % arr.length;
  return arr[(i + arr.length) % arr.length];
}
