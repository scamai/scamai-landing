"use client";

/* ------------------------------------------------------------------ */
/* Apple-style floating CTA bar for the Halo page.                     */
/*                                                                     */
/* Show/hide logic (mirrors Apple's product-page sticky bar):          */
/*   - hidden while the hero is on screen (no redundant CTA on top of  */
/*     the hero's own buttons)                                         */
/*   - slides up + fades in once the hero scrolls out of view          */
/*   - slides back down + fades out when the final #waitlist section   */
/*     enters view (the real form is on screen → shortcut is redundant)*/
/*                                                                     */
/* Driven by two IntersectionObservers (#halo-hero, #waitlist) — no    */
/* scroll-event math, so it stays smooth.                              */
/* ------------------------------------------------------------------ */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { trackCTA } from "@/lib/analytics";

// Apple's standard product-page easing curve.
const APPLE_EASE: [number, number, number, number] = [0.28, 0.11, 0.32, 1];

export default function HaloStickyBar() {
  const [show, setShow] = useState(false);
  const heroOut = useRef(false); // hero scrolled out of view
  const ctaIn = useRef(false); // final waitlist section in view
  const reduce = useReducedMotion();

  useEffect(() => {
    const hero = document.getElementById("halo-hero");
    const cta = document.getElementById("waitlist");
    if (!hero || !cta) return;

    const update = () => setShow(heroOut.current && !ctaIn.current);

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroOut.current = !entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );
    const ctaObs = new IntersectionObserver(
      ([entry]) => {
        ctaIn.current = entry.isIntersecting;
        update();
      },
      { threshold: 0.01 }
    );

    heroObs.observe(hero);
    ctaObs.observe(cta);
    return () => {
      heroObs.disconnect();
      ctaObs.disconnect();
    };
  }, []);

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
          className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:bottom-5 sm:px-0 sm:pb-0"
          role="region"
          aria-label="Join the Halo waitlist"
        >
          <div className="flex w-full max-w-md items-center gap-2.5 rounded-2xl border border-white/10 bg-black/70 px-3 py-2.5 shadow-2xl backdrop-blur-xl sm:w-auto sm:max-w-none sm:gap-3 sm:rounded-full sm:py-2 sm:pl-5 sm:pr-2">
            {/* Label — desktop only */}
            <div className="hidden min-w-0 flex-col pr-1.5 sm:flex">
              <span className="text-sm font-semibold leading-tight text-white">
                Halo
              </span>
              <span className="truncate text-xs leading-tight text-gray-400">
                Catch deepfakes on your calls
              </span>
            </div>

            {/* Subscribe — ghost, desktop only (drops out on mobile per spec) */}
            <a
              href="#newsletter-signup"
              onClick={() => trackCTA("subscribe", "halo_sticky")}
              className="hidden shrink-0 items-center rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/35 hover:bg-white/5 sm:inline-flex"
            >
              Subscribe
            </a>

            {/* Join the waitlist — primary, always shown */}
            <a
              href="#waitlist"
              onClick={() => trackCTA("join_waitlist", "halo_sticky")}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-[#245FFF] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4acc] sm:flex-none sm:py-2"
            >
              Join the waitlist
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
