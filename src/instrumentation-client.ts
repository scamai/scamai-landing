// Sentry client-side init (Next 15.3+ instrumentation-client convention).
// Error monitoring runs ungated by cookie consent: it's diagnostics under
// legitimate interest — no advertising cookies, sendDefaultPii is false.
// Product analytics (GA4 + PostHog) stay consent-gated in CookieConsent.tsx.
//
// Safe no-op when NEXT_PUBLIC_SENTRY_DSN is unset (teammates without keys).
import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    sendDefaultPii: false,
    // Marketing site: errors matter, perf tracing only needs a sample.
    tracesSampleRate: 0.1,
    // Session replay lives in PostHog (consent-gated) — not here.
    integrations: [],

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
