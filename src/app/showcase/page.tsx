"use client";

// ─── /showcase ───────────────────────────────────────────────────
// FINAL design × rarity tiers. In production every share rolls a tier
// (odds below each card); copy randomizes per share.

import { useState } from "react";
import ShareCard from "./ShareCard";
import { TIERS } from "./data";

export default function ShowcasePage() {
  const [seed, setSeed] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "32px 22px 90px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.03em" }}>Final card × rarity tiers</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 7, maxWidth: 640, lineHeight: 1.5 }}>
              The approved play-first trading card in its four drop tiers. Every share rolls a tier
              (odds under each card) and re-rolls the headline + dare. Detection watermark, QR, and the
              ScamAI | Qualcomm lockup are constant.
            </p>
          </div>
          <button
            onClick={() => setSeed((s) => s + 1)}
            style={{ background: "#245FFF", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer" }}
          >
            ↻ Re-roll copy
          </button>
        </div>

        {/* Tier grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 26, marginTop: 30 }}>
          {TIERS.map((tier, i) => (
            <div key={tier.key}>
              <ShareCard tier={tier} idx={i + 1} seed={seed} />
              <div style={{ marginTop: 11, textAlign: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: tier.accent }}>✦ {tier.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
