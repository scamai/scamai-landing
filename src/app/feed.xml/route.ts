import { getPublishedNewsletters } from '@/lib/db/newsletters';
import { articles } from '@/lib/learn/articles';

export async function GET() {
  const newsletters = await getPublishedNewsletters();
  const baseUrl = 'https://scam.ai';

  const allItems = [
    ...newsletters.map((nl) => ({
      title: nl.title,
      link: `${baseUrl}/en/newsletter/${nl.slug || nl.id}`,
      pubDate: new Date(nl.date),
      description: nl.summary || '',
      category: 'Newsletter',
    })),
    ...articles.map((a) => ({
      title: a.title,
      link: `${baseUrl}/en/learn/${a.slug}`,
      pubDate: new Date(a.publishedAt),
      description: a.description,
      category: a.category,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  const items = allItems
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
      <category>${escapeXml(item.category)}</category>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ScamAI — Deepfake Detection Insights</title>
    <link>${baseUrl}/en/newsletter</link>
    <description>Weekly insights on deepfake technology, AI security, and synthetic media detection from ScamAI.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
