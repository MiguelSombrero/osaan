import { createClient, RedisClientType } from 'redis';
import { config, isRedisEnabled } from './config';

let redis: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (!isRedisEnabled) {
    console.warn('[Redis] Redis is disabled');
    return null;
  }

  if (redis) {
    return redis;
  }

  try {
    redis = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password,
    });

    redis.on('error', (err: Error) => {
      console.error('[Redis] Client error:', err);
    });

    redis.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    redis.on('disconnect', () => {
      console.warn('[Redis] Disconnected');
    });

    await redis.connect();
    console.log('[Redis] Client initialized');

    return redis;
  } catch (error) {
    console.error('[Redis] Failed to connect:', error);
    redis = null;
    return null;
  }
}

export async function closeRedisClient(): Promise<void> {
  if (redis) {
    try {
      await redis.quit();
      redis = null;
      console.log('[Redis] Connection closed');
    } catch (error) {
      console.error('[Redis] Error closing connection:', error);
    }
  }
}

export function isRedisConnected(): boolean {
  return redis?.isOpen ?? false;
}

export { redis };
