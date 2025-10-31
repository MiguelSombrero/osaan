import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { redis, redisEnabled } from './redis.js';

function resolveCookieOptions() {
  return {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  };
}

export function createSession() {
  const cookie = resolveCookieOptions();

  if (redisEnabled && redis) {
    console.log('[Session] Redis store enabled (secure cookie:', cookie.secure, ')');

    return session({
      store: new RedisStore({
        client: redis,
        prefix: 'osaan:',
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie,
    });
  }

  console.warn('[Session] Using in-memory session store (development only!)');
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie,
  });
}
