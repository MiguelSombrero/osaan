import Redis from 'ioredis';

const enabled = process.env.REDIS_ENABLED === 'true';

let redis = null;
if (enabled) {
  const host = process.env.REDIS_HOST || 'localhost';
  const port = process.env.REDIS_PORT || 6379;
  const password = process.env.REDIS_PASSWORD || null;

  const options = {
    host,
    port,
    password,
    // tls: { rejectUnauthorized: false } // jos käytät TLS:ää
  };

  redis = new Redis(options);

  redis.on('connect', () => console.log('[Redis] connected'));
  redis.on('error', (err) => console.error('[Redis] error', err));
}

export { redis, enabled as redisEnabled };