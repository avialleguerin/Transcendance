import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import friendshipsModel from '../models/friendshipsModel.js'
import { getUserFromToken } from './utils.js'

export async function getUserFriendships(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		const friendships = friendshipsModel.getUserFriendships(user.userId)
		console.log("friendships :", friendships)
		return reply.send({ success: true, friendships: friendships, user: infos.user, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message, accessToken: infos.accessToken })
	}
}

export async function addFriend(request, reply) {
	const { friend } = request.body
	
	try {
		console.log("friend :", friend)
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		console.log("user :", user)
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		const friendExists = usersModel.getUserByUsername(friend)
		if (!friendExists)
			return reply.code(404).send({ success: false, error: `User '${friend}' not found`, accessToken: infos.accessToken })
		if (friendExists.userId === user.userId)
			return reply.code(400).send({success: false, error: `You can't invite yourself`, accessToken: infos.accessToken })
		const status = friendshipsModel.checkFriendshipStatus(user.userId, friendExists.userId);
		if (status.requestSent || status.requestReceived) {
			return reply.code(400).send({ 
				success: false,
				message: "Friendship already exists",
				accessToken: infos.accessToken
			});
		}

		friendshipsModel.createFriendship(user.userId, friendExists.userId);

		return reply.code(201).send({ 
			success: true,
			message: "Friendship created successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		console.error("Error creating friendship:", err)
		return reply.code(500).send({ error: "Internal server error" })
	}
}

export async function acceptFriend(request, reply) {
	const { friendshipId } = request.body
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship)
			return reply.code(404).send({ success: false, error: `Friendship '${friendshipId}' not found`, accessToken: infos.accessToken })
		if (friendship.status !== 'pending')
			return reply.code(400).send({ success: false, error: `Friendship '${friendshipId}' is not pending`, accessToken: infos.accessToken })
		if (friendship.friendId !== user.userId)
			return reply.code(403).send({ success: false, error: `You are not allowed to accept this friendship`, accessToken: infos.accessToken })

		friendshipsModel.acceptFriendship(friendship.userId, user.userId)

		return reply.send({ 
			success: true,
			message: "Friendship accepted successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		console.error("Error accepting friendship:", err)
		return reply.code(500).send({ error: "Internal server error" })
	}
}

export async function deleteFriend(request, reply) {

	const { friendshipId } = request.body
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		const friendship = friendshipsModel.getFriendshipById(friendshipId)
		if (!friendship)
			return reply.code(404).send({ success: false, error: `Friendship '${friendshipId}' not found`, accessToken: infos.accessToken })
		
		friendshipsModel.deleteFriendship(friendship.userId, friendship.friendId)

		return reply.send({ 
			success: true,
			message: "Friendship deleted successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error" })
	}
}
