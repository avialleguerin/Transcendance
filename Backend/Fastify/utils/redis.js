import redis from 'redis';

export const redisClient = redis.createClient({ url: 'redis://redis:6379' });

// redisClient.on('connect', () => fastify.log.info('✅ Connexion Redis établie'));
// redisClient.on('error', (err) => fastify.log.error('❌ Erreur Redis :', err));

// Fonction pour configurer les logs Redis avec Fastify
export function setupRedisLogging(fastifyInstance) {
    redisClient.on('connect', () => fastifyInstance.log.info('Connexion Redis établie'));
    redisClient.on('error', (err) => fastifyInstance.log.error('Erreur Redis :', err));
    redisClient.on('ready', () => fastifyInstance.log.trace('Redis prêt à recevoir des commandes'));
    redisClient.on('end', () => fastifyInstance.log.warn('Connexion Redis fermée'));
    redisClient.on('reconnecting', () => fastifyInstance.log.info('Reconnexion Redis en cours...'));
}
