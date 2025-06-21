import usersModel from '../models/usersModel.js';
import friendshipsModel from '../models/friendshipsModel.js';
import { fastify, log } from '../server.js';

const activeConnections = new Map();

export function getUserConnection(UID) {
	if (activeConnections.has(UID) || activeConnections.has(UID.toString())) {
		return true;
	}
	return false;
}

export function notifyFriend(fromUserId, toUserId, type, message = null) {
	try {
		const fromUser = usersModel.getUserById(fromUserId);
		const toUserConnection = activeConnections.get(	toUserId.toString());
		fastify.log.debug(`Notifying friend ${toUserId} of type ${type} from user ${fromUserId}`);
		if (toUserConnection && fromUser)
			toUserConnection.send(JSON.stringify({ type: type, message: message }));
	} catch (error) {
		fastify.log.error('Error notifying friend message:' + error.message);
	}
}

function notifyFriendsStatus(UID, status) {
	try {
		const friendships = friendshipsModel.getUserAcceptedFriendships(UID);
		const user = usersModel.getUserById(UID);
		
		usersModel.updateOnlineStatus(UID, status)
		usersModel.updateLastActivity(UID)
		if (friendships && friendships.length > 0 && user) {
			friendships.forEach(friendship => {
				const friendUserId = ((friendship.userId).toString() === UID ? friendship.friendId : friendship.userId);
				fastify.log.debug(`Notifying friends of user ${UID} about status change to ${friendUserId}`);
				if (UID !== friendUserId)
					notifyFriend(UID, friendUserId, 'friend_status_update')
			});
		}
	} catch (err) {
		fastify.log.error('Error notifying friends of status change:' + err.message);
	}
}

export default function websocketPlugin(fastify) {
	fastify.get('/ws', { websocket: true }, (connection, request) => {
			const userId = request.query.userId

			if (userId && !isNaN(userId)) {
				activeConnections.set(userId, connection)
				notifyFriendsStatus(userId, 1)
				fastify.log.debug(`User ${userId} WebSocket connected`)
				fastify.log.debug(`Active connections: ${activeConnections.size}`)
				
				connection.on('message', (message) => {
					try {
						const data = JSON.parse(message)
						
						if (data.type === 'heartbeat') {
							usersModel.updateLastActivity(userId)
							connection.send(JSON.stringify({ type: 'pong' }))
						}
					} catch (err) {
						fastify.log.error('Error parsing WebSocket message:' + err.message)
					}
				})

				connection.on('close', (code, reason) => {
					fastify.log.info(`User ${userId} WebSocket disconnected - Code: ${code}, Reason: ${reason}`)
					activeConnections.delete(userId)
					
					const user = usersModel.getUserById(userId)
					if (user)
						notifyFriendsStatus(userId, 0)
				})
				connection.on('error', (error) => {
					fastify.log.error(`WebSocket error for user ${userId}:` + error)
					activeConnections.delete(userId)
					notifyFriendsStatus(userId, 0)
				})
			} else
				connection.close(1008, 'Invalid userId')
		})
}