import { ImageResponse } from 'next/og';
import { getIndustryBySlug } from '@/lib/solutions/industries';
import { getTranslations } from 'next-intl/server';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string; industry: string }>;
}) {
  const { locale, industry: slug } = await params;
  const industry = getIndustryBySlug(slug);

  let stat: { value: string; label: string } | undefined;
  let headline = 'Industry Solutions';
  let eyebrow = 'SOLUTIONS';
  if (industry) {
    const t = await getTranslations({ locale, namespace: `solutionsContent.${slug}` });
    headline = t('headline');
    eyebrow = t('eyebrow');
    stat = { value: industry.stat.value, label: t('stat.label') };
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
            bottom: '-300px',
            left: '-200px',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: '#045BBF',
            filter: 'blur(120px)',
            opacity: 0.35,
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '0px',
            right: '100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: '#245FFF',
            filter: 'blur(100px)',
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
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#245FFF', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            {eyebrow} SOLUTION
          </div>

          <div style={{ fontSize: '52px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.03em', maxWidth: '900px' }}>
            {headline}
          </div>

          {stat && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '28px',
                background: 'rgba(36,95,255,0.08)',
                border: '1px solid rgba(36,95,255,0.2)',
                borderRadius: '12px',
                padding: '12px 20px',
                maxWidth: '500px',
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#245FFF' }}>{stat.value}</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#6b7280', maxWidth: '350px', lineHeight: 1.4 }}>{stat.label}</span>
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
            {['98.2% Accuracy', '<4s Processing', '200 Free/mo'].map((badge) => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="#245FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#4b5563' }}>{badge}</span>
              </div>
            ))}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>scam.ai</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
