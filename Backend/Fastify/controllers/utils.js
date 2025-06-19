import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import { redisModel } from '../models/redisModel.js'


async function getUserIdFromToken(token) {
	let decoded;
	if (!token || token === undefined || token === null) {
		console.debug('Token validation failed: No token provided')
		return null
	}
	try {
		decoded = fastify.jwt.verify(token);
	} catch (err) {
		console.warn(`Invalid token signature: ${err.message}`);
		return null;
	}
	const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
	if (expiresIn <= 0) {
		console.warn(`Token expired for user: ${decoded.userId}`)
		return null;
	}
	if (await redisModel.isTokenBlacklisted(token)) {
		console.warn(`Blacklisted token used by user: ${decoded.userId}`)
		return null;
	}
	return decoded.userId;
}

export async function getUserFromToken(request) {
	try {
		const accessToken = request.headers.authorization?.split(' ')[1] || request.query.token
		let createNewAccessToken = false;

		if (!accessToken || accessToken === undefined || accessToken === null) {
			console.debug('No access token provided, checking refresh token')
			createNewAccessToken = true;
		} else {
			const userId = await getUserIdFromToken(accessToken);
			if (!userId) {
				console.debug('Invalid access token, attempting refresh')
				createNewAccessToken = true;
			} else {
				const user = usersModel.getUserById(userId);
				if (!user) {
					console.warn(`User not found for valid token: ${userId}`)
					return null;
				}
				usersModel.updateLastActivity(user.userId)
				console.debug(`Valid access token for user: ${user.username}`)
				return { user: user, accessToken: accessToken };
			}
		}
		
		if (createNewAccessToken) {
			const refreshToken = request.cookies.refreshToken
			const userId = await getUserIdFromToken(refreshToken);
			if (!userId) {
				console.debug('Invalid refresh token, authentication required')
				return null;
			}
			const user = usersModel.getUserById(userId);
			if (!user) {
				console.warn(`User not found for valid refresh token: ${userId}`)
				return null;
			}
			usersModel.updateLastActivity(user.userId)
			const newAccessToken = fastify.jwt.sign({ userId: userId, username: user.username }, { expiresIn: '15m' })
			console.info(`New access token generated for user: ${user.username}`)
			return { user: user, accessToken: newAccessToken };
		}
	} catch (err) {
		console.error(`Critical error in token validation: ${err.message}`);
		return null;
	}
}

export async function refreshInfos(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).clearCookie("refreshToken").send({ success: false, error: `infos: ${infos}`, message: 'User is not logged', function: 'refreshInfos' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user) {
			console.warn('Info refresh failed: User not found in token')
			return reply.code(401).send({ success: false, error: 'User not found' })
		}
		
		if (!user.doubleAuth_status && user.doubleAuth_secret) {
			console.info(`Cleaning unused 2FA secret for user: ${user.username}`)
			usersModel.updateDoubleAuth_secret(user.userId, null)
		}
		
		console.info(`User info refreshed for: ${user.username}`)
		return reply.code(200).send({ 
			success: true, 
			user: user, 
			deleted_account: user.deleted_at, 
			accessToken: accessToken, 
			message: 'User infos refreshed' 
		})
	} catch (err) {
		console.error(`Error refreshing user info: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export function validateAuth(infos, reply) {
	if (!infos || !infos.accessToken) {
		console.warn('Authentication validation failed: Missing credentials')
		reply.code(401).send({ success: false, error: "Unauthorized" });
		return false;
	}
	if (!infos.user) {
		console.warn('Authentication validation failed: User not found')
		reply.code(401).send({ success: false, error: "User not found", accessToken: infos.accessToken });
		return false;
	}
	return true;
}

export function validateRequestBody(body, requiredFields, reply, accessToken = null) {
	if (!body || typeof body !== 'object') {
		console.warn('Request validation failed: Invalid body format')
		reply.code(400).send({ success: false, error: "Invalid request body", accessToken });
		return false;
	}

	for (const field of requiredFields) {
		if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
			console.warn(`Request validation failed: Missing field '${field}'`)
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
	console.error(`Controller error in ${context}: ${err.message}`);
	return reply.code(500).send({ 
		success: false, 
		error: "Internal server error", 
		accessToken
	});
}