import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

export async function initDb(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS feature_requests (
      id UUID PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(20) NOT NULL,
      priority VARCHAR(20) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY,
      feature_request_id UUID NOT NULL REFERENCES feature_requests(id),
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    )
  `;
}
