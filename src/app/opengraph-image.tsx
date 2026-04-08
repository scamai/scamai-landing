import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ScamAI - AI Trust Platform for Deepfake Detection';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #050508 0%, #0b0b15 50%, #0a0a1a 100%)',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#245FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              color: 'white',
            }}
          >
            S
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            ScamAI
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            maxWidth: '900px',
          }}
        >
          AI Trust Platform for{' '}
          <span style={{ color: '#245FFF' }}>Deepfake Detection</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '22px',
            color: '#9ca3af',
            lineHeight: 1.5,
            maxWidth: '700px',
          }}
        >
          Detect synthetic media and deepfakes in real-time. Industry-leading accuracy with SOC 2 Type II compliance.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: 'auto',
          }}
        >
          {['Vision Detection', 'Audio Detection', 'Document Forgery', 'Research Datasets'].map(
            (item) => (
              <div
                key={item}
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  borderLeft: '2px solid #245FFF',
                  paddingLeft: '12px',
                }}
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
