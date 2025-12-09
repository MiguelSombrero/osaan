import { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { config, isKeycloakEnabled, isRedisEnabled } from './config';
import { getRedisClient } from './redis';

/**
 * Custom Redis adapter for NextAuth
 * Stores sessions in Redis instead of in-memory
 */
async function createRedisAdapter() {
  const redis = await getRedisClient();

  if (!redis) {
    console.warn('[Auth] Redis adapter disabled, using default adapter');
    return undefined;
  }

  return {
    async createSession(session: any) {
      const key = `session:${session.sessionToken}`;
      await redis.setEx(key, 30 * 24 * 60 * 60, JSON.stringify(session)); // 30 days
      return session;
    },
    async getSessionAndUser(sessionToken: string) {
      const key = `session:${sessionToken}`;
      const sessionData = await redis.get(key);

      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      return { session, user: session.user };
    },
    async updateSession(session: any) {
      const key = `session:${session.sessionToken}`;
      await redis.setEx(key, 30 * 24 * 60 * 60, JSON.stringify(session));
      return session;
    },
    async deleteSession(sessionToken: string) {
      const key = `session:${sessionToken}`;
      await redis.del(key);
    },
    async createUser(user: any) {
      return user;
    },
    async getUser(id: string) {
      return null;
    },
    async getUserByEmail(email: string) {
      return null;
    },
    async getUserByAccount(provider: string, providerAccountId: string) {
      return null;
    },
    async updateUser(user: any) {
      return user;
    },
    async deleteUser(userId: string) {
      return;
    },
    async linkAccount(account: any) {
      return account;
    },
    async unlinkAccount(provider: string, providerAccountId: string) {
      return;
    },
  };
}

/**
 * NextAuth configuration
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
          const sessionKey = `auth:${token.sub}:${Date.now()}`;
          await redis.setEx(
            sessionKey,
            24 * 60 * 60,
            JSON.stringify({
              accessToken: token.accessToken,
              refreshToken: token.refreshToken,
              idToken: token.idToken,
              expiresAt: token.expiresAt,
            })
          );
          const sessionOnlyToken = {
            sub: token.sub,
            sessionKey,
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
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }

      if (profile) {
        token.profile = profile;
      }

      return token;
    },

    async session({ session, token }) {
      // Only send non-sensitive data to the client
      if (token) {
        session.error = token.error as string | undefined;
        session.user = {
          ...session.user,
          id: token.sub || '',
        };
      }

      // Tokens are stored in Redis, NOT sent to browser
      // The sessionKey reference is in the JWT cookie (httpOnly)
      if (isRedisEnabled) {
        try {
          const redis = await getRedisClient();
          if (redis && token.sessionKey) {
            const sessionKey = `session:${token.sub}`;
            await redis.setEx(
              sessionKey,
              30 * 24 * 60 * 60,
              JSON.stringify({
                ...session,
                userId: token.sub,
                expiresAt: token.expiresAt,
              })
            );
          }
        } catch (error) {
          console.error('[Auth] Failed to store session in Redis:', error);
        }
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
            await redis.del(`session:${token.sub}`);
            console.log('[Auth] Session removed from Redis');
          }
        } catch (error) {
          console.error('[Auth] Failed to remove session from Redis:', error);
        }
      }
    },
  },

  debug: config.isDev,
};
