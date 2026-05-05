"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import type { ResearchDataset } from "@/lib/research/data";

const DATASET_ACCESS_KEY = "scamai_dataset_access";

function getStoredEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(DATASET_ACCESS_KEY);
    return raw ? JSON.parse(raw).email ?? "" : "";
  } catch {
    return "";
  }
}

function storeEmail(email: string) {
  localStorage.setItem(DATASET_ACCESS_KEY, JSON.stringify({ email, ts: Date.now() }));
}

export function DatasetAccessModal({
  dataset,
  onClose,
}: {
  dataset: ResearchDataset;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const stored = getStoredEmail();
    if (stored) setEmail(stored);
  }, []);

  const handleSubmit = useCallback(async () => {
    setError("");
    if (!agreed) {
      setError("Please agree to the data usage terms.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/dataset-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, datasetId: dataset.id, agreed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      storeEmail(email);
      trackEvent({
        action: "dataset_access",
        category: "research",
        label: `${dataset.name} | ${email}`,
      });
      setAccessToken(data.token);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [agreed, email, dataset]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-gray-800/60 bg-[#0e0e11] p-6 sm:p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>

        {accessToken ? (
          <div className="py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
              <p className="text-sm text-gray-400 mb-1">We&apos;ve sent the download link to</p>
              <p className="text-sm text-white font-medium mb-4">{email}</p>
              <p className="text-xs text-gray-500">Don&apos;t see it? Check your spam folder.</p>
            </div>

            <div className="mt-6 rounded-lg border border-gray-800/60 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">How to Cite</p>
              <pre className="text-[11px] text-gray-400 font-mono leading-relaxed whitespace-pre-wrap break-words overflow-x-auto max-h-40 overflow-y-auto scrollbar-thin">
                {dataset.citation}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(dataset.citation)}
                className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-[#245FFF] transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy citation
              </button>
            </div>

            {dataset.paper && (
              <a
                href={dataset.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-gray-800/60 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-gray-300 hover:border-[#245FFF]/30 hover:text-[#245FFF] transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Research Paper
              </a>
            )}

            <button
              onClick={onClose}
              className="mt-4 w-full rounded-lg bg-white/[0.06] px-5 py-2 text-sm font-medium text-gray-300 hover:bg-white/[0.1] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-[#245FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                <h3 className="text-lg font-semibold text-white">Access Dataset</h3>
              </div>
              <p className="text-sm text-gray-400">
                <span className="text-gray-300 font-medium">{dataset.name}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Enter your email and agree to our terms to access the dataset.
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="dataset-email" className="block text-xs font-medium text-gray-400 mb-1.5">
                Email address
              </label>
              <input
                id="dataset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="you@university.edu"
                className="w-full rounded-lg border border-gray-800/60 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#245FFF]/50 focus:bg-white/[0.05]"
              />
            </div>

            <label className="flex items-start gap-3 mb-5 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-white/[0.03] text-[#245FFF] accent-[#245FFF] cursor-pointer"
              />
              <span className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                I agree to use this dataset solely for non-commercial research purposes. I will cite the
                associated publication in any resulting work and will not redistribute the data.
              </span>
            </label>

            {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#245FFF] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1d4acc] disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Continue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
