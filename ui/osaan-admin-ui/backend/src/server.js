import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import { register } from './metrics.js';
import { authMiddleware, setupAuth } from './middleware/auth.js';
import { corsMiddleware } from './middleware/cors.js';
import { tokenMiddleware } from './middleware/token.js';
import skillsRoutes from './routes/adminSkills.js';
import loginRoutes from './routes/login.js';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());

setupAuth(app);

app.use('/api', loginRoutes);

app.use('/api', authMiddleware, tokenMiddleware, skillsRoutes);

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
