import { UploadZone } from "@/components/scan/UploadZone";
import {
  jsonLdProps,
  softwareApplicationSchema,
  faqSchema,
} from "@/lib/seo/schema";

// FAQ schema kept in JSON-LD for SEO/AI-search even though the visible FAQ
// UI was removed at the user's request. FAQs still live on /faq-style pages
// (/how-to, /is-ai, /compare) — search engines will surface them via sitemap.
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

      <section
        id="verify"
        className="bg-black px-5 pt-24 pb-24 sm:px-6 sm:pt-36 sm:pb-32"
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
    </main>
  );
}
