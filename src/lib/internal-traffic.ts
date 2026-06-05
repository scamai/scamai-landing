// Internal-traffic detection for analytics exclusion.
//
// Two signals, either one flags the visit as internal:
// 1. si_internal=1 cookie — set by middleware.ts when the request comes
//    from one of our own egress IPs (aries box etc.). Sticky for a year,
//    so a teammate flagged once stays excluded even off that network.
// 2. navigator.webdriver — true in Playwright/Puppeteer/Selenium sessions
//    regardless of origin IP, so CI / remote automation is covered too.
//
// Consumers: CookieConsent.tsx (GA4), analytics.ts (PostHog),
// instrumentation-client.ts (Sentry release-health sessions).
// GTM + Vercel Analytics are gated server-side in app/layout.tsx by
// reading the same cookie.
export function isInternalTraffic(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (navigator.webdriver) return true;
    if (
      document.cookie
        .split(";")
        .some((c) => c.trim().startsWith("si_internal=1"))
    ) {
      return true;
    }
  } catch {
    // cookie access can throw in exotic embeds — treat as external
  }
  return false;
}
