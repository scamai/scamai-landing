"use client";

import { useTranslations } from "next-intl";

// Security feature cards — stable ids; title/description resolved via t() at render
const SECURITY_FEATURES = [
  "encryption",
  "retention",
  "apiKeys",
  "access",
  "auditLogs",
  "ddos",
  "pentest",
  "incident",
  "backup",
] as const;

// Regional compliance columns — stable ids; heading + 4 bullets resolved via t() at render
const REGIONS = ["europe", "unitedStates", "asiaPacific"] as const;

// Data privacy cards — stable ids; title/description resolved via t() at render
const DATA_PRIVACY = ["noTraining", "retention", "export"] as const;

export default function SecurityCompliancePage() {
  const t = useTranslations("securityCompliancePage");

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#66b3ff]">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            {t("hero.heading")}
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            {t("hero.body")}
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            {t("certifications.heading")}
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#66b3ff]/10">
                <span className="text-2xl font-bold text-[#66b3ff]">SOC 2</span>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">SOC 2 Type II</h3>
              <p className="text-gray-300">
                {t("certifications.soc2.description")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#66b3ff]/10">
                <span className="text-2xl font-bold text-[#66b3ff]">GDPR</span>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">{t("certifications.gdpr.title")}</h3>
              <p className="text-gray-300">
                {t("certifications.gdpr.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            {t("securityFeatures.heading")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SECURITY_FEATURES.map((id) => (
              <div key={id} className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-6">
                <h3 className="mb-3 text-lg font-bold text-white">{t(`securityFeatures.items.${id}.title`)}</h3>
                <p className="text-sm text-gray-300">
                  {t(`securityFeatures.items.${id}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            {t("regional.heading")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {REGIONS.map((id) => (
              <div key={id} className="rounded-lg border border-gray-800 bg-gray-900/40 p-8">
                <h3 className="mb-4 text-2xl font-bold text-white">{t(`regional.items.${id}.title`)}</h3>
                <ul className="space-y-3 text-gray-300">
                  {[0, 1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-[#66b3ff]">✓</span>
                      <span>{t(`regional.items.${id}.bullets.${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            {t("dataPrivacy.heading")}
          </h2>
          <div className="space-y-6">
            {DATA_PRIVACY.map((id) => (
              <div key={id} className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-8">
                <h3 className="mb-4 text-2xl font-bold text-white">{t(`dataPrivacy.items.${id}.title`)}</h3>
                <p className="text-gray-300">
                  {t(`dataPrivacy.items.${id}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-12 text-center">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              {t("enterprise.heading")}
            </h2>
            <p className="mb-8 text-lg text-gray-300">
              {t("enterprise.body")}
            </p>
            <a
              href="/contact"
              className="rainbow-button inline-block"
            >
              <span className="rainbow-button-inner">
                {t("enterprise.cta")}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            {t("docs.heading")}
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            {t("docs.body")}
          </p>
          <a
            href="/contact"
            className="inline-block rounded-lg border border-gray-700 bg-gray-800 px-8 py-3 font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            {t("docs.cta")}
          </a>
        </div>
      </section>
    </main>
  );
}
