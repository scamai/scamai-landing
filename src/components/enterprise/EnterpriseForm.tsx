"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function EnterpriseForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/enterprise-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(body.error ?? "Submission failed");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5 text-sm text-emerald-200">
        Thanks — we&rsquo;ll reply within one business day.
      </div>
    );
  }

  const field = "w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#245FFF] focus:bg-white/[0.05]";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Name</span>
          <input name="name" required className={field} placeholder="Jane Doe" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Work email</span>
          <input type="email" name="email" required className={field} placeholder="jane@company.com" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Company</span>
          <input name="company" required className={field} placeholder="Company Inc." />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Use case</span>
          <select name="useCase" required className={field}>
            <option value="">Select one…</option>
            <option value="social">Social / UGC platform</option>
            <option value="dating">Dating / social app</option>
            <option value="kyc">KYC / identity</option>
            <option value="newsroom">Newsroom / fact-check</option>
            <option value="insurance">Insurance / legal</option>
            <option value="ads">Ad / creative platform</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Monthly volume (images)</span>
        <select name="volume" className={field}>
          <option value="">Select one…</option>
          <option value="lt_10k">&lt; 10,000</option>
          <option value="10k_100k">10,000 – 100,000</option>
          <option value="100k_1m">100,000 – 1M</option>
          <option value="1m_plus">1M+</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Tell us more</span>
        <textarea name="message" rows={4} className={field} placeholder="What are you trying to solve? Any integration details?" />
      </label>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-300">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Talk to our team"}
      </button>
    </form>
  );
}
