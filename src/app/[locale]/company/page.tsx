import { redirect } from 'next/navigation';

export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  // Company page redirects to About — all company info lives there.
  // Locale-aware target: a bare redirect('/about') bounced through the locale
  // middleware (308 /about → /en/about), doubling the hop.
  const { locale } = await params;
  redirect(`/${locale}/about`);
}
