export const ADMIN_COOKIE_NAME = 'pkm_admin_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 jam

function getSigningSecret(): string {
  return (
    process.env.PKM_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_SECRET_KEY ||
    'ligapkm-uty-secret-2026'
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signValue(value: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return toBase64Url(new Uint8Array(sig));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Membuat token sesi admin yang ditandatangani HMAC-SHA256. */
export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${exp}`;
  const sig = await signValue(payload, getSigningSecret());
  return `${payload}.${sig}`;
}

/** Memverifikasi keaslian dan masa berlaku token sesi admin. */
export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [role, expStr, sig] = parts;
  if (role !== 'admin') return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const expectedSig = await signValue(`${role}.${expStr}`, getSigningSecret());
  return constantTimeEqual(sig, expectedSig);
}

