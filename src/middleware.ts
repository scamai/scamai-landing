import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, locales, rtlLocales } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});

// ─── Internal traffic flag ──────────────────────────────────────────
// Requests from our own infra get a sticky si_internal=1 cookie so all
// analytics (GA4, PostHog, GTM, Vercel Analytics, Sentry sessions) can
// exclude them — internal test traffic was polluting the funnels.
// Extend without a deploy via INTERNAL_TEST_IPS env (comma-separated).
const INTERNAL_IPS = new Set([
  "99.179.23.44", // aries egress — internal test traffic originates here
  ...(process.env.INTERNAL_TEST_IPS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? []),
]);

function clientIp(req: NextRequest): string {
  // Vercel puts the real client IP first in x-forwarded-for.
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    ""
  );
}

export default function middleware(req: NextRequest) {
  const response = intlMiddleware(req) as NextResponse;

  // Flag internal traffic (set-only — never unset, stickiness is the point)
  if (INTERNAL_IPS.has(clientIp(req))) {
    response.cookies.set("si_internal", "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  // Get resolved locale from next-intl (via request headers)
  const locale = req.headers.get("x-locale") || defaultLocale;
  const isRtl = rtlLocales.includes(locale as typeof rtlLocales[number]);

  // Set cookie so root layout can read it for lang attribute
  response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
  response.cookies.set("NEXT_LOCALE_DIR", isRtl ? "rtl" : "ltr", { path: "/" });

  return response;
}

export const config = {
  // ingest = PostHog reverse proxy, monitoring = Sentry tunnel (next.config
  // rewrites). Without these exclusions the locale middleware 307s
  // extension-less analytics POSTs to /en/ingest/* → 404 and every event
  // is silently dropped.
  matcher: ["/((?!api|admin|share|ingest|monitoring|_next|scamai|.*\\..*).*)"],
};
