import type { Metadata } from "next";
import Link from "next/link";
import { COMPARE_ENTRIES } from "@/lib/seo/pages/compare";
import { jsonLdProps, breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "ScamAI vs Hive, Sensity, AI or Not — deepfake detection compared | ScamAI",
  description:
    "Side-by-side comparisons of ScamAI Eva V1.6 vs major deepfake-detection platforms. Accuracy, pricing, latency, free tier.",
};

export default async function CompareIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="bg-black text-white">
      <script {...jsonLdProps(breadcrumbSchema([
        { name: "Home", url: `/${locale}` },
        { name: "Compare", url: `/${locale}/compare` },
      ]))} />

      <section className="mx-auto max-w-4xl px-5 pt-24 pb-10 sm:px-6 sm:pt-32">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          ScamAI vs …
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-gray-300 sm:text-base">
          Honest side-by-side comparisons with the main deepfake-detection
          platforms. Pricing, accuracy, latency, free tier — everything a
          buyer asks.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-6">
        <ul className="divide-y divide-white/5 border-y border-white/5">
          {COMPARE_ENTRIES.map((e) => (
            <li key={e.slug} className="py-5">
              <Link href={`/${locale}/compare/${e.slug}`} className="group block">
                <h2 className="text-base font-semibold text-white group-hover:underline sm:text-lg">
                  ScamAI vs {e.competitor}
                </h2>
                <p className="mt-1 text-sm text-gray-400">{e.short}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
