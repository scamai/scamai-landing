import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import { locales } from '@/i18n/config';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/learn/articles';
import { getSeoTranslation } from '@/lib/seo-translations';
import { notFound } from 'next/navigation';

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const article = getArticleBySlug(slug);
  if (!article) {
    return generatePageMetadata({ locale, path: `/learn/${slug}`, title: 'Not found', description: '', noindex: true });
  }
  const seo = await getSeoTranslation(locale, 'learn', slug);
  return generatePageMetadata({
    locale,
    path: `/learn/${slug}`,
    title: seo?.title ?? article.title,
    description: seo?.metaDescription ?? article.description,
    keywords: article.keywords,
    dateModified: article.publishedAt,
  });
}

export default async function LearnArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const seo = await getSeoTranslation(locale, 'learn', slug);

  const breadcrumbSchema = generateBreadcrumbSchema(locale, [
    { name: 'Learn', path: '/learn' },
    { name: seo?.title ?? article.title },
  ]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seo?.headline ?? article.title,
    description: seo?.metaDescription ?? article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'Reality Inc.', url: 'https://scam.ai' },
    publisher: {
      '@type': 'Organization',
      name: 'Scam AI',
      url: 'https://scam.ai',
      logo: { '@type': 'ImageObject', url: 'https://scam.ai/scamai-logo.svg', width: 400, height: 100 },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://scam.ai/${locale}/learn/${slug}` },
    keywords: article.keywords.join(', '),
    articleSection: article.category,
    image: { '@type': 'ImageObject', url: 'https://scam.ai/en/opengraph-image', width: 1200, height: 630 },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq, i) => ({
      '@type': 'Question',
      name: seo?.faqQuestions?.[i] ?? faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
