import { ImageResponse } from "next/og";
import { getScanBySlug } from "@/lib/db/scans";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "ScamAI scan verdict";

function labelFor(verdict: string) {
  if (verdict === "likely_ai_manipulated") return { headline: "Likely AI-manipulated", accent: "#ff4d5a" };
  if (verdict === "likely_real") return { headline: "Likely real", accent: "#22c55e" };
  return { headline: "Uncertain", accent: "#f5a623" };
}

export default async function ScanOG({ params }: { params: { slug: string } }) {
  const scan = await getScanBySlug(params.slug);
  const verdict = scan?.verdict ?? "uncertain";
  const confidence = scan ? Number(scan.confidence) : 0;
  const { headline, accent } = labelFor(verdict);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b0b0b",
          color: "white",
          fontFamily: "system-ui, -apple-system, Inter, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background: accent,
            }}
          />
          <div style={{ fontSize: 22, color: "#9ca3af", letterSpacing: 2, textTransform: "uppercase" }}>
            ScamAI verdict
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>{headline}</div>
          <div style={{ fontSize: 40, color: accent, fontWeight: 600 }}>
            {confidence.toFixed(0)}% AI index
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 24, color: "#9ca3af" }}>
            Eva V1.6 · 120+ generator types · &lt; 2 s
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "white" }}>scam.ai</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
