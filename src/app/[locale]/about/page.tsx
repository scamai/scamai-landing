"use client";

import { useTranslations } from "next-intl";

interface ChangelogEntry {
  id: string;
  date: string;
  version: string;
  tagKeys: string[];
}

const changelogData: ChangelogEntry[] = [
  {
    id: "no-code-platform",
    date: "February 2, 2026",
    version: "3.0",
    tagKeys: ["platform", "product"],
  },
  {
    id: "enhanced-accuracy",
    date: "January 15, 2026",
    version: "2.1",
    tagKeys: ["ai", "performance"],
  },
  {
    id: "seed-funding",
    date: "December 15, 2025",
    version: "■",
    tagKeys: ["funding", "milestone"],
  },
  {
    id: "genai-detection",
    date: "December 10, 2025",
    version: "2.0",
    tagKeys: ["ai", "newFeature"],
  },
  {
    id: "audio-detection",
    date: "November 5, 2025",
    version: "1.5",
    tagKeys: ["audio", "newFeature"],
  },
  {
    id: "compliance",
    date: "August 25, 2025",
    version: "◆",
    tagKeys: ["security", "compliance"],
  },
  {
    id: "pre-seed-funding",
    date: "May 15, 2025",
    version: "■",
    tagKeys: ["funding", "milestone"],
  },
  {
    id: "product-hunt",
    date: "January 31, 2025",
    version: "★",
    tagKeys: ["award", "milestone"],
  },
  {
    id: "model-v01",
    date: "January 5, 2025",
    version: "0.1",
    tagKeys: ["launch", "ai"],
  },
];

export default function AboutPage() {
  const t = useTranslations("aboutPage");

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6" style={{ paddingTop: '180px', paddingBottom: '60px' }}>
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-8 text-5xl font-semibold sm:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
            {t.rich("hero.title", { br: () => <br /> })}
          </h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl sm:text-4xl font-semibold">{t("mission.heading")}</h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>{t("mission.paragraph1")}</p>
            <p>{t("mission.paragraph2")}</p>
            <p>{t("mission.paragraph3")}</p>
          </div>
        </div>
      </section>

      {/* Milestone Section */}
      <section className="py-16 px-4 sm:px-6 border-t border-gray-800" style={{ paddingBottom: '120px' }}>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl sm:text-4xl font-semibold">{t("milestone.heading")}</h2>

          <div className="relative">
            {changelogData.map((entry, index) => (
              <div key={entry.version} className="relative pb-12 last:pb-0">
                <div className="flex gap-6">
                  {/* Dot */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-3 h-3 bg-white rounded-full mt-1.5" />
                    {/* Vertical Line */}
                    {index < changelogData.length - 1 && (
                      <div className="absolute left-1/2 top-6 w-px h-[calc(100%+36px)] bg-gray-800 -translate-x-1/2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 relative">

                    <div className="space-y-3">
                      <div>
                        <time className="text-sm text-gray-400">{entry.date}</time>
                        <h3 className="text-xl font-semibold mt-1">{t(`milestone.entries.${entry.id}.title`)}</h3>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {entry.tagKeys.map((tagKey) => (
                          <span
                            key={tagKey}
                            className="px-2.5 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-full border border-gray-700"
                          >
                            {t(`milestone.tags.${tagKey}`)}
                          </span>
                        ))}
                      </div>

                      <p className="text-gray-400 leading-relaxed">
                        {t(`milestone.entries.${entry.id}.description`)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
