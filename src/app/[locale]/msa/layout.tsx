import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
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
