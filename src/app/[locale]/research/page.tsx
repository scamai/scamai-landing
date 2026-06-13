"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DatasetAccessButton } from "@/components/research/DatasetAccessButton";
import {
  researchCategoryOrder,
  researchDatasets,
  researchPapers,
  getPaperBySlug,
} from "@/lib/research/data";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { key: "papers", value: `${researchPapers.length}` },
  { key: "areas", value: `${researchCategoryOrder.length}` },
  { key: "datasets", value: `${researchDatasets.length}` },
  { key: "comingSoon", value: `${researchPapers.filter((p) => p.coming).length}` },
];

export default function ResearchPage() {
  const t = useTranslations("researchPage");

  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 pb-14 sm:pb-20" style={{ paddingTop: "180px" }}>
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#245FFF] mb-3 sm:text-[10px] lg:mb-4">
                {t("hero.eyebrow")}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-4 lg:mb-6">
                {t.rich("hero.title", {
                  accent: (chunks) => <span className="text-[#245FFF]">{chunks}</span>,
                })}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl">
                {t("hero.description")}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 lg:mt-14">
              {stats.map((stat) => (
                <div key={stat.key} className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-4 sm:p-5">
                  <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{t(`stats.${stat.key}`)}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        <div className="section-divider" />

        {/* Papers */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-20">
          <AnimatedSection>
            <div className="mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                {t("papers.heading")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("papers.description")}
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-6">
            {researchCategoryOrder.map((cat, catIndex) => (
              <AnimatedSection key={cat.category} delay={0.08 * (catIndex + 1)}>
                <div className="rounded-xl sm:rounded-2xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {cat.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#245FFF]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#245FFF]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">{cat.category}</h3>

                  <ul className="space-y-4">
                    {cat.paperSlugs.map((slug) => {
                      const paper = getPaperBySlug(slug);
                      if (!paper) return null;
                      return (
                        <li key={paper.slug} className="flex items-start gap-3 group">
                          <svg className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            {paper.coming ? (
                              <Link
                                href={`/research/papers/${paper.slug}`}
                                className="text-sm leading-snug text-gray-500 italic hover:text-gray-300 transition-colors"
                              >
                                <span className="inline-block rounded bg-white/5 border border-gray-800/60 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 not-italic mr-2">
                                  {t("papers.comingBadge")}
                                </span>
                                {paper.title}
                              </Link>
                            ) : (
                              <>
                                <Link
                                  href={`/research/papers/${paper.slug}`}
                                  className="text-sm leading-snug text-gray-300 hover:text-[#245FFF] transition-colors"
                                >
                                  {paper.title}
                                </Link>
                                {paper.authors && (
                                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{paper.authors}</p>
                                )}
                                {paper.link && (
                                  <a
                                    href={paper.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium text-gray-500 hover:text-[#245FFF] transition-colors"
                                  >
                                    {t("papers.viewOn", { source: paper.arxivId ? "arXiv" : "Scholar" })}
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* Datasets */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-20">
          <AnimatedSection>
            <div className="mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{t("datasets.heading")}</h2>
              <p className="text-sm text-gray-500 max-w-xl">
                {t("datasets.description")}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {researchDatasets.map((dataset, index) => (
              <AnimatedSection key={dataset.id} delay={0.08 * (index + 1)}>
                <div className="group flex flex-col h-full rounded-xl sm:rounded-2xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-6 transition-all duration-300 hover:border-[#245FFF]/20 hover:bg-white/[0.04]">
                  <div className="flex items-start gap-3 flex-1">
                    <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/research/datasets/${dataset.id}`}
                        className="text-sm font-semibold text-white group-hover:text-[#245FFF] transition-colors"
                      >
                        {dataset.name}
                      </Link>
                      {dataset.description && (
                        <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-3">
                          {dataset.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <DatasetAccessButton dataset={dataset} variant="card" label={t("datasets.getAccess")} />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-20">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{t("cta.heading")}</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                {t("cta.description")}
              </p>
              <a
                href="https://cal.com/scamai/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1d4acc]"
              >
                {t("cta.button")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </AnimatedSection>
        </section>
      </main>
    </div>
  );
}
