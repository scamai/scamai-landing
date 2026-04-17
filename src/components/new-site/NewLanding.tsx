import Link from "next/link";
import { UploadZone } from "@/components/scan/UploadZone";
import {
  jsonLdProps,
  softwareApplicationSchema,
  faqSchema,
} from "@/lib/seo/schema";

const FAQ_ITEMS = [
  {
    q: "How accurate is ScamAI?",
    a: "Eva V1.6 achieves about 95% accuracy across 120+ generator types. No detector is perfect, and newly released generators lag detection.",
  },
  {
    q: "Is it free?",
    a: "Your first 2 scans need no account. Registered users get 20 scans / month free. $9/month for unlimited + private scans + heatmap.",
  },
  {
    q: "Are my scan results public?",
    a: "Anonymous scans produce a public /scan/[id] URL by default. Don’t upload private or sensitive images. Registered users can toggle scans private.",
  },
];

export default function NewLanding({
  locale = "en",
}: { locale?: string } = {}) {
  return (
    <main className="bg-black text-white" role="main">
      <script {...jsonLdProps(softwareApplicationSchema())} />
      <script {...jsonLdProps(faqSchema(FAQ_ITEMS))} />

      {/* HERO — upload is the page */}
      <section
        id="verify"
        className="bg-black px-5 pt-20 pb-12 sm:px-6 sm:pt-28 sm:pb-20"
        aria-label="Verify any image"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h1 className="text-[clamp(2rem,8vw,3.5rem)] font-bold leading-[1.05] tracking-tight sm:leading-[1.02]">
            Verify any image — <span className="text-[#245FFF]">in 2 seconds</span>
          </h1>

          <div className="mt-8 w-full">
            <UploadZone locale={locale} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-black px-5 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Quick answers</h2>

          <div className="mt-5 divide-y divide-white/5 border-y border-white/5">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white sm:text-base">
                    {item.q}
                  </span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {item.a}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-6">
            <Link
              href={`/${locale}/pricing`}
              className="text-xs font-semibold text-gray-400 hover:text-white sm:text-sm"
            >
              Pricing →
            </Link>
            <span className="mx-3 text-gray-700">·</span>
            <Link
              href={`/${locale}/developers`}
              className="text-xs font-semibold text-gray-400 hover:text-white sm:text-sm"
            >
              Developer API →
            </Link>
            <span className="mx-3 text-gray-700">·</span>
            <Link
              href={`/${locale}/enterprise`}
              className="text-xs font-semibold text-gray-400 hover:text-white sm:text-sm"
            >
              Enterprise →
            </Link>
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-black px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
            Have an image in mind?
          </h2>
          <a
            href="#verify"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-gray-200 sm:text-base"
          >
            Verify an image →
          </a>
        </div>
      </section>
    </main>
  );
}
