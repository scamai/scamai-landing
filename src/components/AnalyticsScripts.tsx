"use client";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";
import { isInternalTraffic } from "@/lib/internal-traffic";

// GTM + Vercel Analytics, gated on the client so the root layout no longer needs
// a server-side cookies() read. That read (for the si_internal flag) forced every
// route into uncacheable dynamic rendering with `Cache-Control: private, no-store`.
// Internal traffic — our own egress IPs (si_internal cookie) and headless
// automation (navigator.webdriver) — loads neither tag, identical to the previous
// server-side gate. Scripts mount one tick after hydration (GTM was already
// `afterInteractive`), so there is no visible or measurable difference for users.
export default function AnalyticsScripts({ vercel }: { vercel: boolean }) {
  const [external, setExternal] = useState(false);

  useEffect(() => {
    setExternal(!isInternalTraffic());
  }, []);

  if (!external) return null;

  return (
    <>
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K2WNMJV8');`}</Script>
      {vercel && <Analytics />}
    </>
  );
}
