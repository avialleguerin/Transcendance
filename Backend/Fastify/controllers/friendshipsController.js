import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import friendshipsModel from '../models/friendshipsModel.js'
import { getUserFromToken, handleControllerError } from './utils.js'
import { notifyFriend } from '../utils/websocket.js'

export async function getUserFriendships(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Friendships access denied: Unauthorized request')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const user = infos.user
		if (!user) {
			fastify.log.warn('Friendships access denied: User not found in token')
			return reply.code(401).send({ error: "User not found" })
		}
		if (!infos.accessToken) {
			fastify.log.warn('Friendships access denied: Missing access token')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const friendships = friendshipsModel.getUserFriendships(user.userId)
		fastify.log.info(`Friendships retrieved for user: ${user.username} (${friendships.length} found)`)
		return reply.send({ success: true, friendships: friendships, user: infos.user, accessToken: infos.accessToken })
	} catch (err) {
		fastify.log.error(`Error retrieving user friendships: ${err.message}`)
		return reply.code(500).send({ error: err.message, accessToken: infos?.accessToken })
	}
}

export async function addFriend(request, reply) {
	const { friend } = request.body
	let infos;
	
	try {
		fastify.log.info(`Friend request initiated for: ${friend}`)
		infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Add friend denied: Unauthorized request')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const user = infos.user
		if (!infos.accessToken) {
			fastify.log.warn('Add friend denied: Missing access token')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		if (!user) {
			fastify.log.warn('Add friend denied: User not found in token')
			return reply.code(401).send({ error: "User not found" })
		}
		const friendExists = usersModel.getUserByUsername(friend)
		if (!friendExists || friendExists.anonymized_at) {
			fastify.log.warn(`Friend request failed: User '${friend}' not found or anonymized`)
			return reply.code(404).send({ success: false, error: `User '${friend}' not found`, accessToken: infos.accessToken })
		}
		if (friendExists.userId === user.userId) {
			fastify.log.warn(`Friend request failed: Self-invitation attempt by ${user.username}`)
			return reply.code(400).send({success: false, error: `You can't invite yourself as friend`, accessToken: infos.accessToken })
		}
		const status = friendshipsModel.checkFriendshipStatus(user.userId, friendExists.userId);
		if (status.requestSent || status.requestReceived) {
			fastify.log.warn(`Friend request failed: Relationship already exists between ${user.username} and ${friend}`)
			return reply.code(400).send({ 
				success: false,
				error: "Friendship already exists",
				accessToken: infos.accessToken
			});
		}

		friendshipsModel.createFriendship(infos.user.userId, friendExists.userId);
		notifyFriend(infos.user.userId, friendExists.userId, "friend_request", `${infos.user.username} has sent you a friend request`);

		fastify.log.info(`Friend request sent: ${user.username} → ${friend}`)
		return reply.code(201).send({ 
			success: true,
			message: "Friendship request sent successfully",
			accessToken: infos.accessToken
		});
	} catch (err) {
		fastify.log.error(`Error adding friend '${friend}': ${err.message}`)
		return handleControllerError(err, reply, infos?.accessToken, 'addFriend');
	}
}

export async function acceptFriend(request, reply) {
	const { friendshipId } = request.body
	let infos;
	try {
		fastify.log.info(`Friend acceptance attempt for friendship ID: ${friendshipId}`)
		infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Accept friend denied: Unauthorized request')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const user = infos.user
		if (!user) {
			fastify.log.warn('Accept friend denied: User not found in token')
			return reply.code(401).send({ error: "User not found" })
		}
		if (!infos.accessToken) {
			fastify.log.warn('Accept friend denied: Missing access token')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship) {
			fastify.log.warn(`Accept friend failed: Friendship ID ${friendshipId} not found`)
			return reply.code(404).send({ success: false, error: `This Friendship doesn't exist`, accessToken: infos.accessToken })
		}
		if (friendship.status !== 'pending') {
			fastify.log.warn(`Accept friend failed: Friendship ID ${friendshipId} not pending (status: ${friendship.status})`)
			return reply.code(400).send({ success: false, error: `You already have this friend`, accessToken: infos.accessToken })
		}
		if (friendship.friendId !== user.userId) {
			fastify.log.warn(`Accept friend denied: User ${user.username} not authorized for friendship ID ${friendshipId}`)
			return reply.code(403).send({ success: false, error: `You are not allowed to accept this friend`, accessToken: infos.accessToken })
		}

		friendshipsModel.acceptFriendship(friendship.userId, infos.user.userId);
		notifyFriend(user.userId, friendship.userId , "friend_request", `${user.username} has accepted your friend request`);

		fastify.log.info(`Friend request accepted: ${user.username} accepted friendship ID ${friendshipId}`)
		return reply.send({ 
			success: true,
			message: "Friend accepted successfully",
			accessToken: infos.accessToken
		});
	} catch (err) {
		fastify.log.error(`Error accepting friend (ID: ${friendshipId}): ${err.message}`)
		return reply.code(500).send({ error: "Internal server error:" + err.message })
	}
}

export async function deleteFriend(request, reply) {
	const { friendshipId } = request.body
	let infos;
	try {
		fastify.log.info(`Friend deletion attempt for friendship ID: ${friendshipId}`)
		infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Delete friend denied: Unauthorized request')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const user = infos.user
		if (!user) {
			fastify.log.warn('Delete friend denied: User not found in token')
			return reply.code(401).send({ error: "User not found" })
		}
		if (!infos.accessToken) {
			fastify.log.warn('Delete friend denied: Missing access token')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship) {
			fastify.log.warn(`Delete friend failed: Friendship ID ${friendshipId} not found`)
			return reply.code(404).send({ success: false, error: `Friend not found`, accessToken: infos.accessToken })
		}
		
		const otherUserId = friendship.userId === user.userId ? friendship.friendId : friendship.userId;
		friendshipsModel.deleteFriendship(friendship.userId, friendship.friendId)
		notifyFriend(user.userId, otherUserId, "friend_deleted", `${user.username} has deleted you from their friends list`);
		
		fastify.log.info(`Friendship deleted: ${user.username} deleted friendship ID ${friendshipId}`)
		return reply.send({ 
			success: true,
			message: "Friend deleted successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		fastify.log.error(`Error deleting friend (ID: ${friendshipId}): ${err.message}`)
		return reply.code(500).send({ error: "Internal server error" })
	}
}
