import redis from 'redis';

export const redisClient = redis.createClient({ url: 'redis://redis:6379' });

export function setupRedisLogging(fastifyInstance) {
    redisClient.on('connect', () => fastifyInstance.log.info('Redis connected successfully'));
    redisClient.on('error', (err) => fastifyInstance.log.error('Error Redis :', err));
    redisClient.on('ready', () => fastifyInstance.log.trace('Redis ready for commands'));
    redisClient.on('end', () => fastifyInstance.log.warn('Redis connection closed'));
    redisClient.on('reconnecting', () => fastifyInstance.log.info('Redis reconnecting...'));
}
