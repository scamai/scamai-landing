"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  usePricingCalculator,
  PricingHero,
  VolumeSlider,
  AddOnFeatures,
  ForensicAddOns,
  PriceSummary,
  PricingCards,
} from '@/components/pricing';

function ConsumerTierCard({ locale }: { locale: string }) {
  return (
    <section className="border-b border-white/10 bg-gradient-to-b from-black to-[#080818] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#245FFF]">
            Just verifying images?
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-4xl">
            Free to start. $9/month when you&rsquo;re serious.
          </h2>
          <p className="mt-3 text-sm text-gray-400 sm:text-base">
            Consumer pricing — for journalists, parents, creators, and anyone checking a suspicious image.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
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

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Registered</p>
            <p className="mt-2 text-3xl font-bold">Free</p>
            <p className="mt-1 text-xs text-gray-500">Google / Apple sign-in</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li>20 scans / month</li>
              <li>Scan history</li>
              <li>Email digest opt-in</li>
            </ul>
            <Link href={`/${locale}`} className="mt-6 inline-block text-sm font-semibold text-[#245FFF] hover:underline">
              Sign up free →
            </Link>
          </div>

          <div className="relative rounded-2xl border border-[#245FFF]/50 bg-[#245FFF]/[0.06] p-6">
            <span className="absolute -top-2 right-5 rounded-full bg-[#245FFF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Best for pros
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8ca3ff]">Paid</p>
            <p className="mt-2 text-3xl font-bold">
              $9<span className="text-base text-gray-400">/mo</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">or $79/year (save 27%)</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-200">
              <li>Unlimited scans</li>
              <li>Private by default (opt-in share)</li>
              <li>Heatmap + signal breakdown</li>
              <li>Scan history + PDF export</li>
              <li>No watermark</li>
            </ul>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
              onClick={() => alert("Stripe checkout coming soon — contact us if you want early access.")}
            >
              Upgrade — $9/month
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-gray-500">
          Building something? See the{" "}
          <Link href={`/${locale}/developers`} className="underline hover:text-white">
            developer API
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
  const {
    // State
    volume,
    setVolume,
    adaptiveDefense,
    setAdaptiveDefense,
    activeLiveness,
    setActiveLiveness,
    expressLane,
    setExpressLane,
    currency,
    setCurrency,
    // Calculations
    pricePerCheck,
    monthlyEstimate,
    // Currency
    currencySymbol,
    decimals,
    formatPrice,
  } = usePricingCalculator();

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Consumer tier — NEW */}
      <ConsumerTierCard locale={locale} />

      {/* Hero Section — API / volume pricing */}
      <PricingHero />

      {/* Pricing Calculator & Plans */}
      <section className="py-12 px-4 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Volume Slider - Always First */}
            <div className="space-y-8 lg:order-1">
              <VolumeSlider volume={volume} onChange={setVolume} />

              {/* Add-on Features - Hidden on Mobile, Shown on Desktop */}
              <div className="hidden lg:block space-y-8">
                <AddOnFeatures
                  adaptiveDefense={adaptiveDefense}
                  setAdaptiveDefense={setAdaptiveDefense}
                  activeLiveness={activeLiveness}
                  setActiveLiveness={setActiveLiveness}
                  expressLane={expressLane}
                  setExpressLane={setExpressLane}
                  currencySymbol={currencySymbol}
                  formatPrice={formatPrice}
                />
                <ForensicAddOns currencySymbol={currencySymbol} formatPrice={formatPrice} />
              </div>
            </div>

            {/* Price Summary - Second on Mobile, Right Side on Desktop */}
            <div className="lg:order-2">
              <PriceSummary
                volume={volume}
                pricePerCheck={pricePerCheck}
                monthlyEstimate={monthlyEstimate}
                adaptiveDefense={adaptiveDefense}
                activeLiveness={activeLiveness}
                expressLane={expressLane}
                currency={currency}
                setCurrency={setCurrency}
                currencySymbol={currencySymbol}
                decimals={decimals}
                formatPrice={formatPrice}
              />
            </div>

            {/* Add-on Features - Shown on Mobile After Price Summary */}
            <div className="lg:hidden space-y-8 lg:order-1">
              <AddOnFeatures
                adaptiveDefense={adaptiveDefense}
                setAdaptiveDefense={setAdaptiveDefense}
                activeLiveness={activeLiveness}
                setActiveLiveness={setActiveLiveness}
                expressLane={expressLane}
                setExpressLane={setExpressLane}
                currencySymbol={currencySymbol}
                formatPrice={formatPrice}
              />
              <ForensicAddOns currencySymbol={currencySymbol} formatPrice={formatPrice} />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl text-center mb-16">
          <p className="text-lg text-gray-300 sm:text-xl">
            Transparent pricing with no hidden fees.{' '}
            <span className="font-bold text-white">Scale confidently as your business grows.</span>
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto max-w-6xl">
          <PricingCards
            volume={volume}
            pricePerCheck={pricePerCheck}
            currencySymbol={currencySymbol}
            decimals={decimals}
            formatPrice={formatPrice}
          />
        </div>
      </section>
    </main>
  );
}
