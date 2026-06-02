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
import { Camera, ShieldCheck, RefreshCw, ArrowRight, AlertTriangle, ScanFace, Square, Plus, X, Lock } from "lucide-react";
import { useFaceswap } from "./useFaceswap";

const DEMO_SECONDS = 30;
const PER_PLAY_SECONDS = 30; // used for queue ETA estimate
const HALO_HREF = "/halo";

// 100% AI-generated faces (StyleGAN2) — no real person, no likeness rights, no
// biometric data. A balanced synthetic set: Black / White / Asian × woman / man.
// Vetted frontal portraits from the Snapdragon booth demo gallery (clean face
// detection). See /public/playground-faces. Labels are alt-text only — never
// rendered as captions (we don't tag faces by race in the UI).
const AI_FACES: Face[] = [
  { label: "AI-generated face", url: "/playground-faces/ai-asian-woman.jpg", synthetic: true },
  { label: "AI-generated face", url: "/playground-faces/ai-white-man.jpg",   synthetic: true },
  { label: "AI-generated face", url: "/playground-faces/ai-black-woman.jpg", synthetic: true },
  { label: "AI-generated face", url: "/playground-faces/ai-asian-man.jpg",   synthetic: true },
  { label: "AI-generated face", url: "/playground-faces/ai-white-woman.jpg", synthetic: true },
  { label: "AI-generated face", url: "/playground-faces/ai-black-man.jpg",   synthetic: true },
];

// Demo faces that appear in the "uploads" section — feel like saved user uploads.
// All unlocked and deletable; they return on reload since they're hardcoded here.
const CELEBRITY_FACES: Face[] = [
  { label: "Saved face", url: "/playground-faces/celeb/albert-einstein.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/jfk.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/princess-diana.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/steve-jobs.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/taylor-swift.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/barack-obama.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/liu-yifei.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/elon-musk.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/malala-yousafzai.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/tom-hanks.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/rinko-kikuchi.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/jackie-chan.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/lady-gaga.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/jack-ma.jpg" },
  { label: "Saved face", url: "/playground-faces/celeb/bts-rm.jpg" },
];

// Gallery seed: AI synthetic first (Preset section), then celebrities
// (appear in the "uploads" section alongside real user uploads).
const SEED_FACES: Face[] = [...AI_FACES, ...CELEBRITY_FACES];

type Face = { label: string; url: string; custom?: boolean; preset?: boolean; synthetic?: boolean; shared?: boolean; name?: string };

// Draw the image through a canvas so:
//   1. EXIF rotation is baked in (phones store pixels sideways but mark them
//      with an EXIF orientation tag; <img> honours it, raw bytes don't).
//   2. Very large uploads are downscaled to ≤768px — the face swap model
//      doesn't need more resolution and the smaller payload is faster.
const MAX_FACE_DIM = 768;

async function urlToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX_FACE_DIM || h > MAX_FACE_DIM) {
        const s = MAX_FACE_DIM / Math.max(w, h);
        w = Math.round(w * s);
        h = Math.round(h * s);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas unavailable")); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.92).split(",")[1]);
    };
    img.onerror = () => reject(new Error(`face asset ${url} failed to load`));
    img.src = url;
  });
}

const fmt = (s: number) => `0:${String(Math.max(0, s)).padStart(2, "0")}`;

type Step = "intro" | "consent" | "running" | "ended";

export default function FaceswapPlayground() {
  const { state, start, stop, setFace } = useFaceswap();
  const [step, setStep] = useState<Step>("intro");
  const [selected, setSelected] = useState(SEED_FACES[0].url);
  // The face library. Seeded with the persistent faces on every mount (so they
  // survive a reload); a visitor's own uploads are appended in-memory only and
  // vanish on reload. `custom: true` marks a real upload (object URL to revoke).
  const [library, setLibrary] = useState<Face[]>(() => [...SEED_FACES]);
  const [secondsLeft, setSecondsLeft] = useState(DEMO_SECONDS);
  const [camError, setCamError] = useState("");
  const [showConsent, setShowConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const selfViewRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const secondsRef = useRef(DEMO_SECONDS);
  const sessionIdRef = useRef<string>(Math.random().toString(36).slice(2) + Date.now().toString(36));
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Revoke any uploaded-face object URLs when the component unmounts.
  useEffect(() => () => objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  // ─── Data collection helpers (best-effort, silent on failure) ─────────────
  const uploadFace = useCallback(async (base64: string) => {
    try {
      await fetch("/api/playground/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "face", data: base64, session_id: sessionIdRef.current }),
      });
    } catch { /* silent */ }
  }, []);

  const uploadRecording = useCallback((blob: Blob) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        await fetch("/api/playground/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "recording",
            data: base64,
            mime_type: blob.type,
            session_id: sessionIdRef.current,
          }),
        });
      } catch { /* silent */ }
    };
    reader.readAsDataURL(blob);
  }, []);

  // ─── MediaRecorder: canvas compositing with watermark ────────────────────
  useEffect(() => {
    if (state.phase !== "live" || !state.remoteStream) return;

    let cancelled = false;
    const rafState = { id: 0 };
    let recorder: MediaRecorder | null = null;

    (async () => {
      // Ensure Inter font is available before measuring/drawing text
      await document.fonts.ready;
      if (cancelled) return;

      const stream = state.remoteStream!;
      const track = stream.getVideoTracks()[0];
      const { width: W = 1280, height: H = 720 } = track?.getSettings() ?? {};

      // Hidden video element to source frames from
      const videoEl = document.createElement("video");
      videoEl.srcObject = stream;
      videoEl.muted = true;
      videoEl.playsInline = true;
      try { await videoEl.play(); } catch { /* ok */ }
      if (cancelled) return;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Pre-load scam.ai logo
      const logo = new Image();
      await new Promise<void>((res) => { logo.onload = logo.onerror = () => res(); logo.src = "/scamai-logo.svg"; });
      if (cancelled) return;

      // Pre-compute watermark layout once (avoids per-frame measureText)
      const logoH = 18;
      const logoW = Math.round(logoH * (1012 / 256)); // SVG viewBox is 1012×256
      const label = "AI-generated";
      ctx.font = "500 11px Inter, ui-sans-serif, system-ui, sans-serif";
      const labelW = ctx.measureText(label).width;
      const gap = 6;
      const pad = 14;
      const wX = W - logoW - gap - labelW - pad;
      const wY = H - logoH - pad;
      const bgW = logoW + gap + labelW + 16;
      const bgH = logoH + 10;

      const draw = () => {
        if (!cancelled && videoEl.readyState >= 2) {
          ctx.drawImage(videoEl, 0, 0, W, H);
          // Pill backdrop for legibility on any background
          ctx.fillStyle = "rgba(0,0,0,0.32)";
          ctx.beginPath();
          ctx.roundRect(wX - 8, wY - 5, bgW, bgH, 5);
          ctx.fill();
          // Logo (white SVG paths render correctly on transparent background)
          ctx.globalAlpha = 0.82;
          ctx.drawImage(logo, wX, wY, logoW, logoH);
          ctx.globalAlpha = 1;
          // Label — Inter 500, sized at 11px, vertically centred with logo
          ctx.font = "500 11px Inter, ui-sans-serif, system-ui, sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.82)";
          ctx.textBaseline = "middle";
          ctx.fillText(label, wX + logoW + gap, wY + logoH / 2);
          ctx.textBaseline = "alphabetic";
        }
        rafState.id = requestAnimationFrame(draw);
      };
      draw();

      const mimeType = ["video/webm;codecs=vp8", "video/webm", "video/mp4"]
        .find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
      const rec = new MediaRecorder(canvas.captureStream(30), mimeType ? { mimeType } : {});
      recorder = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        cancelAnimationFrame(rafState.id);
        videoEl.srcObject = null;
        if (chunksRef.current.length > 0)
          uploadRecording(new Blob(chunksRef.current, { type: mimeType || "video/webm" }));
      };
      rec.start(1000);
      recorderRef.current = rec;
    })().catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafState.id);
      if (recorder?.state !== "inactive") recorder?.stop();
    };
  }, [state.phase, state.remoteStream, uploadRecording]);

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
    setCamError("");
    // getUserMedia is only exposed in a secure context (HTTPS or localhost).
    // Over plain http:// on a LAN IP the browser hides navigator.mediaDevices,
    // which would otherwise fall through to the vague generic error below — call
    // it out so local/booth testing over http:// isn't mistaken for a bug.
    if (typeof window !== "undefined" && (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia)) {
      setCamError(
        "Live camera needs a secure (HTTPS) connection. Open this page over https:// or via localhost — a plain http:// address such as a LAN IP blocks camera access in the browser."
      );
      setStep("consent");
      return;
    }
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
    } catch (e) {
      // If we acquired the camera before the failure (e.g. urlToBase64 threw),
      // stop the tracks now — otherwise the next "Try again" hits NotReadableError
      // because the browser still considers the camera claimed.
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (selfViewRef.current) selfViewRef.current.srcObject = null;

      const name = (e as Error)?.name || "";
      const msg =
        name === "NotAllowedError" || name === "SecurityError"
          ? "Camera blocked. Click the camera icon in your browser's address bar, allow access, then try again."
          : name === "NotReadableError" || name === "TrackStartError"
          ? "Your camera is in use by another tab or app (check other Zoom/Meet/recording tabs). Close it and try again."
          : name === "NotFoundError" || name === "OverconstrainedError"
          ? "No camera was found on this device."
          : name === "AbortError"
          ? "Camera request was interrupted — please try again."
          : "Couldn't access your camera. Please try again.";
      setCamError(msg);
      setStep("consent");
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

  const onAddFace = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      setLibrary((prev) => [...prev, { label: "Your photo", url, custom: true, shared: false }]);
      setSelected(url);
      // Encode and store on Aries + swap live if running
      try {
        const b64 = await urlToBase64(url);
        uploadFace(b64);
        if (step === "running" && state.phase === "live") setFace(b64);
      } catch { /* keep current */ }
    },
    [step, state.phase, setFace, uploadFace]
  );

  // Remove a face from the library. Persistent (seed) faces come back on the
  // next reload; an own-upload's object URL is revoked here so it's truly gone.
  // If the removed face was selected, fall back to the first remaining face.
  const removeFace = useCallback(
    (url: string) => {
      if (AI_FACES.some((f) => f.url === url)) return; // synthetic faces are fixed
      if (url.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* already revoked */
        }
        objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== url);
      }
      setLibrary((prev) => {
        const next = prev.filter((f) => f.url !== url);
        setSelected((sel) => (sel === url ? next[0]?.url ?? "" : sel));
        return next;
      });
    },
    []
  );

  const copyShareLink = useCallback(async () => {
    const url = `https://scam.ai/share/${sessionIdRef.current}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  }, []);

  const reset = useCallback(() => {
    stop();
    localStreamRef.current = null;
    secondsRef.current = DEMO_SECONDS;
    setSecondsLeft(DEMO_SECONDS);
    setShowShareModal(false);
    setLinkCopied(false);
    setStep("intro");
  }, [stop]);

  const connecting = step === "running" && (state.phase === "connecting" || state.phase === "queued");
  const live = step === "running" && state.phase === "live";
  // ETA = people AHEAD of you × seconds per session (position 1 means you're
  // next, no one ahead; position 3 means 2 people ahead → 60s, not 90s).
  const peopleAheadCount = Math.max(0, (state.queuePosition ?? 1) - 1);
  const queueEta = peopleAheadCount > 0 ? peopleAheadCount * PER_PLAY_SECONDS : null;

  // ─── Face picker — two sections: presets + your uploads ──────────────────
  const FacePicker = ({ compact = false }: { compact?: boolean }) => {
    const size = compact ? "h-12 w-12" : "h-14 w-14";
    const syntheticFaces = library.filter((f) => f.synthetic);
    const uploadedFaces = library.filter((f) => !f.synthetic);
    const atCap = false; // no upload limit

    const renderFace = (f: Face) => {
      const active = selected === f.url;
      // custom uploads: teal ring for private, green for shared
      const ringClass = active
        ? "ring-[#245FFF] shadow-[0_0_18px_-4px_rgba(36,95,255,0.7)]"
        : f.custom
        ? f.shared
          ? "ring-emerald-500/50 hover:ring-emerald-400/70"
          : "ring-teal-500/40 hover:ring-teal-400/60"
        : "ring-white/10 hover:ring-white/30";
      return (
        <div key={f.url} className="group relative">
          <button
            type="button"
            onClick={() => onPickFace(f.url)}
            title="Become this face"
            className={`block overflow-hidden rounded-lg ring-2 transition-[box-shadow,ring-color] ${ringClass}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.url} alt={f.label} className={`${size} object-cover`} />
            {/* Private / shared badge on custom uploads */}
            {f.custom && (
              <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded bg-black/70">
                {f.shared ? (
                  // share icon
                  <svg className="h-2 w-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                ) : (
                  <Lock className="h-2 w-2 text-teal-400" />
                )}
              </span>
            )}
          </button>
          {!f.synthetic && (
            <button
              type="button"
              onClick={() => removeFace(f.url)}
              aria-label="Remove this face"
              title="Remove"
              className="absolute -right-1.5 -top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/80 opacity-0 transition-[background-color] hover:bg-red-500 hover:text-white focus:opacity-100 group-hover:opacity-100"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* ── Preset faces (StyleGAN2 synthetic only) ── */}
        <div>
          <div className="mb-2 flex items-baseline gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">
              Preset faces
            </span>
            <span className="text-[9px] text-white/40">· StyleGAN2 AI-generated</span>
          </div>
          <div className={`flex flex-wrap gap-2 ${compact ? "justify-center" : ""}`}>
            {syntheticFaces.map(renderFace)}
          </div>
        </div>

        {/* ── User uploads section ── */}
        <div>
          <div className="mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">
              User uploads
            </span>
          </div>
          <div className={`flex flex-wrap items-center gap-2 ${compact ? "justify-center" : ""}`}>
            {uploadedFaces.map(renderFace)}
            {!atCap && (
              <button
                type="button"
                onClick={() => { setConsentChecked(false); setShowConsent(true); }}
                title="Upload your own face"
                className={`flex ${size} flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-white/25 text-white/50 transition-[border-color,color] hover:border-[#245FFF]/60 hover:text-white`}
              >
                <Plus className="h-4 w-4" />
                <span className="text-[8px] font-medium">Upload</span>
              </button>
            )}
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={onAddFace} className="hidden" />

        {/* ── Consent dialog ── */}
        {showConsent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowConsent(false)} />
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
              <h3 className="mb-5 text-sm font-semibold text-white">Upload a face</h3>

              {/* Consent checkbox */}
              <label className="flex cursor-pointer items-start gap-3 rounded-lg p-3 ring-1 ring-white/10 hover:ring-white/20 transition-[box-shadow]">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#245FFF]"
                />
                <span className="text-[12px] leading-snug text-white/75">
                  I have the subject&apos;s consent to use their photo in this demo.
                </span>
              </label>

              {/* Share to pool — always disabled (pool full) */}
              <div className="mt-3 flex items-start gap-3 rounded-lg p-3 ring-1 ring-white/5 opacity-50 cursor-not-allowed">
                <input type="checkbox" disabled className="mt-0.5 h-4 w-4 shrink-0 cursor-not-allowed" />
                <div>
                  <span className="text-[12px] leading-snug text-white/50">
                    Add to public swap pool
                  </span>
                  <span className="ml-2 inline-flex items-center rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-white/35">
                    Pool full
                  </span>
                  <p className="mt-0.5 text-[10px] text-white/30">
                    Your face stays private — only you can use it.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowConsent(false)}
                  className="flex-1 rounded-full border border-white/15 py-2.5 text-sm font-medium text-white/60 transition-[background-color] hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!consentChecked}
                  onClick={() => { setShowConsent(false); fileInputRef.current?.click(); }}
                  className="flex-1 rounded-full bg-[#245FFF] py-2.5 text-sm font-semibold text-white transition-[background-color] hover:bg-[#3d74ff] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Choose photo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── The swap stage — a clean video frame (no app-window chrome) ──────────
  const peopleAhead = peopleAheadCount;
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


        {/* non-fatal no-face hint (live session keeps the previous face) */}
        {state.faceWarning && (
          <div className="absolute left-1/2 top-3 z-20 flex max-w-[90%] -translate-x-1/2 items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/20 px-3 py-1.5 text-center text-[11px] font-medium text-amber-100 backdrop-blur-md">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {state.faceWarning}
          </div>
        )}

        {/* Watermark — bottom-left, visible during live swap */}
        {live && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-md bg-black/35 px-2 py-1 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/scamai-logo.svg" alt="scam.ai" className="h-3.5 w-auto opacity-75" />
            <span className="text-[9px] font-medium text-white/55">AI-generated</span>
          </div>
        )}

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
            <p className="text-sm text-white/70">Pick a photo, then go live.</p>
            <button
              onClick={beginConsent}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_-6px_rgba(36,95,255,0.8)] transition hover:bg-[#3d74ff] active:scale-[0.98]"
            >
              <Camera className="h-4 w-4" /> Start the live demo
            </button>
          </Overlay>
        )}

        {step === "consent" && (
          <Overlay>
            <ShieldCheck className="mb-2 h-8 w-8 text-[#245FFF]" />
            <h3 className="text-base font-semibold text-white">Camera access</h3>
            {camError && (
              <p className="mt-3 flex max-w-xs items-start gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-left text-[12px] leading-relaxed text-red-200">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {camError}
              </p>
            )}
            <div className="mt-4 flex gap-2.5">
              <button onClick={launch} className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#3d74ff] active:scale-[0.98]">
                <Camera className="h-4 w-4" /> {camError ? "Try again" : "Allow & start"}
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
            <h3 className="mt-2 max-w-sm text-lg font-semibold text-white sm:text-xl">Anyone can fake a face.</h3>
            <div className="mt-5 flex flex-col items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(36,95,255,0.7)] transition hover:bg-[#3d74ff] active:scale-[0.98]"
              >
                Share your deepfake <ArrowRight className="h-4 w-4" />
              </button>
              <Link href={HALO_HREF} className="inline-flex items-center gap-1.5 text-xs text-white/50 transition hover:text-white">
                Meet Halo — the defense <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <button onClick={reset} className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/30 transition hover:text-white/60">
              <RefreshCw className="h-3.5 w-3.5" /> Run again
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
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white lg:text-left">
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

      {/* ─── Share modal ──────────────────────────────────────────────────── */}
      {showShareModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#245FFF]">
              Share your deepfake
            </p>
            <p className="mt-1 text-base font-semibold text-white">
              Dare them to spot the fake.
            </p>

            {/* Link row */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <span className="min-w-0 flex-1 truncate text-[12px] text-white/50">
                scam.ai/share/{sessionIdRef.current}
              </span>
              <button
                onClick={copyShareLink}
                className="shrink-0 rounded-lg bg-[#245FFF] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#3d74ff] active:scale-[0.97]"
              >
                {linkCopied ? "Copied!" : "Copy link"}
              </button>
            </div>

            {/* Toast */}
            {linkCopied && (
              <p className="mt-2 text-center text-[11px] text-white/40">
                Link copied — good luck convincing them.
              </p>
            )}

            {/* Social platforms */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just deepfaked myself in 30 seconds. Can you tell what's real?")}&url=${encodeURIComponent(`https://scam.ai/share/${sessionIdRef.current}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-[13px] font-medium text-white/70 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
              >
                {/* X (Twitter) wordmark */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Can you tell what's real? I just deepfaked myself 👀 https://scam.ai/share/${sessionIdRef.current}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-[13px] font-medium text-white/70 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
              >
                {/* WhatsApp icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
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
