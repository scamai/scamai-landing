import type { Metadata } from "next";
import NewLanding from "@/components/new-site/NewLanding";

export const metadata: Metadata = {
  title: "ScamAI — Detect Deepfakes & AI-Generated Media",
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
  return <NewLanding />;
}
