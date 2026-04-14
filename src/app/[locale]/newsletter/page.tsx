export const dynamic = 'force-dynamic';

import { generatePageMetadata, generateBreadcrumbSchema, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import NewsletterList from '@/components/newsletter/NewsletterList';
import { getPublishedNewsletters } from '@/lib/db/newsletters';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/newsletter',
    ...pageMetadata.newsletter,
  });
}

export default async function NewsletterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  let newsletters: Awaited<ReturnType<typeof getPublishedNewsletters>> = [];
  try {
    newsletters = await getPublishedNewsletters();
  } catch (error) {
    console.error('Failed to fetch newsletters:', error);
  }

  const baseUrl = 'https://scam.ai';

  const breadcrumbSchema = generateBreadcrumbSchema(locale, [
    { name: 'Newsletter' },
  ]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Deepfake Weekly Newsletter',
    description:
      'Weekly analysis on deepfake technology, synthetic media threats, and AI fraud from ScamAI.',
    url: `${baseUrl}/${locale}/newsletter`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: newsletters.slice(0, 20).map((nl, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${baseUrl}/${locale}/newsletter/${nl.slug || nl.id}`,
        name: nl.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:px-6" style={{ paddingTop: '140px' }}>
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Deepfake Weekly — ScamAI
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Weekly analysis on deepfake technology, synthetic media threats, and AI fraud — from the team at ScamAI.
          </p>
        </div>
      </section>

      <NewsletterList newsletters={newsletters} />
    </main>
  );
}
