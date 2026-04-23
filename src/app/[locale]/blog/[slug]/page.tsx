export const dynamic = 'force-dynamic';

import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import NewsletterDetail from '@/components/newsletter/NewsletterDetail';
import Link from 'next/link';
import { getPublishedNewsletter, getPublishedNewsletterBySlug } from '@/lib/db/newsletters';

async function getByIdOrSlug(idOrSlug: string) {
  const bySlug = await getPublishedNewsletterBySlug(idOrSlug);
  if (bySlug) return bySlug;
  const num = Number(idOrSlug);
  if (!isNaN(num)) return getPublishedNewsletter(num);
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const newsletter = await getByIdOrSlug(slug);

  return generatePageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: newsletter ? `${newsletter.title} - Edition ${newsletter.edition}` : 'Blog',
    description: newsletter?.executiveSummary?.slice(0, 160) || 'Read the latest from ScamAI — deepfake trends, detection research, trust signals.',
    keywords: ['scamai blog', 'deepfake news', 'ai security', 'trust signals'],
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const newsletter = await getByIdOrSlug(slug);

  if (!newsletter) {
    return (
      <main className="min-h-screen bg-black text-white">
        <section className="relative px-4 py-24 sm:px-6" style={{ paddingTop: '140px' }}>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold">Post Not Found</h1>
            <p className="mb-8 text-lg text-gray-300">This post could not be found or is no longer available.</p>
            <Link
              href={`/${locale}/blog`}
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              View All Posts
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return <NewsletterDetail locale={locale} newsletter={newsletter} />;
}
