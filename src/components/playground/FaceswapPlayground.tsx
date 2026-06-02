"use client";

// ─── FaceswapPlayground — "Deepfake is here" live demo ──────────────────────
//
// Sits directly below the hero. Lets a visitor swap their own face onto a
// preset identity in real time (powered by the live faker-100 WebRTC engine via
// useFaceswap). The visceral point: a convincing deepfake of *you* takes two
// seconds and a webcam — which is exactly why on-device detection (Halo) is the
// payoff CTA at the end.
//
// Visual language blends the snapdragon booth UI (dark stage, macOS window
// chrome, on-device verdict chrome) with scam.ai's violet/blue accent.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Camera, ShieldCheck, RefreshCw, ArrowRight, AlertTriangle, ScanFace, Square } from "lucide-react";
import { useFaceswap } from "./useFaceswap";

const PRESET_FACES: { label: string; url: string }[] = [
  { label: "Audrey Hepburn", url: "/playground-faces/hepburn.jpg" },
  { label: "Einstein", url: "/playground-faces/einstein.jpg" },
  { label: "JFK", url: "/playground-faces/jfk.jpg" },
  { label: "Synthetic A", url: "/playground-faces/person-1.jpg" },
  { label: "Synthetic B", url: "/playground-faces/person-2.jpg" },
];

const HALO_HREF = "/halo";

// Fetch an image → RAW base64 (no data: prefix — backend b64decodes directly).
async function urlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`face asset ${url} → ${res.status}`);
  const blob = await res.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(blob);
  });
  return dataUrl.split(",")[1] || dataUrl;
}

type Step = "intro" | "consent" | "running" | "ended";

export default function FaceswapPlayground() {
  const { state, start, stop, setFace } = useFaceswap();
  const [step, setStep] = useState<Step>("intro");
  const [selected, setSelected] = useState(PRESET_FACES[0].url);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const selfViewRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Bind the swapped output stream to the stage <video>.
  useEffect(() => {
    const v = remoteVideoRef.current;
    if (v && state.remoteStream && v.srcObject !== state.remoteStream) {
      v.srcObject = state.remoteStream;
      v.play().catch(() => {});
    }
  }, [state.remoteStream]);

  // Surface fatal errors / time-expiry from the engine.
  useEffect(() => {
    if (state.phase === "ended") setStep("ended");
  }, [state.phase]);

  const beginConsent = useCallback(() => setStep("consent"), []);

  const launch = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });
      localStreamRef.current = localStream;
      // Bind self-view PiP.
      const sv = selfViewRef.current;
      if (sv) {
        sv.srcObject = localStream;
        sv.play().catch(() => {});
      }
      const targetB64 = await urlToBase64(selected);
      setStep("running");
      await start({ targetFaceB64: targetB64, localStream });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not access your camera.";
      // Camera-permission denial is the common case — keep the user on intro.
      alert(msg.includes("Permission") || msg.includes("denied") ? "Camera access is required for the demo." : msg);
      setStep("intro");
    }
  }, [selected, start]);

  const onPickFace = useCallback(
    async (url: string) => {
      setSelected(url);
      if (step === "running" && state.phase === "live") {
        try {
          setFace(await urlToBase64(url));
        } catch {
          /* keep current face */
        }
      }
    },
    [step, state.phase, setFace]
  );

  const reset = useCallback(() => {
    stop();
    localStreamRef.current = null;
    setStep("intro");
  }, [stop]);

  const connecting = step === "running" && (state.phase === "connecting" || state.phase === "queued");
  const live = step === "running" && state.phase === "live";

  return (
    <section id="playground" className="relative w-full overflow-hidden bg-[#050505] py-20 sm:py-28">
      {/* Radar-scan glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(36,95,255,0.16), transparent 60%), radial-gradient(50% 40% at 50% 100%, rgba(109,93,251,0.12), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            Deepfake is here
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-[44px] sm:leading-[1.05]">
            See how easy it is to fake a face.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/55">
            Pick an identity, turn on your camera, and watch a real-time deepfake of
            yourself — no install, no green screen. This is the attack. The defense
            runs on-device.
          </p>
        </div>

        {/* Stage — macOS-style window */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d11] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#15171c] px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 flex items-center gap-1.5 text-[11px] font-medium text-white/40">
                <ScanFace className="h-3.5 w-3.5" />
                Live face swap · scam.ai
              </span>
              {live && (
                <span className="ml-auto flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  Live
                </span>
              )}
            </div>

            {/* Stage body */}
            <div className="relative aspect-video w-full bg-black">
              {/* Swapped output — mirrored to read like a mirror */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-contain"
                style={{ transform: "scaleX(-1)", display: live ? "block" : "none" }}
              />

              {/* Self-view PiP (always mounted so getUserMedia binds; shown while running) */}
              <div
                className="absolute bottom-3 right-3 z-10 overflow-hidden rounded-xl border border-white/15 bg-black ring-1 ring-[#6d5dfb]/30 shadow-lg"
                style={{ display: step === "running" ? "block" : "none" }}
              >
                <video
                  ref={selfViewRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-24 w-[72px] -scale-x-100 object-cover sm:h-32 sm:w-24"
                />
                <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-white/80 drop-shadow">
                  You
                </span>
              </div>

              {/* Intro overlay */}
              {step === "intro" && (
                <Overlay>
                  <ScanFace className="mb-3 h-9 w-9 text-[#6d5dfb]" />
                  <p className="text-sm text-white/70">Pick a face below, then start the demo.</p>
                </Overlay>
              )}

              {/* Consent overlay */}
              {step === "consent" && (
                <Overlay>
                  <ShieldCheck className="mb-3 h-9 w-9 text-[#6d5dfb]" />
                  <h3 className="text-lg font-semibold text-white">Camera access</h3>
                  <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/55">
                    Your camera streams to our servers for live processing only. Nothing
                    is stored. By continuing you agree to the live demo.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={launch}
                      className="inline-flex items-center gap-2 rounded-full bg-[#6d5dfb] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_-6px_rgba(109,93,251,0.8)] transition hover:bg-[#7d6dff] active:scale-[0.98]"
                    >
                      <Camera className="h-4 w-4" />
                      Allow & start
                    </button>
                    <button
                      onClick={() => setStep("intro")}
                      className="rounded-full px-5 py-2.5 text-sm font-medium text-white/60 transition hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </Overlay>
              )}

              {/* Connecting / queued */}
              {connecting && (
                <Overlay>
                  <Spinner />
                  <p className="mt-3 text-xs tracking-wide text-white/55">
                    {state.status || "Warming up the swap engine…"}
                  </p>
                  {state.phase === "queued" && state.queuePosition ? (
                    <p className="mt-1 text-[11px] text-white/35">Position #{state.queuePosition}</p>
                  ) : null}
                </Overlay>
              )}

              {/* Error */}
              {state.phase === "error" && step === "running" && (
                <Overlay>
                  <AlertTriangle className="mb-3 h-8 w-8 text-red-400" />
                  <p className="max-w-sm text-sm text-white/70">{state.error}</p>
                  <button
                    onClick={reset}
                    className="mt-5 rounded-full bg-[#6d5dfb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7d6dff]"
                  >
                    Try again
                  </button>
                </Overlay>
              )}

              {/* Ended → Halo CTA */}
              {step === "ended" && (
                <Overlay>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6d5dfb]">
                    That took two seconds.
                  </p>
                  <h3 className="mt-2 max-w-md text-xl font-semibold text-white sm:text-2xl">
                    Anyone can fake a face. Catch it on-device, in real time.
                  </h3>
                  <Link
                    href={HALO_HREF}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
                  >
                    Meet Halo — deepfake defense
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={reset}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/50 transition hover:text-white"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Run the demo again
                  </button>
                </Overlay>
              )}
            </div>

            {/* Control bar */}
            <div className="flex items-center justify-between border-t border-white/[0.07] bg-[#101216] px-4 py-3">
              <span className="flex items-center gap-1.5 text-[11px] text-white/40">
                <ShieldCheck className="h-3.5 w-3.5" />
                Processed live · never stored
              </span>
              {live ? (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                >
                  <Square className="h-3 w-3" />
                  Stop
                </button>
              ) : step === "intro" ? (
                <button
                  onClick={beginConsent}
                  className="inline-flex items-center gap-2 rounded-full bg-[#6d5dfb] px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(109,93,251,0.8)] transition hover:bg-[#7d6dff] active:scale-[0.98]"
                >
                  <Camera className="h-4 w-4" />
                  Start the live demo
                </button>
              ) : (
                <span className="text-[11px] text-white/30">—</span>
              )}
            </div>
          </div>

          {/* Face picker */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {PRESET_FACES.map((f) => {
              const active = selected === f.url;
              return (
                <button
                  key={f.url}
                  type="button"
                  onClick={() => onPickFace(f.url)}
                  className={`group flex flex-col items-center gap-1.5 rounded-2xl p-1.5 transition ${
                    active ? "bg-[#6d5dfb]/10" : "hover:bg-white/5"
                  }`}
                  title={`Become ${f.label}`}
                >
                  <span
                    className={`relative block overflow-hidden rounded-xl ring-2 transition ${
                      active
                        ? "ring-[#6d5dfb] shadow-[0_0_24px_-4px_rgba(109,93,251,0.7)]"
                        : "ring-white/10 group-hover:ring-white/25"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.url} alt={f.label} className="h-16 w-16 object-cover sm:h-[72px] sm:w-[72px]" />
                  </span>
                  <span className={`text-[11px] font-medium transition ${active ? "text-white" : "text-white/50"}`}>
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0c0d11]/92 px-6 text-center backdrop-blur-sm">
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/15 border-t-[#6d5dfb]" />
  );
}
