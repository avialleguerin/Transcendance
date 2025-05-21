import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'

export async function getAllUsers(request, reply) {
	try {
		const users = usersModel.getAllUsers()
		return users
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function deleteUser(request, reply) {
	const { userId } = request.body
	try {
		const user = usersModel.getUserById(userId)
		console.log("user :", user)
		if (!user)
			return reply.code(404).send({ error: 'User not found' })
		const oldProfilePicture = user.profile_picture;
		if (oldProfilePicture !== "default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture);
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false);
				
				if (fileExists) {
					console.log(`🗑️ deleting old profile picture: ${oldFilePath}`);
					await fs.unlink(oldFilePath);
				} else {
					console.log(`⚠️ Old profile picture doesn't exist: ${oldFilePath}`);
				}
			} catch (deleteErr) {
				console.error(`❌ Error deleting old profile picture: ${deleteErr.message}`);
			}
		}
		const info = usersModel.delete(user.userId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" })
		return reply.send({ success: true, message: "User deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAllGames(request, reply) {
	try {
		const games = gamesModel.getAllGames()
		return games
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function deleteGame(request, reply) {
	const { gameId } = request.body
	try {
		const game = gamesModel.getgameById(gameId)
		if (!game)
			return reply.code(404).send({ error: 'Game not found' })
		const info = gamesModel.delete(game.gameId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "Game not found" })
		return reply.send({ success: true, message: "Game deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}