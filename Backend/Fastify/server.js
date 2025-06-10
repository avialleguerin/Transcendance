// Moduls
import Fastify from "fastify";
import { initDb } from "./utils/db.js";
// import { authenticate } from "./utils/vault.js";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import fastifyMultipart from '@fastify/multipart';
// Pages
import routes from "./routes/routes.js"
import { redisClient, setupRedisLogging } from './utils/redis.js';
import { redisModel } from './models/redisModel.js';
import cron from 'node-cron';
// Models
import usersModel from './models/usersModel.js';
import friendshipsModel from './models/friendshipsModel.js';

import colorLoggerPlugin from './utils/logger.js' // NOTE - bonus: Colorized logger plugin
import websocket from '@fastify/websocket'
import { checkEmailConfig } from './utils/mailer.js'

// setting up the server
export const fastify = Fastify({
	logger: { // trace - debug - info - warn - error - fatal
		level: 'debug',
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:H:MM',
				ignore: 'pid,hostname',
			}
		}
	},
	disableRequestLogging: true
})

// Enregistrer le plugin WebSocket
await fastify.register(websocket)

// Map pour stocker les connexions WebSocket actives
const activeConnections = new Map()

// Route WebSocket pour gérer les connexions
function notifyFriendsStatusChange(userId, status) {
	try {
		const onlineStatus = status === 1 ? 'online' : 'offline'; // 'online' si status est 1, sinon 'offline'

		const friends = friendshipsModel.getUserAcceptedFriendships(userId);
		const user = usersModel.getUserById(userId); // Pour récupérer le username
		
		usersModel.updateOnlineStatus(userId, status)
		usersModel.updateLastActivity(userId)

		if (friends && friends.length > 0 && user) {
			friends.forEach(friend => {
				const friendUsername = friend.userId === userId ? friend.friendUsername : friend.userUsername;
				const friendUserId = friend.userId === userId ? friend.friendUserId : friend.userId;
				const friendConnection = activeConnections.get(friendUserId.toString());
				
				if (friendConnection) {
					friendConnection.send(JSON.stringify({
						type: 'friend_status_update',
						userId: userId,
						username: user.username,
						status: onlineStatus,
						timestamp: new Date().toISOString()
					}));
					console.log(`📡 Notified friend '${friendUsername}' about user '${user.username}' status: ${onlineStatus}`);
				}
			});
		} else {
			console.log(`👥 User ${userId} has no friends to notify or user not found`);
		}
	} catch (error) {
		console.error('❌ Error notifying friends of status change:', error);
	}
}

// Route WebSocket pour gérer les connexions
fastify.register(async function (fastify) {
	fastify.get('/ws', { websocket: true }, (connection, request) => {
			const userId = request.query.userId

			if (userId && !isNaN(userId)) {
				activeConnections.set(userId, connection)
				notifyFriendsStatusChange(userId, 1)
				
				console.log(`User ${userId} connected via WebSocket`)
				
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
					console.log(`🔌 User ${userId} WebSocket disconnected - Code: ${code}, Reason: ${reason}`)
					
					// ✅ Supprimer immédiatement de la map des connexions actives
					activeConnections.delete(userId)
					
					const user = usersModel.getUserById(userId)
					if (user) {
						// ✅ Marquer comme hors ligne immédiatement
						notifyFriendsStatusChange(userId, 0)
						console.log(`✅ User '${user.username}' marked as offline immediately`)
					} else {
						console.log(`⚠️ User '${user.username}' not found in database`)
					}
				})

				// ✅ Gérer les erreurs de connexion
				connection.on('error', (error) => {
					console.error(`❌ WebSocket error for user ${userId}:`, error)
					activeConnections.delete(userId)
					notifyFriendsStatusChange(userId, 0)
				})
			} else {
				console.warn('❌ Invalid userId for WebSocket connection')
				connection.close(1008, 'Invalid userId')
			}
		})
})


setupRedisLogging(fastify); // Setup Redis logging with Fastify
await redisClient.connect();

// registering plugins
await fastify.register(fastifyMultipart, { attachFieldsToBody: true, limits: { fileSize: 5 * 1024 * 1024 } });
await fastify.register(jwt, { secret: 'supersecretkey', cookie: { cookieName: 'token', signed: false } });
await fastify.register(cookie);
await fastify.register(colorLoggerPlugin) //optionnel - colorized logger plugin

// Exporter le logger pour utilisation globale
export const log = fastify.logger; // Votre logger colorisé


fastify.register(routes, { prefix: '/request' })
initDb();
fastify.decorate('redis', redisClient);
fastify.decorate('authenticate', async function (request, reply) {
	try {
		const accessToken = request.headers.authorization?.split(" ")[1];
		const { refreshToken } = request.cookies;
		// console.log("🔑 Access Token reçu :", accessToken);
		// console.log("🔑 Refresh Token reçu :", refreshToken);
		if (!refreshToken || refreshToken === "undefined" || refreshToken === "null")
			return reply.code(401).send({ error: 'Token de rafraîchissement manquant' });
		if (!accessToken || accessToken === "undefined" || accessToken === "null")
			return reply.code(401).send({ error: 'Token d\'accès manquant' });
		if (await redisModel.isTokenBlacklisted(accessToken))
			return reply.code(401).send({ error: 'Token d\'accès invalide (blacklisté)' });
		if (await redisModel.isTokenBlacklisted(refreshToken))
			return reply.code(401).send({ error: 'Token de rafraîchissement invalide (blacklisté)' });
		await request.jwtVerify();

		if (!request.user?.userId)
			return reply.code(401).send({ error: "Unauthorized: invalid payload" });
	} catch (err) {
		console.error("❌ Erreur d'authentification :", err);
		reply.code(401).send({ error: 'You are not authorized' });
	}
});

// cron.schedule('* * * * *', () => {
// 	// Marquer comme hors ligne les utilisateurs inactifs depuis plus de 2 minutes
// 	const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
// 	console.log(`Marking users inactive if offline since: ${twoMinutesAgo}`);
// 	usersModel.setInactiveUsersOffline(twoMinutesAgo);
// });

cron.schedule('0 0 * * *', () => {
	console.log('Clean inactive users...');
	const result = usersModel.deleteInactiveUsers();
	console.log(`Number of supressed accounts : ${result.changes}`);
});

// fastify.decorate('checkCGU', async function (request, reply) {  //REVIEW - Vérification CGU decoration
// 	try {
// 		// Skip pour les routes qui ne nécessitent pas de vérification
// 		const skipRoutes = ['/login', '/register', '/accept-cgu', '/cgu'];
// 		if (skipRoutes.some(route => request.url.includes(route))) {
// 			return;
// 		}
		
// 		// On vérifie que l'utilisateur est authentifié
// 		const { userId } = request.user || {};
// 		if (!userId) return;
		
// 		// On récupère les infos utilisateur
// 		const user = usersModel.getUserById(userId);
// 		if (!user) {
// 			return reply.code(401).send({ 
// 			error: "USER_NOT_FOUND", 
// 			message: "Utilisateur non trouvé" 
// 			});
// 		}
		
// 		// On vérifie la version des CGU
// 		const currentCGUVersion = getCurrentCGUVersion();
// 		if (user.cgu_version !== currentCGUVersion) {
// 			return reply.code(403).send({
// 			error: "CGU_UPDATE_REQUIRED",
// 			message: "Vous devez accepter les nouvelles conditions générales d'utilisation",
// 			currentVersion: currentCGUVersion
// 			});
// 		}
// 	} catch (err) {
// 		console.error("❌ Erreur de vérification des CGU :", err);
// 		// Ne pas bloquer la requête en cas d'erreur
// 	}
// });

// fastify.decorate('authenticate', async function (request, reply) {
// 	try {
// 		// 1. Vérification JWT
// 		const accessToken = request.headers.authorization?.split(" ")[1];
// 		const { refreshToken } = request.cookies;
		
// 		if (!refreshToken || refreshToken === "undefined" || refreshToken === "null")
// 			return reply.code(401).send({ error: 'Token de rafraîchissement manquant' });
// 		if (!accessToken || accessToken === "undefined" || accessToken === "null")
// 			return reply.code(401).send({ error: 'Token d\'accès manquant' });
// 		if (await redisModel.isTokenBlacklisted(accessToken))
// 			return reply.code(401).send({ error: 'Token d\'accès invalide (blacklisté)' });
// 		if (await redisModel.isTokenBlacklisted(refreshToken))
// 			return reply.code(401).send({ error: 'Token de rafraîchissement invalide (blacklisté)' });
// 		await request.jwtVerify();
	
// 		if (!request.user?.userId)
// 			return reply.code(401).send({ error: "Unauthorized: invalid payload" });
		
// 		// 2. Vérification CGU (après authentification réussie)
// 		// Vérifier si cette route doit être exemptée de la vérification CGU
// 		const skipRoutes = ['/login', '/register', '/accept-cgu', '/cgu', '/auth'];
// 		if (!skipRoutes.some(route => request.url.includes(route))) {
// 			// Récupérer les informations utilisateur
// 			const user = usersModel.getUserById(request.user.userId);
// 			if (!user) {
// 			return reply.code(401).send({ 
// 				error: "USER_NOT_FOUND", 
// 				message: "Utilisateur non trouvé" 
// 			});
// 			}
			
// 			// Vérifier la version des CGU
// 			const currentCGUVersion = getCurrentCGUVersion();
// 			if (user.cgu_version !== currentCGUVersion) {
// 			return reply.code(403).send({
// 				error: "CGU_UPDATE_REQUIRED",
// 				message: "Vous devez accepter les nouvelles conditions générales d'utilisation",
// 				currentVersion: currentCGUVersion
// 			});
// 			}
// 		}
// 	} catch (err) {
// 		console.error("❌ Erreur d'authentification :", err);
// 		reply.code(401).send({ error: 'You are not authorized' });
// 	}
// });

/**
 * Main function for run the server
 * @explication Pour Fastify dans docker, il faut ecouter sur toutes les IP, donc: 0.0.0.0
 * @type test
 */
const start = async () => {
	try {
		checkEmailConfig();
		await fastify.listen({ port: 3000, host: '0.0.0.0' })
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()