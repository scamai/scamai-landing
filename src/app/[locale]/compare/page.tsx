import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { competitors } from '@/lib/compare/competitors';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/compare',
    title: 'Scam AI vs Competitors — Deepfake Detection Comparison',
    description:
      'Compare Scam AI vs Reality Defender, Sensity, Hive, Azure, AWS, Truepic, and Deepware. Pricing, accuracy, and feature comparison tables.',
    keywords: [
      'deepfake detection comparison',
      'Scam AI vs Reality Defender',
      'Scam AI vs Sensity',
      'deepfake detector alternatives',
      'best deepfake detection tool',
    ],
    dateModified: '2026-05-23',
  });
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'comparePage' });
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative px-4 sm:px-6 pb-20" style={{ paddingTop: '140px' }}>
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-4 sm:text-xs">
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              {t.rich('heading', {
                highlight: (chunks) => <span className="text-[#245FFF]">{chunks}</span>,
              })}
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              {t('subheading')}
            </p>
          </div>

          <div className="space-y-4">
            {competitors.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-gray-800/60 bg-white/[0.02] px-7 py-6 hover:border-[#245FFF]/40 hover:bg-[#245FFF]/[0.03] transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-white group-hover:text-[#245FFF] transition-colors mb-1">
                    {t('versus', { name: comp.name })}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-1">{comp.metaDescription}</p>
                </div>
                <svg className="w-5 h-5 text-gray-600 group-hover:text-[#245FFF] transition-colors ml-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a
              href="https://app.scam.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="rainbow-button inline-block"
            >
              <span className="rainbow-button-inner">{t('tryFree')}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
