import type { Metadata } from "next";
import ScamInsurancePage from "@/components/scam-insurance/ScamInsurancePage";

export const metadata: Metadata = {
  title: "Scam AI — Scam Insurance | Never Worry About Scams Again",
  description:
    "scam.ai blocks scam calls, texts, and emails before they ever reach you — and backs it up with insurance-backed reimbursement if anything gets through.",
  keywords: [
    "scam insurance",
    "scam protection",
    "fraud insurance",
    "scam prevention",
    "identity theft protection",
    "phishing protection",
    "senior scam protection",
  ],
};

export default function Page() {
  return <ScamInsurancePage />;
}
