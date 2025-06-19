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
		const users = usersModel.getActiveUsers()
		log.success('Successfully retrieved all active users')
		return users
	} catch (err) {
		log.error(`Error retrieving active users: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function getDeletedUsers(request, reply) {
	try {
		const anonymizedUsers = usersModel.getDeletedUsers()
		log.success(`Successfully retrieved ${anonymizedUsers.length} deleted/anonymized users`)
		return reply.code(200).send({ success: true, users: anonymizedUsers })
	} catch (err) {
		log.error(`Error retrieving deleted users: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function deleteUser(request, reply) {
	const { userId } = request.body
	
	try {
		log.info(`Admin attempting to delete user ID: ${userId}`)
		
		const user = usersModel.getUserById(userId)
		if (!user) {
			log.warn(`Delete attempt failed: User ID ${userId} not found`)
			return reply.code(404).send({ error: 'User not found' })
		}

		const oldProfilePicture = user.profile_picture;
		if (oldProfilePicture !== "default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture);
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false);
				
				if (fileExists) {
					await fs.unlink(oldFilePath);
					log.info(`Deleted profile picture: ${oldProfilePicture}`)
				} else {
					log.warn(`Profile picture not found: ${oldProfilePicture}`)
				}
			} catch (deleteErr) {
				log.error(`Failed to delete profile picture ${oldProfilePicture}: ${deleteErr.message}`)
			}
		}

		const info = usersModel.anonymizeUser(userId)
		if (info.changes === 0) {
			log.error(`Database error: No changes made for user ID ${userId}`)
			return reply.code(404).send({ error: "User not found" })
		}
		
		log.success(`User '${user.username}' (ID: ${userId}) successfully anonymized by admin`)
		return reply.send({ success: true, message: "User anonymized successfully"})
	} catch (err) {
		log.error(`Critical error in deleteUser for ID ${userId}: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function forceDeleteUser(request, reply) {
	const { userId } = request.body
	
	try {
		log.warn(`Admin attempting FORCE DELETE for user ID: ${userId}`)
		
		const user = usersModel.getUserById(userId)
		if (!user) {
			log.warn(`Force delete failed: User ID ${userId} not found`)
			return reply.code(404).send({ error: 'User not found' })
		}

		const oldProfilePicture = user.profile_picture;
		if (oldProfilePicture !== "default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture);
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false);
				
				if (fileExists) {
					await fs.unlink(oldFilePath);
					log.info(`Deleted profile picture during force delete: ${oldProfilePicture}`)
				} else {
					log.warn(`Profile picture not found during force delete: ${oldProfilePicture}`)
				}
			} catch (deleteErr) {
				log.error(`Failed to delete profile picture during force delete: ${deleteErr.message}`)
			}
		}

		const info = usersModel.forceDeleteUser(userId)
		if (info.changes === 0) {
			log.error(`Force delete failed: No database changes for user ID ${userId}`)
			return reply.code(404).send({ error: "User not found" })
		}
		
		log.warn(`PERMANENT DELETION: User '${user.username}' (ID: ${userId}) permanently deleted by admin`)
		return reply.send({ success: true, message: "User permanently deleted"})
	} catch (err) {
		log.error(`Critical error in forceDeleteUser for ID ${userId}: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAllGames(request, reply) {
	try {
		const games = gamesModel.getAllGames()
		log.success(`Successfully retrieved ${games.length} games`)
		return games
	} catch (err) {
		log.error(`Error retrieving all games: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function createGame(request, reply) {
	const { user1, user2, user3, user4 } = request.body
	
	try {
		log.info(`Admin creating game: ${user1} vs ${user2}${user3 ? ` vs ${user3}` : ''}${user4 ? ` vs ${user4}` : ''}`)
		
		const user1Exists = usersModel.getUserByUsername(user1)
		const user2Exists = usersModel.getUserByUsername(user2)
		
		if (!user1Exists) {
			log.warn(`Game creation failed: User '${user1}' not found`)
			return reply.code(404).send({ success: false, error: `User '${user1}' not found` })
		}

		if (!user2Exists) {
			log.warn(`Game creation failed: User '${user2}' not found`)
			return reply.code(404).send({ success: false, error: `User '${user2}' not found` })
		}

		if (user1 === user2) {
			log.warn(`Game creation failed: Duplicate players (${user1})`)
			return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
		}
		
		if (user3 || user4) {
			const user3Exists = user3 ? usersModel.getUserByUsername(user3) : null
			const user4Exists = user4 ? usersModel.getUserByUsername(user4) : null
			
			if (user3 && !user3Exists) {
				log.warn(`2v2 game creation failed: User '${user3}' not found`)
				return reply.code(404).send({ success: false, error: `User '${user3}' not found` })
			}
				
			if (user4 && !user4Exists) {
				log.warn(`2v2 game creation failed: User '${user4}' not found`)
				return reply.code(404).send({ success: false, error: `User '${user4}' not found` })
			}
			
			if (user3 && (user1 === user3 || user2 === user3)) {
				log.warn(`2v2 game creation failed: Duplicate player ${user3}`)
				return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
			}
				
			if (user4 && (user1 === user4 || user2 === user4 || user3 === user4)) {
				log.warn(`2v2 game creation failed: Duplicate player ${user4}`)
				return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })
			}
			
			if (user3Exists && user4Exists) {
				gamesModel.create2v2Game(user1Exists.userId, user2Exists.userId, user3Exists.userId, user4Exists.userId, 0, 0)
				log.success(`2v2 game created successfully: ${user1} & ${user2} vs ${user3} & ${user4}`)
			} else {
				log.warn(`2v2 game creation failed: Missing players for complete 2v2`)
				return reply.code(400).send({ success: false, error: "Both user3 and user4 are required for a 2v2 game" })
			}
		} else {
			gamesModel.createGame(user1Exists.userId, user2Exists.userId)
			log.success(`1v1 game created successfully: ${user1} vs ${user2}`)
		}
			
		return reply.code(201).send({ 
			success: true,
			message: "Game created successfully",
		})
	} catch (err) {
		log.error(`Critical error creating game: ${err.message}`)
		return reply.code(500).send({ error: "Internal server error" })
	}
}

export async function deleteGame(request, reply) {
	const { gameId } = request.body
	
	try {
		log.info(`Admin attempting to delete game ID: ${gameId}`)
		
		const game = gamesModel.getgameById(gameId)
		if (!game) {
			log.warn(`Game deletion failed: Game ID ${gameId} not found`)
			return reply.code(404).send({ error: 'Game not found' })
		}
		
		const info = gamesModel.deleteGame(gameId)
		if (info.changes === 0) {
			log.error(`Game deletion failed: No database changes for game ID ${gameId}`)
			return reply.code(404).send({ error: "Game not found" })
		}
		
		log.success(`Game ID ${gameId} successfully deleted by admin`)
		return reply.send({ success: true, message: "Game deleted successfully"})
	} catch (err) {
		log.error(`Critical error deleting game ID ${gameId}: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAllFriendships(request, reply) {
	try {
		const friendships = friendshipsModel.getAllFriendships()
		log.success(`Successfully retrieved ${friendships.length} friendships`)
		return friendships
	} catch (err) {
		log.error(`Error retrieving all friendships: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function addFriendship(request, reply) {
	const { user_username, friend_username } = request.body
	
	try {
		log.info(`Admin creating friendship: ${user_username} ↔ ${friend_username}`)
		
		const user = usersModel.getUserByUsername(user_username)
		if (!user) {
			log.warn(`Friendship creation failed: User '${user_username}' not found`)
			return reply.code(401).send({ error: "User not found" })
		}
		
		const friend = usersModel.getUserByUsername(friend_username)
		if (!friend) {
			log.warn(`Friendship creation failed: Friend '${friend_username}' not found`)
			return reply.code(404).send({ success: false, error: `User '${friend_username}' not found` })
		}

		const status = friendshipsModel.checkFriendshipStatus(user.userId, friend.userId);
		if (status.requestSent || status.requestReceived) {
			log.warn(`Friendship creation failed: Relationship already exists between ${user_username} and ${friend_username}`)
			return reply.code(400).send({ 
				success: false,
				error: "Friendship already exists",
			});
		}

		friendshipsModel.createFriendship(user.userId, friend.userId);
		log.success(`Friendship created successfully: ${user_username} ↔ ${friend_username}`)

		return reply.code(201).send({ 
			success: true,
			message: "Friendship created successfully",
		})
	} catch (err) {
		log.error(`Critical error creating friendship between ${user_username} and ${friend_username}: ${err.message}`)
		return reply.code(500).send({ error: "Internal server error" })
	}
}

export async function deleteFriendship(request, reply) {
	const { friendshipId } = request.body
	
	try {
		log.info(`Admin attempting to delete friendship ID: ${friendshipId}`)
		
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship) {
			log.warn(`Friendship deletion failed: Friendship ID ${friendshipId} not found`)
			return reply.code(404).send({ error: 'Friendship not found' })
		}
		
		const info = friendshipsModel.deleteFriendship(friendship.userId, friendship.friendId)
		if (info.changes === 0) {
			log.error(`Friendship deletion failed: No database changes for friendship ID ${friendshipId}`)
			return reply.code(404).send({ error: "Friendship not found" })
		}
		
		log.success(`Friendship ID ${friendshipId} (User ${friendship.userId} ↔ User ${friendship.friendId}) successfully deleted by admin`)
		return reply.send({ success: true, message: "Friendship deleted successfully"})
	} catch (err) {
		log.error(`Critical error deleting friendship ID ${friendshipId}: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function getAllPlatformers(request, reply) {
	try {
		const platformers = platformersModel.getAllPlatformers()
		log.success(`Successfully retrieved ${platformers.length} platformer games`)
		return platformers
	} catch (err) {
		log.error(`Error retrieving all platformer games: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function addPlatformer(request, reply) {
	const { username1, username2, score_user1, score_user2 } = request.body

	try {
		log.info(`Admin creating platformer game: ${username1} (${score_user1}) vs ${username2} (${score_user2})`)
		
		if (!username1 || !username2 || score_user1 === undefined || score_user2 === undefined) {
			log.warn(`Platformer creation failed: Missing required parameters`)
			return reply.code(400).send({ success: false, error: "Missing parameters" })
		}
		
		const user1 = usersModel.getUserByUsername(username1)
		const user2 = usersModel.getUserByUsername(username2)
		
		if (!user1) {
			log.warn(`Platformer creation failed: User '${username1}' not found`)
			return reply.code(404).send({ success: false, error: `User '${username1}' not found` })
		}
		
		if (!user2) {
			log.warn(`Platformer creation failed: User '${username2}' not found`)
			return reply.code(404).send({ success: false, error: `User '${username2}' not found` })
		}
		
		if (user1.userId === user2.userId) {
			log.warn(`Platformer creation failed: Cannot create game with same user (${username1})`)
			return reply.code(400).send({ success: false, error: "Cannot create a platformer with the same user" })
		}
		
		platformersModel.createPlatformer(user1.userId, user2.userId, score_user1, score_user2)
		log.success(`Platformer game created successfully: ${username1} (${score_user1}) vs ${username2} (${score_user2})`)

		return reply.code(201).send({ 
			success: true,
			message: "Platformer finished successfully",
		})
	} catch (err) {
		log.error(`Critical error creating platformer game: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function deletePlatformer(request, reply) {
	const { platformerId } = request.body
	
	try {
		log.info(`Admin attempting to delete platformer ID: ${platformerId}`)
		
		const platformer = platformersModel.getPlatformerById(platformerId)
		if (!platformer) {
			log.warn(`Platformer deletion failed: Platformer ID ${platformerId} not found`)
			return reply.code(404).send({ error: 'Platformer not found' })
		}
		
		const info = platformersModel.deletePlatformer(platformerId)
		if (info.changes === 0) {
			log.error(`Platformer deletion failed: No database changes for platformer ID ${platformerId}`)
			return reply.code(404).send({ error: "Platformer not found" })
		}
		
		log.success(`Platformer ID ${platformerId} successfully deleted by admin`)
		return reply.send({ success: true, message: "Platformer deleted successfully"})
	} catch (err) {
		log.error(`Critical error deleting platformer ID ${platformerId}: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}