import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/company',
    ...pageMetadata.company,
  });
}

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <PageSchema locale={locale} path="/company" breadcrumbs={[{ name: 'Company' }]} />
      {children}
    </>
  );
}
