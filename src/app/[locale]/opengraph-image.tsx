import { ImageResponse } from 'next/og';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale: _locale } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#000000',
          fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Hero background — layered blurred shapes matching landing page */}
        {/* Large blue glow bottom-left */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '-300px',
            left: '-200px',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: '#045BBF',
            filter: 'blur(120px)',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />
        {/* Purple glow bottom-right */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '-200px',
            right: '-100px',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: '#4434F0',
            filter: 'blur(100px)',
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        />
        {/* Subtle top-right blue accent */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '0px',
            right: '200px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: '#245FFF',
            filter: 'blur(80px)',
            opacity: 0.15,
            pointerEvents: 'none',
          }}
        />

        {/* Top-left: logo */}
        <div
          style={{
            position: 'absolute',
            top: '52px',
            left: '64px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <img
            src="https://scam.ai/scamai-logo.svg"
            style={{ width: '44px', height: '44px' }}
            alt="ScamAI"
          />
          <span
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            ScamAI
          </span>
        </div>

        {/* Center-left content */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '64px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
          }}
        >
          {/* Kicker label */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#9ca3af',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            ALL-IN-ONE DEEPFAKE DETECTION
          </div>

          {/* H1 */}
          <div
            style={{
              fontSize: '62px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              maxWidth: '780px',
            }}
          >
            Detect Deepfakes &amp;
          </div>
          <div
            style={{
              fontSize: '62px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              marginTop: '2px',
            }}
          >
            AI-Generated Media
          </div>

          {/* Subtext */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: '#6b7280',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginTop: '28px',
            }}
          >
            Fight AI threats with AI defense. Industry-leading accuracy with real-time detection across images, audio, and video.
          </div>

          {/* CTA pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginTop: '36px',
            }}
          >
            {/* Rainbow CTA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(90deg, #8a2be2, #00bfff, #ff69b4, #ffd700, #8a2be2)',
                borderRadius: '100px',
                padding: '2px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#000000',
                  borderRadius: '100px',
                  padding: '12px 24px',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  Start for Free
                </span>
              </div>
            </div>

            {/* Text link */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#9ca3af',
                }}
              >
                See the platform
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom trust bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '64px',
            right: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            {[
              { label: 'Deepfake Detection', color: '#245FFF' },
              { label: 'Voice Verification', color: '#4434F0' },
              { label: 'Document Forgery', color: '#6b7280' },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: item.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#6b7280',
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {['SOC 2 Type II', 'GDPR', '200 Free/mo'].map((badge) => (
              <div
                key={badge}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="#245FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#4b5563' }}>
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
