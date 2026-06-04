// ─── Showcase Data ───────────────────────────────────────────────
// FINAL share-card design (play-first trading card) × rarity tiers.
// Same composition; the TIER (border / badge / glow / accent) is the variable.

// QR → scam.ai homepage: the face-swap playground sits at the top there.
// (Halo = the detection product; it only gets the footer ad line.)
export const QR_TARGET = "scam.ai";

// Real, scannable QR. Always on a white quiet-zone chip.
export const qrUrl = (size = 200) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&qzone=1&data=https://scam.ai`;

// Fixed placeholder face (real deepfake frame in production).
export const FACE = "https://randomuser.me/api/portraits/men/32.jpg";

// ─── Random copy (re-rolled per share) ───
// AUTHORED PAIRS, drawn as a unit: line 1 sets up the face-swap joke,
// line 2 lands it (and nods "your turn"). Never mix pools — random×random
// produced non-sequiturs like "Mom, I can explain." + "Scan if you dare."
// CTA lives in the seal, so line 2 never has to shout "scan".
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

// Deterministic seeded pick (stable per card, re-rolls on seed change).
export function pick<T>(arr: T[], id: number, seed: number, salt = 0): T {
  const i = (id * 7 + seed * 13 + salt * 31) % arr.length;
  return arr[(i + arr.length) % arr.length];
}

// ─── Rarity tiers ───
export type Tier = {
  key: string;
  name: string;
  odds: string; // drop rate (production roll) — gallery metadata, NOT on the card
  border: string; // frame ring gradient
  glow: string; // outer glow
  chipBg: string;
  chipText: string;
  accent: string; // dare text, seal, corners
  detect: string; // detection badge dot
  shine: number; // holo sweep opacity
};

export const TIERS: Tier[] = [
  {
    key: "common",
    name: "COMMON",
    odds: "70%",
    border: "linear-gradient(135deg,#41464e,#23262b 45%,#5a6068 55%,#23262b 75%,#41464e)",
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
    odds: "20%",
    border: "linear-gradient(135deg,#5d8bff,#1f3fae 40%,#9bc0ff 55%,#1f3fae 70%,#5d8bff)",
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
    odds: "7%",
    border: "linear-gradient(135deg,#f7d77a,#b8860b 40%,#fff6d0 55%,#b8860b 70%,#f7d77a)",
    glow: "0 0 26px rgba(247,200,80,0.4)",
    chipBg: "#f7d77a",
    chipText: "#3a2a00",
    accent: "#f7d77a",
    detect: "#f7d77a",
    shine: 0.18,
  },
  // EPIC outshines gold (holo) → top tier, rarest drop.
  {
    key: "epic",
    name: "EPIC",
    odds: "3%",
    border: "linear-gradient(135deg,#a78bfa,#f472b6 35%,#60a5fa 60%,#f9a8d4 80%,#a78bfa)",
    glow: "0 0 24px rgba(167,139,250,0.42)",
    chipBg: "#c4b5fd",
    chipText: "#1a0b3a",
    accent: "#c4b5fd",
    detect: "#f472b6",
    shine: 0.2,
  },
];
