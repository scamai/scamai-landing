"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

function ConsumerTierCard({ locale }: { locale: string }) {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-5xl">
            Free to start. <span className="text-[#245FFF]">$9/month</span> when you&rsquo;re serious.
          </h1>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Anonymous</p>
            <p className="mt-2 text-3xl font-bold">Free</p>
            <p className="mt-1 text-xs text-gray-500">No signup</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li>2 scans total</li>
              <li>Public result URL</li>
              <li>Binary verdict + confidence</li>
            </ul>
            <Link href={`/${locale}`} className="mt-6 inline-block text-sm font-semibold text-[#245FFF] hover:underline">
              Try it now →
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Registered</p>
            <p className="mt-2 text-3xl font-bold">Free</p>
            <p className="mt-1 text-xs text-gray-500">Google / Apple sign-in</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li>20 scans / month</li>
              <li>Scan history</li>
              <li>Public result URL</li>
            </ul>
            <Link href={`/${locale}`} className="mt-6 inline-block text-sm font-semibold text-[#245FFF] hover:underline">
              Sign up free →
            </Link>
          </div>

          <div className="relative rounded-2xl border border-[#245FFF]/50 p-6">
            <span className="absolute -top-2 right-5 rounded-full bg-[#245FFF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Best for pros
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8ca3ff]">Paid</p>
            <p className="mt-2 text-3xl font-bold">
              $9<span className="text-base text-gray-400">/mo</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">or $79/year</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-200">
              <li>Unlimited scans</li>
              <li>Private by default</li>
              <li>Heatmap + signal breakdown</li>
              <li>Scan history + PDF export</li>
            </ul>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
              onClick={() => alert("Stripe checkout coming soon — contact us for early access.")}
            >
              Upgrade — $9/month
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-gray-500">
          Building something?{" "}
          <Link href={`/${locale}/developers`} className="underline hover:text-white">
            Developer API
          </Link>{" "}
          · Running a platform?{" "}
          <Link href={`/${locale}/enterprise`} className="underline hover:text-white">
            Talk to sales
          </Link>
        </p>
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
