import type { Metadata } from "next";
import Link from "next/link";
import { listRecentPublicScans } from "@/lib/db/scans";
import { VerdictBadge } from "@/components/scan/VerdictBadge";
import { jsonLdProps, breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Trending scans — what the internet is verifying right now | ScamAI",
  description:
    "Browse the most-scanned suspicious images verified by ScamAI Eva V1.6 — deepfakes, AI-generated imagery, manipulated photos — updated live.",
};

export const revalidate = 60;

function verdictLabel(verdict: string): string {
  if (verdict === "likely_ai_manipulated") return "Likely AI-manipulated";
  if (verdict === "likely_real") return "Likely real";
  return "Uncertain";
}

export default async function TrendingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let scans: Awaited<ReturnType<typeof listRecentPublicScans>> = [];
  try {
    scans = await listRecentPublicScans(24);
  } catch (err) {
    console.error("[trending] db not ready:", err);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <script {...jsonLdProps(breadcrumbSchema([
        { name: "Home", url: `/${locale}` },
        { name: "Trending", url: `/${locale}/trending` },
      ]))} />

      <section className="mx-auto max-w-6xl px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#245FFF]">
          Live feed
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          What the internet is verifying right now.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-gray-300 sm:text-base">
          The most-scanned suspicious images today. Click through to see the Eva V1.6 verdict.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        {scans.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-10 text-center">
            <p className="text-lg font-semibold text-white">No public scans yet.</p>
            <p className="mt-2 text-sm text-gray-400">
              Be the first —{" "}
              <Link href={`/${locale}`} className="text-[#245FFF] underline">
                verify an image
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scans.map((scan) => (
              <Link
                key={scan.id}
                href={`/${locale}/scan/${scan.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                {scan.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={scan.image_url}
                    alt={verdictLabel(scan.verdict)}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="aspect-video w-full" />
                )}
                <div className="p-4">
                  <VerdictBadge verdict={scan.verdict} confidence={Number(scan.confidence)} />
                  <p className="mt-3 text-sm font-semibold text-white">
                    {verdictLabel(scan.verdict)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(scan.created_at).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
