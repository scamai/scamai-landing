import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import { locales } from '@/i18n/config';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/learn/articles';
import { notFound } from 'next/navigation';

type Params = { locale: Locale; slug: string };

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return generatePageMetadata({ locale, path: `/learn/${slug}`, title: 'Not found', description: '', noindex: true });
  }
  return generatePageMetadata({
    locale,
    path: `/learn/${slug}`,
    title: article.title,
    description: article.description,
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
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const breadcrumbSchema = generateBreadcrumbSchema(locale, [
    { name: 'Learn', path: '/learn' },
    { name: article.title },
  ]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'Reality Inc.', url: 'https://scam.ai' },
    publisher: {
      '@type': 'Organization',
      name: 'ScamAI',
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
    mainEntity: article.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
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
