import { fastify, db } from '../server.js'
import { INSERT_USER, GET_ALL_USERS, GET_USER_BY_ID, DELETE_USER, GET_USER_BY_NAME, UPDATE_CONNECTION, UPDATE_ADMIN } from '../models/userModel.js';

export default async function insertUser (request, reply) {
	const { name, email } = request.body;
	try {
		// const stmt = options.db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
		const stmt = db.prepare(INSERT_USER);
		const info = stmt.run(name, email);
		reply.code(201);
		return reply.send({ success: true, id: info.lastInsertRowid, name, email });
	} catch (err) {
		fastify.log.error("err");
		reply.code(500);
		return { error: "err.message" };
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