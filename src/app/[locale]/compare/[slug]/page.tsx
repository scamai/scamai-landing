import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPARE_ENTRIES, getCompareBySlug } from "@/lib/seo/pages/compare";
import {
  jsonLdProps,
  breadcrumbSchema,
  articleSchema,
} from "@/lib/seo/schema";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return COMPARE_ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const e = getCompareBySlug(slug);
  if (!e) return { title: "Not found — ScamAI", robots: { index: false } };
  const title = `ScamAI vs ${e.competitor} — deepfake detection compared | ScamAI`;
  return {
    title,
    description: e.short,
    alternates: { canonical: `/${locale}/compare/${e.slug}` },
    openGraph: { title, description: e.short, type: "article" },
  };
}

function EdgeChip({ edge }: { edge: "scamai" | "competitor" | "tie" }) {
  if (edge === "scamai") return <span className="rounded-full border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">ScamAI</span>;
  if (edge === "competitor") return <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-300">Competitor</span>;
  return <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Tie</span>;
}

export default async function CompareDetail({ params }: Props) {
  const { locale, slug } = await params;
  const e = getCompareBySlug(slug);
  if (!e) notFound();
  const canonical = `/${locale}/compare/${e.slug}`;

  return (
    <main className="bg-black text-white">
      <script {...jsonLdProps(articleSchema({
        headline: `ScamAI vs ${e.competitor}`,
        description: e.short,
        url: canonical,
        datePublished: e.published,
      }))} />
      <script {...jsonLdProps(breadcrumbSchema([
        { name: "Home", url: `/${locale}` },
        { name: "Compare", url: `/${locale}/compare` },
        { name: e.competitor, url: canonical },
      ]))} />

      <article className="mx-auto max-w-4xl px-5 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
          <Link href={`/${locale}`} className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/compare`} className="hover:text-white">Compare</Link>
        </nav>

        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
          <span className="text-[#245FFF]">ScamAI</span> vs {e.competitor}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-300 sm:text-lg" data-speakable>
          {e.positioning}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#245FFF]/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8ca3ff]">ScamAI — TL;DR</p>
            <p className="mt-2 text-sm text-gray-200">{e.tldr.scamai}</p>
          </div>
          <div className="rounded-xl border border-white/15 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{e.competitor} — TL;DR</p>
            <p className="mt-2 text-sm text-gray-300">{e.tldr.competitor}</p>
          </div>
        </div>

        <h2 className="mt-14 text-2xl font-bold">Feature comparison</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="py-3 pr-4 font-semibold">Feature</th>
                <th className="py-3 pr-4 font-semibold text-[#8ca3ff]">ScamAI</th>
                <th className="py-3 pr-4 font-semibold">{e.competitor}</th>
                <th className="py-3 font-semibold">Edge</th>
              </tr>
            </thead>
            <tbody>
              {e.rows.map((r) => (
                <tr key={r.feature} className="border-b border-white/5 align-top">
                  <td className="py-3 pr-4 font-semibold text-white">{r.feature}</td>
                  <td className="py-3 pr-4 text-gray-200">{r.scamai}</td>
                  <td className="py-3 pr-4 text-gray-300">{r.competitor}</td>
                  <td className="py-3"><EdgeChip edge={r.edge} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-14 text-2xl font-bold">Best for</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#245FFF]/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8ca3ff]">ScamAI is best for</p>
            <p className="mt-2 text-sm text-gray-200">{e.bestFor.scamai}</p>
          </div>
          <div className="rounded-xl border border-white/15 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{e.competitor} is best for</p>
            <p className="mt-2 text-sm text-gray-300">{e.bestFor.competitor}</p>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-[#245FFF]/40 p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold sm:text-2xl">Try ScamAI now — free</h3>
          <p className="mt-2 text-sm text-gray-300">
            No signup for the first 2 scans. Under 2 seconds.
          </p>
          <Link
            href={`/${locale}#verify`}
            className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Verify an image →
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-500">
          Comparison drawn from public product pages and documentation.{" "}
          <a href={e.competitorUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            {e.competitor} website
          </a>
          . Think we missed something? Tell us at{" "}
          <Link href={`/${locale}/contact`} className="underline hover:text-white">
            /contact
          </Link>
          .
        </p>

        <div className="mt-16">
          <h2 className="text-xl font-bold sm:text-2xl">Other comparisons</h2>
          <ul className="mt-4 divide-y divide-white/5 border-y border-white/5">
            {COMPARE_ENTRIES.filter((c) => c.slug !== e.slug).map((c) => (
              <li key={c.slug} className="py-4">
                <Link href={`/${locale}/compare/${c.slug}`} className="group flex items-center justify-between gap-3 text-sm sm:text-base">
                  <span className="text-white group-hover:underline">ScamAI vs {c.competitor}</span>
                  <span className="text-xs text-gray-500">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </main>
  );
}
