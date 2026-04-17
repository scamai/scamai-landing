"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const SITE_URL = "https://www.scam.ai";

export default function EmbedPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const [variant, setVariant] = useState<"verified" | "manipulated" | "uncertain">("verified");
  const [copied, setCopied] = useState<string | null>(null);

  const iframeSrc = `${SITE_URL}/embed/badge?state=${variant}`;
  const iframeSnippet = `<iframe src="${iframeSrc}" width="220" height="72" style="border:0;border-radius:12px" title="Verified by ScamAI"></iframe>`;
  const scriptSnippet = `<!-- ScamAI verification badge -->
<a href="${SITE_URL}/${locale}" target="_blank" rel="noopener" style="display:inline-flex;gap:8px;align-items:center;padding:8px 14px;border-radius:12px;background:#0b0b0b;color:#fff;font:600 13px system-ui,-apple-system,sans-serif;text-decoration:none;border:1px solid #245FFF">
  <span style="width:8px;height:8px;border-radius:4px;background:${variant === "manipulated" ? "#ef4444" : variant === "uncertain" ? "#f59e0b" : "#22c55e"}"></span>
  ${variant === "manipulated" ? "Likely AI-manipulated" : variant === "uncertain" ? "Verification uncertain" : "Verified by ScamAI"}
</a>`;

  const copy = (text: string, kind: string) => {
    navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#245FFF]">
          Embed · Free
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Show readers an image was verified.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-gray-300 sm:text-base">
          Copy a snippet. Drop it in your article, newsletter, or site. The badge links back to ScamAI
          and tells readers the image passed (or didn&rsquo;t pass) Eva V1.6 detection.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        <div className="mb-6 flex gap-2">
          {(["verified", "manipulated", "uncertain"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                variant === v ? "border-white bg-white text-black" : "border-white/15 text-white hover:bg-white/10"
              }`}
            >
              {v === "verified" ? "Verified real" : v === "manipulated" ? "AI-manipulated" : "Uncertain"}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Preview</p>
          <div className="mt-4 flex items-center justify-center rounded-xl p-8">
            <div
              style={{
                display: "inline-flex",
                gap: 8,
                alignItems: "center",
                padding: "8px 14px",
                borderRadius: 12,
                background: "#0b0b0b",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                border: "1px solid #245FFF",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    variant === "manipulated" ? "#ef4444" : variant === "uncertain" ? "#f59e0b" : "#22c55e",
                }}
              />
              {variant === "manipulated"
                ? "Likely AI-manipulated"
                : variant === "uncertain"
                  ? "Verification uncertain"
                  : "Verified by ScamAI"}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">HTML snippet</p>
              <button
                type="button"
                onClick={() => copy(scriptSnippet, "html")}
                className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/10"
              >
                {copied === "html" ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 p-4 text-xs leading-relaxed">
              {scriptSnippet}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">iframe snippet</p>
              <button
                type="button"
                onClick={() => copy(iframeSnippet, "iframe")}
                className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/10"
              >
                {copied === "iframe" ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 p-4 text-xs leading-relaxed">
              {iframeSnippet}
            </pre>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Free forever. Every embed counts as a backlink to your verification — we don&rsquo;t rate-limit
          badge traffic.
        </p>
      </section>
    </main>
  );
}
