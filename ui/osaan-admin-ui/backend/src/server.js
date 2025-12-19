import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import { register } from './metrics.js';
import { authMiddleware, setupAuth } from './middleware/auth.js';
import { corsMiddleware } from './middleware/cors.js';
import { tokenMiddleware } from './middleware/token.js';
import adminSkillsRoutes from './routes/adminSkills.js';
import skillsRoutes from './routes/skills.js';
import loginRoutes from './routes/login.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());

setupAuth(app);

app.use('/api', loginRoutes);

app.use('/api', authMiddleware, tokenMiddleware, skillsRoutes);

app.use('/api', authMiddleware, tokenMiddleware, adminSkillsRoutes);

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

app.use(errorHandler);
