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

export async function createGame(request, reply) {
	const { user1, user2 } = request.body
	
	try {
		const user1Exists = usersModel.getUserByUsername(user1)
		const user2Exists = usersModel.getUserByUsername(user2)

		if (!user1Exists)
			return reply.code(404).send({ success: false, error: `User '${user1}' not found` })

		if (!user2Exists)
			return reply.code(404).send({ success: false, error: `User '${user2}' not found` })

		if (user1 === user2)
			return reply.code(400).send({ success: false, error: "Cannot create a game with the same user twice" })
		console.log("user1 :", user1Exists.userId)
		console.log("user2 :", user2Exists.userId)
		gamesModel.createGame(user1Exists.userId, user2Exists.userId)
			
		return reply.code(201).send({ 
			success: true,
			message: "Game created successfully",
		})
	} catch (err) {
		console.error("Error creating game:", err)
		return reply.code(500).send({ error: "Internal server error" })
	}
}
