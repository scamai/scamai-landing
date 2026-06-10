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
  params: Promise<{ locale: string }>;
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
          justifyContent: 'space-between',
          padding: '72px',
          background: '#060608',
          fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blue glow bottom-left */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '-260px',
            left: '-120px',
            width: '640px',
            height: '640px',
            borderRadius: '50%',
            background: '#045BBF',
            filter: 'blur(130px)',
            opacity: 0.28,
          }}
        />
        {/* Purple glow top-right */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '-180px',
            right: '-80px',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: '#4434F0',
            filter: 'blur(130px)',
            opacity: 0.2,
          }}
        />

        {/* Top: logo */}
        { }
        <img
          src="https://scam.ai/scamai-logo.svg"
          style={{ width: '210px', height: '53px' }}
          alt=""
        />

        {/* Middle: headline + sub */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '76px',
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              Detect deepfakes &amp;
            </span>
            <span
              style={{
                fontSize: '76px',
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              AI-generated media.
            </span>
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 400,
              color: '#9ca3af',
              marginTop: '24px',
              lineHeight: 1.4,
              maxWidth: '760px',
            }}
          >
            Real-time detection across images, audio, and video — built for teams that can&apos;t afford to be fooled.
          </span>
        </div>

        {/* Bottom: trust signals + domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {['SOC 2 Type II', 'GDPR', '200 free / mo'].map((t) => (
              <div
                key={t}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#245FFF',
                  }}
                />
                <span style={{ fontSize: '22px', fontWeight: 500, color: '#d1d5db' }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
          <span style={{ fontSize: '24px', fontWeight: 600, color: '#6b7280' }}>
            scam.ai
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
