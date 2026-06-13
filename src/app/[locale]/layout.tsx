import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMessages, setRequestLocale } from "next-intl/server";

import { locales, rtlLocales, type Locale } from "@/i18n/config";
import Providers from "@/contexts/Providers";
import NewNav from "@/components/new-site/NewNav";
import NewFooter from "@/components/new-site/NewFooter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const isRtl = rtlLocales.includes(locale);

  const titles: Record<string, string> = {
    en: "Scam AI — AI Trust Platform | Deepfake Detection & Synthetic Media Verification",
    es: "Scam AI — Plataforma de Confianza IA | Detección de Deepfakes",
    pt: "Scam AI — Plataforma de Confiança IA | Detecção de Deepfake",
    ja: "Scam AI — AI信任プラットフォーム | ディープフェイク検出",
    ko: "Scam AI — AI 신뢰 플랫폼 | 딥페이크 탐지",
    "zh-CN": "Scam AI — AI信任平台 | 深度伪造检测",
    "zh-TW": "Scam AI — AI信任平台 | 深度偽造檢測",
    id: "Scam AI — Platform Kepercayaan AI | Deteksi Deepfake",
    fr: "Scam AI — Plateforme de Confiance IA | Détection de Deepfake",
    de: "Scam AI — KI-Vertrauensplattform | Deepfake-Erkennung",
    ar: "Scam AI — منصة الثقة بالذكاء الاصطناعي | كشف التزييف العميق",
  };

  const descriptions: Record<string, string> = {
    en: "All-in-one AI Trust Platform for detecting synthetic media and deepfakes in real-time. Industry-leading accuracy with SOC 2 Type II compliance. 200 free images per month.",
    es: "Plataforma todo-en-uno de confianza IA para detectar medios sintéticos y deepfakes en tiempo real. Precisión líder en la industria con cumplimiento SOC 2 Tipo II.",
    pt: "Plataforma tudo-em-um de confiança IA para detectar mídia sintética e deepfakes em tempo real. Precisão líder do setor com conformidade SOC 2 Tipo II.",
    ja: "合成メディアやディープフェイクをリアルタイムで検出するAI信任プラットフォーム。SOC 2 Type II準拠で業界最高水準の精度を実現。",
    ko: "합성 미디어 및 딥페이크를 실시간으로 탐지하는 올인원 AI 신뢰 플랫폼. SOC 2 Type II 준수 및 업계 최고 수준의 정확도를 제공합니다.",
    "zh-CN": "一体化AI信任平台，实时检测合成媒体和深度伪造。符合SOC 2 Type II标准，行业领先精度。",
    "zh-TW": "一體化AI信任平台，即時檢測合成媒體和深度偽造。符合SOC 2 Type II標準，行業領先精度。",
    id: "Platform kepercayaan AI all-in-one untuk mendeteksi media sintetis dan deepfake secara real-time. Akurasi terkemuka dengan kepatuhan SOC 2 Type II.",
    fr: "Plateforme de confiance IA tout-en-un pour détecter les médias synthétiques et les deepfakes en temps réel. Précision leader du secteur avec conformité SOC 2 Type II.",
    de: "All-in-One KI-Vertrauensplattform zur Erkennung von synthetischen Medien und Deepfakes in Echtzeit. Branchenführende Genauigkeit mit SOC 2 Type II Compliance.",
    ar: "منصة الثقة بالذكاء الاصطناعي الشاملة للكشف عن الوسائط التركيبية والتزييف العميق في الوقت الفعلي. دقة رائدة في الصناعة مع الامتثال SOC 2 Type II.",
  };

  const ogLocales: Record<string, string> = {
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

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocales[locale] || ogLocales.en,
      url: `https://www.scam.ai/${locale}`,
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      siteName: "Scam AI",
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  // Required for next-intl static rendering: without this, SSG prerendering
  // resolves requestLocale to the default locale for some routes, so client
  // components get English messages in the prerendered HTML (on-demand renders
  // were fine). Must be called before any next-intl API / message load.
  setRequestLocale(locale);

  const isRtl = rtlLocales.includes(locale);

  // Single source of truth: getMessages() reads from i18n/request.ts under the
  // locale set by setRequestLocale above. (Previously this layout re-imported
  // and merged messages itself, which diverged from the request context during
  // SSG prerendering and produced English copy for some locales.)
  const messages = await getMessages();

  return (
    <Providers locale={locale} messages={messages}>
      <NewNav />
      {children}
      <NewFooter />
    </Providers>
  );
}
