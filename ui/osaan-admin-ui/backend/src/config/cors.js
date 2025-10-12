import cors from 'cors';

export function corsMiddleware() {
  if (process.env.CORS_ENABLED === 'true') {
    console.log('[CORS] Enabled for', process.env.CORS_ORIGIN);
    return cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true
    });
  } else {
    console.log('[CORS] Disabled (handled by proxy)');
    return (req, res, next) => next();
  }
}
