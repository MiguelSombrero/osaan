import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './config/cors.js';
import { setupAuth } from './middleware/auth.js';
import { createSession } from './config/session.js';
import adminSkills from './routes/adminSkills.js';
import pkg from 'express-openid-connect';
const { requiresAuth } = pkg;

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());
app.use(createSession());

setupAuth(app);

app.get('/api/login', (req, res) =>
  res.oidc.login({ returnTo: process.env.LOGIN_REDIRECT_URL || '/' })
);
app.get('/api/logout', (req, res) =>
  res.oidc.logout({ returnTo: process.env.LOGOUT_REDIRECT_URL || '/' })
);

app.get('/api/user', (req, res) => {
  const isAuth = req.oidc?.isAuthenticated?.() || false;
  if (!isAuth) return res.status(200).json({ authenticated: false });
  res.json({ authenticated: true, user: req.oidc?.user || null });
});

app.use('/api', requiresAuth(), adminSkills);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Error]', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.error_description || err.error || undefined;

  res.status(status).json({
    error: message,
    details,
  });
});
