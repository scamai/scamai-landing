"use client";

// ─── TrustedBy — partner / investor logo marquee ────────────────────────────
//
// Same two-row, opposite-direction scroll as checkreality.ai, but on our DARK
// theme (transparent section). The source logos are dark artwork for a white
// page, so here they're rendered as white silhouettes (brightness(0) invert),
// 50% → 100% opacity on hover. Three of checkreality's logos can't silhouette
// cleanly on a transparent bg and are omitted: product-hunt-potd (opaque badge),
// beta-fellowship (opaque JPEG), ucberkeley (detailed seal → unreadable disc).
// Logo files mirrored under /public/trusted/.

type Logo = { src: string; alt: string; w: number; h: number };

const ROW_1: Logo[] = [
  { src: "/trusted/qualcomm.png", alt: "Qualcomm", w: 150, h: 34 },
  { src: "/trusted/lg-uplus.png", alt: "LG U+", w: 110, h: 36 },
  { src: "/trusted/hp.png", alt: "HP", w: 44, h: 44 },
  { src: "/trusted/sbi-holdings.png", alt: "SBI Holdings", w: 130, h: 34 },
  { src: "/trusted/trulioo.png", alt: "Trulioo", w: 120, h: 34 },
];

const ROW_2: Logo[] = [
  { src: "/trusted/sentilink.svg", alt: "SentiLink", w: 130, h: 34 },
  { src: "/trusted/honestly.png", alt: "Honestly", w: 130, h: 34 },
  { src: "/trusted/finalround.png", alt: "Final Round AI", w: 140, h: 34 },
  { src: "/trusted/ditto.svg", alt: "Ditto", w: 90, h: 34 },
  { src: "/trusted/quotr.png", alt: "Quotr", w: 120, h: 34 },
  { src: "/trusted/llama-venture.svg", alt: "Llama Venture", w: 130, h: 34 },
];

// White-silhouette treatment so dark source logos read on the dark theme.
const LOGO_CLASS =
  "opacity-50 transition-opacity hover:opacity-100 [filter:brightness(0)_invert(1)]";

function LogoGroup({ logos }: { logos: Logo[] }) {
  return (
    <div className="flex shrink-0 items-center" style={{ gap: "2.5rem", paddingRight: "2.5rem" }}>
      {logos.map((l, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={`${l.alt}-${i}`} src={l.src} alt={l.alt} width={l.w} height={l.h} className={LOGO_CLASS} />
      ))}
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section className="overflow-hidden border-y border-white/[0.06] bg-transparent py-12 md:py-16">
      <div className="mb-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500" style={{ fontWeight: 450 }}>
          Trusted by customers &amp; backed by people from
        </p>
      </div>

      {/* Row 1 — left */}
      <div className="relative mb-8">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-black to-transparent md:w-24" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-black to-transparent md:w-24" />
        <div className="flex animate-scroll" style={{ willChange: "transform" }}>
          <LogoGroup logos={ROW_1} />
          <LogoGroup logos={ROW_1} />
        </div>
      </div>

      {/* Row 2 — right */}
      <div className="relative">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-black to-transparent md:w-24" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-black to-transparent md:w-24" />
        <div className="flex animate-scroll-reverse" style={{ willChange: "transform" }}>
          <LogoGroup logos={ROW_2} />
          <LogoGroup logos={ROW_2} />
        </div>
      </div>
    </section>
  );
}
