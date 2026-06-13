import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import { locales } from '@/i18n/config';
import { getIndustryBySlug, getAllIndustrySlugs } from '@/lib/solutions/industries';
import { getSeoTranslation } from '@/lib/seo-translations';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Params = { locale: string; industry: string };

export async function generateStaticParams() {
  const slugs = getAllIndustrySlugs();
  return locales.flatMap((locale) => slugs.map((industry) => ({ locale, industry })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale: localeParam, industry: slug } = await params;
  const locale = localeParam as Locale;
  const industry = getIndustryBySlug(slug);
  if (!industry) {
    return generatePageMetadata({ locale, path: `/solutions/${slug}`, title: 'Not found', description: '', noindex: true });
  }
  const t = await getTranslations({ locale, namespace: `solutionsContent.${slug}` });
  const seo = await getSeoTranslation(locale, 'solutions', slug);
  return generatePageMetadata({
    locale,
    path: `/solutions/${slug}`,
    title: seo?.title ?? `${t('headline')} | Scam AI`,
    description: seo?.metaDescription ?? t('metaDescription'),
    keywords: industry.keywords,
    dateModified: '2026-05-23',
  });
}

export default async function IndustryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale: localeParam, industry: slug } = await params;
  const locale = localeParam as Locale;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  const t = await getTranslations({ locale, namespace: `solutionsContent.${slug}` });
  const seo = await getSeoTranslation(locale, 'solutions', slug);

  const breadcrumbSchema = generateBreadcrumbSchema(locale, [
    { name: 'Solutions', path: '/solutions' },
    { name: t('name') },
  ]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Array.from({ length: industry.faqsCount }, (_, i) => ({
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
