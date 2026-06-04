"use client";

// ─── ShareCard (FINAL) ───────────────────────────────────────────
// The approved play-first trading card, parameterized by rarity tier.
// Locked requirements: detection watermark ON the face, integrated QR,
// randomized copy, real ScamAI + Qualcomm logos.

import { DARES, FACE, HEADLINES, type Tier, pick, qrUrl } from "./data";

type Props = { tier: Tier; idx: number; seed: number };

// ─── Atoms (real brand assets; SVGs are white-filled) ───
function Logo({ h = 15 }: { h?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/scamai-logo.svg" alt="scam.ai" style={{ height: h, width: "auto", display: "block" }} />;
}

function CoBrand() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
      {/* scamai svg has more internal padding (1012×256) than qualcomm (783×144) —
          14.5px vs 10px makes the wordmarks optically equal */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/scamai-logo.svg" alt="ScamAI" style={{ height: 14.5, width: "auto", opacity: 0.9 }} />
      <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.3)" }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/qualcomm-logo.svg" alt="Qualcomm" style={{ height: 10, width: "auto", opacity: 0.9 }} />
    </div>
  );
}

function QR({ size = 48, glow }: { size?: number; glow?: string }) {
  return (
    <div style={{ background: "#fff", padding: 5, borderRadius: 8, lineHeight: 0, boxShadow: glow }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrUrl(200)} alt="scan" width={size} height={size} style={{ display: "block" }} />
    </div>
  );
}

// Detection watermark — scan corners + verdict badge on the face.
function ScanCorners({ color, len = 16, w = 2, inset = 5 }: { color: string; len?: number; w?: number; inset?: number }) {
  const base = { position: "absolute" as const, width: len, height: len, borderColor: color, borderStyle: "solid" as const };
  return (
    <>
      <span style={{ ...base, top: inset, left: inset, borderWidth: `${w}px 0 0 ${w}px` }} />
      <span style={{ ...base, top: inset, right: inset, borderWidth: `${w}px ${w}px 0 0` }} />
      <span style={{ ...base, bottom: inset, left: inset, borderWidth: `0 0 ${w}px ${w}px` }} />
      <span style={{ ...base, bottom: inset, right: inset, borderWidth: `0 ${w}px ${w}px 0` }} />
    </>
  );
}

function DetectBadge({ conf, tone }: { conf: string; tone: string }) {
  return (
    <span
      style={{
        position: "absolute",
        top: 6,
        left: 6,
        zIndex: 4,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "rgba(8,8,10,0.66)",
        color: "#fff",
        fontSize: 8.5,
        fontWeight: 800,
        letterSpacing: "0.05em",
        padding: "3px 7px",
        borderRadius: 999,
        backdropFilter: "blur(4px)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: tone, boxShadow: `0 0 6px ${tone}` }} />
      DEEPFAKE · {conf}%
    </span>
  );
}

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

// ═══════════════════════════════════════════════════════════════════
export default function ShareCard({ tier, idx, seed }: Props) {
  const hl = pick(HEADLINES, idx, seed);
  const dare = pick(DARES, idx, seed, 5);
  const conf = (98 + ((idx * 7 + seed) % 190) / 100).toFixed(2);
  const no = String((idx * 137 + seed * 17) % 9999).padStart(4, "0");

  return (
    <div style={{ aspectRatio: "9 / 16", width: "100%", borderRadius: 18, padding: 3, background: tier.border, boxShadow: tier.glow }}>
      <div style={{ position: "relative", height: "100%", borderRadius: 15, overflow: "hidden", background: "#0c0a06", display: "flex", flexDirection: "column", padding: 16 }}>
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          <span style={{ background: tier.chipBg, color: tier.chipText, fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 999, letterSpacing: "0.05em" }}>
            ✦ {tier.name}
          </span>
        </div>

        {/* face — dominant, with detection watermark */}
        <div style={{ position: "relative", flex: 1, minHeight: 0, margin: "9px 0", borderRadius: 8, overflow: "hidden", border: `1px solid ${tier.accent}55` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FACE} alt="face" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg,transparent 40%,rgba(255,255,255,${tier.shine}) 50%,transparent 60%)` }} />
          <ScanCorners color={tier.accent} />
          <DetectBadge conf={conf} tone={tier.detect} />
          <span style={{ position: "absolute", top: 6, right: 8, fontFamily: mono, fontSize: 9, color: tier.accent, fontWeight: 700 }}>#{no}</span>
        </div>

        {/* random headline + deepfake dare */}
        <div style={{ fontWeight: 800, fontSize: 19, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.0 }}>
          {hl[0]} {hl[1]}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: tier.accent, margin: "6px 0 9px" }}>{dare}</div>

        {/* MAKE YOURS seal — QR is the entry point */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${tier.accent}14`, border: `1px solid ${tier.accent}4d`, borderRadius: 10, padding: "8px 10px" }}>
          <QR size={48} glow={tier.glow === "none" ? undefined : tier.glow.replace("26px", "12px").replace("24px", "12px").replace("22px", "12px")} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: tier.accent, letterSpacing: "0.03em" }}>MAKE YOURS → 30s</div>
            <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>scan · scam.ai/halo</div>
          </div>
        </div>

        {/* real-logo co-brand */}
        <div style={{ marginTop: 9 }}>
          <CoBrand />
        </div>
      </div>
    </div>
  );
}
