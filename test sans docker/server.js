// ecriture ESM
import Fastify from "fastify";
// Pour post du html
import { join } from "path";
//Pour SQLite
import Database from "better-sqlite3";
// Pour que le nav et le server reload auto
import livereload from "livereload";
import connectLivereload from "connect-livereload";
// les autres pages js
import Routes from "./routes.js"
import registerPlugins from './register.js';
import { CREATE_USERS_TABLE } from './models/userModel.js';

export const fastify = Fastify({ logger: true })
export const db = new Database('database.sqlite', { verbose: console.log });
const liveReloadServer = livereload.createServer();

// fastify.register(Routes)
fastify.register(Routes, {db})
await registerPlugins(fastify);

db.prepare(CREATE_USERS_TABLE).run();

// pour le laisser surveiiler par LiveReload :
liveReloadServer.watch(join(process.cwd(), "public")); // Surveille le dossier public
fastify.addHook("onRequest", async (request, reply) => {
	connectLivereload()(request.raw, reply.raw, () => {});
});

/**
 * Main function for run the server
 * @explication Pour Fastify dans docker, il faut ecouter sur toutes les IP, donc: 0.0.0.0
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