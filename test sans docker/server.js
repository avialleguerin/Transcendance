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
import { CREATE_USERS_TABLE, INSERT_USER, GET_ALL_USERS, GET_USER_BY_ID, DELETE_USER } from './queries.js';
import registerPlugins from './register.js';

const fastify = Fastify({ logger: true })
const db = new Database('database.sqlite', { verbose: console.log });
const liveReloadServer = livereload.createServer();

// fastify.register(Routes)
fastify.register(Routes, {db})
await registerPlugins(fastify);

// db.prepare(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     email TEXT UNIQUE NOT NULL
//   )
// `).run();

db.prepare(CREATE_USERS_TABLE).run();

// pour le laisser surveiiler par LiveReload :
liveReloadServer.watch(join(process.cwd(), "public")); // Surveille le dossier public
fastify.addHook("onRequest", async (request, reply) => {
	connectLivereload()(request.raw, reply.raw, () => {});
});


export default async function insertUser (request, reply) {
	const { name, email } = request.body;
	try {
		// const stmt = options.db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
		const stmt = db.prepare(INSERT_USER);
		const info = stmt.run(name, email);
		reply.code(201);
		return { id: info.lastInsertRowid, name, email };
	} catch (err) {
		fastify.log.error(err);
		reply.code(500);
		return { error: err.message };
	}
}

export async function selectUsers (request, reply) {
	try {
		const users = db.prepare(GET_ALL_USERS).all();
		return users;
	} catch (err) {
		fastify.log.error(err);
		reply.code(500);
		return { error: err.message };
	}
}

fastify.post('/add-user', async (request, reply) => {
    const { name, email } = request.body;
    try {
        const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
        const info = stmt.run(name, email);
        return reply.send({ success: true, id: info.lastInsertRowid, name, email });
    } catch (error) {
        return reply.code(500).send({ success: false, message: 'Erreur lors de l\'ajout de l\'utilisateur', error });
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