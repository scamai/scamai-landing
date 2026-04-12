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

export default function middleware(req: NextRequest) {
  const response = intlMiddleware(req) as NextResponse;

  // Get resolved locale from next-intl (via request headers)
  const locale = req.headers.get("x-locale") || defaultLocale;
  const isRtl = rtlLocales.includes(locale as typeof rtlLocales[number]);

  // Set cookie so root layout can read it for lang attribute
  response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
  response.cookies.set("NEXT_LOCALE_DIR", isRtl ? "rtl" : "ltr", { path: "/" });

  return response;
}

export const config = {
  matcher: ["/((?!api|admin|_next|scamai|.*\\..*).*)"],
};
