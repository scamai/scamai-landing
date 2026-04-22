import { getDb } from "./index";

export type ScanRow = {
  id: number;
  slug: string;
  image_hash: string;
  image_url: string | null;
  source_url: string | null;
  verdict: "likely_ai_manipulated" | "likely_real" | "uncertain";
  confidence: number;
  signals: Record<string, unknown>;
  heatmap_url: string | null;
  is_public: boolean;
  nsfw_flag: boolean;
  min_quality_passed: boolean;
  user_id: number | null;
  anon_fingerprint: string | null;
  ttfr_ms: number | null;
  model_version: string;
  created_at: string;
};

export async function insertScan(data: {
  slug: string;
  imageHash: string;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  verdict: ScanRow["verdict"];
  confidence: number;
  signals: Record<string, unknown>;
  heatmapUrl?: string | null;
  userId?: number | null;
  anonFingerprint?: string | null;
  ttfrMs?: number | null;
  modelVersion?: string;
  isPublic?: boolean;
  nsfwFlag?: boolean;
  minQualityPassed?: boolean;
}): Promise<ScanRow> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO scans (
      slug, image_hash, image_url, source_url, verdict, confidence, signals,
      heatmap_url, user_id, anon_fingerprint, ttfr_ms, model_version,
      is_public, nsfw_flag, min_quality_passed
    ) VALUES (
      ${data.slug}, ${data.imageHash}, ${data.imageUrl ?? null}, ${data.sourceUrl ?? null},
      ${data.verdict}, ${data.confidence}, ${JSON.stringify(data.signals)}::jsonb,
      ${data.heatmapUrl ?? null}, ${data.userId ?? null}, ${data.anonFingerprint ?? null},
      ${data.ttfrMs ?? null}, ${data.modelVersion ?? "eva-v1.6"},
      ${data.isPublic ?? true}, ${data.nsfwFlag ?? false}, ${data.minQualityPassed ?? true}
    )
    RETURNING *
  `;
  return rows[0] as ScanRow;
}

export async function getScanBySlug(slug: string): Promise<ScanRow | null> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM scans WHERE slug = ${slug} LIMIT 1`;
  return (rows[0] as ScanRow) ?? null;
}

export async function setScanPublic(slug: string, isPublic: boolean, userId: number): Promise<ScanRow | null> {
  const sql = getDb();
  const rows = await sql`
    UPDATE scans SET is_public = ${isPublic}
    WHERE slug = ${slug} AND user_id = ${userId}
    RETURNING *
  `;
  return (rows[0] as ScanRow) ?? null;
}

export async function recordScanEvent(scanId: number, type: "view" | "share" | "unshare" | "embed", referrer: string | null) {
  const sql = getDb();
  await sql`
    INSERT INTO scan_events (scan_id, type, referrer) VALUES (${scanId}, ${type}, ${referrer})
  `;
}

export async function listRecentPublicScans(limit = 24): Promise<ScanRow[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM scans
    WHERE is_public = TRUE
      AND min_quality_passed = TRUE
      AND nsfw_flag = FALSE
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows as ScanRow[];
}

export async function countScansByUserThisMonth(userId: number): Promise<number> {
  const sql = getDb();
  const rows = await sql`
    SELECT COUNT(*)::int AS n FROM scans
    WHERE user_id = ${userId}
      AND created_at >= date_trunc('month', NOW())
  `;
  return Number((rows[0] as { n: number })?.n ?? 0);
}

export async function getScanByHash(imageHash: string): Promise<ScanRow | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM scans
    WHERE image_hash = ${imageHash}
      AND is_public = TRUE
      AND min_quality_passed = TRUE
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return (rows[0] as ScanRow) ?? null;
}

export async function getScanViewCount(scanId: number): Promise<number> {
  const sql = getDb();
  const rows = await sql`
    SELECT COUNT(*)::int AS n FROM scan_events
    WHERE scan_id = ${scanId}
  `;
  return Number((rows[0] as { n: number })?.n ?? 0);
}
