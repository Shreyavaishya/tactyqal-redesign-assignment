import { NextResponse } from 'next/server';

export function isAdmin(req: Request): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const header = req.headers.get('authorization') ?? '';
  return header === `Bearer ${token}`;
}

export const unauthorized = () =>
  NextResponse.json({ error: 'Unauthorized. Send "Authorization: Bearer <ADMIN_TOKEN>".' }, { status: 401 });
