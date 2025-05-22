import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'
import friendshipsModel from '../models/friendshipsModel.js'

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
		const info = usersModel.delete(userId)
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
		const info = gamesModel.deleteGame(gameId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "Game not found" })
		return reply.send({ success: true, message: "Game deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAllFriendships(request, reply) {
	try {
		const friendships = friendshipsModel.getAllFriendships()
		return friendships
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function addFriendship(request, reply) {
	const { user_username, friend_username } = request.body
	
	try {
		const user = usersModel.getUserByUsername(user_username)
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		const friend = usersModel.getUserByUsername(friend_username)
		if (!friend)
			return reply.code(404).send({ success: false, error: `User '${friend_username}' not found` })

		const status = friendshipsModel.checkFriendshipStatus(user.userId, friend.userId);
		console.log("status :", status.requestSent || status.requestReceived)
		if (status.requestSent || status.requestReceived) {
			return reply.code(400).send({ 
				success: false,
				error: "Friendship already exists",
			});
		}

		friendshipsModel.createFriendship(user.userId, friend.userId);

		return reply.code(201).send({ 
			success: true,
			message: "Friendship created successfully",
		})
	} catch (err) {
		console.error("Error creating friendship:", err)
		return reply.code(500).send({ error: "Internal server error" })
	}
}

export async function deleteFriendship(request, reply) {
	const { friendshipId } = request.body
	try {
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship)
			return reply.code(404).send({ error: 'Friendship not found' })
		console.log("friendshipId :", friendshipId)
		console.log("userId :", friendship.userId)
		console.log("friendId :", friendship.friendId)
		const info = friendshipsModel.deleteFriendship(friendship.userId, friendship.friendId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "Friendship not found" })
		return reply.send({ success: true, message: "Friendship deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}