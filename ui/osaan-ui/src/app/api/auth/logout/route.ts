import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { config, isKeycloakEnabled } from '@/lib/config';

/**
 * Custom logout endpoint that handles Keycloak SSO logout
 * This route is called BEFORE signOut to get the session with idToken,
 * then redirects to Keycloak logout which will redirect back to /api/auth/signout-callback
 */
export async function GET(request: NextRequest) {
  const appUrl = config.appUrl;

  if (!isKeycloakEnabled) {
    return NextResponse.redirect(new URL('/api/auth/signout', appUrl));
  }

  const session = await getServerSession(authOptions);

  if (session?.idToken) {
    const postLogoutRedirectUri = `${appUrl}/api/auth/signout-callback`;

    const keycloakLogoutUrl =
      `${config.keycloak.issuer}/protocol/openid-connect/logout?` +
      `id_token_hint=${session.idToken}&` +
      `post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;

    return NextResponse.redirect(keycloakLogoutUrl);
  }

  return NextResponse.redirect(new URL('/', appUrl));
}
