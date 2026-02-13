import { NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export async function GET() {
  const url = process.env.DATABASE_URL ?? 'NOT SET';
  const host = url !== 'NOT SET' ? url.split('@')[1]?.split('/')[0] ?? 'unknown' : 'NOT SET';
  try {
    const sql = getSql();
    const rows = await sql`SELECT id, title FROM feature_requests ORDER BY created_at DESC`;
    return NextResponse.json({ host, count: rows.length, rows });
  } catch (err) {
    return NextResponse.json({ host, error: String(err) }, { status: 500 });
  }
}
