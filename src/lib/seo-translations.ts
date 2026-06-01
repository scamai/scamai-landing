type SeoMeta = {
  title?: string;
  metaDescription?: string;
  headline?: string;
  tagline?: string;
  faqQuestions?: string[];
};

export async function getSeoTranslation(
  locale: string,
  section: 'solutions' | 'compare' | 'learn',
  slug: string
): Promise<SeoMeta | undefined> {
  if (locale === 'en') return undefined;
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return messages?.seoMeta?.[section]?.[slug] ?? undefined;
  } catch {
    return undefined;
  }
}
