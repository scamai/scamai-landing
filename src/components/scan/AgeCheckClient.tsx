"use client";

import { useEffect, useState } from "react";

const DEMO_AGE = {
  lowEstimate: 25,
  highEstimate: 31,
};

type Stage = "intro" | "scanning" | "result";

export default function AgeCheckClient() {
  const [stage, setStage] = useState<Stage>("intro");
  const [consented, setConsented] = useState(false);
  const [includeInShare, setIncludeInShare] = useState(false);

  useEffect(() => {
    if (stage !== "scanning") return;
    const t = setTimeout(() => setStage("result"), 2400);
    return () => clearTimeout(t);
  }, [stage]);

  const start = () => {
    if (!consented) return;
    setStage("scanning");
  };

  const reset = () => {
    setStage("intro");
    setIncludeInShare(false);
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-white" role="main">
      <section className="flex-1 px-6 pt-20 pb-24">
        <div className="mx-auto max-w-xl">
          {/* Back to home */}
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to scam.ai
          </a>

          {/* Kicker */}
          <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-[#6B9FFF]">
            <span>🎂 Fun tool</span>
          </div>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Guess my age
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Upload a selfie — we&apos;ll estimate a range.
          </p>

          {stage === "intro" && (
            <IntroStage
              consented={consented}
              onConsentChange={setConsented}
              onStart={start}
            />
          )}
          {stage === "scanning" && <ScanningStage />}
          {stage === "result" && (
            <ResultStage
              includeInShare={includeInShare}
              onToggleShare={setIncludeInShare}
              onReset={reset}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function IntroStage({
  consented,
  onConsentChange,
  onStart,
}: {
  consented: boolean;
  onConsentChange: (v: boolean) => void;
  onStart: () => void;
}) {
  return (
    <>
      {/* Upload zone */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onStart}
          disabled={!consented}
          className="flex w-full flex-col items-center gap-3 rounded-3xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-10 text-center transition hover:border-white/40 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-8 w-8 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div>
            <div className="text-base font-medium text-white">Drop a selfie, or tap to upload</div>
            <div className="mt-1 text-xs text-white/50">JPG, PNG, HEIC · 4 MB max · ~2 seconds</div>
          </div>
        </button>
      </div>

      {/* Consent */}
      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">
        <span className="relative mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="peer absolute inset-0 cursor-pointer opacity-0"
          />
          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-white/30 transition peer-checked:border-[#245FFF] peer-checked:bg-[#245FFF]">
            {consented && (
              <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
        </span>
        <span className="text-sm leading-relaxed text-white/80">
          This photo is <span className="font-semibold text-white">of me</span> and I accept the disclaimer below.
        </span>
      </label>

      {/* Single liability disclaimer */}
      <p className="mt-4 text-[11px] leading-relaxed text-white/45">
        Age estimates are for entertainment only and are often wrong. Uploads may be stored per our{" "}
        <a href="/privacy" className="underline decoration-white/30 hover:text-white/70">privacy policy</a>.
        ScamAI is not liable for any result or how it&apos;s used.
      </p>
    </>
  );
}

function ScanningStage() {
  return (
    <div className="mt-16 flex flex-col items-center gap-6 py-10">
      <PixelGrid />
      <p className="text-base font-medium text-white/80">Looking at your face…</p>
    </div>
  );
}

function ResultStage({
  includeInShare,
  onToggleShare,
  onReset,
}: {
  includeInShare: boolean;
  onToggleShare: (v: boolean) => void;
  onReset: () => void;
}) {
  const rangeText = `${DEMO_AGE.lowEstimate}–${DEMO_AGE.highEstimate}`;
  const shareText = includeInShare
    ? `ScamAI guessed my age range: ${rangeText} 🎂 Try yours → scam.ai/age-check`
    : `Tried ScamAI's age-check. Guess yours → scam.ai/age-check`;

  return (
    <>
      {/* Range result card */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-[#245FFF]/25 bg-gradient-to-br from-[#245FFF]/15 via-[#245FFF]/5 to-transparent">
        <div className="p-6 text-center">
          <div className="text-xs uppercase tracking-widest text-[#6B9FFF]">Age range</div>
          <div className="mt-2 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            {rangeText}
          </div>
          <div className="mt-1 text-sm text-white/50">years old</div>
          <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed text-white/50">
            Based on facial features only. We never give a precise number — age models are
            routinely wrong, especially across skin tones and lighting.
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 bg-black/30 px-5 py-2.5">
          <div className="flex items-center gap-2 text-[11px] text-white/50">
            <img src="/scamai-logo.svg" alt="" className="h-3.5 w-auto opacity-80" />
            <span className="font-mono">scam.ai/age-check</span>
          </div>
          <span className="text-[11px] text-white/40">Estimate only · not liable</span>
        </div>
      </div>

      {/* Consent-gated share toggle */}
      <label className="mt-5 flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">
        <div className="pr-4">
          <div className="text-sm font-medium text-white">Include my age range in share</div>
          <div className="mt-0.5 text-xs text-white/50">Off by default — we only share the range if you explicitly opt in.</div>
        </div>
        <Toggle checked={includeInShare} onChange={onToggleShare} />
      </label>

      {/* Preview of share message */}
      <div className="mt-3 rounded-xl bg-white/[0.04] p-3">
        <div className="mb-1 text-[11px] uppercase tracking-wider text-white/40">Share preview</div>
        <p className="text-xs leading-relaxed text-white/70">{shareText}</p>
      </div>

      {/* Actions: share + download */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#245FFF] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#245FFF]/20 transition hover:bg-[#1E52E0]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-white/[0.06] py-2.5 text-sm text-white/80 transition hover:bg-white/[0.1]"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Try another
      </button>
    </>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
        checked ? "bg-[#245FFF]" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function PixelGrid() {
  const GRID = 5;
  const STEP = 110;
  const cells = Array.from({ length: GRID * GRID }, (_, i) => {
    const r = Math.floor(i / GRID);
    const col = i % GRID;
    return { delay: (r + col) * STEP };
  });
  return (
    <div
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
    >
      {cells.map((cell, i) => (
        <span
          key={i}
          className="pixel-cell block h-1.5 w-1.5 rounded-[1px] sm:h-2 sm:w-2"
          style={{
            ["--pixel-color" as string]: "#3B82F6",
            animationDelay: `${cell.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
