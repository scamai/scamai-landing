import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { articles } from '@/lib/learn/articles';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/learn',
    title: 'Learn — Deepfake Detection Guides & Resources',
    description:
      'In-depth guides on deepfake detection, AI-generated image identification, voice clone attacks, and detection APIs. Written by the Scam AI research team.',
    keywords: [
      'deepfake detection guide',
      'how to detect deepfakes',
      'AI image detection guide',
      'voice clone detection guide',
      'deepfake statistics',
      'deepfake API guide',
    ],
    dateModified: '2026-05-23',
  });
}

const categoryColors: Record<string, string> = {
  Fundamentals: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Detection: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Developer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Research & Data': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default async function LearnPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative px-4 sm:px-6" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-4 sm:text-xs">
              LEARN
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Deepfake detection <span className="text-[#245FFF]">guides</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              In-depth guides on synthetic media detection, AI image analysis, voice clone fraud, and API integration. Written by the Scam AI research team.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <span className="rounded-full border border-[#245FFF]/30 bg-[#245FFF]/10 px-4 py-1.5 text-xs font-semibold text-[#245FFF]">
              All
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${categoryColors[cat] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Articles grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-800/60 bg-white/[0.02] p-7 hover:border-[#245FFF]/40 hover:bg-[#245FFF]/[0.03] transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${categoryColors[article.category] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}
                  >
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-600">{article.readTime} min read</span>
                </div>

                <h2 className="text-base font-bold text-white leading-snug mb-3 group-hover:text-[#245FFF] transition-colors line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3 mb-5">
                  {article.description}
                </p>

                <span className="text-xs font-semibold text-[#245FFF] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  Read article
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl border border-gray-800/60 bg-white/[0.02] p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to detect deepfakes in your platform?
            </h2>
            <p className="text-gray-400 mb-8">
              200 free image analyses per month. Full API access. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://app.scam.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="rainbow-button inline-block"
              >
                <span className="rainbow-button-inner">Start Free</span>
              </a>
              <Link
                href="/resources/documentation"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-gray-700 rounded-lg hover:border-[#245FFF]/50 transition-colors"
              >
                API Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
