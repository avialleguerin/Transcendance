// Moduls
import Fastify from "fastify";
import { initDb } from "./utils/db.js";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import Vault from 'node-vault';
// Pages
import routes from "./routes/routes.js"

export const fastify = Fastify({ logger: false })
initDb();

const vault = Vault({ endopint: VAULT_ADDR });
vault.token = VAULT_TOKEN;

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
		// console.log("🔹 Vérification du token JWT...");

		await request.jwtVerify();

		console.log("\n✅ Token valide, contenu extrait :", request.user);

		if (!request.user || !request.user.userId) {
			console.error("❌ Token valide mais `userId` manquant !");
			return reply.code(401).send({ error: "Unauthorized: invalid payload" });
		}

	} catch (err) {
		// console.error("❌ Token invalide ou expiré :", err);
		console.error("❌ Token invalide ou expiré !");
		reply.code(401).send({ error: 'You are not authorized' });
	}
});

async function getSecret() {
	try {
		const secret = await vault.read("secret/db");
		return secret.data.password;
	} catch (err) {
		console.error("Erreur de recuperation du secret:", err);
		return null;
	}
}

// export async function (request, reply) {
// 	const password = await getSecret();
// 	reply.send({ password });
// }
fastify.get("/api/get-secret", async (request, reply) => {
    const password = await getSecret();
    reply.send({ password });
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