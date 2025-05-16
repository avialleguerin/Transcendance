import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'

export async function getAllGames(request, reply) {
	try {
		const games = gamesModel.getAllGames()
		return games
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function addGame(request, reply) {
	const { user1, user2 } = request.body
	
	try {
		const user1Exists = usersModel.getUserByUsername(user1)
		const user2Exists = usersModel.getUserByUsername(user2)

		if (!user1Exists)
			return reply.code(404).send({ succes: false, error: `User '${user1}' not found` })

		if (!user2Exists)
			return reply.code(404).send({ succes: false, error: `User '${user2}' not found` })

		if (user1 === user2)
			return reply.code(400).send({ succes: false, error: "Cannot create a game with the same user twice" })

		gamesModel.createGame(user1, user2)
			
		return reply.code(201).send({ 
			success: true,
			message: "Game created successfully",
		})
	} catch (err) {
		console.error("Error creating game:", err)
		return reply.code(500).send({ error: "Internal server error" })
	}
}

export async function deleteGame(request, reply) {
	const { gameId } = request.body
	try {
		const game = gamesModel.getgameById(gameId)
		if (!game)
			return reply.code(404).send({ error: '❌ Game not found' })
		const info = gamesModel.delete(game.gameId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "❌ Game not found" })
		return reply.send({ success: true, message: "❌ Game deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}