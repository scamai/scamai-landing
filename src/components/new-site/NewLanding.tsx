"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import HeroBackground from "./HeroBackground";
// Direct per-file bento imports (NOT the @/components/bento-v1 barrel) so the
// page chunk only pulls these four bentos' code/CSS, not all 30.
import BentoV1_3 from "@/components/bento-v1/Bento3";
import BentoV1_5 from "@/components/bento-v1/Bento5";
import BentoV1_26 from "@/components/bento-v1/Bento26";
import BentoV1_28 from "@/components/bento-v1/Bento28";
import { Suspense } from "react";
import { trackCTA, trackOutbound } from "@/lib/analytics";
import DeveloperSection from "./DeveloperSection";
import HaloSpotlight from "./HaloSpotlight";
import SectionViewTracker from "@/components/SectionViewTracker";
import TrustedBy from "./TrustedBy";
import StickyCtaBar from "./StickyCtaBar";
import dynamic from "next/dynamic";
import React from "react";

// Live face-swap demo — client-only (WebRTC / getUserMedia), no SSR.
const FaceswapPlayground = dynamic(
  () => import("@/components/playground/FaceswapPlayground"),
  { ssr: false, loading: () => <div className="w-full bg-[#050505] py-8 sm:py-12 lg:py-14" /> }
);

// Error boundary so a FaceswapPlayground crash never kills the whole page.
class PlaygroundErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// Skeleton loader for bento visual components
function BentoSkeleton() {
  return (
    <div className="w-full h-full rounded-xl bg-white/[0.02] border border-gray-800/40 flex items-center justify-center animate-pulse">
      <div className="w-16 h-16 rounded-full bg-white/[0.03]" />
    </div>
  );
}
import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";
import SolutionsSection from "./SolutionsSection";
import { getArticleBySlug } from "@/lib/learn/articles";
import { topLearnArticles } from "@/lib/internal-links";

// Animated Section Component
const HERO_SESSION_KEY = "scamai_hero_seen";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
  skipOnRepeat = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  skipOnRepeat?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Lazy initializer reads sessionStorage safely (guarded for SSR) so there's
  // no second render / flicker from a useEffect-driven state flip.
  const [, setSeen] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(HERO_SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!skipOnRepeat) return;
    try {
      sessionStorage.setItem(HERO_SESSION_KEY, "1");
    } catch {
      /* storage unavailable (private mode / disabled) — non-fatal */
    }
    setSeen(true);
  }, [skipOnRepeat]);

  // Hero blocks (skipOnRepeat) are painted fully visible on the first SSR
  // paint — no opacity:0 gate — so the LCP <h1> is the static server markup
  // and doesn't wait on ~342KB of framer-motion JS to hydrate.
  if (skipOnRepeat) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function NewLanding() {
  const t = useTranslations("landing.home");
  return (
    <main id="main-content" className="bg-black text-white" role="main">
      {/* Hero Section — text takes ~70vh, video peeks below */}
      <section id="home-hero" className="landing-section relative overflow-hidden bg-black" style={{ marginBottom: 0, marginTop: 0 }} aria-label={t("hero.ariaLabel")}>
        <SectionViewTracker name="landing_hero" />
        <HeroBackground className="" />
        <div className="relative z-10 w-full">
          {/* Text area — centered in ~70vh */}
          <div className="flex min-h-[72vh] flex-col items-center justify-center px-5 pb-6 pt-[88px] text-center sm:min-h-[76vh] sm:px-10 sm:pb-8 sm:pt-[128px] lg:px-8">
            <div className="mx-auto flex max-w-4xl flex-col items-center space-y-3 sm:space-y-4 lg:space-y-5">
              <AnimatedSection delay={0.05} skipOnRepeat>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#245FFF]/30 bg-[#245FFF]/10 px-3 py-1 text-[10px] font-semibold text-blue-200 tracking-[0.15em] uppercase sm:text-[11px] sm:tracking-[0.18em]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#245FFF]" />
                  <span className="sm:hidden">{t("hero.badgeShort")}</span>
                  <span className="hidden sm:inline">{t("hero.badge")}</span>
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.1} skipOnRepeat>
                <h1 className="max-w-3xl px-2 text-4xl font-bold leading-[1.1] tracking-tight sm:px-0 sm:text-5xl lg:text-6xl">
                  {t("hero.headline")}
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={0.15} skipOnRepeat>
                <div className="max-w-2xl px-4 text-sm leading-[1.65] text-gray-300 sm:px-0 sm:text-base sm:leading-relaxed lg:text-lg">
                  <p className="text-center">
                    {t.rich("hero.subhead", {
                      em: (c) => <span className="font-semibold text-white">{c}</span>,
                    })}
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2} skipOnRepeat>
                <div className="flex flex-col items-center gap-3 pt-1 sm:pt-3">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href="/halo"
                      className="rainbow-button inline-block"
                      onClick={() => trackCTA("visit_halo", "hero")}
                    >
                      <span className="rainbow-button-inner">
                        {t("hero.visitHalo")}
                      </span>
                    </Link>
                    <a
                      href="#playground"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                      onClick={() => trackCTA("try_faceswap", "hero")}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                      </svg>
                      {t("hero.tryFaceswap")}
                    </a>
                  </div>
                  <a
                    href="https://cal.com/scamai/15min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white"
                    onClick={() => trackCTA("book_demo", "hero")}
                  >
                    {t.rich("hero.bookDemo", {
                      strong: (c) => <span className="font-semibold text-white">{c}</span>,
                    })}
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted-by partner / investor logo marquee */}
      <SectionViewTracker name="landing_trusted_by" />
      <TrustedBy />

      {/* Live "Deepfake is here" face-swap playground */}
      <SectionViewTracker name="landing_playground" />
      <PlaygroundErrorBoundary>
        <FaceswapPlayground />
      </PlaygroundErrorBoundary>

      {/* Halo + Qualcomm partnership spotlight (the defense) */}
      <SectionViewTracker name="landing_halo_spotlight" />
      <HaloSpotlight />

      {/* AI-Powered Security — merged section */}
      <section className="landing-section relative overflow-hidden" aria-label={t("aiSecurity.ariaLabel")} style={{
        backgroundImage: 'url(/session1.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <SectionViewTracker name="landing_ai_security" />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-left flex flex-col justify-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px] lg:mb-6">
                  {t("aiSecurity.eyebrow")}
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.1] lg:mb-8">
                  {t("aiSecurity.headline")}<br />{t("aiSecurity.headlineLine2")} <span className="text-[#245FFF]">{t("aiSecurity.headlineHighlight")}</span>
                </h2>
                <p className="max-w-xl text-base sm:text-lg text-gray-300 leading-relaxed mb-6" data-speakable>
                  {t.rich("aiSecurity.body", {
                    em: (c) => <span className="font-semibold text-white">{c}</span>,
                  })}
                </p>
                <a
                  href="https://app.scam.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#245FFF] transition hover:gap-3"
                  onClick={() => trackCTA("start_detecting", "ai_security")}
                >
                  {t("aiSecurity.cta")}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
              {/* Bento 26 - AI Detection visual */}
              <div className="relative flex items-center justify-center min-h-[280px] sm:min-h-[400px]">
                <div className="w-full max-w-[300px] sm:max-w-[400px] h-[280px] sm:h-[400px] scale-100 sm:scale-[1.2]">
                  <Suspense fallback={<BentoSkeleton />}>
                    <BentoV1_26 />
                  </Suspense>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="section-divider" />

      {/* Solutions Section: Product verticals */}
      <SectionViewTracker name="landing_solutions" />
      <SolutionsSection />

      <div className="section-divider" />

      {/* Features Section: THE PLATFORM + All-in-One + Lightning Fast */}
      <section className="landing-section relative overflow-hidden bg-black" aria-label={t("whyChooseUs.ariaLabel")}>
        <SectionViewTracker name="landing_features" />
        {/* Background image wrapper */}
        <div className="absolute inset-0 w-full h-full" style={{
          backgroundImage: 'url(/session3.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-5 lg:max-w-7xl py-14 sm:py-16 lg:py-20">
          {/* Platform Title - no overlay */}
          <AnimatedSection>
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px] lg:mb-6">
                {t("whyChooseUs.eyebrow")}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                {t("whyChooseUs.headline")} <span className="text-[#245FFF]">{t("whyChooseUs.headlineHighlight")}</span>
              </h2>
            </div>
          </AnimatedSection>

          {/* Feature 1: All-in-One Platform */}
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-16 lg:mb-20">
              <div className="lg:pl-12 flex flex-col justify-center min-h-0 sm:min-h-[350px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  {t("allInOne.eyebrow")}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  {t("allInOne.headline")}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed" data-speakable>
                  {t("allInOne.body")}
                </p>
              </div>
              {/* Bento 3 - All-in-One, right side */}
              <div className="relative flex items-center justify-center min-h-[280px] sm:min-h-[400px]">
                <div className="w-full max-w-[300px] sm:max-w-[400px] h-[280px] sm:h-[400px] scale-100 sm:scale-[1.2]">
                  <Suspense fallback={<BentoSkeleton />}>
                    <BentoV1_3 />
                  </Suspense>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Feature 2: Real-Time Detection */}
          <AnimatedSection delay={0.2}>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              {/* Bento 5 - Lightning Fast, left side */}
              <div className="order-2 lg:order-1 relative flex items-center justify-center min-h-[280px] sm:min-h-[350px]">
                <div className="w-full max-w-[300px] sm:max-w-[400px] h-[280px] sm:h-[400px] scale-100 sm:scale-[1.2]">
                  <Suspense fallback={<BentoSkeleton />}>
                    <BentoV1_5 />
                  </Suspense>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex flex-col justify-center min-h-0 sm:min-h-[400px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  {t("lightningFast.eyebrow")}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  {t("lightningFast.headline")}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed" data-speakable>
                  {t("lightningFast.body")}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="section-divider" />

      {/* Session4: Transparent Pricing & Global Compliance */}
      <section className="landing-section relative overflow-hidden bg-black" aria-label={t("compliance.ariaLabel")}>
        <SectionViewTracker name="landing_pricing" />
        {/* Background image wrapper */}
        <div className="absolute inset-0 w-full h-full" style={{
          backgroundImage: 'url(/session4.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-5 lg:max-w-7xl py-14 sm:py-16 lg:py-20">
          {/* Transparent Pricing */}
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-16 lg:mb-20">
              <div className="lg:pl-12 flex flex-col justify-center min-h-0 sm:min-h-[350px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  {t("pricing.eyebrow")}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  {t("pricing.headline")}
                </h3>
                <p className="text-lg font-semibold text-gray-200 mb-6 sm:text-xl">
                  {t("pricing.freeImages")}
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed" data-speakable>
                  {t("pricing.body")}
                </p>
              </div>
              {/* Bento 28 - Transparent Pricing, right side */}
              <div className="relative flex items-center justify-center min-h-[280px] sm:min-h-[400px]">
                <div className="w-full max-w-[300px] sm:max-w-[400px] h-[280px] sm:h-[400px] scale-100 sm:scale-[1.2]">
                  <Suspense fallback={<BentoSkeleton />}>
                    <BentoV1_28 />
                  </Suspense>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Global Compliance */}
          <AnimatedSection delay={0.2}>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="flex items-center justify-center gap-8 flex-wrap order-2 lg:order-1">
                <img
                  src="/gdpr-badge.png"
                  alt={t("compliance.gdprBadgeAlt")}
                  width={80}
                  height={80}
                  className="h-20 w-20 sm:h-32 sm:w-32 object-contain"
                />
                <img
                  src="/soc2-badge.png"
                  alt={t("compliance.soc2BadgeAlt")}
                  width={80}
                  height={80}
                  className="h-20 w-20 sm:h-32 sm:w-32 object-contain"
                />
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  {t("compliance.eyebrow")}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  {t("compliance.headline")}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6" data-speakable>
                  {t.rich("compliance.body", {
                    strong: (c) => <strong className="text-white">{c}</strong>,
                  })}
                </p>
                <a
                  href="https://reality-inc.trust.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#245FFF] hover:text-[#1d4acc] font-semibold transition-colors"
                >
                  {t("compliance.trustCenter")}
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="section-divider" />

      {/* Session5: Developer-First */}
      <DeveloperSection />

      <div className="section-divider" />

      {/* Session6: Pricing */}
      <PricingSection />

      <div className="section-divider" />

      {/* Resources — cross-links to learn, solutions, compare */}
      <section className="landing-section relative overflow-hidden bg-black">
        <SectionViewTracker name="landing_resources" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="text-center mb-10">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-3 sm:text-[10px]">{t("resources.eyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{t("resources.headline")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {topLearnArticles.map((slug) => {
              const article = getArticleBySlug(slug);
              if (!article) return null;
              return (
                <Link
                  key={slug}
                  href={`/learn/${slug}`}
                  className="group rounded-xl border border-gray-800/60 bg-white/[0.02] p-5 hover:border-[#245FFF]/30 hover:bg-[#245FFF]/[0.02] transition-all"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">{article.category}</p>
                  <p className="text-sm font-semibold text-white group-hover:text-[#245FFF] transition-colors leading-snug mb-2">{article.title}</p>
                  <p className="text-xs text-gray-400">{t("resources.readTime", { minutes: article.readTime })}</p>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/learn" className="text-[#245FFF] hover:underline">{t("resources.allGuides")}</Link>
            <Link href="/solutions" className="text-[#245FFF] hover:underline">{t("resources.industrySolutions")}</Link>
            <Link href="/compare" className="text-[#245FFF] hover:underline">{t("resources.compareTools")}</Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Session7: FAQ */}
      <FAQSection />

      {/* Apple-style floating CTA bar — appears after hero, hides at footer newsletter */}
      <StickyCtaBar
        heroId="home-hero"
        hideAtId="newsletter-signup"
        label="scam.ai"
        sublabel={t("stickyCta.sublabel")}
        primary={{ text: t("stickyCta.primary"), href: "/halo", cta: "visit_halo" }}
        secondary={{ text: t("stickyCta.secondary"), href: "#playground", cta: "try_faceswap" }}
        location="home_sticky"
      />
    </main>
  );
}
