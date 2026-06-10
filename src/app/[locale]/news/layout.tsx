import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/news',
    ...pageMetadata.news,
  });
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
