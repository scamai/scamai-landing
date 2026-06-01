import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import { locales } from '@/i18n/config';
import { getCompetitorBySlug, getAllCompetitorSlugs } from '@/lib/compare/competitors';
import { getSeoTranslation } from '@/lib/seo-translations';
import { notFound } from 'next/navigation';

type Params = { locale: Locale; competitor: string };

export async function generateStaticParams() {
  const slugs = getAllCompetitorSlugs();
  return locales.flatMap((locale) => slugs.map((competitor) => ({ locale, competitor })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, competitor: slug } = await params;
  const competitor = getCompetitorBySlug(slug);
  if (!competitor) {
    return generatePageMetadata({ locale, path: `/compare/${slug}`, title: 'Not found', description: '', noindex: true });
  }
  const seo = await getSeoTranslation(locale, 'compare', slug);
  return generatePageMetadata({
    locale,
    path: `/compare/${slug}`,
    title: seo?.title ?? `${competitor.tagline} | ScamAI`,
    description: seo?.metaDescription ?? competitor.metaDescription,
    keywords: competitor.keywords,
    dateModified: '2026-05-23',
  });
}

export default async function CompareLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale, competitor: slug } = await params;
  const competitor = getCompetitorBySlug(slug);
  if (!competitor) notFound();

  const seo = await getSeoTranslation(locale, 'compare', slug);

  const breadcrumbSchema = generateBreadcrumbSchema(locale, [
    { name: 'Compare', path: '/compare' },
    { name: `ScamAI vs ${competitor.name}` },
  ]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: competitor.faqs.map((faq, i) => ({
      '@type': 'Question',
      name: seo?.faqQuestions?.[i] ?? faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
