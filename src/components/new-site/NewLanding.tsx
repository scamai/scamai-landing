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
    a: "ScamAI Eva V1.6 achieves approximately 95% accuracy across 120+ generator types, including Midjourney v6, FLUX, Sora, Veo, StyleGAN3, FaceSwap, and DeepFaceLab. No detector is perfect, and newly released generators lag detection.",
  },
  {
    q: "Is it free?",
    a: "Yes. The first 2 scans require no account. Registered users get 20 scans per month free. Unlimited scans and a private-by-default result URL are $9/month.",
  },
  {
    q: "Are my scan results public?",
    a: "Anonymous scans produce a public result page by default at scam.ai/scan/[id]. Registered users can opt in or out of public sharing per scan. Don’t upload private or sensitive images.",
  },
  {
    q: "What image formats are supported?",
    a: "JPG, PNG, WebP, HEIC up to 4MB. Video and audio detection is available via the Pro API.",
  },
  {
    q: "How fast is it?",
    a: "Verdict in under 2 seconds for most images, via the Eva V1.6 inference path.",
  },
  {
    q: "What makes Eva different from Hive, Sensity, or AI or Not?",
    a: "Eva is an in-house model with published benchmarks, an honest uncertainty bucket, and a free tier that doesn't shrink with competitor volume. We publish our research, including known failure modes.",
  },
];

const DETECTED_GENERATORS = [
  "Midjourney v6",
  "FLUX",
  "Sora",
  "Veo",
  "DALL·E 3",
  "Stable Diffusion",
  "StyleGAN3",
  "FaceSwap",
  "DeepFaceLab",
  "Runway Gen-3",
  "Pika",
  "Adobe Firefly",
  "Ideogram",
  "Imagen",
  "Kling",
  "HeyGen",
];

const LIVE_PROOF = [
  {
    label: "Midjourney v6",
    verdict: "AI-manipulated",
    confidence: 98,
    tone: "red" as const,
    palette: "linear-gradient(135deg, #3b0d10, #7d1d1d)",
  },
  {
    label: "iPhone · studio",
    verdict: "Likely real",
    confidence: 92,
    tone: "green" as const,
    palette: "linear-gradient(135deg, #052e1b, #0b5d3a)",
  },
  {
    label: "FLUX · portrait",
    verdict: "AI-manipulated",
    confidence: 94,
    tone: "red" as const,
    palette: "linear-gradient(135deg, #1e1240, #4c2cab)",
  },
  {
    label: "Press photo",
    verdict: "Uncertain",
    confidence: 71,
    tone: "amber" as const,
    palette: "linear-gradient(135deg, #3a2a07, #7a5316)",
  },
];

const toneMap: Record<
  "red" | "green" | "amber",
  { dot: string; text: string; bg: string }
> = {
  red: { dot: "bg-red-400", text: "text-red-300", bg: "bg-red-500/10" },
  green: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
  },
  amber: { dot: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-500/10" },
};

export default function NewLanding({
  locale = "en",
}: { locale?: string } = {}) {
  return (
    <main className="bg-black text-white" role="main">
      <script {...jsonLdProps(softwareApplicationSchema())} />
      <script {...jsonLdProps(faqSchema(FAQ_ITEMS))} />

      {/* ──────────────────────────────────────────────────────────
          1. HERO
      ─────────────────────────────────────────────────────────── */}
      <section
        id="verify"
        className="relative px-5 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-28"
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
            ScamAI <span className="font-semibold text-white">Eva V1.6</span>{" "}
            detects deepfakes and AI-generated images across{" "}
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
            <span className="hidden sm:inline">·</span>
            <span>&lt; 2s results</span>
            <span className="hidden sm:inline">·</span>
            <span>SOC 2 Type II · GDPR</span>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. LIVE PROOF — what verdicts look like
      ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-white/[0.015] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
                Recent verdicts
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                What Eva catches.
              </h2>
            </div>
            <Link
              href={`/${locale}/trending`}
              className="hidden text-sm font-semibold text-[#245FFF] hover:underline sm:inline"
            >
              Live feed →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LIVE_PROOF.map((ex) => {
              const tone = toneMap[ex.tone];
              return (
                <Link
                  key={ex.label}
                  href={`/${locale}/trending`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div
                    className="relative aspect-video w-full"
                    style={{ background: ex.palette }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_50%)]" />
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
                      />
                      <span className={tone.text}>{ex.verdict}</span>
                      <span className="text-white/60">
                        · {ex.confidence}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white">
                      {ex.label}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Eva V1.6 · demo
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              href={`/${locale}/trending`}
              className="text-sm font-semibold text-[#245FFF] hover:underline"
            >
              Live feed →
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. HOW IT WORKS
      ─────────────────────────────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Three steps. No signup.
          </h2>

          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "01",
                t: "Drop or paste an image",
                d: "Drag-drop, paste from clipboard (Cmd+V), or paste a URL. JPG, PNG, WebP, HEIC up to 4MB.",
              },
              {
                n: "02",
                t: "Eva V1.6 analyzes it",
                d: "Our in-house model scores 120+ generator signals — face-swap, diffusion, metadata tampering — in under 2 seconds.",
              },
              {
                n: "03",
                t: "Get a public verdict",
                d: "Binary call + confidence + a shareable scam.ai/scan/[id] URL with an Open Graph verdict card.",
              },
            ].map((step) => (
              <li key={step.n} className="relative">
                <div className="font-mono text-xs font-bold text-[#245FFF]">
                  {step.n}
                </div>
                <h3 className="mt-2 text-lg font-semibold sm:text-xl">
                  {step.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {step.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. WHAT WE DETECT — 120+ generators
      ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-white/[0.015] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
            What we detect
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            120+ generator types — named, not generic.
          </h2>
          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base"
            data-speakable
          >
            Eva is benchmarked against current and historical generators —
            diffusion, GAN, face-swap, and voice-over-image composites.
            Here&rsquo;s a sample of what we score.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {DETECTED_GENERATORS.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-gray-200"
              >
                {name}
              </span>
            ))}
            <span className="rounded-full border border-[#245FFF]/40 bg-[#245FFF]/[0.08] px-3 py-1.5 text-xs font-semibold text-[#8ca3ff]">
              + 100 more
            </span>
          </div>

          <Link
            href={`/${locale}/research`}
            className="mt-8 inline-block text-sm font-semibold text-[#245FFF] hover:underline"
          >
            See our benchmarks →
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. HONEST LIMITS
      ─────────────────────────────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400 sm:text-xs">
            Honest limits
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            What we miss, and why it matters.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
            No detector is perfect. Eva is a fast, accurate signal —
            not a certainty. We publish what it doesn&rsquo;t do well,
            because overclaiming is worse than any false negative.
          </p>

          <ul className="mt-6 space-y-4">
            {[
              {
                t: "Brand-new generators lag.",
                d: "When a major new model ships (e.g. Sora, FLUX, Veo), Eva may score lower for a few weeks until the dataset retrains.",
              },
              {
                t: "Heavily compressed / low-res images reduce confidence.",
                d: "WhatsApp forwards and screenshots strip signal. Eva will flag these as Uncertain rather than guess.",
              },
              {
                t: "We don&rsquo;t prove intent.",
                d: "Eva tells you whether an image was generated or edited — not whether it was used maliciously. That context is yours to judge.",
              },
            ].map((lim) => (
              <li
                key={lim.t}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <p
                  className="text-sm font-semibold text-white"
                  dangerouslySetInnerHTML={{ __html: lim.t }}
                />
                <p
                  className="mt-1 text-sm text-gray-400"
                  dangerouslySetInnerHTML={{ __html: lim.d }}
                />
              </li>
            ))}
          </ul>

          <Link
            href={`/${locale}/research`}
            className="mt-8 inline-block text-sm font-semibold text-[#245FFF] hover:underline"
          >
            Read our methodology →
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. RESEARCH-BACKED STATS
      ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-white/[0.015] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
            Why it matters
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Research-backed. Numbers to quote.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "$40B",
                t: "projected deepfake fraud by 2027",
                c: "Deloitte",
                speakable: true,
              },
              {
                n: "95%",
                t: "Eva V1.6 detection accuracy",
                c: "ScamAI benchmark",
                speakable: true,
              },
              {
                n: "120+",
                t: "generator types scored",
                c: "FaceForensics++, DFDC, WildDeepfake, internal",
                speakable: true,
              },
              {
                n: "< 2s",
                t: "median time to verdict",
                c: "production p50",
                speakable: false,
              },
            ].map((s) => (
              <div
                key={s.t}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                {...(s.speakable ? { "data-speakable": "" } : {})}
              >
                <p className="text-3xl font-bold sm:text-4xl">{s.n}</p>
                <p className="mt-2 text-sm text-gray-300">{s.t}</p>
                <p className="mt-1 text-xs text-gray-500">{s.c}</p>
              </div>
            ))}
          </div>

          <Link
            href={`/${locale}/research`}
            className="mt-8 inline-block text-sm font-semibold text-[#245FFF] hover:underline"
          >
            Full research hub →
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          7. WHO'S USING SCAMAI
      ─────────────────────────────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
            Who uses it
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            From WhatsApp forwards to newsroom deadlines.
          </h2>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Journalists & fact-checkers",
                d: "Verify images before a byline goes up. One scan, one public URL, one less retraction.",
              },
              {
                t: "Parents & families",
                d: "That photo from a stranger claiming to be a relative. That kid on a dating app. A 2-second check.",
              },
              {
                t: "Dating & social platforms",
                d: "Profile-photo verification in the signup flow via the Eva API.",
              },
              {
                t: "KYC & identity",
                d: "Augment selfie-liveness with deepfake + face-swap detection.",
              },
              {
                t: "Newsrooms & publishers",
                d: "Slack alerts when a viral image matches a Eva-flagged pattern.",
              },
              {
                t: "Creators",
                d: "Prove a photo is yours with a public verdict URL readers can check.",
              },
            ].map((u) => (
              <li
                key={u.t}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
              >
                <p className="text-sm font-semibold text-white">{u.t}</p>
                <p className="mt-2 text-sm text-gray-400">{u.d}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link
              href={`/${locale}/enterprise`}
              className="font-semibold text-[#245FFF] hover:underline"
            >
              For platforms & newsrooms →
            </Link>
            <Link
              href={`/${locale}/developers`}
              className="font-semibold text-[#245FFF] hover:underline"
            >
              Developer API →
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          8. PRICING PREVIEW
      ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-white/[0.015] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
            Pricing
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Free for humans. Fair for businesses.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Anonymous
              </p>
              <p className="mt-2 text-3xl font-bold">Free</p>
              <p className="mt-1 text-xs text-gray-500">No signup</p>
              <p className="mt-5 text-sm text-gray-300">
                2 scans. Public result URL. Binary verdict + confidence.
              </p>
            </div>

            <div className="relative rounded-2xl border border-[#245FFF]/50 bg-[#245FFF]/[0.06] p-6">
              <span className="absolute -top-2 right-5 rounded-full bg-[#245FFF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Best for pros
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8ca3ff]">
                Paid
              </p>
              <p className="mt-2 text-3xl font-bold">
                $9<span className="text-base text-gray-400">/mo</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">or $79/yr</p>
              <p className="mt-5 text-sm text-gray-200">
                Unlimited. Private-by-default. Heatmap + signal breakdown.
                History + PDF export.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Developer API
              </p>
              <p className="mt-2 text-3xl font-bold">$99+</p>
              <p className="mt-1 text-xs text-gray-500">
                Hobby free · 100/mo
              </p>
              <p className="mt-5 text-sm text-gray-300">
                10K/mo at $99. 100K/mo at $499. Enterprise custom.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link
              href={`/${locale}/pricing`}
              className="font-semibold text-[#245FFF] hover:underline"
            >
              Full pricing →
            </Link>
            <Link
              href={`/${locale}/enterprise`}
              className="font-semibold text-gray-400 hover:text-white"
            >
              Enterprise →
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          9. FAQ
      ─────────────────────────────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Answers, not marketing.
          </h2>

          <div className="mt-8 divide-y divide-white/5 border-y border-white/5">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
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
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          10. FINAL CTA
      ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-gradient-to-b from-black to-[#04081a] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Have an image in mind?
          </h2>
          <p className="mt-4 text-sm text-gray-300 sm:text-base">
            Free. No signup for the first 2 scans. Under 2 seconds.
          </p>
          <a
            href="#verify"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 sm:text-base"
          >
            Verify an image →
          </a>
        </div>
      </section>
    </main>
  );
}
