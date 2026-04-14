import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/products/ai-detection',
    ...pageMetadata.aiDetection,
  });
}

export default async function AIDetectionLayout({
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
        path="/products/ai-detection"
        breadcrumbs={[
          { name: 'Products', path: '/products' },
          { name: 'AI Detection' },
        ]}
        speakable
      />
      {children}
    </>
  );
}
