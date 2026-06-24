import { Inter } from "next/font/google";

// Shared Inter instance. Previously defined in the single root layout; now that
// each top-level branch ([locale], admin, share) owns its own <html>/<body> (so
// the root layout can stay static and CDN-cacheable), they import this rather
// than each re-declaring the font loader.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
