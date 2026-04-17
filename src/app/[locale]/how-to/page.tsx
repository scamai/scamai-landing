import type { Metadata } from "next";
import Link from "next/link";
import { HOW_TO_ENTRIES } from "@/lib/seo/pages/how-to";
import { jsonLdProps, breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "How-to guides — verify images, spot deepfakes | ScamAI",
  description:
    "Plain-English how-to guides for verifying images, spotting deepfakes, and running fast checks on suspicious WhatsApp forwards and dating-app photos.",
};

export default async function HowToIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="bg-black text-white">
      <script {...jsonLdProps(breadcrumbSchema([
        { name: "Home", url: `/${locale}` },
        { name: "How-to", url: `/${locale}/how-to` },
      ]))} />

      <section className="mx-auto max-w-4xl px-5 pt-24 pb-10 sm:px-6 sm:pt-32">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">How-to guides</h1>
        <p className="mt-4 max-w-2xl text-sm text-gray-300 sm:text-base">
          Plain-English verification checklists for WhatsApp forwards, dating
          profiles, news photos, and face-swap deepfakes.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-6">
        <ul className="divide-y divide-white/5 border-y border-white/5">
          {HOW_TO_ENTRIES.map((e) => (
            <li key={e.slug} className="py-5">
              <Link href={`/${locale}/how-to/${e.slug}`} className="group block">
                <h2 className="text-base font-semibold text-white group-hover:underline sm:text-lg">
                  {e.title}
                </h2>
                <p className="mt-1 text-sm text-gray-400">{e.short}</p>
                <p className="mt-1 text-xs text-gray-500">{e.steps.length} steps</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
