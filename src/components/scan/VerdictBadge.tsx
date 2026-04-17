type Props = { verdict: string; confidence: number };

const palette: Record<string, { bg: string; fg: string; dot: string; label: string }> = {
  likely_ai_manipulated: {
    bg: "bg-red-500/10",
    fg: "text-red-300",
    dot: "bg-red-400",
    label: "AI-MANIPULATED",
  },
  likely_real: {
    bg: "bg-emerald-500/10",
    fg: "text-emerald-300",
    dot: "bg-emerald-400",
    label: "LIKELY REAL",
  },
  uncertain: {
    bg: "bg-amber-500/10",
    fg: "text-amber-300",
    dot: "bg-amber-400",
    label: "UNCERTAIN",
  },
};

export function VerdictBadge({ verdict, confidence }: Props) {
  const p = palette[verdict] ?? palette.uncertain;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold tracking-wider ${p.bg} ${p.fg}`}
    >
      <span className={`h-2 w-2 rounded-full ${p.dot}`} aria-hidden />
      <span>{p.label}</span>
      <span className="text-white/60">· {confidence.toFixed(0)}%</span>
    </div>
  );
}
