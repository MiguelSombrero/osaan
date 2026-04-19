import { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { config, isKeycloakEnabled, isRedisEnabled } from './config';
import { getRedisClient } from './redis';

/**
 * NextAuth configuration with Keycloak provider and Redis token storage
 */
export const authOptions: NextAuthOptions = {
  providers: isKeycloakEnabled
    ? [
        KeycloakProvider({
          clientId: config.keycloak.clientId,
          clientSecret: config.keycloak.clientSecret,
          issuer: config.keycloak.issuer,
        }),
      ]
    : [],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 1 day
    encode: async ({ token, secret }) => {
      if (isRedisEnabled && token?.sub) {
        const redis = await getRedisClient();
        if (redis) {
          // Use consistent key format without timestamp
          const sessionKey = `auth:session:${token.sub}`;
          await redis.setEx(
            sessionKey,
            24 * 60 * 60,
            JSON.stringify({
              accessToken: token.accessToken,
              refreshToken: token.refreshToken,
              idToken: token.idToken,
              expiresAt: token.expiresAt,
              roles: token.roles,
            })
          );
          const sessionOnlyToken = {
            sub: token.sub,
            sessionKey,
            roles: token.roles,
            exp: token.exp,
            iat: token.iat,
          };
          const jwt = await import('next-auth/jwt');
          return jwt.encode({ token: sessionOnlyToken, secret });
        }
      }
      const jwt = await import('next-auth/jwt');
      return jwt.encode({ token, secret });
    },
    decode: async ({ token, secret }) => {
      const jwt = await import('next-auth/jwt');
      const decoded = await jwt.decode({ token, secret });

      if (
        isRedisEnabled &&
        decoded?.sessionKey &&
        typeof decoded.sessionKey === 'string'
      ) {
        const redis = await getRedisClient();
        if (redis) {
          const sessionData = await redis.get(decoded.sessionKey);
          if (sessionData) {
            const tokens = JSON.parse(sessionData);
            return {
              ...decoded,
              ...tokens,
            };
          }
        }
      }
      return decoded;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  // Callbacks
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;

        // Decode the access token (a Keycloak JWT) to extract realm roles.
        // realm_access is only present in the access token, not the ID token.
        if (account.access_token) {
          try {
            const payload = JSON.parse(
              Buffer.from(account.access_token.split('.')[1], 'base64url').toString()
            ) as { realm_access?: { roles?: string[] } };
            token.roles = payload.realm_access?.roles ?? [];
          } catch {
            token.roles = [];
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Only send non-sensitive data to the client
      // Tokens are stored in Redis via JWT encode/decode, NOT sent to browser
      if (token) {
        session.error = token.error as string | undefined;

        const roles: string[] = (token.roles as string[] | undefined) ?? [];

        session.user = {
          ...session.user,
          id: token.sub || '',
          roles,
        };
        // Store idToken in session for logout
        session.idToken = token.idToken as string | undefined;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // Events
  events: {
    async signOut({ token }) {
      // Clean up Redis session on logout
      if (isRedisEnabled && token?.sub) {
        try {
          const redis = await getRedisClient();
          if (redis) {
            await redis.del(`auth:session:${token.sub}`);
            console.log('[Auth] Session removed from Redis');
          }
        } catch (error) {
          console.error('[Auth] Failed to remove session from Redis:', error);
        }
      }

      // Logout from Keycloak SSO session
      if (isKeycloakEnabled && token?.idToken) {
        try {
          const logoutUrl = new URL(
            `${config.keycloak.issuer}/protocol/openid-connect/logout`
          );
          logoutUrl.searchParams.set('id_token_hint', token.idToken as string);

          await fetch(logoutUrl.toString());
          console.log('[Auth] Keycloak session ended');
        } catch (error) {
          console.error('[Auth] Failed to end Keycloak session:', error);
        }
      }
    },
  },

  debug: config.isDev,
};
