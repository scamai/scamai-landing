"use client";

import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { getCompetitorBySlug } from '@/lib/compare/competitors';
import { notFound } from 'next/navigation';

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WinIcon() {
  return (
    <svg className="w-4 h-4 text-[#245FFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TieIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );
}

export default function ComparePage() {
  const params = useParams();
  const slug = params.competitor as string;
  const competitor = getCompetitorBySlug(slug);
  if (!competitor) notFound();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section
        className="landing-section relative overflow-hidden bg-black"
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '90px',
          backgroundImage: 'url(/session3.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 w-full max-w-4xl px-8 sm:px-10 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5">
            <AnimatedSection delay={0.2}>
              <p className="text-[10px] font-semibold text-gray-400 tracking-[0.15em] uppercase sm:text-xs">
                COMPARISON
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <h1 className="text-3xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl max-w-3xl px-2 sm:px-0">
                ScamAI vs {competitor.name}
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <p className="max-w-2xl text-sm leading-[1.7] text-gray-300 sm:text-base sm:leading-relaxed lg:text-lg px-4 sm:px-0 text-center" data-speakable>
                {competitor.description}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.5}>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <a href="https://app.scam.ai" target="_blank" rel="noopener noreferrer" className="rainbow-button inline-block">
                  <span className="rainbow-button-inner">Try ScamAI Free</span>
                </a>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-gray-700 rounded-lg hover:border-[#245FFF]/50 transition-colors duration-200"
                >
                  View Pricing
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="landing-section relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px]">
                FEATURE COMPARISON
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-[1.1]">
                ScamAI vs <span className="text-[#245FFF]">{competitor.name}</span>
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="rounded-2xl border border-gray-800/60 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-3 bg-white/[0.03] border-b border-gray-800/60">
                <div className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature</div>
                <div className="px-5 py-4 text-xs font-semibold text-[#245FFF] uppercase tracking-wider text-center border-x border-gray-800/60">
                  ScamAI
                </div>
                <div className="px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
                  {competitor.name}
                </div>
              </div>
              {/* Rows */}
              {competitor.comparison.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 border-b border-gray-800/40 last:border-0 transition-colors ${row.scamaiWins ? 'hover:bg-[#245FFF]/[0.02]' : 'hover:bg-white/[0.01]'}`}
                >
                  <div className="px-5 py-4 text-sm text-gray-400 flex items-center">{row.feature}</div>
                  <div className="px-5 py-4 border-x border-gray-800/40 flex items-center justify-center gap-2">
                    {row.scamaiWins ? <WinIcon /> : <TieIcon />}
                    <span className={`text-sm font-medium ${row.scamaiWins ? 'text-white' : 'text-gray-400'}`}>
                      {row.scamai}
                    </span>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-center">
                    <span className="text-sm text-gray-500">{row.competitor}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why ScamAI advantages */}
      <section
        className="landing-section relative overflow-hidden bg-black"
        style={{
          backgroundImage: 'url(/session4.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 lg:max-w-7xl py-20 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="text-center mb-16 lg:mb-20">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px] lg:mb-6">
                WHY TEAMS CHOOSE SCAMAI
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                The <span className="text-[#245FFF]">ScamAI</span> advantage
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {competitor.advantages.map((adv, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="rounded-2xl border border-gray-800/50 bg-gray-900/40 backdrop-blur-sm p-8 lg:p-10 h-full">
                  <div className="w-8 h-8 rounded-lg bg-[#245FFF]/15 border border-[#245FFF]/25 flex items-center justify-center mb-5">
                    <svg className="w-4 h-4 text-[#245FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{adv.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{adv.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <CompareFAQ faqs={competitor.faqs} competitorName={competitor.name} />

      {/* CTA */}
      <section className="landing-section relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.1]">
                Ready to try the better option?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                <span className="font-semibold text-white">200 free images per month.</span> No credit card required. No annual contract.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://app.scam.ai" target="_blank" rel="noopener noreferrer" className="rainbow-button inline-block">
                  <span className="rainbow-button-inner">Get Started Free</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-gray-700 rounded-lg hover:border-[#245FFF]/50 transition-colors duration-200"
                >
                  Talk to Sales
                </Link>
              </div>
              <p className="mt-8 text-sm text-gray-500">
                See all{' '}
                <Link href="/compare" className="text-[#245FFF] hover:underline">
                  competitor comparisons
                </Link>
                {' '}or view{' '}
                <Link href="/pricing" className="text-[#245FFF] hover:underline">
                  pricing plans
                </Link>
                .
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

function CompareFAQ({ faqs, competitorName }: { faqs: { question: string; answer: string }[]; competitorName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="landing-section relative overflow-hidden bg-black" aria-label="Frequently Asked Questions">
      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
        <div className="text-center mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-[1.1]">
            ScamAI vs {competitorName} — Common Questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-800 overflow-hidden transition-colors duration-300 hover:border-gray-700"
              style={{ background: openIndex === index ? 'rgba(36, 95, 255, 0.03)' : 'rgba(17, 24, 39, 0.3)' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-start justify-between text-left transition-colors hover:bg-gray-800/30"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-white pr-8 leading-relaxed">{faq.question}</span>
                <motion.svg
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 text-[#245FFF] flex-shrink-0 mt-0.5"
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
                    <div className="px-6 pb-5">
                      <p className="text-gray-300 leading-relaxed" data-speakable>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
