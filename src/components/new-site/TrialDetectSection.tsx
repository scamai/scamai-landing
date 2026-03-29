"use client";

import { useState, useRef, useEffect, useCallback, DragEvent } from "react";
import { motion, useInView } from "framer-motion";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, params: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      execute: (widgetId: string) => void;
    };
    _turnstileWidgetId?: string;
  }
}

type DetectResult = {
  success: boolean;
  scansRemaining: number;
  faceswap: { verdict: string; confidence: number; faceCount: number };
  aiGenerated: { verdict: string; confidence: number };
};

type UIState = "idle" | "loading" | "done" | "error";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "scamai_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

const SCAN_COUNT_KEY = "scamai_trial_scans";
const REGISTERED_KEY = "scamai_registered";

function getScanCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(SCAN_COUNT_KEY) || "0", 10);
}

function incrementScanCount(): number {
  const count = getScanCount() + 1;
  localStorage.setItem(SCAN_COUNT_KEY, String(count));
  return count;
}

function isRegistered(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REGISTERED_KEY) === "true";
}

function markRegistered(): void {
  localStorage.setItem(REGISTERED_KEY, "true");
}

function AnimatedSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ConfidenceBar({ confidence, color }: { confidence: number; color: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${confidence}%` } : { width: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

export default function TrialDetectSection() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<UIState>("idle");
  const [result, setResult] = useState<DetectResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  // Ref to avoid stale closures inside Turnstile callback
  const imageRef = useRef<File | null>(null);

  const renderTurnstile = useCallback(() => {
    if (!window.turnstile || !turnstileContainerRef.current) return;
    // Only render once — subsequent scans use reset() + execute()
    if (window._turnstileWidgetId) return;
    window._turnstileWidgetId = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: "0x4AAAAAACxT9cdgoqC5n44u",
      size: "invisible",
      execution: "execute", // don't auto-execute on render
      callback: (token: string) => submitWithToken(token),
      "error-callback": () => {
        setState("error");
        setErrorMsg("Bot verification failed. Please try again.");
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (window.turnstile) renderTurnstile();
  }, [renderTurnstile]);

  const submitWithToken = async (token: string) => {
    const currentImage = imageRef.current;
    if (!currentImage) return;
    setState("loading");
    setResult(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("image", currentImage);
    formData.append("turnstileToken", token);
    formData.append("fingerprintId", getOrCreateSessionId());

    try {
      const res = await fetch("/api/public/trial/detect", {
        method: "POST",
        body: formData,
      });

      if (res.status === 429) {
        if (!showGateRef.current) {
          setShowGate(true);
          showGateRef.current = true;
        }
        setState("idle");
        return;
      }
      if (res.status === 403) {
        setState("error");
        setErrorMsg("Bot verification failed. Please refresh and try again.");
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setState("error");
        setErrorMsg((err as { error?: string }).error || "Something went wrong. Please try again.");
        return;
      }

      const data: DetectResult = await res.json();
      setResult(data);
      setState("done");
      incrementScanCount();
    } catch {
      setState("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      // Reset Turnstile so the widget is ready for the next execute()
      if (window.turnstile && window._turnstileWidgetId) {
        window.turnstile.reset(window._turnstileWidgetId);
      }
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    imageRef.current = file;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setState("idle");
    setResult(null);
    setErrorMsg("");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const executeScan = () => {
    if (!imageRef.current || state === "loading") return;
    if (!window.turnstile) {
      setState("error");
      setErrorMsg("Bot protection not loaded yet. Please wait a moment and try again.");
      return;
    }
    if (!window._turnstileWidgetId) {
      renderTurnstile();
      setTimeout(() => {
        if (window.turnstile && window._turnstileWidgetId) {
          window.turnstile.execute(window._turnstileWidgetId);
        }
      }, 300);
      return;
    }
    window.turnstile.execute(window._turnstileWidgetId);
  };

  const showGateRef = useRef(false);

  const handleScan = () => {
    if (getScanCount() >= 2 && !isRegistered()) {
      setShowGate(true);
      showGateRef.current = true;
    }
    executeScan();
  };

  const proceedAfterRegistration = () => {
    markRegistered();
    setShowGate(false);
    showGateRef.current = false;
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    imageRef.current = null;
    setImage(null);
    setPreview(null);
    setState("idle");
    setResult(null);
    setErrorMsg("");
    setShowGate(false);
  };

  // Confidence comes as 0-1 from backend, convert to percentage
  const faceswapPct = Math.round((result?.faceswap.confidence ?? 0) * 100);
  const aiGeneratedPct = Math.round((result?.aiGenerated.confidence ?? 0) * 100);
  const faceswapFake = result?.faceswap.verdict === "fake";
  const aiGenerated = result?.aiGenerated.verdict === "likely_ai";
  const aiUnavailable = result?.aiGenerated.verdict === "unavailable";

  // Overall verdict: if either detector flags it, image is manipulated
  const isManipulated = faceswapFake || aiGenerated;
  const overallConfidence = isManipulated
    ? Math.max(faceswapFake ? faceswapPct : 0, aiGenerated ? aiGeneratedPct : 0)
    : 100 - Math.max(faceswapPct, aiUnavailable ? 0 : aiGeneratedPct);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={() => renderTurnstile()}
      />

      <section
        className="landing-section relative overflow-hidden bg-black"
        aria-label="Free AI Detection Trial"
        id="trial-detect"
      >
        <div className="absolute inset-0 w-full h-full" style={{
          backgroundImage: "url(/session3.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-24">
          <AnimatedSection>
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px]">
                TRY IT FREE
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-4">
                Detect deepfakes <span className="text-[#245FFF]">instantly</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto">
                Upload any image and our AI will check for face swaps and AI-generated content in seconds. No sign-up needed — 3 free scans per day.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="mx-auto max-w-2xl">
              {/* Drop zone */}
              {!preview && (
                <div
                  className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 sm:p-16 transition-colors cursor-pointer ${
                    isDraggingOver
                      ? "border-[#245FFF] bg-[#245FFF]/10"
                      : "border-white/20 bg-white/[0.02] hover:border-white/40"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  aria-label="Upload image for detection"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#245FFF]/10 border border-[#245FFF]/30">
                    <svg className="h-7 w-7 text-[#245FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Drop an image here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to browse — JPG, PNG, WebP up to 10MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </div>
              )}

              {/* Preview + action */}
              {preview && state !== "done" && !showGate && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Uploaded image preview" className="w-full max-h-72 object-contain bg-black" />
                    <button
                      onClick={reset}
                      className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-gray-400 hover:text-white transition"
                      aria-label="Remove image"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-5">
                    {state === "error" && (
                      <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                        {errorMsg}
                      </p>
                    )}
                    <button
                      onClick={handleScan}
                      disabled={state === "loading"}
                      className="w-full rainbow-button disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="rainbow-button-inner flex items-center justify-center gap-2">
                        {state === "loading" ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Analyzing…
                          </>
                        ) : "Scan Image"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Loading behind gate */}
              {showGate && state === "loading" && preview && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Uploaded image" className="w-full max-h-72 object-contain bg-black blur-sm opacity-60" />
                  </div>
                  <div className="p-6 text-center space-y-3">
                    <svg className="h-8 w-8 animate-spin mx-auto text-[#245FFF]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm text-gray-400">Analyzing your image…</p>
                  </div>
                </div>
              )}

              {/* Registration gate */}
              {showGate && state !== "loading" && preview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Uploaded image" className="w-full max-h-72 object-contain bg-black blur-sm opacity-60" />
                    <button
                      onClick={reset}
                      className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-gray-400 hover:text-white transition"
                      aria-label="Remove image"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6 text-center space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#245FFF]/10 border border-[#245FFF]/30 mx-auto">
                      <svg className="h-7 w-7 text-[#245FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Registration Required</h3>
                    <p className="text-sm text-gray-400 max-w-sm mx-auto">
                      You&apos;ve used your 2 free trial scans. Register on SCAM AI to view this result and unlock full access.
                    </p>
                    <div className="flex flex-col gap-3 max-w-xs mx-auto">
                      <a
                        href="https://dev.scam.ai/auth/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rainbow-button w-full"
                      >
                        <span className="rainbow-button-inner text-sm">Register Now</span>
                      </a>
                      <button
                        onClick={proceedAfterRegistration}
                        className="text-sm text-gray-500 hover:text-gray-300 transition underline underline-offset-2"
                      >
                        I&apos;ve already registered
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {!showGate && state === "done" && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview!} alt="Scanned image" className="w-full max-h-60 object-contain bg-black" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    <div className={`rounded-xl border p-6 text-center ${
                      isManipulated
                        ? "border-red-500/30 bg-red-500/10"
                        : "border-green-500/30 bg-green-500/10"
                    }`}>
                      <div className="text-4xl mb-3">{isManipulated ? "🚨" : "✅"}</div>
                      <h3 className={`text-xl font-bold mb-1 ${isManipulated ? "text-red-400" : "text-green-400"}`}>
                        {isManipulated ? "AI Manipulated" : "Authentic"}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {isManipulated
                          ? "This image shows signs of AI manipulation"
                          : "No signs of AI manipulation detected"}
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className={`text-3xl font-bold ${isManipulated ? "text-red-400" : "text-green-400"}`}>
                          {overallConfidence}%
                        </span>
                        <span className="text-xs text-gray-500">confidence</span>
                      </div>
                      <ConfidenceBar
                        confidence={overallConfidence}
                        color={isManipulated ? "#f87171" : "#4ade80"}
                      />
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button onClick={reset} className="flex-1 rounded-xl border border-white/15 bg-white/[0.04] py-2.5 text-sm text-gray-300 hover:text-white hover:border-white/30 transition">
                        Scan another
                      </button>
                      <a
                        href="https://dev.scam.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rainbow-button"
                      >
                        <span className="rainbow-button-inner text-sm">Get full access</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error without preview */}
              {state === "error" && !preview && (
                <p className="text-center text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {errorMsg}
                </p>
              )}

              {/* Hidden Turnstile container */}
              <div ref={turnstileContainerRef} className="hidden" aria-hidden="true" />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
