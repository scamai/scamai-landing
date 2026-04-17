import type { Metadata } from "next";
import Link from "next/link";
import { jsonLdProps, softwareApplicationSchema, faqSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "ScamAI API — Detect AI-generated images at scale",
  description:
    "Integrate ScamAI Eva V1.6 into your product. 95% accuracy across 120+ deepfake generators. Free Hobby tier, Starter at $99/mo, Growth at $499/mo. Sub-2-second latency.",
  keywords: [
    "deepfake detection api",
    "ai image detection api",
    "ai content moderation api",
    "synthetic image detector api",
  ],
};

const tiers = [
  {
    name: "Hobby",
    price: "$0",
    cadence: "forever",
    scans: "100 / month",
    features: [
      "Watermarked results",
      "Community support",
      "Rate-limited (5 req/min)",
      "Binary verdict + confidence",
    ],
    cta: "Get an API key",
    ctaDest: "contact",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$99",
    cadence: "per month",
    scans: "10,000 / month",
    features: [
      "No watermarks",
      "Email support",
      "Heatmap + signal breakdown",
      "Webhook callbacks",
      "99.9% uptime SLA",
    ],
    cta: "Start with Starter",
    ctaDest: "contact",
    highlight: true,
  },
  {
    name: "Growth",
    price: "$499",
    cadence: "per month",
    scans: "100,000 / month",
    features: [
      "Everything in Starter",
      "Priority inference (< 1.5s p95)",
      "Video endpoint (beta)",
      "Team dashboard",
      "Slack support",
    ],
    cta: "Scale up",
    ctaDest: "contact",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    scans: "Unlimited",
    features: [
      "Dedicated GPU capacity",
      "On-prem deployment",
      "Custom SLA + DPA + MSA",
      "White-label results",
      "SOC 2 report access",
    ],
    cta: "Contact sales",
    ctaDest: "enterprise",
    highlight: false,
  },
];

const sampleCurl = `curl -X POST https://api.scam.ai/v1/scan \\
  -H "Authorization: Bearer $SCAMAI_API_KEY" \\
  -H "Content-Type: application/octet-stream" \\
  --data-binary @./image.jpg`;

const sampleResponse = `{
  "slug": "red-fox-a9f2",
  "verdict": "likely_ai_manipulated",
  "confidence": 93.4,
  "signals": [
    { "type": "diffusion_artifacts", "score": 95 },
    { "type": "face_swap",           "score": 62 }
  ],
  "modelVersion": "eva-v1.6",
  "latencyMs": 1820,
  "shareUrl": "/scan/red-fox-a9f2"
}`;

export default async function DevelopersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-black text-white">
      <script {...jsonLdProps(softwareApplicationSchema())} />
      <script {...jsonLdProps(faqSchema([
        { q: "What's the free tier?", a: "100 scans per month, forever. Watermarked results, rate-limited to 5 req/min. Use it for prototypes, open-source projects, or personal tools." },
        { q: "What's the latency?", a: "p50 under 2s, p95 under 3s for typical JPG/PNG under 4MB. Growth tier bumps p95 below 1.5s." },
        { q: "Do you store my images?", a: "Only if you set `is_public=true`. Private scans are purged after inference unless explicitly retained. SOC 2 Type II. GDPR compliant." },
        { q: "What about videos?", a: "Video endpoint is in beta for Growth + Enterprise tiers. Contact us for access." },
      ]))} />

      <section className="mx-auto max-w-5xl px-5 pt-24 pb-12 text-center sm:px-8 sm:pt-32">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#245FFF]">
          Developer API · Eva V1.6
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Deepfake detection, one <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-3xl sm:text-5xl">POST</code> away.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg" data-speakable>
          95% accuracy across 120+ generator types. Sub-2-second p50. Free to start, $99/month at 10K images,
          enterprise on request.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                t.highlight ? "border-[#245FFF]/50 bg-[#245FFF]/[0.06]" : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t.name}</p>
              <p className="mt-2 text-3xl font-bold">{t.price}</p>
              {t.cadence && <p className="text-xs text-gray-500">{t.cadence}</p>}
              <p className="mt-3 text-sm font-semibold text-white">{t.scans}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-gray-300">
                {t.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Link
                href={t.ctaDest === "enterprise" ? `/${locale}/enterprise` : `/${locale}/contact`}
                className={`mt-6 inline-block rounded-full px-4 py-2 text-center text-sm font-semibold transition ${
                  t.highlight
                    ? "bg-white text-black hover:bg-gray-200"
                    : "border border-white/15 text-white hover:bg-white/10"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl">Integrate in 5 minutes</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Request</p>
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-5 text-xs leading-relaxed text-gray-200">
              {sampleCurl}
            </pre>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Response</p>
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-5 text-xs leading-relaxed text-gray-200">
              {sampleResponse}
            </pre>
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          SDKs for Node, Python, Go, and Ruby are coming.{" "}
          <Link href={`/${locale}/contact`} className="underline hover:text-white">
            Request early access
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
