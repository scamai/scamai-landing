"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

function ConsumerTierCard({ locale }: { locale: string }) {
  const t = useTranslations("PricingPage");
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-5xl">
            {t("headline", { price: "$9" })}
          </h1>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("tiers.free.label")}</p>
            <p className="mt-2 text-3xl font-bold">{t("tiers.free.price")}</p>
            <p className="mt-1 text-xs text-gray-500">{t("tiers.free.note")}</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li>{t("tiers.free.features.scans")}</li>
              <li>{t("tiers.free.features.history")}</li>
              <li>{t("tiers.free.features.publicUrl")}</li>
            </ul>
          </div>

          <div className="relative rounded-2xl border border-white/30 p-6">
            <span className="absolute -top-2 right-5 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
              {t("tiers.plus.badge")}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{t("tiers.plus.label")}</p>
            <p className="mt-2 text-3xl font-bold">
              {t("tiers.plus.price")}<span className="text-base text-gray-400">{t("tiers.plus.perMonth")}</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">{t("tiers.plus.annual")}</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-200">
              <li>{t("tiers.plus.features.scans")}</li>
              <li>{t("tiers.plus.features.privateScans")}</li>
              <li>{t("tiers.plus.features.signalBreakdown")}</li>
              <li>{t("tiers.plus.features.history")}</li>
            </ul>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
              onClick={() => alert(t("checkoutAlert"))}
            >
              {t("tiers.plus.cta")}
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("tiers.pro.label")}</p>
            <p className="mt-2 text-3xl font-bold">
              {t("tiers.pro.price")}<span className="text-base text-gray-400">{t("tiers.pro.perMonth")}</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">{t("tiers.pro.annual")}</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-200">
              <li>{t("tiers.pro.features.scans")}</li>
              <li>{t("tiers.pro.features.private")}</li>
              <li>{t("tiers.pro.features.signalBreakdown")}</li>
              <li>{t("tiers.pro.features.history")}</li>
            </ul>
            <button
              type="button"
              className="mt-6 w-full rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              onClick={() => alert(t("checkoutAlert"))}
            >
              {t("tiers.pro.cta")}
            </button>
          </div>
          <div className="rounded-2xl border border-white/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("tiers.enterprise.label")}</p>
            <p className="mt-2 text-3xl font-bold">{t("tiers.enterprise.price")}</p>
            <p className="mt-1 text-xs text-gray-500">{t("tiers.enterprise.note")}</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li>{t("tiers.enterprise.features.volume")}</li>
              <li>{t("tiers.enterprise.features.model")}</li>
              <li>{t("tiers.enterprise.features.api")}</li>
              <li>{t("tiers.enterprise.features.support")}</li>
            </ul>
            <Link
              href={`/${locale}/enterprise`}
              className="mt-6 block w-full rounded-full border border-white/20 bg-transparent px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("tiers.enterprise.cta")}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default function PricingPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  return (
    <main className="min-h-screen bg-black text-white">
      <ConsumerTierCard locale={locale} />
    </main>
  );
}
