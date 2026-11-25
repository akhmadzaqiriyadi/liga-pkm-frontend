import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SECRET = process.env.PKM_SECRET;

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${BASE_URL}/submissions/${id}`, {
    headers: { 'X-PKM-SECRET': SECRET! },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

