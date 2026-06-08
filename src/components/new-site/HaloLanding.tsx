"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { trackCTA, trackEvent, trackFAQ } from "@/lib/analytics";
import SectionViewTracker from "@/components/SectionViewTracker";
import HaloStickyBar from "@/components/new-site/HaloStickyBar";

/* ------------------------------------------------------------------ */
/* Shared scroll-reveal wrapper (mirrors NewLanding's AnimatedSection) */
/* ------------------------------------------------------------------ */
const HALO_HERO_SESSION_KEY = "scamai_halo_hero_seen";

function Reveal({
  children,
  className = "",
  delay = 0,
  skipOnRepeat = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  skipOnRepeat?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (!skipOnRepeat) return;
    if (sessionStorage.getItem(HALO_HERO_SESSION_KEY)) {
      setSkip(true);
    } else {
      sessionStorage.setItem(HALO_HERO_SESSION_KEY, "1");
    }
  }, [skipOnRepeat]);

  if (skip) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero animation: live call frame with a scanning Halo ring that      */
/* cycles scanning -> deepfake detected verdict, on a loop.            */
/* ------------------------------------------------------------------ */
type ScanPhase = "scanning" | "detected";

function LiveCallScanner() {
  const [phase, setPhase] = useState<ScanPhase>("scanning");
  const [confidence, setConfidence] = useState(0);

  // State machine: scan for ~2.6s, hold verdict ~2.8s, repeat.
  useEffect(() => {
    let raf = 0;
    let mounted = true;

    const run = () => {
      setPhase("scanning");
      setConfidence(0);
      const scanFor = 2600;
      const start = performance.now();

      const tick = (now: number) => {
        if (!mounted) return;
        const t = Math.min((now - start) / scanFor, 1);
        // ease toward 98.7 while scanning
        setConfidence(Math.round(t * 987) / 10);
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setPhase("detected");
          setConfidence(98.7);
          window.setTimeout(() => {
            if (mounted) run();
          }, 2800);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    run();
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  const detected = phase === "detected";

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] blur-3xl transition-colors duration-700"
        style={{
          background: detected
            ? "rgba(239,68,68,0.18)"
            : "rgba(36,95,255,0.16)",
        }}
      />

      {/* Call window */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0f] shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            Live call &middot; 12:04
          </span>
        </div>

        {/* Video area */}
        <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-[#15161c] to-[#0a0a0d]">
          {/* "Caller" avatar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Scanning ring */}
              <svg
                viewBox="0 0 220 220"
                className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2"
              >
                <circle
                  cx="110"
                  cy="110"
                  r="96"
                  fill="none"
                  stroke={detected ? "#ef4444" : "#245FFF"}
                  strokeWidth="2.5"
                  strokeOpacity="0.25"
                />
                <motion.circle
                  cx="110"
                  cy="110"
                  r="96"
                  fill="none"
                  stroke={detected ? "#ef4444" : "#245FFF"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="603"
                  animate={
                    detected
                      ? { strokeDashoffset: 0, rotate: 0 }
                      : { strokeDashoffset: [603, 150], rotate: [0, 360] }
                  }
                  transition={
                    detected
                      ? { duration: 0.5 }
                      : { duration: 2.6, ease: "linear", repeat: 0 }
                  }
                  style={{ transformOrigin: "110px 110px" }}
                />
              </svg>

              {/* Face glyph */}
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/10">
                <svg
                  className="h-16 w-16 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                {/* horizontal scan sweep */}
                <AnimatePresence>
                  {!detected && (
                    <motion.div
                      className="absolute left-0 right-0 h-[2px] bg-[#245FFF]/80 shadow-[0_0_12px_#245FFF]"
                      initial={{ top: "8%" }}
                      animate={{ top: ["8%", "92%", "8%"] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Status chip top-left */}
          <div className="absolute left-3 top-3">
            <span className="rounded-md bg-black/50 px-2 py-1 text-[10px] font-medium text-gray-300 backdrop-blur">
              {detected ? "Frame 1,482" : "Analyzing…"}
            </span>
          </div>

          {/* Verdict overlay */}
          <div className="absolute inset-x-3 bottom-3">
            <AnimatePresence mode="wait">
              {detected ? (
                <motion.div
                  key="verdict"
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex items-center justify-between rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 backdrop-blur"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-red-400">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z" />
                    </svg>
                    Deepfake detected
                  </span>
                  <span className="font-mono text-sm font-bold text-red-300">
                    {confidence.toFixed(1)}%
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 backdrop-blur"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-[#7ea2ff]">
                    <svg className="h-4 w-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    Halo scanning video
                  </span>
                  <span className="font-mono text-sm text-gray-400">
                    {confidence.toFixed(1)}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* On-device badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
        <svg className="h-3.5 w-3.5 text-[#245FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Runs 100% on your device &middot; no recording, nothing sent
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ICP data: Finance vs HR                                            */
/* ------------------------------------------------------------------ */
type IcpKey = "finance" | "hr";

const ICP: Record<
  IcpKey,
  {
    tab: string;
    eyebrow: string;
    headline: React.ReactNode;
    fearTitle: string;
    fearBody: React.ReactNode;
    stat: string;
    statLabel: string;
    bullets: string[];
  }
> = {
  finance: {
    tab: "Finance",
    eyebrow: "FOR FINANCE & TREASURY",
    headline: (
      <>
        The voice approving the wire
        <br />
        might not be your CFO.
      </>
    ),
    fearTitle: "Synthetic-exec wire fraud",
    fearBody: (
      <>
        In 2024, a finance employee at engineering firm Arup joined a video call
        with what looked and sounded like their CFO and colleagues &mdash; every
        face on the call was a deepfake. They authorized{" "}
        <span className="font-semibold text-white">15 transfers totaling ~$25M</span>.
        The call looked completely normal. That&apos;s the new attack: real-time
        synthetic executives on routine approval calls.
      </>
    ),
    stat: "~$25M",
    statLabel: "lost in a single deepfake video call (Arup, 2024)",
    bullets: [
      "Flags synthetic faces and faceswaps live, before the transfer is approved.",
      "Protects treasury, AP, and exec assistants on every Zoom, Teams, Meet, WebEx, and Slack call.",
      "Leaves an on-device audit trail for fraud and compliance review.",
    ],
  },
  hr: {
    tab: "HR & Recruiting",
    eyebrow: "FOR HR & TALENT",
    headline: (
      <>
        The candidate on camera
        <br />
        may not be a real person.
      </>
    ),
    fearTitle: "Synthetic & face-swapped candidates",
    fearBody: (
      <>
        The FBI has warned of a surge in deepfake job applicants &mdash; people
        using real-time face-swaps and voice changers to pass remote interviews,
        often to land access to sensitive systems or to mask a different person
        doing the work. Gartner projects that{" "}
        <span className="font-semibold text-white">
          1 in 4 candidate profiles will be fake by 2028
        </span>
        . Your interview loop is now an identity checkpoint.
      </>
    ),
    stat: "1 in 4",
    statLabel: "candidate profiles projected fake by 2028 (Gartner)",
    bullets: [
      "Detects face-swap and AI-generated face replacements live during remote interviews.",
      "Catches faceswaps used to disguise a stand-in during the interview.",
      "Gives recruiters a confidence read without sending video to a third party.",
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Differentiators                                                    */
/* ------------------------------------------------------------------ */
// Order mirrors the HaloSpotlight pillars on the homepage:
// Real-Time \u2192 Secure (smaller attack surface) \u2192 Private.
const DIFFERENTIATORS = [
  {
    title: "Real-time, no round-trip",
    body: "Detection happens in the same moment as the call. There's no upload, queue, and download cycle — so a verdict lands while the call is still happening, not after the money's gone.",
    icon: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  },
  {
    title: "Smaller attack surface",
    body: "Cloud detectors add APIs, uploads, and third-party storage — each one a target. Halo keeps everything on the device: no network calls during detection, no frames in transit, no external servers holding your call data. Fewer moving parts, fewer ways in.",
    icon: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
  {
    title: "Private by design",
    body: "Video frames are analyzed in memory and discarded — nothing is recorded, stored, or transmitted. No cloud upload means no new honeypot of sensitive calls, and a far simpler path through legal, IT, and GDPR review.",
    icon: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" />
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Competitive framing                                                */
/* ------------------------------------------------------------------ */
const COMPETE_ROWS = [
  { label: "Works in real time on the live call", halo: true, cloud: false, platform: "partial" },
  { label: "Media stays on the device", halo: true, cloud: false, platform: false },
  { label: "Works across Zoom, Teams, Meet, WebEx & 10+ apps", halo: true, cloud: "partial", platform: false },
  { label: "No per-minute cloud GPU cost", halo: true, cloud: false, platform: "partial" },
  { label: "Detects synthetic media (not just liveness)", halo: true, cloud: true, platform: false },
  { label: "Protects the whole call, not just login", halo: true, cloud: true, platform: "partial" },
];

function Cell({ v }: { v: boolean | "partial" }) {
  if (v === "partial")
    return <span className="text-gray-500" title="Partial">&mdash;</span>;
  return v ? (
    <svg className="mx-auto h-5 w-5 text-[#245FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg className="mx-auto h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */
const FAQ = [
  {
    q: "What is Halo?",
    a: "Halo is an on-device deepfake detection application that monitors your video calls in real time and flags synthetic faces and faceswaps before they can fool you. It runs entirely on your Windows PC \u2014 no video frames ever leave your machine.",
  },
  {
    q: "Does my call data get uploaded anywhere?",
    a: "No. All detection runs locally on your device. Halo analyzes live frames in memory and discards them \u2014 it does not record, store, or transmit meeting video. Only detection verdicts and session metadata are kept, stored locally on your machine.",
  },
  {
    q: "Which apps does Halo work with?",
    a: "Halo works with 10+ meeting applications including Zoom, Microsoft Teams, Google Meet, WebEx, Skype, Slack huddles, GoTo Meeting, and others \u2014 both native desktop apps and browser-based meetings.",
  },
  {
    q: "Will it slow down my calls or drain my battery?",
    a: "Detection runs locally on your device, in parallel with your call. There is no network round-trip, so it adds no latency and minimal overhead.",
  },
  {
    q: "How accurate is it, and what about false positives?",
    a: "Halo uses an ensemble of two complementary AI models that must agree before a verdict is issued. This dramatically reduces false positives compared to single-model detectors. Each participant gets a verdict \u2014 Safe, Suspicious, or Deepfake \u2014 not a raw score.",
  },
  {
    q: "How is this different from my conferencing app's built-in security?",
    a: "Platform-native features focus on access and meeting controls, not on detecting whether a participant's face or voice is synthetic. Halo is purpose-built for real-time synthetic-media detection and works across every platform you use.",
  },
  {
    q: "What devices does Halo support?",
    a: "Halo runs on Windows 10/11, on both ARM64 and x86/x64 hardware. Minimum 4\u00a0GB RAM, ~1\u00a0GB disk space.",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Waitlist signup — calls DEK Issuance API directly                  */
/* ------------------------------------------------------------------ */
const HALO_WAITLIST_API =
  "https://dek-issuance-40198490972.us-central1.run.app/v2/waitlist";

type WaitlistState = "idle" | "loading" | "success" | "already_subscribed" | "error";
type ErrorKind = "validation" | "rate_limit" | "network" | "unknown";

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<WaitlistState>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;

    setState("loading");
    setErrorKind(null);
    trackCTA("join_waitlist", "halo_footer");

    try {
      const res = await fetch(HALO_WAITLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "halo_landing",
          referrer: document.referrer || window.location.href,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const isNew = !data.already_subscribed;
        setState(isNew ? "success" : "already_subscribed");
        trackEvent({
          action: "waitlist_signup",
          category: "conversion",
          label: isNew ? "halo_new_signup" : "halo_already_subscribed",
        });
        return;
      }

      const kind: ErrorKind = res.status === 429 ? "rate_limit" : res.status === 400 ? "validation" : "unknown";
      setErrorKind(kind);
      setState("error");
      trackEvent({ action: "waitlist_error", category: "conversion", label: `halo_${kind}` });
    } catch {
      setErrorKind("network");
      setState("error");
      trackEvent({ action: "waitlist_error", category: "conversion", label: "halo_network" });
    }
  }

  if (state === "success" || state === "already_subscribed") {
    return (
      <div className="mx-auto mt-9 w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#245FFF]/15 border border-[#245FFF]/25 mb-4">
          <svg className="w-6 h-6 text-[#245FFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white mb-1">
          {state === "already_subscribed"
            ? "You\u2019re already on the list!"
            : "You\u2019re on the list!"}
        </p>
        <p className="text-xs text-gray-400">
          {state === "already_subscribed"
            ? "Your 50% first-year discount is locked in \u2014 we\u2019ll reach out the moment Halo is ready."
            : "As an early member, you\u2019ll get 50% off your first year. We\u2019ll reach out the moment Halo is ready."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-9 flex w-full max-w-md flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Work email"
        disabled={state === "loading"}
        className="w-full rounded-full border border-white/15 bg-black/40 px-5 py-3.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#245FFF] disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#245FFF] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1d4acc] disabled:opacity-50"
      >
        {state === "loading" ? "Joining\u2026" : "Join the waitlist"}
      </button>
      {state === "error" && (
        <p className="text-sm text-red-400">
          {errorKind === "rate_limit"
            ? "Too many requests \u2014 please try again in a minute."
            : errorKind === "validation"
              ? "Please enter a valid email address."
              : errorKind === "network"
                ? "Network error \u2014 please check your connection and try again."
                : "Something went wrong \u2014 please try again."}
        </p>
      )}
    </form>
  );
}

export default function HaloLanding() {
  const [icp, setIcp] = useState<IcpKey>("finance");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const active = ICP[icp];

  return (
    <main className="bg-black text-white" role="main">
      {/* ============================ HERO ============================ */}
      <section id="halo-hero" className="relative overflow-hidden bg-black" aria-label="Halo — on-device deepfake detection">
        <SectionViewTracker name="halo_hero" />
        {/* backdrop */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 50% 0%, rgba(36,95,255,0.12) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(70% 60% at 50% 20%, #000 30%, transparent 80%)",
        }} />

        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-[80px] sm:px-8 sm:pt-[130px] lg:grid-cols-[7fr_5fr] lg:gap-10 lg:pb-28">
          {/* copy */}
          <div className="text-center lg:text-left">
            <Reveal delay={0.05} skipOnRepeat>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#245FFF]/30 bg-[#245FFF]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7ea2ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#245FFF]" />
                Now in early access
              </span>
            </Reveal>
            <Reveal delay={0.1} skipOnRepeat>
              <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Halo catches deepfakes on device.
              </h1>
            </Reveal>
            <Reveal delay={0.15} skipOnRepeat>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-300 lg:mx-0">
                On your device, in real time. Halo flags synthetic faces and
                faceswaps live on every call &mdash; before they cost you a
                wire transfer or a bad hire.
              </p>
            </Reveal>
            <Reveal delay={0.2} skipOnRepeat>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <a
                  href="#waitlist"
                  className="rainbow-button inline-block"
                  onClick={() => trackCTA("join_waitlist", "halo_hero")}
                >
                  <span className="rainbow-button-inner">Join the waitlist</span>
                </a>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-white"
                  onClick={() => trackCTA("watch_it_work", "halo_hero")}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  See how it works
                </a>
              </div>
            </Reveal>
          </div>

          {/* animation */}
          <Reveal delay={0.5} className="lg:pl-6">
            <LiveCallScanner />
          </Reveal>
        </div>
        <div className="section-divider" />
      </section>

      {/* ===================== THE SHIFT / PROBLEM ==================== */}
      <section className="relative overflow-hidden bg-black py-20 sm:py-28">
        <SectionViewTracker name="halo_problem" />
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:text-xs">
              The new attack surface
            </p>
            <h2 className="text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-5xl">
              Your calls just became
              <br className="hidden sm:block" /> a place to{" "}
              <span className="text-[#245FFF]">get attacked</span>.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Real-time face-swaps are good enough to pass as a
              colleague on a live video call. Email filters and login checks
              never see them &mdash; the fraud happens in the conversation
              itself.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===================== ICP VALUE PROP TOGGLE ================= */}
      <section
        className="relative overflow-hidden bg-black py-20 sm:py-28"
        aria-label="Value by team"
        style={{
          backgroundImage:
            "radial-gradient(55% 40% at 80% 10%, rgba(36,95,255,0.10) 0%, rgba(0,0,0,0) 70%)",
        }}
      >
        <SectionViewTracker name="halo_icp_toggle" />
        <div className="mx-auto max-w-6xl px-5">
          {/* toggle */}
          <div className="mb-12 flex justify-center">
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
              {(Object.keys(ICP) as IcpKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setIcp(key)}
                  className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:px-7 ${
                    icp === key ? "text-white" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {icp === key && (
                    <motion.span
                      layoutId="icp-pill"
                      className="absolute inset-0 rounded-full bg-[#245FFF]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{ICP[key].tab}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={icp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {/* left: headline + value */}
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#245FFF] sm:text-xs">
                  {active.eyebrow}
                </p>
                <h3 className="text-3xl font-bold leading-[1.12] sm:text-4xl">
                  {active.headline}
                </h3>
                <ul className="mt-8 space-y-4">
                  {active.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-gray-300">
                      <svg className="mt-1 h-5 w-5 flex-shrink-0 text-[#245FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* right: fear narrative card */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-7 sm:p-9">
                <div className="flex items-center gap-2 text-red-400">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z" />
                  </svg>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                    {active.fearTitle}
                  </span>
                </div>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-white sm:text-5xl">{active.stat}</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">{active.statLabel}</p>
                <p className="mt-5 leading-relaxed text-gray-300">{active.fearBody}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <div className="section-divider" />

      {/* ================== ON-DEVICE DIFFERENTIATORS ================ */}
      <section className="relative overflow-hidden bg-black py-20 sm:py-28">
        <SectionViewTracker name="halo_differentiators" />
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="mb-14 text-center">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:text-xs">
                Why on-device
              </p>
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
                Cloud detection can&apos;t keep up with a{" "}
                <span className="text-[#245FFF]">live call</span>.
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {DIFFERENTIATORS.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.12}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-[#245FFF]/40">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#245FFF]/10">
                    <svg className="h-6 w-6 text-[#245FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {d.icon}
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{d.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ========================= HOW IT WORKS ====================== */}
      <section id="how" className="relative overflow-hidden bg-black py-20 sm:py-28">
        <SectionViewTracker name="halo_how_it_works" />
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="mb-14 text-center">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#245FFF] sm:text-xs">
                How it works
              </p>
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
                Protection that lives on the call
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Install once", b: "Download Halo to your Windows PC. It sits in the system tray next to your conferencing app — no plugins, no browser extensions." },
              { n: "02", t: "Scans locally, live", b: "As you talk, Halo analyzes every face in the video frame-by-frame on your device — roughly 4 times per second." },
              { n: "03", t: "Flags in real time", b: "If a face looks synthetic, Halo surfaces an alert during the call — in time to stop and verify." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-7">
                  <span className="font-mono text-sm font-bold text-[#245FFF]">{s.n}</span>
                  <h3 className="mt-3 text-lg font-semibold text-white">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ====================== COMPETITIVE FRAMING ================== */}
      <section className="relative overflow-hidden bg-black py-20 sm:py-28">
        <SectionViewTracker name="halo_comparison" />
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="mb-14 text-center">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#245FFF] sm:text-xs">
                How Halo compares
              </p>
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
                Built for the live call, not the login
              </h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="px-5 py-4 text-sm font-medium text-gray-400">Capability</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-[#245FFF]">Halo</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-gray-400">Cloud detection APIs</th>
                    <th className="px-4 py-4 text-center text-sm font-medium text-gray-400">Platform-native</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETE_ROWS.map((r, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="px-5 py-4 text-sm text-gray-300">{r.label}</td>
                      <td className="bg-[#245FFF]/[0.04] px-4 py-4 text-center"><Cell v={r.halo} /></td>
                      <td className="px-4 py-4 text-center"><Cell v={r.cloud as boolean | "partial"} /></td>
                      <td className="px-4 py-4 text-center"><Cell v={r.platform as boolean | "partial"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              &mdash; = partial / depends on configuration. Comparison reflects typical capabilities, not any single named vendor.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ============================== FAQ ========================== */}
      <section className="relative overflow-hidden bg-black py-20 sm:py-28">
        <SectionViewTracker name="halo_faq" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="mb-14 text-center">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#245FFF] sm:text-xs">
                FAQ
              </p>
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
                Frequently asked questions
              </h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-800 transition-colors hover:border-gray-700"
                style={{ background: openFaq === i ? "rgba(36,95,255,0.03)" : "rgba(17,24,39,0.3)" }}
              >
                <button
                  onClick={() => {
                    if (openFaq !== i) trackFAQ(`halo: ${item.q}`);
                    setOpenFaq(openFaq === i ? null : i);
                  }}
                  className="flex w-full items-start justify-between px-5 py-5 text-left sm:px-7"
                  aria-expanded={openFaq === i}
                >
                  <span className="pr-8 font-semibold text-white">{item.q}</span>
                  <motion.svg
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-6 w-6 flex-shrink-0 text-[#245FFF]"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-6 leading-relaxed text-gray-300 sm:px-7">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ====================== FINAL CTA / WAITLIST ================= */}
      <section id="waitlist" className="relative overflow-hidden bg-black py-24 sm:py-32">
        <SectionViewTracker name="halo_waitlist" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 60% at 50% 50%, rgba(36,95,255,0.16) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold leading-[1.12] sm:text-4xl lg:text-5xl">
              Halo catches deepfakes on your calls.
              <br className="hidden sm:block" /> On your device, in real time.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-gray-300 sm:text-lg">
              Halo is in early access. Join the waitlist and we&apos;ll let you know the moment it&apos;s ready for your device.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-[#7ea2ff]">
              Join now and get 50% off your first year.
            </p>
            <WaitlistForm />
            <p className="mt-6 text-xs text-gray-500">Available on Windows &middot; Nothing leaves your device</p>
          </Reveal>
        </div>
      </section>

      {/* Apple-style floating CTA bar — appears after hero, hides at #waitlist */}
      <HaloStickyBar />
    </main>
  );
}
