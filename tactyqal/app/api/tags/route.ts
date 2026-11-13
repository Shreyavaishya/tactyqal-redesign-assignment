import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { listTags } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ data: await listTags(await getDb()) });
}
