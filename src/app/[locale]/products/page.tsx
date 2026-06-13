import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/products',
    ...pageMetadata.products,
  });
}

export default function ProductsPage() {
  const t = useTranslations("productsPage");

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#66b3ff]">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* AI Detection */}
            <Link
              href="/products/ai-detection"
              className="group rounded-lg border border-gray-800 bg-gray-900/40 p-8 hover:border-[#66b3ff] transition-colors"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#66b3ff]/10 group-hover:bg-[#66b3ff]/20 transition-colors">
                <svg className="h-8 w-8 text-[#66b3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">{t("cards.aiDetection.title")}</h3>
              <p className="mb-4 text-gray-300">
                {t("cards.aiDetection.description")}
              </p>
              <div className="text-[#66b3ff] group-hover:underline">
                {t("cards.aiDetection.link")}
              </div>
            </Link>

            {/* Audio Detection */}
            <Link
              href="/products/audio-detection"
              className="group rounded-lg border border-gray-800 bg-gray-900/40 p-8 hover:border-[#66b3ff] transition-colors"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#66b3ff]/10 group-hover:bg-[#66b3ff]/20 transition-colors">
                <svg className="h-8 w-8 text-[#66b3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">{t("cards.audioDetection.title")}</h3>
              <p className="mb-4 text-gray-300">
                {t("cards.audioDetection.description")}
              </p>
              <div className="text-[#66b3ff] group-hover:underline">
                {t("cards.audioDetection.link")}
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            {t("comparison.heading")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-4 px-6 text-left text-white font-bold">{t("comparison.columns.feature")}</th>
                  <th className="py-4 px-6 text-center text-white font-bold">{t("comparison.columns.vision")}</th>
                  <th className="py-4 px-6 text-center text-white font-bold">{t("comparison.columns.audio")}</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 px-6">{t("comparison.rows.accuracy")}</td>
                  <td className="py-4 px-6 text-center">98.2%*</td>
                  <td className="py-4 px-6 text-center">98.5%</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 px-6">{t("comparison.rows.speed")}</td>
                  <td className="py-4 px-6 text-center">&lt;4s</td>
                  <td className="py-4 px-6 text-center">3s</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 px-6">{t("comparison.rows.formats")}</td>
                  <td className="py-4 px-6 text-center">JPG, PNG, GIF, MP4</td>
                  <td className="py-4 px-6 text-center">MP3, WAV, M4A</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 px-6">{t("comparison.rows.realTime")}</td>
                  <td className="py-4 px-6 text-center text-[#66b3ff]">✓</td>
                  <td className="py-4 px-6 text-center text-[#66b3ff]">✓</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 px-6">{t("comparison.rows.batch")}</td>
                  <td className="py-4 px-6 text-center text-[#66b3ff]">✓</td>
                  <td className="py-4 px-6 text-center text-[#66b3ff]">✓</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 px-6">{t("comparison.rows.api")}</td>
                  <td className="py-4 px-6 text-center text-[#66b3ff]">✓</td>
                  <td className="py-4 px-6 text-center text-[#66b3ff]">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            {t("useCases.heading")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6">
              <h3 className="mb-2 text-lg font-bold text-white">{t("useCases.socialMedia.title")}</h3>
              <p className="text-sm text-gray-300 mb-3">{t("useCases.socialMedia.description")}</p>
              <Link href="/products/ai-detection" className="text-xs text-[#66b3ff] hover:underline">{t("useCases.socialMedia.link")}</Link>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6">
              <h3 className="mb-2 text-lg font-bold text-white">{t("useCases.financial.title")}</h3>
              <p className="text-sm text-gray-300 mb-3">{t("useCases.financial.description")}</p>
              <div className="flex flex-col gap-1">
                <Link href="/products/ai-detection" className="text-xs text-[#66b3ff] hover:underline">{t("useCases.financial.linkKyc")}</Link>
                <Link href="/products/audio-detection" className="text-xs text-[#66b3ff] hover:underline">{t("useCases.financial.linkVoice")}</Link>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6">
              <h3 className="mb-2 text-lg font-bold text-white">{t("useCases.media.title")}</h3>
              <p className="text-sm text-gray-300 mb-3">{t("useCases.media.description")}</p>
              <Link href="/products/ai-detection" className="text-xs text-[#66b3ff] hover:underline">{t("useCases.media.link")}</Link>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6">
              <h3 className="mb-2 text-lg font-bold text-white">{t("useCases.ecommerce.title")}</h3>
              <p className="text-sm text-gray-300 mb-3">{t("useCases.ecommerce.description")}</p>
              <Link href="/products/ai-detection" className="text-xs text-[#66b3ff] hover:underline">{t("useCases.ecommerce.link")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            {t("cta.heading")}
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            {t("cta.description")}
          </p>
          <a
            href="https://app.scam.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="rainbow-button inline-block"
          >
            <span className="rainbow-button-inner">
              {t("cta.button")}
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
