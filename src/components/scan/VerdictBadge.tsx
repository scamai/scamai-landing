type Props = { verdict: string; confidence: number };

const palette: Record<string, { fg: string; dot: string; border: string; label: string }> = {
  likely_ai_manipulated: {
    fg: "text-red-300",
    dot: "bg-red-400",
    border: "border-red-500/40",
    label: "AI-MANIPULATED",
  },
  likely_real: {
    fg: "text-emerald-300",
    dot: "bg-emerald-400",
    border: "border-emerald-500/40",
    label: "LIKELY REAL",
  },
  uncertain: {
    fg: "text-amber-300",
    dot: "bg-amber-400",
    border: "border-amber-500/40",
    label: "UNCERTAIN",
  },
};

export function VerdictBadge({ verdict, confidence }: Props) {
  const p = palette[verdict] ?? palette.uncertain;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wider ${p.border} ${p.fg}`}
    >
      <span className={`h-2 w-2 rounded-full ${p.dot}`} aria-hidden />
      <span>{p.label}</span>
      <span className="text-white/60">· {confidence.toFixed(0)}%</span>
    </div>
  );
}
