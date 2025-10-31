import Redis from 'ioredis';
import { appConfig } from './env.js';

const { redis: redisConfig } = appConfig;

let redis = null;
if (redisConfig.enabled) {
  redis = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
  });

  redis.on('connect', () => console.log('[Redis] connected'));
  redis.on('error', (err) => console.error('[Redis] error', err));
}

export { redis };
export const redisEnabled = redisConfig.enabled;
