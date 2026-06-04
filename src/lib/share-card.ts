// ─── Share-card data (single source of truth) ────────────────────
// Used by BOTH the /showcase design gallery and the production canvas
// exporter in FaceswapPlayground. Approved design: play-first trading card.
//
// QR / CTA → scam.ai homepage (face-swap playground lives at the top).
// Halo (detection product) gets only the one-line footer ad.

// UTM-tagged so card-driven arrivals are attributable in GA4/PostHog instead
// of vanishing into "direct". One medium per surface: qr (card scan), x (tweet
// intent link). Keep the human-visible share TEXT clean ("→ scam.ai") — the
// ugly query string only ever lives inside the QR pixels / t.co-wrapped link.
export const QR_TARGET = "https://scam.ai/?utm_source=share_card&utm_medium=qr&utm_campaign=playground";
export const SHARE_URL_X = "https://scam.ai/?utm_source=share_card&utm_medium=x&utm_campaign=playground";

// ─── Copy: AUTHORED setup+punchline pairs, drawn as a unit ───
// Line 1 sets up the face-swap joke, line 2 lands it and nods "your turn".
// Never split into independent pools — random×random yields non-sequiturs.
export type CopyPair = { h: [string, string]; p: string };

export const PAIRS: CopyPair[] = [
  { h: ["I deepfaked", "myself in 30s."], p: "Your face is next." },
  { h: ["Knock knock.", "Who am I?"], p: "Hint: not who you think." },
  { h: ["New face,", "who dis?"], p: "Swap yours. See who answers." },
  { h: ["Mom, I can", "explain."], p: "OK fine — that's not even me." },
  { h: ["Plot twist:", "I'm AI."], p: "Took 30 seconds. Beat that." },
  { h: ["POV: I don't", "exist."], p: "You could not-exist too." },
  { h: ["100% me.", "Allegedly."], p: "My lawyer calls it a face swap." },
  { h: ["Born 30", "seconds ago."], p: "Aged remarkably well." },
  { h: ["Catfish", "speedrun."], p: "World record: 30 seconds." },
  { h: ["This face", "doesn't exist."], p: "Yours doesn't have to either." },
  { h: ["Me 2.0", "just dropped."], p: "Patch notes: new face." },
  { h: ["Face stolen.", "Legally."], p: "Steal yours back in 30s." },
  { h: ["My twin?", "Never met him."], p: "He's 30 seconds old." },
  { h: ["Identity:", "404."], p: "Face found. Just not mine." },
  { h: ["Real or fake?", "You decide."], p: "Spoiler: you'll guess wrong." },
];

// ─── Rarity tiers ───
// Gradient stops are canvas-friendly; CSS strings derive via tierBorderCSS().
export type TierDef = {
  key: string;
  name: string;
  odds: number; // production drop probability (sums to 1)
  oddsLabel: string; // baked into the card's bottom strip
  glow: string; // CSS outer glow (gallery preview; exporter skips)
  stops: [number, string][]; // 135° border-ring gradient
  chipBg: string;
  chipText: string;
  accent: string; // dare, seal, corners, drop strip
  detect: string; // detection-badge dot
  shine: number; // holo sweep opacity
};

export const TIERS: TierDef[] = [
  {
    key: "common",
    name: "COMMON",
    odds: 0.7,
    oddsLabel: "70%",
    stops: [[0, "#41464e"], [0.45, "#23262b"], [0.55, "#5a6068"], [0.75, "#23262b"], [1, "#41464e"]],
    glow: "none",
    chipBg: "#aab2bd",
    chipText: "#15181c",
    accent: "#c8cdd4",
    detect: "#ef4444",
    shine: 0.07,
  },
  {
    key: "rare",
    name: "RARE",
    odds: 0.2,
    oddsLabel: "20%",
    stops: [[0, "#5d8bff"], [0.4, "#1f3fae"], [0.55, "#9bc0ff"], [0.7, "#1f3fae"], [1, "#5d8bff"]],
    glow: "0 0 22px rgba(93,139,255,0.35)",
    chipBg: "#9bbcff",
    chipText: "#08163a",
    accent: "#9bbcff",
    detect: "#9bbcff",
    shine: 0.12,
  },
  {
    key: "gold",
    name: "GOLD",
    odds: 0.07,
    oddsLabel: "7%",
    stops: [[0, "#f7d77a"], [0.4, "#b8860b"], [0.55, "#fff6d0"], [0.7, "#b8860b"], [1, "#f7d77a"]],
    glow: "0 0 26px rgba(247,200,80,0.4)",
    chipBg: "#f7d77a",
    chipText: "#3a2a00",
    accent: "#f7d77a",
    detect: "#f7d77a",
    shine: 0.18,
  },
  // EPIC (holo) outranks gold → rarest drop.
  {
    key: "epic",
    name: "EPIC",
    odds: 0.03,
    oddsLabel: "3%",
    stops: [[0, "#a78bfa"], [0.35, "#f472b6"], [0.6, "#60a5fa"], [0.8, "#f9a8d4"], [1, "#a78bfa"]],
    glow: "0 0 24px rgba(167,139,250,0.42)",
    chipBg: "#c4b5fd",
    chipText: "#1a0b3a",
    accent: "#c4b5fd",
    detect: "#f472b6",
    shine: 0.2,
  },
];

export const tierBorderCSS = (t: TierDef) =>
  `linear-gradient(135deg, ${t.stops.map(([o, c]) => `${c} ${Math.round(o * 100)}%`).join(", ")})`;

// Roll a tier with production odds. Pass r for deterministic tests.
export function rollTier(r: number = Math.random()): TierDef {
  let acc = 0;
  for (const t of TIERS) {
    acc += t.odds;
    if (r < acc) return t;
  }
  return TIERS[0];
}

// Share text for the native sheet / X intent — matches the rolled pair.
export const shareText = (pair: CopyPair) =>
  `${pair.h[0]} ${pair.h[1]} ${pair.p} 😳 → scam.ai`;
