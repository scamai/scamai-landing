import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/about',
    ...pageMetadata.about,
  });
}

export default async function AboutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <PageSchema
        locale={locale}
        path="/about"
        breadcrumbs={[{ name: 'About Us' }]}
      />
      {children}
    </>
  );
}
