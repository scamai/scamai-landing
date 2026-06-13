"use client";

import { useTranslations } from "next-intl";

interface ResourceCard {
  id: string;
  href: string;
  external: boolean;
  iconPath: string;
}

const resourceCards: ResourceCard[] = [
  {
    id: "documentation",
    href: "https://docu.scam.ai",
    external: true,
    iconPath:
      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    id: "security",
    href: "https://reality-inc.trust.site/",
    external: true,
    iconPath:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
];

interface PopularLink {
  id: string;
  href: string;
  external: boolean;
}

const popularLinks: PopularLink[] = [
  { id: "quickStart", href: "https://docu.scam.ai", external: true },
  { id: "apiReference", href: "https://docu.scam.ai", external: true },
  { id: "bestPractices", href: "https://docu.scam.ai", external: true },
  { id: "soc2", href: "https://reality-inc.trust.site/", external: true },
  { id: "gdpr", href: "https://reality-inc.trust.site/", external: true },
  { id: "support", href: "/contact", external: false },
];

interface HelpCard {
  id: string;
  href: string;
  external: boolean;
  iconPath: string;
}

const helpCards: HelpCard[] = [
  {
    id: "support",
    href: "/contact",
    external: false,
    iconPath:
      "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  },
  {
    id: "docs",
    href: "https://docu.scam.ai",
    external: true,
    iconPath:
      "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    id: "security",
    href: "https://reality-inc.trust.site/",
    external: true,
    iconPath:
      "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
];

export default function ResourcesPage() {
  const t = useTranslations("resourcesPage");

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#66b3ff]">
            {t("eyebrow")}
          </p>
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            {t("hero.heading")}
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            {t("hero.subheading")}
          </p>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {resourceCards.map((card) => (
              <a
                key={card.id}
                href={card.href}
                {...(card.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group rounded-lg border border-gray-800 bg-gray-900/40 p-8 hover:border-[#66b3ff] transition-colors"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#66b3ff]/10 group-hover:bg-[#66b3ff]/20 transition-colors">
                  <svg className="h-8 w-8 text-[#66b3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.iconPath} />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">{t(`cards.${card.id}.title`)}</h3>
                <p className="mb-4 text-gray-300">
                  {t(`cards.${card.id}.description`)}
                </p>
                <div className="text-[#66b3ff] group-hover:underline">
                  {t(`cards.${card.id}.cta`)} →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            {t("popular.heading")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularLinks.map((link) => (
              <div key={link.id} className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-6">
                <h3 className="mb-3 text-lg font-bold text-white">{t(`popular.links.${link.id}.title`)}</h3>
                <p className="mb-4 text-sm text-gray-300">
                  {t(`popular.links.${link.id}.description`)}
                </p>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-sm text-[#66b3ff] hover:underline"
                >
                  {t(`popular.links.${link.id}.cta`)} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            {t("help.heading")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {helpCards.map((card) => (
              <div key={card.id} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#66b3ff]/10">
                    <svg className="h-8 w-8 text-[#66b3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.iconPath} />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{t(`help.cards.${card.id}.title`)}</h3>
                <p className="mb-4 text-gray-300">
                  {t(`help.cards.${card.id}.description`)}
                </p>
                <a
                  href={card.href}
                  {...(card.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-[#66b3ff] hover:underline font-semibold"
                >
                  {t(`help.cards.${card.id}.cta`)}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            {t("cta.heading")}
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            {t("cta.subheading")}
          </p>
          <a
            href="https://app.scam.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="rainbow-button inline-block"
          >
            <span className="rainbow-button-inner">
              {t("cta.button")}
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
