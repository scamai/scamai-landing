"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { trackCTA } from "@/lib/analytics";

function AnimatedCard({
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────
const icons: Record<string, ReactNode> = {
  // The two detection classes
  deepfake: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M2 2l20 20" />
    </svg>
  ),
  genai: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  // The modality products
  visual: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  voice: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  identity: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="8" cy="11" r="2.5" />
      <path d="M14 10h4" />
      <path d="M14 14h4" />
    </svg>
  ),
  halo: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  ),
};

// Modality products (the "Across every medium" shelf). Halo is the on-device
// deployment, highlighted. Routes point at existing pages; identity → KYC for now.
const products: { id: string; href: string; highlight?: boolean; badge?: boolean }[] = [
  { id: "visual", href: "/products/ai-detection" },
  { id: "voice", href: "/products/audio-detection" },
  { id: "identity", href: "/solutions/kyc" },
  { id: "halo", href: "/halo", highlight: true, badge: true },
];

// Industry entry points (link into the Solutions section, not a detection type).
const industries = ["fintech", "call-centers", "hr", "media", "insurance", "government", "kyc", "dating"];

function ProductCard({ id, href, highlight, badge, delay }: (typeof products)[number] & { delay: number }) {
  const t = useTranslations("landing.solutions");
  return (
    <AnimatedCard delay={delay}>
      <Link
        href={href}
        onClick={() => trackCTA(`product_${id}`, "detect_products")}
        className={`group relative flex h-full flex-col rounded-xl sm:rounded-2xl border p-4 sm:p-5 transition-[background-color,border-color] duration-300 ${
          highlight
            ? "border-[#245FFF]/40 bg-[#245FFF]/[0.06] hover:border-[#245FFF]/70 hover:bg-[#245FFF]/[0.10]"
            : "border-gray-800/60 bg-white/[0.02] hover:border-[#245FFF]/30 hover:bg-white/[0.04]"
        }`}
      >
        {badge && (
          <span className="absolute right-3 top-3 rounded-full bg-[#245FFF] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
            {t(`products.${id}.badge`)}
          </span>
        )}
        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#245FFF]/10 text-[#245FFF] sm:h-10 sm:w-10">
          {icons[id]}
        </div>
        <div className="mb-1.5 flex items-center gap-2">
          <h4 className="text-sm font-semibold leading-tight text-white sm:text-base">{t(`products.${id}.title`)}</h4>
          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400">
            {t(`products.${id}.coverage`)}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">{t(`products.${id}.description`)}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#245FFF]">
          {t("learnMore")}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </span>
      </Link>
    </AnimatedCard>
  );
}

export default function SolutionsSection() {
  const t = useTranslations("landing.solutions");
  return (
    <section
      className="landing-section relative overflow-hidden bg-black"
      aria-label="What Scam AI detects"
      id="solutions"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 sm:py-20 lg:max-w-7xl lg:py-28">
        {/* Section header */}
        <AnimatedCard>
          <div className="mb-8 text-center sm:mb-10 lg:mb-12">
            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#245FFF] sm:text-[10px] lg:mb-4">
              {t("eyebrow")}
            </p>
            <h2 className="mb-3 px-2 text-2xl font-bold leading-[1.15] text-white sm:mb-4 sm:px-0 sm:text-4xl lg:mb-5 lg:text-5xl">
              {t.rich("heading", {
                br: () => <br className="hidden sm:block" />,
                highlight: (chunks) => <span className="text-[#245FFF]">{chunks}</span>,
              })}
            </h2>
            <p className="mx-auto max-w-2xl px-2 text-sm leading-relaxed text-gray-400 sm:px-0 sm:text-base">
              {t("subheading")}
            </p>
          </div>
        </AnimatedCard>

        {/* The two detection classes — deepfake (manipulated) vs GenAI (synthetic) */}
        <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-4 sm:mb-16 sm:grid-cols-2 sm:gap-5">
          {(["deepfake", "genai"] as const).map((c, i) => (
            <AnimatedCard key={c} delay={0.1 * (i + 1)}>
              <div className="h-full rounded-2xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#245FFF]/10 text-[#245FFF]">
                  {icons[c]}
                </div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF]">
                  {t(`classes.${c}.tag`)}
                </p>
                <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">{t(`classes.${c}.title`)}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{t(`classes.${c}.description`)}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Across every medium — modality products */}
        <AnimatedCard>
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 sm:mb-8">
            {t("mediumsHeading")}
          </p>
        </AnimatedCard>
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} {...p} delay={0.08 * (i + 1)} />
          ))}
        </div>

        {/* Built for your industry — entry points into Solutions (not detection types) */}
        <AnimatedCard delay={0.2}>
          <div className="mt-12 border-t border-gray-800/60 pt-10 text-center sm:mt-16">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              {t("byIndustry.heading")}
            </p>
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {industries.map((slug) => (
                <Link
                  key={slug}
                  href={`/solutions/${slug}`}
                  onClick={() => trackCTA(`industry_${slug}`, "detect_industries")}
                  className="rounded-full border border-gray-800/70 bg-white/[0.02] px-3.5 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-[#245FFF]/40 hover:bg-[#245FFF]/[0.06] hover:text-white sm:text-sm"
                >
                  {t(`industries.${slug}`)}
                </Link>
              ))}
              <Link
                href="/solutions"
                onClick={() => trackCTA("view_all", "detect_industries")}
                className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#245FFF] transition-colors hover:text-[#1d4acc] sm:text-sm"
              >
                {t("byIndustry.viewAll")}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </AnimatedCard>

        {/* CTA */}
        <AnimatedCard delay={0.3}>
          <div className="mt-10 text-center lg:mt-12">
            <a
              href="https://cal.com/scamai/15min?overlayCalendar=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1d4acc] hover:shadow-[0_0_24px_-4px_rgba(36,95,255,0.5)]"
              onClick={() => trackCTA("talk_to_sales", "solutions")}
            >
              {t("talkToSales")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
