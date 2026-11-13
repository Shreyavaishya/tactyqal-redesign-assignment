import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { deletePost, getPost, postUpdateInput, updatePost } from '@/lib/posts';
import { isAdmin, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';
type Ctx = { params: { idOrSlug: string } };
const notFound = () => NextResponse.json({ error: 'Post not found' }, { status: 404 });

// GET /api/posts/:idOrSlug   (drafts visible to admin only)
export async function GET(req: Request, { params }: Ctx) {
  const db = await getDb();
  const post = await getPost(db, params.idOrSlug, { includeDrafts: isAdmin(req) });
  return post ? NextResponse.json(post) : notFound();
}

async function update(req: Request, { params }: Ctx) {
  if (!isAdmin(req)) return unauthorized();
  const body = await req.json().catch(() => null);
  const parsed = postUpdateInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 422 });
  const db = await getDb();
  const post = await updatePost(db, params.idOrSlug, parsed.data);
  return post ? NextResponse.json(post) : notFound();
}
export const PUT = update;
export const PATCH = update;

// DELETE /api/posts/:idOrSlug  (admin)
export async function DELETE(req: Request, { params }: Ctx) {
  if (!isAdmin(req)) return unauthorized();
  const db = await getDb();
  return (await deletePost(db, params.idOrSlug)) ? new NextResponse(null, { status: 204 }) : notFound();
}
