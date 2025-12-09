import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

/**
 * Callback endpoint after Keycloak logout
 * Keycloak redirects here after completing SSO logout,
 * then we redirect to NextAuth signout to clear the local session
 */
export async function GET(request: NextRequest) {
  const appUrl = config.appUrl;

  return NextResponse.redirect(
    new URL('/api/auth/signout?callbackUrl=/', appUrl)
  );
}
