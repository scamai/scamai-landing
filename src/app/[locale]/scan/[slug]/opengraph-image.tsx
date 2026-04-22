import { ImageResponse } from "next/og";
import { getScanBySlug, getScanViewCount } from "@/lib/db/scans";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "ScamAI scan verdict";

function labelFor(verdict: string) {
  if (verdict === "likely_ai_manipulated")
    return { headline: "AI-GENERATED", sub: "Likely AI-manipulated", accent: "#ff4d5a", bg: "#1a0508" };
  if (verdict === "likely_real")
    return { headline: "REAL", sub: "Likely authentic", accent: "#22c55e", bg: "#041a0c" };
  return { headline: "UNCERTAIN", sub: "Inconclusive result", accent: "#f5a623", bg: "#1a1205" };
}

export default async function ScanOG({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const scan = await getScanBySlug(slug);
  const verdict = scan?.verdict ?? "uncertain";
  const confidence = scan ? Number(scan.confidence) : 0;
  const viewCount = scan ? await getScanViewCount(scan.id) : 0;
  const { headline, sub, accent, bg } = labelFor(verdict);
  const isFake = verdict === "likely_ai_manipulated";
  const hasImage = scan?.image_url && !scan.image_url.startsWith("data:");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: bg,
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow behind verdict */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: accent,
            opacity: 0.08,
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: accent,
            opacity: 0.05,
            filter: "blur(100px)",
          }}
        />

        {/* Left side: image thumbnail (if available externally) */}
        {hasImage && (
          <div
            style={{
              width: 340,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
            }}
          >
            <div
              style={{
                width: 260,
                height: 260,
                borderRadius: 24,
                overflow: "hidden",
                border: `3px solid ${accent}33`,
                display: "flex",
              }}
            >
              { }
              <img
                src={scan!.image_url!}
                alt=""
                width={260}
                height={260}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          </div>
        )}

        {/* Right side: verdict content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: hasImage ? "56px 56px 56px 0" : "56px 72px",
          }}
        >
          {/* Top: branding + scan count */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                S
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>ScamAI</div>
            </div>
            {viewCount > 1 && (
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {viewCount.toLocaleString()} verified
              </div>
            )}
          </div>

          {/* Center: giant verdict stamp */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Verdict badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  background: `${accent}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isFake ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                ) : verdict === "likely_real" ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: -2,
                    color: accent,
                  }}
                >
                  {headline}
                </div>
                <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                  {sub}
                </div>
              </div>
            </div>

            {/* Confidence bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>AI confidence</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: accent }}>
                  {confidence.toFixed(0)}%
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 12,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${confidence}%`,
                    height: "100%",
                    borderRadius: 6,
                    background: accent,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom: CTA + model */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 18,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Eva V1.6 · 120+ generators · &lt; 2s
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "10px 20px",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>
                Verify yours free →
              </div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>
                scam.ai
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
