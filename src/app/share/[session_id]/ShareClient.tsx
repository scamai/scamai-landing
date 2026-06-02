"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  sessionId: string;
}

export default function ShareClient({ sessionId }: Props) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">("loading");
  const [retries, setRetries] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (status === "ready" || retries >= 10) {
      if (retries >= 10) setStatus("notfound");
      return;
    }
    const delay = retries === 0 ? 400 : 2500;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/share/${sessionId}`);
        if (res.ok) {
          const data = (await res.json()) as { url?: string };
          if (data.url) { setVideoUrl(data.url); setStatus("ready"); return; }
        }
        if (res.status === 404) {
          setRetries((r) => r + 1);
          return;
        }
      } catch { /* retry */ }
      setRetries((r) => r + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [sessionId, status, retries]);

  useEffect(() => {
    const v = videoRef.current;
    if (v && videoUrl) { v.load(); v.play().catch(() => {}); }
  }, [videoUrl]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Nav */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/scamai-logo.svg" alt="scam.ai" className="h-5 w-auto opacity-90" />
        <Link
          href="/"
          className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors"
        >
          scam.ai
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">

        {/* Label */}
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#245FFF]">
          AI-generated deepfake
        </p>

        {/* Video card */}
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_100px_-20px_rgba(36,95,255,0.15)]">
          {status === "ready" && videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full"
            />
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center gap-3">
              {status === "notfound" ? (
                <p className="text-sm text-white/30">Video not available.</p>
              ) : (
                <>
                  {/* Pulsing ring loader */}
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#245FFF]/30" />
                    <span className="relative inline-flex h-5 w-5 rounded-full bg-[#245FFF]/60" />
                  </div>
                  <p className="text-xs text-white/35">Rendering your deepfake…</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Copy */}
        <h1 className="mt-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Anyone can fake a face.
        </h1>
        <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-white/50">
          This took 30 seconds and a webcam. See it yourself — then meet the defense.
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#playground"
            className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(36,95,255,0.7)] transition hover:bg-[#3d74ff] active:scale-[0.98]"
          >
            Try it yourself <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/halo"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5 active:scale-[0.98]"
          >
            Meet Halo
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 py-4 text-center text-[11px] text-white/20">
        scam.ai — deepfake detection platform
      </div>
    </div>
  );
}
