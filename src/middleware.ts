import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt, updateSession } from '@/lib/auth';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/register', '/'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  // Get session
  const cookie = request.cookies.get('session')?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing public route with session
  if (isPublicRoute && session && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Update session expiration
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

