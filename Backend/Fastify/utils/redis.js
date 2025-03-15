import redis from 'redis';

export const redisClient = redis.createClient({ url: 'redis://redis:6379' });

redisClient.on('connect', () => console.log('✅ Connexion Redis établie'));
redisClient.on('error', (err) => console.error('❌ Erreur Redis :', err));
