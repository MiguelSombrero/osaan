import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './config/cors.js';
import { setupAuth } from './middleware/auth.js';
import { createSession } from './config/session.js';
import adminSkills from './routes/adminSkills.js';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());
app.use(createSession());

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
