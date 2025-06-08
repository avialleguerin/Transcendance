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

import colorLoggerPlugin from './utils/logger.js' // NOTE - bonus: Colorized logger plugin
import websocket from '@fastify/websocket'
import { checkEmailConfig } from './utils/mailer.js'

const logActive = process.env.LOG_ACTIVE === 'true';

// setting up the server
export const fastify = Fastify({
	logger: logActive ?{ // trace - debug - info - warn - error - fatal
		level: 'debug',
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:H:MM',
				ignore: 'pid,hostname',
			}
		}
	} : false,
	disableRequestLogging: !logActive
})

// Enregistrer le plugin WebSocket
await fastify.register(websocket)

// Map pour stocker les connexions WebSocket actives
const activeConnections = new Map()

// Route WebSocket pour gérer les connexions
fastify.register(async function (fastify) {
	fastify.get('/ws', { websocket: true }, (connection, request) => {
		const userId = request.query.userId

		if (userId && !isNaN(userId)) {
			activeConnections.set(userId, connection)
			
			usersModel.updateOnlineStatus(userId, 1)
			usersModel.updateLastActivity(userId)
			
			console.log(`User ${userId} connected via WebSocket`)
			connection.on('message', (message) => {
				const data = JSON.parse(message)
				
				if (data.type === 'heartbeat') {
					usersModel.updateLastActivity(userId)
					connection.send(JSON.stringify({ type: 'pong' }))
				}
			})

			connection.on('close', () => {
				console.log(`🔌 User ${userId} WebSocket disconnected`)
				console.log(`Type of userId: ${typeof userId}`)
				
				activeConnections.delete(userId)
				
				// Vérifier que l'utilisateur existe
				const user = usersModel.getUserById(userId)
				console.log(`User found in DB:`, user)
				
				if (user) {
					usersModel.updateLastActivity(userId)
					const updateResult = usersModel.updateOnlineStatus(userId, 0)
					console.log(`Update online status result:`, updateResult)
					const userAfter = usersModel.getUserById(userId)
					console.log(`User status after update:`, userAfter.online_status)
					console.log(`✅ User ${userId} marked as offline`)
				} else {
					console.log(`⚠️ User ${userId} not found in database`)
				}
			})
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