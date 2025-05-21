import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import { redisModel } from '../models/redisModel.js'

export async function getUserFromToken(request, reply) {
	const accessToken = request.headers.authorization?.split(' ')[1]
	// console.log("🔑 Access Token reçu :", accessToken)
	const { refreshToken } = request.cookies
	// console.log("🔑 Refresh Token reçu :", refreshToken)
	if (!refreshToken || refreshToken === undefined || refreshToken === null)
		return null
	if (await redisModel.isTokenBlacklisted(refreshToken))
		return null

	const decodedRefresh = fastify.jwt.decode(refreshToken)
	const expiresInRefresh = decodedRefresh.exp - Math.floor(Date.now() / 1000)
	const userId = decodedRefresh.userId
	if (!userId)
		return null
	const user = usersModel.getUserById(userId)
	if (!user)
		return null
	console.log("🔑 User :", user)
	console.log("🔑 accessToken :", accessToken)
	console.log("🔑 accessToken :", request.headers.authorization?.split(' ')[1])
	if (expiresInRefresh > 0)
	{
		if (accessToken && accessToken !== "undefined" && accessToken !== "null")
		{
			// console.log("🔑 je passe la :", accessToken)
			const decodedAccess = fastify.jwt.decode(accessToken)
			const expiresInAccess = decodedAccess.exp - Math.floor(Date.now() / 1000)
			if (expiresInAccess > 0 && !await redisModel.isTokenBlacklisted(accessToken))
				return {user: user, accessToken: accessToken}
		}
		const newAccessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '15m' })
		// console.log("🔑 New Access Token :", newAccessToken)
		return {user: user, accessToken: newAccessToken}
	} else {
		reply.clearCookie('refreshToken', { path: '/' })
		return null
	}
}