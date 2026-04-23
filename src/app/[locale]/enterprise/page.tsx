import type { Metadata } from "next";
import { EnterpriseForm } from "@/components/enterprise/EnterpriseForm";
import { jsonLdProps, organizationSchema, breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "ScamAI for Platforms — enterprise deepfake detection",
  description:
    "Content platforms, dating apps, KYC providers, and newsrooms use ScamAI Eva V1.6 at scale. On-prem options, custom SLAs, SOC 2 Type II. Talk to our team.",
};

export default async function EnterprisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-black text-white">
      <script {...jsonLdProps(organizationSchema())} />
      <script {...jsonLdProps(breadcrumbSchema([
        { name: "Home", url: `/${locale}` },
        { name: "Enterprise", url: `/${locale}/enterprise` },
      ]))} />

      <section className="mx-auto max-w-5xl px-5 pt-24 pb-12 sm:px-8 sm:pt-32">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#245FFF]">
          For platforms, newsrooms, and regulated industries
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          ScamAI at scale.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg" data-speakable>
          Dedicated Eva V1.6 capacity, custom SLAs, on-prem deployment, and a white-label trust badge
          for your product. SOC 2 Type II. GDPR. Contract in 14 days or less.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-12 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Social platforms", d: "Stream scan user-uploaded images for deepfake + misinformation flagging." },
            { t: "Dating & social apps", d: "Real-time profile-photo verification in the signup flow." },
            { t: "KYC + identity", d: "Augment selfie liveness with deepfake + face-swap detection." },
            { t: "News + fact-check", d: "Newsroom integrations with Slack/Teams alerts for viral suspect images." },
            { t: "Insurance + legal", d: "Evidence triage with audit-trail for claim photos." },
            { t: "Ad platforms", d: "Pre-flight check for AI-generated product imagery in creative review." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 p-5">
              <p className="text-sm font-semibold text-white">{x.t}</p>
              <p className="mt-1 text-sm text-gray-400">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-32 sm:px-8">
        <div className="rounded-2xl border border-white/10 p-6 sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">Talk to our team</h2>
          <p className="mt-1 text-sm text-gray-400">
            Tell us about your use case — we respond within one business day.
          </p>
          <div className="mt-6">
            <EnterpriseForm />
          </div>
        </div>
      </section>
    </main>
  );
}
