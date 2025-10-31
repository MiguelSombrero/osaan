import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { appConfig } from './env.js';
import { redis, redisEnabled } from './redis.js';

function resolveCookieOptions() {
  return {
    httpOnly: true,
    secure: appConfig.session.cookieSecure,
    sameSite: 'Lax',
  };
}

export function createSession() {
  const cookie = resolveCookieOptions();

  const secret = appConfig.session.secret || 'dev-secret';

  if (redisEnabled && redis) {
    console.log('[Session] Redis store enabled (secure cookie:', cookie.secure, ')');

    return session({
      store: new RedisStore({
        client: redis,
        prefix: 'osaan:',
      }),
      secret,
      resave: false,
      saveUninitialized: false,
      cookie,
    });
  }

  console.warn('[Session] Using in-memory session store (development only!)');
  return session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie,
  });
}
