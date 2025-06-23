import { fastify, log } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'
import platformersModel from '../models/platformersModel.js'
import friendshipsModel from '../models/friendshipsModel.js'
import { generateRandomString } from './utils.js'
import fs from 'fs/promises'
import path from 'path'
import { sanitizeInput } from './utils.js'

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
		if (oldProfilePicture !== "/assets/image/default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture);
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false);
				
				if (fileExists) await fs.unlink(oldFilePath);
			} catch (deleteErr) {}
		}

		const anonymizedUsername = generateRandomString(9)
		const anonymizedPassword = generateRandomString(9)
		const defaultProfilePicture = '/assets/image/default-profile-picture.png'
		usersModel.updateUsername(userId, anonymizedUsername)
		const info = usersModel.anonymizeUserData(userId, anonymizedPassword, defaultProfilePicture)
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
		if (oldProfilePicture !== "/assets/image/default-profile-picture.png") {
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
	const { user1, user2, user3, user4 } = request.body
	if (!sanitizeInput(user1, 'username').success || !sanitizeInput(user2, 'username').success ||
		(user3 && !sanitizeInput(user3, 'username').success) || (user4 && !sanitizeInput(user4, 'username').success))
		return reply.code(400).send({ error: "Invalid input" })
	
	try {
		const user1Exists = usersModel.getUserByUsername(user1) 
		const user2Exists = usersModel.getUserByUsername(user2)

		if (usersModel.getDelByUsername(user1).length > 0 || usersModel.getDelByUsername(user2).length > 0
			|| (user3 && usersModel.getDelByUsername(user3).length > 0) || (user4 && usersModel.getDelByUsername(user4).length > 0))
			return reply.code(400).send({ success: false, error: "Cannot create a game with a deleted user" })
		
		if (!user1Exists) return sendResponse(reply, 404, `User '${user1}' not found`)
		if (!user2Exists) return sendResponse(reply, 404, `User '${user2}' not found`)
		if (user1 === user2) return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
		
		if (user3 || user4) {
			const user3Exists = user3 ? usersModel.getUserByUsername(user3) : null
			const user4Exists = user4 ? usersModel.getUserByUsername(user4) : null
			
			if (user3 && !user3Exists) return reply.code(404).send({ success: false, error: `User '${user3}' not found` })
			if (user4 && !user4Exists) return reply.code(404).send({ success: false, error: `User '${user4}' not found` })
			if (user3 && (user1 === user3 || user2 === user3)) return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
			if (user4 && (user1 === user4 || user2 === user4 || user3 === user4)) return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
			
			if (user3Exists && user4Exists) gamesModel.create2v2Game(user1Exists.userId, user2Exists.userId, user3Exists.userId, user4Exists.userId, 0, 0)
			else return reply.code(400).send({ success: false, error: "Both user3 and user4 are required for a 2v2 game" })
		} else gamesModel.createGame(user1Exists.userId, user2Exists.userId)
			
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
	const { user_username, friend_username } = request.body
	if (!sanitizeInput(user_username, 'username').success || !sanitizeInput(friend_username, 'username').success)
		return reply.code(400).send({ error: "Invalid input" })
	try {
		if (usersModel.getDelByUsername(user_username).length > 0 || usersModel.getDelByUsername(friend_username).length > 0) return reply.code(400).send({ success: false, error: "Cannot create a friendship with a deleted user" })
		const user = usersModel.getUserByUsername(user_username)
		if (!user) return reply.code(401).send({ error: "User not found" })
		const friend = usersModel.getUserByUsername(friend_username)
		if (!friend) return reply.code(404).send({ success: false, error: `User '${friend_username}' not found` })
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
	const { username1, username2, score_player1, score_player2 } = request.body
	if (!username1 || !username2 || score_player1 === undefined || score_player2 === undefined) return reply.code(400).send({ success: false, error: "Missing parameters" })
	if (!sanitizeInput(username1, 'username').success || !sanitizeInput(username2, 'username').success
		|| !sanitizeInput(score_player1, 'score').success || !sanitizeInput(score_player2, 'score').success)
		return reply.code(400).send({ error: "Invalid input" })
	try {
		if (usersModel.getDelByUsername(username1).length > 0 || usersModel.getDelByUsername(username2).length > 0) return reply.code(400).send({ success: false, error: "Cannot create a game with a deleted user" })
		const player1 = usersModel.getUserByUsername(username1)
		const player2 = usersModel.getUserByUsername(username2)
		if (!player1) return reply.code(404).send({ success: false, error: `User '${username1}' not found` })
		if (!player2) return reply.code(404).send({ success: false, error: `User '${username2}' not found` })
		if (player1.userId === player2.userId) return reply.code(400).send({ success: false, error: "Cannot create a platformer with the same user" })
		
		platformersModel.createPlatformer(player1.userId, player2.userId, score_player1, score_player2)

		return reply.code(201).send({ success: true, message: "Platformer finished successfully" })
	} catch (err) { return reply.code(500).send({ error: err.message }) }
}

export async function deletePlatformer(request, reply) {
	const { platformerId } = request.body
	
	try {
		const platformer = platformersModel.getPlatformerById(platformerId)
		if (!platformer) return reply.code(404).send({ error: 'Platformer not found' })
		
		const info = platformersModel.deletePlatformer(platformerId)
		if (info.changes === 0) return reply.code(404).send({ error: "Platformer not found" })
		
		return reply.send({ success: true, message: "Platformer deleted successfully"})
	} catch (err) { return reply.code(500).send({ error: err.message }) }
}