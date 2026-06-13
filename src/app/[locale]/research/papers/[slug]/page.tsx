import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import type { Locale } from "@/lib/seo";
import { locales } from "@/i18n/config";
import {
  getPaperBySlug,
  getDatasetsForPaper,
  getAllPaperSlugs,
  researchPapers,
} from "@/lib/research/data";
import { DatasetAccessButton } from "@/components/research/DatasetAccessButton";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const slugs = getAllPaperSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const paper = getPaperBySlug(slug);
  if (!paper) {
    return generatePageMetadata({
      locale,
      path: `/research/papers/${slug}`,
      title: "Paper not found",
      description: "This research paper could not be found.",
      noindex: true,
    });
  }

  if (paper.coming) {
    return generatePageMetadata({
      locale,
      path: `/research/papers/${paper.slug}`,
      title: `${paper.title} – Coming Soon`,
      description: `Upcoming Scam AI research: ${paper.title}. ${paper.category} research from the Scam AI team — paper to be published.`,
      keywords: ["research paper", "coming soon", paper.category.toLowerCase(), ...paper.tags],
      noindex: true,
    });
  }

  const description =
    paper.abstract ??
    `${paper.title}${paper.authors ? ` by ${paper.authors}.` : "."} Research from the Scam AI team on ${paper.category.toLowerCase()}.`;

  return generatePageMetadata({
    locale,
    path: `/research/papers/${paper.slug}`,
    title: `${paper.title} – Scam AI Research`,
    description,
    keywords: ["research paper", paper.category.toLowerCase(), ...paper.tags],
  });
}

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const paper = getPaperBySlug(slug);
  if (!paper) notFound();

  const datasets = getDatasetsForPaper(paper.slug);

  const authorList = paper.authors
    ? paper.authors
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
    : [];

  const breadcrumbSchema = generateBreadcrumbSchema(locale, [
    { name: "Research", path: "/research" },
    { name: "Papers", path: "/research" },
    { name: paper.title },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.title,
    name: paper.title,
    url: `https://scam.ai/${locale}/research/papers/${paper.slug}`,
    ...(paper.link ? { sameAs: paper.link } : {}),
    ...(paper.arxivId
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "arXiv",
            value: paper.arxivId,
          },
        }
      : {}),
    author: authorList.length
      ? authorList.map((name) => ({ "@type": "Person", name }))
      : { "@type": "Organization", name: "Scam AI Research" },
    publisher: {
      "@type": "Organization",
      name: "Scam AI",
      url: "https://scam.ai",
    },
    keywords: paper.tags.join(", "),
    about: paper.category,
  };

  const isArxiv = Boolean(paper.arxivId);

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {!paper.coming && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      <main>
        <section className="mx-auto max-w-3xl px-4 sm:px-8 pb-14 sm:pb-20" style={{ paddingTop: "180px" }}>
          <nav className="mb-8 text-xs text-gray-500 flex items-center gap-2">
            <Link href="/research" className="hover:text-white transition-colors">
              Research
            </Link>
            <span>/</span>
            <Link href="/research" className="hover:text-white transition-colors">
              Papers
            </Link>
            <span>/</span>
            <span className="text-gray-400 truncate">{paper.category}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {paper.coming && (
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
                Coming Soon
              </span>
            )}
            {paper.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#245FFF]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#245FFF]">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.2] mb-6">
            {paper.title}
          </h1>

          {paper.coming && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5 sm:p-6 mb-8">
              <p className="text-sm text-amber-200/90 leading-relaxed">
                This paper is currently in preparation by the Scam AI Research team. The arXiv link, authors, and citation will be published here when the paper is released. Sign up for our research updates to be notified.
              </p>
            </div>
          )}

          {paper.authors && (
            <p className="text-sm text-gray-400 leading-relaxed mb-8">{paper.authors}</p>
          )}

          {paper.abstract && (
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Abstract</h2>
              <p className="text-base text-gray-300 leading-relaxed">{paper.abstract}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-12">
            {paper.link && (
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1d4acc]"
              >
                Read on {isArxiv ? "arXiv" : "Google Scholar"}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          {paper.citation && (
            <div className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-6 mb-8">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">How to cite</h2>
              <pre className="text-[11px] sm:text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words overflow-x-auto">
                {paper.citation}
              </pre>
            </div>
          )}

          {datasets.length > 0 && (
            <div className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-6 mb-8">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Associated datasets</h2>
              <div className="space-y-3">
                {datasets.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-800/60 bg-white/[0.02] p-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/research/datasets/${d.id}`}
                        className="text-sm font-semibold text-white hover:text-[#245FFF] transition-colors"
                      >
                        {d.name}
                      </Link>
                      {d.description && (
                        <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">{d.description}</p>
                      )}
                    </div>
                    <DatasetAccessButton dataset={d} variant="inline" label="Access" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              More from {paper.category}
            </h2>
            <ul className="space-y-2">
              {researchPapers
                .filter((p) => p.category === paper.category && p.slug !== paper.slug && !p.coming)
                .slice(0, 5)
                .map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/research/papers/${p.slug}`}
                      className="text-sm text-gray-300 hover:text-[#245FFF] transition-colors"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {!paper.coming && paper.category !== "Interview Tech" && (
            <div className="rounded-xl border border-[#245FFF]/20 bg-[#245FFF]/[0.03] p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#245FFF] mb-2">
                Try it in production
              </p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Scam AI's Eva-v1 model applies this research at production scale — 98.2% accuracy, under 4 seconds, 200 free detections per month.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products/ai-detection"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#245FFF] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#1d4acc]"
                >
                  AI Image &amp; Video Detection
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="https://app.scam.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:border-[#245FFF]/40"
                >
                  Start free
                </a>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
