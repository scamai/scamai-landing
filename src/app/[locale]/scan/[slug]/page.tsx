import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getScanBySlug } from "@/lib/db/scans";
import {
  breadcrumbSchema,
  jsonLdProps,
  scanResultSchema,
} from "@/lib/seo/schema";
import { VerdictBadge } from "@/components/scan/VerdictBadge";
import { SignalList } from "@/components/scan/SignalList";
import { ShareBar } from "@/components/scan/ShareBar";
import { IS_AI_ENTRIES } from "@/lib/seo/pages/is-ai";
import { HOW_TO_ENTRIES } from "@/lib/seo/pages/how-to";

type ScanPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function verdictLabel(verdict: string): string {
  if (verdict === "likely_ai_manipulated") return "Likely AI-manipulated";
  if (verdict === "likely_real") return "Likely real";
  return "Uncertain";
}

export async function generateMetadata({ params }: ScanPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const scan = await getScanBySlug(slug);
  if (!scan || !scan.is_public) {
    return { title: "Scan not found — ScamAI", robots: { index: false } };
  }
  const label = verdictLabel(scan.verdict);
  const title = `${label} (${Number(scan.confidence).toFixed(0)}% AI index) — ScamAI`;
  const description = `ScamAI Eva V1.6 analyzed this image. Verdict: ${label} at ${Number(scan.confidence).toFixed(0)}% AI index. Free to verify any image.`;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/scan/${slug}` },
    robots: scan.min_quality_passed && !scan.nsfw_flag ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/${locale}/scan/${slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ScanPage({ params }: ScanPageProps) {
  const { locale, slug } = await params;
  const scan = await getScanBySlug(slug);
  if (!scan || !scan.is_public) notFound();

  const label = verdictLabel(scan.verdict);
  const confidence = Number(scan.confidence);
  const signals = Array.isArray((scan.signals as { list?: unknown[] })?.list)
    ? ((scan.signals as { list: unknown[] }).list as Array<{ type: string; score: number }>)
    : [];

  const breadcrumbs = [
    { name: "Home", url: `/${locale}` },
    { name: "Scans", url: `/${locale}/trending` },
    { name: label, url: `/${locale}/scan/${slug}` },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <script {...jsonLdProps(scanResultSchema(slug, scan.verdict, confidence))} />
      <script {...jsonLdProps(breadcrumbSchema(breadcrumbs))} />

      <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-24">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
          <Link href={`/${locale}`} className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/trending`} className="hover:text-white">Scans</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{slug}</span>
        </nav>

        <header className="mb-8 space-y-3">
          <VerdictBadge verdict={scan.verdict} confidence={confidence} />
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            {label}{" "}
            <span className="text-gray-400">({confidence.toFixed(0)}% AI index)</span>
          </h1>
          <p className="text-sm text-gray-400">
            Analyzed by <span className="font-semibold text-white">ScamAI Eva {scan.model_version.includes("v1.6") ? "V1.6" : scan.model_version}</span>{" "}
            · {new Date(scan.created_at).toLocaleString()}
          </p>
        </header>

        {scan.image_url && (
          <figure className="mb-8 overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scan.image_url}
              alt={`Scanned image — ${label}`}
              className="w-full h-auto max-h-[600px] object-contain bg-black/40"
            />
          </figure>
        )}

        <section className="mb-8 rounded-xl border border-white/10 p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Detection signals
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Per-category scores from the Eva model. Higher = stronger evidence of manipulation in that category.
          </p>
          <div className="mt-4">
            <SignalList signals={signals} />
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-yellow-500/30 p-5 text-sm text-yellow-200/90 sm:p-6">
          <p className="font-semibold text-yellow-100">We catch about 95% of manipulated images.</p>
          <p className="mt-1 text-yellow-200/80">
            No detector is perfect, and new generators emerge faster than any model can perfectly keep up.
            Treat low-confidence results as uncertain and cross-check with additional sources when it matters.
          </p>
        </section>

        <ShareBar slug={slug} verdictLabel={label} confidence={confidence} />

        <div className="mt-12 rounded-xl border border-[#245FFF]/40 p-6 text-center sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">Scan your own image</h2>
          <p className="mt-2 text-sm text-gray-300 sm:text-base">
            Free, no signup for the first 2 scans. Results in under 2 seconds.
          </p>
          <Link
            href={`/${locale}`}
            className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Verify an image →
          </Link>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Popular verifications
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {IS_AI_ENTRIES.slice(0, 4).map((e) => (
                <li key={e.slug}>
                  <Link href={`/${locale}/is-ai/${e.slug}`} className="text-gray-300 hover:text-white hover:underline">
                    Is {e.subject} AI-generated?
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/is-ai`} className="font-semibold text-[#245FFF] hover:underline">
                  Browse all →
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              How to verify
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {HOW_TO_ENTRIES.slice(0, 4).map((e) => (
                <li key={e.slug}>
                  <Link href={`/${locale}/how-to/${e.slug}`} className="text-gray-300 hover:text-white hover:underline">
                    {e.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/how-to`} className="font-semibold text-[#245FFF] hover:underline">
                  Browse all →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
