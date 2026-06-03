"use client";

// ─── /showcase ───────────────────────────────────────────────────
// 12 *designed* share-card concepts. Same fixed face; layout is the variable.
// Pick the winner by number → we port it into the canvas exporter.

import { useState } from "react";
import ShareCard from "./ShareCard";
import { CONCEPTS } from "./data";

export default function ShowcasePage() {
  const [seed, setSeed] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "32px 22px 90px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.03em" }}>Share-card concepts — pick a direction</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 7, maxWidth: 660, lineHeight: 1.5 }}>
              12 genuinely different <b style={{ color: "#fff" }}>compositions</b> — same face throughout so you&apos;re comparing
              design, not photos. QR is designed into each (the period in <i>FAKE.</i>, the MRZ scan-zone, an evidence
              sticker…). Tell me the number(s) you like — e.g. <code style={{ color: "#7da9ff" }}>#3, #6, #11</code> — and I&apos;ll port the winner into the real canvas exporter.
            </p>
          </div>
          <button
            onClick={() => setSeed((s) => s + 1)}
            style={{ background: "#245FFF", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer" }}
          >
            ↻ Re-roll headline copy
          </button>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 26, marginTop: 30 }}>
          {CONCEPTS.map((concept, i) => {
            const id = i + 1;
            return (
              <div key={concept.key}>
                <ShareCard id={id} seed={seed} />
                <div style={{ marginTop: 11, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>#{id}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{concept.name}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginTop: 3, lineHeight: 1.45 }}>{concept.angle}</div>
                <div style={{ fontSize: 11, color: "#6f8fd6", marginTop: 4 }}>QR: {concept.qr}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
