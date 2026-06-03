// ─── Showcase Data ───────────────────────────────────────────────
// 50 share-card concepts grouped into 10 distinct visual angles.
// Used by the /showcase gallery so we can pick the strongest direction
// before porting the winner back into the canvas exporter.

export const QR_TARGET = "scam.ai/halo";

// QR image (real, scannable) — rendered on a small white chip per card.
export const qrUrl = (size = 140) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&data=https://scam.ai/halo`;

// Placeholder faces (swap for the live deepfake frame in production).
export const FACES = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=80&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&fit=crop&crop=faces",
];

// ─── Random copy pools (idea 13 / 35) ───
export const HEADLINES: [string, string][] = [
  ["I deepfaked", "myself in 30s."],
  ["Knock knock.", "Who am I?"],
  ["That's not me.", "Or is it?"],
  ["Trust", "no face."],
  ["Real or fake?", "You decide."],
  ["This face", "isn't real."],
  ["Spot the", "fake."],
  ["I'm not", "real."],
  ["Don't trust", "this face."],
  ["30 seconds.", "Zero trust."],
  ["Guess which", "is human."],
  ["This face", "doesn't exist."],
];

export const SUBS = [
  "Can you still tell what's real?",
  "Spot the fake.",
  "Your move, detective.",
  "Built to be caught.",
  "Tag someone who'd fall for it.",
];

// ─── Deterministic seeded pick (stable per id, re-rolls on seed change) ───
export function pick<T>(arr: T[], id: number, seed: number, salt = 0): T {
  const i = (id * 7 + seed * 13 + salt * 31) % arr.length;
  return arr[(i + arr.length) % arr.length];
}

// ─── Family metadata ───
export const FAMILIES = [
  { key: "forensic", name: "Forensic / Detection", angle: "Looks busted by the system — red brackets, confidence, verdict.", ideas: "1·2·4·5·27" },
  { key: "split", name: "Real | Fake Split", angle: "Side-by-side comparison — instantly explains the product.", ideas: "25" },
  { key: "glitch", name: "Glitch / Corrupted", angle: "Datamosh & RGB tear — strongest visual memory hook.", ideas: "26" },
  { key: "spotlight", name: "Interrogation Spotlight", angle: "Noir vignette + 30s stamp — forensic crime-scene mood.", ideas: "28·29" },
  { key: "classified", name: "Classified Watermark", angle: "Tiled DETECTED watermark / case file — anti-theft + brand.", ideas: "3" },
  { key: "rare", name: "Rare Collectible Card", angle: "Gold/holo borders + rarity + card number — pull-to-share.", ideas: "15·17·18" },
  { key: "minimal", name: "Minimal / Brand-first", angle: "Big logo, negative space — clean, premium.", ideas: "9" },
  { key: "terminal", name: "Terminal / CRT", angle: "Mono green log — {\"fake\": true}, hacker credibility.", ideas: "2·H" },
  { key: "heatmap", name: "Synthetic Heatmap", angle: "Thermal / landmark mesh over face — tech-forensic.", ideas: "4" },
  { key: "typo", name: "Bold Typographic", angle: "Giant word takeover — built for the timeline thumbnail.", ideas: "27·J" },
] as const;

export const TOTAL = 50;

export function familyOf(id: number) {
  return FAMILIES[Math.floor((id - 1) / 5)];
}
export function subOf(id: number) {
  return (id - 1) % 5; // 0..4 within family
}
