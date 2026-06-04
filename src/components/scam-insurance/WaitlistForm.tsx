"use client";

import { useState, useEffect } from "react";
import { trackEvent, trackWaitlistSubmit } from "@/lib/analytics";

type FormState = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      const val = params.get(key);
      if (val) utm[key] = val;
    }
    setUtmParams(utm);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...utmParams,
          referrer: document.referrer || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setState("success");
      trackWaitlistSubmit("scam-insurance");
    } catch {
      setState("error");
      trackEvent({ action: "waitlist_error", category: "conversion", label: "scam-insurance" });
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#245FFF]/15 border border-[#245FFF]/25 mb-4">
          <svg className="w-6 h-6 text-[#245FFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white mb-1">You&apos;re on the list!</p>
        <p className="text-xs text-gray-400">
          We&apos;ll reach out as soon as scam.ai is ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="waitlist-email" className="block text-xs font-medium text-gray-400 mb-1.5">
          Email Address
        </label>
        <input
          id="waitlist-email"
          type="email"
          placeholder="yourname@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#245FFF]/50 focus:ring-1 focus:ring-[#245FFF]/25 transition-all"
        />
      </div>
      {state === "error" && (
        <p className="text-red-400 text-xs">Something went wrong — please try again.</p>
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-full bg-[#245FFF] hover:bg-[#1d4ed8] disabled:opacity-50 px-5 py-3 text-sm font-semibold text-white transition-all shadow-[0_0_24px_rgba(36,95,255,0.35)] flex flex-col items-center gap-0.5"
      >
        {state === "loading" ? (
          "Saving your spot…"
        ) : (
          <>
            <span>Join the Waitlist</span>
            <span className="text-xs font-normal opacity-75">Early bird gets 3 months free</span>
          </>
        )}
      </button>
    </form>
  );
}
