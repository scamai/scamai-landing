import type { AbstractIntlMessages } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { defaultLocale, locales, rtlLocales, type Locale } from "@/i18n/config";
import Providers from "@/contexts/Providers";
import NewNav from "@/components/new-site/NewNav";
import NewFooter from "@/components/new-site/NewFooter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: Locale }> }
): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = rtlLocales.includes(locale);

  const titles: Record<string, string> = {
    en: "ScamAI — AI Trust Platform | Deepfake Detection & Synthetic Media Verification",
    es: "ScamAI — Plataforma de Confianza IA | Detección de Deepfakes",
    pt: "ScamAI — Plataforma de Confiança IA | Detecção de Deepfake",
    ja: "ScamAI — AI信任プラットフォーム | ディープフェイク検出",
    ko: "ScamAI — AI 신뢰 플랫폼 | 딥페이크 탐지",
    "zh-CN": "ScamAI — AI信任平台 | 深度伪造检测",
    "zh-TW": "ScamAI — AI信任平台 | 深度偽造檢測",
    id: "ScamAI — Platform Kepercayaan AI | Deteksi Deepfake",
    fr: "ScamAI — Plateforme de Confiance IA | Détection de Deepfake",
    de: "ScamAI — KI-Vertrauensplattform | Deepfake-Erkennung",
    ar: "ScamAI — منصة الثقة بالذكاء الاصطناعي | كشف التزييف العميق",
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

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: locale === defaultLocale ? "/" : `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, l === defaultLocale ? "/" : `/${l}`])
      ),
    },
    openGraph: {
      type: "website",
      locale: locale === "zh-CN" ? "zh_CN" : locale === "zh-TW" ? "zh_TW" : locale,
      url: locale === defaultLocale ? "https://scam.ai" : `https://scam.ai/${locale}`,
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      siteName: "ScamAI",
      images: [
        {
          url: `https://scam.ai/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "ScamAI - AI Trust Platform for Deepfake Detection",
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
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) {
    notFound();
  }

  const isRtl = rtlLocales.includes(locale);

  const baseMessages = (await import("../../messages/en.json")).default;
  let localeMessages: AbstractIntlMessages = {};
  if (locale !== defaultLocale) {
    try {
      localeMessages = (await import(`../../messages/${locale}.json`)).default;
    } catch {
      localeMessages = {};
    }
  }

  const messages = {
    ...baseMessages,
    ...localeMessages,
  } as unknown as AbstractIntlMessages;

  return (
    <Providers locale={locale} messages={messages}>
      <NewNav />
      {children}
      <NewFooter />
    </Providers>
  );
}
