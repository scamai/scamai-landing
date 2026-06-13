import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/lib/learn/articles';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? 'Learn';
  const category = article?.category ?? '';
  const readTime = article?.readTime ?? 0;

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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '-200px',
            left: '200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: '#045BBF',
            filter: 'blur(100px)',
            opacity: 0.25,
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '-100px',
            right: '-50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: '#4434F0',
            filter: 'blur(80px)',
            opacity: 0.2,
          }}
        />

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
          <img src="https://scam.ai/scamai-logo.svg" style={{ width: '44px', height: '44px' }} alt="" />
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>Scam AI</span>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '64px',
            right: '64px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            {category && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#245FFF',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  background: 'rgba(36,95,255,0.1)',
                  border: '1px solid rgba(36,95,255,0.2)',
                  borderRadius: '100px',
                  padding: '6px 14px',
                }}
              >
                {category}
              </div>
            )}
            {readTime > 0 && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#6b7280',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '100px',
                  padding: '6px 14px',
                }}
              >
                {readTime} min read
              </div>
            )}
          </div>

          <div style={{ fontSize: '48px', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.03em', maxWidth: '900px' }}>
            {title}
          </div>
        </div>

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
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563' }}>scam.ai/learn</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Deepfake Detection Insights</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
