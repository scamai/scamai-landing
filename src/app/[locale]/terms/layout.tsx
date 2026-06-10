import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/terms',
    ...pageMetadata.terms,
  });
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
