"use client";

// ─── TrustedBy — partner / investor logo marquee ────────────────────────────
//
// One scrolling row mirroring checkreality.ai's "trusted by" structure, on our
// dark theme. The source logos are dark ink for a white page, so for contrast
// they're rendered as uniform white silhouettes (brightness(0) invert), 70% →
// 100% on hover — the standard dark logo-wall treatment. Section is transparent;
// edge fades use from-black. UC Berkeley (detailed seal → white disc) omitted.
// Opaque-bg logos had their white keyed out. Logos under /public/trusted/.

type Logo = { src: string; alt: string; w: number; h: number };

// Curated to logos that read cleanly as white silhouettes. Dropped LG U+, HP,
// Final Round, UC Berkeley: their marks are filled circles/shapes/seals that any
// CSS dark-mode treatment turns into solid white blobs — they need official
// white-logo files to be added back. Qualcomm uses a proper white vector.
const LOGOS: Logo[] = [
  { src: "/trusted/product-hunt-potd.png", alt: "Product Hunt — Product of the Day", w: 120, h: 50 },
  { src: "/qualcomm-logo.svg", alt: "Qualcomm", w: 150, h: 30 },
  { src: "/trusted/sbi-holdings.png", alt: "SBI Holdings", w: 130, h: 34 },
  { src: "/trusted/trulioo.png", alt: "Trulioo", w: 120, h: 34 },
  { src: "/trusted/sentilink.svg", alt: "SentiLink", w: 130, h: 34 },
  { src: "/trusted/honestly.png", alt: "Honestly", w: 130, h: 34 },
  { src: "/trusted/ditto.svg", alt: "Ditto", w: 90, h: 34 },
  { src: "/trusted/quotr.png", alt: "Quotr", w: 120, h: 34 },
  { src: "/trusted/llama-venture.svg", alt: "Llama Venture", w: 130, h: 34 },
];

function LogoGroup() {
  return (
    <div className="flex shrink-0 items-center" style={{ gap: "2.5rem", paddingRight: "2.5rem" }}>
      {LOGOS.map((l, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${l.alt}-${i}`}
          src={l.src}
          alt={l.alt}
          width={l.w}
          height={l.h}
          // Uniform white treatment for guaranteed contrast on the dark theme
          // (the dark-ink source logos are invisible under grayscale alone).
          className="opacity-70 transition-opacity hover:opacity-100 [filter:brightness(0)_invert(1)]"
        />
      ))}
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section className="overflow-hidden border-y border-white/10 py-12 md:py-16">
      <div className="mb-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#999]" style={{ fontWeight: 450 }}>
          Trusted by customers &amp; backed by people from
        </p>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-black to-transparent md:w-24" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-black to-transparent md:w-24" />
        <div className="flex animate-scroll" style={{ willChange: "transform" }}>
          <LogoGroup />
          <LogoGroup />
        </div>
      </div>
    </section>
  );
}
