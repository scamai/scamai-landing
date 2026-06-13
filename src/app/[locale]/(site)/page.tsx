import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import NewLanding from "@/components/new-site/NewLanding";
import StructuredData from "@/components/seo/StructuredData";

const PAGE_TITLE =
  "Scam AI — Deepfake Detection Tool | Detect AI-Generated Media & Synthetic Content";

const PAGE_DESCRIPTION =
  "Detect synthetic media, deepfakes, and AI-generated images in real-time. Free tool with industry-leading accuracy. SOC 2 Type II compliant.";

// OG locale codes (underscore format) — kept in sync with [locale]/layout.tsx.
const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
  ja: "ja_JP",
  ko: "ko_KR",
  id: "id_ID",
  fr: "fr_FR",
  de: "de_DE",
  ar: "ar_AR",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
};

// The homepage keeps its own keyword-optimized <title>, so it must also supply a
// COMPLETE openGraph object: Next.js replaces (does not deep-merge) the parent's
// openGraph when a segment sets one, and a page that sets title/description but
// no openGraph drops the layout's locale-aware url/locale/images. twitter is left
// untouched so the root layout's full Twitter card (card type + image) is inherited.
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    keywords: [
      "deepfake detection",
      "detect deepfake",
      "ai generated image detector",
      "synthetic media detection",
      "fake video detector",
      "ai image detection free",
      "deepfake detector free",
    ],
    openGraph: {
      type: "website",
      locale: OG_LOCALES[locale] || OG_LOCALES.en,
      url: `https://www.scam.ai/${locale}`,
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      siteName: "ScamAI",
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Scam AI - AI Trust Platform for Deepfake Detection",
        },
      ],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // next-intl static-rendering requirement (see [locale]/layout.tsx) — ensures
  // the prerendered homepage uses the route's locale, not the default.
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <StructuredData />
      <NewLanding />
    </>
  );
}
