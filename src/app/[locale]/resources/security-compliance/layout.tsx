import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/resources/security-compliance',
    ...pageMetadata.securityCompliance,
  });
}

export default function SecurityComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
