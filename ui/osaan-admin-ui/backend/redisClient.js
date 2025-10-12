import Redis from 'ioredis';

const enabled = process.env.REDIS_ENABLED === 'true';

let redis = null;
if (enabled) {
  redis = new Redis(process.env.REDIS_URL);
  redis.on('connect', () => console.log('[Redis] connected'));
  redis.on('error', (err) => console.error('[Redis] error', err));
}

export { redis, enabled as redisEnabled };