import { fastify } from '../server.js'
import { redisClient } from '../utils/redis.js';
import userModel from '../models/userModel.js';
import { hashPassword, verifyPassword } from '../utils/hashUtils.js';
import { randomUUID } from 'crypto';
import { redisModel } from '../models/redisModel.js';

export async function register(request, reply) {
	const { username, email, password } = request.body;

	if (!username || !password)
		return reply.code(400).send({ error: 'Username, Email and Password are required' });

	const user = userModel.getUserByEmail(email)

	if (user)
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
	// const { email, password, userId, sessionId } = request.body;
	// const accessToken = redisModel.getRedisAccessToken(userId, sessionId)
	// if (accessToken)
	// {
	// 	console.error("❌ User is already connected");
	// 	return reply.code(401).send({ error: 'User already connected' });
	// }
	console.log("📧 Email reçu :", email);
	console.log("🔑 Mot de passe reçu :", password);
	const user = userModel.getUserByEmail(email);
	const userId = user.userId;
	console.log("👤 Utilisateur trouvé :", user);
	try {
		if (!user || !await verifyPassword(user.password, password)) {
			console.error("❌ Identifiants invalides");
			return reply.code(401).send({ error: 'Invalid credentials' });
		}

		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, {expiresIn: '1m' });
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, {expiresIn: '7d' });
		console.log("🔑 Access Token created :", accessToken);
		console.log("🔑 Refresh Token created :", refreshToken);

		if (!accessToken || !refreshToken) {
			console.error("❌ Erreur lors de la création des tokens JWT");
			return reply.code(500).send({ error: 'Internal Server Error' });
		}
		const sessionId = randomUUID();
		console.log("🆔 Session ID created :", sessionId);

		await redisModel.storeAccessToken(user.userId, sessionId, accessToken, 1 * 60);
		console.log("🔑 Access Token stocké dans Redis :", `access:${user.userId}:${sessionId}`);

		await redisModel.storeRefreshToken(user.userId, sessionId, refreshToken, 7 * 24 * 60 * 60);
		console.log("🔑 Refresh Token stocké dans Redis :", `refresh:${user.userId}:${sessionId}`);

		reply
		.setCookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
		})
		.send({ success:true, message: 'Logged in', userId, sessionId, accessToken });
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
}

export async function selectUsers(request, reply) {
	try {
		const users = userModel.getAllUsers()
		return users;
	} catch (err) {
		return reply.code(500).send({ error: err.message });
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
		const user = userModel.getUserById(userId);

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
	const { userId, sessionId } = request.body;

	const accessToken = await redisClient.get(`access:${userId}:${sessionId}`);
	const refreshToken = request.cookies.refreshToken;
	console.log("👤 User ID :", userId);
	console.log("🆔 Session ID :", sessionId);
	console.log("🔑 Access Token :", accessToken);
	console.log("🔄 Refresh Token :", refreshToken);
	if (!sessionId) {
		console.error("❌ Aucun sessionId reçu !");
		return reply.code(401).send({ error: 'Session ID manquant' });
	}
	if (accessToken) {
		const decoded = fastify.jwt.decode(accessToken);
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
		if (expiresIn > 0) {
			redisModel.addToBlacklist(accessToken, expiresIn);
		}
		redisModel.deleteAccessToken(userId, sessionId);
	}
	if (refreshToken) {
		const decoded = fastify.jwt.decode(refreshToken);
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
		if (expiresIn > 0) {
			redisModel.addToBlacklist(refreshToken, expiresIn);
		}
		redisModel.deleteRefreshToken(userId, sessionId);
	}
	reply.clearCookie('sessionId', { path: '/' }).clearCookie('refreshToken', { path: '/' }).clearCookie('userId', { path: '/' }).send({ success: true, message: 'Logged out' });



	// const { userId } = request.body;

	// const user = userModel.getUserById(userId)
	
	// if (user.connected === 0)
	// 	return reply.send({ success: false, error: 'User already disconnected' });
	// console.log("je passe la")
	// if (user)
	// 	userModel.updateConnected(userId, 0)
	// const accessToken = request.headers.authorization?.split(" ")[1];
	// if (accessToken) {
	// 	const decoded = fastify.jwt.decode(accessToken);
	// 	const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
	// 	if (expiresIn > 0) {
	// 		await redisClient.set(`blacklist:${accessToken}`, 'true', { EX: expiresIn });
	// 	}
	// }
	// reply.clearCookie('refreshToken', { path: '/refresh-token' }).send({ message: 'Logged out' });
}

export async function changeRole(request, reply) {
	const { userId } = request.body;
	try {
		const user = userModel.getUserById(userId);
		if (user){
			userModel.updateRole(userId, user.role)
			const updateUser = userModel.getUserById(userId);
			reply.code(200);
			
			return reply.send({
				userId: updateUser.userId,
				username: updateUser.username,
				email: updateUser.email,
				role: updateUser.role,
				success: true
			})
		}
		else
		return reply.code(404).send({ success: false, error: 'User not found' });
} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
}

export async function refreshAccessToken(request, reply) {
	const { refreshToken } = request.cookies;
	const { userId, sessionId } = request.body;
	console.log("userId:", userId)
	console.log("sessionId:", sessionId)
	// const sessionId = request.cookies.sessionId;
	
	if (!refreshToken)
		return reply.code(401).send({ error: 'Refresh token is missing'});
	
	try {
		if (!userId || !sessionId)
			return reply.code(401).send({ error: 'Invalid session' });

		if (await redisModel.isTokenBlacklisted(refreshToken))
			return reply.code(401).send({ error: 'Refresh token is blacklisted' });
		
		const payload = fastify.jwt.verify(refreshToken);
		console.log("payload :", payload);

		const accessToken = await redisModel.getRedisAccessToken(userId, sessionId)
		await redisModel.addToBlacklist(accessToken, 1 * 60)
		await redisModel.deleteAccessToken(userId, sessionId)
		const newAccessToken = fastify.jwt.sign({ userId: payload.userId }, { expiresIn: '1m' });
		await redisModel.storeAccessToken(userId, sessionId, newAccessToken, 1 * 60);

		console.log("newAccessToken :", newAccessToken);
		
		return reply.send({ success: true, accessToken: newAccessToken });
	} catch (err) {
		return reply.code(403).send({ success: false, error: 'Invalid refresh token' });
	}
}

export async function getAccessToken(request, reply) {
	if (!request.body || !request.body.userId || !request.body.sessionId) {
		console.error("❌ Données manquantes dans request.body !");
		return reply.code(400).send({ error: 'Données manquantes' });
	}
	const { userId, sessionId } = request.body;
	console.log("Session ID récupéré :", sessionId);
	console.log("ID de l'utilisateur récupéré :", userId);
	if (!sessionId)
		return reply.status(401).send({ error: 'No session' });
	if (!userId)
		return reply.status(400).send({ error: 'User ID is required' });
	try {
		const accessToken = await redisClient.get(`access:${userId}:${sessionId}`);
		console.log("Access token récupéré :", accessToken);
		if (!accessToken)
			return reply.status(403).send({ error: 'Token expired or invalid' });

		return reply.send({ success: true, accessToken });
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
}

export async function unregister(request, reply) {
	const { userId } = request.params;
	if (!userId)
		return reply.code(400).send({ error: "User id is required" });
	
	try {
		
		const info = userModel.unregister(userId)
		
		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" });
		return reply.send({ success: true, message: "User deleted successfully"});
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}
