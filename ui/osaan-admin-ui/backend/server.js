import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import RedisStoreFactory from 'connect-redis';
import { redis, redisEnabled } from './redisClient.js';
import { setupAuth } from './auth.js';
import adminSkills from './routes/adminSkills.js';

export const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

if (redisEnabled && redis) {
  const RedisStore = RedisStoreFactory(session);
  app.use(session({
    store: new RedisStore({ client: redis }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, sameSite: 'lax' }
  }));
  console.log('[Session] Redis store enabled');
} else {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false
  }));
  console.log('[Session] In-memory session (dev only)');
}

setupAuth(app);

app.get('/login', (req, res) => res.oidc?.login?.());
app.get('/logout', (req, res) => res.oidc?.logout?.());
app.get('/api/user', (req, res) => {
  const isAuth = req.oidc?.isAuthenticated?.() || false;
  if (!isAuth) return res.status(200).json({ authenticated: false });
  res.json({ authenticated: true, user: req.oidc?.user || null });
});

app.use('/api', adminSkills);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
