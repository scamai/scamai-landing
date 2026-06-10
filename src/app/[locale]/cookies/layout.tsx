import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/cookies',
    ...pageMetadata.cookies,
  });
}

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
