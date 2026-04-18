"use client";

import { useEffect, useState } from "react";

const SUGGESTIONS = [
  { emoji: "🖼️", label: "Check an image" },
  { emoji: "🎬", label: "Check a video", note: "up to 5s free" },
  { emoji: "🎙️", label: "Check an audio clip", note: "up to 5s free" },
  { emoji: "📸", label: "Screenshot from chat" },
];

const DEMO_SCAN = {
  slug: "v7k2p9",
  verdict: "Likely AI-edited",
  confidence: 94,
  model: "SDXL",
  shareUrl: "scam.ai/s/v7k2p9",
  faceSwap: { detected: false, confidence: 0 },
};

const SCAN_STAGES: { label: string; pattern: PixelPattern }[] = [
  { label: "Scanning", pattern: "diagonal" },
  { label: "Reading pixels", pattern: "row" },
  { label: "Cross-referencing", pattern: "scatter" },
  { label: "Verifying", pattern: "ripple" },
];

type View = "home" | "scanning" | "result";
type Mode = "fast" | "full";

export default function NewLanding({
  locale: _locale = "en",
}: { locale?: string } = {}) {
  const [view, setView] = useState<View>("home");
  const [shareOpen, setShareOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("fast");
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);

  // Wait for cookie consent to be resolved before showing the intro modal
  useEffect(() => {
    if (typeof window === "undefined") return;
    const INTRO_KEY = "scamai_intro_seen";
    const CONSENT_KEY = "scamai_cookie_consent";
    const tryOpen = () => {
      const consent = localStorage.getItem(CONSENT_KEY);
      const seen = localStorage.getItem(INTRO_KEY);
      if ((consent === "accepted" || consent === "declined") && !seen) {
        setIntroOpen(true);
      }
    };
    tryOpen();
    const handler = () => setTimeout(tryOpen, 350);
    window.addEventListener("cookie-consent-set", handler);
    return () => window.removeEventListener("cookie-consent-set", handler);
  }, []);

  const closeIntro = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("scamai_intro_seen", "1");
    }
    setIntroOpen(false);
  };

  const startScan = () => setView("scanning");

  useEffect(() => {
    if (view !== "scanning") return;
    const t = setTimeout(() => setView("result"), SCAN_STAGES.length * 900 + 200);
    return () => clearTimeout(t);
  }, [view]);

  return (
    <main className="flex min-h-screen flex-col bg-black text-white" role="main">
      {view === "home" && <HomeView onPromptSelect={startScan} />}
      {view === "scanning" && <ScanningView />}
      {view === "result" && (
        <ResultView onReset={() => setView("home")} onShare={() => setShareOpen(true)} />
      )}

      {/* Bottom input bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black via-black/95 to-transparent px-4 pb-5 pt-6">
        <div className="mx-auto max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <div className="liquid-glass rounded-[28px] px-4 py-3">
            <input
              type="text"
              placeholder={
                view === "result" ? "Ask about this scan…" : "Drop image, audio, or video…"
              }
              className="w-full bg-transparent text-base text-white placeholder-white/50 outline-none"
              onFocus={() => view === "home" && startScan()}
              readOnly
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Upload"
                  onClick={startScan}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                {view === "scanning" ? (
                  <div className="flex h-9 items-center rounded-full bg-[#245FFF]/15 px-3">
                    <MiniPixel />
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setModeMenuOpen((v) => !v)}
                        className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-sm text-white/80 transition hover:bg-white/5"
                      >
                        {mode === "fast" ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 2 8 12 14 22 8 12 2" />
                            <polyline points="2 12 12 18 22 12" />
                            <polyline points="2 16 12 22 22 16" />
                          </svg>
                        )}
                        <span>{mode === "fast" ? "Fast" : "Full"}</span>
                        {mode === "full" && (
                          <span className="rounded-sm bg-[#245FFF]/40 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-white">Pro</span>
                        )}
                        <svg className={`h-3.5 w-3.5 transition-transform ${modeMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {modeMenuOpen && (
                        <>
                          <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setModeMenuOpen(false)}
                            className="fixed inset-0 z-40 cursor-default"
                          />
                          <div className="absolute bottom-full right-0 z-50 mb-2 min-w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl">
                            <ModeItem
                              selected={mode === "fast"}
                              onClick={() => { setMode("fast"); setModeMenuOpen(false); }}
                              icon={(
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                                </svg>
                              )}
                              title="Fast"
                              sub="2s scan · binary verdict"
                            />
                            <ModeItem
                              selected={mode === "full"}
                              onClick={() => { setMode("full"); setModeMenuOpen(false); }}
                              icon={(
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="12 2 2 8 12 14 22 8 12 2" />
                                  <polyline points="2 12 12 18 22 12" />
                                  <polyline points="2 16 12 22 22 16" />
                                </svg>
                              )}
                              title="Full"
                              sub="Signals · deepfake detection"
                              badge="PRO"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label="Scan"
                      onClick={startScan}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/90"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {shareOpen && <ShareSheet onClose={() => setShareOpen(false)} />}
      {introOpen && <IntroModal onClose={closeIntro} />}
    </main>
  );
}

function IntroModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0b0b0b] shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero: iris with concentric halo rings */}
        <div className="relative h-48 w-full overflow-hidden bg-black">
          {/* Ambient radial blur */}
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#245FFF]/20 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7B3FFF]/25 blur-2xl" />
          </div>
          {/* Iris in center with bright halo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-[#6B9FFF]/40 via-[#245FFF]/30 to-[#7B3FFF]/30 blur-xl" />
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#6B9FFF]/60 to-[#7B3FFF]/60 blur-md" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#3b5ef0] via-[#6b5dff] to-[#8d5dff] shadow-2xl ring-4 ring-white/15">
                <img src="/logo.svg" alt="ScamAI" className="h-12 w-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Copy + actions */}
        <div className="px-6 pb-6 pt-5">
          <h2 className="text-xl font-semibold text-white">
            ScamAI now checks audio and video
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Drop anything suspicious — screenshots, clips, or voice notes. We&apos;ll tell you
            if it&apos;s AI-edited in about 2 seconds.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Upgrade to{" "}
            <span className="underline decoration-[#6B9FFF]/50 underline-offset-2 text-white">Full</span>{" "}
            for signal breakdown and deepfake detection.
          </p>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#6B9FFF] transition hover:bg-white/5"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#6B9FFF] px-5 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#85B0FF]"
            >
              Try it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeView({ onPromptSelect }: { onPromptSelect: () => void }) {
  return (
    <section className="flex-1 px-6 pt-20 pb-40 md:flex md:items-center md:justify-center md:pb-44 md:pt-24">
      <div className="mx-auto w-full max-w-2xl">
        <div className="pt-16 md:pt-0 md:text-center">
          <p className="text-3xl font-normal text-white/70 sm:text-4xl">Hi,</p>
          <h1 className="mt-1 text-[2.5rem] font-normal leading-[1.05] tracking-tight sm:text-5xl md:mt-1.5">
            What should we verify?
          </h1>
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 md:mt-10 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-2.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={onPromptSelect}
              className="flex items-center gap-3 rounded-full bg-white/[0.06] px-5 py-3 text-base text-white/90 transition hover:bg-white/[0.1] md:text-sm"
            >
              <span className="text-xl leading-none md:text-base">{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScanningView() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s + 1) % SCAN_STAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);
  const current = SCAN_STAGES[stage];
  return (
    <section className="flex-1 px-5 pt-20 pb-40">
      <div className="mx-auto max-w-2xl md:max-w-3xl space-y-5">
        {/* User's submitted image + question — blue bubbles */}
        <div className="flex justify-end pt-4">
          <div className="flex max-w-[80%] flex-col items-end gap-2">
            <div className="h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 ring-2 ring-[#245FFF]/50">
              <div className="flex h-full w-full items-center justify-center">
                <svg className="h-10 w-10 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            </div>
            <div className="rounded-2xl bg-[#245FFF] px-4 py-2.5 text-sm text-white">
              Is this real or AI?
            </div>
          </div>
        </div>

        {/* Assistant loader */}
        <div className="pt-3">
          <PixelLoader label={current.label} pattern={current.pattern} />
        </div>
      </div>
    </section>
  );
}

type PixelPattern = "diagonal" | "row" | "scatter" | "ripple";

const PIXEL_BLUE = "#3B82F6";

// deterministic scatter — positions 0..24 shuffled so adjacent cells don't fire consecutively
const SCATTER_ORDER = [12, 3, 18, 7, 21, 0, 14, 9, 23, 5, 16, 2, 11, 24, 6, 19, 1, 15, 22, 8, 13, 4, 20, 10, 17];

function cellDelay(r: number, c: number, pattern: PixelPattern, step: number) {
  if (pattern === "row") return r * step * 1.8;
  if (pattern === "ripple") return Math.round(Math.hypot(r - 2, c - 2) * step * 1.6);
  if (pattern === "scatter") return SCATTER_ORDER[r * 5 + c] * (step * 0.6);
  return (r + c) * step;
}

function PixelLoader({
  label,
  pattern = "diagonal",
}: {
  label: string;
  pattern?: PixelPattern;
}) {
  const GRID = 5;
  const STEP = 110;
  const cells = Array.from({ length: GRID * GRID }, (_, i) => {
    const r = Math.floor(i / GRID);
    const col = i % GRID;
    return { delay: cellDelay(r, col, pattern, STEP) };
  });

  return (
    <div className="flex items-center gap-2">
      <div
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
      >
        {cells.map((cell, i) => (
          <span
            key={i}
            className="pixel-cell block h-1 w-1 rounded-[1px] sm:h-1.5 sm:w-1.5"
            style={{
              ["--pixel-color" as string]: PIXEL_BLUE,
              animationDelay: `${cell.delay}ms`,
            }}
          />
        ))}
      </div>
      <span className="pixel-label text-sm font-semibold tracking-tight sm:text-base">
        {label}
      </span>
    </div>
  );
}

function MiniPixel() {
  const GRID = 3;
  const STEP = 140;
  const cells = Array.from({ length: GRID * GRID }, (_, i) => {
    const r = Math.floor(i / GRID);
    const col = i % GRID;
    return { delay: (r + col) * STEP };
  });
  return (
    <div
      className="relative grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
    >
      {cells.map((cell, i) => (
        <span
          key={i}
          className="pixel-cell block h-1.5 w-1.5 rounded-[2px]"
          style={{
            ["--pixel-color" as string]: PIXEL_BLUE,
            animationDelay: `${cell.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

function ResultView({
  onReset,
  onShare,
}: {
  onReset: () => void;
  onShare: () => void;
}) {
  return (
    <section className="flex-1 px-5 pt-20 pb-40">
      <div className="mx-auto max-w-2xl md:max-w-3xl space-y-5">
        {/* User message */}
        <div className="flex justify-end pt-4">
          <div className="flex max-w-[80%] flex-col items-end gap-2">
            <div className="h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 ring-2 ring-[#245FFF]/50">
              <div className="flex h-full w-full items-center justify-center">
                <svg className="h-10 w-10 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            </div>
            <div className="rounded-2xl bg-[#245FFF] px-4 py-2.5 text-sm text-white">
              Is this real or AI?
            </div>
          </div>
        </div>

        {/* Assistant response */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <img src="/logo.svg" alt="" className="h-4 w-4" />
            <span>ScamAI Eva v1.6 — fast</span>
          </div>

          {/* Verdict card (brand-baked for screenshot virality) */}
          <div className="overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/15 via-red-500/5 to-transparent">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xl font-semibold text-white">{DEMO_SCAN.verdict}</div>
                  <div className="mt-0.5 text-sm text-white/60">{DEMO_SCAN.confidence}% confidence</div>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-red-400" style={{ width: `${DEMO_SCAN.confidence}%` }} />
              </div>

              {DEMO_SCAN.faceSwap.detected && (
                <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-red-500/15 px-3 py-2 ring-1 ring-red-500/30">
                  <svg className="h-4 w-4 flex-shrink-0 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 10h.01" />
                    <path d="M16 10h.01" />
                    <path d="M9 15c.5.6 1.5 1 3 1s2.5-.4 3-1" />
                    <path d="M3 8l4-4M21 8l-4-4M3 16l4 4M21 16l-4 4" />
                  </svg>
                  <div className="flex-1 text-sm">
                    <span className="font-medium text-red-100">Face-swap detected</span>
                    <span className="ml-1.5 text-red-200/70">· {DEMO_SCAN.faceSwap.confidence}% match on face region</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-white/5 bg-black/30 px-5 py-2.5">
              <div className="flex items-center gap-2 text-[11px] text-white/50">
                <img src="/scamai-logo.svg" alt="" className="h-3.5 w-auto opacity-80" />
                <span className="font-mono">{DEMO_SCAN.shareUrl}</span>
              </div>
              <span className="text-[11px] text-white/40">Verified · 2s</span>
            </div>
          </div>

          {/* AI disclaimer */}
          <p className="flex items-start gap-1.5 px-1 text-[11px] leading-relaxed text-white/40">
            <svg className="mt-[2px] h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <span>AI can be wrong. Always cross-check with the source before acting on it.</span>
          </p>

          {/* Primary actions: Share + Download */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onShare}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#245FFF] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-[#245FFF]/20 transition hover:bg-[#1E52E0] active:scale-[0.99]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-4 text-base font-semibold text-white transition hover:bg-white/15 active:scale-[0.99]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          </div>

          {/* Signals teaser — locked behind Pro */}
          <button
            type="button"
            className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.06]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <svg className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white">4 signals support this result</div>
                <div className="text-xs text-white/50">Full breakdown · deepfake detection</div>
              </div>
            </div>
            <span className="rounded-full bg-[#245FFF]/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#6B9FFF]">
              Pro
            </span>
          </button>

          {/* Scan another — single secondary action */}
          <button
            type="button"
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white/[0.06] py-2.5 text-sm text-white/80 transition hover:bg-white/[0.1]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Scan another
          </button>
        </div>
      </div>
    </section>
  );
}

function ModeItem({
  selected,
  onClick,
  icon,
  title,
  sub,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
        selected ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
      }`}
    >
      <span className="mt-0.5 text-white/80">{icon}</span>
      <span className="flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-white">{title}</span>
          {badge && (
            <span className="rounded-sm bg-[#245FFF]/40 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-white">{badge}</span>
          )}
        </span>
        <span className="mt-0.5 block text-xs text-white/50">{sub}</span>
      </span>
      {selected && (
        <svg className="mt-1 h-4 w-4 text-[#6B9FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}

function ShareSheet({ onClose }: { onClose: () => void }) {
  const faceNote = DEMO_SCAN.faceSwap.detected
    ? ` + face-swap detected (${DEMO_SCAN.faceSwap.confidence}%)`
    : "";
  const shareMessage = `ScamAI caught this — ${DEMO_SCAN.confidence}% likely AI-edited${faceNote}. Verify yours: ${DEMO_SCAN.shareUrl}`;
  const replyMessage = `Hey — I ran the thing you sent through ScamAI. It's ${DEMO_SCAN.confidence}% likely AI-edited${faceNote}. You can check things yourself at scam.ai 👀`;

  const channels = [
    { name: "WhatsApp", color: "bg-[#25D366]", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
      </svg>
    ) },
    { name: "X", color: "bg-black border border-white/20", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ) },
    { name: "Telegram", color: "bg-[#26A5E4]", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ) },
    { name: "Messages", color: "bg-[#30D158]", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2C6.5 2 2 6 2 11c0 2.5 1.2 4.8 3.2 6.3L4 22l5-2.4c1 .3 2 .4 3 .4 5.5 0 10-4 10-9s-4.5-9-10-9z" />
      </svg>
    ) },
    { name: "Copy link", color: "bg-white/10", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ) },
    { name: "Save image", color: "bg-white/10", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ) },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-t-3xl bg-[#111] p-5 pb-8 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Share this result</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="mb-5 overflow-hidden rounded-2xl ring-1 ring-white/10">
          <div className="bg-gradient-to-br from-red-500/20 via-zinc-900 to-black p-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 ring-1 ring-white/10" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-red-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="font-semibold uppercase tracking-wider">Likely AI</span>
                  {DEMO_SCAN.faceSwap.detected && (
                    <span className="rounded-sm bg-red-500/25 px-1.5 py-px font-semibold uppercase tracking-wider text-red-100">
                      Face-swap
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-base font-semibold text-white">
                  {DEMO_SCAN.confidence}% confidence
                </div>
              </div>
              <img src="/scamai-logo.svg" alt="" className="h-5 w-auto opacity-90" />
            </div>
          </div>
          <div className="flex items-center justify-between bg-black px-4 py-2.5">
            <span className="font-mono text-xs text-white/50">{DEMO_SCAN.shareUrl}</span>
            <span className="text-[11px] text-white/40">Tap to verify yours</span>
          </div>
          <div className="border-t border-white/5 bg-black px-4 py-1.5 text-[10px] text-white/40">
            AI can be wrong — cross-check with the source.
          </div>
        </div>

        <div className="mb-5 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {channels.map((c) => (
            <button key={c.name} type="button" className="flex flex-col items-center gap-2">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${c.color}`}>
                {c.icon}
              </span>
              <span className="text-[11px] text-white/70">{c.name}</span>
            </button>
          ))}
        </div>

        <div className="mb-3 rounded-2xl border border-[#245FFF]/30 bg-[#245FFF]/10 p-4">
          <div className="mb-1 flex items-center gap-2">
            <svg className="h-4 w-4 text-[#6B9FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <polyline points="9 17 4 12 9 7" />
              <path d="M20 18v-2a4 4 0 00-4-4H4" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B9FFF]">
              Reply to whoever sent this
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/90">&ldquo;{replyMessage}&rdquo;</p>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#245FFF] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E52E0]"
          >
            Send reply →
          </button>
        </div>

        <div className="rounded-xl bg-white/[0.04] p-3">
          <div className="mb-1 text-[11px] uppercase tracking-wider text-white/40">Or share everywhere</div>
          <p className="text-xs leading-relaxed text-white/70">{shareMessage}</p>
        </div>
      </div>
    </div>
  );
}
