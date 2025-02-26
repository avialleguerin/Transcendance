import { fastify, db } from '../server.js'
import { CREATE_USERS_TABLE, INSERT_USER, GET_ALL_USERS, GET_USER_BY_ID, DELETE_USER } from '../models/userModel.js';

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

export async function deleteUsers(request, reply) {
	const { id } = request.params; // mode destructuration
	// const id = request.params.id;

	if (!id) {
		return reply.code(400).send({ error: "L'identifiant de l'utilisateur est requis." });
	}

	try {
		const stmt = db.prepare(DELETE_USER);
		const info = stmt.run(id);

		if (info.changes === 0) {
			return reply.code(404).send({ error: "Utilisateur introuvable." });
		}

		return reply.send({ success: true, message: "Utilisateur supprime avec succes. "});
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}
