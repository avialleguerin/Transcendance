import { fastify, db, } from '../server.js'
import { INSERT_USER, GET_ALL_USERS, GET_USER_BY_ID, DELETE_USER, GET_USER_BY_EMAIL, UPDATE_CONNECTION, UPDATE_ADMIN } from '../models/userModel.js';
import { hashPassword, verifyPassword } from '../utils/hashUtils.js';

// Configuration du plugin JWT

export async function register (request, reply) {
	const { username, email, password } = request.body;

	if (!username || !password) {
		return reply.code(400).send({ error: 'Username, Email and Password are required' });
	}

	try {
		const hashedPassword = await hashPassword(password)

		const stmt = db.prepare(INSERT_USER);
		const info = stmt.run(username, email, hashedPassword);

		return reply.code(201).send({ success: true, id: info.lastInsertRowid, username, email});
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
}

export async function login (request, reply) {
	const { email, password } = request.body;

	try {
		const stmt = db.prepare(GET_USER_BY_EMAIL);
		const user = stmt.get(email);

		if (!user || !password)
			return reply.code(401).send({error: 'Invalid credentials'})

		const isvalid = await verifyPassword(user.password, password);

		if (!isvalid)
			return reply.status(401).send({ error: "Invalid password" })

		const updateStmt = db.prepare(UPDATE_CONNECTION); // temporaire
		updateStmt.run(1, user.id);

		const updateUser = stmt.get(email);
		// const accessToken = fastify.jwt.sign({ userId: user.id, username:user.username, role: user.admin === 1 ? "admin" : "user" }, {expiresIn: '15m' });
		const accessToken = fastify.jwt.sign({ userId: user.id, username:user.username }, {expiresIn: '15m' });
		const refreshToken = fastify.jwt.sign({ userId: user.id }, {expiresIn: '7d' });

		reply.setCookie('refreshToken', refreshToken, {
			httpOnly: true, // Ne peut pas être lu par JS
			secure: process.env.NODE_ENV === 'production', //faire des recherches
			sameSite: 'Strict',
			path: '/' //disponible partout 
		});

		return reply.code(200).send({
			id: updateUser.id,
			connected: updateUser.connected,
			username: updateUser.username,
			email: updateUser.email,
			success: true,
			accessToken
		}, { message: "Connexion established"});
	} catch (err) {
		return reply.code(500).send({ error: err.message });
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

export async function getUserProfile(request, reply) {
	console.log("🔹 Requête reçue sur /api/profile");
	const userId = request.user?.userId;

	if (!userId)
	{
		console.error("❌ Aucun userId trouvé dans le token JWT !");
		return reply.code(400).send({ error: 'Invalid token' });
	}
	console.log(`✅ userId extrait du JWT : ${userId}`);

	try {
		const stmt = db.prepare("SELECT id, username, email, admin FROM users WHERE id = ?");
		const user = stmt.get(userId);

		if (!user)
		{
			console.error("❌ Aucun utilisateur trouvé dans la base pour cet ID !");
			return reply.code(404).send({ error: "User not found" });
		}

		console.log("✅ Utilisateur récupéré :", user);
		return reply.send({ user });
	} catch (error) {
		console.error('\x1b[31m%s\x1b[0m', "Erreur dans getUserProfile:", error);
		reply.code(500).send({ error: 'Internal Server Error' });
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
				username: updateUser.username,
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
				username: updateUser.username,
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