import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import friendshipsModel from '../models/friendshipsModel.js'
import { getUserFromToken } from './utils.js'

export async function getUserFriendships(request, reply) {
	try {
		const infos = getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		console.log("user :", user)
		console.log("accessToken :", infos.accessToken)
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		const friendships = friendshipsModel.getUserFriendships(user.userId)
		return reply.send({ succes: true, friendships: friendships, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message, accessToken: infos.accessToken })
	}
}

export async function createFriendship(request, reply) {
	const { friend } = request.body
	
	try {
		console.log("friend :", friend)
		const infos = getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		console.log("user :", user)
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		const friendExists = usersModel.getUserByUsername(friend)
		if (!friendExists)
			return reply.code(404).send({ succes: false, error: `User '${friend}' not found`, accessToken: infos.accessToken })

		friendshipsModel.createFriendship(user.userId, friendExists.userId);

		return reply.code(201).send({ 
			success: true,
			message: "Friendship created successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		console.error("Error creating friendship:", err)
		return reply.code(500).send({ error: "Internal server error" })
	}
}
