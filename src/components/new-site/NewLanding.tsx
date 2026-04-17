import { UploadZone } from "@/components/scan/UploadZone";
import {
  jsonLdProps,
  softwareApplicationSchema,
  faqSchema,
} from "@/lib/seo/schema";

export default function NewLanding({ locale = "en" }: { locale?: string } = {}) {
  return (
    <main className="bg-black text-white" role="main">
      <script {...jsonLdProps(softwareApplicationSchema())} />
      <script
        {...jsonLdProps(
          faqSchema([
            {
              q: "How accurate is ScamAI?",
              a: "ScamAI Eva V1.6 achieves approximately 95% accuracy across 120+ generator types, including Midjourney v6, FLUX, Sora, Veo, StyleGAN3, FaceSwap, and DeepFaceLab. No detector is perfect, and newly released generators lag detection.",
            },
            {
              q: "Is it free?",
              a: "Yes. The first 2 scans require no account. Registered users get 20 scans per month free. Unlimited scans and a private-by-default result URL are $9/month.",
            },
            {
              q: "Are my scan results public?",
              a: "Anonymous scans produce a public result page by default at scam.ai/scan/[id]. Registered users can opt in or out of public sharing per scan.",
            },
            {
              q: "What image formats are supported?",
              a: "JPG, PNG, WebP, HEIC up to 4MB. Video and audio detection is available via the Pro API.",
            },
            {
              q: "How fast is it?",
              a: "Verdict in under 2 seconds for most images, via the Eva V1.6 inference path.",
            },
          ]),
        )}
      />

      <section
        className="relative px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24"
        aria-label="Verify any image"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 sm:text-xs">
            AI Image Verification · Free · No signup for your first 2 scans
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Verify any image —{" "}
            <span className="text-[#245FFF]">free, in 2 seconds</span>
          </h1>
          <p
            className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg"
            data-speakable
          >
            ScamAI{" "}
            <span className="font-semibold text-white">Eva V1.6</span> detects
            deepfakes and AI-generated images across{" "}
            <span className="font-semibold text-white">
              120+ generator types
            </span>{" "}
            — Midjourney, Sora, FLUX, Veo, StyleGAN, FaceSwap — at{" "}
            <span className="font-semibold text-white">95% accuracy</span>. We
            tell you when we&rsquo;re uncertain.
          </p>

          <div className="mt-8 w-full">
            <UploadZone locale={locale} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] uppercase tracking-wider text-gray-500 sm:text-xs">
            <span>95% accuracy · 120+ types</span>
            <span>·</span>
            <span>&lt; 2s results</span>
            <span>·</span>
            <span>SOC 2 Type II · GDPR</span>
          </div>
        </div>
      </section>
    </main>
  );
}
