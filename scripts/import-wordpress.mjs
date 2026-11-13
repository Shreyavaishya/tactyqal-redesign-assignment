// Migrate posts from the existing WordPress blog into the new API.
// Usage: WP_URL=https://blog.example.com API_URL=http://localhost:3000 ADMIN_TOKEN=... npm run import:wp
const WP = process.env.WP_URL;
const API = process.env.API_URL ?? 'http://localhost:3000';
const TOKEN = process.env.ADMIN_TOKEN;
if (!WP || !TOKEN) { console.error('Set WP_URL and ADMIN_TOKEN.'); process.exit(1); }

const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

let page = 1, imported = 0;
for (;;) {
  const res = await fetch(`${WP}/wp-json/wp/v2/posts?per_page=50&page=${page}&_embed`);
  if (!res.ok) break;
  const items = await res.json();
  if (!items.length) break;
  for (const p of items) {
    const tags = (p._embedded?.['wp:term']?.flat() ?? []).filter((t) => t.taxonomy === 'post_tag' || t.taxonomy === 'category').map((t) => t.name);
    const body = {
      title: strip(p.title.rendered) || p.slug,
      slug: p.slug,
      excerpt: strip(p.excerpt.rendered).slice(0, 500),
      content: p.content.rendered, // HTML is valid Markdown input
      coverUrl: p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
      status: p.status === 'publish' ? 'published' : 'draft',
      tags,
    };
    const r = await fetch(`${API}/api/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(body) });
    console.log(r.ok ? 'imported' : `FAILED (${r.status})`, body.slug);
    if (r.ok) imported++;
  }
  page++;
}
console.log(`Done. ${imported} posts imported.`);
