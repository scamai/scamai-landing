import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // PostHog API calls use a trailing-slash-sensitive path through the
  // /ingest proxy below; Next's default trailing-slash redirect breaks them.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // camera=(self): the homepage faceswap playground needs getUserMedia
          // on this origin. Mic/geo stay fully disabled (demo is video-only).
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
          // connect-src additions: api.liveface.app (+wss) for the faceswap WebRTC
          // signaling; dek-issuance...run.app for the Halo waitlist DEK endpoint.
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.vercel-insights.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://cdn.vercel-insights.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://api.liveface.app wss://api.liveface.app https://dek-issuance-40198490972.us-central1.run.app; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; media-src 'self' blob:;" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Same-origin reverse proxy for PostHog (consent-gated, see
      // CookieConsent.tsx). This audience is security-minded — ad-blocker
      // rates are high, and a direct us.i.posthog.com connection would be
      // dropped. Same-origin also means CSP connect-src 'self' covers it.
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  async redirects() {
    return [
      // Redirect root paths to default locale (en)
      {
        source: '/products',
        destination: '/en/products',
        permanent: true,
      },
      {
        source: '/products/ai-detection',
        destination: '/en/products/ai-detection',
        permanent: true,
      },
      {
        source: '/products/vision-detection',
        destination: '/en/products/ai-detection',
        permanent: true,
      },
      {
        source: '/products/audio-detection',
        destination: '/en/products/audio-detection',
        permanent: true,
      },
      {
        source: '/products/scam-database',
        destination: '/en/products/scam-database',
        permanent: true,
      },
      {
        source: '/resources',
        destination: '/en/resources',
        permanent: true,
      },
      {
        source: '/resources/documentation',
        destination: '/en/resources/documentation',
        permanent: true,
      },
      {
        source: '/resources/security-compliance',
        destination: '/en/resources/security-compliance',
        permanent: true,
      },
      {
        source: '/resources/compliance',
        destination: '/en/resources/security-compliance',
        permanent: true,
      },
      {
        source: '/resources/security',
        destination: '/en/resources/security-compliance',
        permanent: true,
      },
      {
        source: '/company',
        destination: '/en/company',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/en/contact',
        permanent: true,
      },
      {
        source: '/demo',
        destination: '/en/demo',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/en/pricing',
        permanent: true,
      },
      {
        source: '/news',
        destination: '/en/news',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/en/about',
        permanent: true,
      },
      {
        source: '/msa',
        destination: '/en/msa',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/en/privacy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/en/terms',
        permanent: true,
      },
      {
        source: '/cookies',
        destination: '/en/cookies',
        permanent: true,
      },
      {
        source: '/platform',
        destination: '/en/products',
        permanent: true,
      },
      {
        source: '/solutions',
        destination: '/en/products',
        permanent: true,
      },
      {
        source: '/security',
        destination: '/en/resources/security-compliance',
        permanent: true,
      },
      // Research redirects to locale-prefixed paths
      {
        source: '/research',
        destination: '/en/research',
        permanent: true,
      },
      {
        source: '/research/datasets/:slug*',
        destination: '/en/research/datasets/:slug*',
        permanent: true,
      },
      {
        source: '/research/papers/:slug*',
        destination: '/en/research/papers/:slug*',
        permanent: true,
      },
      {
        source: '/models/:slug*',
        destination: '/en/products',
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG ?? "reality-inc",
  // Actual Sentry project slug is "scam-landing" (org reality-inc).
  project: process.env.SENTRY_PROJECT ?? "scam-landing",
  // Sourcemap upload only runs when SENTRY_AUTH_TOKEN is present (Vercel
  // env). Local/teammate builds without the token stay quiet and green.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  // Serve the SDK's events through a first-party route so ad-blockers
  // (high among this audience) can't drop error reports.
  tunnelRoute: "/monitoring",
  disableLogger: true,
  // Vercel cron-monitor auto-instrumentation: off (no crons here).
  automaticVercelMonitors: false,
});
