import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'fallback-secret-key';
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: string;
  email: string;
  expiresAt: number;
}

// Encrypt session data into JWT
export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + 60 * 1000))
    .sign(key);
}

// Decrypt JWT and return session data
export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Create session cookie
export async function createSession(userId: string, email: string) {
  const expiresAt = Date.now() + 60 * 1000;
  const session = await encrypt({ userId, email, expiresAt });

  (await cookies()).set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt),
    sameSite: 'lax',
    path: '/',
  });
}

// Delete session cookie
export async function deleteSession() {
  (await cookies()).delete('session');
}

// Get current session
export async function getSession(): Promise<SessionPayload | null> {
  const cookie = (await cookies()).get('session')?.value;
  if (!cookie) return null;
  return await decrypt(cookie);
}

// Update session expiration
export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  if (!parsed) return;

  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 60 * 1000),
    sameSite: 'lax',
    path: '/',
  });

  return res;
}

