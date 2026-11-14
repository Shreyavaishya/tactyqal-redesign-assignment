import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { getDb } from '@/lib/db';
import { listPosts } from '@/lib/posts';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

const IMG = 'https://www.tactyqal.com/application/assets/img/apps';
const stories = [
  { name: 'KrishiDrishti', img: 'krishidrishti1.png', body: 'AI-powered soil analysis and crop recommendations that can help millions of local farmers in India.' },
  { name: 'Elenor Vegan Handbags', img: 'elenor1.png', body: 'A corporate gifting platform for vegan handbags, started by a 16-year-old. It made ₹9,000 in its first week.' },
  { name: 'One Last Chapter', img: 'olc1.png', body: 'A book subscription service for kids, started by a 13-year-old. It brings in ₹1,00,000 a month.' },
  { name: 'Paws of Promise', img: 'pop1.png', body: 'Virtual pet adoption that connects pet lovers with animals from shelters.' },
  { name: 'AudioNova', img: 'audionova1.png', body: 'An AI music and video production company.' },
  { name: 'Converza', img: 'converza1.png', body: 'A Spanish learning app with Luna, a friendly AI language bot.' },
];

const weeks = [
  { weeks: 'Weeks 1-2', title: 'Ideation and market research', body: 'Your teen picks an idea they care about and checks that real people want it.' },
  { weeks: 'Weeks 3-4', title: 'Design and prototyping', body: 'They sketch the app and click through a prototype.' },
  { weeks: 'Weeks 5-6', title: 'Full-stack development', body: 'They build a working app with modern no-code tools, step by step.' },
  { weeks: 'Weeks 7-8', title: 'Launch and marketing', body: 'They pitch it, launch it, and get it in front of real users.' },
];

const why = [
  ['1:1 mentoring', 'Every student gets a dedicated mentor. There are no group classes.'],
  ['A full-stack app, no coding', 'Students build real apps with modern no-code tools and platforms.'],
  ['A stronger university application', 'A launched project and real results stand out in applications.'],
  ['Real revenue', 'Students learn to build, launch and earn from their own apps.'],
  ['Pitching and presenting', 'They learn to pitch their idea and launch it on Product Hunt.'],
  ['Support after the program', 'Guidance and an alumni community continue after week 8.'],
];

const tools = [
  'Startup Idea Generator', 'Fundability Assessment', 'Team Evaluation Tool', 'Pitch Deck Analyzer',
  'Top 10 Traits for Business Success', 'Cofounder Compatibility Test', 'Problem-Solution Fit', 'Website Landing Page Assessment',
];

const voices = [
  ['Aarav Sharma', 'I had to struggle to find a tech cofounder.'],
  ['Isha Patel', 'Now I feel independent and can build anything I want.'],
  ['Rohan Verma', 'It’s the future.'],
  ['Simran Kaur', 'I can focus on the creative side and don’t have to worry about whether it can be built.'],
  ['Devansh Mehta', 'I went from having no idea to launching my app.'],
  ['Priya Nair', 'My impact app was only in my head till I built it.'],
];

const faqs = [
  ['What if my teen has no coding experience?', 'That is fine. The program is designed for beginners. We use no-code tools and guide students step by step.'],
  ['Will this help with university applications?', 'We help students build standout projects that strengthen their applications. Our alumni have been admitted to universities in the US and UK.'],
  ['What kind of apps do students build?', 'AI-powered tools, e-commerce platforms, subscription services and social good projects. We help them pick ideas that excite them.'],
  ['How much time does it take?', 'About 2-3 hours a week: one hour of live mentoring and the rest independent work.'],
  ['Can my teen earn real revenue?', 'Yes. Several students have earned revenue, won grants and been covered in the media.'],
  ['What support is there after the program?', 'Ongoing support, an alumni community and guidance after the program ends.'],
];

const price = ['8 weeks of 1:1 mentoring', 'Full-stack app development', 'Product Hunt launch', 'Pitch deck creation', 'Marketing strategy', 'Ongoing support'];

const h2 = 'font-display text-3xl font-semibold tracking-tight sm:text-5xl';
const eyebrow = 'text-xs font-medium uppercase tracking-widest text-brand';

export default async function Home() {
  const { data: latest } = await listPosts(await getDb(), { limit: 3 });


  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-14 pt-12 sm:pt-16 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Big ideas start young</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            Small idea.<br />Big possibilities.
          </h1>
          <p className="mt-8 text-xl">Help your teen build something that matters.</p>
          <p className="mt-3 max-w-md text-ink/60">
            From their first idea to a real, launched app in 8 weeks. Personal 1:1 mentoring. No coding experience needed.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a href={SITE.bookingUrl} className="rounded-md bg-brand px-6 py-4 font-medium text-white hover:bg-ink">Book a free consultation</a>
            <Link href="#stories" className="font-medium hover:text-brand">Explore student projects</Link>
          </div>
          <p className="mt-8 text-xs text-ink/50">For the next generation of builders, not just programmers.</p>
        </div>

        {/* Outer Lilac Container with Showcase Card */}
        <div className="relative w-full max-w-xl mx-auto rounded-[2.5rem] bg-lilac p-6 sm:p-12 pb-24 sm:pb-32 overflow-hidden shadow-xl" aria-hidden="true">
            
            {/* Top Section Label */}
            <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">YOUR IDEA, OUT IN THE WORLD.</p>

            {/* Top-Right Dark Floating Badge */}
            <div className="absolute right-6 top-8 sm:right-12 sm:top-10 z-30 rounded-2xl bg-neutral-900 px-5 py-3 text-white shadow-xl">
                <p className="text-xs font-medium text-neutral-300">8 weeks.</p>
                <p className="text-sm font-bold tracking-tight">Endless potential.</p>
            </div>

            {/* Yellow Rotated Sticky Note (Top Left) */}
            <div className="absolute left-4 top-28 sm:left-12 sm:top-32 z-30 w-44 -rotate-6 rounded-lg bg-note p-4 text-sm font-large text-ink shadow-lg border border-yellow-200 ">
                What if I could make a real difference?
            </div>

            {/* Main Central Card (Browser Mockup Style) */}
            <div className="relative mx-auto mt-28 sm:mt-24 max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                
            {/* Browser Header Bar */}
<div className="flex items-center justify-between bg-mist px-4 py-3 border-b border-black/5 relative">
    {/* Window Dots */}
    <div className="flex items-center space-x-1.5">
        <span className="h-3 w-3 rounded-full bg-red-400 inline-block"></span>
        <span className="h-3 w-3 rounded-full bg-yellow-400 inline-block"></span>
        <span className="h-3 w-3 rounded-full bg-green-400 inline-block"></span>
    </div>
    
    {/* URL Pill moved to the top-right corner */}
    <div className="rounded-md bg-white px-3 py-1 text-[11px] text-neutral-500 font-mono tracking-wide shadow-2xs border border-black/5">
        krishidrishti.app
    </div>
</div>

                {/* Card Content Body */}
                <div className="px-6 pb-8 pt-8 sm:px-10 sm:pb-10">
                    <h3 className="font-bold text-3xl leading-tight sm:text-4xl text-neutral-900">
                        Better soil.<br />Better futures.
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-medium">
                        AI-powered insights for local farmers.
                    </p>
                    <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-forest/90 transition-all">
                        Explore your soil <span className="text-sm">→</span>
                    </button>
                </div>
            </div>

            {/* Bottom-Left Lime Floating Badge */}
            <div className="absolute bottom-6 left-6 sm:left-12 z-30 rounded-xl bg-lime px-4 py-3 text-xs font-medium text-neutral-900 shadow-md">
                <div className="text-[10px] mb-0.5 opacity-60 font-mono">↗</div>
                <p className="font-bold leading-snug">Built by a student.</p>
                <p className="text-neutral-800 leading-snug">Ready for the real world.</p>
            </div>
        </div>
      </section>

      {/* Facts */}
      <section className="mx-auto max-w-6xl px-5">
        <dl className="grid divide-y divide-line rounded-2xl bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ['100+', 'students mentored'],
            ['8 weeks', 'from first idea to launched app'],
            ['1 hour', 'of live 1:1 mentoring each session'],
          ].map(([n, l]) => (
            <div key={l} className="px-8 py-8">
              <dt className="font-display text-4xl font-semibold">{n}</dt>
              <dd className="mt-1 text-ink/60">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Student stories */}
      <section id="stories" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <h2 className="font-display text-3xl font-semibold">Real students. Real apps.</h2>
        <p className="mt-3 max-w-xl text-ink/70">Every project here was built by a teen in the program.</p>
        <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <li key={s.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/${s.img}`} alt={`Screenshot of ${s.name}`} loading="lazy" className="aspect-[16/10] w-full rounded-xl border border-line bg-mist object-cover object-top" />
              <h3 className="mt-4 font-display text-xl font-semibold">{s.name}</h3>
              <p className="mt-1 text-ink/70">{s.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Program */}
      <section id="program" className="scroll-mt-24 bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-3xl font-semibold">From idea to full app in 8 weeks</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {weeks.map((w) => (
              <li key={w.weeks} className="border-t-2 border-brand pt-4">
                <p className="text-sm text-lime">{w.weeks}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{w.title}</h3>
                <p className="mt-2 text-paper/70">{w.body}</p>
              </li>
            ))}
          </ol>
          <figure className="mt-14 max-w-2xl">
            <blockquote className="font-display text-2xl leading-snug">“Learn to sell. Learn to build. If you can do both, you will be unstoppable.”</blockquote>
            <figcaption className="mt-3 text-paper/60">Naval Ravikant</figcaption>
          </figure>
          <p className="mt-10 text-paper/70">Personal 1:1 live sessions, one hour each, with an expert mentor.</p>
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <h2 className="font-display text-3xl font-semibold">Why parents choose Tactyqal Labs</h2>
        <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {why.map(([t, b]) => (
            <div key={t} className="border-t border-ink pt-4">
              <dt className="font-display text-xl font-semibold">{t}</dt>
              <dd className="mt-2 text-ink/70">{b}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Voices */}
      <section className="bg-lilac/60">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-3xl font-semibold">What our students say</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {voices.map(([n, q]) => (
              <li key={n} className="rounded-2xl bg-white p-6">
                <p className="text-lg leading-snug">“{q}”</p>
                <p className="mt-4 text-sm font-medium text-brand">{n}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Free tools */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold">Free tools to get started</h2>
            <p className="mt-3 text-ink/70">Startup assessment tools used by 1000+ entrepreneurs.</p>
            <a href={SITE.toolsUrl} className="mt-6 inline-block rounded-md bg-ink px-5 py-3 font-medium text-paper hover:bg-brand">Use the tools for free</a>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {tools.map((t) => (
              <li key={t} className="border-t border-line py-4 font-medium">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Blog */}
      <section id="resources" className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold">Learn from industry experts</h2>
          <Link href="/blog" className="shrink-0 text-brand hover:underline">Read all articles</Link>
        </div>
        <div className="mt-6">{latest.map((p) => <PostCard key={p.id} post={p} />)}</div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-20">
        <div className="grid gap-10 rounded-[2rem] bg-forest p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold">Start your teen&apos;s entrepreneurial journey</h2>
            <p className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-6xl font-semibold">₹16,000</span>
              <span className="text-xl text-white/60 line-through">₹25,000</span>
            </p>
            <a href={SITE.bookingUrl} className="mt-8 inline-block rounded-md bg-lime px-6 py-4 font-medium text-ink hover:bg-white">Enroll now</a>
          </div>
          <ul className="space-y-3 self-center text-lg">
            {price.map((p) => (
              <li key={p} className="border-b border-white/20 pb-3">{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 pb-20">
        <h2 className="font-display text-3xl font-semibold">Frequently asked questions</h2>
        <div className="mt-8">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-t border-line py-5 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-medium">
                {q}
                <span aria-hidden="true" className="text-2xl text-brand transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-ink/70">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 bg-lilac">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold">Ready to start your teen&apos;s success story?</h2>
            <p className="mt-4 max-w-md text-ink/70">Talk to our team. We reply within 24 hours.</p>
            <a href={SITE.bookingUrl} className="mt-8 inline-block rounded-md bg-brand px-6 py-4 font-medium text-white hover:bg-ink">Book a free appointment</a>
          </div>
          <dl className="space-y-5 self-center">
            <div><dt className="text-sm text-ink/60">Email</dt><dd className="text-lg"><a className="hover:text-brand" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
            <div><dt className="text-sm text-ink/60">Phone</dt><dd className="text-lg"><a className="hover:text-brand" href={`tel:${SITE.phone.replace(/-/g, '')}`}>{SITE.phone}</a></dd></div>
            <div><dt className="text-sm text-ink/60">Hours</dt><dd className="text-lg">{SITE.hours}</dd></div>
          </dl>
        </div>
      </section>
    </>
  );
}