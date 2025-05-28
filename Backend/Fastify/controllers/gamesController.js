import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'
import { getUserFromToken } from './utils.js'

export async function getUserGames(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		const games = gamesModel.getUserGames(user.userId)
		fastify.log.debug("game :", games)
		return reply.send({ success: true, user: user, games: games, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function create1v1Game(request, reply) {
	const { user1, user2, score_left, score_right } = request.body
	fastify.log.debug("score_left :", score_left)
	fastify.log.debug("score_right :", score_right)

	try {
		if (!user1 || !user2 || !score_left || !score_right)
			return reply.code(400).send({ success: false, error: "Missing parameters", accessToken: infos.accessToken })
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		const user1_id = usersModel.getUserByUsername(user1).userId
		const user2_id = usersModel.getUserByUsername(user2).userId
		gamesModel.create1v1Game(user1_id, user2_id, score_left, score_right)

		return reply.code(201).send({ 
			success: true,
			message: "Game finished successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		fastify.log.error("Error finishing game :", err)
		return reply.code(500).send({ error: err.message })
	}
}
