import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { appConfig } from '../config/env.js';
import { redis, redisEnabled } from '../config/redis.js';

export function createSession() {
  const cookie = { httpOnly: true, sameSite: 'Lax', secure: appConfig.session.cookieSecure };
  const secret = appConfig.session.secret || 'dev-secret';

  if (redisEnabled && redis) {
    console.log('[Session] Redis store enabled (secure cookie:', cookie.secure, ')');

    const store = new RedisStore({
      client: redis,
      prefix: 'osaan',
    });

    const sessionMiddleware = session({
      name: 'osaan.sid',
      store,
      secret,
      resave: false,
      saveUninitialized: false,
      cookie,
    });

    return { sessionMiddleware, store, secret, cookie };
  }

  console.warn('[Session] Using in-memory session store (development only!)');

  const sessionMiddleware = session({
    name: 'osaan.sid',
    secret,
    resave: false,
    saveUninitialized: false,
    cookie,
  });

  return { sessionMiddleware, store: null, secret, cookie };
}
