import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'



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
