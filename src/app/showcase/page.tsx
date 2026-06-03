"use client";

// ─── /showcase ───────────────────────────────────────────────────
// Gallery of 50 share-card concepts across 10 visual angles.
// Pick the winner(s) by id, then we port them into the canvas exporter.

import { useMemo, useState } from "react";
import ShareCard from "./ShareCard";
import { FAMILIES, TOTAL, familyOf, subOf } from "./data";

export default function ShowcasePage() {
  const [seed, setSeed] = useState(0);
  const [active, setActive] = useState<string | null>(null);

  const ids = useMemo(() => {
    const all = Array.from({ length: TOTAL }, (_, i) => i + 1);
    return active ? all.filter((id) => familyOf(id).key === active) : all;
  }, [active]);

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "28px 20px 80px" }}>
      {/* Header */}
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>Share-card concepts — pick the winners</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 6, maxWidth: 640 }}>
              50 versions across 10 visual angles. Each = real layout (HTML/CSS preview). Tell me the
              numbers you like (e.g. <code style={{ color: "#7da9ff" }}>#7, #23, #41</code>) and I&apos;ll port them into the actual canvas exporter.
            </p>
          </div>
          <button
            onClick={() => setSeed((s) => s + 1)}
            style={{ background: "#245FFF", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer" }}
          >
            ↻ Re-roll copy &amp; rarity
          </button>
        </div>

        {/* Family filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "18px 0 24px" }}>
          <Chip label="All 50" on={active === null} onClick={() => setActive(null)} />
          {FAMILIES.map((f, i) => (
            <Chip key={f.key} label={`${String.fromCharCode(65 + i)} · ${f.name}`} on={active === f.key} onClick={() => setActive(f.key)} />
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 18 }}>
          {ids.map((id) => {
            const fam = familyOf(id);
            const letter = String.fromCharCode(65 + FAMILIES.indexOf(fam));
            return (
              <div key={id}>
                <ShareCard id={id} seed={seed} />
                <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>#{id}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textAlign: "right" }}>
                    {letter}{subOf(id) + 1} · {fam.name}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>ideas {fam.ideas}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "7px 12px",
        borderRadius: 999,
        cursor: "pointer",
        border: on ? "1px solid #245FFF" : "1px solid rgba(255,255,255,0.12)",
        background: on ? "rgba(36,95,255,0.18)" : "rgba(255,255,255,0.04)",
        color: on ? "#9bbcff" : "rgba(255,255,255,0.7)",
      }}
    >
      {label}
    </button>
  );
}
