import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-ink/70 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} {SITE.name}</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/blog" className="hover:text-brand">Resources</Link>
          <a href={`mailto:${SITE.email}`} className="hover:text-brand">{SITE.email}</a>
          <a href={`tel:${SITE.phone.replace(/-/g, '')}`} className="hover:text-brand">{SITE.phone}</a>
          <Link href="/admin" className="hover:text-brand">Admin</Link>
        </nav>
      </div>
    </footer>
  );
}
