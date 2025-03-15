import redis from 'redis';

export const redisClient = redis.createClient({ url: 'redis://redis:6379' });

redisClient.on('connect', () => console.log('✅ Connexion Redis établie'));
redisClient.on('error', (err) => console.error('❌ Erreur Redis :', err));


// import { redisClient } from '../server.js';
// import jwt from '@fastify/jwt'; // Assuming you have jwt installed

// export const redisModel = {

// 	addToBlacklist: async (token, expiresIn) => {
// 		await redisClient.set(`blacklist:${token}`, 'true', 'EX', expiresIn);
// 	},

// 	isTokenBlacklisted: async (token) => {
// 		return await redisClient.get(`blacklist:${token}`);
// 	},

// 	storeAccessToken: async (userId, sessionId, accessToken, expiresIn) => {
// 		const redisKey = `access:${userId}:${sessionId}`;
// 		await redisClient.set(redisKey, accessToken, 'EX', expiresIn);
// 	},

// 	isAccessTokenPresent: async (userId, sessionId) => {
// 		const redisKey = `access:${userId}:${sessionId}`;
// 		return await redisClient.exists(redisKey);
// 	},

// 	deleteAccessToken: async (userId, sessionId) => {
// 		const redisKey = `access:${userId}:${sessionId}`;
// 		await redisClient.del(redisKey);
// 	},

// 	storeRefreshToken: async (userId, sessionId, refreshToken, expiresIn) => {
// 		const redisKey = `refresh:${userId}:${sessionId}`;
// 		await redisClient.set(redisKey, refreshToken, 'EX', expiresIn);
// 	},

// 	isRefreshTokenPresent: async (userId, sessionId) => {
// 		const redisKey = `refresh:${userId}:${sessionId}`;
// 		return await redisClient.exists(redisKey);
// 	},

// 	deleteRefreshToken: async (userId, sessionId) => {
// 		const redisKey = `refresh:${userId}:${sessionId}`;
// 		await redisClient.del(redisKey);
// 	},

// 	getRedisAccessToken: async (userId, sessionId) => {
// 		const redisKey = `access:${userId}:${sessionId}`;
// 		return await getToken(redisKey);
// 	},

// 	getRedisRefreshToken: async (userId, sessionId) => {
// 		const redisKey = `refresh:${userId}:${sessionId}`;
// 		return await getToken(redisKey);
// 	},

// 	getToken: async (key) => {
// 		const token = await redisClient.get(key);
// 		if (!token)
// 			return null;

// 		const decoded = jwt.decode(token);
// 		if (decoded && decoded.exp && decoded.exp * 1000 < Date.now()) {
// 			await redisClient.del(key);
// 			return null;
// 		}
// 		return token;
// 	},

// }


// // // Ajouter un token à la blacklist
// // export const addToBlacklist = async (token, expiresIn) => {
// // 	await redisClient.set(`blacklist:${token}`, 'true', 'EX', expiresIn);
// // };

// // // Vérifier si un token est blacklisté
// // export const isTokenBlacklisted = async (token) => {
// // 	return await redisClient.get(`blacklist:${token}`);
// // };

// // // Stocker un access token dans Redis
// // export const storeAccessToken = async (userId, sessionId, accessToken, expiresIn) => {
// // 	const redisKey = `access:${userId}:${sessionId}`;
// // 	await redisClient.set(redisKey, accessToken, 'EX', expiresIn);
// // };

// // // Vérifier si un access token est présent dans Redis
// // export const isAccessTokenPresent = async (userId, sessionId) => {
// // 	const redisKey = `access:${userId}:${sessionId}`;
// // 	return await redisClient.exists(redisKey);
// // };

// // // Supprimer un access token de Redis
// // export const deleteAccessToken = async (userId, sessionId) => {
// // 	const redisKey = `access:${userId}:${sessionId}`;
// // 	await redisClient.del(redisKey);
// // };

// // // Stocker un refresh token dans Redis
// // export const storeRefreshToken = async (userId, sessionId, refreshToken, expiresIn) => {
// // 	const redisKey = `refresh:${userId}:${sessionId}`;
// // 	await redisClient.set(redisKey, refreshToken, 'EX', expiresIn);
// // };

// // // Vérifier si un refresh token est présent dans Redis
// // export const isRefreshTokenPresent = async (userId, sessionId) => {
// // 	const redisKey = `refresh:${userId}:${sessionId}`;
// // 	return await redisClient.exists(redisKey);
// // };

// // // Supprimer un refresh token de Redis
// // export const deleteRefreshToken = async (userId, sessionId) => {
// // 	const redisKey = `refresh:${userId}:${sessionId}`;
// // 	await redisClient.del(redisKey);
// // };

// // // Fonction pour récupérer un token de Redis en vérifiant son expiration
// // async function getToken(key) {
// // 	const token = await redisClient.get(key);
// // 	if (!token)
// // 		return null;

// // 	const decoded = jwt.decode(token);
// // 	if (decoded && decoded.exp && decoded.exp * 1000 < Date.now()) {
// // 		await redisClient.del(key);
// // 		return null;
// // 	}
// // 	return token;
// // }

// // // Utiliser la fonction getToken pour récupérer les tokens
// // export const getRedisAccessToken = async (userId, sessionId) => {
// //   const redisKey = `access:${userId}:${sessionId}`;
// //   return await getToken(redisKey);
// // };

// // export const getRedisRefreshToken = async (userId, sessionId) => {
// //   const redisKey = `refresh:${userId}:${sessionId}`;
// //   return await getToken(redisKey);
// // };