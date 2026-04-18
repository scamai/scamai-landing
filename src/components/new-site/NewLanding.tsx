"use client";

import { useEffect, useState } from "react";

const SUGGESTIONS = [
  { emoji: "🖼️", label: "Check an image" },
  { emoji: "🎬", label: "Check a video" },
  { emoji: "🔗", label: "Paste a link" },
  { emoji: "📸", label: "Screenshot from chat" },
];

const DEMO_SCAN = {
  slug: "v7k2p9",
  verdict: "Likely AI-edited",
  confidence: 94,
  model: "SDXL",
  shareUrl: "scam.ai/s/v7k2p9",
};

const SCAN_STAGES: { label: string; color: PixelColor; pattern: PixelPattern }[] = [
  { label: "Scanning", color: "blue", pattern: "diagonal" },
  { label: "Reading pixels", color: "green", pattern: "row" },
  { label: "Cross-referencing", color: "amber", pattern: "scatter" },
  { label: "Verifying", color: "red", pattern: "ripple" },
];

type View = "home" | "scanning" | "result";

export default function NewLanding({
  locale: _locale = "en",
}: { locale?: string } = {}) {
  const [view, setView] = useState<View>("home");
  const [shareOpen, setShareOpen] = useState(false);

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
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[28px] bg-white/[0.08] px-4 py-3 backdrop-blur">
            <input
              type="text"
              placeholder={
                view === "result" ? "Ask about this scan…" : "Drop an image, paste a link…"
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
                <button
                  type="button"
                  aria-label="Options"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="2" />
                    <path d="M12 8h8" />
                    <path d="M4 8h2" />
                    <circle cx="16" cy="16" r="2" />
                    <path d="M4 16h8" />
                    <path d="M18 16h2" />
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
                    <button
                      type="button"
                      className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-sm text-white/80 transition hover:bg-white/5"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                      </svg>
                      Fast
                    </button>
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
    </main>
  );
}

function HomeView({ onPromptSelect }: { onPromptSelect: () => void }) {
  return (
    <section className="flex-1 px-6 pt-20 pb-40">
      <div className="mx-auto max-w-2xl">
        <div className="pt-16">
          <p className="text-3xl font-normal text-white/70 sm:text-4xl">Hi,</p>
          <h1 className="mt-1 text-[2.5rem] font-normal leading-[1.1] tracking-tight sm:text-5xl">
            What should we verify?
          </h1>
        </div>

        <div className="mt-10 flex flex-col items-start gap-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={onPromptSelect}
              className="flex items-center gap-3 rounded-full bg-white/[0.06] px-5 py-3 text-base text-white/90 transition hover:bg-white/[0.1]"
            >
              <span className="text-xl leading-none">{s.emoji}</span>
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
      <div className="mx-auto max-w-2xl space-y-5">
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
          <PixelLoader label={current.label} color={current.color} pattern={current.pattern} />
        </div>
      </div>
    </section>
  );
}

type PixelColor = "blue" | "green" | "red" | "amber";
type PixelPattern = "diagonal" | "row" | "scatter" | "ripple";

const PIXEL_COLORS: Record<PixelColor, { hex: string; glow: string }> = {
  blue:  { hex: "#3B82F6", glow: "rgba(59, 130, 246, 0.9)" },
  green: { hex: "#22C55E", glow: "rgba(34, 197, 94, 0.9)" },
  red:   { hex: "#EF4444", glow: "rgba(239, 68, 68, 0.9)" },
  amber: { hex: "#F59E0B", glow: "rgba(245, 158, 11, 0.9)" },
};

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
  color = "blue",
  pattern = "diagonal",
}: {
  label: string;
  color?: PixelColor;
  pattern?: PixelPattern;
}) {
  const c = PIXEL_COLORS[color];
  const GRID = 5;
  const STEP = 110;
  const cells = Array.from({ length: GRID * GRID }, (_, i) => {
    const r = Math.floor(i / GRID);
    const col = i % GRID;
    return { delay: cellDelay(r, col, pattern, STEP) };
  });

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className="pixel-halo absolute -inset-2.5 rounded-2xl blur-xl"
          style={{ backgroundColor: c.glow }}
        />
        <div
          className="relative grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
        >
          {cells.map((cell, i) => (
            <span
              key={i}
              className="pixel-cell block h-2 w-2 rounded-[2px] sm:h-2.5 sm:w-2.5"
              style={{
                ["--pixel-color" as string]: c.hex,
                ["--pixel-glow" as string]: c.glow,
                animationDelay: `${cell.delay}ms`,
              }}
            />
          ))}
        </div>
      </div>
      <span className="pixel-label text-lg font-semibold tracking-tight sm:text-xl">
        {label}
      </span>
    </div>
  );
}

function MiniPixel() {
  const c = PIXEL_COLORS.blue;
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
            ["--pixel-color" as string]: c.hex,
            ["--pixel-glow" as string]: c.glow,
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
      <div className="mx-auto max-w-2xl space-y-5">
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
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#245FFF] to-[#7B3FFF]">
              <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3L4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7L4.9 19.1M19.1 4.9l-1.4 1.4" />
              </svg>
            </div>
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
            </div>
            <div className="flex items-center justify-between border-t border-white/5 bg-black/30 px-5 py-2.5">
              <div className="flex items-center gap-2 text-[11px] text-white/50">
                <img src="/scamai-logo.svg" alt="" className="h-3.5 w-auto opacity-80" />
                <span className="font-mono">{DEMO_SCAN.shareUrl}</span>
              </div>
              <span className="text-[11px] text-white/40">Verified · 2s</span>
            </div>
          </div>

          {/* Primary share CTA */}
          <button
            type="button"
            onClick={onShare}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#245FFF] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-[#245FFF]/20 transition hover:bg-[#1E52E0] active:scale-[0.99]"
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
            onClick={onShare}
            className="-mt-2 flex w-full items-center justify-center gap-2 text-sm text-white/60 transition hover:text-white/90"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 17 4 12 9 7" />
              <path d="M20 18v-2a4 4 0 00-4-4H4" />
            </svg>
            Reply to whoever sent this to you
          </button>

          {/* Signals */}
          <div className="space-y-3 pt-2">
            <p className="text-sm text-white/80">
              Here&apos;s what Eva found across 3 detection models:
            </p>
            <div className="space-y-2">
              {[
                { label: "Diffusion fingerprint detected", sub: "SDXL, 92% match", tone: "red" },
                { label: "Skin texture inconsistency", sub: "High-frequency regions mismatch", tone: "red" },
                { label: "EXIF metadata stripped", sub: "Typical of regenerated content", tone: "amber" },
                { label: "Compression artifacts natural", sub: "Not a strong signal either way", tone: "neutral" },
              ].map((s) => (
                <div key={s.label} className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-4 py-3">
                  <span
                    className={`mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full ${
                      s.tone === "red" ? "bg-red-400" : s.tone === "amber" ? "bg-amber-400" : "bg-white/40"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{s.label}</div>
                    <div className="text-xs text-white/50">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Save
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Scan another
            </button>
          </div>

          {/* Follow-up suggestions */}
          <div className="pt-2">
            <div className="text-xs uppercase tracking-wider text-white/40">Follow up</div>
            <div className="mt-3 flex flex-col gap-2">
              {[
                "Show me the heatmap of edited regions",
                "Which AI model likely made this?",
                "How can I spot this myself next time?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/[0.08]"
                >
                  <span>{q}</span>
                  <svg className="h-4 w-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShareSheet({ onClose }: { onClose: () => void }) {
  const shareMessage = `ScamAI caught this — ${DEMO_SCAN.confidence}% likely AI-edited. Verify yours: ${DEMO_SCAN.shareUrl}`;
  const replyMessage = `Hey — I ran the thing you sent through ScamAI. It's ${DEMO_SCAN.confidence}% likely AI-edited. You can check things yourself at scam.ai 👀`;

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
          <h2 className="text-lg font-semibold text-white">Share this verdict</h2>
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
                <div className="flex items-center gap-1.5 text-[11px] text-red-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="font-semibold uppercase tracking-wider">Likely AI</span>
                </div>
                <div className="mt-0.5 text-base font-semibold text-white">
                  {DEMO_SCAN.confidence}% confidence
                </div>
                <div className="text-xs text-white/50">Model: {DEMO_SCAN.model}</div>
              </div>
              <img src="/scamai-logo.svg" alt="" className="h-5 w-auto opacity-90" />
            </div>
          </div>
          <div className="flex items-center justify-between bg-black px-4 py-2.5">
            <span className="font-mono text-xs text-white/50">{DEMO_SCAN.shareUrl}</span>
            <span className="text-[11px] text-white/40">Tap to verify yours</span>
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
