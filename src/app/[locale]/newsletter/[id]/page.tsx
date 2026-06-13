export const dynamic = 'force-dynamic';

import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import NewsletterDetail from '@/components/newsletter/NewsletterDetail';
import { Link } from '@/i18n/navigation';
import { redirect } from 'next/navigation';
import { getPublishedNewsletter, getPublishedNewsletterBySlug } from '@/lib/db/newsletters';

async function getNewsletter(idOrSlug: string) {
  // Try slug first, then numeric ID for backwards compatibility
  const bySlug = await getPublishedNewsletterBySlug(idOrSlug);
  if (bySlug) return bySlug;
  const num = Number(idOrSlug);
  if (!isNaN(num)) return getPublishedNewsletter(num);
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  const locale = localeParam as Locale;
  const newsletter = await getNewsletter(id);

  // Extract topic-specific keywords from newsletter content
  const sectionKeywords = newsletter?.sections
    ?.map((s) => s.title.toLowerCase())
    .filter((t) => t.length > 3) ?? [];
  const sourceKeywords = newsletter?.top3Articles
    ?.map((a) => a.source.toLowerCase())
    .filter((s) => s.length > 2) ?? [];
  const keywords = [
    'deepfake news',
    'AI security news',
    'synthetic media',
    'deepfake weekly',
    ...sectionKeywords.slice(0, 4),
    ...sourceKeywords.slice(0, 2),
  ];

  return generatePageMetadata({
    locale,
    path: `/newsletter/${newsletter?.slug || id}`,
    title: newsletter ? `${newsletter.title} | Deepfake Weekly` : 'Deepfake Weekly Newsletter | Scam AI',
    description: newsletter?.executiveSummary?.slice(0, 160) || 'Read the latest Deepfake Weekly newsletter from Scam AI.',
    keywords,
  });
}

export default async function NewsletterDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  const locale = localeParam as Locale;
  const newsletter = await getNewsletter(id);

  // Redirect numeric IDs to slug-based URL for canonical consistency
  if (newsletter && /^\d+$/.test(id) && newsletter.slug) {
    redirect(`/${locale}/newsletter/${newsletter.slug}`);
  }

  if (!newsletter) {
    return (
      <main className="min-h-screen bg-black text-white">
        <section className="relative px-4 py-24 sm:px-6" style={{ paddingTop: '140px' }}>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold">Newsletter Not Found</h1>
            <p className="mb-8 text-lg text-gray-300">
              This newsletter edition could not be found or is no longer available.
            </p>
            <Link
              href="/newsletter"
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              View All Newsletters
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const baseUrl = 'https://scam.ai';
  const articleUrl = `${baseUrl}/${locale}/newsletter/${newsletter.slug || id}`;

  // Parse human-readable date (e.g. "February 23, 2026") to ISO 8601 for schema
  const isoDate = (() => {
    const parsed = new Date(newsletter.date);
    return isNaN(parsed.getTime()) ? newsletter.date : parsed.toISOString().split('T')[0];
  })();

  const schemaKeywords = [
    'deepfake news',
    'AI security news',
    'synthetic media',
    'deepfake detection',
    'deepfake weekly',
    ...newsletter.sections.map((s) => s.title.toLowerCase()).slice(0, 4),
    ...newsletter.top3Articles.map((a) => a.source.toLowerCase()).slice(0, 2),
  ];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: newsletter.title,
    description: newsletter.executiveSummary?.slice(0, 160) || '',
    datePublished: isoDate,
    dateModified: isoDate,
    url: articleUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    image: [
      {
        '@type': 'ImageObject',
        url: `${baseUrl}/en/opengraph-image`,
        width: 1200,
        height: 630,
      },
    ],
    keywords: schemaKeywords.join(', '),
    articleSection: 'Deepfake Weekly',
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'Reality Inc.', url: baseUrl },
    publisher: {
      '@type': 'Organization',
      name: 'Scam AI',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/scamai-logo.svg`,
        width: 400,
        height: 100,
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${baseUrl}/${locale}/newsletter` },
      { '@type': 'ListItem', position: 3, name: newsletter.title },
    ],
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NewsletterDetail newsletter={newsletter} locale={locale} />

      {/* Internal links to products — distributes link equity and helps readers take action */}
      <section className="border-t border-gray-800/60 px-4 sm:px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-6">
            Detect the threats covered in this newsletter
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/products/ai-detection"
              className="group rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 hover:border-[#245FFF]/30 hover:bg-[#245FFF]/[0.02] transition-all"
            >
              <p className="text-xs font-semibold text-[#245FFF] uppercase tracking-wider mb-1">AI Image &amp; Video</p>
              <p className="text-sm font-semibold text-white group-hover:text-[#245FFF] transition-colors mb-1">
                Deepfake Detection API →
              </p>
              <p className="text-xs text-gray-600">98.2% accuracy · under 4 seconds · 200 free/month</p>
            </Link>
            <Link
              href="/products/audio-detection"
              className="group rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 hover:border-[#245FFF]/30 hover:bg-[#245FFF]/[0.02] transition-all"
            >
              <p className="text-xs font-semibold text-[#245FFF] uppercase tracking-wider mb-1">Voice &amp; Audio</p>
              <p className="text-sm font-semibold text-white group-hover:text-[#245FFF] transition-colors mb-1">
                Voice Clone Detection API →
              </p>
              <p className="text-xs text-gray-600">98.5% accuracy · real-time streams · call center use cases</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
