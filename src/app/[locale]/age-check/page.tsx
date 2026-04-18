import type { Metadata } from "next";
import AgeCheckClient from "@/components/scan/AgeCheckClient";

export const metadata: Metadata = {
  title: "Age check — guess my age | ScamAI",
  description:
    "Upload a selfie, get an estimated age range. Consent-first, range-only, never for other people. Runs on ScamAI's face model.",
  robots: { index: false, follow: false },
};

export default function AgeCheckPage() {
  return <AgeCheckClient />;
}
