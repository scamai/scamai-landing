export const dynamic = 'force-dynamic';

import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import NewsletterDetail from '@/components/newsletter/NewsletterDetail';
import Link from 'next/link';
import { getPublishedNewsletter, getPublishedNewsletterBySlug } from '@/lib/db/newsletters';

async function getNewsletter(idOrSlug: string) {
  // Try slug first, then numeric ID for backwards compatibility
  const bySlug = await getPublishedNewsletterBySlug(idOrSlug);
  if (bySlug) return bySlug;
  const num = Number(idOrSlug);
  if (!isNaN(num)) return getPublishedNewsletter(num);
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
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
    title: newsletter ? `${newsletter.title} | Deepfake Weekly` : 'Deepfake Weekly Newsletter | ScamAI',
    description: newsletter?.executiveSummary?.slice(0, 160) || 'Read the latest Deepfake Weekly newsletter from ScamAI.',
    keywords,
  });
}

export default async function NewsletterDetailPage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  const newsletter = await getNewsletter(id);

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
              href={`/${locale}/newsletter`}
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
      name: 'ScamAI',
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
    </main>
  );
}
