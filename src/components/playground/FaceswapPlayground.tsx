"use client";

// ─── FaceswapPlayground — "Deepfake is here" live demo ──────────────────────
//
// Sits below the hero. A visitor swaps their own face onto a preset identity in
// real time (live faker-100 WebRTC engine via useFaceswap). The point: a
// convincing deepfake of *you* takes 30s and a webcam — which is why Halo
// (on-device detection) is the payoff CTA.
//
// Layout is built to fit ONE screen, including small laptops and phones:
//   desktop → two columns (copy + face picker | stage)
//   mobile  → compact stack (headline → stage → face row → start)
// Stage height is viewport-relative (vh) so it never pushes the section past a
// single screen. 30s per play, replay re-queues, queue shows position + ETA.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Camera, ShieldCheck, RefreshCw, ArrowRight, AlertTriangle, ScanFace, Square } from "lucide-react";
import { useFaceswap } from "./useFaceswap";

const DEMO_SECONDS = 30;
const PER_PLAY_SECONDS = 30; // used for queue ETA estimate
const HALO_HREF = "/halo";

const PRESET_FACES: { label: string; url: string }[] = [
  { label: "Audrey Hepburn", url: "/playground-faces/hepburn.jpg" },
  { label: "Einstein", url: "/playground-faces/einstein.jpg" },
  { label: "JFK", url: "/playground-faces/jfk.jpg" },
  { label: "Steve Jobs", url: "/playground-faces/jobs.jpg" },
  { label: "Princess Diana", url: "/playground-faces/diana.jpg" },
];

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

const fmt = (s: number) => `0:${String(Math.max(0, s)).padStart(2, "0")}`;

type Step = "intro" | "consent" | "running" | "ended";

export default function FaceswapPlayground() {
  const { state, start, stop, setFace } = useFaceswap();
  const [step, setStep] = useState<Step>("intro");
  const [selected, setSelected] = useState(PRESET_FACES[0].url);
  const [secondsLeft, setSecondsLeft] = useState(DEMO_SECONDS);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const selfViewRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const secondsRef = useRef(DEMO_SECONDS);

  // Bind swapped output stream.
  useEffect(() => {
    const v = remoteVideoRef.current;
    if (v && state.remoteStream && v.srcObject !== state.remoteStream) {
      v.srcObject = state.remoteStream;
      v.play().catch(() => {});
    }
  }, [state.remoteStream]);

  // Engine-side end (time exhausted / backend close).
  useEffect(() => {
    if (state.phase === "ended") setStep("ended");
  }, [state.phase]);

  // 30s countdown — starts when the swap goes live, ends → CTA.
  useEffect(() => {
    if (step !== "running" || state.phase !== "live") return;
    const id = setInterval(() => {
      secondsRef.current -= 1;
      setSecondsLeft(secondsRef.current);
      if (secondsRef.current <= 0) {
        clearInterval(id);
        stop();
        setStep("ended");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [step, state.phase, stop]);

  const beginConsent = useCallback(() => setStep("consent"), []);

  const launch = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });
      localStreamRef.current = localStream;
      const sv = selfViewRef.current;
      if (sv) {
        sv.srcObject = localStream;
        sv.play().catch(() => {});
      }
      secondsRef.current = DEMO_SECONDS;
      setSecondsLeft(DEMO_SECONDS);
      const targetB64 = await urlToBase64(selected);
      setStep("running");
      await start({ targetFaceB64: targetB64, localStream });
    } catch {
      alert("Camera access is required for the live demo.");
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
          /* keep current */
        }
      }
    },
    [step, state.phase, setFace]
  );

  const reset = useCallback(() => {
    stop();
    localStreamRef.current = null;
    secondsRef.current = DEMO_SECONDS;
    setSecondsLeft(DEMO_SECONDS);
    setStep("intro");
  }, [stop]);

  const connecting = step === "running" && (state.phase === "connecting" || state.phase === "queued");
  const live = step === "running" && state.phase === "live";
  const queueEta = state.queuePosition ? state.queuePosition * PER_PLAY_SECONDS : null;

  // ─── Face picker (shared desktop/mobile) ──────────────────────────────────
  const FacePicker = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? "justify-center" : ""}`}>
      {PRESET_FACES.map((f) => {
        const active = selected === f.url;
        return (
          <button
            key={f.url}
            type="button"
            onClick={() => onPickFace(f.url)}
            className={`group flex flex-col items-center gap-1 rounded-xl p-1 transition ${active ? "bg-[#245FFF]/10" : "hover:bg-white/5"}`}
            title={`Become ${f.label}`}
          >
            <span
              className={`relative block overflow-hidden rounded-lg ring-2 transition ${
                active ? "ring-[#245FFF] shadow-[0_0_18px_-4px_rgba(36,95,255,0.7)]" : "ring-white/10 group-hover:ring-white/25"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={f.label} className={compact ? "h-12 w-12 object-cover" : "h-14 w-14 object-cover"} />
            </span>
            <span className={`text-[10px] font-medium transition ${active ? "text-white" : "text-white/45"}`}>{f.label.split(" ")[0]}</span>
          </button>
        );
      })}
    </div>
  );

  // ─── The swap stage — a clean video frame (no app-window chrome) ──────────
  const peopleAhead = Math.max(0, (state.queuePosition ?? 1) - 1);
  const Stage = () => (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
      <div className="relative w-full bg-black h-[40vh] sm:h-[46vh] lg:h-[48vh] max-h-[460px]">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-contain"
          style={{ transform: "scaleX(-1)", display: live ? "block" : "none" }}
        />

        {/* top-left: live countdown OR idle label */}
        {live ? (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="tabular-nums">{fmt(secondsLeft)}</span>
            <span className="text-white/40">left</span>
          </div>
        ) : (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 text-[11px] font-medium text-white/40">
            <ScanFace className="h-3.5 w-3.5" /> Live face swap
          </div>
        )}

        {/* top-right: privacy reassurance */}
        <div className="absolute right-3 top-3 z-10 hidden items-center gap-1 text-[10px] text-white/30 sm:flex">
          <ShieldCheck className="h-3 w-3" /> never stored
        </div>

        {/* self-view PiP */}
        <div
          className="absolute bottom-3 right-3 z-10 overflow-hidden rounded-xl border border-white/15 bg-black ring-1 ring-[#245FFF]/30 shadow-lg"
          style={{ display: step === "running" ? "block" : "none" }}
        >
          <video ref={selfViewRef} autoPlay playsInline muted className="h-20 w-[60px] -scale-x-100 object-cover sm:h-24 sm:w-[72px]" />
          <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-white/80 drop-shadow">You</span>
        </div>

        {/* floating Stop while live */}
        {live && (
          <button
            onClick={reset}
            className="absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-md transition hover:bg-white/10"
          >
            <Square className="h-3 w-3" /> Stop
          </button>
        )}

        {/* ── Overlays ── */}
        {step === "intro" && (
          <Overlay>
            <ScanFace className="mb-3 h-9 w-9 text-[#245FFF]" />
            <p className="text-sm text-white/70">Pick a face below, then go live.</p>
            <button
              onClick={beginConsent}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_-6px_rgba(36,95,255,0.8)] transition hover:bg-[#3d74ff] active:scale-[0.98]"
            >
              <Camera className="h-4 w-4" /> Start the live demo
            </button>
            <p className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
              <ShieldCheck className="h-3.5 w-3.5" /> Processed live · never stored
            </p>
          </Overlay>
        )}

        {step === "consent" && (
          <Overlay>
            <ShieldCheck className="mb-2 h-8 w-8 text-[#245FFF]" />
            <h3 className="text-base font-semibold text-white">Camera access</h3>
            <p className="mt-1.5 max-w-xs text-[12px] leading-relaxed text-white/55">
              Your camera streams to our servers for live processing only. Nothing is stored.
            </p>
            <div className="mt-4 flex gap-2.5">
              <button onClick={launch} className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#3d74ff] active:scale-[0.98]">
                <Camera className="h-4 w-4" /> Allow &amp; start
              </button>
              <button onClick={() => setStep("intro")} className="rounded-full px-4 py-2 text-sm font-medium text-white/60 transition hover:text-white">
                Cancel
              </button>
            </div>
          </Overlay>
        )}

        {/* queued — prominent position card */}
        {step === "running" && state.phase === "queued" && (
          <Overlay>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#245FFF]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#245FFF]/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#245FFF]" />
              </span>
              Demo is busy
            </div>
            <div className="mt-3 text-5xl font-bold tabular-nums text-white">#{state.queuePosition ?? 1}</div>
            <p className="mt-1 text-sm text-white/70">your place in line</p>
            <p className="mt-2 text-xs text-white/45">
              {peopleAhead === 0
                ? "You're next — starting any second…"
                : `${peopleAhead} ${peopleAhead === 1 ? "person" : "people"} ahead · ~${queueEta}s wait`}
            </p>
            <p className="mt-4 text-[11px] text-white/30">We'll start your swap automatically — no need to refresh.</p>
          </Overlay>
        )}

        {/* connecting (not queued) */}
        {connecting && state.phase !== "queued" && (
          <Overlay>
            <Spinner />
            <p className="mt-3 text-xs tracking-wide text-white/55">{state.status || "Warming up the swap engine…"}</p>
          </Overlay>
        )}

        {state.phase === "error" && step === "running" && (
          <Overlay>
            <AlertTriangle className="mb-2 h-7 w-7 text-red-400" />
            <p className="max-w-xs text-sm text-white/70">{state.error}</p>
            <button onClick={reset} className="mt-4 rounded-full bg-[#245FFF] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#3d74ff]">
              Try again
            </button>
          </Overlay>
        )}

        {step === "ended" && (
          <Overlay>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#245FFF]">That took 30 seconds.</p>
            <h3 className="mt-2 max-w-sm text-lg font-semibold text-white sm:text-xl">Anyone can fake a face. Catch it on-device, in real time.</h3>
            <Link href={HALO_HREF} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]">
              Meet Halo — deepfake defense <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={reset} className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/50 transition hover:text-white">
              <RefreshCw className="h-3.5 w-3.5" /> Run the demo again
            </button>
          </Overlay>
        )}
      </div>
    </div>
  );

  return (
    <section id="playground" className="relative w-full overflow-hidden bg-[#050505] py-8 sm:py-12 lg:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(70% 50% at 50% 0%, rgba(36,95,255,0.16), transparent 60%)" }}
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
        {/* compact header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300 sm:text-[11px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            Deepfake is here
          </span>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-[32px] lg:leading-[1.05]">
            See how easy it is to fake a face.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
            Turn on your camera and watch a real-time deepfake of yourself. This is the attack — the defense runs on-device.
          </p>
        </div>

        {/* desktop: two columns · mobile: stack */}
        <div className="mt-5 grid items-center gap-5 sm:mt-7 lg:grid-cols-12">
          {/* left: face picker + start (desktop) / below stage (mobile via order) */}
          <div className="order-2 lg:order-1 lg:col-span-4">
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 lg:text-left">
              {step === "running" && live ? "Tap to switch faces live" : "Pick a face"}
            </p>
            <div className="lg:block">{FacePicker({ compact: true })}</div>
            <p className="mt-4 hidden items-center gap-1.5 text-[11px] text-white/35 lg:flex">
              <Camera className="h-3.5 w-3.5" /> 30-second live demo · no install
            </p>
          </div>

          {/* right: stage */}
          <div className="order-1 lg:order-2 lg:col-span-8">{Stage()}</div>
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
  return <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-white/15 border-t-[#245FFF]" />;
}
