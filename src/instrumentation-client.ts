// Sentry client-side init (Next 15.3+ instrumentation-client convention).
// Error monitoring runs ungated by cookie consent: it's diagnostics under
// legitimate interest — no advertising cookies, sendDefaultPii is false.
// Product analytics (GA4 + PostHog) stay consent-gated in CookieConsent.tsx.
//
// Safe no-op when NEXT_PUBLIC_SENTRY_DSN is unset (teammates without keys).
import * as Sentry from "@sentry/nextjs";

import { isInternalTraffic } from "@/lib/internal-traffic";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  // Internal traffic (our egress IPs via si_internal cookie, or automation
  // via navigator.webdriver): errors STILL report — a prod bug found by
  // internal testing is a real bug — but tagged internal_traffic for
  // filtering, with release-health sessions and tracing dropped so
  // crash-free rate and perf metrics reflect real users only.
  const internal = isInternalTraffic();

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    sendDefaultPii: false,
    initialScope: internal ? { tags: { internal_traffic: "true" } } : undefined,
    // Marketing site: errors matter, perf tracing only needs a sample.
    tracesSampleRate: internal ? 0 : 0.1,
    // Release health: send anonymous session pings so Releases shows
    // crash-free rate per deploy. Verified absent from v10 defaults — errors
    // arrived but sessions stayed at 0 until this was added explicitly.
    // Session REPLAY lives in PostHog (consent-gated) — this is not that.
    integrations: internal ? [] : [Sentry.browserSessionIntegration()],

    // Noise rules ported from the faker-100 portfolio: user-environment
    // failures (extension stubs, ad-block fetch kills) are not our bugs.
    denyUrls: [
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-(web-)?extension:/i,
      /extensions\//i,
    ],
    ignoreErrors: [
      // Benign browser noise
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Non-Error promise rejection captured",
      // Ad-blockers killing third-party fetches (GA, vitals)
      "Failed to fetch",
      "NetworkError when attempting to fetch resource",
      "Load failed",
      // Privacy extensions replacing WebRTC ctors with stubs
      // (playground page; same class as faker-100 Sentry 2T/2V)
      "RTCPeerConnection is not a constructor",
    ],
  });
}

// Instruments App Router navigations for tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
