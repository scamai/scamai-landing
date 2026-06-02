"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

interface Props {
  sessionId: string;
  initialVideoUrl: string | null;
}

export default function ShareClient({ sessionId, initialVideoUrl }: Props) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [loading, setLoading] = useState(!initialVideoUrl);
  const [retries, setRetries] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Poll for the video if it wasn't ready at SSR time (upload still in progress)
  useEffect(() => {
    if (videoUrl || retries >= 8) return;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/share/${sessionId}`);
        if (res.ok) {
          const data = (await res.json()) as { url?: string };
          if (data.url) { setVideoUrl(data.url); setLoading(false); return; }
        }
      } catch { /* retry */ }
      setRetries((r) => r + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [sessionId, videoUrl, retries]);

  useEffect(() => {
    const v = videoRef.current;
    if (v && videoUrl) { v.load(); v.play().catch(() => {}); }
  }, [videoUrl]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4 py-12">
      {/* Logo */}
      <Link href="/" className="mb-8 block">
        <Image src="/scamai-logo.svg" alt="scam.ai" width={100} height={25} priority />
      </Link>

      {/* Video stage */}
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        {videoUrl ? (
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
          <div className="flex aspect-video items-center justify-center">
            {loading && retries < 8 ? (
              <div className="flex flex-col items-center gap-3 text-white/40">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="text-sm">Video is being processed…</span>
              </div>
            ) : (
              <span className="text-sm text-white/30">Video not available.</span>
            )}
          </div>
        )}
      </div>

      {/* Copy */}
      <div className="mt-8 max-w-sm text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#245FFF]">
          That took 30 seconds.
        </p>
        <h1 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
          Anyone can fake a face.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          This deepfake was created in real time with just a webcam. On-device detection is the only reliable defense.
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/#playground"
          className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(36,95,255,0.7)] transition hover:bg-[#3d74ff] active:scale-[0.98]"
        >
          Try it yourself <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/halo"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 active:scale-[0.98]"
        >
          Meet Halo
        </Link>
      </div>

      <p className="mt-10 text-[11px] text-white/20">
        AI-generated deepfake · scam.ai
      </p>
    </main>
  );
}
