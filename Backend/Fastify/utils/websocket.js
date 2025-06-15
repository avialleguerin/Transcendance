import usersModel from '../models/usersModel.js';
import friendshipsModel from '../models/friendshipsModel.js';
import { fastify, log } from '../server.js';

const activeConnections = new Map();

export function notifyFriend(fromUserId, toUserId, type, message = null) {
	try {
		const fromUser = usersModel.getUserById(fromUserId);
		const toUserConnection = activeConnections.get(	toUserId.toString());
		fastify.log.debug(`Notifying friend ${toUserId} of type ${type} from user ${fromUserId}`);
		if (toUserConnection && fromUser)
			toUserConnection.send(JSON.stringify({ type: type, message: message }));
	} catch (error) {
		console.error('Error notifying friend message:', error);
	}
}

function notifyFriendsStatus(userId, status) {
	try {
		const friends = friendshipsModel.getUserAcceptedFriendships(userId);
		const user = usersModel.getUserById(userId);
		
		usersModel.updateOnlineStatus(userId, status)
		usersModel.updateLastActivity(userId)
		log.debug(`Notifying friends of user ${userId} about status change to ${status}`);
		if (friends && friends.length > 0 && user) {
			friends.forEach(friend => {
				const friendUserId = friend.userId === userId ? friend.friendUserId : friend.userId;
				notifyFriend(userId, friendUserId, 'friend_status_update')
			});
		}
	} catch (error) {
		console.error('Error notifying friends of status change:', error);
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
						console.error('Error parsing WebSocket message:', err)
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
					fastify.log.error(`WebSocket error for user ${userId}:`, error)
					activeConnections.delete(userId)
					notifyFriendsStatus(userId, 0)
				})
			} else {
				console.warn('Invalid userId for WebSocket connection')
				connection.close(1008, 'Invalid userId')
			}
		})
}