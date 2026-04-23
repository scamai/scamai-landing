import type { Metadata } from "next";
import Link from "next/link";
import { IS_AI_ENTRIES } from "@/lib/seo/pages/is-ai";
import { jsonLdProps, breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Is it AI? — trending image verifications | ScamAI",
  description:
    "Editorial verdicts on the most-asked 'is this AI' questions — celebrities, viral memes, political deepfakes, romance-scam photos. Each backed by Eva V1.6.",
};

function verdictLabel(v: string) {
  if (v === "ai_generated") return "AI-generated";
  if (v === "real") return "Likely real";
  if (v === "mixed") return "Mixed";
  return "Uncertain";
}

export default async function IsAiIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="bg-black text-white">
      <script {...jsonLdProps(breadcrumbSchema([
        { name: "Home", url: `/${locale}` },
        { name: "Is it AI?", url: `/${locale}/is-ai` },
      ]))} />

      <section className="mx-auto max-w-4xl px-5 pt-24 pb-10 sm:px-6 sm:pt-32">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Is it AI?
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-gray-300 sm:text-base">
          Editorial verdicts on the images people keep asking about. Each
          backed by ScamAI Eva V1.6.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-6">
        <ul className="divide-y divide-white/5 border-y border-white/5">
          {IS_AI_ENTRIES.map((e) => (
            <li key={e.slug} className="py-5">
              <Link href={`/${locale}/is-ai/${e.slug}`} className="group block">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-white group-hover:underline sm:text-lg">
                      Is {e.subject} AI-generated?
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">{e.short}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                    {verdictLabel(e.verdict)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
