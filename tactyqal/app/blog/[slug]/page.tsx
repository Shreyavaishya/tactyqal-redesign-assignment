import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { getDb } from '@/lib/db';
import { getPost } from '@/lib/posts';
import { fmtDate } from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(await getDb(), params.slug);
  return post ? { title: `${post.title} | Tactyqal Labs`, description: post.excerpt } : {};
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(await getDb(), params.slug);
  if (!post) notFound();
  // Content is authored by admins only (token-protected API), so it is rendered as trusted Markdown.
  const html = await marked.parse(post.content);

  return (
    <article className="mx-auto max-w-2xl px-5 py-14">
      <Link href="/blog" className="text-sm text-brand hover:underline">Back to blog</Link>
      <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-ink/60">
        {post.author} · {fmtDate(post.publishedAt)}
        {post.tags.length > 0 && ` · ${post.tags.join(', ')}`}
      </p>
      <div className="prose-tq mt-8" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
