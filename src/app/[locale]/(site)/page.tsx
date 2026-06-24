import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import NewLanding from "@/components/new-site/NewLanding";
import StructuredData from "@/components/seo/StructuredData";

// Keyword-optimized homepage <title> per locale. Falls back to English. Without
// this, the page exported one English title for every locale, overriding the
// localized titles from [locale]/layout.tsx — so /ja, /ar, /zh-CN etc. all
// rendered an English <title>/<meta description>, undermining non-English SERPs.
const PAGE_TITLES: Record<string, string> = {
  en: "Scam AI — Deepfake Detection Tool | Detect AI-Generated Media & Synthetic Content",
  es: "Scam AI — Herramienta de detección de deepfakes | Detecta medios generados por IA",
  pt: "Scam AI — Ferramenta de detecção de deepfake | Detecte mídia gerada por IA",
  ja: "Scam AI — ディープフェイク検出ツール | AI生成メディア・合成コンテンツを検出",
  ko: "Scam AI — 딥페이크 탐지 도구 | AI 생성 미디어 및 합성 콘텐츠 탐지",
  "zh-CN": "Scam AI — 深度伪造检测工具 | 检测 AI 生成媒体与合成内容",
  "zh-TW": "Scam AI — 深度偽造檢測工具 | 檢測 AI 生成媒體與合成內容",
  id: "Scam AI — Alat Deteksi Deepfake | Deteksi Media Buatan AI & Konten Sintetis",
  fr: "Scam AI — Outil de détection de deepfake | Détectez les médias générés par IA",
  de: "Scam AI — Deepfake-Erkennungstool | KI-generierte Medien erkennen",
  ar: "Scam AI — أداة كشف التزييف العميق | اكتشف الوسائط المولّدة بالذكاء الاصطناعي",
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  en: "Detect synthetic media, deepfakes, and AI-generated images in real-time. Free tool with industry-leading accuracy. SOC 2 Type II compliant.",
  es: "Detecta medios sintéticos, deepfakes e imágenes generadas por IA en tiempo real. Herramienta gratuita con precisión líder del sector. Conforme con SOC 2 Tipo II.",
  pt: "Detecte mídia sintética, deepfakes e imagens geradas por IA em tempo real. Ferramenta gratuita com precisão líder do setor. Conforme com SOC 2 Tipo II.",
  ja: "合成メディア、ディープフェイク、AI生成画像をリアルタイムで検出。業界最高水準の精度を備えた無料ツール。SOC 2 Type II準拠。",
  ko: "합성 미디어, 딥페이크, AI 생성 이미지를 실시간으로 탐지합니다. 업계 최고 수준의 정확도를 갖춘 무료 도구. SOC 2 Type II 준수.",
  "zh-CN": "实时检测合成媒体、深度伪造和 AI 生成图像。免费工具，行业领先精度。符合 SOC 2 Type II 标准。",
  "zh-TW": "即時檢測合成媒體、深度偽造和 AI 生成圖像。免費工具，業界領先精度。符合 SOC 2 Type II 標準。",
  id: "Deteksi media sintetis, deepfake, dan gambar buatan AI secara real-time. Alat gratis dengan akurasi terkemuka di industri. Patuh SOC 2 Type II.",
  fr: "Détectez les médias synthétiques, les deepfakes et les images générées par IA en temps réel. Outil gratuit avec une précision leader du secteur. Conforme SOC 2 Type II.",
  de: "Erkennen Sie synthetische Medien, Deepfakes und KI-generierte Bilder in Echtzeit. Kostenloses Tool mit branchenführender Genauigkeit. SOC 2 Type II-konform.",
  ar: "اكتشف الوسائط التركيبية والتزييف العميق والصور المولّدة بالذكاء الاصطناعي في الوقت الفعلي. أداة مجانية بدقة رائدة في الصناعة. متوافقة مع SOC 2 Type II.",
};

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
  const title = PAGE_TITLES[locale] || PAGE_TITLES.en;
  const description = PAGE_DESCRIPTIONS[locale] || PAGE_DESCRIPTIONS.en;
  return {
    title,
    description,
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
      title,
      description,
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
