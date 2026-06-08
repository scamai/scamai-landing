// Sentry client-side init (Next 15.3+ instrumentation-client convention).
// Error monitoring runs ungated by cookie consent: it's diagnostics under
// legitimate interest — no advertising cookies, sendDefaultPii is false.
// Product analytics (GA4 + PostHog) stay consent-gated in CookieConsent.tsx.
//
// Safe no-op when NEXT_PUBLIC_SENTRY_DSN is unset (teammates without keys).
import * as Sentry from "@sentry/nextjs";

import { isInternalTraffic } from "@/lib/internal-traffic";

// ─── Browser-extension DOM-mutation crash guard ─────────────────────────────
// Chrome's "Translate this page" (and similar extensions) wrap text nodes in
// <font> tags AFTER React has rendered. When React later removes or replaces
// one of those original nodes it calls removeChild/insertBefore on a node the
// extension already re-parented → "NotFoundError: Failed to execute
// 'removeChild' on 'Node': The node to be removed is not a child of this node".
// React can't recover cleanly: the subtree remounts (visible jank) and the
// throw lands in Sentry. Observed signature: 100% Chrome-on-Windows, spanning
// /pricing, /research and /research/papers/* — i.e. global, not page-specific
// (Sentry issue 7528915048, ongoing on release a333a55).
//
// Standard, production-proven mitigation (React issue #11538): make the two
// mutators defensive — if the target isn't actually a child of `this`, no-op
// instead of throwing. Legitimate React reconciliation always passes a real
// child, so this is a no-op for normal rendering and only neutralises the
// extension-induced parent mismatch. Runs unconditionally (not DSN-gated): the
// crash hurts users whether or not error reporting is configured.
if (typeof Node === "function" && Node.prototype) {
  const realRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return realRemoveChild.call(this, child) as T;
  };

  const realInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return realInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

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
      // Browser-extension DOM mutation (Google Translate et al.) — neutralised
      // by the Node.prototype guard above; this catches any residual variant
      // (replaceChild, other extensions) so it never re-pollutes Sentry.
      "The node to be removed is not a child of this node",
      "The node before which the new node is to be inserted is not a child of this node",
    ],
  });
}

// Instruments App Router navigations for tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
