import Link from 'next/link';
import type { PostWithTags } from '@/lib/schema';

export const fmtDate = (d: Date | string | null) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export default function PostCard({ post }: { post: PostWithTags }) {
  return (
    <article className="border-t border-line py-6">
      <Link href={`/blog/${post.slug}`} className="group block">
        <h3 className="font-display text-2xl font-semibold group-hover:text-brand">{post.title}</h3>
        <p className="mt-2 max-w-2xl text-ink/80">{post.excerpt}</p>
      </Link>
      <p className="mt-3 text-sm text-ink/60">
        {fmtDate(post.publishedAt)}
        {post.tags.length > 0 && ` · ${post.tags.join(', ')}`}
      </p>
    </article>
  );
}
