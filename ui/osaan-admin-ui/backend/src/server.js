import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middleware/cors.js';
import { setupAuth, authMiddleware } from './middleware/auth.js';
import adminSkills from './routes/adminSkills.js';
import { appConfig } from './config/env.js';
import { tokenMiddleware } from './middleware/token.js';
import { register } from './metrics.js';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());

setupAuth(app);

app.get('/api/login', (_req, res) => {
  if (!appConfig.keycloak.enabled) {
    return res.status(404).json({ error: 'Login disabled' });
  }
  return res.oidc?.login({ returnTo: appConfig.loginRedirectUrl });
});

app.get('/api/logout', (_req, res) => {
  if (!appConfig.keycloak.enabled) {
    return res.status(200).json({ message: 'Logout noop (auth disabled)' });
  }
  return res.oidc?.logout({ returnTo: appConfig.logoutRedirectUrl });
});

app.get('/api/user', (req, res) => {
  if (!appConfig.keycloak.enabled) {
    return res.status(200).json({ authenticated: false, user: null, authDisabled: true });
  }

  const isAuth = req.oidc?.isAuthenticated?.() || false;
  if (!isAuth) return res.status(200).json({ authenticated: false });
  res.json({ authenticated: true, user: req.oidc?.user || null });
});

app.use('/api', authMiddleware, tokenMiddleware, adminSkills);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
  } catch (err) {
    console.error('[Metrics error]', err);
    res.status(500).end();
  }
});

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
