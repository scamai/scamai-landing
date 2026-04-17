import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IS_AI_ENTRIES,
  getIsAiBySlug,
  getIsAiRelated,
} from "@/lib/seo/pages/is-ai";
import {
  jsonLdProps,
  breadcrumbSchema,
  claimReviewSchema,
  articleSchema,
} from "@/lib/seo/schema";

type Props = { params: Promise<{ locale: string; slug: string }> };

function verdictLabel(v: string) {
  if (v === "ai_generated") return "AI-generated";
  if (v === "real") return "Likely real";
  if (v === "mixed") return "Mixed / partial";
  return "Uncertain";
}
function verdictRating(v: string): 1 | 2 | 3 | 4 | 5 {
  if (v === "real") return 5;
  if (v === "ai_generated") return 1;
  if (v === "mixed") return 2;
  return 3;
}

export function generateStaticParams() {
  return IS_AI_ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const e = getIsAiBySlug(slug);
  if (!e) return { title: "Not found — ScamAI", robots: { index: false } };
  const title = `Is ${e.subject} AI-generated? — ${verdictLabel(e.verdict)} | ScamAI`;
  return {
    title,
    description: e.short,
    alternates: { canonical: `/${locale}/is-ai/${e.slug}` },
    openGraph: { title, description: e.short, type: "article" },
    twitter: { card: "summary_large_image", title, description: e.short },
  };
}

export default async function IsAiDetail({ params }: Props) {
  const { locale, slug } = await params;
  const e = getIsAiBySlug(slug);
  if (!e) notFound();
  const related = getIsAiRelated(slug, 3);
  const canonical = `/${locale}/is-ai/${e.slug}`;
  const label = verdictLabel(e.verdict);

  return (
    <main className="bg-black text-white">
      <script {...jsonLdProps(articleSchema({
        headline: `Is ${e.subject} AI-generated?`,
        description: e.short,
        url: canonical,
        datePublished: e.published,
      }))} />
      <script {...jsonLdProps(claimReviewSchema({
        url: canonical,
        claim: `${e.subject} is AI-generated`,
        verdict: label,
        rating: verdictRating(e.verdict),
        datePublished: e.published,
      }))} />
      <script {...jsonLdProps(breadcrumbSchema([
        { name: "Home", url: `/${locale}` },
        { name: "Is it AI?", url: `/${locale}/is-ai` },
        { name: e.subject, url: canonical },
      ]))} />

      <article className="mx-auto max-w-3xl px-5 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
          <Link href={`/${locale}`} className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/is-ai`} className="hover:text-white">Is it AI?</Link>
        </nav>

        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
          ScamAI verdict · {e.confidenceLabel}
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
          Is <span className="text-[#245FFF]">{e.subject}</span> AI-generated?
        </h1>
        <p className="mt-4 text-lg font-semibold" data-speakable>
          {label}. {e.short}
        </p>

        <p className="mt-6 text-sm leading-relaxed text-gray-300 sm:text-base">{e.context}</p>

        <h2 className="mt-10 text-xl font-bold sm:text-2xl">Detection signals</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-300">
          {e.signals.map((s) => (
            <li key={s} className="flex gap-2">
              <span aria-hidden className="text-[#245FFF]">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>

        {e.sourceUrl && (
          <p className="mt-6 text-xs text-gray-500">
            Original source:{" "}
            <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              {new URL(e.sourceUrl).hostname}
            </a>
          </p>
        )}

        <div className="mt-12 rounded-xl border border-[#245FFF]/40 p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold sm:text-2xl">Verify your own image</h3>
          <p className="mt-2 text-sm text-gray-300">
            Drop any image — Eva V1.6 returns a verdict + confidence in under 2 seconds.
          </p>
          <Link
            href={`/${locale}#verify`}
            className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Verify an image →
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold sm:text-2xl">Related verifications</h2>
            <ul className="mt-4 divide-y divide-white/5 border-y border-white/5">
              {related.map((r) => (
                <li key={r.slug} className="py-4">
                  <Link href={`/${locale}/is-ai/${r.slug}`} className="group flex items-center justify-between gap-3 text-sm sm:text-base">
                    <span className="text-white group-hover:underline">
                      Is {r.subject} AI-generated?
                    </span>
                    <span className="text-xs text-gray-500">{verdictLabel(r.verdict)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </main>
  );
}
