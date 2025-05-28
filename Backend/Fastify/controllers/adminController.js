import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'
import friendshipsModel from '../models/friendshipsModel.js'

export async function getAllUsers(request, reply) {
	// fastify.log.debug("getAllUsers called")
	try {
		const users = usersModel.getAllUsers()
		return users
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function deleteUser(request, reply) {
	fastify.log.debug("deleteUser called")
	console.log("request :", request)
	const { userId } = request.body
	try {
		const user = usersModel.getUserById(userId)
		fastify.log.debug("userId :", userId)
		fastify.log.debug("user :", user)
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
					fastify.log.debug(`🗑️ deleting old profile picture: ${oldFilePath}`);
					await fs.unlink(oldFilePath);
				} else {
					fastify.log.warn(`⚠️ Old profile picture doesn't exist: ${oldFilePath}`);
				}
			} catch (deleteErr) {
				fastify.error.error(`❌ Error deleting old profile picture: ${deleteErr.message}`);
			}
		}

		// NOTE - new :  Anonymiser les jeux avant suppression
        // try {
        //     const anonymizedUserId = `Anonym${user.userId}`;
        //     gamesModel.anonymizeUserGames(user.userId, anonymizedUserId);
        //     fastify.log.info(`🔒 Games anonymized for user ${user.username}`);
        // } catch (anonymizeError) {
        //     fastify.error.error(`❌ Error anonymizing games: ${anonymizeError.message}`);
        // }

		const info = usersModel.delete(userId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" })
		return reply.send({ success: true, message: "User deleted successfully"})
	} catch (err) {
		fastify.log.error("ctach deletUser: " + err.message)
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
		fastify.log.debug("status :", status.requestSent || status.requestReceived)
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
		fastify.log.debug("friendshipId :", friendshipId)
		fastify.log.debug("userId :", friendship.userId)
		fastify.log.debug("friendId :", friendship.friendId)
		const info = friendshipsModel.deleteFriendship(friendship.userId, friendship.friendId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "Friendship not found" })
		return reply.send({ success: true, message: "Friendship deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}