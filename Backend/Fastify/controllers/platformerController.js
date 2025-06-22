import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import platformersModel from '../models/platformersModel.js'
import { getUserFromToken, sanitizeInput } from './utils.js'

export async function getUserPlatformer(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })
		
		let user = infos.user
		if (!user) return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })
		
		const platformers = platformersModel.getUserPlatformer(user.userId)
		return reply.send({ success: true, user: user, platformers: platformers, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}

export async function createPlatformer(request, reply) {
	const { player1, player2, score_player1, score_player2 } = request.body
	if (!sanitizeInput(player1, 'username').success || !sanitizeInput(player2, 'username').success ||
		!sanitizeInput(score_player1, 'score').success || !sanitizeInput(score_player2, 'score').success)
			return reply.code(400).send({ error: "Invalid input" })
	if (!player1 || !player2 || score_player1 === undefined || score_player2 === undefined) return reply.code(400).send({ success: false, error: "Missing parameters" })
	if (typeof player1 !== 'string' || typeof player2 !== 'string') return reply.code(400).send({ success: false, error: "Player names must be strings" })
	if (player1.trim() === '' || player2.trim() === '') return reply.code(400).send({ success: false, error: "Player names cannot be empty" })
	if (player1 === player2) return reply.code(400).send({ success: false, error: "Cannot create a platformer with the same player" })

	const score1 = parseInt(score_player1, 10)
	const score2 = parseInt(score_player2, 10)
	if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) return reply.code(400).send({ success: false, error: "Scores must be valid positive numbers" })
	
	try {
		const infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })

		const user = infos.user
		if (!user) return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })
		if (user.username !== player1) return reply.code(403).send({ success: false, error: "You can only create games for yourself", accessToken: infos.accessToken })

		const user2 = usersModel.getUserByUsername(player2)
		if (!user2 || user2.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${player2}' not found`, accessToken: infos.accessToken })

		platformersModel.createPlatformer(user.userId, user2.userId, score1, score2)

		return reply.code(201).send({ success: true, username: user.username, message: "Platformer finished successfully", accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}
