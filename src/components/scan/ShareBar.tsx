"use client";

import { useState } from "react";

type Props = { slug: string; verdictLabel: string; confidence: number };

export function ShareBar({ slug, verdictLabel, confidence }: Props) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/scan/${slug}`
    : `https://www.scam.ai/scan/${slug}`;
  const text = `${verdictLabel} (${confidence.toFixed(0)}% confidence) — verified by ScamAI`;

  const share = (platform: "twitter" | "whatsapp" | "facebook" | "linkedin" | "copy") => {
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      fetch(`/api/scan/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "share" }),
      }).catch(() => {});
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=500");
    fetch(`/api/scan/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "share" }),
    }).catch(() => {});
  };

  const Button = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5 active:scale-[0.97]"
    >
      {label}
    </button>
  );

  return (
    <div className="sticky bottom-0 z-20 -mx-5 bg-gradient-to-t from-black via-black/95 to-transparent px-5 py-4 sm:static sm:mx-0 sm:bg-transparent sm:p-0">
      <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs uppercase tracking-wider text-gray-500">Share</span>
      <Button
        label="Share..."
        onClick={() => {
          if ("share" in navigator) {
            navigator.share({ title: text, url }).catch(() => {});
          } else {
            navigator.clipboard.writeText(`${text} ${url}`);
          }
        }}
      />
      <Button label="Copy link" onClick={() => share("copy")} />
      {copied && <span className="text-xs text-emerald-400">Copied.</span>}
      <Button label="X / Twitter" onClick={() => share("twitter")} />
      <Button label="WhatsApp" onClick={() => share("whatsapp")} />
      <Button label="Facebook" onClick={() => share("facebook")} />
      <Button label="LinkedIn" onClick={() => share("linkedin")} />
      </div>
    </div>
  );
}
