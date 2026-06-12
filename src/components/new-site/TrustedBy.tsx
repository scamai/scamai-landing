"use client";

// ─── TrustedBy — partner / investor logo marquee ────────────────────────────
//
// One scrolling row mirroring checkreality.ai's "trusted by" set, on our dark
// theme. Treatment is `grayscale invert` (NOT brightness-0 invert): it preserves
// each mark's internal structure AND, crucially, maps a white logo background to
// black — which disappears on our black page — while turning the dark ink light.
// So every logo (wordmark, filled-shape, seal, even opaque-white-bg ones) reads
// cleanly as light-on-dark without per-asset keying. Logos under /public/trusted/.

import { useTranslations } from "next-intl";

type Logo = { src: string; id: string; w: number; h: number; cls?: string };

// id keys the translated alt text in the `landing.trustedBy.logos` namespace.
// cls overrides the default h-8 for logos whose PNG has excessive internal padding.
const LOGOS: Logo[] = [
  { src: "/trusted/product-hunt-potd.png", id: "productHunt",    w: 120, h: 50 },
  { src: "/trusted/qualcomm.png",          id: "qualcomm",       w: 150, h: 34 },
  { src: "/trusted/lg-uplus.png",          id: "lgUplus",        w: 110, h: 36 },
  { src: "/trusted/hp.png",                id: "hp",             w: 44,  h: 44 },
  { src: "/trusted/sbi-holdings.png",      id: "sbiHoldings",    w: 130, h: 34 },
  { src: "/trusted/ucberkeley.png",        id: "ucBerkeley",     w: 48,  h: 48, cls: "h-14 w-auto" },
  { src: "/trusted/trulioo.png",           id: "trulioo",        w: 120, h: 34, cls: "h-14 w-auto" },
  { src: "/trusted/beta-fellowship.png",   id: "betaFellowship", w: 44,  h: 44, cls: "h-14 w-auto" },
  { src: "/trusted/honestly.png",          id: "honestly",       w: 130, h: 34 },
  { src: "/trusted/finalround.png",        id: "finalRound",     w: 140, h: 34 },
  { src: "/trusted/ditto.svg",             id: "ditto",          w: 90,  h: 34 },
  { src: "/trusted/quotr.png",             id: "quotr",          w: 120, h: 34 },
  { src: "/trusted/llama-venture.svg",     id: "llamaVenture",   w: 130, h: 34 },
];

const BASE_CLASS = "w-auto opacity-55 transition-opacity hover:opacity-100 [filter:grayscale(1)_invert(1)]";
const LOGO_CLASS = `h-8 ${BASE_CLASS}`;

function LogoGroup({ ariaHidden = false }: { ariaHidden?: boolean }) {
  const t = useTranslations("landing.trustedBy");
  return (
    <div className="flex shrink-0 items-center" style={{ gap: "2.75rem", paddingRight: "2.75rem" }} aria-hidden={ariaHidden}>
      {LOGOS.map((l, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={`${l.id}-${i}`} src={l.src} alt={t(`logos.${l.id}`)} width={l.w} height={l.h} className={l.cls ? `${l.cls} ${BASE_CLASS}` : LOGO_CLASS} />
      ))}
    </div>
  );
}

export default function TrustedBy() {
  const t = useTranslations("landing.trustedBy");
  return (
    <section className="overflow-hidden border-y border-white/10 py-5 md:py-7">
      <div className="mb-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#999]" style={{ fontWeight: 450 }}>
          {t("heading")}
        </p>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-black to-transparent md:w-24" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-black to-transparent md:w-24" />
        <div className="flex animate-scroll" style={{ willChange: "transform" }}>
          <LogoGroup />
          <LogoGroup ariaHidden />
        </div>
      </div>
    </section>
  );
}
