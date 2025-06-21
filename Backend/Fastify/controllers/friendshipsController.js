import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import friendshipsModel from '../models/friendshipsModel.js'
import { getUserFromToken, handleControllerError, sanitizeInput } from './utils.js'
import { notifyFriend } from '../utils/websocket.js'

export async function getUserFriendships(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })
		if (!infos.user) return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })
		
		const friendships = friendshipsModel.getUserFriendships(infos.user.userId)
		return reply.send({ success: true, friendships: friendships, user: infos.user, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}

export async function addFriend(request, reply) {
	const { friend } = request.body
	let infos;
	
	if (!friend || typeof friend !== 'string' || friend.trim() === '') return reply.code(400).send({ error: "Friend username is required" })

	if (!sanitizeInput(friend, 'username').success)
		return reply.code(400).send({ error: "This friend doesn't exist" })
	
	try {
		infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })
		if (!infos.user) return reply.code(401).send({ error: "User not found", accessToken: infos.accessToken })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })
		
		const friendExists = usersModel.getUserByUsername(friend)
		if (!friendExists || friendExists.anonymized_at) return reply.code(404).send({ success: false, error: `User '${friend}' not found`, accessToken: infos.accessToken })
		if (friendExists.userId === infos.user.userId) return reply.code(400).send({ success: false, error: `You can't invite yourself as friend`, accessToken: infos.accessToken })
		
		const status = friendshipsModel.checkFriendshipStatus(infos.user.userId, friendExists.userId);
		if (status.requestSent || status.requestReceived) return reply.code(409).send({ success: false, error: "Friendship already exists", accessToken: infos.accessToken });

		friendshipsModel.createFriendship(infos.user.userId, friendExists.userId);
		notifyFriend(infos.user.userId, friendExists.userId, "friend_request", `You have a new friend request`);

		return reply.code(201).send({ success: true, message: "Friendship request sent successfully", accessToken: infos.accessToken });
	} catch (err) {
		return handleControllerError(err, reply, infos?.accessToken, 'addFriend');
	}
}

export async function acceptFriend(request, reply) {
	const { friendshipId } = request.body
	let infos;
	
	if (!friendshipId || isNaN(parseInt(friendshipId))) return reply.code(400).send({ error: "Invalid friendship ID" })
	
	try {
		infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })
		if (!infos.user) return reply.code(401).send({ error: "User not found", accessToken: infos.accessToken })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })
		
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship) return reply.code(404).send({ success: false, error: `This Friendship doesn't exist`, accessToken: infos.accessToken })
		if (friendship.status !== 'pending') return reply.code(400).send({ success: false, error: `You already have this friend`, accessToken: infos.accessToken })
		if (friendship.friendId !== infos.user.userId) return reply.code(403).send({ success: false, error: `You are not allowed to accept this friend`, accessToken: infos.accessToken })

		friendshipsModel.acceptFriendship(friendship.userId, infos.user.userId);
		notifyFriend(infos.user.userId, friendship.userId, "friend_request", `${infos.user.username} has accepted your friend request`);

		return reply.send({ success: true, message: "Friend accepted successfully", accessToken: infos.accessToken });
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}

export async function deleteFriend(request, reply) {
	const { friendshipId } = request.body
	let infos;
	
	if (!friendshipId || isNaN(parseInt(friendshipId))) return reply.code(400).send({ error: "Invalid friendship ID" })
	
	try {
		infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })
		if (!infos.user) return reply.code(401).send({ error: "User not found", accessToken: infos.accessToken })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })
		
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship) return reply.code(404).send({ success: false, error: `Friend not found`, accessToken: infos.accessToken })
		if (friendship.userId !== infos.user.userId && friendship.friendId !== infos.user.userId) return reply.code(403).send({ success: false, error: `You are not allowed to delete this friendship`, accessToken: infos.accessToken })
		
		const otherUserId = friendship.userId === infos.user.userId ? friendship.friendId : friendship.userId;
		const deleteResult = friendshipsModel.deleteFriendship(friendship.userId, friendship.friendId)
		
		if (deleteResult.changes === 0) return reply.code(404).send({ success: false, error: `Friend not found`, accessToken: infos.accessToken })
		
		notifyFriend(infos.user.userId, otherUserId, "friend_deleted", `${infos.user.username} has deleted you from their friends list`);
		
		return reply.send({ success: true, message: "Friend deleted successfully", accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}
