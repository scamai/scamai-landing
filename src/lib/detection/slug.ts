const ADJECTIVES = [
  "red", "blue", "green", "amber", "silver", "golden", "violet", "scarlet",
  "quick", "calm", "brave", "quiet", "shy", "bold", "clever", "loud",
  "bright", "soft", "warm", "cool", "sharp", "misty", "sunny", "foggy",
];

const ANIMALS = [
  "fox", "owl", "bear", "lynx", "hawk", "wolf", "otter", "raven",
  "stag", "crane", "heron", "falcon", "panda", "seal", "tiger", "lion",
  "hare", "crow", "mole", "boar", "swan", "dove", "finch", "koala",
];

function randHex(n: number): string {
  const chars = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Produces e.g. "red-fox-a9f2" — short, memorable, collision space ~1.5M per adjective+animal pair.
export function generateScanSlug(): string {
  return `${pick(ADJECTIVES)}-${pick(ANIMALS)}-${randHex(4)}`;
}
