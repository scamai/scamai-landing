// Sentry server-side (Node runtime) init — loaded via src/instrumentation.ts.
// No-op when SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN is unset.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only report from real deployments. A local `next dev` (NODE_ENV=development)
// on the Aries box has the DSN in its env, so without this gate every dev-server
// webpack-cache hiccup (e.g. the curl-probed `__next_require__` "reading 'call'"
// TypeError and `.next/cache/.../0.pack.gz` ENOENT) reports into the PROD
// scam-landing project tagged environment=development — 66 noise events on
// 2026-06-13 alone. `next start` (Vercel prod/preview) keeps NODE_ENV=production.
const enabled = !!dsn && process.env.NODE_ENV === "production";

if (enabled) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? "development",
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  });
}
