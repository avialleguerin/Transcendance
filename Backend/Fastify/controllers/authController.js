import { fastify } from '../server.js'
import userModel from '../models/userModel.js';
import { hashPassword, verifyPassword } from '../utils/hashUtils.js';
import { redisModel } from '../models/redisModel.js';
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

const SECRET_LENGHT = 30

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
		console.error("❌ User not found in JWT token !");
		return reply.code(400).send({ error: 'Invalid token' });
	}
	console.log(`✅ userId extrait du JWT : ${userId}`);

	try {
		const user = userModel.getUserById(userId);

		if (!user)
		{
			console.error("❌ User not found");
			return reply.code(404).send({ error: "❌ User not found !" });
		}

		console.log("✅ Utilisateur récupéré :", user);
		return reply.send({ user });
	} catch (error) {
		console.error('\x1b[31m%s\x1b[0m', "Erreur dans getUserProfile:", error);
		reply.code(500).send({ error: 'Internal Server Error' });
	}
}

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
	console.log("📧 Email reçu :", email);
	console.log("🔑 Mot de passe reçu :", password);
	const user = userModel.getUserByEmail(email);
	console.log("👤 Utilisateur trouvé :", user);
	try {
		if (!user || !await verifyPassword(user.password, password)) {
			console.error("❌ Identifiants invalides");
			return reply.code(401).send({ error: 'Invalid credentials' });
		}
		if (user.doubleAuth_enabled) {
			userModel.updateConnection(user.userId, "partially_connected");
			return reply.code(200).send({success:true, connection_status: "partially_connected", message: 'Double authentication required', user: user});
		}
		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, {expiresIn: '1m' });
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, {expiresIn: '7d' });
		console.log("🔑 Access Token created :", accessToken);
		console.log("🔑 Refresh Token created :", refreshToken);
		if (!accessToken || !refreshToken) {
			console.error("❌ Erreur lors de la création des tokens JWT");
			return reply.code(500).send({ error: 'Internal Server Error' });
		}

		userModel.updateConnection(user.userId, "connected");
		reply
		.setCookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
		})
		.send({ success:true, message: 'Logged in', connection_status: "connected", doubleAuth_enabled: user.doubleAuth_enabled, accessToken: accessToken });
	} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
}

export async function logout(request, reply) {
	// const accessToken = request.headers.authorization?.split(" ")[1];
	const { userId, accessToken } = request.body;
	const { refreshToken } = request.cookies;
	if (!accessToken)
	{
		userModel.updateConnection(userId, "disconnected");
		return reply.send({ success: true, message: 'Already Logged out' });
	}
	console.log("🔄 AccessToken :", accessToken);
	console.log("🔄 RefreshToken :", refreshToken);
	if (accessToken) {
		const decoded = fastify.jwt.decode(accessToken);
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
		if (expiresIn > 0) {
			redisModel.addToBlacklist(accessToken, expiresIn);
		}
	}
	if (refreshToken) {
		const decoded = fastify.jwt.decode(refreshToken);
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
		if (expiresIn > 0) {
			redisModel.addToBlacklist(refreshToken, expiresIn);
		}
	}
	userModel.updateConnection(userId, "disconnected");
	reply.clearCookie('refreshToken', { path: '/' }).send({ success: true, message: 'Logged out' });
}

export async function changeDoubleAuth(request, reply) {
	const { userId } = request.body;
	try {
		const user = userModel.getUserById(userId)
		if (user){
			userModel.updateDoubleAuth(userId, user.doubleAuth_enabled)
			const updateUser = userModel.getUserById(userId)
			if (!updateUser.doubleAuth_enabled)
			{
				userModel.updateDoubleAuth_secret(userId, null)
				console.log("Double Auth disabled")
				return reply.code(200).send({message: "Double Auth disabled"})
			}
			const doubleAuthData = generateDoubleAuth(userId)
			console.log("Double Auth qrCode", (await doubleAuthData).qrCode)
			console.log("Double Auth secret", (await doubleAuthData).secret)

			return reply.code(200).send({
				userId: updateUser.userId,
				username: updateUser.username,
				email: updateUser.email,
				role: updateUser.doubleAuth_enabled,
				message: 'Double authentication enabled',
				enable_doubleAuth: true,
				secret: (await doubleAuthData).secret,
				qrCode: (await doubleAuthData).qrCode,
				success: true
			})
		}
		else
			return reply.code(404).send({ success: false, error: 'User not found' });
} catch (err) {
		return reply.code(500).send({ error: err.message });
	}
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

export async function refreshAccessToken(request, reply) {
	const { refreshToken } = request.cookies;

	if (!refreshToken)
		return reply.code(401).send({ error: 'Refresh token is missing'});
	try {
		if (await redisModel.isTokenBlacklisted(refreshToken))
			return reply.code(401).send({ error: 'Refresh token is blacklisted' });

		const payload = fastify.jwt.verify(refreshToken);
		console.log("payload :", payload);

		const newAccessToken = fastify.jwt.sign({ userId: payload.userId }, { expiresIn: '1m' });
		console.log("newAccessToken :", newAccessToken);
		return reply.send({ success: true, accessToken: newAccessToken });
	} catch (err) {
		return reply.code(403).send({ success: false, error: 'Invalid refresh token' });
	}
}

  
  // Appelez cette fonction juste avant de vérifier isValid

export async function verifyDoubleAuth(request, reply) {
	const { userId, code } = request.body;

	try {
		const user = userModel.getUserById(userId);
		if (!user || !user.doubleAuth_secret) {
			return reply.code(400).send({ success: false, error: '2FA not enabled or user not found' });
		}

		const isValid = speakeasy.totp.verify({ secret: user.doubleAuth_secret, encoding: 'base32', token: code, window: 1 });
		console.log("🔑 2fa valide :", isValid);
		console.log("🔑 code 2FA :", code);
		console.log("🔑 Secret récupéré :", user.doubleAuth_secret);
		console.log("🕒 Heure du serveur Node.js:", new Date().toISOString());
		const testCode = speakeasy.totp({
			secret: user.doubleAuth_secret,
			encoding: 'base32',
		});
		
		console.log("🔑 Code TOTP généré :", testCode);

	function debugTOTP(secret) {
		console.log("🔍 DEBUG TOTP");
		const now = Math.floor(Date.now() / 1000);

		// Génère les codes pour différentes périodes autour de l'heure actuelle
		for (let i = -5; i <= 5; i++) {
			const time = now + (i * 30); // 30 secondes par période
			const debugCode = speakeasy.totp({
			secret: secret,
			encoding: 'base32',
			time: time
			});
			console.log(`Code pour t${i > 0 ? '+' : ''}${i*30}s: ${debugCode}`);
			
			// Vérifie si ce code correspond au code entré
			if (debugCode === code) {
			console.log(`✅ Match found at offset: ${i*30} seconds`);
			}
		}
	}
		debugTOTP(user.doubleAuth_secret);

		if (isValid) {
			const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '1m' });
			const refreshToken = fastify.jwt.sign({ userId: user.userId }, { expiresIn: '7d' });
			console.log("🔑 Access Token created :", accessToken);
			console.log("🔑 Refresh Token created :", refreshToken);
			userModel.updateConnection(user.userId, "connected");
			reply
			.setCookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				path: '/',
			})
			.send({ success:true, message: '2FA code is valid', connection_status: "connected", accessToken: accessToken });
		} else
			return reply.code(401).send({ success: false, error: 'Invalid 2FA code' });
	} catch (err) {
		console.error(err);
		return reply.code(500).send({ success: false, error: 'Internal server error' });
	}
}

export async function generateDoubleAuth(userId) {
	// const { userId } = request.params
	const user = userModel.getUserById(userId)

	user.doubleAuth_secret = speakeasy.generateSecret({ length: SECRET_LENGHT })
	console.log("🔑 Secret généré :", user.doubleAuth_secret);
	const secret = user.doubleAuth_secret.base32
	console.log("🔑 Secret généré 2:", secret);
	userModel.updateDoubleAuth_secret(userId, secret)
	const otpauth = speakeasy.otpauthURL({
		secret,
		label: `Transcendance (${user.username})`,
		issuer: 'Transcendance',
	})
	const qrCode = await qrcode.toDataURL(otpauth, { errorCorrectionLevel: 'H' })
	const data = {
		secret: secret,
		qrCode: qrCode,
	}
	return data
}
