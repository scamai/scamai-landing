import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getPublishedNewsletters } from "@/lib/db/newsletters";
import { listRecentPublicScans } from "@/lib/db/scans";
import { IS_AI_ENTRIES } from "@/lib/seo/pages/is-ai";
import { HOW_TO_ENTRIES } from "@/lib/seo/pages/how-to";
import { COMPARE_ENTRIES } from "@/lib/seo/pages/compare";

const baseUrl = "https://scam.ai";

// Static routes — one URL, one priority, one changeFrequency.
const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  change: "daily" | "weekly" | "monthly";
}> = [
  { path: "", priority: 1.0, change: "daily" },
  { path: "/pricing", priority: 0.9, change: "weekly" },
  { path: "/enterprise", priority: 0.9, change: "weekly" },
  { path: "/trending", priority: 0.8, change: "daily" },
  { path: "/embed", priority: 0.7, change: "monthly" },
  { path: "/research", priority: 0.8, change: "weekly" },
  { path: "/is-ai", priority: 0.8, change: "weekly" },
  { path: "/how-to", priority: 0.8, change: "weekly" },
  { path: "/compare", priority: 0.8, change: "weekly" },
  { path: "/blog", priority: 0.7, change: "weekly" },
  { path: "/newsletter", priority: 0.6, change: "weekly" },
  { path: "/about", priority: 0.6, change: "monthly" },
  { path: "/company", priority: 0.5, change: "monthly" },
  { path: "/contact", priority: 0.5, change: "monthly" },
  { path: "/privacy", priority: 0.3, change: "monthly" },
  { path: "/terms", priority: 0.3, change: "monthly" },
  { path: "/cookies", priority: 0.3, change: "monthly" },
  { path: "/msa", priority: 0.3, change: "monthly" },
];

function altsFor(path: string) {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${baseUrl}/${l}${path}`]),
  );
  return { languages: { ...languages, "x-default": `${baseUrl}/en${path}` } };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static routes — multiplied by locale
  for (const { path, priority, change } of STATIC_ROUTES) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: change,
        priority,
        alternates: altsFor(path),
      });
    }
  }

  // Programmatic: /is-ai/[slug]
  for (const e of IS_AI_ENTRIES) {
    for (const locale of locales) {
      const path = `/is-ai/${e.slug}`;
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(e.published),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: altsFor(path),
      });
    }
  }

  // Programmatic: /how-to/[slug]
  for (const e of HOW_TO_ENTRIES) {
    for (const locale of locales) {
      const path = `/how-to/${e.slug}`;
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(e.published),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: altsFor(path),
      });
    }
  }

  // Programmatic: /compare/[slug]
  for (const e of COMPARE_ENTRIES) {
    for (const locale of locales) {
      const path = `/compare/${e.slug}`;
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(e.published),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: altsFor(path),
      });
    }
  }

  // Dynamic: newsletter / blog
  try {
    const newsletters = await getPublishedNewsletters();
    for (const n of newsletters) {
      const slug = n.slug || String(n.id);
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${slug}`,
          lastModified: new Date(n.date),
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: altsFor(`/blog/${slug}`),
        });
        // Keep legacy /newsletter/[slug] until 301s are added
        entries.push({
          url: `${baseUrl}/${locale}/newsletter/${slug}`,
          lastModified: new Date(n.date),
          changeFrequency: "monthly",
          priority: 0.5,
          alternates: altsFor(`/newsletter/${slug}`),
        });
      }
    }
  } catch {
    // DB unavailable — skip dynamic entries during offline builds
  }

  // Dynamic: /scan/[slug] — the programmatic SEO flywheel
  try {
    const scans = await listRecentPublicScans(10000);
    for (const s of scans) {
      if (!s.min_quality_passed || s.nsfw_flag) continue;
      const path = `/scan/${s.slug}`;
      // Scan pages only make sense in the user's current locale — we emit for 'en'
      // and rely on canonical + hreflang in the page metadata, not a per-locale row.
      entries.push({
        url: `${baseUrl}/en${path}`,
        lastModified: new Date(s.created_at),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    // DB unavailable — skip
  }

  return entries;
}
