import Fastify from "fastify";
import Database from "better-sqlite3";
import fastifyJWT from '@fastify/jwt';
// les autres pages js
import Routes from "./routes.js"
// import registerPlugins from './register.js';
import { CREATE_USERS_TABLE } from './models/userModel.js';

export const fastify = Fastify({ logger: false }) //change ici laffichage des logs
export const db = new Database('database.sqlite', { verbose: console.log });

// fastify.register(Routes)
fastify.register(Routes, {db})
// await registerPlugins(fastify);

db.prepare(CREATE_USERS_TABLE).run();
const fas = fastifyJWT
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