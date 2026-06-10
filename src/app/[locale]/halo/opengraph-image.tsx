import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Halo — catch deepfakes on your calls, on-device, in real time";

export async function generateImageParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HaloOGImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#060608",
          fontFamily: "system-ui, -apple-system, Inter, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blue glow bottom-left */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "-260px",
            left: "-120px",
            width: "640px",
            height: "640px",
            borderRadius: "50%",
            background: "#045BBF",
            filter: "blur(130px)",
            opacity: 0.28,
          }}
        />
        {/* Purple glow top-right */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "-180px",
            right: "-80px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "#4434F0",
            filter: "blur(130px)",
            opacity: 0.2,
          }}
        />

        {/* Left column — copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px",
            width: "680px",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Logo */}
            { }
            <img
              src="https://scam.ai/scamai-logo.svg"
              style={{ width: "190px", height: "48px" }}
              alt=""
            />

            {/* Live pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "40px",
                padding: "8px 16px",
                borderRadius: "999px",
                background: "rgba(239,68,68,0.14)",
                border: "1px solid rgba(239,68,68,0.35)",
                alignSelf: "flex-start",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#ef4444",
                }}
              />
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "#fca5a5",
                }}
              >
                LIVE · ON-DEVICE
              </span>
            </div>

            {/* Headline */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "28px",
              }}
            >
              <span
                style={{
                  fontSize: "68px",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                }}
              >
                Catch deepfakes
              </span>
              <span
                style={{
                  fontSize: "68px",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                }}
              >
                on your calls.
              </span>
            </div>

            {/* Sub */}
            <span
              style={{
                fontSize: "26px",
                fontWeight: 400,
                color: "#9ca3af",
                marginTop: "24px",
                lineHeight: 1.4,
                maxWidth: "520px",
              }}
            >
              Real-time detection for video &amp; voice — nothing leaves your device.
            </span>
          </div>

          <span style={{ fontSize: "22px", fontWeight: 500, color: "#6b7280" }}>
            scam.ai/halo
          </span>
        </div>

        {/* Right column — live-call mock */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "300px",
              height: "380px",
              borderRadius: "28px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.10)",
              position: "relative",
            }}
          >
            {/* Detection ring */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                border: "3px solid rgba(239,68,68,0.7)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "108px",
                  height: "108px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                }}
              />
            </div>

            {/* Detected chip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "34px",
                padding: "10px 18px",
                borderRadius: "999px",
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.4)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ef4444",
                }}
              />
              <span
                style={{ fontSize: "18px", fontWeight: 600, color: "#fca5a5" }}
              >
                Deepfake detected
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
