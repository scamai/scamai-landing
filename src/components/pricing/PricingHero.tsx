import { useTranslations } from "next-intl";

export function PricingHero() {
  const t = useTranslations("pricingPage");
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white sm:text-sm">
          {t("hero.eyebrow")}
        </p>
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
          {t.rich("hero.title", {
            highlight: (chunks) => <span className="text-[#0043FA]">{chunks}</span>,
          })}
        </h1>
        <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg lg:text-xl leading-relaxed">
          {t.rich("hero.description", {
            strong: (chunks) => <span className="font-semibold text-white">{chunks}</span>,
          })}
        </p>
      </div>
    </section>
  );
}
