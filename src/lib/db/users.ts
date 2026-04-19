import { getDb } from "./index";

export type UserRow = {
  id: number;
  email: string;
  name: string | null;
  avatar_url: string | null;
  provider: "google" | "apple" | "magic";
  plan: "free" | "paid";
  stripe_customer_id: string | null;
  scans_this_month: number;
  scans_reset_at: string;
  created_at: string;
};

export async function upsertUser(data: {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  provider: "google" | "apple" | "magic";
}): Promise<UserRow> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO users (email, name, avatar_url, provider)
    VALUES (${data.email}, ${data.name ?? null}, ${data.avatarUrl ?? null}, ${data.provider})
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, users.name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url)
    RETURNING *
  `;
  return rows[0] as UserRow;
}

export async function getUserById(id: number): Promise<UserRow | null> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return (rows[0] as UserRow) ?? null;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return (rows[0] as UserRow) ?? null;
}
