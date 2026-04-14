import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/products/audio-detection',
    ...pageMetadata.audioDetection,
  });
}

export default async function AudioDetectionLayout({
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
        path="/products/audio-detection"
        breadcrumbs={[
          { name: 'Products', path: '/products' },
          { name: 'Audio Detection' },
        ]}
        speakable
      />
      {children}
    </>
  );
}
