import { ImageResponse } from 'next/og';
import { getCompetitorBySlug } from '@/lib/compare/competitors';
import { getTranslations } from 'next-intl/server';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string; competitor: string }>;
}) {
  const { locale, competitor: slug } = await params;
  const competitor = getCompetitorBySlug(slug);

  const name = competitor?.name ?? 'Competitor';
  // First advantage title is translatable (compareContent.<slug>.advantages.0.title).
  let firstAdvantage = '';
  if (competitor) {
    const t = await getTranslations({ locale, namespace: `compareContent.${slug}` });
    firstAdvantage = t('advantages.0.title');
  }

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
            bottom: '-250px',
            right: '-150px',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: '#4434F0',
            filter: 'blur(110px)',
            opacity: 0.3,
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: '#245FFF',
            filter: 'blur(90px)',
            opacity: 0.15,
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
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            COMPARISON
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '10px' }}>
            <span style={{ fontSize: '52px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>Scam AI</span>
            <span style={{ fontSize: '36px', fontWeight: 700, color: '#245FFF' }}>vs</span>
            <span style={{ fontSize: '52px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>{name}</span>
          </div>

          {firstAdvantage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '20px',
                background: 'rgba(36,95,255,0.08)',
                border: '1px solid rgba(36,95,255,0.2)',
                borderRadius: '100px',
                padding: '8px 18px',
                maxWidth: '500px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#245FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#245FFF' }}>{firstAdvantage}</span>
            </div>
          )}
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
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {['$0.05/image', '200 Free/mo', 'SOC 2 Type II'].map((badge) => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#245FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#4b5563' }}>{badge}</span>
              </div>
            ))}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>scam.ai/compare</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
