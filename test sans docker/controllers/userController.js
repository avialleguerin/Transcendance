import { fastify, db } from '../server.js'
import {
	CREATE_USERS_TABLE,
	INSERT_USER,
	GET_ALL_USERS,
	GET_USER_BY_ID,
	DELETE_USER,
	GET_USER_BY_NAME,
	UPDATE_CONNECTION
} from '../models/userModel.js';

export default async function insertUser (request, reply) {
	const { name, email } = request.body;
	try {
		const stmt = db.prepare(INSERT_USER);
		const info = stmt.run(name, email);
		const userId = await UserModel.insertUser(name, email);
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

export async function loginUser (request, reply) {
	const { name, email } = request.body;
	try {
		console.log("login in process")
		const stmt = db.prepare(GET_USER_BY_NAME);
		const user = stmt.get(name, email);
		if (user){
			console.log("user updating")



			const updateStmt = db.prepare(UPDATE_CONNECTION);
			updateStmt.run(1, user.id);

			const updateUser = stmt.get(name, email);
			console.log(updateUser.id);

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