"use client";

// Scroll-depth sentinel: fires trackSectionView(name) ONCE when this point
// first enters the viewport. Drop one as the first child of any section
// (zero-size — no layout impact). Answers "how far do visitors actually
// scroll" on the landing and Halo pages, which raw CTA clicks can't.

import { useEffect, useRef } from "react";
import { trackSectionView } from "@/lib/analytics";

export default function SectionViewTracker({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!fired && entries.some((e) => e.isIntersecting)) {
          fired = true;
          trackSectionView(name);
          io.disconnect();
        }
      },
      // Zero-area sentinel: any intersection means the point is on screen.
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [name]);

  return <div ref={ref} aria-hidden className="h-0 w-full" />;
}
