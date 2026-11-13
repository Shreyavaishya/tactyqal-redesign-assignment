import Link from 'next/link';

const links = [
  { href: '/#program', label: 'Our program' },
  { href: '/#stories', label: 'Student stories' },
  { href: '/#why', label: 'Why us' },
  { href: '/blog', label: 'Resources' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between border-b border-line px-5 py-5">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          tactyqal<span className="ml-1 align-top text-[10px] font-medium text-brand">LABS</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/blog" className="text-sm hover:text-brand md:hidden">Resources</Link>
          <Link href="/#contact" className="rounded-md bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-brand">Let&apos;s talk</Link>
        </div>
      </div>
    </header>
  );
}
