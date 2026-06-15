import { redirect } from 'next/navigation';

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  // News content lives in the newsletter section. Locale-aware target: a bare
  // redirect('/newsletter') bounced through the locale middleware (308 →
  // /en/newsletter), doubling the hop — mirror /company's fix.
  const { locale } = await params;
  redirect(`/${locale}/newsletter`);
}
