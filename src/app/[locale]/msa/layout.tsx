import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/msa',
    ...pageMetadata.msa,
  });
}

export default function MsaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
