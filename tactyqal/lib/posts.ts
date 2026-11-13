import { and, desc, eq, ilike, inArray, or, sql, count } from 'drizzle-orm';
import { z } from 'zod';
import type { DB } from './db';
import { posts, tags, postTags, type PostWithTags } from './schema';
import { slugify } from './slug';

export const postInput = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(1).max(100).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().max(200_000).optional(),
  coverUrl: z.string().url().nullable().optional().or(z.literal('').transform(() => null)),
  author: z.string().trim().min(1).max(100).optional(),
  status: z.enum(['draft', 'published']).optional(),
  publishedAt: z.string().datetime().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
});
export const postUpdateInput = postInput.partial();
export type PostInput = z.infer<typeof postInput>;

async function uniqueSlug(db: DB, base: string, ignoreId?: number) {
  let candidate = base;
  for (let i = 2; ; i++) {
    const [hit] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, candidate)).limit(1);
    if (!hit || hit.id === ignoreId) return candidate;
    candidate = `${base}-${i}`;
  }
}

async function attachTags(db: DB, rows: (typeof posts.$inferSelect)[]): Promise<PostWithTags[]> {
  if (!rows.length) return [];
  const links = await db
    .select({ postId: postTags.postId, name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(inArray(postTags.postId, rows.map((r) => r.id)));
  return rows.map((r) => ({ ...r, tags: links.filter((l) => l.postId === r.id).map((l) => l.name) }));
}

async function setTags(db: DB, postId: number, names: string[]) {
  await db.delete(postTags).where(eq(postTags.postId, postId));
  const unique = [...new Map(names.map((n) => [slugify(n), n])).entries()];
  for (const [slug, name] of unique) {
    await db.insert(tags).values({ name, slug }).onConflictDoNothing();
    const [t] = await db.select({ id: tags.id }).from(tags).where(eq(tags.slug, slug));
    await db.insert(postTags).values({ postId, tagId: t.id }).onConflictDoNothing();
  }
}

export async function createPost(db: DB, input: PostInput): Promise<PostWithTags> {
  const slug = await uniqueSlug(db, slugify(input.slug ?? input.title));
  const status = input.status ?? 'draft';
  const [row] = await db
    .insert(posts)
    .values({
      slug,
      title: input.title,
      excerpt: input.excerpt ?? '',
      content: input.content ?? '',
      coverUrl: input.coverUrl ?? null,
      author: input.author ?? 'Tactyqal Labs',
      status,
      publishedAt: status === 'published' ? (input.publishedAt ? new Date(input.publishedAt) : new Date()) : null,
    })
    .returning();
  if (input.tags?.length) await setTags(db, row.id, input.tags);
  return (await attachTags(db, [row]))[0];
}

const isNumeric = (s: string) => /^\d+$/.test(s);

export async function getPost(db: DB, idOrSlug: string, opts: { includeDrafts?: boolean } = {}) {
  const [row] = await db
    .select()
    .from(posts)
    .where(isNumeric(idOrSlug) ? eq(posts.id, Number(idOrSlug)) : eq(posts.slug, idOrSlug))
    .limit(1);
  if (!row || (row.status !== 'published' && !opts.includeDrafts)) return null;
  return (await attachTags(db, [row]))[0];
}

export async function updatePost(db: DB, idOrSlug: string, input: Partial<PostInput>) {
  const current = await getPost(db, idOrSlug, { includeDrafts: true });
  if (!current) return null;
  const patch: Partial<typeof posts.$inferInsert> = { updatedAt: new Date() };
  if (input.title !== undefined) patch.title = input.title;
  if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
  if (input.content !== undefined) patch.content = input.content;
  if (input.coverUrl !== undefined) patch.coverUrl = input.coverUrl;
  if (input.author !== undefined) patch.author = input.author;
  if (input.slug !== undefined) patch.slug = await uniqueSlug(db, slugify(input.slug), current.id);
  if (input.status !== undefined) {
    patch.status = input.status;
    if (input.status === 'published' && !current.publishedAt) patch.publishedAt = new Date();
    if (input.status === 'draft') patch.publishedAt = null;
  }
  await db.update(posts).set(patch).where(eq(posts.id, current.id));
  if (input.tags) await setTags(db, current.id, input.tags);
  return getPost(db, String(current.id), { includeDrafts: true });
}

export async function deletePost(db: DB, idOrSlug: string) {
  const current = await getPost(db, idOrSlug, { includeDrafts: true });
  if (!current) return false;
  await db.delete(posts).where(eq(posts.id, current.id));
  return true;
}

export async function listPosts(
  db: DB,
  o: { page?: number; limit?: number; q?: string; tag?: string; status?: 'draft' | 'published' | 'all' } = {}
) {
  const page = Math.max(1, o.page ?? 1);
  const limit = Math.min(50, Math.max(1, o.limit ?? 10));
  const conds = [];
  const st = o.status ?? 'published';
  if (st !== 'all') conds.push(eq(posts.status, st));
  if (o.q) {
    const like = `%${o.q}%`;
    conds.push(or(ilike(posts.title, like), ilike(posts.excerpt, like), ilike(posts.content, like)));
  }
  if (o.tag) {
    conds.push(
      sql`${posts.id} IN (SELECT pt.post_id FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE t.slug = ${slugify(o.tag)})`
    );
  }
  const where = conds.length ? and(...conds) : undefined;
  const [{ total }] = await db.select({ total: count() }).from(posts).where(where);
  const rows = await db
    .select()
    .from(posts)
    .where(where)
    .orderBy(desc(sql`coalesce(${posts.publishedAt}, ${posts.createdAt})`))
    .limit(limit)
    .offset((page - 1) * limit);
  return { data: await attachTags(db, rows), meta: { page, limit, total: Number(total), pages: Math.max(1, Math.ceil(Number(total) / limit)) } };
}

export async function listTags(db: DB) {
  return db
    .select({ name: tags.name, slug: tags.slug, posts: count(postTags.postId) })
    .from(tags)
    .leftJoin(postTags, eq(postTags.tagId, tags.id))
    .groupBy(tags.id)
    .orderBy(tags.name);
}
