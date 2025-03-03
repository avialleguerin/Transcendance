import Fastify from "fastify";
import Database from "better-sqlite3";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
// les autres pages js
import routes from "./routes.js"
// import registerPlugins from './register.js';
import { CREATE_USERS_TABLE } from './models/userModel.js';

export const fastify = Fastify({ logger: true }) //change ici laffichage des logs
export const db = new Database('database.sqlite', { verbose: console.log });
// export const db = new Database('database.sqlite');

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
// await registerPlugins(fastify);

db.prepare(CREATE_USERS_TABLE).run();


fastify.decorate('authenticate', async function (request, reply) { 
	try {
		await request.jwtVerify();
		// request.user = request.user;
	} catch (err) {
		reply.code(401).send({error: 'Unauthorized'});
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