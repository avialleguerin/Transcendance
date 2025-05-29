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
import colorLoggerPlugin from './utils/logger.js' // NOTE - bonus: Colorized logger plugin

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

//// fastify.decorate('authenticate', async function (request, reply) { // REVIEW this code is not used
//// 	try {
//// 		const accessToken = request.headers.authorization?.split(" ")[1];
//// 		const { refreshToken } = request.cookies;
//// 		// fastify.log.error("🔑 Access Token reçu :", accessToken);
//// 		// fastify.log.warn("🔑 Refresh Token reçu :", refreshToken);
//// 		if (!refreshToken || refreshToken === "undefined" || refreshToken === "null")
//// 			return reply.code(401).send({ error: 'Token de rafraîchissement manquant' });
//// 		if (!accessToken || accessToken === "undefined" || accessToken === "null")
//// 			return reply.code(401).send({ error: 'Token d\'accès manquant' });
//// 		if (await redisModel.isTokenBlacklisted(accessToken))
//// 			return reply.code(401).send({ error: 'Token d\'accès invalide (blacklisté)' });
//// 		if (await redisModel.isTokenBlacklisted(refreshToken))
//// 			return reply.code(401).send({ error: 'Token de rafraîchissement invalide (blacklisté)' });
//// 		await request.jwtVerify();
//
//// 		if (!request.user?.userId)
//// 			return reply.code(401).send({ error: "Unauthorized: invalid payload" });
//// 	} catch (err) {
//// 		fastify.log.error("❌ Erreur d'authentification :", err);
//// 		reply.code(401).send({ error: 'You are not authorized' });
//// 	}
//// });

/**
 * Main function for run the server
 * @explication Pour Fastify dans docker, il faut ecouter sur toutes les IP, donc: 0.0.0.0
 * @type test
 */
const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' })
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()