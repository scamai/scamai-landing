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
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle blue glow bottom-left */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '-250px',
            left: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: '#045BBF',
            filter: 'blur(120px)',
            opacity: 0.25,
          }}
        />
        {/* Subtle purple glow top-right */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '-150px',
            right: '-50px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: '#4434F0',
            filter: 'blur(100px)',
            opacity: 0.2,
          }}
        />

        {/* Centered content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0px',
          }}
        >
          {/* Logo */}
          <img
            src="https://scam.ai/scamai-logo.svg"
            style={{ width: '400px', height: '101px' }}
            alt=""
          />

          {/* Tagline */}
          <span
            style={{
              fontSize: '22px',
              fontWeight: 400,
              color: '#6b7280',
              marginTop: '16px',
              letterSpacing: '-0.01em',
            }}
          >
            Detect Deepfakes & AI-Generated Media
          </span>
        </div>

        {/* Domain at bottom */}
        <span
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          scam.ai
        </span>
      </div>
    ),
    { ...size }
  );
}
