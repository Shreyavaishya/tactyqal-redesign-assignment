import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { getDb } from '@/lib/db';
import { listPosts, listTags } from '@/lib/posts';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blog | Tactyqal Labs' };

export default async function BlogIndex({ searchParams }: { searchParams: { page?: string; tag?: string; q?: string } }) {
  const db = await getDb();
  const page = Number(searchParams.page) || 1;
  const [{ data, meta }, tags] = await Promise.all([
    listPosts(db, { page, limit: 8, tag: searchParams.tag, q: searchParams.q }),
    listTags(db),
  ]);
  const qs = (p: number) => {
    const sp = new URLSearchParams();
    if (searchParams.tag) sp.set('tag', searchParams.tag);
    if (searchParams.q) sp.set('q', searchParams.q);
    sp.set('page', String(p));
    return `/blog?${sp}`;
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Blog</h1>
      <form action="/blog" className="mt-6 flex gap-2" role="search">
        <label htmlFor="q" className="sr-only">Search posts</label>
        <input id="q" name="q" defaultValue={searchParams.q} placeholder="Search posts" className="w-full max-w-sm rounded border border-line bg-white px-3 py-2" />
        <button className="rounded bg-ink px-4 py-2 text-paper hover:bg-brand">Search</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link href="/blog" className={`rounded-full border px-3 py-1 ${!searchParams.tag ? 'border-ink bg-ink text-paper' : 'border-line hover:bg-mist'}`}>All</Link>
        {tags.filter((t) => Number(t.posts) > 0).map((t) => (
          <Link key={t.slug} href={`/blog?tag=${t.slug}`} className={`rounded-full border px-3 py-1 ${searchParams.tag === t.slug ? 'border-ink bg-ink text-paper' : 'border-line hover:bg-mist'}`}>
            {t.name}
          </Link>
        ))}
      </div>
      <div className="mt-8">
        {data.length ? data.map((p) => <PostCard key={p.id} post={p} />) : <p className="py-10 text-ink/70">No posts match. Try a different search or tag.</p>}
      </div>
      {meta.pages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-between text-sm">
          {meta.page > 1 ? <Link href={qs(meta.page - 1)} className="text-brand hover:underline">Newer</Link> : <span />}
          <span className="text-ink/60">Page {meta.page} of {meta.pages}</span>
          {meta.page < meta.pages ? <Link href={qs(meta.page + 1)} className="text-brand hover:underline">Older</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
