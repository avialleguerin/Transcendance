import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import platformersModel from '../models/platformersModel.js'
import { getUserFromToken } from './utils.js'

export async function getUserPlatformer(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Platformer access denied: Unauthorized request')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		let user = infos.user
		if (!user) {
			fastify.log.warn('Platformer access denied: User not found in token')
			return reply.code(401).send({ error: "User not found" })
		}
		if (!infos.accessToken) {
			fastify.log.warn('Platformer access denied: Missing access token')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const platformer = platformersModel.getUserPlatformer(user.userId)
		fastify.log.info(`Platformer games retrieved for user: ${user.username} (${platformer.length} found)`)
		return reply.send({ success: true, user: user, games: platformer, accessToken: infos.accessToken })
	} catch (err) {
		fastify.log.error(`Error retrieving user platformer games: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function createPlatformer(request, reply) {
	const { player1, player2, score_player1, score_player2 } = request.body

	try {
		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Platformer creation denied: Unauthorized request')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const user = infos.user
		if (!user) {
			fastify.log.warn('Platformer creation failed: User not found in token')
			return reply.code(401).send({ error: "User not found" })
		}
		if (!infos.accessToken) {
			fastify.log.warn('Platformer creation denied: Missing access token')
			return reply.code(401).send({ error: "Unauthorized" })
		}

		if (!player1 || !player2 || score_player1 === undefined || score_player2 === undefined) {
			fastify.log.warn('Platformer creation failed: Missing parameters')
			return reply.code(400).send({ success: false, error: "Missing parameters", accessToken: infos.accessToken })
		}

		const user2 = usersModel.getUserByUsername(player2)
		if (!user2) {
			fastify.log.warn(`Platformer creation failed: Player2 '${player2}' not found`)
			return reply.code(404).send({ success: false, error: `Player '${player2}' not found`, accessToken: infos.accessToken })
		}

		fastify.log.info(`Creating platformer game: ${player1} (${score_player1}) vs ${player2} (${score_player2})`)
		platformersModel.createPlatformer(user.userId, user2.userId, score_player1, score_player2)

		fastify.log.info(`Platformer game created successfully: ${player1} vs ${player2}`)
		return reply.code(201).send({ 
			success: true,
			username: user.username,
			message: "Platformer finished successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		fastify.log.error(`Error creating platformer game: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}
