// import { fastify, db, } from '../server.js'
import { fastify } from '../server.js'
import db from '../utils/db.js';
import { INSERT_USER, GET_ALL_USERS, GET_USER_BY_ID, DELETE_USER, GET_USER_BY_EMAIL, UPDATE_CONNECTION, UPDATE_ROLE } from '../models/userModel.js';
import userModel from '../models/userModel.js';
import { hashPassword, verifyPassword } from '../utils/hashUtils.js';

// Configuration du plugin JWT

export async function register(request, reply) {
	const { username, email, password } = request.body;

	if (!username || !password) {
		return reply.code(400).send({ error: 'Username, Email and Password are required' });
	}
	const user = userModel.getUserByEmail(email)
	console.log(typeof user)
	if(user)
		return reply.code(500).send({ error: "This email is already used" });
	try {
		const hashedPassword = await hashPassword(password)

		const info = userModel.createUser(username, email, hashedPassword)

		return reply.code(201).send({ success: true, id: info.lastInsertRowid, username, email});
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
}

export async function login(request, reply) {
	const { email, password } = request.body;

	try {
		// const stmt = db.prepare(GET_USER_BY_EMAIL);
		// const user = stmt.get(email);
		const user = userModel.getUserByEmail(email);

		if (!user || !password)
			return reply.code(401).send({error: 'Invalid credentials'})

		console.log(typeof user);
		console.log(Object.keys(user))
		console.log("user.password:", user.password,"; password:", password)
		const isvalid = await verifyPassword(user.password, password);

		if (!isvalid)
			return reply.code(401).send({ error: "Invalid password" })

		const updateStmt = db.prepare(UPDATE_CONNECTION); // temporaire
		updateStmt.run(1, user.id);

		const accessToken = fastify.jwt.sign({ userId: user.id, username:user.username }, {expiresIn: '1m' });
		const refreshToken = fastify.jwt.sign({ userId: user.id }, {expiresIn: '7d' });

		reply.setCookie('refreshToken', refreshToken, {
			httpOnly: true, // Ne peut pas être lu par JS
			secure: true, //faire des recherches
			sameSite: 'Strict',
			path: '/' //disponible partout 
		});

		return reply.code(200).send({
			id: user.id,
			connected: 1,
			username: user.username,
			email: user.email,
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
			return reply.code(401).send({ error: 'Refresh token is missing'});
		}

		const decoded = fastify.jwt.verify(refreshToken);
		const newAccessToken = fastify.jwt.sign({ userId: decoded.userId}, {expiresIn: '1m'});

		return reply.send({ accessToken: newAccessToken });
	} catch (err) {
		return reply.code(401).send({ error: 'Invalid or expired refresh token' });
	}
}


export async function selectUsers(request, reply) {
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
		const stmt = db.prepare("SELECT id, username, email, role FROM users WHERE id = ?");
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

export async function logout(request, reply) {
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

			return reply.clearCookie('refreshToken').code(200).send({
				id: updateUser.id,
				connected: updateUser.connected,
				username: updateUser.username,
				email: updateUser.email,
				success: true
			}, { message: 'Logged out successfully' })
		}
		else
			return reply.code(404).send({ success: false, error: 'User not found' });
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
}

export async function changeRole(request, reply) {
	const { id } = request.body;
	try {
		const user = userModel.getUserById(id);
		// if (user.connected === 0)
		// 	return reply.send({ success: false, error: 'User already disconnected' });
		if (user){
			// const updateStmt = db.prepare(UPDATE_ROLE);
			// updateStmt.run(user.role === 1 ? 0 : 1, user.id);
			userModel.updateRole(id, user.role)
			const updateUser = userModel.getUserById(id);
			reply.code(200);

			return reply.send({
				id: updateUser.id,
				username: updateUser.username,
				email: updateUser.email,
				connected: updateUser.connected,
				role: updateUser.role,
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

export async function unregister(request, reply) {
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