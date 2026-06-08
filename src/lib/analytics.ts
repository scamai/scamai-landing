// Unified analytics event bus: GA4 + PostHog.
// Both tools load conditionally AFTER cookie consent (CookieConsent.tsx);
// every helper below no-ops until then. trackEvent() fans out to both, so
// component call sites stay tool-agnostic.
//
// PostHog specifics:
// - Traffic goes through the same-origin /ingest reverse proxy
//   (next.config.ts rewrites) so ad-blockers — common among this site's
//   security-minded audience — don't drop events.
// - Safe no-op when NEXT_PUBLIC_POSTHOG_KEY is missing, so teammates
//   without keys build and run unaffected.
// - Sentry owns exceptions (capture_exceptions: false) — no double-report.

import posthog from "posthog-js";

import { isInternalTraffic } from "@/lib/internal-traffic";

type GAEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// ── PostHog lifecycle (called from CookieConsent) ────────────────

let posthogLoaded = false;

/** Init PostHog. Call ONLY after cookie consent — mirrors loadGA(). */
export function loadPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || posthogLoaded || typeof window === "undefined") return;
  if (isInternalTraffic()) return; // our own IPs / automation — don't pollute
  posthogLoaded = true;
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    // 2026-05-30 defaults (current, matches PostHog's own snippet):
    // history-API pageviews (SPA navigation), pageleave, sane autocapture
    // — manual wiring stays business-only.
    defaults: "2026-05-30",
    capture_exceptions: false, // Sentry owns errors
    // Cross-subdomain attribution: store the distinct_id cookie at the
    // registrable domain (.scam.ai), NOT www.scam.ai, so app.scam.ai (the
    // WorkOS-auth product app, repo scamai/sentinal_dashboard) reads the SAME
    // distinct_id when it inits PostHog with this same project token. That
    // stitches the anonymous landing journey to the signed-up user once the app
    // calls posthog.identify() — the prerequisite for attributing real signups
    // back to the landing session. posthog-js auto-detects this for real
    // domains, but we set it explicitly so the behaviour can't silently change.
    cross_subdomain_cookie: true,
    person_profiles: "identified_only",
    session_recording: {
      maskAllInputs: true,
    },
  });
}

/** Called when the user declines cookie consent — mirrors removeGACookies(). */
export function disablePostHog() {
  if (!posthogLoaded) return;
  posthog.opt_out_capturing();
}

/** Core event helper — fans out to GA4 (gtag) AND PostHog. */
export function trackEvent({ action, category, label, value }: GAEvent) {
  if (typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
  if (posthogLoaded) {
    posthog.capture(action, { category, label, value });
  }
}

// ── Pre-built event helpers ──────────────────────────────────────

/** CTA button clicks (hero, pricing, etc.) */
export function trackCTA(ctaName: string, location: string) {
  trackEvent({
    action: "cta_click",
    category: "engagement",
    label: `${ctaName} | ${location}`,
  });
}

/** Navigation clicks */
export function trackNav(item: string, type: "desktop" | "mobile" | "dropdown") {
  trackEvent({
    action: "nav_click",
    category: "navigation",
    label: `${item} | ${type}`,
  });
}

/** External link clicks */
export function trackOutbound(url: string, label: string) {
  trackEvent({
    action: "outbound_click",
    category: "outbound",
    label: `${label} | ${url}`,
  });
}

/** Newsletter subscription */
export function trackNewsletterSignup(location: string) {
  trackEvent({
    action: "newsletter_signup",
    category: "conversion",
    label: location,
  });
}

/** Waitlist form submission (scam-insurance, Halo, etc.) */
export function trackWaitlistSubmit(location: string) {
  trackEvent({
    action: "waitlist_submitted",
    category: "conversion",
    label: location,
  });
}

/** Pricing interaction */
export function trackPricing(action: string, detail: string) {
  trackEvent({
    action: `pricing_${action}`,
    category: "pricing",
    label: detail,
  });
}

/** FAQ interaction */
export function trackFAQ(question: string) {
  trackEvent({
    action: "faq_open",
    category: "engagement",
    label: question,
  });
}

/** Search / Command palette */
export function trackSearch(query: string, resultClicked?: string) {
  trackEvent({
    action: resultClicked ? "search_select" : "search_query",
    category: "search",
    label: resultClicked || query,
  });
}

/** Section scroll-into-view */
export function trackSectionView(sectionName: string) {
  trackEvent({
    action: "section_view",
    category: "engagement",
    label: sectionName,
  });
}

/** Cookie consent response */
export function trackConsent(accepted: boolean) {
  trackEvent({
    action: "cookie_consent",
    category: "privacy",
    label: accepted ? "accepted" : "declined",
  });
}
