"use client";

// ─── HaloSpotlight — flagship Halo + Qualcomm partnership band ──────────────
//
// Sits right below the faceswap playground: the playground shows the THREAT
// ("deepfake is here"), this band is the DEFENSE. It's the homepage's primary
// push for Halo — scam.ai's most important product right now — and foregrounds
// the Qualcomm / Snapdragon X partnership announced at Computex Taipei 2026.
// Echoes the launch poster: "Real-Time. Secure. Private." + on-device framing.

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Lock, Zap, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackCTA } from "@/lib/analytics";

const PILLARS = [
  { icon: Zap, label: "Real-Time", desc: "Verdict mid-call, not after" },
  { icon: Lock, label: "Secure", desc: "Catches synthetic faces & voices" },
  { icon: ShieldCheck, label: "Private", desc: "Nothing leaves your device" },
];

export default function HaloSpotlight() {
  return (
    <section
      id="halo"
      className="relative w-full overflow-hidden border-y border-white/[0.06] bg-[#04060d] py-20 sm:py-28"
      aria-label="Halo — on-device deepfake detection, in partnership with Qualcomm"
    >
      {/* Partnership gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 60% at 18% 30%, rgba(36,95,255,0.20), transparent 60%), radial-gradient(50% 60% at 85% 70%, rgba(16,185,129,0.12), transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
        {/* ─── Left: partnership + copy + CTAs ─── */}
        <div>
          {/* Co-brand lockup */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight text-white">scam.ai</span>
            <span className="h-5 w-px bg-white/25" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/qualcomm-logo.svg" alt="Qualcomm" className="h-[18px] w-auto opacity-90" />
          </div>

          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#245FFF]/30 bg-[#245FFF]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">
            On-device deepfake detection · Computex Taipei · Jun 2–5
          </p>

          <h2 className="mt-5 text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-[44px]">
            Meet Halo — deepfake defense that runs on your device.
          </h2>

          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
            You just saw how easy a deepfake is. Halo catches synthetic faces and
            cloned voices live on your Zoom, Teams, and Meet calls — before they cost
            you a wire transfer or a bad hire. All inference runs on the{" "}
            <span className="font-semibold text-white">Qualcomm Snapdragon X NPU</span>,
            so nothing ever leaves the device.
          </p>

          {/* Real-Time · Secure · Private pillars */}
          <div className="mt-7 grid grid-cols-3 gap-3 max-w-lg">
            {PILLARS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <Icon className="h-4 w-4 text-[#245FFF]" />
                <p className="mt-2 text-sm font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-white/45">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/halo"
              onClick={() => trackCTA("meet_halo", "halo_spotlight")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
            >
              Explore Halo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/halo"
              onClick={() => trackCTA("halo_waitlist", "halo_spotlight")}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Join the waitlist
            </Link>
          </div>

          <p className="mt-5 flex items-center gap-1.5 text-[11px] text-white/35">
            <Cpu className="h-3.5 w-3.5" />
            Powered by Snapdragon X Series · Coming soon on Windows &amp; macOS
          </p>
        </div>

        {/* ─── Right: on-device scanner card ─── */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c12] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#11141b] px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[11px] font-medium text-white/40">Live call · Halo</span>
              <span className="ml-auto text-[11px] tabular-nums text-white/30">12:04</span>
            </div>

            <div className="relative flex aspect-[4/3] items-center justify-center bg-[#06080e]">
              <p className="absolute left-4 top-3 text-[11px] text-white/40">Analyzing…</p>

              {/* Scanning ring */}
              <div className="relative flex h-40 w-40 items-center justify-center">
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-[#245FFF]/70"
                  style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                />
                <motion.span
                  className="absolute inset-3 rounded-full border border-[#6d5dfb]/40"
                  animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04]">
                  <svg viewBox="0 0 24 24" className="h-9 w-9 text-white/55" fill="currentColor">
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-9 2-9 6v2h18v-2c0-4-5-6-9-6z" />
                  </svg>
                </div>
              </div>

              {/* Verdict strip */}
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2.5">
                <span className="flex items-center gap-2 text-[13px] font-medium text-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Halo scanning audio + video
                </span>
                <span className="text-[13px] font-semibold tabular-nums text-white">98.7%</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-t border-white/[0.07] bg-[#0a0c12] px-4 py-2.5 text-[11px] text-white/40">
              <Lock className="h-3.5 w-3.5" />
              Runs 100% on your device · nothing uploaded
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
