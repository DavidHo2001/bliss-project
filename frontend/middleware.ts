import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value; //After login, also save to cookie for middleware to read
  const isUserRoute = request.nextUrl.pathname.startsWith('/user');
  const isLoginRoute = request.nextUrl.pathname === '/login';

  if (isUserRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/user', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/login'],
};
