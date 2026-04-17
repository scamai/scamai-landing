import type { Metadata } from "next";
import NewLanding from "@/components/new-site/NewLanding";

export const metadata: Metadata = {
  title: "Verify any image — free, in 2 seconds | ScamAI",
  description:
    "Drag an image, get a verdict. ScamAI Eva V1.6 detects deepfakes and AI-generated images across 120+ generator types with 95% accuracy — free to try, no signup for the first two scans.",
  keywords: [
    "verify image ai",
    "is this image ai generated",
    "deepfake detector free",
    "check if image is ai",
    "ai image detector",
    "detect deepfake",
    "ai generated image detector",
    "synthetic media detection",
    "how to spot a deepfake",
    "whatsapp forward verification",
  ],
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <NewLanding locale={locale} />;
}
