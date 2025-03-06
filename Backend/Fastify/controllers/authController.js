import { fastify } from '../server.js'
import userModel from '../models/userModel.js';
import tokenModel from '../models/tokenModel.js';
import { hashPassword, verifyPassword } from '../utils/hashUtils.js';

export async function register(request, reply) {
	const { username, email, password } = request.body;

	if (!username || !password) {
		return reply.code(400).send({ error: 'Username, Email and Password are required' });
	}

	const user = userModel.getUserByEmail(email)

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
		const user = userModel.getUserByEmail(email);

		if (!user || !password)
			return reply.code(401).send({error: 'Invalid credentials'})

		const isvalid = await verifyPassword(user.password, password);

		if (!isvalid)
			return reply.code(401).send({ error: "Invalid password" })

		userModel.updateConnected(user.id, 1)
		const accessToken = fastify.jwt.sign({ userId: user.id, username:user.username }, {expiresIn: '1m' });
		const refreshToken = fastify.jwt.sign({ userId: user.id }, {expiresIn: '7d' });

		reply.setCookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
			path: '/'
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
	const { id } = request.body;
	console.log("headers of request :", request.headers)
	console.log("headers of body :", request.body)

	const accessToken = request.headers.authorization?.split(" ")[1];
	const refreshToken = request.cookies.refreshToken;
	console.log("Access token when logout :", accessToken)
	console.log("Refresh token when logout :", refreshToken)
	try {
		const user = userModel.getUserById(id)

		if (user.connected === 0)
			return reply.send({ success: false, error: 'User already disconnected' });
		if (user){

			userModel.updateConnected(id, 0)
			const updateUser = userModel.getUserById(id)

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
		return reply.code(500).send({ error: 'Logout failed' });
	}
}

export async function changeRole(request, reply) {
	const { id } = request.body;
	try {
		const user = userModel.getUserById(id);
		if (user){
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
		else
			return reply.code(404).send({ success: false, error: 'User not found' });
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
}

export async function refreshAccessToken(request, reply) {
	const { refreshToken } = request.cookies;

	console.log("je passe laaaoaoa")

	if (!refreshToken) {
		return reply.code(401).send({ error: 'Refresh token is missing'});
	}

	try {
		const payload = fastify.jwt.verify(refreshToken);
		console.log("payload :", payload)
		
		
		const newAccessToken = fastify.jwt.sign(
			{ userId: payload.userId },
			{ expiresIn: '1m'}
		);
		
		return reply.send({ accessToken: newAccessToken });
	} catch (err) {
		return reply.code(403).send({ error: 'Invalid or expired refresh token' });
	}
}

export async function unregister(request, reply) {
	const { id } = request.params;
	if (!id)
		return reply.code(400).send({ error: "User id is required" });

	try {

		const info = userModel.unregister(id)

		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" });

		return reply.send({ success: true, message: "User deleted successfully"});
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}