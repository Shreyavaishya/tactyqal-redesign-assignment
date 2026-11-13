# Tactyqal Labs: homepage redesign and blog backend

One Next.js 14 app (TypeScript, Tailwind) with two parts:

1. **Homepage redesign** (`app/page.tsx`): responsive, built from the UI prototype and the live tactyqal.com content.
2. **Blog backend**: PostgreSQL + REST API + admin UI + blog pages, replacing the separate WordPress blog.

## Run locally

```bash
npm install
cp .env.example .env.local     # set ADMIN_TOKEN
npm run dev                    # http://localhost:3000
```

With no `DATABASE_URL`, the app uses an embedded PostgreSQL (PGlite) stored in `.data/`. Tables are created and six sample posts are seeded on first request. No database install is needed.

## Use a real database (Supabase / Neon / any Postgres)

Set `DATABASE_URL=postgres://...` in the environment. The same code runs unchanged; tables are created automatically.

## Deploy (live URL)

Push to GitHub, import the repo in Vercel, and set `ADMIN_TOKEN` and `DATABASE_URL` (a free Supabase or Neon database works).

## Database schema

| table | columns |
| --- | --- |
| `posts` | id, slug (unique), title, excerpt, content (Markdown), cover_url, author, status (`draft`/`published`), published_at, created_at, updated_at |
| `tags` | id, name (unique), slug (unique) |
| `post_tags` | post_id → posts, tag_id → tags (many-to-many, cascade delete) |

Index on `(status, published_at)` for the public listing. Defined in `lib/schema.ts` (Drizzle ORM).

## API

Write requests need `Authorization: Bearer <ADMIN_TOKEN>`. Public reads return published posts only.

| method | path | notes |
| --- | --- | --- |
| GET | `/api/posts` | `page`, `limit` (max 50), `q` (search), `tag`; admins can add `status=all\|draft` |
| POST | `/api/posts` | create. `title` required; slug is generated and made unique |
| GET | `/api/posts/:idOrSlug` | by numeric id or slug; drafts visible to admin only |
| PUT / PATCH | `/api/posts/:idOrSlug` | partial update; `tags` replaces the tag list |
| DELETE | `/api/posts/:idOrSlug` | returns 204 |
| GET | `/api/tags` | tags with post counts |

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer dev-token" -H "Content-Type: application/json" \
  -d '{"title":"My first post","content":"## Hello","status":"published","tags":["Ideas"]}'
```

Errors: `401` missing/wrong token, `404` not found, `422` validation failure (with `issues`).

## Pages

- `/` homepage, `/blog` (search, tag filter, pagination), `/blog/[slug]`
- `/admin`: paste the admin token, then create, edit, publish and delete posts (Markdown)

## Migrate from WordPress

```bash
WP_URL=https://www.tactyqal.com/blog API_URL=http://localhost:3000 ADMIN_TOKEN=... npm run import:wp
```

Reads `/wp-json/wp/v2/posts`, keeps slugs, dates' order, categories/tags and featured images. Run it against a fresh database (`SEED=false`) so the sample posts are not duplicated.

## Design notes

- Posts are rendered from Markdown. Content is only writable through the token-protected API, so it is treated as trusted.
- Homepage claims (student counts, results) come from the current site; confirm them before launch.
