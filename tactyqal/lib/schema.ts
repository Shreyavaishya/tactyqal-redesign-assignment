import { pgTable, serial, text, timestamp, integer, primaryKey, index } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull().default(''),
    content: text('content').notNull().default(''), // Markdown
    coverUrl: text('cover_url'),
    author: text('author').notNull().default('Tactyqal Labs'),
    status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ statusIdx: index('posts_status_published_idx').on(t.status, t.publishedAt) })
);

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
});

export const postTags = pgTable(
  'post_tags',
  {
    postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.postId, t.tagId] }) })
);

export type Post = typeof posts.$inferSelect;
export type PostWithTags = Post & { tags: string[] };
