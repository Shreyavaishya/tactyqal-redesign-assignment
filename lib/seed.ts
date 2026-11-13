import type { PostInput } from './posts';

// The six articles currently on the WordPress blog (titles, excerpts, dates from tactyqal.com).
// Full article bodies come from `npm run import:wp`, which replaces these placeholders.
const note = '\n\n*This is a short placeholder. Run the WordPress import to bring in the full article.*';
const post = (title: string, excerpt: string, date: string, tags: string[], slug: string): PostInput => ({
  title, slug, excerpt, tags, status: 'published', author: 'Tactyqal',
  publishedAt: `${date}T09:00:00.000Z`,
  content: `${excerpt}${note}`,
});

export const SEED_POSTS: PostInput[] = [
  post('50 No-code startup app ideas', 'Find a list of 50 unique ideas you can explore for your startup, no programming skills needed.', '2025-07-09', ['No-code', 'Ideas'], '50-no-code-startup-ideas-to-build-without-programming-skills'),
  post('The elevator pitch for business entrepreneurs', 'An elevator pitch is the fastest way to describe what your startup does. Here is how to write one, with examples.', '2024-05-01', ['Pitching'], 'elevator-pitch-with-examples-for-business-entrepreneurs'),
  post('How to build a tech startup team?', 'In the early days, the fewer employees, the better. Managing people takes up a lot of time.', '2024-04-20', ['Startups'], 'how-to-build-a-tech-startup-team'),
  post('11 reasons why startups fail at the idea stage', 'The default state of a startup is failure, and there are many ways it happens before you write any code.', '2024-04-10', ['Startups', 'Ideas'], '11-reasons-why-startups-fail-at-idea-stage'),
  post('30 Startup ideas to solve food waste problems', 'Food waste is a massive problem. Every year, we throw away one-third of all food.', '2024-03-15', ['Ideas', 'Social good'], '30-startup-ideas-for-solving-food-waste-problems'),
  post('50 Startup ideas for Gen-Z Entrepreneurs', 'Looking at the opportunities ahead, Generation Z entrepreneurs have real advantages.', '2024-03-05', ['Ideas', 'Gen Z'], '50-startup-ideas-for-generation-z-entrepreneurs'),
  { title: 'Draft: how we mentor a first app', excerpt: 'Work in progress.', content: 'Notes to expand.', tags: ['Startups'], status: 'draft' },
];
