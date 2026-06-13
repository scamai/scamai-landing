import { useTranslations } from "next-intl";
import {
  FREE_CHECKS,
  BASE_PRICE,
  ADAPTIVE_DEFENSE_PRICE,
  ACTIVE_LIVENESS_PRICE,
  EXPRESS_LANE_PRICE,
  type Currency,
} from './constants';

interface PriceSummaryProps {
  volume: number;
  pricePerCheck: number;
  monthlyEstimate: number;
  adaptiveDefense: boolean;
  activeLiveness: boolean;
  expressLane: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencySymbol: string;
  decimals: number;
  formatPrice: (price: number, forceDecimals?: number) => string;
}

export function PriceSummary({
  volume,
  pricePerCheck,
  monthlyEstimate,
  adaptiveDefense,
  activeLiveness,
  expressLane,
  currency,
  setCurrency,
  currencySymbol,
  decimals,
  formatPrice,
}: PriceSummaryProps) {
  const t = useTranslations("pricingPage");
  return (
    <div className="lg:sticky lg:top-8 h-fit">
      <div className="rounded-3xl bg-gradient-to-br from-[#0043FA]/20 to-gray-900/60 border-2 border-[#0043FA] p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">{t("summary.title")}</h3>

          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-[#0043FA] focus:outline-none focus:ring-2 focus:ring-[#0043FA]/20 cursor-pointer"
          >
            <option value="USD">🇺🇸 USD ($)</option>
            <option value="EUR">🇪🇺 EUR (€)</option>
            <option value="GBP">🇬🇧 GBP (£)</option>
            <option value="SGD">🇸🇬 SGD (S$)</option>
            <option value="HKD">🇭🇰 HKD (HK$)</option>
            <option value="JPY">🇯🇵 JPY (¥)</option>
            <option value="KRW">🇰🇷 KRW (₩)</option>
          </select>
        </div>

        {/* Price Per Check */}
        <div className="mb-8 pb-8 border-b border-gray-700">
          <p className="mb-2 text-sm text-gray-400 uppercase tracking-wider">{t("summary.pricePerCheck")}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">
              {currencySymbol}
              {volume <= FREE_CHECKS ? (decimals === 0 ? '0' : '0.00') : formatPrice(pricePerCheck)}
            </span>
            <span className="text-lg text-gray-400">{t("summary.perImage")}</span>
          </div>

          {volume <= FREE_CHECKS ? (
            <div className="mt-4 rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3">
              <p className="text-sm font-semibold text-green-400">{t("summary.withinFreeTier")}</p>
            </div>
          ) : (
            /* Breakdown */
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>{t("summary.baseDetection")}</span>
                <span className="font-semibold">
                  {currencySymbol}
                  {formatPrice(BASE_PRICE)}
                </span>
              </div>
              {adaptiveDefense && (
                <div className="flex justify-between text-gray-300">
                  <span>{t("summary.plusAdaptiveDefense")}</span>
                  <span className="font-semibold text-[#0043FA]">
                    +{currencySymbol}
                    {formatPrice(ADAPTIVE_DEFENSE_PRICE)}
                  </span>
                </div>
              )}
              {activeLiveness && (
                <div className="flex justify-between text-gray-300">
                  <span>{t("summary.plusActiveLiveness")}</span>
                  <span className="font-semibold text-[#0043FA]">
                    +{currencySymbol}
                    {formatPrice(ACTIVE_LIVENESS_PRICE)}
                  </span>
                </div>
              )}
              {expressLane && (
                <div className="flex justify-between text-gray-300">
                  <span>{t("summary.plusExpressLane")}</span>
                  <span className="font-semibold text-[#0043FA]">
                    +{currencySymbol}
                    {formatPrice(EXPRESS_LANE_PRICE)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Monthly Estimate */}
        <div className="mb-8">
          <p className="mb-2 text-sm text-gray-400 uppercase tracking-wider">{t("summary.totalMonthlyEstimate")}</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-[#0043FA]">
              {currencySymbol}
              {monthlyEstimate.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              })}
            </span>
            <span className="text-lg text-gray-400">{t("summary.perMonth")}</span>
          </div>

          {/* Monthly Breakdown */}
          <div className="space-y-2 text-sm">
            {volume <= FREE_CHECKS ? (
              <div className="flex justify-between text-gray-300">
                <span>{t("summary.imagesCount", { count: volume.toLocaleString() })}</span>
                <span className="font-semibold text-green-400">{t("summary.free")}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-gray-300">
                  <span>{t("summary.freeImages")}</span>
                  <span className="font-semibold text-green-400">{FREE_CHECKS.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>
                    {t("summary.paidImagesLine", {
                      count: (volume - FREE_CHECKS).toLocaleString(),
                      price: `${currencySymbol}${formatPrice(pricePerCheck)}`,
                    })}
                  </span>
                  <span className="font-semibold">
                    {currencySymbol}
                    {formatPrice((volume - FREE_CHECKS) * pricePerCheck)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="https://app.scam.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-[#0043FA] py-4 text-center text-lg font-semibold text-white hover:bg-[#0036C8] transition-colors shadow-lg shadow-[#0043FA]/20"
        >
          {t("summary.getStarted")} →
        </a>

        <p className="mt-4 text-center text-xs text-gray-400">{t("summary.ctaFootnote")}</p>
      </div>

      {/* Base Features */}
      <div className="mt-6 rounded-3xl bg-gray-900/40 border border-gray-700 p-6">
        <p className="mb-4 text-sm font-semibold text-white">{t("summary.baseIncludesLabel")}</p>
        <ul className="space-y-2 text-sm text-gray-300">
          {['genaiDeepfake', 'evaFast', 'restfulApi', 'dashboard'].map(
            (feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg className="h-5 w-5 flex-shrink-0 text-[#0043FA]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t(`summary.baseIncludes.${feature}`)}</span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
