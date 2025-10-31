import { createClient } from 'redis';
import { appConfig } from './env.js';

const { redis: redisConfig } = appConfig;

let redis = null;

if (redisConfig.enabled) {
  redis = createClient({
    socket: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
    password: redisConfig.password,
  });

  redis.on('error', (err) => console.error('[Redis] error', err));
  redis.on('connect', () => console.log('[Redis] connected'));

  redis
    .connect()
    .catch((err) => console.error('[Redis] Failed to connect', err));
}

export { redis };
export const redisEnabled = redisConfig.enabled;
