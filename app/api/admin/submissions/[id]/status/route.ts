import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SECRET = process.env.PKM_SECRET;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const res = await fetch(`${BASE_URL}/submissions/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-PKM-SECRET': SECRET!,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

