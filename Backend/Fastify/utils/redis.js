import redis from 'redis';

export const redisClient = redis.createClient({ url: 'redis://redis:6379' });

export function setupRedisLogging(log) {
	redisClient.on('connect', () => log.success('Redis connected successfully'));
	redisClient.on('error', (err) => log.error('Error Redis :', err));
	redisClient.on('ready', () => log.trace('Redis ready for commands'));
	redisClient.on('end', () => log.warn('Redis connection closed'));
	redisClient.on('reconnecting', () => log.info('Redis reconnecting...'));
}
