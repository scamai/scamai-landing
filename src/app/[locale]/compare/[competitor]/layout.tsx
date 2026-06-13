import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import { locales } from '@/i18n/config';
import { getCompetitorBySlug, getAllCompetitorSlugs } from '@/lib/compare/competitors';
import { getSeoTranslation } from '@/lib/seo-translations';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Params = { locale: string; competitor: string };

export async function generateStaticParams() {
  const slugs = getAllCompetitorSlugs();
  return locales.flatMap((locale) => slugs.map((competitor) => ({ locale, competitor })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale: localeParam, competitor: slug } = await params;
  const locale = localeParam as Locale;
  const competitor = getCompetitorBySlug(slug);
  if (!competitor) {
    return generatePageMetadata({ locale, path: `/compare/${slug}`, title: 'Not found', description: '', noindex: true });
  }
  const seo = await getSeoTranslation(locale, 'compare', slug);
  const t = await getTranslations({ locale, namespace: `compareContent.${slug}` });
  return generatePageMetadata({
    locale,
    path: `/compare/${slug}`,
    title: seo?.title ?? `${t('tagline')} | Scam AI`,
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
  const { locale: localeParam, competitor: slug } = await params;
  const locale = localeParam as Locale;
  const competitor = getCompetitorBySlug(slug);
  if (!competitor) notFound();

  const seo = await getSeoTranslation(locale, 'compare', slug);
  const t = await getTranslations({ locale, namespace: `compareContent.${slug}` });

  const breadcrumbSchema = generateBreadcrumbSchema(locale, [
    { name: 'Compare', path: '/compare' },
    { name: `Scam AI vs ${competitor.name}` },
  ]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Array.from({ length: competitor.faqsCount }).map((_, i) => ({
      '@type': 'Question',
      name: seo?.faqQuestions?.[i] ?? t(`faqs.${i}.question`),
      acceptedAnswer: { '@type': 'Answer', text: t(`faqs.${i}.answer`) },
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
