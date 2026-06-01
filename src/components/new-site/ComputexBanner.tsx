"use client";

import { useState } from "react";
import { trackCTA } from "@/lib/analytics";

// Computex 2026 runs Jun 2–5 in Taipei. Auto-hide the day after it closes
// (Taipei time) so a stale "come meet us" banner never lingers.
const EVENT_END = new Date("2026-06-06T00:00:00+08:00").getTime();
const CAL_URL = "https://cal.com/scamai/15min";

/** Fixed banner height in px. Kept in sync with NewNav's header offset. */
export const BANNER_HEIGHT = 56;

function computeInitialVisible() {
  // Kill switch for marketing — flip NEXT_PUBLIC_EVENT_BANNER=off to hide.
  if (process.env.NEXT_PUBLIC_EVENT_BANNER === "off") return false;
  // Both env flag and expiry are known at SSR, so the server and client
  // agree on the first render — no layout shift for non-dismissed visitors.
  return Date.now() < EVENT_END;
}

/**
 * Visibility state for the Computex event banner. NewNav owns this so the
 * fixed-header offset stays in sync with whether the banner is rendered
 * (dismiss/expiry/kill-switch -> offset collapses to 0, no gap left behind).
 *
 * Dismiss is intentionally in-memory only — closing it hides the banner for
 * the current view, but it returns on the next reload (no persistence).
 */
export function useEventBanner() {
  const [visible, setVisible] = useState(computeInitialVisible);

  const dismiss = () => setVisible(false);

  return { visible, dismiss };
}

export default function ComputexBanner({ onDismiss }: { onDismiss: () => void }) {
  const handleCta = () => {
    // GTM dataLayer push for booking attribution, plus the site's GA helper.
    try {
      window.dataLayer?.push({ event: "computex2026_banner_cta_click" });
    } catch {}
    trackCTA("computex2026_banner", "announcement");
  };

  return (
    <div
      role="region"
      aria-label="Computex 2026 announcement"
      className="cx-banner-shell fixed left-0 right-0 top-0 z-50 w-full overflow-hidden border-b border-white/10 text-white"
      style={{ height: `${BANNER_HEIGHT}px` }}
    >
      <span
        aria-hidden
        className="cx-banner-sheen pointer-events-none absolute inset-0"
      />

      {/* Centered, symmetric content group */}
      <div className="relative flex h-full items-center justify-center gap-3 px-12 sm:gap-4 sm:px-14">
        {/* live dot */}
        <span aria-hidden className="relative h-2.5 w-2.5 shrink-0">
          <span className="cx-ping absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6d5dfb] opacity-80" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#6d5dfb]" />
        </span>

        {/* message */}
        <span className="truncate text-sm font-semibold text-gray-100 sm:text-base">
          Meet us at{" "}
          <span className="font-mono uppercase tracking-[0.14em] text-[#c2bbff]">
            Computex 2026
          </span>{" "}
          <span className="font-normal text-gray-300">· June 2–5</span>
        </span>

        {/* CTA */}
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCta}
          data-analytics="computex2026_banner_cta"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Book a meeting
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      {/* dismiss — absolute so it never shifts the centered group */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss Computex 2026 announcement"
        className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-gray-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:right-4"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
