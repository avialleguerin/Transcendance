// Moduls
import Fastify from "fastify";
import { initDb } from "./utils/db.js";
// import { authenticate } from "./utils/vault.js";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import fastifyMultipart from '@fastify/multipart';
// Pages
import routes from "./routes/routes.js"
import { redisClient } from './utils/redis.js';
import { redisModel } from './models/redisModel.js';

await redisClient.connect();


export const fastify = Fastify({ logger: true })


await fastify.register(fastifyMultipart, {
	attachFieldsToBody: true,
	limits: {
		fileSize: 5 * 1024 * 1024 // optionnel
	}
});
await fastify.register(jwt, {
	secret: 'supersecretkey', // a changer
	cookie: {
		cookieName: 'token',
		signed: false
	}
});

await fastify.register(cookie);
fastify.decorate('redis', redisClient);
fastify.register(routes, { prefix: '/request' })
initDb();

fastify.decorate('authenticate', async function (request, reply) {
	try {
		const accessToken = request.headers.authorization?.split(" ")[1];
		const { refreshToken } = request.cookies;
		console.log("🔑 Access Token reçu :", accessToken);
		console.log("🔑 Refresh Token reçu :", refreshToken);
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