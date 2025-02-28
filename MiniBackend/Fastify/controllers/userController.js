import { fastify, db } from '../server.js'
import { INSERT_USER, GET_ALL_USERS, GET_USER_BY_ID, DELETE_USER, GET_USER_BY_EMAIL, UPDATE_CONNECTION, UPDATE_ADMIN } from '../models/userModel.js';
import jwt from '@fastify/jwt';
import bcrypt from 'bcrypt';

// Configuration du plugin JWT


export default async function insertUser (request, reply) {
	const { name, email, password } = request.body;

	if (!name || !password) {
		return reply.code(400).send({ error: 'Name, Email and Password are required' });
	}
	// const hashedPassword = await bcrypt.hash(password, 10);
	try {
		// const stmt = options.db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
		const stmt = db.prepare(INSERT_USER);
		// const info = stmt.run(name, email, hashedPassword);
		const info = stmt.run(name, email, password);

		reply.code(201);
		return reply.send({ success: true, id: info.lastInsertRowid, name, email});
	} catch (err) {
		fastify.log.error("err");
		reply.code(500);
		return { error: err.message };
	}
}

export async function loginUser (request, reply) {
	const { email, password } = request.body;

	try {
		const stmt = db.prepare(GET_USER_BY_EMAIL);
		const user = stmt.get(email, password);

		if (user){
			const updateStmt = db.prepare(UPDATE_CONNECTION);
			updateStmt.run(1, user.id);

			const updateUser = stmt.get(email, password);
			const accessToken = fastify.jwt.sign({ userId: user.id }, {expiresIn: '15m' });
			const refreshToken = fastify.jwt.sign({ userId: user.id }, {expiresIn: '7d' });

			reply.setCookie('refreshToken', refreshToken, {
				httpOnly: true, // Ne peut pas être lu par JS
				secure: process.env.NODE_ENV === 'production', //faire des recherches
				sameSite: 'Strict',
				path: '/' //disponible partout 
			});

			reply.code(200);

			// return reply.send({
			// 	id: updateUser.id,
			// 	connected: updateUser.connected,
			// 	name: updateUser.name,
			// 	email: updateUser.email,
			// 	success: true
			// }, { accessToken })

			return reply.send({
				id: updateUser.id,
				connected: updateUser.connected,
				name: updateUser.name,
				email: updateUser.email,
				success: true,
				refreshToken
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

export async function refreshToken(request, reply) {
	try {
		const { refreshToken } = request.cookies;

		if (!refreshToken) {
			return reply.code(401).send({ error: 'No refresh token'});
		}

		const decoded = fastify.jwt.verify(refreshToken);
		const newAccessToken = fastify.jwt.sign({ userId: decoded.userId}, {expiresIn: '15m'});

		return reply.send({ accessToken: newAccessToken });
	} catch (err) {
		return reply.code(401).send({ error: 'Invalid refresh token' });
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

			reply.clearCookie('refreshToken');

			reply.code(200);

			return reply.send({
				id: updateUser.id,
				connected: updateUser.connected,
				name: updateUser.name,
				email: updateUser.email,
				success: true
			}, { message: 'Logged out successfully' })
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