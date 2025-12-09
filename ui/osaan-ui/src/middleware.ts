import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isKeycloakEnabled, config as appConfig } from './lib/config';

const publicRoutes = [
  '/',
  '/api/health',
  '/api/auth',
  '/auth/signin',
  '/auth/error',
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === pathname) return true;
    if (route.endsWith('*') && pathname.startsWith(route.slice(0, -1)))
      return true;
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isKeycloakEnabled) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: appConfig.nextAuth.secret,
  });

  if (!token) {
    if (pathname.startsWith('/api/')) {
      // For API routes, return 401
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // For page routes, redirect to signin
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

/**
 * Configure which routes should run the middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
