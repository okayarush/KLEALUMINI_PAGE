import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/auth';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect /admin → /admin/login
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Protect /admin/dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
    if (cookie?.value !== ADMIN_COOKIE_VALUE) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
