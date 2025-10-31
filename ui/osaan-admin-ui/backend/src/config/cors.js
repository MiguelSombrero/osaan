import cors from 'cors';
import { appConfig } from './env.js';

export function corsMiddleware() {
  if (!appConfig.cors.enabled) {
    console.log('[CORS] Disabled (handled by proxy)');
    return (_req, _res, next) => next();
  }

  console.log('[CORS] Enabled for', appConfig.cors.origin);
  return cors({
    origin: appConfig.cors.origin,
    credentials: true,
  });
}
