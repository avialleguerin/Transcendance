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
		console.log("game :", games)
		return reply.send({ success: true, games: games, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function finishGame(request, reply) {
	const { user1, user2, score_user1, score_user2, winner } = request.body
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		if (!score_user1 || !score_user2 || !winner)
			return reply.code(400).send({ success: false, error: "Missing parameters", accessToken: infos.accessToken })
		user1_id = usersModel.getUserByUsername(user1).userId
		user2_id = usersModel.getUserByUsername(user2).userId
		gamesModel.finishGame(user1_id, user2_id, score_user1, score_user2, winner)

		return reply.code(201).send({ 
			success: true,
			message: "Game finished successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		console.error("Error finishing game:", err)
		return reply.code(500).send({ error: err.message })
	}
}
