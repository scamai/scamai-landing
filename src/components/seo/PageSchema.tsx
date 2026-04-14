import { generateBreadcrumbSchema, generateSpeakableSchema } from '@/lib/seo';
import type { Locale } from '@/lib/seo';

interface PageSchemaProps {
  locale: Locale;
  path: string;
  breadcrumbs: { name: string; path?: string }[];
  speakable?: boolean;
  speakableSelectors?: string[];
}

export default function PageSchema({
  locale,
  path,
  breadcrumbs,
  speakable = false,
  speakableSelectors,
}: PageSchemaProps) {
  const breadcrumbSchema = generateBreadcrumbSchema(locale, breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {speakable && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateSpeakableSchema(locale, path, speakableSelectors)
            ),
          }}
        />
      )}
    </>
  );
}
