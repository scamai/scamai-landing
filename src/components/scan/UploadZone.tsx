"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, DragEvent } from "react";

type ScanResponse = {
  slug: string;
  verdict: string;
  confidence: number;
  ttfrMs: number;
  reachedAnonLimit: boolean;
  anonScansUsed: number;
  anonScansLimit: number;
  shareUrl: string;
};

type Phase = "idle" | "uploading" | "analyzing" | "error";

export function UploadZone({ locale }: { locale: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = useCallback(
    async (file: File) => {
      const t0 = performance.now();
      setError(null);
      setPhase("uploading");
      try {
        const fd = new FormData();
        fd.append("file", file);
        setPhase("analyzing");
        const res = await fetch("/api/scan", { method: "POST", body: fd });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Scan failed" }));
          throw new Error(body.error ?? "Scan failed");
        }
        const data = (await res.json()) as ScanResponse;
        const clientTtfr = Math.round(performance.now() - t0);
        (window as unknown as { va?: (e: string, o?: Record<string, unknown>) => void }).va?.(
          "event",
          { name: "ttfr_measured", ttfrMs: clientTtfr, serverMs: data.ttfrMs },
        );
        (window as unknown as { va?: (e: string, o?: Record<string, unknown>) => void }).va?.(
          "event",
          { name: "scan_completed", verdict: data.verdict },
        );
        if (data.reachedAnonLimit) {
          (window as unknown as { va?: (e: string, o?: Record<string, unknown>) => void }).va?.(
            "event",
            { name: "scan_wall_hit", scansUsed: data.anonScansUsed },
          );
        }
        router.push(`/${locale}/scan/${data.slug}`);
      } catch (err) {
        setPhase("error");
        setError(err instanceof Error ? err.message : "Scan failed");
      }
    },
    [locale, router],
  );

  // Cmd+V paste anywhere on the page
  useEffect(() => {
    const onPaste = (e: globalThis.ClipboardEvent) => {
      if (phase !== "idle") return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            setMessage("Pasted image — scanning…");
            submit(file);
          }
          return;
        }
      }
    };
    window.addEventListener("paste", onPaste as unknown as EventListener);
    return () => window.removeEventListener("paste", onPaste as unknown as EventListener);
  }, [phase, submit]);

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) submit(file);
  };

  const busy = phase === "uploading" || phase === "analyzing";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload an image to verify"
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!busy && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-14 ${
          isDragging ? "border-[#245FFF]" : "border-white/20 hover:border-white/40"
        } ${busy ? "cursor-wait" : "cursor-pointer"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) submit(file);
            e.currentTarget.value = "";
          }}
        />
        {!busy ? (
          <>
            <svg className="mb-3 h-8 w-8 text-white/50 sm:h-10 sm:w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-base font-semibold text-white sm:text-xl">
              Drop, paste, or tap to upload
            </p>
            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              JPG, PNG, WebP, HEIC · 4MB · ~2s
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#245FFF] border-t-transparent" />
            <p className="text-sm font-semibold text-white">
              {phase === "uploading" ? "Uploading…" : "Analyzing…"}
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-white/30">
        Your result gets a shareable link so others can verify too. Sign in to control visibility.
      </p>

      {message && !busy && <p className="mt-3 text-center text-xs text-gray-400">{message}</p>}
      {error && (
        <p className="mt-3 rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
