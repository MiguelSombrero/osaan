import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { redis, redisEnabled } from './redis.js';

export function createSession() {
  if (redisEnabled && redis) {
    console.log('[Session] Redis store enabled');

    return session({
      store: new RedisStore({
        client: redis,
        prefix: 'osaan:',
      }),
      secret: process.env.SESSION_SECRET || 'super-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    });
  }

  console.warn('[Session] Using in-memory session store (development only!)');
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
  });
}
