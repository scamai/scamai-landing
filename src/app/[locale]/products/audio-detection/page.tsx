"use client";

import { Bento46, Bento53 } from "@/components/bento";
import { BentoV1_18, BentoV1_20 } from "@/components/bento-v1";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, Suspense } from "react";
import { useTranslations } from "next-intl";
import { getIndustryBySlug } from "@/lib/solutions/industries";
import { getArticleBySlug } from "@/lib/learn/articles";
import { audioDetectionSolutionLinks, audioDetectionLearnLinks, audioDetectionCompareLink } from "@/lib/internal-links";

function BentoSkeleton() {
  return (
    <div className="w-full h-full rounded-xl bg-white/[0.02] border border-gray-800/40 flex items-center justify-center animate-pulse">
      <div className="w-16 h-16 rounded-full bg-white/[0.03]" />
    </div>
  );
}
import { Link } from "@/i18n/navigation";

// Animated Section Component
function AnimatedSection({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AudioDetectionPage() {
  const t = useTranslations("audioDetectionPage");
  const tSol = useTranslations("solutionsContent");
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="landing-section relative overflow-hidden bg-black" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: '90px',
        backgroundImage: 'url(/audio.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 w-full max-w-4xl px-8 sm:px-10 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 lg:space-y-6">
            <AnimatedSection delay={0.2}>
              <p className="text-[10px] font-semibold text-gray-400 tracking-[0.15em] uppercase sm:text-xs">
                {t("hero.eyebrow")}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <h1 className="text-3xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl max-w-3xl px-2 sm:px-0">
                {t("hero.title")}
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="max-w-2xl text-sm leading-[1.7] text-gray-300 sm:text-base sm:leading-relaxed lg:text-lg px-4 sm:px-0" data-speakable>
                <p className="text-center">
                  {t.rich("hero.description", {
                    em: (c) => <span className="font-semibold text-white">{c}</span>,
                  })}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <div className="pt-4 sm:pt-3">
                <a
                  href="mailto:sales@scam.ai"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#245FFF] rounded-lg hover:bg-[#1d4acc] transition-colors duration-200"
                >
                  {t("hero.cta")}
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-section relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 lg:max-w-7xl py-20 sm:py-24 lg:py-32">
          {/* Section Title */}
          <AnimatedSection>
            <div className="text-center mb-16 lg:mb-20">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px] lg:mb-6">
                {t("features.eyebrow")}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                {t.rich("features.title", {
                  accent: (c) => <span className="text-[#245FFF]">{c}</span>,
                })}
              </h2>
            </div>
          </AnimatedSection>

          {/* Feature 1: Voice Cloning Detection - Bento on Right */}
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 lg:mb-28">
              <div className="lg:pl-12 flex flex-col justify-center" style={{ minHeight: '400px' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  {t("features.voiceCloning.eyebrow")}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  {t("features.voiceCloning.title")}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4" data-speakable>
                  {t.rich("features.voiceCloning.body1", {
                    em: (c) => <span className="font-semibold text-white">{c}</span>,
                  })}
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  {t.rich("features.voiceCloning.body2", {
                    em: (c) => <span className="font-semibold text-white">{c}</span>,
                  })}
                </p>
              </div>
              <div className="relative flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="w-full max-w-[400px]" style={{ height: '400px', transform: 'scale(1.2)' }}>
                  <Suspense fallback={<BentoSkeleton />}><Bento46 /></Suspense>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Feature 2: Synthetic Speech - Bento on Left */}
          <AnimatedSection delay={0.2}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 lg:mb-28">
              <div className="order-2 lg:order-1 relative flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="w-full max-w-[400px]" style={{ height: '400px', transform: 'scale(1.2)' }}>
                  <Suspense fallback={<BentoSkeleton />}><BentoV1_20 /></Suspense>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex flex-col justify-center" style={{ minHeight: '400px' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  {t("features.tts.eyebrow")}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  {t("features.tts.title")}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
                  {t.rich("features.tts.body1", {
                    em: (c) => <span className="font-semibold text-white">{c}</span>,
                  })}
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  {t.rich("features.tts.body2", {
                    em: (c) => <span className="font-semibold text-white">{c}</span>,
                  })}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Feature 3: Audio Manipulation - Bento on Right */}
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 lg:mb-28">
              <div className="lg:pl-12 flex flex-col justify-center" style={{ minHeight: '400px' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  {t("features.manipulation.eyebrow")}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  {t("features.manipulation.title")}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  {t("features.manipulation.body")}
                </p>
              </div>
              <div className="relative flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="w-full max-w-[400px]" style={{ height: '400px', transform: 'scale(1.2)' }}>
                  <Suspense fallback={<BentoSkeleton />}><Bento53 /></Suspense>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Feature 4: Integration - Bento on Left */}
          <AnimatedSection delay={0.2}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 relative flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="w-full max-w-[400px]" style={{ height: '400px', transform: 'scale(1.2)' }}>
                  <Suspense fallback={<BentoSkeleton />}><BentoV1_18 /></Suspense>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex flex-col justify-center" style={{ minHeight: '400px' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  {t("features.integration.eyebrow")}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  {t("features.integration.title")}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  {t("features.integration.body")}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="landing-section relative overflow-hidden bg-black" style={{
        backgroundImage: 'url(/session4.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 lg:max-w-7xl py-20 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="text-center mb-16 lg:mb-20">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px] lg:mb-6">
                {t("useCases.eyebrow")}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                {t.rich("useCases.title", {
                  accent: (c) => <span className="text-[#245FFF]">{c}</span>,
                })}
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {useCaseCards.map(({ id, delay }) => (
              <AnimatedSection key={id} delay={delay}>
                <div className="rounded-2xl border border-gray-800/50 bg-gray-900/40 backdrop-blur-sm p-8 lg:p-10 h-full">
                  <h3 className="mb-4 text-2xl sm:text-3xl font-bold text-white">{t(`useCases.cards.${id}.title`)}</h3>
                  <p className="mb-6 text-base sm:text-lg text-gray-300 leading-relaxed">
                    {t(`useCases.cards.${id}.description`)}
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    {[0, 1, 2].map((i) => (
                      <li key={i} className="flex items-start text-base sm:text-lg">
                        <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{t(`useCases.cards.${id}.bullets.${i}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <AudioFAQAccordion />

      {/* CTA Section */}
      <section className="landing-section relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.1]">
                {t("cta.title")}
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {t.rich("cta.subtitle", {
                  em: (c) => <span className="font-semibold text-white">{c}</span>,
                })}
              </p>
              <a
                href="mailto:sales@scam.ai"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#245FFF] rounded-lg hover:bg-[#1d4acc] transition-colors duration-200"
              >
                {t("cta.button")}
              </a>
              <p className="mt-6 text-sm text-gray-400">
                {t.rich("cta.crossLink", {
                  link: (c) => (
                    <Link href="/products/ai-detection" className="text-[#245FFF] hover:underline">
                      {c}
                    </Link>
                  ),
                })}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {t.rich("cta.pricingLink", {
                  link: (c) => (
                    <Link href="/pricing" className="text-[#245FFF] hover:underline">
                      {c}
                    </Link>
                  ),
                })}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {t.rich("cta.research", {
                  link1: (c) => (
                    <Link href="/research/papers/deepfake-detectors-in-reality" className="text-gray-400 hover:text-[#245FFF] transition-colors">
                      {c}
                    </Link>
                  ),
                  link2: (c) => (
                    <Link href="/research/papers/open-source-ai-detection-benchmark" className="text-gray-400 hover:text-[#245FFF] transition-colors">
                      {c}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="mt-14 mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-4 text-center">{t("relatedLinks.heading")}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {audioDetectionSolutionLinks.map((slug) => {
                  const sol = getIndustryBySlug(slug);
                  if (!sol) return null;
                  return (
                    <Link key={slug} href={`/solutions/${slug}`} className="group rounded-lg border border-gray-800/50 bg-white/[0.02] px-4 py-3 hover:border-[#245FFF]/30 transition-colors flex items-center justify-between">
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{tSol(`${slug}.name`)}</span>
                      <svg className="w-4 h-4 text-gray-700 group-hover:text-[#245FFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  );
                })}
                {audioDetectionLearnLinks.map((slug) => {
                  const article = getArticleBySlug(slug);
                  if (!article) return null;
                  return (
                    <Link key={slug} href={`/learn/${slug}`} className="group rounded-lg border border-gray-800/50 bg-white/[0.02] px-4 py-3 hover:border-[#245FFF]/30 transition-colors flex items-center justify-between">
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{article.title}</span>
                      <svg className="w-4 h-4 text-gray-700 group-hover:text-[#245FFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  );
                })}
                <Link href={`/compare/${audioDetectionCompareLink}`} className="group rounded-lg border border-gray-800/50 bg-white/[0.02] px-4 py-3 hover:border-[#245FFF]/30 transition-colors flex items-center justify-between">
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{t("relatedLinks.compare")}</span>
                  <svg className="w-4 h-4 text-gray-700 group-hover:text-[#245FFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

const useCaseCards = [
  { id: "callCenters", delay: 0.1 },
  { id: "banking", delay: 0.2 },
  { id: "media", delay: 0.3 },
  { id: "legal", delay: 0.4 },
] as const;

const audioFaqKeys = [
  "accuracy",
  "types",
  "formats",
  "vishing",
  "whatIs",
  "realtime",
] as const;

function AudioFAQAccordion() {
  const t = useTranslations("audioDetectionPage");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="landing-section relative overflow-hidden bg-black" aria-label={t("faq.ariaLabel")}>
      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
        <div className="text-center mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs">{t("faq.eyebrow")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-[1.1]">
            {t("faq.title")}
          </h2>
        </div>
        <div className="space-y-4">
          {audioFaqKeys.map((key, index) => (
            <div
              key={key}
              className="rounded-2xl border border-gray-800 overflow-hidden transition-colors duration-300 hover:border-gray-700"
              style={{ background: openIndex === index ? "rgba(36, 95, 255, 0.03)" : "rgba(17, 24, 39, 0.3)" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-start justify-between text-left transition-colors hover:bg-gray-800/30"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-white pr-8 leading-relaxed">{t(`faq.items.${key}.question`)}</span>
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
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-gray-300 leading-relaxed" data-speakable>{t(`faq.items.${key}.answer`)}</p>
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
