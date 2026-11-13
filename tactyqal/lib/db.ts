import { drizzle as drizzlePglite, type PgliteDatabase } from 'drizzle-orm/pglite';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import { mkdirSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import * as schema from './schema';
import { SEED_POSTS } from './seed';

type DB = PgliteDatabase<typeof schema>;

// pglite returns { rows }, postgres-js returns the array itself
export function rowsOf<T>(res: unknown): T[] {
  return (Array.isArray(res) ? res : (res as { rows: T[] }).rows) as T[];
}

const DDL = [
  `CREATE TABLE IF NOT EXISTS posts (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    excerpt text NOT NULL DEFAULT '',
    content text NOT NULL DEFAULT '',
    cover_url text,
    author text NOT NULL DEFAULT 'Tactyqal Labs',
    status text NOT NULL DEFAULT 'draft',
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS posts_status_published_idx ON posts (status, published_at)`,
  `CREATE TABLE IF NOT EXISTS tags (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE
  )`,
  `CREATE TABLE IF NOT EXISTS post_tags (
    post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id integer NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
  )`,
];

async function init(): Promise<DB> {
  const url = process.env.DATABASE_URL;
  let db: DB;
  if (url) {
    // Production: any PostgreSQL (Supabase, Neon, RDS...)
    db = drizzlePostgres(postgres(url, { prepare: false }), { schema }) as unknown as DB;
  } else {
    // Local: embedded PostgreSQL (WASM), persisted to disk. No install needed.
    mkdirSync('./.data', { recursive: true });
    db = drizzlePglite(new PGlite('./.data/pglite'), { schema });
  }
  for (const stmt of DDL) await db.execute(sql.raw(stmt));

  const res = await db.execute(sql`SELECT count(*)::int AS n FROM posts`);
  const n = rowsOf<{ n: number }>(res)[0]?.n ?? 0;
  if (n === 0 && process.env.SEED !== 'false') {
    const { createPost } = await import('./posts');
    for (const p of SEED_POSTS) await createPost(db, p);
  }
  return db;
}

const g = globalThis as unknown as { __tqDb?: Promise<DB> };
export function getDb(): Promise<DB> {
  if (!g.__tqDb) {
    g.__tqDb = init().catch((err) => {
      g.__tqDb = undefined; // retry on next request instead of caching the failure
      throw err;
    });
  }
  return g.__tqDb;
}
export type { DB };
