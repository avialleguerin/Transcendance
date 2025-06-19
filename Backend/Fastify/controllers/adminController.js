import { fastify, log } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'
import platformersModel from '../models/platformersModel.js'
import friendshipsModel from '../models/friendshipsModel.js'
import fs from 'fs/promises'
import path from 'path'

const uploadDir = '/usr/share/nginx/uploads'

export async function getAllUsers(request, reply) {
	try {
		return usersModel.getActiveUsers()
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function getDeletedUsers(request, reply) {
	try {
		const anonymizedUsers = usersModel.getDeletedUsers()
		return reply.code(200).send({ success: true, users: anonymizedUsers })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function deleteUser(request, reply) {
	const { userId } = request.body
	
	try {
		const user = usersModel.getUserById(userId)
		if (!user) return reply.code(404).send({ error: 'User not found' })

		const oldProfilePicture = user.profile_picture;
		if (oldProfilePicture !== "default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture);
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false);
				
				if (fileExists) await fs.unlink(oldFilePath);
			} catch (deleteErr) {}
		}

		const info = usersModel.anonymizeUser(userId)
		if (info.changes === 0) return reply.code(404).send({ error: "User not found" })
		
		return reply.send({ success: true, message: "User anonymized successfully"})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function forceDeleteUser(request, reply) {
	const { userId } = request.body

	try {
		const user = usersModel.getUserById(userId)
		if (!user) return reply.code(404).send({ error: 'User not found' })

		const oldProfilePicture = user.profile_picture;
		if (oldProfilePicture !== "default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture);
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false);
				
				if (fileExists) await fs.unlink(oldFilePath);

			} catch (deleteErr) {}
		}

		const info = usersModel.forceDeleteUser(userId)
		if (info.changes === 0) return reply.code(404).send({ error: "User not found" })

		return reply.send({ success: true, message: "User permanently deleted"})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAllGames(request, reply) {
	try {
		return gamesModel.getAllGames()
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function addGame(request, reply) {
	const { name1, name2, name3, name4 } = request.body
	
	try {
		const user1 = usersModel.getUserByName(name1)
		const user2 = usersModel.getUserByName(name2)
		
		if (!user1) return reply.code(404).send({ success: false, error: `User '${name1}' not found` })
		if (!user2) return reply.code(404).send({ success: false, error: `User '${name2}' not found` })
		if (name1 === name2) return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
		
		if (name3 || name4) {
			const user3 = name3 ? usersModel.getUserByName(name3) : null
			const user4 = name4 ? usersModel.getUserByName(name4) : null
			
			if (name3 && !user3) return reply.code(404).send({ success: false, error: `User '${name3}' not found` })
			if (name4 && !user4) return reply.code(404).send({ success: false, error: `User '${name4}' not found` })
			if (name3 && (name1 === name3 || name2 === name3)) return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
			if (name4 && (name1 === name4 || name2 === name4 || name3 === name4)) return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
			
			if (user3 && user4) gamesModel.create2v2Game(user1.userId, user2.userId, user3.userId, user4.userId, 0, 0)
			else return reply.code(400).send({ success: false, error: "User 3 and user 4 are required for a 2v2 game" })
		} else gamesModel.createGame(user1.userId, user2.userId)
			
		return reply.code(201).send({ success: true, message: "Game created successfully" })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error" })
	}
}

export async function deleteGame(request, reply) {
	const { gameId } = request.body

	try {
		const game = gamesModel.getgameById(gameId)
		if (!game) return reply.code(404).send({ error: 'Game not found' })

		const info = gamesModel.deleteGame(gameId)
		if (info.changes === 0) return reply.code(404).send({ error: "Game not found" })

		return reply.send({ success: true, message: "Game deleted successfully"})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAllFriendships(request, reply) {
	try {
		return friendshipsModel.getAllFriendships()
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function addFriendship(request, reply) {
	const { user_name, friend_name } = request.body
	
	try {
		const user = usersModel.getUserByName(user_name)
		if (!user) return reply.code(401).send({ error: "User not found" })
		
		const friend = usersModel.getUserByName(friend_name)
		if (!friend) return reply.code(404).send({ success: false, error: `User '${friend_name}' not found` })

		const status = friendshipsModel.checkFriendshipStatus(user.userId, friend.userId);
		if (status.requestSent || status.requestReceived) return reply.code(400).send({ success: false, error: "Friendship already exists" });

		friendshipsModel.createFriendship(user.userId, friend.userId);

		return reply.code(201).send({ success: true, message: "Friendship created successfully" })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error" })
	}
}

export async function deleteFriendship(request, reply) {
	const { friendshipId } = request.body
	
	try {
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship) return reply.code(404).send({ error: 'Friendship not found' })
		
		const info = friendshipsModel.deleteFriendship(friendship.userId, friendship.friendId)
		if (info.changes === 0) return reply.code(404).send({ error: "Friendship not found" })
		
		return reply.send({ success: true, message: "Friendship deleted successfully"})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAllPlatformers(request, reply) {
	try {
		return platformersModel.getAllPlatformers()
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function addPlatformer(request, reply) {
	const { name1, name2, score1, score2 } = request.body

	try {
		if (!name1 || !name2 || score1 === undefined || score2 === undefined) return reply.code(400).send({ success: false, error: "Missing parameters" })
		
		const player1 = usersModel.getUserByName(name1)
		const player2 = usersModel.getUserByName(name2)
		
		if (!player1) return reply.code(404).send({ success: false, error: `User '${name1}' not found` })
		
		if (!player2) return reply.code(404).send({ success: false, error: `User '${name2}' not found` })
		
		if (player1.userId === player2.userId) return reply.code(400).send({ success: false, error: "Cannot create a platformer with the same user" })
		
		platformersModel.createPlatformer(player1.userId, player2.userId, score1, score2)

		return reply.code(201).send({ success: true, message: "Platformer finished successfully" })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function deletePlatformer(request, reply) {
	const { platformerId } = request.body
	
	try {
		const platformer = platformersModel.getPlatformerById(platformerId)
		if (!platformer) return reply.code(404).send({ error: 'Platformer not found' })
		
		const info = platformersModel.deletePlatformer(platformerId)
		if (info.changes === 0) return reply.code(404).send({ error: "Platformer not found" })
		
		return reply.send({ success: true, message: "Platformer deleted successfully"})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}