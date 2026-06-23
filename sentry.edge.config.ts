// Sentry edge-runtime init (middleware — next-intl locale routing runs
// there). Loaded via src/instrumentation.ts. No-op when DSN is unset.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

// See sentry.server.config.ts: gate on NODE_ENV so a local `next dev` on Aries
// (DSN present) doesn't report dev-server noise into the prod scam-landing project.
const enabled = !!dsn && process.env.NODE_ENV === "production";

if (enabled) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? "development",
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  });
}
