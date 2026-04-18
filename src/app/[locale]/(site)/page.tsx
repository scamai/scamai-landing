import type { Metadata } from "next";
import NewLanding from "@/components/new-site/NewLanding";

export const metadata: Metadata = {
  title: "Is it real or AI? · ScamAI",
  description:
    "Drop an image, video, or voice clip and ScamAI tells you if it's AI-edited in about 2 seconds. Eva v1.6 detects deepfakes and AI-generated media across 120+ generator types. Free to try, no signup needed.",
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
