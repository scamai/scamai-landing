import type { Metadata } from "next";
import NewLanding from "@/components/new-site/NewLanding";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "ScamAI — Deepfake Detection Tool | Detect AI-Generated Media & Synthetic Content",
  description:
    "Detect synthetic media, deepfakes, and AI-generated images in real-time. Free tool with industry-leading accuracy. SOC 2 Type II compliant.",
  keywords: [
    "deepfake detection",
    "detect deepfake",
    "ai generated image detector",
    "synthetic media detection",
    "fake video detector",
    "ai image detection free",
    "deepfake detector free",
  ],
};

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <NewLanding />
    </>
  );
}
