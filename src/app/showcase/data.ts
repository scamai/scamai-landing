// ─── Showcase Data ───────────────────────────────────────────────
// 12 *designed* share-card concepts (9:16) for ScamAI's deepfake card.
// Same fixed face across all → the COMPOSITION is the variable, not the face.
// Each concept integrates the QR as a native design element (not bolted on).

export const QR_TARGET = "scam.ai/halo";

// Real, scannable QR. Always placed on a white quiet-zone chip per concept.
export const qrUrl = (size = 160) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&qzone=1&data=https://scam.ai/halo`;

// ONE fixed face — controlled comparison. (Real deepfake frame in production.)
export const FACE =
  "https://randomuser.me/api/portraits/men/32.jpg";

// ─── Random copy pool (idea 13 / 35) ───
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
  ["This face", "doesn't exist."],
  ["Made up.", "In 30 seconds."],
];

export const SUBS = [
  "Can you still tell what's real?",
  "Spot the fake.",
  "Your move, detective.",
  "Built to be caught.",
  "Tag someone who'd fall for it.",
];

// Deterministic seeded pick (stable per id, re-rolls on seed change).
export function pick<T>(arr: T[], id: number, seed: number, salt = 0): T {
  const i = (id * 7 + seed * 13 + salt * 31) % arr.length;
  return arr[(i + arr.length) % arr.length];
}

// ─── The 12 concepts ───
export type Concept = {
  key: string;
  name: string;
  angle: string; // what makes this composition different
  qr: string; // how the QR is designed in
};

export const CONCEPTS: Concept[] = [
  { key: "evidence", name: "Evidence Tag", angle: "Off-center polaroid pinned with tape, handwritten annotation — asymmetric.", qr: "Barcode-style sticker in the corner" },
  { key: "broadcast", name: "Broadcast Lower-Third", angle: "Full-bleed face + TV news lower-third bar — image-dominant, tiny type.", qr: "Channel-bug chip riding the bar" },
  { key: "typo", name: "Type Takeover", angle: "Giant FAKE. fills the card, face punched into the counter — type-dominant.", qr: "Becomes the period after FAKE" },
  { key: "dossier", name: "Split Dossier", angle: "Two-column editorial — mono data readout left, face right.", qr: "Foot of the data column" },
  { key: "passport", name: "ID / Specimen", angle: "Passport layout, MRZ machine zone, SPECIMEN overprint.", qr: "The official scan code in the MRZ" },
  { key: "scanline", name: "Vertical Scanline", angle: "Full-bleed face, headline set vertically up the spine.", qr: "‘Scan to verify’ chip on the scan line" },
  { key: "placard", name: "Minimal Placard", angle: "Heavy black negative space, small centered face, museum-quiet.", qr: "Centered placard below the face" },
  { key: "trading", name: "Trading Card", angle: "Framed collectible, stat block, holo border, rarity.", qr: "Authentication seal in the corner" },
  { key: "terminal", name: "Terminal Log", angle: "Full mono console, dithered face inset.", qr: "Inverted block inside the log" },
  { key: "glitch", name: "Glitch Poster", angle: "RGB-torn face, shattered headline, datamosh slices.", qr: "Slice cut through it (still scans)" },
  { key: "redacted", name: "Redacted Doc", angle: "Classified file, black redaction bars, declassified window.", qr: "Tracking-code stamp" },
  { key: "thermal", name: "Thermal Heatmap", angle: "Thermal face, synthetic-region callouts with leader lines.", qr: "Sits inside the scan reticle" },
  { key: "pull", name: "Trading Card · Play-first", angle: "#8 rebuilt to lure play: a deepfake dare + MAKE-YOURS seal — zero product copy, rarity stays subtle (gold border only).", qr: "Big MAKE YOURS → 30s seal" },
];

export const TOTAL = CONCEPTS.length;
export const conceptOf = (id: number) => CONCEPTS[(id - 1) % CONCEPTS.length];
