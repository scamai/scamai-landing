"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Shield, CheckCircle, Lock } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stable ids / non-text data — visible copy resolved via t() at render time.
const statIds = [
  { id: "lost", stat: "$65B" },
  { id: "targeted", stat: "1 in 3" },
  { id: "coverage", stat: "100%" },
] as const;

const trustBadgeIds = [
  { id: "privacy", icon: "🔒" },
  { id: "insurance", icon: "🛡️" },
  { id: "protected", icon: "✅" },
] as const;

const stepIds = [
  { id: "removeInfo", step: "01", icon: "🫥" },
  { id: "monitorBreaches", step: "02", icon: "🔍" },
  { id: "watchComms", step: "03", icon: "📡" },
  { id: "coverLoss", step: "04", icon: "🛡️" },
] as const;

const trustBarIds = ["private", "privacyAware", "control"] as const;

const coverageIds = ["romance", "irs", "giftCard", "phishing"] as const;

const insuranceAssuranceIds = ["licensed", "noFight"] as const;

const problemStatIds = [
  { id: "stolen", stat: "$3.4B" },
  { id: "seniors", stat: "1 in 5" },
  { id: "aiCalls", stat: "400%" },
] as const;

const featureIds = [
  { id: "newsletter", icon: "📰" },
  { id: "support", icon: "🤝" },
  { id: "infoRemoval", icon: "🫥" },
] as const;

export default function ScamInsurancePage() {
  const t = useTranslations("scamInsurancePage");
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Announcement bar */}
      <div className="bg-[#245FFF] text-white text-center py-2.5 px-4 text-sm font-medium tracking-wide">
        {t("announcement")}
      </div>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-5 sm:px-10 pt-20 pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden"
        >
          <div className="mt-[-80px] h-[600px] w-[800px] rounded-full bg-[#245FFF]/12 blur-[140px]" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden"
        >
          <div className="mt-[40px] h-[300px] w-[400px] rounded-full bg-[#245FFF]/10 blur-[80px]" />
        </div>

        <AnimatedSection className="relative z-10 flex flex-col items-center">
          <p className="mb-5 text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400">
            {t("hero.eyebrow")}
          </p>

          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6">
            {t.rich("hero.title", {
              highlight: (chunks) => (
                <span className="text-[#245FFF]">{chunks}</span>
              ),
            })}
          </h1>

          <p className="max-w-lg text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
            {t("hero.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {trustBadgeIds.map(({ id, icon }) => (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#93c5fd] border border-[#245FFF]/25 bg-[#245FFF]/10 px-3 py-1.5 rounded-full"
              >
                {icon} {t(`hero.trustBadges.${id}`)}
              </span>
            ))}
          </div>

          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-6 shadow-[0_0_60px_rgba(36,95,255,0.1)]">
            <WaitlistForm />
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span>{t("hero.assurance")}</span>
          </div>
        </AnimatedSection>
      </section>

      {/* Stats */}
      <AnimatedSection>
        <section className="border-y border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-10 py-10 flex flex-wrap justify-center gap-10 text-center">
            {statIds.map(({ id, stat }) => (
              <div key={id} className="min-w-[150px]">
                <p className="text-3xl font-bold tracking-tight text-[#245FFF]">
                  {stat}
                </p>
                <p className="text-sm text-gray-400 mt-1.5">{t(`stats.${id}`)}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-5 sm:px-10 py-14 sm:py-24">
        <AnimatedSection className="text-center mb-16">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400 mb-4">
            {t("howItWorks.eyebrow")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            {t("howItWorks.title")}
          </h2>
          <p className="text-gray-300 text-base max-w-md mx-auto leading-relaxed">
            {t("howItWorks.description")}
          </p>
        </AnimatedSection>

        <div className="flex flex-col gap-4">
          {stepIds.map((item, i) => (
            <AnimatedSection key={item.step} delay={i * 0.1}>
              <div className="relative flex gap-5 md:gap-8">
                {i < 3 && (
                  <div className="absolute left-[22px] top-[52px] bottom-[-20px] w-px bg-gradient-to-b from-[#245FFF]/40 to-transparent" />
                )}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-[#245FFF]/15 border border-[#245FFF]/30 flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 mb-4 hover:border-[#245FFF]/30 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white">
                      {t(`howItWorks.steps.${item.id}.title`)}
                    </h3>
                    <span className="shrink-0 text-xs font-semibold text-[#245FFF] border border-[#245FFF]/25 bg-[#245FFF]/10 px-2.5 py-1 rounded-full">
                      {t(`howItWorks.steps.${item.id}.tag`)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {t(`howItWorks.steps.${item.id}.desc`)}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Privacy trust bar */}
        <AnimatedSection delay={0.2}>
          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {trustBarIds.map((id, i) => (
              <span key={id} className="text-xs text-gray-400">
                {["🔒", "🛡️", "👁️"][i]} {t(`howItWorks.trustBar.${id}`)}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Insurance — hero-weight centerpiece */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#245FFF]/20 via-[#245FFF]/10 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[700px] w-[700px] rounded-full bg-[#245FFF]/20 blur-[140px]" />
        </div>
        <div className="absolute inset-0 border-y border-[#245FFF]/20" />

        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-10 py-14 sm:py-28 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#245FFF]/20 border-2 border-[#245FFF]/50 mb-8 shadow-[0_0_40px_rgba(36,95,255,0.4)]">
              <Shield className="w-10 h-10 text-[#245FFF]" />
            </div>

            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#93c5fd] mb-5">
              {t("insurance.eyebrow")}
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
              {t.rich("insurance.title", {
                highlight: (chunks) => (
                  <span className="text-[#93c5fd]">{chunks}</span>
                ),
              })}
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed mb-4 max-w-xl mx-auto">
              {t("insurance.description")}
            </p>
            <p className="text-base text-gray-400 mb-12 max-w-lg mx-auto">
              {t("insurance.pride")}
            </p>
          </AnimatedSection>

          {/* Coverage cards */}
          <AnimatedSection delay={0.15}>
            <div className="grid sm:grid-cols-2 gap-3 text-left mb-10">
              {coverageIds.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between gap-3 bg-[#245FFF]/10 border border-[#245FFF]/25 rounded-xl px-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#93c5fd] shrink-0" />
                    <span className="text-sm text-white">{t(`insurance.coverage.${id}`)}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#93c5fd] shrink-0">
                    {t("insurance.coveredLabel")}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {insuranceAssuranceIds.map((id) => (
                <span key={id} className="text-sm text-[#93c5fd] font-medium">
                  ✅ {t(`insurance.assurances.${id}`)}
                </span>
              ))}
            </div>

            <p className="text-xs text-gray-500 leading-relaxed max-w-xl mx-auto">
              {t("insurance.footnote")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Fear / The Problem */}
      <section className="max-w-5xl mx-auto px-5 sm:px-10 py-14 sm:py-24">
        <AnimatedSection className="text-center mb-14">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400 mb-4">
            {t("problem.eyebrow")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-5">
            {t.rich("problem.title", {
              br: () => <br className="hidden md:block" />,
            })}
          </h2>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            {t("problem.description")}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {problemStatIds.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
              >
                <p className="text-4xl font-bold tracking-tight text-[#245FFF] mb-2">
                  {item.stat}
                </p>
                <p className="text-sm font-semibold text-white mb-1">
                  {t(`problem.stats.${item.id}.label`)}
                </p>
                <p className="text-xs text-gray-400">{t(`problem.stats.${item.id}.sub`)}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="bg-[#245FFF]/[0.08] border border-[#245FFF]/20 rounded-xl px-6 py-5 text-center">
            <p className="text-base text-gray-300 leading-relaxed">
              {t.rich("problem.callout", {
                strong: (chunks) => (
                  <strong className="text-white">{chunks}</strong>
                ),
              })}
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Full Protection — 3 pillars */}
      <section className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-14 sm:py-24">
          <AnimatedSection className="text-center mb-14">
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400 mb-4">
              {t("protection.eyebrow")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              {t("protection.title")}
            </h2>
            <p className="text-gray-300 text-base max-w-lg mx-auto leading-relaxed">
              {t("protection.description")}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-4">
            {featureIds.map((f, i) => (
              <AnimatedSection key={f.id} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-7 hover:border-[#245FFF]/30 transition-colors h-full">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {t(`protection.features.${f.id}.title`)}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {t(`protection.features.${f.id}.desc`)}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative border-t border-white/10 px-5 sm:px-10 py-14 sm:py-24 text-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <div className="h-[400px] w-[500px] rounded-full bg-[#245FFF]/10 blur-[120px]" />
        </div>
        <AnimatedSection className="relative z-10 max-w-md mx-auto">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400 mb-4">
            {t("finalCta.eyebrow")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            {t("finalCta.title")}
          </h2>
          <p className="text-gray-300 text-base mb-7 leading-relaxed">
            {t("finalCta.description")}
          </p>

          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold text-[#93c5fd] border border-[#245FFF]/25 bg-[#245FFF]/10 px-3 py-1 rounded-full whitespace-nowrap">
              🎁 {t("finalCta.badge")}
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-[0_0_60px_rgba(36,95,255,0.08)]">
            <WaitlistForm />
          </div>
          <p className="mt-3 text-xs text-gray-500">
            {t("finalCta.footnote")}
          </p>
        </AnimatedSection>
      </section>

      {/* Disclaimers */}
      <section className="border-t border-white/10 py-12 px-5 sm:px-10">
        <div className="max-w-3xl mx-auto space-y-4 text-xs text-gray-500 leading-relaxed">
          {(["insurance", "statistics", "waitlist", "offer", "app"] as const).map((id) => (
            <p key={id}>
              {t.rich(`disclaimers.${id}`, {
                label: (chunks) => (
                  <span className="text-gray-400">{chunks}</span>
                ),
              })}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
