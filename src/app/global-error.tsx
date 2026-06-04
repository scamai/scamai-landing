"use client";

// Root-level React render-error boundary. Without this file, App Router
// rendering crashes never reach Sentry (build logs warn about it). Must
// render its own <html>/<body> — it replaces the root layout when it fires.

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: "#a1a1aa", marginBottom: 20 }}>
            The error has been reported — please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "10px 22px",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "#245FFF",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
