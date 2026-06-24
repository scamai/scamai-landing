import CookieConsent from "@/components/CookieConsent";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import { inter } from "@/lib/fonts";

const IS_VERCEL = process.env.VERCEL === "1";

// The share route renders real content (unlike the redirect shells), so it owns
// its own <html>/<body> now that the root layout is a static passthrough. Keeps
// analytics + cookie consent parity with what the old root layout provided.
export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-[#0b0b0b]">
      <body className={`${inter.variable} antialiased bg-[#0b0b0b]`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K2WNMJV8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <AnalyticsScripts vercel={IS_VERCEL} />
        <CookieConsent />
      </body>
    </html>
  );
}
