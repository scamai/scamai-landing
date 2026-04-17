type Signal = { type: string; score: number };

const niceName: Record<string, string> = {
  face_swap: "Face swap",
  fully_synthetic: "Fully synthetic",
  edited_region: "Edited region",
  metadata_tampered: "Metadata tampered",
  gan_artifacts: "GAN artifacts",
  diffusion_artifacts: "Diffusion artifacts",
};

export function SignalList({ signals }: { signals: Signal[] }) {
  if (!signals.length) {
    return <p className="text-sm text-gray-500">No significant signals detected.</p>;
  }
  const sorted = [...signals].sort((a, b) => b.score - a.score);
  return (
    <ul className="space-y-2.5">
      {sorted.map((s) => (
        <li key={s.type}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">{niceName[s.type] ?? s.type}</span>
            <span className="font-mono text-xs text-gray-400">{s.score.toFixed(0)}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#245FFF] to-[#6d8bff]"
              style={{ width: `${Math.min(100, Math.max(0, s.score))}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
