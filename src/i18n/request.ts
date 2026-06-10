import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";

import { defaultLocale, locales, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl v4: requestLocale may be undefined; fall back to the default
  // locale (canonical v4 pattern). Invalid locale paths still 404 — the
  // [locale] layout validates and calls notFound().
  const requested = await requestLocale;
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  const baseMessages = (await import("../messages/en.json")).default;

  if (locale === defaultLocale) {
    return {
      locale,
      messages: baseMessages as unknown as AbstractIntlMessages,
    };
  }

  let localeMessages = {};
  try {
    localeMessages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    localeMessages = {};
  }

  return {
    locale,
    messages: {
      ...baseMessages,
      ...localeMessages,
    } as unknown as AbstractIntlMessages,
  };
});
