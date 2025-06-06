import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import platformersModel from '../models/platformersModel.js'
import { getUserFromToken } from './utils.js'

export async function getUserPlatformer(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		let user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		const platformer = platformersModel.getUserPlatformer(user.userId)
		console.log("platformer :", platformer)
		return reply.send({ success: true, user: user, games: games, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function createPlatformer(request, reply) {
	const { chrono } = request.body

	try {
		if (!chrono)
			return reply.code(400).send({ success: false, error: "Missing parameters", accessToken: infos.accessToken })
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		platformersModel.createPlatformer(user.userId, chrono)

		return reply.code(201).send({ 
			success: true,
			username: user.username,
			chrono: chrono,
			message: "Platformer finished successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		console.error("Error creating platformer game:", err)
		return reply.code(500).send({ error: err.message })
	}
}
