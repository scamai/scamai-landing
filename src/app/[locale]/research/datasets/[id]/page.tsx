import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import type { Locale } from "@/lib/seo";
import { locales } from "@/i18n/config";
import {
  getDatasetById,
  getPaperBySlug,
  researchDatasets,
} from "@/lib/research/data";
import { DatasetAccessButton } from "@/components/research/DatasetAccessButton";

type Params = { locale: string; id: string };

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    researchDatasets.map((d) => ({ locale, id: d.id }))
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale: localeParam, id } = await params;
  const locale = localeParam as Locale;
  const dataset = getDatasetById(id);
  if (!dataset) {
    return generatePageMetadata({
      locale,
      path: `/research/datasets/${id}`,
      title: "Dataset not found",
      description: "This research dataset could not be found.",
      noindex: true,
    });
  }

  return generatePageMetadata({
    locale,
    path: `/research/datasets/${dataset.id}`,
    title: `${dataset.name} – Research Dataset`,
    description:
      dataset.description ??
      `${dataset.name} — open research dataset for benchmarking deepfake and synthetic media detection models.`,
    keywords: [
      "research dataset",
      "deepfake dataset",
      "synthetic media benchmark",
      dataset.name,
    ],
  });
}

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: localeParam, id } = await params;
  const locale = localeParam as Locale;
  const dataset = getDatasetById(id);
  if (!dataset) notFound();

  const paper = dataset.paperSlug ? getPaperBySlug(dataset.paperSlug) : undefined;

  const breadcrumbSchema = generateBreadcrumbSchema(locale, [
    { name: "Research", path: "/research" },
    { name: "Datasets", path: "/research" },
    { name: dataset.name },
  ]);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: dataset.name,
    description:
      dataset.description ??
      `${dataset.name} — open research dataset for benchmarking deepfake and synthetic media detection models.`,
    url: `https://scam.ai/${locale}/research/datasets/${dataset.id}`,
    creator: {
      "@type": "Organization",
      name: "Scam AI Research",
      url: "https://scam.ai/research",
    },
    license: "https://scam.ai/research#terms",
    isAccessibleForFree: true,
    distribution: {
      "@type": "DataDownload",
      contentUrl: dataset.link,
      encodingFormat: "application/zip",
    },
    ...(paper?.link
      ? {
          citation: paper.link,
        }
      : {}),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      <main>
        <section className="mx-auto max-w-3xl px-4 sm:px-8 pb-14 sm:pb-20" style={{ paddingTop: "180px" }}>
          <nav className="mb-8 text-xs text-gray-500 flex items-center gap-2">
            <Link href="/research" className="hover:text-white transition-colors">
              Research
            </Link>
            <span>/</span>
            <Link href="/research" className="hover:text-white transition-colors">
              Datasets
            </Link>
            <span>/</span>
            <span className="text-gray-400 truncate">{dataset.name}</span>
          </nav>

          <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-[#245FFF] mb-3">
            Dataset
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6">
            {dataset.name}
          </h1>

          {dataset.description && (
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8">
              {dataset.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-12">
            <DatasetAccessButton dataset={dataset} variant="primary" label="Get Access" />
            {paper && !paper.coming && (
              <Link
                href={`/research/papers/${paper.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-800/60 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#245FFF]/30 hover:bg-[#245FFF]/5"
              >
                View paper
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
            {dataset.paper && !paper && (
              <a
                href={dataset.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-800/60 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#245FFF]/30 hover:bg-[#245FFF]/5"
              >
                View paper
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          <div className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-6 mb-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              How to cite
            </h2>
            <pre className="text-[11px] sm:text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words overflow-x-auto">
              {dataset.citation}
            </pre>
          </div>

          <div className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-6 mb-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Usage terms
            </h2>
            <ul className="text-sm text-gray-400 leading-relaxed space-y-1.5 list-disc pl-5">
              <li>Use solely for non-commercial research purposes.</li>
              <li>Cite the associated publication in any resulting work.</li>
              <li>Do not redistribute the dataset.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Other research datasets
            </h2>
            <ul className="space-y-2">
              {researchDatasets
                .filter((d) => d.id !== dataset.id)
                .slice(0, 6)
                .map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/research/datasets/${d.id}`}
                      className="text-sm text-gray-300 hover:text-[#245FFF] transition-colors"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
