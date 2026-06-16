import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Scam AI - AI Trust Platform | Deepfake Detection & Synthetic Media Verification",
    template: "%s | Scam AI"
  },
  description: "All-in-one AI Trust Platform for detecting synthetic media and deepfakes in real-time. Industry-leading accuracy with SOC 2 Type II compliance. 200 free images per month.",
  keywords: [
    "deepfake detection",
    "synthetic media detection",
    "AI fraud prevention",
    "deepfake detector",
    "fake video detection",
    "audio deepfake detection",
    "AI trust platform",
    "media verification",
    "synthetic voice detection",
    "AI-powered security",
    "real-time detection",
    "Eva-v1 AI model"
  ],
  authors: [{ name: "Reality Inc." }],
  creator: "Reality Inc.",
  publisher: "Reality Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.scam.ai"),
  alternates: {
    canonical: "/en",
    languages: {
      "en": "/en",
      "es": "/es",
      "pt": "/pt",
      "ja": "/ja",
      "ko": "/ko",
      "zh-TW": "/zh-TW",
      "zh-CN": "/zh-CN",
      "id": "/id",
      "fr": "/fr",
      "de": "/de",
      "ar": "/ar",
      "x-default": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.scam.ai",
    title: "Scam AI - AI Trust Platform | Deepfake Detection",
    description: "Detect synthetic media and deepfakes in real-time with industry-leading accuracy. SOC 2 Type II compliant. 200 free images per month.",
    siteName: "Scam AI",
    images: [
      {
        url: "/en/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Scam AI - AI Trust Platform for Deepfake Detection",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scam AI - AI Trust Platform | Deepfake Detection",
    description: "Detect synthetic media and deepfakes in real-time with industry-leading accuracy. SOC 2 Type II compliant.",
    images: ["/en/opengraph-image"],
    creator: "@ScamAI_Official",
    site: "@ScamAI_Official",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-black.ico", sizes: "any", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-white.ico", sizes: "any", media: "(prefers-color-scheme: dark)" }
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: ["ZPzA6gMNEygDaZMIRMH-Gijcpx_I5TL5FaKhlvmQrw8", "dx91shHxJZ5NpnCjFsNlOqQ-oBzwy0WlHSetQzzL9ns"],
  },
};

// Static passthrough root layout. <html>/<body> and lang/dir now live in each
// top-level branch's layout ([locale], admin, share) so this layout never calls a
// dynamic API (getLocale/cookies) and the public routes stay statically rendered
// and CDN-cacheable. globals.css and the metadata above still apply site-wide.
// Non-localized top-level routes (app/page.tsx, /company, /contact, …) are
// redirect() shells that throw before render, so they need no <html>/<body>.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
