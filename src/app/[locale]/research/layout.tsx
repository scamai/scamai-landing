import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/research',
    ...pageMetadata.research,
  });
}

export default async function ResearchLayout({
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
        path="/research"
        breadcrumbs={[{ name: 'Research' }]}
        speakable
      />
      {children}
    </>
  );
}
