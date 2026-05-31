import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't need auth
  const publicRoutes = ['/login', '/register', '/', '/status', '/api', '/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route) || pathname === '/');
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('orbit.token')?.value;
  
  // Enforce true cookie-based authentication
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
