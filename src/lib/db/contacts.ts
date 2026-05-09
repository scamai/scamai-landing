import { getDb } from './index';

export async function upsertSubscriber(
  email: string,
  source: string,
  referrer: string | undefined,
  ip: string
) {
  const sql = getDb();
  await sql`
    INSERT INTO subscribers (email, source, referrer, ip)
    VALUES (${email}, ${source}, ${referrer ?? null}, ${ip})
    ON CONFLICT (email) DO UPDATE SET
      source = EXCLUDED.source,
      referrer = COALESCE(EXCLUDED.referrer, subscribers.referrer),
      ip = EXCLUDED.ip,
      subscribed_at = NOW(),
      active = TRUE
  `;
}

export async function logDatasetAccess(
  email: string,
  datasetId: string,
  datasetName: string,
  ip: string
) {
  const sql = getDb();
  await sql`
    INSERT INTO dataset_access_log (email, dataset_id, dataset_name, ip)
    VALUES (${email}, ${datasetId}, ${datasetName}, ${ip})
  `;
}
