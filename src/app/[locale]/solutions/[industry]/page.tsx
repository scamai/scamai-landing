"use client";

import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { getIndustryBySlug } from '@/lib/solutions/industries';
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

const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function IndustryPage() {
  const params = useParams();
  const slug = params.industry as string;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section
        className="landing-section relative overflow-hidden bg-black"
        style={{
          minHeight: '100vh',
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full max-w-4xl px-8 sm:px-10 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 lg:space-y-6">
            <AnimatedSection delay={0.2}>
              <p className="text-[10px] font-semibold text-gray-400 tracking-[0.15em] uppercase sm:text-xs">
                {industry.eyebrow}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <h1 className="text-3xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl max-w-3xl px-2 sm:px-0">
                {industry.headline}
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <p className="max-w-2xl text-sm leading-[1.7] text-gray-300 sm:text-base sm:leading-relaxed lg:text-lg px-4 sm:px-0 text-center" data-speakable>
                {industry.subheadline}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.45}>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#245FFF]/30 bg-[#245FFF]/5 px-5 py-2.5">
                <span className="text-2xl font-bold text-[#245FFF]">{industry.stat.value}</span>
                <span className="text-sm text-gray-400 max-w-[240px] text-left leading-snug">{industry.stat.label}</span>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.5}>
              <div className="pt-2">
                <a href="https://app.scam.ai" target="_blank" rel="noopener noreferrer" className="rainbow-button inline-block">
                  <span className="rainbow-button-inner">Start Free</span>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="landing-section relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 lg:max-w-7xl py-20 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="text-center mb-16 lg:mb-20">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px] lg:mb-6">
                KEY CAPABILITIES
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                Powered by <span className="text-[#245FFF]">Eva-v1</span>
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {industry.capabilities.map((cap, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="rounded-2xl border border-gray-800/60 bg-white/[0.02] p-8 h-full">
                  <div className="w-10 h-10 rounded-xl bg-[#245FFF]/10 border border-[#245FFF]/20 flex items-center justify-center mb-5">
                    <svg className="w-5 h-5 text-[#245FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{cap.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{cap.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Stats row */}
          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-3 gap-6 mt-14 rounded-2xl border border-gray-800/60 bg-white/[0.02] p-8">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">95.3%</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Image accuracy</p>
              </div>
              <div className="text-center border-x border-gray-800/60">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">&lt;4s</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Processing time</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">200</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Free/month</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Use Cases */}
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
                REAL-WORLD APPLICATIONS
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                Built for <span className="text-[#245FFF]">{industry.name}</span>
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {industry.useCases.map((uc, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="rounded-2xl border border-gray-800/50 bg-gray-900/40 backdrop-blur-sm p-8 lg:p-10 h-full">
                  <h3 className="mb-4 text-xl sm:text-2xl font-bold text-white">{uc.title}</h3>
                  <p className="mb-6 text-base text-gray-300 leading-relaxed">{uc.description}</p>
                  <ul className="space-y-3 text-gray-300">
                    {uc.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start text-base">
                        <CheckIcon />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <IndustryFAQ faqs={industry.faqs} industryName={industry.name} />

      {/* CTA */}
      <section className="landing-section relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.1]">
                {industry.ctaHeadline}
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {industry.ctaSubheadline}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://app.scam.ai" target="_blank" rel="noopener noreferrer" className="rainbow-button inline-block">
                  <span className="rainbow-button-inner">Get Started Free</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-gray-700 rounded-lg hover:border-[#245FFF]/50 transition-colors duration-200"
                >
                  Contact Sales
                </Link>
              </div>
              <p className="mt-8 text-sm text-gray-500">
                View all{' '}
                <Link href="/solutions" className="text-[#245FFF] hover:underline">
                  industry solutions
                </Link>
                {' '}or explore{' '}
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

function IndustryFAQ({ faqs, industryName }: { faqs: { question: string; answer: string }[]; industryName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="landing-section relative overflow-hidden bg-black" aria-label="Frequently Asked Questions">
      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
        <div className="text-center mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-[1.1]">
            {industryName} Questions
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
