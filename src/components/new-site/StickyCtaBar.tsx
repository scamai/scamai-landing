"use client";

/* ------------------------------------------------------------------ */
/* Apple-style floating CTA bar (reusable across pages).               */
/*                                                                     */
/* Show/hide logic (mirrors Apple's product-page sticky bar):          */
/*   - hidden while the hero is on screen                              */
/*   - slides up + fades in once the hero is mostly scrolled past      */
/*     (tunable via `appearAfter` — fires earlier than full exit)      */
/*   - slides back down + fades out when `hideAtId` enters view (the   */
/*     real CTA/section is on screen → the shortcut is redundant)      */
/*                                                                     */
/* Driven by two IntersectionObservers — no scroll math — and respects */
/* prefers-reduced-motion.                                             */
/* ------------------------------------------------------------------ */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { trackCTA } from "@/lib/analytics";

// Apple's standard product-page easing curve.
const APPLE_EASE: [number, number, number, number] = [0.28, 0.11, 0.32, 1];

type Action = { text: string; href: string; cta: string };

interface StickyCtaBarProps {
  /** id of the hero section to watch leaving */
  heroId: string;
  /** id of the section that, once visible, hides the bar */
  hideAtId: string;
  label: string;
  sublabel: string;
  primary: Action;
  secondary?: Action;
  /** analytics location tag */
  location: string;
  /**
   * How early the bar appears. Negative % shrinks the observer root from
   * the top, so the hero counts as "gone" before it fully leaves view.
   * "-40%" ≈ appears once the hero's bottom passes ~40% up the screen.
   */
  appearAfter?: string;
}

/* In-page anchors (#…) scroll; everything else is a locale-aware route. */
function BarLink({
  action,
  location,
  className,
  children,
}: {
  action: Action;
  location: string;
  className: string;
  children: React.ReactNode;
}) {
  const onClick = () => trackCTA(action.cta, location);
  if (action.href.startsWith("#")) {
    return (
      <a href={action.href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={action.href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

export default function StickyCtaBar({
  heroId,
  hideAtId,
  label,
  sublabel,
  primary,
  secondary,
  location,
  appearAfter = "-40%",
}: StickyCtaBarProps) {
  const t = useTranslations("landing.stickyCta");
  const [show, setShow] = useState(false);
  const heroOut = useRef(false);
  const targetIn = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const target = document.getElementById(hideAtId);
    if (!hero || !target) return;

    const update = () => setShow(heroOut.current && !targetIn.current);

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroOut.current = !entry.isIntersecting;
        update();
      },
      { threshold: 0, rootMargin: `${appearAfter} 0px 0px 0px` }
    );
    const targetObs = new IntersectionObserver(
      ([entry]) => {
        targetIn.current = entry.isIntersecting;
        update();
      },
      { threshold: 0.01 }
    );

    heroObs.observe(hero);
    targetObs.observe(target);
    return () => {
      heroObs.disconnect();
      targetObs.disconnect();
    };
  }, [heroId, hideAtId, appearAfter]);

  const hiddenState = reduce ? { opacity: 0 } : { opacity: 0, y: 120 };
  const visibleState = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={hiddenState}
          animate={visibleState}
          exit={hiddenState}
          transition={{ duration: 0.5, ease: APPLE_EASE }}
          className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:bottom-5 sm:px-0 sm:pb-0"
          role="region"
          aria-label={label || t("regionLabel")}
        >
          <div className="flex w-full max-w-md items-center gap-2.5 rounded-2xl border border-white/20 bg-[#1c1d24]/95 px-3 py-2.5 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.9)] ring-1 ring-black/40 backdrop-blur-xl sm:w-auto sm:max-w-none sm:gap-3 sm:rounded-full sm:py-2 sm:pl-5 sm:pr-2">
            {/* Label — desktop only */}
            <div className="hidden min-w-0 flex-col pr-1.5 sm:flex">
              <span className="text-sm font-semibold leading-tight text-white">
                {label}
              </span>
              <span className="truncate text-xs leading-tight text-gray-400">
                {sublabel}
              </span>
            </div>

            {/* Secondary — ghost, desktop only (collapses on mobile) */}
            {secondary && (
              <BarLink
                action={secondary}
                location={location}
                className="hidden shrink-0 items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:bg-white/10 sm:inline-flex"
              >
                {secondary.text}
              </BarLink>
            )}

            {/* Primary — always shown */}
            <BarLink
              action={primary}
              location={location}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-[#245FFF] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4acc] sm:flex-none sm:py-2"
            >
              {primary.text}
            </BarLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
