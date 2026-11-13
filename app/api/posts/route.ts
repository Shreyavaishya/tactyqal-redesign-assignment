import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { createPost, listPosts, postInput } from '@/lib/posts';
import { isAdmin, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/posts?page=1&limit=10&q=ai&tag=startups[&status=all|draft  (admin only)]
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const admin = isAdmin(req);
  const requested = sp.get('status');
  const status = admin && (requested === 'all' || requested === 'draft') ? requested : 'published';
  const db = await getDb();
  const result = await listPosts(db, {
    page: Number(sp.get('page')) || 1,
    limit: Number(sp.get('limit')) || 10,
    q: sp.get('q') ?? undefined,
    tag: sp.get('tag') ?? undefined,
    status,
  });
  return NextResponse.json(result);
}

// POST /api/posts  (admin)
export async function POST(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const body = await req.json().catch(() => null);
  const parsed = postInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 422 });
  const db = await getDb();
  const post = await createPost(db, parsed.data);
  return NextResponse.json(post, { status: 201, headers: { Location: `/api/posts/${post.slug}` } });
}
