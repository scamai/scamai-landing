import type { Metadata } from "next";
import HaloLanding from "@/components/new-site/HaloLanding";

export const metadata: Metadata = {
  title: "Halo — On-Device Deepfake Detection for Your Calls | Scam AI",
  description:
    "Halo catches deepfakes on your calls — on your device, in real time. Flag synthetic faces and cloned voices live on Zoom, Teams, and Meet. Built for finance and HR teams.",
  keywords: [
    "on-device deepfake detection",
    "real-time deepfake detection",
    "deepfake call protection",
    "synthetic voice detection",
    "video call deepfake",
    "deepfake wire fraud prevention",
    "deepfake interview detection",
  ],
  alternates: { canonical: "/halo" },
  openGraph: {
    title: "Halo — Catch deepfakes on your calls, on your device, in real time",
    description:
      "On-device, real-time deepfake detection for video and voice calls. Stop synthetic-exec wire fraud and fake remote candidates before they cost you.",
    url: "https://scam.ai/halo",
    siteName: "Scam AI",
    type: "website",
  },
};

export default function HaloPage() {
  return <HaloLanding />;
}
