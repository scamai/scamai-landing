import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";

import { defaultLocale, locales, type Locale } from "./config";

// Static imports (NOT a template-literal dynamic import). The previous
// `import(`../messages/${locale}.json`)` produced a webpack context module whose
// per-locale chunks could fail to load in the production build for some locales
// (observed: zh-CN, ar) — the catch then fell back to {} → English copy, while
// dev (no chunk splitting) worked. Static imports are bundled eagerly so every
// locale's messages are always present.
import en from "../messages/en.json";
import zhCN from "../messages/zh-CN.json";
import zhTW from "../messages/zh-TW.json";
import ja from "../messages/ja.json";
import ko from "../messages/ko.json";
import es from "../messages/es.json";
import pt from "../messages/pt.json";
import fr from "../messages/fr.json";
import de from "../messages/de.json";
import id from "../messages/id.json";
import ar from "../messages/ar.json";

const MESSAGES = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  ja,
  ko,
  es,
  pt,
  fr,
  de,
  id,
  ar,
} as unknown as Record<Locale, AbstractIntlMessages>;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  const baseMessages = MESSAGES[defaultLocale];
  const messages =
    locale === defaultLocale
      ? baseMessages
      : ({
          ...(baseMessages as object),
          ...(MESSAGES[locale] as object),
        } as AbstractIntlMessages);

  return { locale, messages };
});
