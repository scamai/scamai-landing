"use client";

import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getArticleBySlug, getRelatedArticles, type ContentBlock } from '@/lib/learn/articles';
import { getIndustryBySlug } from '@/lib/solutions/industries';
import { getCompetitorBySlug } from '@/lib/compare/competitors';
import { learnToSolutionLinks, learnToCompareLinks } from '@/lib/internal-links';

const categoryColors: Record<string, string> = {
  Fundamentals: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Detection: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Developer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Research & Data': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

function Block({ block }: { block: ContentBlock }) {
  if (block.type === 'paragraph') {
    return <p className="text-base sm:text-[17px] text-gray-300 leading-relaxed mb-5">{block.text}</p>;
  }

  if (block.type === 'bullets') {
    return (
      <ul className="mb-5 space-y-2.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-base sm:text-[17px] text-gray-300 leading-relaxed">
            <svg className="w-4 h-4 text-[#245FFF] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'callout') {
    const styles = {
      stat: 'border-[#245FFF]/20 bg-[#245FFF]/[0.04]',
      tip: 'border-emerald-500/20 bg-emerald-500/[0.04]',
      warning: 'border-amber-500/20 bg-amber-500/[0.04]',
    };
    const labelStyles = {
      stat: 'text-[#245FFF]',
      tip: 'text-emerald-400',
      warning: 'text-amber-400',
    };
    const labels = { stat: 'Key Stat', tip: 'Pro Tip', warning: 'Important' };

    return (
      <div className={`rounded-xl border p-5 mb-5 ${styles[block.variant]}`}>
        <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${labelStyles[block.variant]}`}>
          {labels[block.variant]}
        </p>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{block.text}</p>
      </div>
    );
  }

  if (block.type === 'code') {
    return (
      <div className="rounded-xl border border-gray-800/60 bg-[#0a0a0a] mb-5 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800/60">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">{block.language}</span>
        </div>
        <pre className="p-5 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
          {block.content}
        </pre>
      </div>
    );
  }

  return null;
}

function FAQAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-800 overflow-hidden transition-colors duration-300 hover:border-gray-700"
          style={{ background: openIndex === index ? 'rgba(36, 95, 255, 0.03)' : 'rgba(17, 24, 39, 0.3)' }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-5 py-4 flex items-start justify-between text-left transition-colors hover:bg-gray-800/30"
            aria-expanded={openIndex === index}
          >
            <span className="text-sm sm:text-base font-semibold text-white pr-6 leading-relaxed">{faq.question}</span>
            <motion.svg
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-4 text-[#245FFF] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-400 leading-relaxed" data-speakable>{faq.answer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function LearnCrossLinks({ slug }: { slug: string }) {
  const solutionSlugs = learnToSolutionLinks[slug] || [];
  const compareSlug = learnToCompareLinks[slug];
  const solutions = solutionSlugs.map(s => getIndustryBySlug(s)).filter(Boolean);
  const competitor = compareSlug ? getCompetitorBySlug(compareSlug) : null;

  if (solutions.length === 0 && !competitor) return null;

  return (
    <section className="mb-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-4">Explore further</p>
      <div className="space-y-2">
        {solutions.map((sol) => (
          <Link
            key={sol!.slug}
            href={`/solutions/${sol!.slug}`}
            className="group flex items-center justify-between rounded-lg border border-gray-800/50 bg-white/[0.02] px-4 py-3 hover:border-[#245FFF]/30 transition-colors"
          >
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Solution: {sol!.name}</span>
            <svg className="w-4 h-4 text-gray-700 group-hover:text-[#245FFF] flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
        {competitor && (
          <Link
            href={`/compare/${competitor.slug}`}
            className="group flex items-center justify-between rounded-lg border border-gray-800/50 bg-white/[0.02] px-4 py-3 hover:border-[#245FFF]/30 transition-colors"
          >
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Compare: ScamAI vs {competitor.name}</span>
            <svg className="w-4 h-4 text-gray-700 group-hover:text-[#245FFF] flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}

export default function LearnArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.relatedSlugs);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6" style={{ paddingTop: '120px', paddingBottom: '80px' }}>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-600 mb-10">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/learn" className="hover:text-gray-400 transition-colors">Learn</Link>
          <span>/</span>
          <span className="text-gray-500 truncate max-w-[200px]">{article.category}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${categoryColors[article.category] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}
            >
              {article.category}
            </span>
            <span className="text-xs text-gray-600">{article.readTime} min read</span>
            <span className="text-xs text-gray-700">·</span>
            <time className="text-xs text-gray-600" dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-white leading-[1.2] mb-6">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed border-l-2 border-[#245FFF]/40 pl-5" data-speakable>
            {article.intro}
          </p>
        </header>

        {/* Article body */}
        <article className="mb-16">
          {article.sections.map((section, i) => (
            <section key={i} className="mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 leading-snug">
                {section.heading}
              </h2>
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </section>
          ))}
        </article>

        {/* FAQ */}
        <section className="mb-16">
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#245FFF] mb-2">FAQ</p>
            <h2 className="text-2xl font-bold text-white">Frequently asked questions</h2>
          </div>
          <FAQAccordion faqs={article.faqs} />
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-[#245FFF]/20 bg-[#245FFF]/[0.04] p-8 mb-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{article.ctaHeadline}</h2>
          <p className="text-sm text-gray-400 mb-6">{article.ctaSubheadline}</p>
          {article.ctaHref.startsWith('http') ? (
            <a
              href={article.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rainbow-button inline-block"
            >
              <span className="rainbow-button-inner">{article.ctaLabel}</span>
            </a>
          ) : (
            <Link href={article.ctaHref} className="rainbow-button inline-block">
              <span className="rainbow-button-inner">{article.ctaLabel}</span>
            </Link>
          )}
        </section>

        {/* Cross-links to solutions and comparisons */}
        <LearnCrossLinks slug={slug} />

        {/* Related articles */}
        {related.length > 0 && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-5">Related articles</p>
            <div className="space-y-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/learn/${rel.slug}`}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 hover:border-[#245FFF]/30 hover:bg-[#245FFF]/[0.02] transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-[#245FFF] transition-colors leading-snug mb-1">
                      {rel.title}
                    </p>
                    <p className="text-xs text-gray-600">{rel.readTime} min read · {rel.category}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-700 group-hover:text-[#245FFF] transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/learn" className="text-sm text-[#245FFF] hover:underline">
                ← Back to all articles
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
