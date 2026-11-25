import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createSessionToken } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expectedPassword =
      process.env.PKM_SECRET ||
      process.env.ADMIN_PASSWORD ||
      process.env.ADMIN_SECRET_KEY ||
      'ligapkm-uty-secret-2026';

    if (
      !expectedPassword ||
      typeof password !== 'string' ||
      password.trim() !== expectedPassword.trim()
    ) {
      return NextResponse.json(
        { success: false, message: 'Password / Secret Key tidak valid' },
        { status: 401 }
      );
    }

    const token = await createSessionToken();
    const res = NextResponse.json({ success: true, message: 'Login berhasil' });

    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 jam
    });

    return res;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Permintaan tidak valid' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: 'Logout berhasil' });
  res.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}

