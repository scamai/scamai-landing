// Sentry server-side (Node runtime) init — loaded via src/instrumentation.ts.
// No-op when SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN is unset.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? "development",
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  });
}
