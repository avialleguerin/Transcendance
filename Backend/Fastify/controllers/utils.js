import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import { redisModel } from '../models/redisModel.js'


async function getUserIdFromToken(token) {
	let decoded;
	if (!token || token === undefined || token === null)
		return null
	try {
		decoded = fastify.jwt.verify(token);
	} catch (err) {
		fastify.log.warn('Invalid token:', err.message);
		return null;
	}
	const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
	if (expiresIn <= 0 || await redisModel.isTokenBlacklisted(token))
		return null;
	return decoded.userId;
}

export async function getUserFromToken(request) {
	try {
		const accessToken = request.headers.authorization?.split(' ')[1] || request.query.token
		let createNewAccessToken = false;

		if (!accessToken || accessToken === undefined || accessToken === null)
			createNewAccessToken = true;
		else
		{
			const userId = await getUserIdFromToken(accessToken);
			if (!userId) {
				fastify.log.warn('Invalid access token or user not found');
				createNewAccessToken = true;
			} else {
				const user = usersModel.getUserById(userId);
				if (!user)
					return null;
				usersModel.updateLastActivity(user.userId)
				return { user: user, accessToken: accessToken };
			}
		}
		if (createNewAccessToken)
		{
			const refreshToken = request.cookies.refreshToken
			const userId = await getUserIdFromToken(refreshToken);
			if (!userId)
			{
				fastify.log.warn('Invalid refresh token or user not found');
				return null;
			}
			const user = usersModel.getUserById(userId);
			if (!user)
				return null;
			usersModel.updateLastActivity(user.userId)
			const newAccessToken = fastify.jwt.sign({ userId: userId, username: user.username }, { expiresIn: '15m' })
			return { user: user, accessToken: newAccessToken };
		}
	} catch (err) {
		fastify.log.error('Error getting user from token:', err);
		return null;
	}
}

export async function refreshInfos(request, reply) {

	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).clearCookie("refreshToken").send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(401).send({ success: false , error: 'User not found' })
		if (!user.doubleAuth_status && user.doubleAuth_secret)
			usersModel.updateDoubleAuth_secret(user.userId, null)
		return reply.code(200).send({ success: true, user: user, deleted_account: user.deleted_at , accessToken: accessToken, message: 'User infos refreshed' }) //REVIEW - Security of envoi du user en entier
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export function validateAuth(infos, reply) {
	if (!infos || !infos.accessToken) {
		reply.code(401).send({ success: false, error: "Unauthorized" });
		return false;
	}
	if (!infos.user) {
		reply.code(401).send({ success: false, error: "User not found", accessToken: infos.accessToken });
		return false;
	}
	return true;
}

export function validateRequestBody(body, requiredFields, reply, accessToken = null) {
	if (!body || typeof body !== 'object') {
		reply.code(400).send({ success: false, error: "Invalid request body", accessToken });
		return false;
	}

	for (const field of requiredFields) {
		if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
			reply.code(400).send({ 
				success: false, 
				error: `${field} is required`, 
				accessToken 
			});
			return false;
		}
	}
	return true;
}

export function handleControllerError(err, reply, accessToken = null, context = '') {
	fastify.log.error(`Error in ${context}:`, err);
	return reply.code(500).send({ 
		success: false, 
		error: "Internal server error", 
		accessToken
	});
}