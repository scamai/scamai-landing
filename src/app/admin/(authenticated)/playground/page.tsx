"use client";

import { useEffect, useState, useCallback } from "react";

type Session = {
  id: number;
  session_id: string;
  type: "face" | "recording";
  blob_url: string;
  mime_type: string;
  created_at: string;
};

export default function PlaygroundDataPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "face" | "recording">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/playground");
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: number) => {
    await fetch("/api/admin/playground", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const visible = sessions.filter((s) => filter === "all" || s.type === filter);
  const faces = sessions.filter((s) => s.type === "face").length;
  const recordings = sessions.filter((s) => s.type === "recording").length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Playground captures</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {faces} face uploads · {recordings} session recordings
            </p>
          </div>
          <button
            onClick={load}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2">
          {(["all", "face", "recording"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "border hover:bg-accent"
              }`}
            >
              {f === "all" ? `All (${sessions.length})` : f === "face" ? `Faces (${faces})` : `Recordings (${recordings})`}
            </button>
          ))}
        </div>

        {loading && (
          <div className="py-20 text-center text-muted-foreground">Loading…</div>
        )}

        {!loading && visible.length === 0 && (
          <div className="rounded-xl border border-dashed py-20 text-center text-muted-foreground">
            No {filter === "all" ? "captures" : filter + "s"} yet.
            <p className="mt-2 text-xs">Make sure BLOB_READ_WRITE_TOKEN is set in Vercel env vars.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visible.map((s) => (
            <div key={s.id} className="group relative overflow-hidden rounded-xl border bg-card">
              {s.type === "face" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.blob_url}
                  alt="Uploaded face"
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <video
                  src={s.blob_url}
                  controls
                  className="aspect-video w-full bg-black"
                  preload="metadata"
                />
              )}
              <div className="p-2">
                <p className="truncate text-[10px] font-medium capitalize text-muted-foreground">
                  {s.type}
                </p>
                <p className="truncate text-[9px] text-muted-foreground/60">
                  {new Date(s.created_at).toLocaleString()}
                </p>
                <p className="mt-0.5 truncate font-mono text-[8px] text-muted-foreground/40">
                  {s.session_id.slice(0, 12)}
                </p>
              </div>
              {/* Actions */}
              <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <a
                  href={s.blob_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-6 w-6 items-center justify-center rounded bg-black/70 text-white hover:bg-black"
                  title="Open full size"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={() => remove(s.id)}
                  className="flex h-6 w-6 items-center justify-center rounded bg-red-500/80 text-white hover:bg-red-600"
                  title="Delete record"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
