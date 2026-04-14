import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/products/scam-database',
    ...pageMetadata.scamDatabase,
  });
}

export default async function ScamDatabaseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <>
      <PageSchema
        locale={locale}
        path="/products/scam-database"
        breadcrumbs={[
          { name: 'Products', path: '/products' },
          { name: 'Scam Database' },
        ]}
      />
      {children}
    </>
  );
}
