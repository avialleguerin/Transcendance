// Moduls
import Fastify from "fastify";
// import Database from "better-sqlite3";
import { initDb } from "./utils/db.js";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
// Pages
import routes from "./routes/routes.js"
// import registerPlugins from './register.js';
// import { CREATE_USERS_TABLE } from './models/userModel.js';

export const fastify = Fastify({ logger: false }) //change ici laffichage des logs
// export const db = new Database('database.sqlite', { verbose: console.log });
// export const db = new Database('database.sqlite');
initDb();

await fastify.register(jwt, {
	secret: 'supersecretkey', // a changer
	cookie: {
		cookieName: 'token',
		signed: false
	}
});

await fastify.register(cookie);
// fastify.register(routes)
// fastify.register(routes, {db})
fastify.register(routes, { prefix: '/api' })


// db.prepare(CREATE_USERS_TABLE).run();
// db.prepare(CREATE_BLACKLISTED_TOKENS_TABLES).run();


fastify.decorate('authenticate', async function (request, reply) { 
	try {
		console.log("🔹 Vérification du token JWT...");

		await request.jwtVerify();

		console.log("✅ Token valide, contenu extrait :", request.user);

		// request.user = request.user;
		if (!request.user || !request.user.userId) {
			console.error("❌ Token valide mais `userId` manquant !");
			return reply.code(401).send({ error: "Unauthorized: invalid payload" });
		}

	} catch (err) {
		console.error("❌ Token invalide ou expiré :", err);
		reply.code(401).send({ error: 'Unauthorized' });
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