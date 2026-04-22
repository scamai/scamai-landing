"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@/contexts/UserContext";

const ANON_SCAN_LIMIT = 2;
const FREE_MONTHLY_LIMIT = 20;

type ScanResult = {
  verdict: string;
  confidencePct: number;
  aiImage: { detected: boolean; confidence: number; processingMs?: number } | null;
  faceSwap: { detected: boolean; confidence: number; numFaces: number; modelVersion?: string | null } | null;
  latencyMs: number;
};

const SUGGESTION_KEYS = [
  { emoji: "🖼️", labelKey: "suggestions.checkImage" as const },
  { emoji: "🎬", labelKey: "suggestions.checkVideo" as const, noteKey: "suggestions.freeNote" as const },
  { emoji: "🎙️", labelKey: "suggestions.checkAudio" as const, noteKey: "suggestions.comingSoon" as const },
  { emoji: "📸", labelKey: "suggestions.screenshot" as const },
  { emoji: "📞", labelKey: "suggestions.checkPhone" as const, noteKey: "suggestions.comingSoon" as const },
  { emoji: "📧", labelKey: "suggestions.checkEmail" as const, noteKey: "suggestions.comingSoon" as const },
];

const DEMO_SCAN = {
  slug: "v7k2p9",
  verdict: "Likely AI-edited",
  confidence: 94,
  model: "SDXL",
  shareUrl: "scam.ai/s/v7k2p9",
  faceSwap: { detected: false, confidence: 0 },
};

const SCAN_STAGE_KEYS: { labelKey: string; pattern: PixelPattern }[] = [
  { labelKey: "scanStages.scanning", pattern: "diagonal" },
  { labelKey: "scanStages.readingPixels", pattern: "row" },
  { labelKey: "scanStages.crossReferencing", pattern: "scatter" },
  { labelKey: "scanStages.verifying", pattern: "ripple" },
];

type View = "home" | "scanning" | "result";
type Mode = "fast" | "full";

export default function NewLanding({
  locale: _locale = "en",
}: { locale?: string } = {}) {
  const t = useTranslations("NewLanding");
  const { user } = useUser();
  const [view, setView] = useState<View>("home");
  const [shareOpen, setShareOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("fast");
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [upgradeGateOpen, setUpgradeGateOpen] = useState(false);
  const [anonScansUsed, setAnonScansUsed] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const startScan = useCallback(() => {
    if (!user && anonScansUsed >= ANON_SCAN_LIMIT) {
      setGateOpen(true);
      return;
    }
    if (user && user.plan === "free" && (user.scansThisMonth ?? 0) >= FREE_MONTHLY_LIMIT) {
      setUpgradeGateOpen(true);
      return;
    }
    fileInputRef.current?.click();
  }, [user, anonScansUsed]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setScanError(t("errors.pickImage"));
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setScanError(null);
    setScanResult(null);
    setView("scanning");

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/scan", { method: "POST", body: form });
      const data = await res.json();

      if (res.status === 429) {
        if (data.reachedAnonLimit) {
          setAnonScansUsed(data.anonScansUsed ?? ANON_SCAN_LIMIT);
          setGateOpen(true);
        } else if (data.upgradeUrl) {
          setUpgradeGateOpen(true);
        }
        setView("home");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Scan failed");

      setScanResult(data);
      if (!user) setAnonScansUsed(data.anonScansUsed ?? 0);
      setView("result");
    } catch (err) {
      console.error("[scan] failed:", err);
      setScanError(err instanceof Error ? err.message : "Scan failed");
      setView("home");
    }
  }, [previewUrl, user, t]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  const inputBarProps: InputBarProps = useMemo(() => ({
    view,
    mode,
    setMode,
    modeMenuOpen,
    setModeMenuOpen,
    startScan,
  }), [view, mode, modeMenuOpen, startScan]);

  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);
  const onDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }, [handleFile]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="flex min-h-screen flex-col bg-black text-white" role="main">
        <section className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-6 pt-20 pb-40">
          <div className="mx-auto w-full max-w-2xl md:text-center">
            <p className="text-3xl font-normal text-white/70 sm:text-4xl">{t("home.greeting")}</p>
            <h1 className="mt-1 text-[2.5rem] font-normal leading-[1.05] tracking-tight sm:text-5xl">
              {t("home.headline")}
            </h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col bg-black text-white"
      role="main"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-white/30 px-16 py-12">
            <svg className="h-12 w-12 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-lg font-semibold text-white">Drop image to scan</p>
            <p className="text-sm text-white/50">We&apos;ll verify it in ~2 seconds</p>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        aria-hidden="true"
      />
      {view === "home" && (
        <HomeView
          onPromptSelect={startScan}
          onPasteFile={handleFile}
          inputBarProps={inputBarProps}
          error={scanError}
          anonScansUsed={anonScansUsed}
        />
      )}
      {view === "scanning" && <ScanningView previewUrl={previewUrl} />}
      {view === "result" && (
        <ResultView
          onReset={() => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setScanResult(null);
            setView("home");
          }}
          onShare={() => setShareOpen(true)}
          previewUrl={previewUrl}
          scan={scanResult}
        />
      )}

      {/* Mobile-fixed input bar — hidden on desktop home (HomeView renders inline there) */}
      <div className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black via-black/95 to-transparent px-4 pb-5 pt-6 ${view === "home" ? "md:hidden" : ""}`}>
        <div className="pointer-events-auto mx-auto max-w-2xl">
          <InputBar {...inputBarProps} />
        </div>
      </div>

      {shareOpen && <ShareSheet onClose={() => setShareOpen(false)} previewUrl={previewUrl} />}
      {introOpen && <IntroModal onClose={closeIntro} />}
      {gateOpen && (
        <RegisterGate
          anonScansUsed={anonScansUsed}
          onClose={() => setGateOpen(false)}
        />
      )}
      {upgradeGateOpen && (
        <UpgradeGate
          scansUsed={user?.scansThisMonth ?? FREE_MONTHLY_LIMIT}
          onClose={() => setUpgradeGateOpen(false)}
        />
      )}
    </main>
  );
}

function useGoogleLogin(onSuccess: () => void) {
  const { login } = useUser();
  const oneTapRef = useRef<HTMLDivElement>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const g = (window as unknown as Record<string, unknown>).google as
      | { accounts: { id: { initialize: (cfg: Record<string, unknown>) => void; renderButton: (el: HTMLElement, cfg: Record<string, unknown>) => void; prompt: () => void } } }
      | undefined;
    if (!g?.accounts?.id || !oneTapRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    g.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        setLoading(true);
        try {
          await login(response.credential);
          onSuccess();
        } catch (err) {
          setAuthError(err instanceof Error ? err.message : "Login failed");
        } finally {
          setLoading(false);
        }
      },
    });

    g.accounts.id.renderButton(oneTapRef.current, {
      theme: "filled_black",
      size: "large",
      shape: "pill",
      width: 320,
      text: "continue_with",
    });
  }, [login, onSuccess]);

  const triggerPopup = useCallback(() => {
    const g = (window as unknown as Record<string, unknown>).google as
      | { accounts: { oauth2: { initCodeClient: (cfg: Record<string, unknown>) => { requestCode: () => void } } } }
      | undefined;
    if (g?.accounts?.oauth2) {
      const client = g.accounts.oauth2.initCodeClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "email profile",
        ux_mode: "popup",
      });
      client.requestCode();
    }
  }, []);

  return { oneTapRef, authError, loading, triggerPopup };
}

function GoogleButton({ onClick, loading, label }: { onClick: () => void; loading: boolean; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full max-w-[320px] items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-800 shadow-lg transition hover:bg-gray-50 disabled:opacity-60"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      {loading ? "..." : label}
    </button>
  );
}

function RegisterGate({
  anonScansUsed,
  onClose,
}: {
  anonScansUsed: number;
  onClose: () => void;
}) {
  const t = useTranslations("NewLanding");
  const { oneTapRef, authError, loading } = useGoogleLogin(onClose);

  const handleGoogleClick = useCallback(() => {
    const g = (window as unknown as Record<string, unknown>).google as
      | { accounts: { id: { prompt: () => void } } }
      | undefined;
    g?.accounts?.id?.prompt();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0b0b0b] shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-36 w-full overflow-hidden bg-black">
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 shadow-2xl ring-2 ring-white/10">
              <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="text-xs uppercase tracking-widest text-white/40">
            {anonScansUsed}/{ANON_SCAN_LIMIT} free scans used
          </div>
          <h2 className="mt-2 text-xl font-semibold text-white">
            {t("gate.hitLimit")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Sign in with Google to get <span className="font-semibold text-white">20 free scans every month</span> — no credit card needed.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <div ref={oneTapRef} className="hidden" />
            <GoogleButton
              onClick={handleGoogleClick}
              loading={loading}
              label={t("gate.signUpFree")}
            />
            {authError && (
              <p className="text-xs text-red-400">{authError}</p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-1 text-xs text-white/40 transition hover:text-white/70"
            >
              {t("gate.maybeLater")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpgradeGate({
  scansUsed,
  onClose,
}: {
  scansUsed: number;
  onClose: () => void;
}) {
  const t = useTranslations("NewLanding");

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0b0b0b] shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-44 w-full overflow-hidden bg-black">
          <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl ring-4 ring-white/15">
              <svg className="h-9 w-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="text-xs uppercase tracking-widest text-amber-400">
            {t("upgrade.scansUsed", { used: scansUsed, total: FREE_MONTHLY_LIMIT })}
          </div>
          <h2 className="mt-2 text-xl font-semibold text-white">
            {t("upgrade.hitLimit")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {t("upgrade.desc")}
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href="/pricing"
              className="flex w-full max-w-[320px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-amber-400 hover:to-orange-400"
            >
              {t("upgrade.cta")}
            </a>
            <button
              type="button"
              onClick={onClose}
              className="mt-1 text-xs text-white/40 transition hover:text-white/70"
            >
              {t("gate.maybeLater")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type InputBarProps = {
  view: View;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  modeMenuOpen: boolean;
  setModeMenuOpen: Dispatch<SetStateAction<boolean>>;
  startScan: () => void;
};

function InputBar({ view, mode, setMode, modeMenuOpen, setModeMenuOpen, startScan }: InputBarProps) {
  const t = useTranslations("NewLanding");
  return (
    <div className="liquid-glass rounded-[28px] px-4 py-3">
      <input
        type="text"
        placeholder={view === "result" ? t("inputBar.askAboutScan") : t("inputBar.dropMedia")}
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
                  <span>{mode === "fast" ? t("mode.fast") : t("mode.full")}</span>
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
                    <div className="absolute bottom-full right-0 z-50 mb-2 min-w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                      <ModeItem
                        selected={mode === "fast"}
                        onClick={() => { setMode("fast"); setModeMenuOpen(false); }}
                        icon={(
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                          </svg>
                        )}
                        title={t("mode.fast")}
                        sub={t("mode.fastSub")}
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
                        title={t("mode.full")}
                        sub={t("mode.fullSub")}
                        badge={t("mode.pro")}
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
  );
}

function IntroModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("NewLanding");
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0b0b0b] shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 w-full overflow-hidden bg-black">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-white/15 to-white/5 shadow-2xl ring-4 ring-white/10">
              <img src="/logo.svg" alt="ScamAI" className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Copy + actions */}
        <div className="px-6 pb-6 pt-5">
          <h2 className="text-xl font-semibold text-white">
            {t("intro.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {t("intro.desc1")}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {t("intro.desc2Prefix")}{" "}
            <span className="underline decoration-white/30 underline-offset-2 text-white">{t("intro.desc2Full")}</span>{" "}
            {t("intro.desc2Suffix")}
          </p>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/50 transition hover:bg-white/5 hover:text-white/70"
            >
              {t("intro.close")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              {t("intro.tryIt")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeView({
  onPromptSelect,
  onPasteFile,
  inputBarProps,
  error,
  anonScansUsed,
}: {
  onPromptSelect: () => void;
  onPasteFile: (file: File) => void;
  inputBarProps: InputBarProps;
  error: string | null;
  anonScansUsed: number;
}) {
  const t = useTranslations("NewLanding");
  const { user } = useUser();
  const scansLeft = user ? FREE_MONTHLY_LIMIT - (user.scansThisMonth ?? 0) : Math.max(0, ANON_SCAN_LIMIT - anonScansUsed);

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const file = e.clipboardData?.files?.[0];
      if (file?.type.startsWith("image/")) {
        e.preventDefault();
        onPasteFile(file);
      }
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [onPasteFile]);

  return (
    <section className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-6 pt-20 pb-40 md:px-8 md:pb-16 md:pt-20">
      <div className="mx-auto w-full max-w-2xl md:flex md:flex-col md:items-center md:gap-7">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-200">
            {error}
          </div>
        )}
        {/* Greeting */}
        <div className="pt-16 md:pt-0 md:text-center">
          <p className="text-3xl font-normal text-white/70 sm:text-4xl">{t("home.greeting")}</p>
          <h1 className="mt-1 text-[2.5rem] font-normal leading-[1.05] tracking-tight sm:text-5xl md:mt-1.5">
            {t("home.headline")}
          </h1>
        </div>

        {/* Paste-first prompt */}
        <button
          type="button"
          onClick={onPromptSelect}
          className="group mt-6 flex items-center gap-2 rounded-full border border-dashed border-white/20 bg-white/[0.03] px-5 py-3 text-sm text-white/50 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white/70 md:mt-0"
        >
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-white/60">
            {typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘V" : "Ctrl+V"}
          </kbd>
          <span>Paste an image to scan instantly</span>
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white/40 group-hover:bg-white/60" />
        </button>

        {/* Desktop: inline input below the greeting */}
        <div className="hidden w-full md:block">
          <InputBar {...inputBarProps} />
          <div className="mt-2 text-center text-xs text-white/40">
            {scansLeft > 0
              ? `${scansLeft} free scan${scansLeft === 1 ? "" : "s"} left · `
              : "Scan limit reached · "}
            {!user && (
              <button
                type="button"
                onClick={onPromptSelect}
                className="text-white/60 underline decoration-white/20 hover:text-white"
              >
                Sign in for 20/month free
              </button>
            )}
          </div>
          <p className="mt-1.5 text-center text-xs text-amber-200/60">
            Scan results are public by default. Don&apos;t upload private or sensitive images.
          </p>
        </div>

        {/* Active pills */}
        <div className="mt-10 flex flex-col items-start gap-3 md:mt-0 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-2">
          {SUGGESTION_KEYS.filter((s) => s.noteKey !== ("suggestions.comingSoon" as string)).map((s) => (
            <button
              key={s.labelKey}
              type="button"
              onClick={onPromptSelect}
              className="flex items-center gap-3 rounded-full bg-white/[0.06] px-5 py-3 text-base text-white/90 transition hover:bg-white/[0.1] md:px-4 md:py-2 md:text-sm"
            >
              <span className="text-xl leading-none md:text-base">{s.emoji}</span>
              <span>{t(s.labelKey)}</span>
              {s.noteKey && (
                <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] text-white/50">
                  {t(s.noteKey)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Coming soon — vote to unlock */}
        <ComingSoonSection />

        {/* Feedback / mission */}
        <FeedbackSection />
      </div>
    </section>
  );
}

function ComingSoonSection() {
  const t = useTranslations("NewLanding");
  const comingSoonItems = SUGGESTION_KEYS.filter((s) => s.noteKey === ("suggestions.comingSoon" as string));
  const [revealed, setRevealed] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("scamai_voted_done") === "1") setHidden(true);
  }, []);

  useEffect(() => {
    if (!hasVoted) return;
    const timer = setTimeout(() => {
      localStorage.setItem("scamai_voted_done", "1");
      setHidden(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [hasVoted]);

  if (hidden) return null;

  return (
    <div className={`mt-6 flex flex-col items-start gap-2 transition-opacity duration-1000 md:mt-4 md:items-center ${hasVoted ? "opacity-60" : ""}`}>
      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-sm text-white/40 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white/60"
        >
          {t("home.comingSoonHint")}
        </button>
      ) : (
        <>
          <p className="text-xs text-white/30 md:text-center">{t("home.comingSoonHintRevealed")}</p>
          <div className="flex flex-col items-start gap-2 md:flex-row md:flex-wrap md:justify-center">
            {comingSoonItems.map((s) => (
              <ComingSoonPill key={s.labelKey} emoji={s.emoji} labelKey={s.labelKey} onVote={() => setHasVoted(true)} />
            ))}
          </div>
          {hasVoted && (
            <p className="mt-1 text-xs text-emerald-400/70 md:text-center">{t("home.voteThanks")}</p>
          )}
        </>
      )}
    </div>
  );
}

function ComingSoonPill({ emoji, labelKey, onVote }: { emoji: string; labelKey: string; onVote: () => void }) {
  const t = useTranslations("NewLanding");
  const storageKey = `scamai_vote_${labelKey}`;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  const handleLike = () => {
    if (liked) return;
    localStorage.setItem(storageKey, "1");
    setLiked(true);
    onVote();
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      className={`group flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm transition md:py-2 ${
        liked
          ? "border-white/[0.06] bg-white/[0.03] text-white/40"
          : "border-white/[0.06] bg-white/[0.03] text-white/40 hover:border-white/10 hover:bg-white/[0.05] hover:text-white/60"
      }`}
    >
      <span className="text-base leading-none">{emoji}</span>
      <span>{t(labelKey)}</span>
      <span className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] ${
        liked ? "bg-pink-500/20 text-pink-400" : "bg-white/[0.06] text-white/30 group-hover:text-pink-400/60"
      }`}>
        {liked ? (
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        ) : (
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        )}
        {liked ? t("home.voted") : t("home.vote")}
      </span>
    </button>
  );
}

function FeedbackSection() {
  const t = useTranslations("NewLanding");
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      setSubmitted(true);
      setMessage("");
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500/10 px-5 py-3 text-sm text-emerald-400 md:mt-6">
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {t("feedback.thanks")}
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="mt-10 flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-3 text-sm text-white/40 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-white/60 md:mt-6"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        {t("feedback.title")}
      </button>
    );
  }

  return (
    <div className="mt-10 w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-5 md:mt-6">
      <p className="text-sm font-medium text-white/80">{t("feedback.title")}</p>
      <p className="mt-1 text-xs leading-relaxed text-white/40">{t("feedback.mission")}</p>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={t("feedback.placeholder")}
          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#245FFF]/40 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!message.trim() || sending}
          className="shrink-0 rounded-xl bg-[#245FFF]/20 px-4 py-2.5 text-sm font-medium text-[#6B9FFF] transition hover:bg-[#245FFF]/30 disabled:opacity-40"
        >
          {t("feedback.send")}
        </button>
      </div>
    </div>
  );
}

function ScanningView({ previewUrl }: { previewUrl: string | null }) {
  const t = useTranslations("NewLanding");
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s + 1) % SCAN_STAGE_KEYS.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);
  const current = SCAN_STAGE_KEYS[stage];
  return (
    <section className="flex-1 px-5 pt-20 pb-40">
      <div className="mx-auto max-w-2xl md:max-w-3xl space-y-5">
        {/* User's submitted image + question — blue bubbles */}
        <div className="flex justify-end pt-4">
          <div className="flex max-w-[80%] flex-col items-end gap-2">
            <div className="h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 ring-2 ring-[#245FFF]/50">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg className="h-10 w-10 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>
            <div className="rounded-2xl bg-[#245FFF] px-4 py-2.5 text-sm text-white">
              {t("scanning.userQuestion")}
            </div>
          </div>
        </div>

        {/* Assistant loader */}
        <div className="pt-3">
          <PixelLoader label={t(current.labelKey)} pattern={current.pattern} />
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
  const GRID = 4;
  const STEP = 120;
  const cells = Array.from({ length: GRID * GRID }, (_, i) => {
    const r = Math.floor(i / GRID);
    const col = i % GRID;
    return { delay: cellDelay(r, col, pattern, STEP) };
  });

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
      >
        {cells.map((cell, i) => (
          <span
            key={i}
            className="pixel-cell block h-1 w-1 rounded-[1px]"
            style={{
              ["--pixel-color" as string]: PIXEL_BLUE,
              animationDelay: `${cell.delay}ms`,
            }}
          />
        ))}
      </div>
      <span className="pixel-label text-xs font-semibold tracking-tight sm:text-sm">
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
  previewUrl,
  scan,
}: {
  onReset: () => void;
  onShare: () => void;
  previewUrl: string | null;
  scan: ScanResult | null;
}) {
  const t = useTranslations("NewLanding");
  const verdict = scan?.verdict ?? DEMO_SCAN.verdict;
  const confidence = scan?.confidencePct ?? DEMO_SCAN.confidence;
  const isFake = verdict.toLowerCase().includes("ai");
  const faceSwapDetected = scan?.faceSwap?.detected ?? DEMO_SCAN.faceSwap.detected;
  const faceSwapConfidencePct = scan?.faceSwap
    ? Math.round((scan.faceSwap.confidence ?? 0) * 100)
    : DEMO_SCAN.faceSwap.confidence;
  const latencySec = scan ? (scan.latencyMs / 1000).toFixed(1) : "2";
  const accentRed = isFake;
  const cardBorder = accentRed ? "border-red-500/30" : "border-emerald-500/30";
  const cardBg = accentRed
    ? "from-red-500/15 via-red-500/5 to-transparent"
    : "from-emerald-500/15 via-emerald-500/5 to-transparent";
  const dotBg = accentRed ? "bg-red-500/20" : "bg-emerald-500/20";
  const dotIconColor = accentRed ? "text-red-400" : "text-emerald-400";
  const barColor = accentRed ? "bg-red-400" : "bg-emerald-400";

  return (
    <section className="flex-1 px-5 pt-20 pb-40">
      <div className="mx-auto max-w-2xl md:max-w-3xl space-y-5">
        {/* User message */}
        <div className="flex justify-end pt-4">
          <div className="flex max-w-[80%] flex-col items-end gap-2">
            <div className="h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 ring-2 ring-[#245FFF]/50">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg className="h-10 w-10 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>
            <div className="rounded-2xl bg-[#245FFF] px-4 py-2.5 text-sm text-white">
              {t("scanning.userQuestion")}
            </div>
          </div>
        </div>

        {/* Assistant response */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <img src="/logo.svg" alt="" className="h-4 w-4" />
            <span>{t("result.modelLabel")}</span>
          </div>

          {/* Verdict card (brand-baked for screenshot virality) */}
          <div className={`overflow-hidden rounded-2xl border ${cardBorder} bg-gradient-to-br ${cardBg}`}>
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${dotBg}`}>
                  {accentRed ? (
                    <svg className={`h-5 w-5 ${dotIconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  ) : (
                    <svg className={`h-5 w-5 ${dotIconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xl font-semibold text-white">{verdict}</div>
                  <div className="mt-0.5 text-sm text-white/60">{t("result.confidence", { pct: confidence })}</div>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${confidence}%` }} />
              </div>

              {faceSwapDetected && (
                <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-red-500/15 px-3 py-2 ring-1 ring-red-500/30">
                  <svg className="h-4 w-4 flex-shrink-0 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 10h.01" />
                    <path d="M16 10h.01" />
                    <path d="M9 15c.5.6 1.5 1 3 1s2.5-.4 3-1" />
                    <path d="M3 8l4-4M21 8l-4-4M3 16l4 4M21 16l-4 4" />
                  </svg>
                  <div className="flex-1 text-sm">
                    <span className="font-medium text-red-100">{t("result.faceSwapDetected")}</span>
                    <span className="ml-1.5 text-red-200/70">{t("result.faceSwapMatch", { pct: faceSwapConfidencePct })}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-white/5 bg-black/30 px-5 py-2.5">
              <div className="flex items-center gap-2 text-[11px] text-white/50">
                <img src="/scamai-logo.svg" alt="" className="h-3.5 w-auto opacity-80" />
                <span className="font-mono">{DEMO_SCAN.shareUrl}</span>
              </div>
              <span className="text-[11px] text-white/40">{t("result.verified", { sec: latencySec })}</span>
            </div>
          </div>

          {/* AI disclaimer */}
          <p className="flex items-start gap-1.5 px-1 text-xs leading-relaxed text-white/50 sm:text-sm">
            <svg className="mt-[2px] h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <span>{t("result.disclaimer")}</span>
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
              {t("result.share")}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!previewUrl) return;
                const a = document.createElement("a");
                a.href = previewUrl;
                a.download = `scamai-verdict-${Date.now()}.png`;
                a.click();
              }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-4 text-base font-semibold text-white transition hover:bg-white/15 active:scale-[0.99]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t("result.download")}
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
                <div className="text-sm font-medium text-white">{t("result.signalsCount", { count: 4 })}</div>
                <div className="text-xs text-white/50">{t("result.signalsSub")}</div>
              </div>
            </div>
            <span className="rounded-full bg-[#245FFF]/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#6B9FFF]">
              {t("mode.pro")}
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
            {t("result.scanAnother")}
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

function ShareSheet({ onClose, previewUrl }: { onClose: () => void; previewUrl: string | null }) {
  const t = useTranslations("NewLanding");
  const faceNote = DEMO_SCAN.faceSwap.detected
    ? ` + face-swap detected (${DEMO_SCAN.faceSwap.confidence}%)`
    : "";
  const shareMessage = `ScamAI caught this — ${DEMO_SCAN.confidence}% likely AI-edited${faceNote}. Verify yours: ${DEMO_SCAN.shareUrl}`;
  const replyMessage = `Hey — I ran the thing you sent through ScamAI. It's ${DEMO_SCAN.confidence}% likely AI-edited${faceNote}. You can check things yourself at scam.ai 👀`;

  const shareUrl = DEMO_SCAN.shareUrl;
  const emailSubject = encodeURIComponent(`ScamAI: ${DEMO_SCAN.confidence}% likely AI-edited`);
  const emailBody = encodeURIComponent(shareMessage);

  const channels = useMemo(() => [
    { id: "whatsapp", name: "WhatsApp", color: "bg-[#25D366]", href: `https://wa.me/?text=${encodeURIComponent(shareMessage)}`, icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
      </svg>
    ) },
    { id: "x", name: "X", color: "bg-black border border-white/20", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`, icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ) },
    { id: "telegram", name: "Telegram", color: "bg-[#26A5E4]", href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`, icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ) },
    { id: "messages", name: "Messages", color: "bg-[#30D158]", href: `sms:&body=${encodeURIComponent(shareMessage)}`, icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2C6.5 2 2 6 2 11c0 2.5 1.2 4.8 3.2 6.3L4 22l5-2.4c1 .3 2 .4 3 .4 5.5 0 10-4 10-9s-4.5-9-10-9z" />
      </svg>
    ) },
    { id: "email", name: "Email", color: "bg-[#5E5CE6]", href: `mailto:?subject=${emailSubject}&body=${emailBody}`, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4l-10 8L2 4" />
      </svg>
    ) },
    { id: "copyLink", name: t("shareSheet.channels.copyLink"), color: "bg-white/10", href: undefined, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ) },
    { id: "saveImage", name: t("shareSheet.channels.saveImage"), color: "bg-white/10", href: undefined, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ) },
    { id: "reportError", name: t("shareSheet.channels.reportError"), color: "bg-white/10", href: `mailto:support@scam.ai?subject=${encodeURIComponent(`Wrong verdict on ${shareUrl}`)}&body=${encodeURIComponent(`Hi ScamAI,\n\nI believe the verdict on this scan is incorrect:\n${shareUrl}\n\nThe image is actually: [real / AI-generated]\n\nAdditional context:\n`)}`, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ) },
  ], [shareMessage, shareUrl, emailSubject, emailBody, t]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-t-3xl bg-[#111] p-5 pb-8 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{t("shareSheet.title")}</h2>
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
              <div className="h-14 w-14 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 ring-1 ring-white/10">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-red-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="font-semibold uppercase tracking-wider">{t("shareSheet.likelyAI")}</span>
                  {DEMO_SCAN.faceSwap.detected && (
                    <span className="rounded-sm bg-red-500/25 px-1.5 py-px font-semibold uppercase tracking-wider text-red-100">
                      {t("shareSheet.faceSwap")}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-sm text-white/60">
                  {t("shareSheet.confidence", { pct: DEMO_SCAN.confidence })}
                </div>
              </div>
              <img src="/scamai-logo.svg" alt="" className="h-5 w-auto opacity-90" />
            </div>
          </div>
          <div className="flex items-center justify-between bg-black px-4 py-2.5">
            <span className="font-mono text-xs text-white/50">{DEMO_SCAN.shareUrl}</span>
            <span className="text-[11px] text-white/40">{t("shareSheet.tapToVerify")}</span>
          </div>
          <div className="border-t border-white/5 bg-black px-4 py-1.5 text-[10px] text-white/40">
            {t("shareSheet.disclaimer")}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {channels.map((c) => (
            <button
              key={c.id}
              type="button"
              className="flex flex-col items-center gap-2"
              onClick={() => {
                if (c.id === "copyLink") {
                  navigator.clipboard.writeText(shareUrl);
                  return;
                }
                if (c.href) {
                  window.open(c.href, c.id === "email" || c.id === "reportError" || c.id === "messages" ? "_self" : "_blank", "width=600,height=500");
                }
              }}
            >
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
              {t("shareSheet.replySection")}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/90">&ldquo;{replyMessage}&rdquo;</p>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#245FFF] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E52E0]"
          >
            {t("shareSheet.sendReply")}
          </button>
        </div>

        <div className="rounded-xl bg-white/[0.04] p-3">
          <div className="mb-1 text-[11px] uppercase tracking-wider text-white/40">{t("shareSheet.orShareEverywhere")}</div>
          <p className="text-xs leading-relaxed text-white/70">{shareMessage}</p>
        </div>
      </div>
    </div>
  );
}
