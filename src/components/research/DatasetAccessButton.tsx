"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DatasetAccessModal } from "./DatasetAccessModal";
import type { ResearchDataset } from "@/lib/research/data";

type Variant = "card" | "primary" | "inline";

export function DatasetAccessButton({
  dataset,
  variant = "card",
  label = "Get Access",
}: {
  dataset: ResearchDataset;
  variant?: Variant;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  const classNames: Record<Variant, string> = {
    primary: "inline-flex items-center justify-center gap-2 rounded-full bg-[#245FFF] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1d4acc]",
    card: "mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-gray-800/60 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:border-[#245FFF]/30 hover:bg-[#245FFF]/5 hover:text-[#245FFF]",
    inline: "flex-shrink-0 flex items-center gap-2 rounded-lg border border-gray-800/60 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white transition-all hover:border-[#245FFF]/30 hover:bg-[#245FFF]/5 hover:text-[#245FFF]",
  };
  const className = classNames[variant];

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {label}
      </button>
      <AnimatePresence>
        {open && <DatasetAccessModal dataset={dataset} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
