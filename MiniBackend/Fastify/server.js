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
import { CREATE_USERS_TABLE, INSERT_USER, GET_ALL_USERS, GET_USER_BY_ID, GET_USER_BY_NAME, UPDATE_CONNECTION, UPDATE_ADMIN, DELETE_USER } from './queries.js';
import registerPlugins from './register.js';

const fastify = Fastify({ logger: true })
export const db = new Database('database.sqlite', { verbose: console.log });
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
		return reply.send({ success: true, id: info.lastInsertRowid, name, email });
	} catch (err) {
		fastify.log.error(err);
		reply.code(500);
		return { error: err.message };
	}
}

export async function loginUser (request, reply) {
	const { name, email } = request.body;
	try {
		const stmt = db.prepare(GET_USER_BY_NAME);
		const user = stmt.get(name, email);
		if (user){
			const updateStmt = db.prepare(UPDATE_CONNECTION);
			updateStmt.run(1, user.id);

			const updateUser = stmt.get(name, email);

			reply.code(200);

			return reply.send({
				id: updateUser.id,
				connected: updateUser.connected,
				name: updateUser.name,
				email: updateUser.email,
				success: true
			})
		}
		else {
			// Si l'utilisateur n'existe pas, renvoyer une erreur
			reply.code(404);
			return reply.send({ success: false, error: 'User not found' });
		}
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

export async function logoutUser(request, reply) {
	const { id } = request.body;
	try {
		const stmt = db.prepare(GET_USER_BY_ID);
		const user = stmt.get(id)
		// if (user.connected === 0)
		// 	return reply.send({ success: false, error: 'User already disconnected' });
		if (user){
			const updateStmt = db.prepare(UPDATE_CONNECTION);
			updateStmt.run(0, user.id);

			const updateUser = stmt.get(id);
			reply.code(200);

			return reply.send({
				id: updateUser.id,
				connected: updateUser.connected,
				name: updateUser.name,
				email: updateUser.email,
				success: true
			})
		}
		else {
			reply.code(404);
			return reply.send({ success: false, error: 'User not found' });
		}
	} catch (err) {
		fastify.log.error(err);
		reply.code(500);
		return { error: err.message };
	}
}

export async function adminUser(request, reply) {
	const { id } = request.body;
	try {
		const stmt = db.prepare(GET_USER_BY_ID);
		const user = stmt.get(id)
		// if (user.connected === 0)
		// 	return reply.send({ success: false, error: 'User already disconnected' });
		if (user){
			const updateStmt = db.prepare(UPDATE_ADMIN);
			updateStmt.run(user.admin === 1 ? 0 : 1, user.id);

			const updateUser = stmt.get(id);
			reply.code(200);

			return reply.send({
				id: updateUser.id,
				name: updateUser.name,
				email: updateUser.email,
				connected: updateUser.connected,
				admin: updateUser.admin,
				success: true
			})
		}
		else {
			reply.code(404);
			return reply.send({ success: false, error: 'User not found' });
		}
	} catch (err) {
		fastify.log.error(err);
		reply.code(500);
		return { error: err.message };
	}
}

export async function deleteUsers(request, reply) {
	const { id } = request.params; // mode destructuration
	// const id = request.params.id;
	if (!id)
		return reply.code(400).send({ error: "User id is required" });

	try {
		const stmt = db.prepare(DELETE_USER);
		const info = stmt.run(id);

		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" });
		return reply.send({ success: true, message: "User deleted successfully"});
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}

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