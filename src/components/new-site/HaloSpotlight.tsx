"use client";

// ─── HaloSpotlight — flagship Halo + Qualcomm partnership band ──────────────
//
// Sits right below the faceswap playground: the playground shows the THREAT
// ("deepfake is here"), this band is the DEFENSE. It's the homepage's primary
// push for Halo — scam.ai's most important product right now — and foregrounds
// the Qualcomm / Snapdragon X partnership announced at Computex Taipei 2026.
// Echoes the launch poster: "Real-Time. Secure. Private." + on-device framing.

import { ShieldCheck, Lock, Zap, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackCTA } from "@/lib/analytics";

const PILLARS = [
  { icon: Zap, label: "Real-Time", desc: "Flags threats during the live call" },
  { icon: Lock, label: "Secure", desc: "Synthetic faces & faceswaps" },
  { icon: ShieldCheck, label: "Private", desc: "On-device — no recording, nothing sent" },
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

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 lg:gap-12 lg:grid-cols-2">
        {/* ─── Left: partnership + copy + CTAs ─── */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Co-brand lockup — real logos, not type */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/scamai-logo.svg" alt="scam.ai" className="h-6 w-auto" />
            <span className="h-5 w-px bg-white/25" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/qualcomm-logo.svg" alt="Qualcomm" className="h-[18px] w-auto opacity-90" />
          </div>

          <h2 className="mt-6 text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-[44px]">
            Halo catches deepfakes on device.
          </h2>

          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
            You just saw how easy a deepfake is. On your device, in real time, Halo
            flags{" "}
            <span className="font-semibold text-white">synthetic faces and faceswaps</span>{" "}
            live on every call — before they cost you a wire transfer or a bad hire.
          </p>

          {/* Real-Time · Secure · Private pillars */}
          <div className="mt-7 grid w-full grid-cols-1 gap-2 text-left min-[420px]:grid-cols-3 sm:gap-3 lg:max-w-lg">
            {PILLARS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <Icon className="h-4 w-4 text-[#245FFF]" />
                <p className="mt-2 text-sm font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-white/60">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 lg:items-start">
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

        </div>

        {/* ─── Right: on-device scanner card ─── */}
        <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c12] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#11141b] px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-red-500/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Live call
              </span>
              <span className="ml-auto text-[11px] tabular-nums text-white/60">12:04</span>
            </div>

            <div className="relative flex aspect-[4/3] items-center justify-center bg-[#06080e]">
              {/* Detected state — Halo caught a faceswap on the call (CSS-only, SSR-safe) */}
              <div className="relative flex h-40 w-40 items-center justify-center">
                <span
                  className="absolute inset-0 animate-spin motion-reduce:animate-none rounded-full border-2 border-red-500/70 [border-right-color:transparent] [border-top-color:transparent]"
                  style={{ animationDuration: "2.4s" }}
                />
                <span className="absolute inset-3 animate-pulse motion-reduce:animate-none rounded-full border border-red-500/40" />
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04]">
                  <svg viewBox="0 0 24 24" className="h-9 w-9 text-white/55" fill="currentColor">
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-9 2-9 6v2h18v-2c0-4-5-6-9-6z" />
                  </svg>
                </div>
              </div>

              {/* Verdict strip — deepfake caught */}
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-2.5">
                <span className="flex items-center gap-2 text-[13px] font-medium text-red-200">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-red-500/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  Deepfake detected
                </span>
                <span className="text-[13px] font-semibold text-white">Caught</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-t border-white/[0.07] bg-[#0a0c12] px-4 py-2.5 text-[11px] text-white/60">
              <Lock className="h-3.5 w-3.5" />
              Runs 100% on your device · no recording, nothing sent
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
