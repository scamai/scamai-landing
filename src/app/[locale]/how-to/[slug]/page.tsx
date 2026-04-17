import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HOW_TO_ENTRIES,
  getHowToBySlug,
  getHowToRelated,
} from "@/lib/seo/pages/how-to";
import {
  jsonLdProps,
  breadcrumbSchema,
  howToSchema,
} from "@/lib/seo/schema";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return HOW_TO_ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const e = getHowToBySlug(slug);
  if (!e) return { title: "Not found — ScamAI", robots: { index: false } };
  return {
    title: `${e.title} | ScamAI`,
    description: e.short,
    alternates: { canonical: `/${locale}/how-to/${e.slug}` },
    openGraph: { title: e.title, description: e.short, type: "article" },
  };
}

export default async function HowToDetail({ params }: Props) {
  const { locale, slug } = await params;
  const e = getHowToBySlug(slug);
  if (!e) notFound();
  const related = getHowToRelated(slug, 3);
  const canonical = `/${locale}/how-to/${e.slug}`;

  return (
    <main className="bg-black text-white">
      <script {...jsonLdProps(howToSchema({
        name: e.title,
        description: e.short,
        url: canonical,
        steps: e.steps.map((s) => ({ name: s.t, text: s.d })),
      }))} />
      <script {...jsonLdProps(breadcrumbSchema([
        { name: "Home", url: `/${locale}` },
        { name: "How-to", url: `/${locale}/how-to` },
        { name: e.title, url: canonical },
      ]))} />

      <article className="mx-auto max-w-3xl px-5 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
          <Link href={`/${locale}`} className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/how-to`} className="hover:text-white">How-to</Link>
        </nav>

        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
          {e.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base" data-speakable>
          {e.intro}
        </p>

        <ol className="mt-10 space-y-5">
          {e.steps.map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#245FFF]/60 font-mono text-xs font-bold text-[#8ca3ff]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-semibold text-white sm:text-base">{s.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-400">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>

        {e.extra && (
          <p className="mt-10 text-sm leading-relaxed text-gray-300 sm:text-base">{e.extra}</p>
        )}

        <div className="mt-12 rounded-xl border border-[#245FFF]/40 p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold sm:text-2xl">Try the tool now</h3>
          <p className="mt-2 text-sm text-gray-300">
            Run an image through Eva V1.6 — free, no signup for the first 2 scans.
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
            <h2 className="text-xl font-bold sm:text-2xl">More guides</h2>
            <ul className="mt-4 divide-y divide-white/5 border-y border-white/5">
              {related.map((r) => (
                <li key={r.slug} className="py-4">
                  <Link href={`/${locale}/how-to/${r.slug}`} className="group flex items-start justify-between gap-3 text-sm sm:text-base">
                    <span className="text-white group-hover:underline">{r.title}</span>
                    <span className="shrink-0 text-xs text-gray-500">{r.steps.length} steps</span>
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
