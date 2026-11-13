import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24">
      <h1 className="font-display text-4xl font-bold">We could not find that page</h1>
      <p className="mt-3 text-ink/70">It may have moved or been removed.</p>
      <Link href="/" className="mt-6 inline-block text-brand hover:underline">Go to the homepage</Link>
    </div>
  );
}
