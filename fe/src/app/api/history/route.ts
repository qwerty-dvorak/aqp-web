import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import pool from '@/lib/db';

/** Upsert user from session, return internal user id. */
async function ensureUser(session: { user?: { id?: string; email?: string; name?: string; image?: string } }) {
  const u = session.user;
  if (!u?.id || !u?.email) return null;

  const res = await pool.query(
    `INSERT INTO users (google_id, email, name, image)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (google_id) DO UPDATE SET email = $2, name = $3, image = $4
     RETURNING id`,
    [u.id, u.email, u.name ?? '', u.image ?? ''],
  );
  return res.rows[0].id as number;
}

/** GET /api/history — return recent queries for the signed-in user. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ history: [] });
  }

  const userId = await ensureUser(session);
  if (!userId) return NextResponse.json({ history: [] });

  const { rows } = await pool.query(
    `SELECT id, query, dataset, accuracy_level, mode,
            exact_time_ms, approx_time_ms, speedup, error_pct, created_at
     FROM query_history
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId],
  );

  return NextResponse.json({ history: rows });
}

/** POST /api/history — save a query run. */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userId = await ensureUser(session);
  if (!userId) {
    return NextResponse.json({ error: 'User sync failed' }, { status: 500 });
  }

  const body = await request.json();
  const { query, dataset, accuracyLevel, mode, exactTime, approxTime, speedup, error } = body;

  await pool.query(
    `INSERT INTO query_history
       (user_id, query, dataset, accuracy_level, mode, exact_time_ms, approx_time_ms, speedup, error_pct)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [userId, query, dataset, accuracyLevel, mode, exactTime, approxTime, speedup, error],
  );

  return NextResponse.json({ ok: true });
}
