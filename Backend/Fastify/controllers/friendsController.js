import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'

export async function getAllFriends(request, reply) {
	try {
		const games = gamesModel.getAllGames()
		return games
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function addFriend(request, reply) {
	const { friend } = request.body
	
	try {
		const infos = getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		const friendExists = usersModel.getUserByUsername(friend)
		if (!friendExists)
			return reply.code(404).send({ succes: false, error: `User '${friend}' not found` })

		friendsModel.createFriendship(user.userId, friend.userId);

		return reply.code(201).send({ 
			success: true,
			message: "Friendship created successfully",
		})
	} catch (err) {
		console.error("Error creating game:", err)
		return reply.code(500).send({ error: "Internal server error" })
	}
}
