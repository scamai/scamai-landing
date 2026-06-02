"use client";

// ─── TrustedBy — partner / investor logo marquee ────────────────────────────
//
// 1:1 port of checkreality.ai's "trusted by" row: ONE scrolling row, every logo,
// the exact `grayscale opacity-50 hover:opacity-100` treatment (NO color inverts).
// Only adaptation for our dark theme: the section is transparent and the edge
// fades use from-black instead of from-white. Logos under /public/trusted/.

type Logo = { src: string; alt: string; w: number; h: number };

const LOGOS: Logo[] = [
  { src: "/trusted/product-hunt-potd.png", alt: "Product Hunt — Product of the Day", w: 120, h: 50 },
  { src: "/trusted/qualcomm.png", alt: "Qualcomm", w: 150, h: 34 },
  { src: "/trusted/lg-uplus.png", alt: "LG U+", w: 110, h: 36 },
  { src: "/trusted/hp.png", alt: "HP", w: 44, h: 44 },
  { src: "/trusted/sbi-holdings.png", alt: "SBI Holdings", w: 130, h: 34 },
  { src: "/trusted/ucberkeley.png", alt: "UC Berkeley", w: 50, h: 50 },
  { src: "/trusted/trulioo.png", alt: "Trulioo", w: 120, h: 34 },
  { src: "/trusted/beta-fellowship.png", alt: "Beta Fellowship", w: 44, h: 44 },
  { src: "/trusted/sentilink.svg", alt: "SentiLink", w: 130, h: 34 },
  { src: "/trusted/honestly.png", alt: "Honestly", w: 130, h: 34 },
  { src: "/trusted/finalround.png", alt: "Final Round AI", w: 140, h: 34 },
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
          className="opacity-50 grayscale transition-opacity hover:opacity-100"
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
