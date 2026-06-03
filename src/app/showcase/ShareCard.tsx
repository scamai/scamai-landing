"use client";

// ─── ShareCard ───────────────────────────────────────────────────
// 12 designed compositions. Same fixed face; the LAYOUT is the variable.
// QR is integrated as a native element per concept (not bolted on).

import { CONCEPTS, FACE, HEADLINES, SUBS, conceptOf, pick, qrUrl } from "./data";

type Props = { id: number; seed: number };

// ─── Atoms ───
function Logo({ h = 17, dark = false }: { h?: number; dark?: boolean }) {
  const c = dark ? "#0a0a0a" : "#fff";
  return (
    <span style={{ fontWeight: 800, fontSize: h, letterSpacing: "-0.02em", color: c, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: h * 0.8, height: h * 0.8, borderRadius: "50%", border: `${Math.max(2, h / 8)}px solid ${c}`, display: "inline-block" }} />
      scam.ai
    </span>
  );
}

function CoBrand({ dark = false, align = "center" as "center" | "left" }) {
  const strong = dark ? "rgba(0,0,0,0.78)" : "rgba(255,255,255,0.85)";
  const dim = dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.4)";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: align === "center" ? "center" : "flex-start", gap: 8, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.05em" }}>
      <span style={{ color: strong }}>ScamAI</span>
      <span style={{ color: dim }}>|</span>
      <span style={{ color: strong }}>Qualcomm</span>
    </div>
  );
}

// QR on a white quiet-zone chip. `rot`/`tone` let concepts style it natively.
function QR({ size = 52, chip = "#fff", radius = 8, rot = 0, glow }: { size?: number; chip?: string; radius?: number; rot?: number; glow?: string }) {
  return (
    <div style={{ background: chip, padding: 5, borderRadius: radius, lineHeight: 0, transform: rot ? `rotate(${rot}deg)` : undefined, boxShadow: glow }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrUrl(200)} alt="scan" width={size} height={size} style={{ display: "block" }} />
    </div>
  );
}

function Img({ filter, style }: { filter?: string; style?: React.CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={FACE} alt="face" style={{ objectFit: "cover", display: "block", filter, ...style }} />;
}

function Frame({ children, bg = "#0a0a0a", border, pad = true, style }: { children: React.ReactNode; bg?: string; border?: string; pad?: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", aspectRatio: "9 / 16", width: "100%", borderRadius: 16, overflow: "hidden", background: bg, border: border ?? "1px solid rgba(255,255,255,0.08)", ...style }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: pad ? 16 : 0 }}>{children}</div>
    </div>
  );
}

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

// ═══════════════════════════════════════════════════════════════════
export default function ShareCard({ id, seed }: Props) {
  const c = conceptOf(id).key;
  const hl = pick(HEADLINES, id, seed);
  const sub = pick(SUBS, id, seed, 2);
  const conf = (98 + ((id * 7 + seed) % 190) / 100).toFixed(2);
  const no = String((id * 137 + seed * 17) % 9999).padStart(4, "0");

  switch (c) {
    // ── 1. EVIDENCE TAG — asymmetric, taped polaroid ──────────────
    case "evidence":
      return (
        <Frame bg="#141210">
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 0%, #1c1a17, #0c0b0a)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
            <Logo />
            <span style={{ fontFamily: mono, fontSize: 9, color: "#ef4444", letterSpacing: "0.1em" }}>● CASE DF-{no}</span>
          </div>
          {/* taped polaroid, rotated */}
          <div style={{ position: "relative", zIndex: 2, flex: 1, display: "grid", placeItems: "center" }}>
            <div style={{ transform: "rotate(-4deg)", background: "#f4f1ea", padding: "9px 9px 34px", borderRadius: 2, boxShadow: "0 14px 30px rgba(0,0,0,0.55)", width: "74%" }}>
              <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                <Img style={{ width: "100%", height: "100%" }} />
                <div style={{ position: "absolute", inset: 0, border: "2px solid #ef4444", clipPath: "polygon(0 0,22px 0,22px 3px,3px 3px,3px 22px,0 22px, 0 100%,22px 100%,22px calc(100% - 3px),3px calc(100% - 3px),3px calc(100% - 22px),0 calc(100% - 22px))" }} />
                <span style={{ position: "absolute", top: 6, right: 6, background: "#ef4444", color: "#fff", fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 3 }}>FAKE {conf}%</span>
              </div>
              <div style={{ fontFamily: "'Bradley Hand', cursive", marginTop: 6, color: "#b91c1c", fontWeight: 700, fontSize: 14, transform: "rotate(-1deg)" }}>{hl[0]} {hl[1]} ✗</div>
            </div>
            {/* tape */}
            <span style={{ position: "absolute", top: "16%", left: "50%", transform: "translateX(-50%) rotate(6deg)", width: 64, height: 20, background: "rgba(255,255,255,0.18)", borderLeft: "1px dashed rgba(255,255,255,0.3)", borderRight: "1px dashed rgba(255,255,255,0.3)" }} />
          </div>
          {/* QR as evidence sticker */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <QR size={46} rot={-3} />
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.3 }}>Scan the evidence<br /><b style={{ color: "#fff" }}>scam.ai/halo</b></div>
            </div>
            <CoBrand />
          </div>
        </Frame>
      );

    // ── 2. BROADCAST LOWER-THIRD — full bleed, news bar ───────────
    case "broadcast":
      return (
        <Frame bg="#000" pad={false}>
          <Img style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 45%, rgba(0,0,0,0.85) 100%)" }} />
          {/* top bug */}
          <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
            <Logo />
            <span style={{ background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "4px 8px", borderRadius: 4, letterSpacing: "0.06em" }}>● LIVE · DEEPFAKE</span>
          </div>
          {/* lower third */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2 }}>
            <div style={{ height: 4, background: "#ef4444" }} />
            <div style={{ background: "rgba(8,8,10,0.82)", backdropFilter: "blur(6px)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#ef4444", letterSpacing: "0.12em", marginBottom: 3 }}>DEEPFAKE DETECTED · {conf}%</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", lineHeight: 1.02, letterSpacing: "-0.02em" }}>{hl[0]} {hl[1]}</div>
                <div style={{ marginTop: 7 }}><CoBrand /></div>
              </div>
              {/* QR as channel bug */}
              <div style={{ textAlign: "center" }}>
                <QR size={50} />
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>scam.ai/halo</div>
              </div>
            </div>
          </div>
        </Frame>
      );

    // ── 3. TYPE TAKEOVER — giant word, face in counter, QR=period ──
    case "typo":
      return (
        <Frame bg="#0b0b0d">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo />
            <span style={{ fontFamily: mono, fontSize: 9, color: "rgba(255,255,255,0.45)" }}>{conf}% FAKE</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-end", lineHeight: 0.8 }}>
              <span style={{ fontWeight: 900, fontSize: 96, letterSpacing: "-0.06em", color: "#fff" }}>FAK</span>
              {/* the "E" counter holds the face */}
              <div style={{ position: "relative", width: 70, height: 90 }}>
                <span style={{ fontWeight: 900, fontSize: 96, letterSpacing: "-0.06em", color: "#fff", position: "absolute", left: -6, top: -6 }}>E</span>
                <Img style={{ position: "absolute", right: 6, top: 20, width: 40, height: 44, borderRadius: 4, filter: "grayscale(0.2) contrast(1.05)" }} />
              </div>
              {/* QR as the period */}
              <div style={{ marginLeft: 4, marginBottom: 8 }}><QR size={26} radius={4} /></div>
            </div>
            <div style={{ marginTop: 18, fontWeight: 700, fontSize: 17, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.01em" }}>{hl[0]} {hl[1]}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{sub}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#7da9ff" }}>scan to try → scam.ai/halo</span>
            <CoBrand />
          </div>
        </Frame>
      );

    // ── 4. SPLIT DOSSIER — two-column editorial ───────────────────
    case "dossier":
      return (
        <Frame bg="#0a0c10" pad={false}>
          <div style={{ position: "absolute", inset: 0, display: "flex" }}>
            {/* left data column */}
            <div style={{ width: "42%", borderRight: "1px solid rgba(255,255,255,0.1)", padding: 14, display: "flex", flexDirection: "column", fontFamily: mono }}>
              <Logo h={15} />
              <div style={{ marginTop: 18, fontSize: 9, color: "rgba(255,255,255,0.4)", lineHeight: 2.1 }}>
                <div>STATUS</div>
                <div style={{ color: "#ef4444", fontWeight: 700 }}>► SYNTHETIC</div>
                <div style={{ marginTop: 10 }}>CONFIDENCE</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 20, fontFamily: "Inter" }}>{conf}%</div>
                <div style={{ marginTop: 10 }}>LANDMARKS</div>
                <div style={{ color: "#fff" }}>68 / 68 ✗</div>
                <div style={{ marginTop: 10 }}>CASE</div>
                <div style={{ color: "#fff" }}>DF-{no}</div>
              </div>
              <div style={{ flex: 1 }} />
              <QR size={58} />
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", marginTop: 5 }}>scam.ai/halo</div>
            </div>
            {/* right face + headline */}
            <div style={{ flex: 1, position: "relative" }}>
              <Img style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "contrast(1.05)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(0,0,0,0.8))" }} />
              <div style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 21, color: "#fff", lineHeight: 1.0, letterSpacing: "-0.02em" }}>{hl[0]}<br />{hl[1]}</div>
                <div style={{ marginTop: 8 }}><CoBrand /></div>
              </div>
            </div>
          </div>
        </Frame>
      );

    // ── 5. ID / SPECIMEN — passport, MRZ holds the QR ─────────────
    case "passport":
      return (
        <Frame bg="#10131a">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: 10 }}>
            <Logo />
            <span style={{ fontFamily: mono, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>IDENTITY · UNVERIFIED</span>
          </div>
          <div style={{ flex: 1, display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <Img style={{ width: 112, height: 138, borderRadius: 4, filter: "grayscale(0.4) contrast(1.1)", border: "1px solid rgba(255,255,255,0.2)" }} />
              <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "rgba(239,68,68,0.55)", fontWeight: 900, fontSize: 22, transform: "rotate(-18deg)", letterSpacing: "0.1em" }}>SPECIMEN</span>
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 2 }}>
              <div style={{ color: "rgba(255,255,255,0.4)" }}>NAME</div>
              <div style={{ color: "#fff" }}>{hl[0].toUpperCase()}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", marginTop: 6 }}>TYPE</div>
              <div style={{ color: "#ef4444", fontWeight: 700 }}>AI-GENERATED</div>
              <div style={{ color: "rgba(255,255,255,0.4)", marginTop: 6 }}>MATCH</div>
              <div style={{ color: "#fff" }}>{conf}%</div>
            </div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>{hl[1] || sub}</div>
          {/* MRZ zone holds QR */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: 9, display: "flex", alignItems: "center", gap: 10 }}>
            <QR size={46} />
            <div style={{ flex: 1, fontFamily: mono, fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em", lineHeight: 1.6, overflow: "hidden", whiteSpace: "nowrap" }}>
              SCAN&lt;&lt;TO&lt;&lt;VERIFY&lt;&lt;{no}<br />SCAM.AI/HALO&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              <div style={{ marginTop: 4 }}><CoBrand align="left" /></div>
            </div>
          </div>
        </Frame>
      );

    // ── 6. VERTICAL SCANLINE — headline up the spine ──────────────
    case "scanline":
      return (
        <Frame bg="#000" pad={false}>
          <Img style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "contrast(1.08) brightness(0.92)" }} />
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.28) 4px)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "38%", height: 2, background: "rgba(120,200,255,0.9)", boxShadow: "0 0 16px 3px rgba(120,200,255,0.7)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.7), transparent 40%)" }} />
          <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", zIndex: 2 }}>
            <Logo />
            <span style={{ fontFamily: mono, fontSize: 9, color: "#7dd3fc" }}>SCANNING… {conf}%</span>
          </div>
          {/* vertical headline on spine */}
          <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, display: "flex", alignItems: "center", zIndex: 2 }}>
            <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontWeight: 900, fontSize: 30, color: "#fff", letterSpacing: "-0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>{hl[0]} {hl[1]}</div>
          </div>
          {/* QR chip riding the scanline */}
          <div style={{ position: "absolute", right: 14, top: "38%", transform: "translateY(-50%)", zIndex: 3, textAlign: "center" }}>
            <QR size={50} glow="0 0 14px rgba(120,200,255,0.6)" />
            <div style={{ fontSize: 8, color: "#7dd3fc", marginTop: 3 }}>scan to verify</div>
          </div>
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, zIndex: 2, display: "flex", justifyContent: "flex-end" }}><CoBrand /></div>
        </Frame>
      );

    // ── 7. MINIMAL PLACARD — quiet, centered ──────────────────────
    case "placard":
      return (
        <Frame bg="#070707">
          <div style={{ display: "flex", justifyContent: "center" }}><Logo h={20} /></div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
            <div style={{ position: "relative" }}>
              <Img style={{ width: 104, height: 104, borderRadius: "50%", filter: "grayscale(1) contrast(1.08)" }} />
              <span style={{ position: "absolute", bottom: -4, right: -4, background: "#ef4444", color: "#fff", fontSize: 8, fontWeight: 800, padding: "3px 7px", borderRadius: 999, border: "2px solid #070707" }}>FAKE</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 26, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05 }}>{hl[0]}<br />{hl[1]}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>{sub}</div>
            </div>
            {/* placard QR */}
            <div style={{ textAlign: "center" }}>
              <QR size={58} />
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 6, letterSpacing: "0.08em" }}>SCAN · SCAM.AI/HALO</div>
            </div>
          </div>
          <CoBrand />
        </Frame>
      );

    // ── 8. TRADING CARD — framed collectible ──────────────────────
    case "trading":
      return (
        <div style={{ aspectRatio: "9 / 16", width: "100%", borderRadius: 18, padding: 3, background: "linear-gradient(135deg,#f7d77a,#b8860b 40%,#fff6d0 55%,#b8860b 70%,#f7d77a)", boxShadow: "0 0 24px rgba(247,200,80,0.35)" }}>
          <Frame bg="#0c0a06" border="none">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Logo />
              <span style={{ background: "#f7d77a", color: "#3a2a00", fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 999, letterSpacing: "0.05em" }}>✦ RARE</span>
            </div>
            <div style={{ position: "relative", margin: "10px 0", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(247,215,122,0.4)" }}>
              <Img style={{ width: "100%", height: 168 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg,transparent 40%,rgba(255,255,255,0.18) 50%,transparent 60%)" }} />
              <span style={{ position: "absolute", top: 6, right: 8, fontFamily: mono, fontSize: 9, color: "#f7d77a", fontWeight: 700 }}>#{no}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.0 }}>{hl[0]} {hl[1]}</div>
            <div style={{ display: "flex", gap: 6, margin: "9px 0" }}>
              {[["REALISM", conf, "#f7d77a"], ["TRUST", "00.3", "#ef4444"]].map(([k, v, col]) => (
                <div key={k} style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 7, padding: "5px 9px" }}>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>{k}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: col as string }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* QR as auth seal */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <QR size={42} glow="0 0 10px rgba(247,200,80,0.4)" />
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>pull your own<br /><b style={{ color: "#f7d77a" }}>scam.ai/halo</b></div>
              </div>
              <CoBrand />
            </div>
          </Frame>
        </div>
      );

    // ── 9. TERMINAL LOG — full console ────────────────────────────
    case "terminal":
      return (
        <Frame bg="#020604" border="1px solid #22ff8833">
          <div style={{ fontFamily: mono, color: "#22ff88", fontSize: 11, lineHeight: 1.7, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.7 }}><span>scam.ai ~ %</span><span>● {conf}%</span></div>
            <div style={{ marginTop: 8 }}>$ ./detect --live</div>
            <div style={{ opacity: 0.8 }}>&gt; loading frame…</div>
            <div style={{ position: "relative", margin: "8px 0", width: 132, height: 132, border: "1px solid #22ff8855" }}>
              <Img style={{ width: "100%", height: "100%", filter: "grayscale(1) brightness(0.9) sepia(1) hue-rotate(75deg) saturate(3)" }} />
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,#22ff8814 3px)" }} />
            </div>
            <div>&gt; verdict: <span style={{ color: "#ef4444", fontWeight: 700 }}>FAKE</span></div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginTop: 6, fontFamily: "Inter" }}>{hl[0]} {hl[1]}</div>
            <div style={{ opacity: 0.7, marginTop: 2 }}>&gt; {sub.toLowerCase()}_</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: mono, color: "#22ff88" }}>
            {/* QR as inverted terminal block */}
            <QR size={48} chip="#22ff88" radius={2} />
            <div style={{ fontSize: 10, lineHeight: 1.5 }}>$ open scam.ai/halo<br /><span style={{ opacity: 0.6 }}>ScamAI | Qualcomm</span></div>
          </div>
        </Frame>
      );

    // ── 10. GLITCH POSTER — RGB tear ──────────────────────────────
    case "glitch":
      return (
        <Frame bg="#05060a" pad={false}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Img style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "contrast(1.1)" }} />
            <Img style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "screen", opacity: 0.55, transform: "translateX(5px)", filter: "sepia(1) saturate(7) hue-rotate(-50deg)" }} />
            <Img style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "screen", opacity: 0.55, transform: "translateX(-5px)", filter: "sepia(1) saturate(7) hue-rotate(150deg)" }} />
            {[20, 52, 78].map((t) => (
              <div key={t} style={{ position: "absolute", left: 0, right: 0, top: `${t}%`, height: "5%", background: `url(${FACE}) center/cover`, transform: `translateX(${t % 2 ? 14 : -14}px)`, filter: "hue-rotate(60deg) saturate(2)" }} />
            ))}
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.3) 3px)" }} />
          </div>
          <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", zIndex: 2 }}>
            <Logo />
            <span style={{ fontFamily: mono, fontSize: 9, color: "#ff5d7d" }}>SIGNAL CORRUPT</span>
          </div>
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, zIndex: 2 }}>
            <div style={{ fontWeight: 900, fontSize: 30, color: "#fff", letterSpacing: "-0.03em", lineHeight: 0.92, textShadow: "3px 0 #ff003c, -3px 0 #00e0ff" }}>{hl[0]}<br />{hl[1]}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ position: "relative" }}>
                  <QR size={48} />
                  <div style={{ position: "absolute", top: "45%", left: -3, right: -3, height: 5, background: "#00e0ff", opacity: 0.85 }} />
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>scan →<br /><b>scam.ai/halo</b></span>
              </div>
              <CoBrand />
            </div>
          </div>
        </Frame>
      );

    // ── 11. REDACTED DOC — classified file ────────────────────────
    case "redacted":
      return (
        <Frame bg="#f3f1ea" border="1px solid #ddd" pad>
          <div style={{ color: "#111", display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #111", paddingBottom: 8 }}>
              <Logo dark />
              <span style={{ fontFamily: mono, fontSize: 9, color: "#b91c1c", fontWeight: 700, letterSpacing: "0.1em" }}>DECLASSIFIED</span>
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, lineHeight: 1.9, marginTop: 10, color: "#222" }}>
              <div>SUBJECT: <span style={{ background: "#111", color: "#111" }}>████████</span></div>
              <div>ORIGIN: <span style={{ color: "#b91c1c", fontWeight: 700 }}>AI-SYNTHESIZED</span></div>
              <div>MATCH: {conf}% · CASE DF-{no}</div>
            </div>
            {/* face window */}
            <div style={{ position: "relative", margin: "10px 0", border: "2px solid #111" }}>
              <Img style={{ width: "100%", height: 150, filter: "grayscale(1) contrast(1.15)" }} />
              <div style={{ position: "absolute", top: "34%", left: 0, width: "46%", height: 16, background: "#111" }} />
              <span style={{ position: "absolute", bottom: 6, right: 8, background: "#b91c1c", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px" }}>FAKE</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em", lineHeight: 1.0 }}>{hl[0]} {hl[1]}</div>
            <div style={{ flex: 1 }} />
            {/* QR tracking stamp */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid #111", paddingTop: 9 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <QR size={46} chip="#f3f1ea" radius={0} />
                <span style={{ fontFamily: mono, fontSize: 9, color: "#444" }}>TRACKING #{no}<br /><b style={{ color: "#111" }}>scam.ai/halo</b></span>
              </div>
              <CoBrand dark />
            </div>
          </div>
        </Frame>
      );

    // ── 12. THERMAL HEATMAP — synthetic-region callouts ───────────
    case "thermal":
    default:
      return (
        <Frame bg="#05060a">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo />
            <span style={{ fontFamily: mono, fontSize: 9, color: "#ffb454" }}>THERMAL · {conf}%</span>
          </div>
          <div style={{ position: "relative", flex: 1, margin: "10px 0", borderRadius: 12, overflow: "hidden" }}>
            <Img style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "contrast(1.2) sepia(1) hue-rotate(-15deg) saturate(6) brightness(0.95)" }} />
            <div style={{ position: "absolute", top: "30%", left: "30%", width: 64, height: 54, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,40,0,0.55), transparent 70%)", filter: "blur(5px)" }} />
            {/* reticle holding QR */}
            <div style={{ position: "absolute", right: 12, bottom: 12, width: 64, height: 64 }}>
              <span style={{ position: "absolute", inset: 0, border: "1px solid #ffb454", borderRadius: 6 }} />
              <span style={{ position: "absolute", top: -1, left: -1, width: 14, height: 14, borderTop: "2px solid #ffb454", borderLeft: "2px solid #ffb454" }} />
              <span style={{ position: "absolute", top: -1, right: -1, width: 14, height: 14, borderTop: "2px solid #ffb454", borderRight: "2px solid #ffb454" }} />
              <span style={{ position: "absolute", bottom: -1, left: -1, width: 14, height: 14, borderBottom: "2px solid #ffb454", borderLeft: "2px solid #ffb454" }} />
              <span style={{ position: "absolute", bottom: -1, right: -1, width: 14, height: 14, borderBottom: "2px solid #ffb454", borderRight: "2px solid #ffb454" }} />
              <div style={{ position: "absolute", inset: 6 }}><QR size={52} /></div>
            </div>
            <div style={{ position: "absolute", left: 10, top: "26%", fontFamily: mono, fontSize: 8, color: "#fff" }}>
              <span style={{ color: "#ff5d5d" }}>◄</span> synthetic region
            </div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.0 }}>{hl[0]} {hl[1]}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: "#ffb454", fontWeight: 600 }}>scan target → scam.ai/halo</span>
            <CoBrand />
          </div>
        </Frame>
      );
  }
}
