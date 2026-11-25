import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SECRET = process.env.PKM_SECRET;

export async function GET() {
  const res = await fetch(`${BASE_URL}/submissions/export`, {
    headers: { 'X-PKM-SECRET': SECRET! },
  });
  const csv = await res.text();
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rekap-liga-pkm.csv"',
    },
  });
}

