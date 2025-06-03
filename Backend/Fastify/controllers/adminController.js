import { fastify, log } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'
import platformersModel from '../models/platformersModel.js'
import friendshipsModel from '../models/friendshipsModel.js'
import fs from 'fs/promises'
import path from 'path'

const uploadDir = '/usr/share/nginx/uploads'

export async function getAllUsers(request, reply) {
	// log.debug("getAllUsers called")
	try {
		const users = usersModel.getActiveUsers() // Ne retourner que les utilisateurs actifs
		return users
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAnonymizedUsers(request, reply) {
	try {
		const anonymizedUsers = usersModel.getAnonymizedUsers()
		return reply.code(200).send({ success: true, users: anonymizedUsers })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function deleteUser(request, reply) {
	log.debug("deleteUser called")
	const { userId } = request.body
	log.debug("userId found: " + userId)
	try {
		const user = usersModel.getUserById(userId)
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
					log.debug(`🗑️ deleting old profile picture: ${oldFilePath}`);
					await fs.unlink(oldFilePath);
				} else {
					log.warn(`⚠️ Old profile picture doesn't exist: ${oldFilePath}`);
				}
			} catch (deleteErr) {
				log.error(`❌ Error deleting old profile picture: ${deleteErr.message}`);
			}
		}

		// Anonymiser l'utilisateur au lieu de le supprimer complètement
		// Cela préserve les références dans les parties
		// const info = usersModel.delete(userId)
		const info = usersModel.anonymizeUser(userId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" })
		
		log.info(`🔒 User ${user.username} (ID: ${userId}) has been anonymized`)
		return reply.send({ success: true, message: "User anonymized successfully"}) // was "delete"
	} catch (err) {
		log.error("catch deleteUser: " + err.message)
		return reply.code(500).send({ error: err.message })
	}
}

export async function forceDeleteUser(request, reply) {
	log.debug("forceDeleteUser called")
	const { userId } = request.body
	log.debug("userId found: " + userId)
	try {
		const user = usersModel.getUserById(userId)
		if (!user)
			return reply.code(404).send({ error: 'User not found' })

		// Supprimer la photo de profil si elle existe
		const oldProfilePicture = user.profile_picture;
		if (oldProfilePicture !== "default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture);
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false);
				
				if (fileExists) {
					log.debug(`🗑️ deleting old profile picture: ${oldFilePath}`);
					await fs.unlink(oldFilePath);
				} else {
					log.warn(`⚠️ Old profile picture doesn't exist: ${oldFilePath}`);
				}
			} catch (deleteErr) {
				log.error(`❌ Error deleting old profile picture: ${deleteErr.message}`);
			}
		}

		// Suppression forcée définitive de l'utilisateur
		// ⚠️ ATTENTION: Cela cassera les références dans les parties!
		const info = usersModel.forceDeleteUser(userId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" })
		
		log.warn(`💀 User ${user.username} (ID: ${userId}) has been PERMANENTLY DELETED`)
		return reply.send({ success: true, message: "User permanently deleted"})
	} catch (err) {
		log.error("catch forceDeleteUser: " + err.message)
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

export async function createGame(request, reply) {
	const { user1, user2, user3, user4 } = request.body
	
	try {
		const user1Exists = usersModel.getUserByUsername(user1)
		const user2Exists = usersModel.getUserByUsername(user2)
		
		if (!user1Exists)
			return reply.code(404).send({ success: false, error: `User '${user1}' not found` })

		if (!user2Exists)
			return reply.code(404).send({ success: false, error: `User '${user2}' not found` })

		if (user1 === user2)
			return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
		
		// Vérification pour une partie 2v2
		if (user3 || user4) {
			const user3Exists = user3 ? usersModel.getUserByUsername(user3) : null
			const user4Exists = user4 ? usersModel.getUserByUsername(user4) : null
			
			// Vérifier que les joueurs 3 et 4 existent
			if (user3 && !user3Exists)
				return reply.code(404).send({ success: false, error: `User '${user3}' not found` })
				
			if (user4 && !user4Exists)
				return reply.code(404).send({ success: false, error: `User '${user4}' not found` })
			
			// Vérifier l'unicité de chaque joueur
			if (user3 && (user1 === user3 || user2 === user3))
				return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
				
			if (user4 && (user1 === user4 || user2 === user4 || user3 === user4))
				return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
			
			// Créer une partie 2v2 si les quatre joueurs existent
			if (user3Exists && user4Exists)
				gamesModel.create2v2Game(user1Exists.userId, user2Exists.userId, user3Exists.userId, user4Exists.userId, 0, 0)
			else
				return reply.code(400).send({ success: false, error: "Both user3 and user4 are required for a 2v2 game" })
		} else {
			// Créer une partie 1v1
			gamesModel.createGame(user1Exists.userId, user2Exists.userId)
		}
			
		return reply.code(201).send({ 
			success: true,
			message: "Game created successfully",
		})
	} catch (err) {
		fastify.error.info("Error creating game:", err)
		return reply.code(500).send({ error: "Internal server error" })
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
		log.error(err)
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
		log.debug("status :", status.requestSent || status.requestReceived)
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
		fastify.error.info("Error creating friendship:", err)
		return reply.code(500).send({ error: "Internal server error" })
	}
}

export async function deleteFriendship(request, reply) {
	const { friendshipId } = request.body
	try {
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship)
			return reply.code(404).send({ error: 'Friendship not found' })
		log.debug("friendshipId :", friendshipId)
		log.debug("userId :", friendship.userId)
		log.debug("friendId :", friendship.friendId)
		const info = friendshipsModel.deleteFriendship(friendship.userId, friendship.friendId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "Friendship not found" })
		return reply.send({ success: true, message: "Friendship deleted successfully"})
	} catch (err) {
		log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAllPlatformers(request, reply) {
	try {
		const platformers = platformersModel.getAllPlatformers()
		return platformers
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function addPlatformer(request, reply) {
	const { username1, username2, score_user1, score_user2 } = request.body

	try {
		console.log("username1 :", username1)
		console.log("username2 :", username2)
		console.log("score_user1 :", score_user1)
		console.log("score_user2 :", score_user2)
		if (!username1 || !username1 || !score_user1 || !score_user2)
			return reply.code(400).send({ success: false, error: "Missing parameters" })
		const user1 = usersModel.getUserByUsername(username1)
		const user2 = usersModel.getUserByUsername(username2)
		if (!user1)
			return reply.code(404).send({ success: false, error: `User '${username1}' not found` })
		if (!user2)
			return reply.code(404).send({ success: false, error: `User '${username2}' not found` })
		if (user1.userId === user2.userId)
			return reply.code(400).send({ success: false, error: "Cannot create a platformer with the same user" })
		platformersModel.createPlatformer(user1.userId, user2.userId, score_user1, score_user2)

		return reply.code(201).send({ 
			success: true,
			message: "Platformer finished successfully",
		})
	} catch (err) {
		console.error("Error creating platformer game:", err)
		return reply.code(500).send({ error: err.message })
	}
}

export async function deletePlatformer(request, reply) {
	const { platformerId } = request.body
	try {
		const platformer = platformersModel.getPlatformerById(platformerId)
		if (!platformer)
			return reply.code(404).send({ error: 'Platformer not found' })
		const info = platformersModel.deletePlatformer(platformerId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "Platformer not found" })
		return reply.send({ success: true, message: "Platformer deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}