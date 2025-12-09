import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { isKeycloakEnabled, config } from './config';
import { cookies } from 'next/headers';

export async function getSession() {
  if (!isKeycloakEnabled) {
    return null;
  }

  return await getServerSession(authOptions);
}

export async function getAccessToken(): Promise<string | null> {
  if (!isKeycloakEnabled) {
    return null;
  }

  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get('next-auth.session-token')?.value ||
    cookieStore.get('__Secure-next-auth.session-token')?.value;

  if (!sessionToken) {
    return null;
  }

  if (authOptions.jwt?.decode) {
    const token = await authOptions.jwt.decode({
      token: sessionToken,
      secret: config.nextAuth.secret,
    });

    return (token?.accessToken as string) || null;
  }

  return null;
}
