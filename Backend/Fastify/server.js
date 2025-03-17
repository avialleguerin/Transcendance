// Moduls
import Fastify from "fastify";
import { initDb } from "./utils/db.js";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
// Pages
import routes from "./routes/routes.js"
import { redisClient } from './utils/redis.js';
import { redisModel } from './models/redisModel.js';

await redisClient.connect();

export const fastify = Fastify({ logger: false })
fastify.decorate('redis', redisClient);
routes(fastify);
initDb();

await fastify.register(jwt, {
	secret: 'supersecretkey', // a changer
	cookie: {
		cookieName: 'token',
		signed: false
	}
});
await fastify.register(cookie);
fastify.register(routes, { prefix: '/api' })

fastify.decorate('authenticate', async function (request, reply) {
	try {
		const accessToken = request.headers.authorization?.split(" ")[1];
		const refreshToken = request.cookies.refreshToken;
		console.log("🔑 Access Token reçu :", accessToken);
		console.log("🔑 Refresh Token reçu :", refreshToken);
		if (!accessToken)
			return reply.code(401).send({ error: 'Token d\'accès manquant' });
		if (!refreshToken)
			return reply.code(401).send({ error: 'Token de rafraîchissement manquant' });
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

