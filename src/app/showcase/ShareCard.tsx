"use client";

// ─── ShareCard ───────────────────────────────────────────────────
// Renders one of 50 share-card concepts from a numeric id + seed.
// Pure presentational: layout/visual exploration only (HTML/CSS).
// Winner gets ported back into the canvas exporter in FaceswapPlayground.

import {
  FACES,
  HEADLINES,
  SUBS,
  familyOf,
  pick,
  qrUrl,
  subOf,
} from "./data";

type Props = { id: number; seed: number };

// ─── Shared atoms ───
function Logo({ h = 18, light = true }: { h?: number; light?: boolean }) {
  return (
    <span
      style={{
        fontWeight: 800,
        fontSize: h,
        letterSpacing: "-0.02em",
        color: light ? "#fff" : "#000",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span
        style={{
          width: h * 0.82,
          height: h * 0.82,
          borderRadius: "50%",
          border: `${Math.max(2, h / 8)}px solid ${light ? "#fff" : "#000"}`,
          display: "inline-block",
        }}
      />
      scam.ai
    </span>
  );
}

function LiveBadge({ label = "LIVE AI" }: { label?: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "#fff",
        background: "#ef4444",
        padding: "3px 8px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
      {label}
    </span>
  );
}

function CoBrand({ dark = false }: { dark?: boolean }) {
  const c = dark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.5)";
  const strong = dark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.82)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        color: c,
      }}
    >
      <span style={{ color: strong }}>ScamAI</span>
      <span style={{ opacity: 0.5 }}>|</span>
      <span style={{ color: strong }}>Qualcomm</span>
    </div>
  );
}

function QRChip({ size = 56, label = "Scan to try" }: { size?: number; label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          background: "#fff",
          padding: 5,
          borderRadius: 8,
          lineHeight: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrUrl(140)} alt="QR" width={size} height={size} style={{ display: "block" }} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.6)", lineHeight: 1.3 }}>
        {label}
        <br />
        <span style={{ color: "rgba(255,255,255,0.9)" }}>scam.ai/halo</span>
      </div>
    </div>
  );
}

function CTA({ text = "Try it free  →  scam.ai/halo" }: { text?: string }) {
  return (
    <div
      style={{
        background: "#245FFF",
        color: "#fff",
        fontWeight: 700,
        fontSize: 13,
        textAlign: "center",
        padding: "11px 10px",
        borderRadius: 11,
      }}
    >
      {text}
    </div>
  );
}

function Face({
  src,
  filter,
  className,
  children,
  style,
}: {
  src: string;
  filter?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="face"
        style={{ width: "100%", height: "100%", objectFit: "cover", filter, display: "block" }}
      />
      {children}
    </div>
  );
}

function Headline({ lines, size = 26 }: { lines: [string, string]; size?: number }) {
  return (
    <div style={{ fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: "-0.03em", color: "#fff" }}>
      {lines[0]}
      {lines[1] && <br />}
      {lines[1]}
    </div>
  );
}

// ─── Card frame ───
function Frame({
  children,
  bg = "#080808",
  border,
  glow,
}: {
  children: React.ReactNode;
  bg?: string;
  border?: string;
  glow?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "9 / 16",
        width: "100%",
        borderRadius: 16,
        overflow: "hidden",
        background: bg,
        border: border ?? "1px solid rgba(255,255,255,0.08)",
        boxShadow: glow,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

// Corner reticle brackets (reused by forensic/heatmap)
function Brackets({ color = "#ef4444", inset = 10, len = 22, w = 2 }: { color?: string; inset?: number; len?: number; w?: number }) {
  const c = { position: "absolute" as const, width: len, height: len, borderColor: color, borderStyle: "solid" as const };
  return (
    <>
      <span style={{ ...c, top: inset, left: inset, borderWidth: `${w}px 0 0 ${w}px` }} />
      <span style={{ ...c, top: inset, right: inset, borderWidth: `${w}px ${w}px 0 0` }} />
      <span style={{ ...c, bottom: inset, left: inset, borderWidth: `0 0 ${w}px ${w}px` }} />
      <span style={{ ...c, bottom: inset, right: inset, borderWidth: `0 ${w}px ${w}px 0` }} />
    </>
  );
}

const pad = { padding: "12px 13px" };

// ═══════════════════════════════════════════════════════════════════
export default function ShareCard({ id, seed }: Props) {
  const fam = familyOf(id).key;
  const sub = subOf(id);
  const hl = pick(HEADLINES, id, seed);
  const subc = pick(SUBS, id, seed, 2);
  const face = pick(FACES, id, seed, 1);
  const confidence = (99 + ((id * 7 + seed) % 90) / 100).toFixed(2);
  const cardNo = String(((id * 137 + seed * 17) % 9999)).padStart(4, "0");

  switch (fam) {
    // ─────────────────────────────────────────── A. FORENSIC
    case "forensic":
      return (
        <Frame>
          <div style={{ ...pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo />
            <LiveBadge />
          </div>
          <Face src={face} style={{ flex: 1, margin: "0 13px", borderRadius: 12 }}>
            {sub === 0 && <Brackets />}
            {sub === 0 && (
              <div style={{ position: "absolute", top: 8, right: 8, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 6px", borderRadius: 4, letterSpacing: "0.05em" }}>
                DEEPFAKE · {confidence}%
              </div>
            )}
            {sub === 2 && (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <div style={{ width: 90, height: 90, border: "2px solid #ef4444", borderRadius: "50%" }} />
                <div style={{ position: "absolute", width: 130, height: 1, background: "rgba(239,68,68,0.6)" }} />
                <div style={{ position: "absolute", width: 1, height: 130, background: "rgba(239,68,68,0.6)" }} />
              </div>
            )}
            {sub === 3 && (
              <div style={{ position: "absolute", top: "22%", left: "18%", right: "18%", bottom: "30%", border: "2px dashed #ef4444", borderRadius: 6 }}>
                <span style={{ position: "absolute", top: -16, left: -2, background: "#ef4444", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 3 }}>SYNTHETIC</span>
              </div>
            )}
            {sub === 4 && (
              <div style={{ position: "absolute", left: 8, right: 8, bottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#fff", fontWeight: 700, marginBottom: 3 }}>
                  <span style={{ color: "#22c55e" }}>ANALYZING</span>
                  <span style={{ color: "#ef4444" }}>→ FAKE</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,#22c55e,#ef4444)" }} />
                </div>
              </div>
            )}
            {sub === 1 && <Brackets inset={6} len={16} />}
          </Face>
          <div style={{ ...pad }}>
            {sub === 1 ? (
              <div style={{ fontWeight: 900, fontSize: 30, color: "#ef4444", letterSpacing: "-0.02em", marginBottom: 6 }}>
                VERDICT: FAKE
              </div>
            ) : (
              <Headline lines={hl} />
            )}
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "5px 0 10px" }}>{subc}</div>
            <CTA />
            <div style={{ marginTop: 10 }}><CoBrand /></div>
          </div>
        </Frame>
      );

    // ─────────────────────────────────────────── B. SPLIT
    case "split": {
      const dir = sub; // 0 vert,1 horiz,2 diagonal,3 vs,4 slider
      return (
        <Frame>
          <div style={{ ...pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo />
            <LiveBadge />
          </div>
          <div style={{ flex: 1, margin: "0 13px", borderRadius: 12, overflow: "hidden", position: "relative", display: "flex", flexDirection: dir === 1 ? "column" : "row" }}>
            <Face src={face} style={{ flex: 1, clipPath: dir === 2 ? "polygon(0 0,100% 0,0 100%)" : undefined }}>
              <div style={{ position: "absolute", top: 8, left: 8, background: "#22c55e", color: "#031b08", fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 4 }}>REAL</div>
            </Face>
            <Face src={face} filter="hue-rotate(-25deg) saturate(1.3) contrast(1.05)" style={{ flex: 1, clipPath: dir === 2 ? "polygon(100% 0,100% 100%,0 100%)" : undefined, position: dir === 2 ? "absolute" : "relative", inset: dir === 2 ? 0 : undefined }}>
              <div style={{ position: "absolute", top: 8, right: 8, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 4 }}>FAKE</div>
            </Face>
            {/* divider glow */}
            <div style={{ position: "absolute", ...(dir === 1 ? { left: 0, right: 0, top: "50%", height: 2 } : { top: 0, bottom: 0, left: "50%", width: 2 }), background: "linear-gradient(#22c55e,#ef4444)", boxShadow: "0 0 12px rgba(255,255,255,0.6)" }} />
            {dir === 3 && (
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 38, height: 38, borderRadius: "50%", background: "#000", border: "2px solid #fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 900, color: "#fff" }}>VS</div>
            )}
            {dir === 4 && (
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 24, transform: "translateX(-50%)", display: "grid", placeItems: "center" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", fontSize: 12, color: "#000", fontWeight: 800 }}>⇄</div>
              </div>
            )}
          </div>
          <div style={{ ...pad }}>
            <Headline lines={["One is real.", "One isn't."]} size={24} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "5px 0 10px" }}>{subc}</div>
            <CTA />
            <div style={{ marginTop: 10 }}><CoBrand /></div>
          </div>
        </Frame>
      );
    }

    // ─────────────────────────────────────────── C. GLITCH
    case "glitch":
      return (
        <Frame bg="#05060a">
          <div style={{ ...pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo />
            <LiveBadge label="SIGNAL LOST" />
          </div>
          <Face src={face} filter={sub === 0 ? "contrast(1.1)" : undefined} style={{ flex: 1, margin: "0 13px", borderRadius: 12 }}>
            {sub === 0 && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={face} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "screen", opacity: 0.5, transform: "translateX(4px)", filter: "sepia(1) saturate(6) hue-rotate(-50deg)" }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={face} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "screen", opacity: 0.5, transform: "translateX(-4px)", filter: "sepia(1) saturate(6) hue-rotate(150deg)" }} />
              </>
            )}
            {sub === 1 && [18, 42, 66].map((t) => (
              <div key={t} style={{ position: "absolute", left: 0, right: 0, top: `${t}%`, height: "6%", background: `url(${face})`, backgroundSize: "cover", backgroundPosition: `center ${t}%`, transform: `translateX(${t % 2 ? 12 : -12}px)`, filter: "hue-rotate(40deg)" }} />
            ))}
            {sub === 2 && (
              <div style={{ position: "absolute", left: 0, right: 0, top: "40%", height: "12%", background: `url(${face})`, backgroundSize: "cover", backgroundPosition: "center 40%", filter: "saturate(0) contrast(2)", transform: "scaleY(0.4)" }} />
            )}
            {sub === 3 && (
              <>
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.35) 3px)" }} />
                <div style={{ position: "absolute", top: "46%", left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.85)", transform: "translateX(8px)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 10, fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.1em", fontFamily: "monospace" }}>SIGNAL CORRUPTED</div>
              </>
            )}
            {sub === 4 && (
              <>
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04) 1px,transparent 2px,transparent 4px)" }} />
                <div style={{ position: "absolute", top: 8, left: 10, fontSize: 9, fontFamily: "monospace", color: "#fff", opacity: 0.85 }}>▶ REC  00:30</div>
              </>
            )}
          </Face>
          <div style={{ ...pad }}>
            <Headline lines={hl} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "5px 0 10px" }}>{subc}</div>
            <CTA />
            <div style={{ marginTop: 10 }}><CoBrand /></div>
          </div>
        </Frame>
      );

    // ─────────────────────────────────────────── D. SPOTLIGHT
    case "spotlight":
      return (
        <Frame bg="#040404">
          <div style={{ ...pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo />
            <LiveBadge />
          </div>
          <Face src={face} filter={sub === 1 ? "grayscale(1) contrast(1.15)" : "contrast(1.05)"} style={{ flex: 1, margin: "0 13px", borderRadius: 12 }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 45% at 50% 42%, transparent 0%, rgba(0,0,0,0.85) 100%)" }} />
            {sub === 0 && (
              <div style={{ position: "absolute", top: 10, right: 10, width: 40, height: 40, borderRadius: "50%", border: "2px solid #fff", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 900, color: "#fff", transform: "rotate(-12deg)" }}>30s</div>
            )}
            {sub === 2 && (
              <>
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(255,255,255,0.12) 19px)" }} />
                <div style={{ position: "absolute", bottom: 8, left: 8, fontFamily: "monospace", fontSize: 9, color: "#fff", opacity: 0.7 }}>ID-{cardNo}</div>
              </>
            )}
            {sub === 3 && (
              <div style={{ position: "absolute", top: 10, left: 10, background: "#facc15", color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 6px", borderRadius: 3, letterSpacing: "0.05em" }}>EXHIBIT A</div>
            )}
            {sub === 4 && (
              <>
                <div style={{ position: "absolute", top: "34%", left: "20%", width: "35%", height: 14, background: "#000" }} />
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, height: 12, background: "#000", opacity: 0.85 }} />
              </>
            )}
          </Face>
          <div style={{ ...pad }}>
            <Headline lines={hl} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "5px 0 10px" }}>{subc}</div>
            <CTA />
            <div style={{ marginTop: 10 }}><CoBrand /></div>
          </div>
        </Frame>
      );

    // ─────────────────────────────────────────── E. CLASSIFIED
    case "classified": {
      const wm = "scam.ai · DETECTED";
      return (
        <Frame bg="#0a0a0a">
          <div style={{ ...pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo />
            <LiveBadge />
          </div>
          <Face src={face} filter="contrast(1.02)" style={{ flex: 1, margin: "0 13px", borderRadius: 12 }}>
            {sub === 0 && (
              <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(-35deg, transparent, transparent 60px, rgba(239,68,68,0.0) 60px)`, display: "grid", placeItems: "center" }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.18, transform: "rotate(-32deg) scale(1.4)", color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 2.6, fontFamily: "monospace", wordSpacing: 6, overflow: "hidden", whiteSpace: "pre-wrap" }}>
                  {Array(40).fill(wm + "  ").join("")}
                </div>
              </div>
            )}
            {sub === 1 && (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <div style={{ border: "3px solid #ef4444", color: "#ef4444", fontSize: 18, fontWeight: 900, padding: "6px 14px", borderRadius: 6, transform: "rotate(-14deg)", letterSpacing: "0.08em", opacity: 0.85 }}>CONFIDENTIAL</div>
              </div>
            )}
            {sub === 2 && (
              <>
                <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(255,255,255,0.4)" }} />
                <div style={{ position: "absolute", bottom: 12, left: 12, fontFamily: "monospace", fontSize: 8, color: "#fff", opacity: 0.7 }}>CASE FILE · DF-{cardNo}</div>
              </>
            )}
            {sub === 3 && (
              <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", alignItems: "flex-end", gap: 1, height: 26 }}>
                {Array(34).fill(0).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: "100%", background: i % 3 === 0 ? "#fff" : i % 2 ? "rgba(255,255,255,0.5)" : "#fff", opacity: i % 5 ? 1 : 0.3 }} />
                ))}
              </div>
            )}
            {sub === 4 && (
              <div style={{ position: "absolute", inset: 0, opacity: 0.1, color: "#ef4444", fontSize: 22, fontWeight: 900, lineHeight: 1.1, overflow: "hidden", transform: "rotate(-18deg) scale(1.3)" }}>
                {Array(60).fill("FAKE ").join("")}
              </div>
            )}
          </Face>
          <div style={{ ...pad }}>
            <Headline lines={hl} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "5px 0 10px" }}>{subc}</div>
            <CTA />
            <div style={{ marginTop: 10 }}><CoBrand /></div>
          </div>
        </Frame>
      );
    }

    // ─────────────────────────────────────────── F. RARE
    case "rare": {
      const tiers = [
        { name: "RARE", border: "linear-gradient(135deg,#f7d77a,#b8860b,#f7d77a)", glow: "0 0 22px rgba(247,200,80,0.4)", chip: "#f7d77a", txt: "#3a2a00" },
        { name: "EPIC", border: "linear-gradient(135deg,#a78bfa,#f472b6,#60a5fa,#a78bfa)", glow: "0 0 24px rgba(167,139,250,0.45)", chip: "#c4b5fd", txt: "#1a0b3a" },
        { name: "COMMON", border: "linear-gradient(135deg,#6b7280,#9ca3af)", glow: "none", chip: "#9ca3af", txt: "#111" },
        { name: "LEGENDARY", border: "conic-gradient(from 0deg,#fde68a,#f472b6,#67e8f9,#fde68a)", glow: "0 0 30px rgba(253,224,138,0.5)", chip: "#fde68a", txt: "#2a1500" },
        { name: "HOLO", border: "linear-gradient(135deg,#67e8f9,#a78bfa,#f9a8d4,#67e8f9)", glow: "0 0 24px rgba(103,232,249,0.4)", chip: "#a5f3fc", txt: "#062b30" },
      ];
      const t = tiers[sub];
      return (
        <div style={{ position: "relative", aspectRatio: "9 / 16", width: "100%", borderRadius: 18, padding: 3, background: t.border, boxShadow: t.glow }}>
          <Frame bg="#0a0a0c" border="none">
            <div style={{ ...pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Logo />
              <span style={{ background: t.chip, color: t.txt, fontSize: 9, fontWeight: 900, padding: "3px 7px", borderRadius: 999, letterSpacing: "0.06em" }}>✦ {t.name}</span>
            </div>
            <Face src={face} style={{ flex: 1, margin: "0 13px", borderRadius: 12, border: `1px solid ${t.chip}55` }}>
              {sub === 4 && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg,transparent 35%,rgba(255,255,255,0.25) 50%,transparent 65%)" }} />}
              <div style={{ position: "absolute", top: 8, right: 8, fontFamily: "monospace", fontSize: 9, color: t.chip, fontWeight: 700 }}>#{cardNo}</div>
            </Face>
            <div style={{ ...pad }}>
              <Headline lines={hl} size={22} />
              {sub === 3 || sub === 1 ? (
                <div style={{ display: "flex", gap: 6, margin: "8px 0 10px" }}>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 7, padding: "5px 8px" }}>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>REALISM</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: t.chip }}>{confidence}</div>
                  </div>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 7, padding: "5px 8px" }}>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>TRUST</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#ef4444" }}>00.3</div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "5px 0 10px" }}>{subc}</div>
              )}
              <CTA />
              <div style={{ marginTop: 10 }}><CoBrand /></div>
            </div>
          </Frame>
        </div>
      );
    }

    // ─────────────────────────────────────────── G. MINIMAL
    case "minimal":
      return (
        <Frame bg={sub === 4 ? "#0e0e0e" : "#060606"}>
          {sub === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Logo h={26} /><LiveBadge /></div>
              <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
                <Face src={face} style={{ width: 92, height: 92, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)" }} />
              </div>
              <Headline lines={hl} size={26} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: "6px 0 12px" }}>{subc}</div>
              <CTA />
              <div style={{ marginTop: 12 }}><CoBrand /></div>
            </div>
          )}
          {sub === 1 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><Logo /><LiveBadge /></div>
              <Face src={face} style={{ flex: 1, borderRadius: 14, margin: "14px 0" }} />
              <Headline lines={[hl[0] + " " + hl[1], ""]} size={20} />
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#245FFF", fontWeight: 700 }}>scam.ai/halo →</span>
                <CoBrand />
              </div>
            </div>
          )}
          {sub === 2 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16, justifyContent: "space-between" }}>
              <Logo h={22} />
              <div style={{ fontWeight: 900, fontSize: 40, lineHeight: 0.98, letterSpacing: "-0.04em", color: "#fff" }}>{hl[0]}<br />{hl[1]}</div>
              <Face src={face} style={{ height: 120, borderRadius: 12 }} />
              <CoBrand />
            </div>
          )}
          {sub === 3 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: 10 }}><Logo /><LiveBadge /></div>
              <Face src={face} style={{ flex: 1, borderRadius: 4, margin: "12px 0" }} />
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 10 }}>
                <Headline lines={hl} size={22} />
                <div style={{ marginTop: 10 }}><CTA /></div>
                <div style={{ marginTop: 10 }}><CoBrand /></div>
              </div>
            </div>
          )}
          {sub === 4 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><Logo /><LiveBadge /></div>
              <Face src={face} filter="grayscale(1) contrast(1.1)" style={{ flex: 1, borderRadius: 12, margin: "14px 0" }} />
              <Headline lines={hl} size={24} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: "6px 0 12px" }}>{subc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <QRChip size={44} />
                <CoBrand />
              </div>
            </div>
          )}
        </Frame>
      );

    // ─────────────────────────────────────────── H. TERMINAL
    case "terminal": {
      const palette = [
        { fg: "#22ff88", bg: "#020805" },
        { fg: "#ffb000", bg: "#0a0600" },
        { fg: "#22ff88", bg: "#000" },
        { fg: "#7dd3fc", bg: "#01060e" },
        { fg: "#e5e5e5", bg: "#0a0a0a" },
      ][sub];
      const mono = { fontFamily: "monospace", color: palette.fg };
      return (
        <Frame bg={palette.bg} border={`1px solid ${palette.fg}33`}>
          <div style={{ ...pad, ...mono, fontSize: 10, display: "flex", justifyContent: "space-between" }}>
            <span>scam.ai ~ %</span><span>● {confidence}%</span>
          </div>
          <Face src={face} filter={sub === 2 ? "grayscale(1) brightness(0.9)" : `saturate(0.4) brightness(0.95)`} style={{ flex: 1, margin: "0 13px", borderRadius: 4, border: `1px solid ${palette.fg}33` }}>
            <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 2px,${palette.fg}14 3px)`, mixBlendMode: "overlay" }} />
            {sub === 2 && (
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.5, ...mono, fontSize: 11, lineHeight: 1.1 }}>
                {Array(30).fill(0).map((_, i) => (
                  <span key={i} style={{ position: "absolute", left: `${(i * 13) % 100}%`, top: `${(i * 29) % 100}%` }}>{i % 2 ? "1" : "0"}</span>
                ))}
              </div>
            )}
            {sub === 3 && (
              <div style={{ position: "absolute", bottom: 6, left: 6, ...mono, fontSize: 8, lineHeight: 1.4, opacity: 0.9 }}>
                {"{"}<br />&nbsp;"verdict": "fake",<br />&nbsp;"confidence": 0.99<br />{"}"}
              </div>
            )}
          </Face>
          <div style={{ ...pad, ...mono }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>&gt; {hl[0].toLowerCase()} {hl[1].toLowerCase()}</div>
            <div style={{ fontSize: 10, opacity: 0.7, margin: "4px 0 10px" }}>&gt; {subc.toLowerCase()}_</div>
            <div style={{ border: `1px solid ${palette.fg}`, color: palette.fg, textAlign: "center", padding: "9px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>[ try it free → scam.ai/halo ]</div>
            <div style={{ marginTop: 10, fontSize: 10, textAlign: "center", opacity: 0.6 }}>ScamAI | Qualcomm</div>
          </div>
        </Frame>
      );
    }

    // ─────────────────────────────────────────── I. HEATMAP
    case "heatmap": {
      const filters = [
        "saturate(0)", // base for blobs
        "saturate(0)",
        "contrast(1.1) sepia(1) hue-rotate(-20deg) saturate(5)", // thermal-ish
        "saturate(0) sepia(1) hue-rotate(180deg) saturate(3)", // depth blue
        "grayscale(1) contrast(3) invert(1)", // edge
      ];
      return (
        <Frame bg="#050608">
          <div style={{ ...pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo />
            <LiveBadge label="SCANNING" />
          </div>
          <Face src={face} filter={filters[sub]} style={{ flex: 1, margin: "0 13px", borderRadius: 12 }}>
            {sub === 0 && (
              <>
                <div style={{ position: "absolute", top: "32%", left: "28%", width: 60, height: 50, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,0,0,0.6),transparent 70%)", filter: "blur(4px)" }} />
                <div style={{ position: "absolute", top: "48%", left: "48%", width: 50, height: 40, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,200,0,0.55),transparent 70%)", filter: "blur(4px)" }} />
                <Brackets color="#ff5050" />
              </>
            )}
            {sub === 1 && (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                {Array(7).fill(0).map((_, r) => <line key={"h" + r} x1="20" y1={20 + r * 9} x2="80" y2={20 + r * 9} stroke="#22ffaa" strokeWidth="0.4" opacity="0.6" />)}
                {Array(7).fill(0).map((_, c) => <line key={"v" + c} x1={20 + c * 10} y1="20" x2={20 + c * 10} y2="74" stroke="#22ffaa" strokeWidth="0.4" opacity="0.6" />)}
                {Array(40).fill(0).map((_, i) => <circle key={i} cx={22 + (i * 13) % 56} cy={22 + (i * 17) % 50} r="0.8" fill="#22ffaa" />)}
              </svg>
            )}
            {(sub === 2 || sub === 3) && <Brackets color={sub === 2 ? "#ffcc00" : "#60a5fa"} />}
            {sub === 4 && <div style={{ position: "absolute", inset: 0, mixBlendMode: "difference", background: "#000" }} />}
            <div style={{ position: "absolute", bottom: 8, left: 8, fontFamily: "monospace", fontSize: 8, color: "#fff", opacity: 0.8 }}>SYNTHETIC REGION · {confidence}%</div>
          </Face>
          <div style={{ ...pad }}>
            <Headline lines={hl} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "5px 0 10px" }}>{subc}</div>
            <CTA />
            <div style={{ marginTop: 10 }}><CoBrand /></div>
          </div>
        </Frame>
      );
    }

    // ─────────────────────────────────────────── J. TYPO
    case "typo":
    default: {
      const giant = ["FAKE", "?", hl[0].toUpperCase(), "NOT ME", "REAL?"][sub];
      return (
        <Frame bg="#070707">
          <div style={{ ...pad, display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
            <Logo />
            <LiveBadge />
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "rgba(239,68,68,0.16)", fontWeight: 900, fontSize: sub === 1 ? 220 : 84, lineHeight: 0.85, letterSpacing: "-0.04em", textAlign: "center", transform: sub === 3 ? "rotate(-8deg)" : undefined }}>
              {sub === 3 || sub === 4 ? giant.split(" ").map((w, i) => <span key={i}>{w}<br /></span>) : giant}
            </div>
            <Face src={face} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "62%", aspectRatio: "3/4", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.6)" }} />
            {sub === 2 && (
              <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, whiteSpace: "nowrap", color: "rgba(255,255,255,0.1)", fontWeight: 900, fontSize: 24, fontFamily: "monospace" }}>
                {Array(8).fill(hl.join(" ") + " · ").join("")}
              </div>
            )}
          </div>
          <div style={{ ...pad }}>
            <Headline lines={hl} size={24} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "5px 0 10px" }}>{subc}</div>
            <CTA />
            <div style={{ marginTop: 10 }}><CoBrand /></div>
          </div>
        </Frame>
      );
    }
  }
}
