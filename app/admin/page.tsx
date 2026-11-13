'use client';
import { useCallback, useEffect, useState } from 'react';

type Post = {
  id: number; slug: string; title: string; excerpt: string; content: string;
  status: 'draft' | 'published'; tags: string[]; coverUrl: string | null; author: string;
};
const empty: { title: string; excerpt: string; content: string; tags: string; status: 'draft' | 'published'; coverUrl: string } = { title: '', excerpt: '', content: '', tags: '', status: 'draft', coverUrl: '' };

export default function Admin() {
  const [token, setToken] = useState('');
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  const headers = useCallback(
    () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }),
    [token]
  );

  const load = useCallback(async () => {
    const res = await fetch('/api/posts?status=all&limit=50', { headers: headers() });
    const json = await res.json();
    setPosts(json.data);
    // If the token is wrong, drafts are hidden; detect it via a write-protected probe.
    const probe = await fetch('/api/posts/0', { method: 'DELETE', headers: headers() });
    setAuthed(probe.status !== 401);
  }, [headers]);

  useEffect(() => {
    const saved = sessionStorage.getItem('tq-token');
    if (saved) setToken(saved);
  }, []);
  useEffect(() => {
    if (token) { sessionStorage.setItem('tq-token', token); load(); }
  }, [token, load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      status: form.status,
      coverUrl: form.coverUrl || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    const res = await fetch(editing ? `/api/posts/${editing}` : '/api/posts', {
      method: editing ? 'PUT' : 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(`Could not save: ${j.error ?? res.statusText}`);
      return;
    }
    setMsg(editing ? 'Post updated' : 'Post created');
    setForm(empty); setEditing(null); load();
  }

  async function remove(p: Post) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/posts/${p.id}`, { method: 'DELETE', headers: headers() });
    setMsg(res.ok ? 'Post deleted' : 'Could not delete the post');
    load();
  }

  function edit(p: Post) {
    setEditing(p.id);
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content, tags: p.tags.join(', '), status: p.status, coverUrl: p.coverUrl ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const input = 'w-full rounded border border-line bg-white px-3 py-2';

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-4xl font-bold">Blog admin</h1>

      <div className="mt-6">
        <label htmlFor="token" className="mb-1 block text-sm">Admin token</label>
        <input id="token" type="password" value={token} onChange={(e) => setToken(e.target.value)} className={input} placeholder="Paste your ADMIN_TOKEN" />
        {token && !authed && <p className="mt-2 text-sm text-red-700">That token was not accepted. Check ADMIN_TOKEN in your environment.</p>}
      </div>

      {authed && (
        <>
          <form onSubmit={save} className="mt-10 space-y-4 border-t border-line pt-8">
            <h2 className="font-display text-2xl font-semibold">{editing ? 'Edit post' : 'New post'}</h2>
            <div><label className="mb-1 block text-sm" htmlFor="title">Title</label><input id="title" required minLength={3} className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="mb-1 block text-sm" htmlFor="excerpt">Excerpt</label><input id="excerpt" className={input} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div><label className="mb-1 block text-sm" htmlFor="content">Content (Markdown)</label><textarea id="content" rows={12} className={`${input} font-mono text-sm`} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="mb-1 block text-sm" htmlFor="tags">Tags (comma separated)</label><input id="tags" className={input} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
              <div><label className="mb-1 block text-sm" htmlFor="cover">Cover image URL</label><input id="cover" className={input} value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} /></div>
              <div><label className="mb-1 block text-sm" htmlFor="status">Status</label>
                <select id="status" className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}>
                  <option value="draft">Draft</option><option value="published">Published</option>
                </select></div>
            </div>
            <div className="flex gap-3">
              <button className="rounded bg-ink px-5 py-2 font-medium text-paper hover:bg-brand">{editing ? 'Save changes' : 'Create post'}</button>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="rounded border border-ink px-5 py-2">Cancel</button>}
            </div>
            <p role="status" className="text-sm text-brand">{msg}</p>
          </form>

          <h2 className="mt-12 font-display text-2xl font-semibold">All posts</h2>
          <ul className="mt-4">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 border-t border-line py-3">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-ink/60">/{p.slug} · {p.status === 'published' ? 'Published' : 'Draft'}</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => edit(p)} className="text-brand hover:underline">Edit</button>
                  <button onClick={() => remove(p)} className="text-red-700 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
