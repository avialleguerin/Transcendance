import { redisClient } from '../utils/redis.js';

export const redisModel = {
	addToBlacklist: async (token, expiresIn) => {
		await redisClient.set(`blacklist:${token}`, 'true', 'EX', expiresIn);
	},
	isTokenBlacklisted: async (token) => {
		return await redisClient.get(`blacklist:${token}`);
	},
	addToDoubleAuth: async (token) => {
		await redisClient.set(`doubleAuth:${token}`);
	},
	getDoubleAuth: async (token) => {
		return await redisClient.get(`doubleAuth:${token}`);
	},
	removeDoubleAuth: async (token) => {
		return await redisClient.del(`doubleAuth:${token}`);
	},
}