export const dynamic = 'force-dynamic';

import { generatePageMetadata, generateBreadcrumbSchema, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import NewsletterList from '@/components/newsletter/NewsletterList';
import { getPublishedNewsletters } from '@/lib/db/newsletters';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/blog',
    ...pageMetadata.newsletter,
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  let newsletters: Awaited<ReturnType<typeof getPublishedNewsletters>> = [];
  try {
    newsletters = await getPublishedNewsletters();
  } catch (error) {
    console.error('Failed to fetch newsletters:', error);
  }

  const breadcrumbSchema = generateBreadcrumbSchema(locale, [{ name: 'Blog' }]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NewsletterList newsletters={newsletters} />
    </>
  );
}
