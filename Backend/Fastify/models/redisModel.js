import { redisClient } from '../utils/redis.js';
import { fastify } from '../server.js'
import jwt from '@fastify/jwt'; // Assuming you have jwt installed

export const redisModel = {

	addToBlacklist: async (token, expiresIn) => {
		await redisClient.set(`blacklist:${token}`, 'true', 'EX', expiresIn);
	},

	isTokenBlacklisted: async (token) => {
		return await redisClient.get(`blacklist:${token}`);
	},

	storeAccessToken: async (userId, sessionId, accessToken, expiresIn) => {
		const redisKey = `access:${userId}:${sessionId}`;
		await redisClient.set(redisKey, accessToken, 'EX', expiresIn);
	},

	isAccessTokenPresent: async (userId, sessionId) => {
		const redisKey = `access:${userId}:${sessionId}`;
		return await redisClient.exists(redisKey);
	},

	deleteAccessToken: async (userId, sessionId) => {
		const redisKey = `access:${userId}:${sessionId}`;
		await redisClient.del(redisKey);
	},

	storeRefreshToken: async (userId, sessionId, refreshToken, expiresIn) => {
		const redisKey = `refresh:${userId}:${sessionId}`;
		await redisClient.set(redisKey, refreshToken, 'EX', expiresIn);
	},

	isRefreshTokenPresent: async (userId, sessionId) => {
		const redisKey = `refresh:${userId}:${sessionId}`;
		return await redisClient.exists(redisKey);
	},

	deleteRefreshToken: async (userId, sessionId) => {
		const redisKey = `refresh:${userId}:${sessionId}`;
		await redisClient.del(redisKey);
	},

	getToken: async (key) => {
		const token = await redisClient.get(key);
		if (!token)
			return null;

		const decoded = fastify.jwt.decode(token);
		if (decoded && decoded.exp && decoded.exp * 1000 < Date.now()) {
			await redisClient.del(key);
			return null;
		}
		return token;
	},

	getRedisAccessToken: async (userId, sessionId) => {
		const redisKey = `access:${userId}:${sessionId}`;
		return await redisModel.getToken(redisKey);
	},

	getRedisRefreshToken: async (userId, sessionId) => {
		const redisKey = `refresh:${userId}:${sessionId}`;
		return await redisModel.getToken(redisKey);
	},

}