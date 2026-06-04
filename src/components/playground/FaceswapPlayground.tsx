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
import QRCode from "qrcode";
import { Link } from "@/i18n/navigation";
import { Camera, ShieldCheck, RefreshCw, ArrowRight, AlertTriangle, ScanFace, Plus, X, Lock } from "lucide-react";
import { PAIRS, QR_TARGET, SHARE_URL_X, rollTier, shareText } from "@/lib/share-card";
import { trackEvent } from "@/lib/analytics";
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
  const hasGrantedCameraRef = useRef(false); // skip consent step on re-runs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const secondsRef = useRef(DEMO_SECONDS);
  const sessionIdRef = useRef<string>(Math.random().toString(36).slice(2) + Date.now().toString(36));
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  // Pre-built share File (set when the card renders) so share handlers can call
  // navigator.share() synchronously — iOS Safari drops the user-gesture
  // ("transient activation") if you await before calling share.
  const shareFileRef = useRef<File | null>(null);
  // Share text matches the card's rolled copy pair (set in captureAndCompose).
  const shareTextRef = useRef("I deepfaked myself in 30 seconds 😳 Real or fake? → scam.ai");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [shareCardUrl, setShareCardUrl] = useState("");
  const [showCard, setShowCard] = useState(false);

  // Revoke any uploaded-face object URLs when the component unmounts.
  useEffect(() => () => objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  // Remember camera grant across reloads so re-runs skip the consent screen.
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("scamai_cam_ok") === "1") {
      hasGrantedCameraRef.current = true;
    }
  }, []);

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
      const logoH = 28;
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
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(wX - 8, wY - 5, bgW, bgH, 5);
          } else {
            ctx.rect(wX - 8, wY - 5, bgW, bgH);
          }
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

  // Funnel events on phase TRANSITIONS only (phase is in deps of several
  // effects — the ref dedupes re-renders so each step fires exactly once).
  const trackedPhaseRef = useRef<string>("");
  useEffect(() => {
    if (state.phase === trackedPhaseRef.current) return;
    trackedPhaseRef.current = state.phase;
    if (state.phase === "live") {
      trackEvent({ action: "playground_swap_live", category: "playground" });
    } else if (state.phase === "queued") {
      trackEvent({ action: "playground_queued", category: "playground" });
    } else if (state.phase === "error") {
      trackEvent({ action: "playground_swap_error", category: "playground", label: state.error });
    } else if (state.phase === "ended") {
      // Engine closed the session (TIME_EXPIRED). Timer path tracks separately.
      trackEvent({ action: "playground_session_completed", category: "playground", label: "engine" });
    }
  }, [state.phase, state.error]);

  // 30s countdown — starts when the swap goes live, ends → CTA.
  useEffect(() => {
    if (step !== "running" || state.phase !== "live") return;
    const id = setInterval(() => {
      secondsRef.current -= 1;
      setSecondsLeft(secondsRef.current);
      if (secondsRef.current <= 0) {
        clearInterval(id);
        trackEvent({ action: "playground_session_completed", category: "playground", label: "timer" });
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
      hasGrantedCameraRef.current = true; // remember permission was granted
      try { localStorage.setItem("scamai_cam_ok", "1"); } catch { /* ignore */ }
      trackEvent({ action: "playground_camera_granted", category: "playground" });
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
      trackEvent({ action: "playground_camera_error", category: "playground", label: name || "unknown" });
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

  // ─── 3-2-1 screenshot → branded share card ───────────────────────────────
  const captureAndCompose = useCallback(async () => {
    const video = remoteVideoRef.current;
    if (!video || video.readyState < 2) return;

    await document.fonts.ready;

    const W = 1080, H = 1920; // 9:16 — Stories / TikTok / Reels (max screen fill)
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // ── Helpers ────────────────────────────────────────────────────────
    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
    };
    const rgba = (hex: string, a: number) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    };
    const inter = "Inter, ui-sans-serif, system-ui, sans-serif";
    const monoF = "ui-monospace, SFMono-Regular, Menlo, monospace";
    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>((res) => {
        const img = new Image();
        img.onload = img.onerror = () => res(img);
        img.src = src;
      });

    // ── Roll the card: tier (70/20/7/3) + copy pair + forensic numbers ──
    const tier = rollTier();
    const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    shareTextRef.current = shareText(pair); // X/share text matches the card
    // label = tier key → PostHog can break down share-rate by rarity and
    // verify the 70/20/7/3 distribution actually holds in production.
    trackEvent({ action: "playground_card_generated", category: "playground", label: tier.key });
    const conf = (98 + Math.random() * 1.9).toFixed(2);
    const cardNo = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

    // ── Tier border ring + inner card ──────────────────────────────────
    const RING = 13;
    const ringGrad = ctx.createLinearGradient(0, 0, W, H); // ≈135°
    for (const [o, c] of tier.stops) ringGrad.addColorStop(o, c);
    ctx.fillStyle = ringGrad;
    // Full-bleed fill (NOT rounded): JPEG has no alpha — rounded outer corners
    // would export as black notches on white feeds.
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#0c0a06";
    rr(RING, RING, W - RING * 2, H - RING * 2, 52); ctx.fill();

    const cx = 80, cw = W - 160; // content box

    // ── Header: real logo (left) + tier chip (right) ───────────────────
    const logo = await loadImg("/scamai-logo.svg");
    const headerY = 88, logoH = 62, logoW = Math.round(logoH * (1012 / 256));
    ctx.drawImage(logo, cx, headerY, logoW, logoH);

    ctx.font = `900 36px ${inter}`;
    const chipLabel = `✦ ${tier.name}`;
    const chipTextW = ctx.measureText(chipLabel).width;
    const chipH = 64, chipW = chipTextW + 68;
    const chipX = W - cx - chipW, chipY = headerY + (logoH - chipH) / 2;
    ctx.fillStyle = tier.chipBg; rr(chipX, chipY, chipW, chipH, chipH / 2); ctx.fill();
    ctx.fillStyle = tier.chipText; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(chipLabel, chipX + chipW / 2, chipY + chipH / 2 + 2);

    // ── Face window (dominant) — mirror, cover-fit ──────────────────────
    const fX = cx, fY = 192, fW = cw, fH = 978, fR = 32;
    const vW = video.videoWidth || 1280;
    const vH = video.videoHeight || 720;
    const fScale = Math.max(fW / vW, fH / vH);
    const sW = fW / fScale, sH = fH / fScale;
    const sX = (vW - sW) / 2, sY = (vH - sH) / 2;
    ctx.save();
    rr(fX, fY, fW, fH, fR); ctx.clip();
    ctx.transform(-1, 0, 0, 1, fX + fW, 0); // mirror within clip
    ctx.drawImage(video, sX, sY, sW, sH, 0, fY, fW, fH);
    // holo shine sweep (inside the same clip)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const shine = ctx.createLinearGradient(fX, fY, fX + fW, fY + fH * 0.55);
    shine.addColorStop(0.4, "rgba(255,255,255,0)");
    shine.addColorStop(0.5, rgba("#ffffff", tier.shine));
    shine.addColorStop(0.6, "rgba(255,255,255,0)");
    ctx.fillStyle = shine; ctx.fillRect(fX, fY, fW, fH);
    ctx.restore();
    ctx.strokeStyle = rgba(tier.accent, 0.33); ctx.lineWidth = 3;
    rr(fX, fY, fW, fH, fR); ctx.stroke();

    // ── Detection watermark ON the face: scan corners + verdict badge ───
    const cLen = 62, cInset = 22;
    ctx.strokeStyle = tier.accent; ctx.lineWidth = 8; ctx.lineCap = "square";
    const corner = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.stroke();
    };
    corner(fX + cInset, fY + cInset + cLen, fX + cInset, fY + cInset, fX + cInset + cLen, fY + cInset);
    corner(fX + fW - cInset - cLen, fY + cInset, fX + fW - cInset, fY + cInset, fX + fW - cInset, fY + cInset + cLen);
    corner(fX + cInset, fY + fH - cInset - cLen, fX + cInset, fY + fH - cInset, fX + cInset + cLen, fY + fH - cInset);
    corner(fX + fW - cInset - cLen, fY + fH - cInset, fX + fW - cInset, fY + fH - cInset, fX + fW - cInset, fY + fH - cInset - cLen);

    ctx.font = `800 30px ${inter}`;
    const dLabel = `DEEPFAKE · ${conf}%`;
    const dTextW = ctx.measureText(dLabel).width;
    const dDotR = 9, dGap = 14, dPadX = 24, dH = 58;
    const dW = dPadX * 2 + dDotR * 2 + dGap + dTextW;
    const dX = fX + 24, dY = fY + 24;
    ctx.fillStyle = "rgba(8,8,10,0.66)"; rr(dX, dY, dW, dH, dH / 2); ctx.fill();
    ctx.fillStyle = tier.detect;
    ctx.beginPath(); ctx.arc(dX + dPadX + dDotR, dY + dH / 2, dDotR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillText(dLabel, dX + dPadX + dDotR * 2 + dGap, dY + dH / 2 + 2);

    ctx.font = `700 32px ${monoF}`; ctx.fillStyle = tier.accent;
    ctx.textAlign = "right"; ctx.textBaseline = "top";
    ctx.fillText(`#${cardNo}`, fX + fW - 28, fY + 30);

    // ── Headline (one line, shrink-to-fit) + punchline ──────────────────
    const fitFont = (text: string, weight: number, max: number, startPx: number) => {
      let px = startPx;
      ctx.font = `${weight} ${px}px ${inter}`;
      while (ctx.measureText(text).width > max && px > 24) {
        px -= 2;
        ctx.font = `${weight} ${px}px ${inter}`;
      }
    };
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    const headline = `${pair.h[0]} ${pair.h[1]}`;
    ctx.fillStyle = "#ffffff";
    fitFont(headline, 800, cw, 78);
    ctx.fillText(headline, cx, 1284);
    ctx.fillStyle = tier.accent;
    fitFont(pair.p, 700, cw, 48);
    ctx.fillText(pair.p, cx, 1358);

    // ── MAKE YOURS seal — offline QR → scam.ai homepage ─────────────────
    const sealY = 1408, sealH = 292;
    ctx.fillStyle = rgba(tier.accent, 0.08); rr(cx, sealY, cw, sealH, 40); ctx.fill();
    ctx.strokeStyle = rgba(tier.accent, 0.3); ctx.lineWidth = 3; rr(cx, sealY, cw, sealH, 40); ctx.stroke();

    const qrCanvas = document.createElement("canvas");
    try {
      await QRCode.toCanvas(qrCanvas, QR_TARGET, { width: 416, margin: 1, color: { dark: "#000000", light: "#ffffff" } });
    } catch { /* QR failure → white chip stays empty; URL text still on card */ }
    const chipS = 232, qPad = 14;
    const qX = cx + 30, qY = sealY + (sealH - chipS) / 2;
    ctx.fillStyle = "#fff"; rr(qX, qY, chipS, chipS, 18); ctx.fill();
    if (qrCanvas.width > 0) ctx.drawImage(qrCanvas, qX + qPad, qY + qPad, chipS - qPad * 2, chipS - qPad * 2);

    const sealTextX = qX + chipS + 40;
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = tier.accent; ctx.font = `900 54px ${inter}`;
    ctx.fillText("MAKE YOURS → 30s", sealTextX, sealY + sealH / 2 - 8);
    ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.font = `400 38px ${inter}`;
    ctx.fillText("scam.ai", sealTextX, sealY + sealH / 2 + 52);

    // ── Halo footer ad (one line, last element): ring · Halo · tagline ──
    const adY = 1808; // centerline — sits a touch lower now that the drop strip is gone
    ctx.font = `700 38px ${inter}`;
    const haloW = ctx.measureText("Halo").width;
    const adRest = " · on-device deepfake detection";
    ctx.font = `400 38px ${inter}`;
    const restW = ctx.measureText(adRest).width;
    const ringR = 15, adGap = 18;
    const totalW = ringR * 2 + adGap + haloW + restW;
    let ax = (W - totalW) / 2;
    ctx.strokeStyle = tier.accent; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(ax + ringR, adY, ringR, 0, Math.PI * 2); ctx.stroke();
    ax += ringR * 2 + adGap;
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff"; ctx.font = `700 38px ${inter}`;
    ctx.fillText("Halo", ax, adY + 2);
    ax += haloW;
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = `400 38px ${inter}`;
    ctx.fillText(adRest, ax, adY + 2);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.93);
    setShareCardUrl(dataUrl);
    setShowCard(true);

    // Pre-build the share File now so handlers can call navigator.share()
    // synchronously (preserves the iOS gesture; see shareFileRef).
    shareFileRef.current = null;
    canvas.toBlob(
      (blob) => {
        if (blob) shareFileRef.current = new File([blob], "scamai-deepfake.jpg", { type: "image/jpeg" });
      },
      "image/jpeg",
      0.93
    );

    // Silent background upload
    try {
      const b64 = dataUrl.split(",")[1];
      await fetch("/api/playground/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "face", data: b64, session_id: `snap-${sessionIdRef.current}`, mime_type: "image/jpeg" }),
      });
    } catch { /* best-effort */ }
  }, []);

  const startCapture = useCallback(() => {
    if (countdown !== null) return;
    let n = 3;
    setCountdown(n);
    const tick = setInterval(() => {
      n--;
      if (n <= 0) {
        clearInterval(tick);
        setCountdown(null); // hide immediately — no emoji, just capture
        captureAndCompose();
      } else {
        setCountdown(n);
      }
    }, 1000);
  }, [countdown, captureAndCompose]);

  const [saved, setSaved] = useState(false);
  const [shareHint, setShareHint] = useState("");

  // Web sharing can't push an image to IG/WhatsApp/X programmatically (no platform
  // API). The ONLY path that carries the image is the native share sheet via
  // Web Share API Level 2 (mobile). Everywhere else we download the image — it
  // already has the card branding + QR → scam.ai baked in, so it IS the ad.
  // Text lives in shareTextRef and matches the card's rolled copy pair.

  const isIOS =
    typeof navigator !== "undefined" &&
    (/iP(hone|ad|od)/.test(navigator.userAgent) ||
      // iPadOS 13+ reports as Mac; detect via touch
      (navigator.platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1));
  const isMobile =
    typeof navigator !== "undefined" &&
    (isIOS || /Android/i.test(navigator.userAgent));

  // Can we share the pre-built card File via the native sheet right now?
  const canShareFile = () => {
    const f = shareFileRef.current;
    return !!(
      f &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [f] })
    );
  };

  // Download the card. Prefer the pre-built File (synchronous → keeps the user
  // gesture); fall back to the data URL. Open in a new tab on iOS Safari, which
  // ignores `download` and would otherwise navigate away from the playground.
  const downloadImage = useCallback(() => {
    const file = shareFileRef.current;
    let url: string;
    let revoke = false;
    if (file) {
      url = URL.createObjectURL(file);
      revoke = true;
    } else if (shareCardUrl) {
      url = shareCardUrl;
    } else {
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = "scamai-deepfake.jpg";
    if (isIOS) a.target = "_blank"; // iOS opens the image to long-press → Save
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (revoke) setTimeout(() => URL.revokeObjectURL(url), 15_000);
  }, [shareCardUrl, isIOS]);

  // Save to the photo album. The web has no direct "write to album" API — the
  // ONLY way to reach Photos/相册 on a phone is the native share sheet's
  // "Save Image" action. On mobile we open the (image-only) sheet; on desktop we
  // download the file directly. navigator.share is called SYNCHRONOUSLY (no await
  // before it) to preserve the iOS user-gesture.
  const saveImage = useCallback(() => {
    trackEvent({ action: "playground_card_saved", category: "playground", label: isMobile ? "mobile" : "desktop" });
    if (isMobile && canShareFile()) {
      navigator
        .share({ files: [shareFileRef.current!] }) // sheet → "Save Image" → album
        .catch((e: Error) => {
          if (e?.name !== "AbortError") downloadImage();
        });
      return;
    }
    downloadImage();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [isMobile, downloadImage]);

  // Share via native sheet (carries the image) on mobile; download + hint on desktop.
  const webShare = useCallback(() => {
    trackEvent({ action: "playground_card_shared", category: "playground", label: isMobile ? "mobile" : "desktop" });
    if (canShareFile()) {
      navigator
        .share({ text: shareTextRef.current, files: [shareFileRef.current!] })
        .catch((e: Error) => {
          // AbortError = user dismissed the sheet → do nothing.
          if (e?.name !== "AbortError") {
            downloadImage();
            setShareHint("Image saved — post it anywhere 🚀");
            setTimeout(() => setShareHint(""), 3500);
          }
        });
      return;
    }
    // Desktop / no file-share support: download + tell the user.
    downloadImage();
    setShareHint("Image saved — post it to your story 🚀");
    setTimeout(() => setShareHint(""), 3500);
  }, [downloadImage]);

  // Post to X.
  // - Mobile: the only way to carry the image into X is the native sheet (user
  //   picks X). Called synchronously to keep the iOS gesture.
  // - Desktop: open the X web composer (synchronous → not popup-blocked) and
  //   download the image so it's ready to attach.
  const postToX = useCallback(() => {
    trackEvent({ action: "playground_card_posted_x", category: "playground", label: isMobile ? "mobile" : "desktop" });
    if (isMobile && canShareFile()) {
      navigator
        .share({ text: shareTextRef.current, files: [shareFileRef.current!] })
        .catch((e: Error) => {
          if (e?.name !== "AbortError") {
            downloadImage();
            setShareHint("Image saved — open X and attach it 📎");
            setTimeout(() => setShareHint(""), 3500);
          }
        });
      return;
    }
    // Drop the trailing "→ scam.ai" from the intent text — the UTM-tagged url
    // param renders as a t.co link (displays as scam.ai) and is attributable.
    const intentText = shareTextRef.current.replace(/ → scam\.ai$/, "");
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(intentText)}&url=${encodeURIComponent(SHARE_URL_X)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
    downloadImage();
    setShareHint("Image saved — attach it to your tweet 📎");
    setTimeout(() => setShareHint(""), 3500);
  }, [isMobile, downloadImage]);

  const reset = useCallback(() => {
    stop(); // closes WebRTC + stops camera tracks (indicator turns off)
    localStreamRef.current = null;
    secondsRef.current = DEMO_SECONDS;
    setSecondsLeft(DEMO_SECONDS);
    setCountdown(null);
    setShareCardUrl("");
    setShowCard(false);
    setSaved(false);
    setShareHint("");
    // Skip consent screen on re-runs — auto-launch via effect below
    setStep(hasGrantedCameraRef.current ? "consent" : "intro");
  }, [stop]);

  // Auto-launch when returning to consent with prior permission granted
  useEffect(() => {
    if (step === "consent" && !camError && hasGrantedCameraRef.current) {
      launch();
    }
  }, [step, camError, launch]);

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

              {/* Share to pool — always disabled (pool full). No opacity stacking:
                  use single-layer readable dim colors + amber status badge. */}
              <div className="mt-3 flex cursor-not-allowed items-start gap-3 rounded-lg bg-white/[0.02] p-3 ring-1 ring-white/5 select-none">
                {/* Unselectable visual: dashed box + diagonal slash (native disabled
                    checkboxes still look clickable on dark bg) */}
                <span aria-hidden className="relative mt-0.5 h-4 w-4 shrink-0 overflow-hidden rounded-[4px] border border-dashed border-white/20 bg-white/[0.03]">
                  <span className="absolute left-1/2 top-1/2 h-px w-[150%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/25" />
                </span>
                <div>
                  <span className="text-[12px] font-medium leading-snug text-white/60">
                    Add to public swap pool
                  </span>
                  <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300/90">
                    Pool full
                  </span>
                  <p className="mt-1 text-[10px] leading-relaxed text-white/45">
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

        {/* Share button — top-right during live */}
        {live && countdown === null && !showCard && (
          <button
            onClick={startCapture}
            className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/15 active:scale-[0.97]"
          >
            <Camera className="h-3 w-3" /> Share
          </button>
        )}

        {/* 3-2-1 countdown overlay + 9:16 viewfinder */}
        {countdown !== null && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20">
            {/* 9:16 portrait viewfinder — matches exactly what gets captured in the card */}
            <div
              className="pointer-events-none absolute"
              style={{ height: "100%", aspectRatio: "9/16" }}
            >
              <span className="absolute left-0 top-0 h-9 w-9 border-l-[3px] border-t-[3px] border-white/75" />
              <span className="absolute right-0 top-0 h-9 w-9 border-r-[3px] border-t-[3px] border-white/75" />
              <span className="absolute bottom-0 left-0 h-9 w-9 border-b-[3px] border-l-[3px] border-white/75" />
              <span className="absolute bottom-0 right-0 h-9 w-9 border-b-[3px] border-r-[3px] border-white/75" />
            </div>
            <span
              key={countdown}
              className="text-[140px] font-bold tabular-nums text-white"
              style={{ textShadow: "0 0 60px rgba(36,95,255,0.9), 0 4px 24px rgba(0,0,0,0.6)", lineHeight: 1 }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* Watermark — bottom-left, visible during live swap */}
        {live && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-md bg-black/35 px-2 py-1 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/scamai-logo.svg" alt="scam.ai" className="h-5 w-auto opacity-75" />
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
            {/* Re-runs with permission already granted: show a spinner, NOT the
                consent dialog (avoids the prompt flashing for a frame). */}
            {hasGrantedCameraRef.current && !camError ? (
              <>
                <Spinner />
                <p className="mt-3 text-xs tracking-wide text-white/55">Reconnecting…</p>
              </>
            ) : (
              <>
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
              </>
            )}
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
            <h3 className="mt-2 max-w-sm text-lg font-semibold text-white sm:text-xl">Anyone can fake a face. Catch it on-device.</h3>
            <Link
              href={HALO_HREF}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
            >
              Meet Halo — the defense <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={reset} className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/30 transition hover:text-white/60">
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

      {/* ─── Share card modal ─────────────────────────────────────────────── */}
      {showCard && shareCardUrl && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCard(false)} />
          <div className="relative flex flex-col items-center" style={{ maxHeight: "90vh" }}>
            <button
              onClick={() => setShowCard(false)}
              className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-[#111] text-white/50 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Preview card (the shareable image). No overlay tag — it would
                cover the baked-in scam.ai logo in the card's top-left. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shareCardUrl}
              alt="Your deepfake card"
              className="rounded-xl shadow-2xl"
              style={{ maxHeight: "58vh", width: "auto" }}
            />

            {/* Action controls — visually distinct panel so it's clearly the toolbar,
                not part of the card above (the card's blue CTA is baked into the image). */}
            <div className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="mb-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Save or share your card
              </p>
              {/* Primary: native share (mobile) / save+post (desktop) */}
              <button
                onClick={webShare}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#245FFF] py-3 text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgba(36,95,255,0.8)] transition hover:bg-[#3d74ff] active:scale-[0.98]"
              >
                <ArrowRight className="h-4 w-4 rotate-[-45deg]" />
                Share
              </button>

              {/* Secondary: Save image · Post to X */}
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <button
                  onClick={saveImage}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12px] font-semibold transition ${
                    saved
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                      : "border-white/10 bg-white/[0.02] font-medium text-white/70 hover:border-white/25 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {saved ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  {saved ? "Saved" : "Save image"}
                </button>
                <button
                  onClick={postToX}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] py-2.5 text-[12px] font-medium text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Post to X
                </button>
              </div>

              {/* Hint toast (desktop share / X attach instruction) */}
              {shareHint && (
                <p className="mt-2.5 text-center text-[11px] text-white/45">{shareHint}</p>
              )}
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
