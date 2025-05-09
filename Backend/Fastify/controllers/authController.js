import { fastify } from '../server.js'
import userModel from '../models/userModel.js'
import { hashPassword, verifyPassword } from '../utils/hashUtils.js'
import { redisModel } from '../models/redisModel.js'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

const SECRET_LENGHT = 30

export async function selectUsers(request, reply) {
	try {
		const users = userModel.getAllUsers()
		return users
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function getUserProfile(request, reply) {
	console.log("🔹 Requête reçue sur /api/profile")
	const token = request.headers.authorization?.split(' ')[1];
	if (!token)
	{
		console.error("❌ Token manquant dans l'en-tête de la requête")
		return reply.code(401).send({ error: 'Token manquant' })
	}
	const decoded = fastify.jwt.verify(token);
	const userId = decoded.userId;

	if (!userId)
	{
		console.error("❌ User not found in JWT token !")
		return reply.code(400).send({ error: 'Invalid token' })
	}
	console.log(`✅ userId extrait du JWT : ${userId}`)

	try {
		const user = userModel.getUserById(userId)
		if (!user)
		{
			console.error("❌ User not found")
			return reply.code(404).send({ error: "❌ User not found !" })
		}

		console.log("✅ Utilisateur récupéré :", user)
		return reply.send({ user })
	} catch (error) {
		console.error('\x1b[31m%s\x1b[0m', "Erreur dans getUserProfile:", error)
		reply.code(500).send({ error: 'Internal Server Error' })
	}
}

export async function register(request, reply) {
	const { username, email, password } = request.body

	if (!username || !password)
		return reply.code(400).send({ error: 'Username, Email and Password are required' })

	const user = userModel.getUserByEmail(email)

	if (user)
		return reply.code(500).send({ error: "This email is already used" })

	try {
		const hashedPassword = await hashPassword(password)

		const info = userModel.createUser(username, email, hashedPassword)

		return reply.code(201).send({ success: true, id: info.lastInsertRowid, username, email})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function login(request, reply) {
	const { email, password } = request.body
	console.log("📧 Email reçu :", email)
	console.log("🔑 Mot de passe reçu :", password)
	const user = userModel.getUserByEmail(email)
	console.log("👤 Utilisateur trouvé :", user)
	try {
		if (!user || !await verifyPassword(user.password, password)) {
			console.error("❌ Identifiants invalides")
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		}
		if (user.doubleAuth_enabled) {
			userModel.updateConnection(user.userId, "partially_connected")
			return reply.code(200).send({success: true, connection_status: "partially_connected", message: 'Double authentication required', user: user})
		}
		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, {expiresIn: '1m' })
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, {expiresIn: '7d' })
		console.log("🔑 Access Token created :", accessToken)
		console.log("🔑 Refresh Token created :", refreshToken)
		if (!accessToken || !refreshToken) {
			console.error("❌ Erreur lors de la création des tokens JWT")
			return reply.code(500).send({ error: 'Internal Server Error' })
		}

		userModel.updateConnection(user.userId, "connected")
		reply
		.setCookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
		})
		.send({ success:true, message: 'Logged in', connection_status: "connected", doubleAuth_enabled: user.doubleAuth_enabled, accessToken: accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function logout(request, reply) {
	const { accessToken } = request.body
	const { refreshToken } = request.cookies
	console.log("🔄 AccessToken avant vérification :", accessToken)
	if (!accessToken)
		return reply.code(401).send({ error: 'Access token is missing' })
	const decoded = fastify.jwt.decode(accessToken)
	const userId = decoded.userId
	userModel.updateConnection(userId, "disconnected")
	console.log("🔄 userId :", userId)
	console.log("🔄 AccessToken :", accessToken)
	console.log("🔄 RefreshToken :", refreshToken)
	if (accessToken && accessToken !== undefined) {
		const decoded = fastify.jwt.decode(accessToken)
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
		if (expiresIn > 0) {
			redisModel.addToBlacklist(accessToken, expiresIn)
		}
	}
	if (refreshToken && refreshToken !== undefined) {
		const decoded = fastify.jwt.decode(refreshToken)
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
		if (expiresIn > 0) {
			redisModel.addToBlacklist(refreshToken, expiresIn)
		}
		reply.clearCookie('refreshToken', { path: '/' })
	}
	userModel.updateConnection(userId, "disconnected")
	reply.send({ success: true, message: 'Logged out' })
}

export async function changeDoubleAuth(request, reply) {
	const { userId } = request.body
	try {
		const user = userModel.getUserById(userId)
		if (user){
			if (user.doubleAuth_enabled || user.doubleAuth_secret !== null)
			{
				userModel.updateDoubleAuth(userId, 0)
				userModel.updateDoubleAuth_secret(userId, null)
				console.log("Double Auth disabled")
				return reply.code(200).send({message: "Double Auth disabled"})
			}
			// userModel.updateDoubleAuth(userId, 1)
			// const updateUser = userModel.getUserById(userId)
			// if (!updateUser.doubleAuth_enabled)
			// {
			// 	userModel.updateDoubleAuth_secret(userId, null)
			// 	console.log("Double Auth disabled")
			// 	return reply.code(200).send({message: "Double Auth disabled"})
			// }
			const doubleAuthData = generateDoubleAuth(userId)
			console.log("Double Auth qrCode", (await doubleAuthData).qrCode)
			console.log("Double Auth secret", (await doubleAuthData).secret)

			return reply.code(200).send({
				userId: user.userId,
				username: user.username,
				email: user.email,
				message: 'Double authentication waiting for activation',
				enable_doubleAuth: true,
				secret: (await doubleAuthData).secret,
				qrCode: (await doubleAuthData).qrCode,
				success: true
			})
		}
		else
			return reply.code(404).send({ success: false, error: 'User not found' })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function accessProfileInfo(request, reply) {
	const { userId, password } = request.body
	// const userId = request.user?.userId
	// const userId = request.params.userId
	console.log("userId :", userId)
	try {
		const user = userModel.getUserById(userId)
		console.log("user :", user)
		if (!user)
			return reply.code(404).send({ success: false, error: 'User not found' })
		if (!await verifyPassword(user.password, password))
			return reply.code(401).send({ success: false, error: 'Invalid password' })
		else
			return reply.code(200).send({success:true, message: 'access to profile infos accepted ', user: user})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function changeRole(request, reply) {
	const { userId } = request.body
	try {
		const user = userModel.getUserById(userId)
		if (user){
			userModel.updateRole(userId, user.role)
			const updateUser = userModel.getUserById(userId)
			reply.code(200)
			
			return reply.send({
				userId: updateUser.userId,
				username: updateUser.username,
				email: updateUser.email,
				role: updateUser.role,
				success: true
			})
		}
		else
		return reply.code(404).send({ success: false, error: 'User not found' })
} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function changeProfile(request, reply) {
	const { userId, newUsername, newEmail, newPassword } = request.body
	const { refreshToken } = request.cookies
	const accessToken = request.headers['authorization']?.split(' ')[1]
	try {
		const user = userModel.getUserById(userId)
		console.log("user :", user)
		if (user){
			if (newUsername)
				userModel.updateUsername(userId, newUsername)
			if (newEmail)
				userModel.updateEmail(userId, newEmail)
			if (newPassword)
			{
				const hashedPassword = await hashPassword(newPassword)
				userModel.updatePassword(userId, hashedPassword)
			}
			if (accessToken && accessToken !== undefined) {
				const decoded = fastify.jwt.decode(accessToken)
				const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
				if (expiresIn > 0) {
					redisModel.addToBlacklist(accessToken, expiresIn)
				}
			}
			if (refreshToken) {
				const decoded = fastify.jwt.decode(refreshToken)
				const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
				if (expiresIn > 0) {
					redisModel.addToBlacklist(refreshToken, expiresIn)
					reply.clearCookie('refreshToken', { path: '/' })
				}
			}
			userModel.updateConnection(userId, "disconnected")
			const updateUser = userModel.getUserById(userId)
			console.log("updateUser :", updateUser)
			return reply.code(200).send({ user: updateUser, success: true, message: 'Profile updated successfully, please reconnect' })
		}
		else
			return reply.code(404).send({ success: false, error: 'User not found' })
} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function changeProfilePicture(request, reply) {
	const { userId, profilePicture } = request.body
	try {
		const user = userModel.getUserById(userId)
		if (user){
			userModel.updateProfilePicture(userId, profilePicture)
			const updateUser = userModel.getUserById(userId)
			reply.code(200)
			
			return reply.send({
				userId: updateUser.userId,
				username: updateUser.username,
				email: updateUser.email,
				role: updateUser.profile_picture,
				success: true
			})
		}
		else
		return reply.code(404).send({ success: false, error: 'User not found' })
} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function unregister(request, reply) {
	const { userId } = request.params
	if (!userId)
		return reply.code(400).send({ error: "User id is required" })
	
	try {
		
		const info = userModel.unregister(userId)
		
		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" })
		return reply.send({ success: true, message: "User deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}

export async function refreshAccessToken(request, reply) {
	const { refreshToken } = request.cookies

	if (!refreshToken)
		return reply.code(401).send({ error: 'Refresh token is missing'})
	try {
		if (await redisModel.isTokenBlacklisted(refreshToken))
			return reply.code(401).send({ error: 'Refresh token is blacklisted' })

		const payload = fastify.jwt.verify(refreshToken)
		console.log("payload :", payload)

		const newAccessToken = fastify.jwt.sign({ userId: payload.userId }, { expiresIn: '1m' })
		console.log("newAccessToken :", newAccessToken)
		return newAccessToken
	} catch (err) {
		return reply.code(403).send({ success: false, error: 'Invalid refresh token' })
	}
}

export async function verifyDoubleAuth(request, reply) {
	const { userId, code } = request.body
	try {
		const user = userModel.getUserById(userId)
		if (!user || !user.doubleAuth_secret) {
			return reply.code(400).send({ success: false, error: '2FA not enabled or user not found' })
		}

		const isValid = speakeasy.totp.verify({
			secret: user.doubleAuth_secret,
			encoding: 'base32',
			token: code,
			window: 1
		})

		console.log("🔑 code 2FA :", code)
		console.log("🔑 Secret récupéré :", user.doubleAuth_secret)


		if (isValid) {
			const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '1m' })
			const refreshToken = fastify.jwt.sign({ userId: user.userId }, { expiresIn: '7d' })
			console.log("🔑 Access Token created :", accessToken)
			console.log("🔑 Refresh Token created :", refreshToken)
			userModel.updateConnection(user.userId, "connected")
			userModel.updateDoubleAuth(user.userId, 1)
			reply
			.setCookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				path: '/',
			})
			.send({ success:true, message: '2FA code is valid', connection_status: "connected", accessToken: accessToken })
		} else {
			userModel.updateDoubleAuth_secret(userId, null)
			userModel.updateConnection(user.userId, "disconnected")
			console.error("❌ Invalid 2FA code")
			return reply.code(401).send({ success: false, error: 'Invalid 2FA code' })
		}
	} catch (err) {
		console.error(err)
		return reply.code(500).send({ success: false, error: 'Internal server error' })
	}
}

export async function activateDoubleAuth(request, reply) {
	const { userId, code } = request.body
	const user = userModel.getUserById(userId)

	console.log("🔑 Secret :", user.doubleAuth_secret)
	const isValid = speakeasy.totp.verify({
		secret: user.doubleAuth_secret,
		encoding: 'base32',
		token: code,
		window: 1
	})
	console.log("🔑 isValid :", isValid)
	console.log("État initial 2FA:", user.doubleAuth_enabled)
	if (isValid) {
		userModel.updateDoubleAuth(userId, 1)
		return reply.send({ success: true, message: "2FA successfully activated" })
	} else {
		// userModel.updateDoubleAuth_secret(userId, null)
		return reply.code(400).send({ 
			success: false, 
			error: "Verification failed. Please try scanning the QR code again."
		})
	}
}

export async function generateDoubleAuth(userId) {
	const user = userModel.getUserById(userId)
	if (!user) {
		throw new Error(`User with ID ${userId} not found`)
	}
	const secretObj = speakeasy.generateSecret({ length: SECRET_LENGHT })
	const secret = secretObj.base32
	console.log("🔑 Secret généré:", secret)
	userModel.updateDoubleAuth_secret(userId, secret)

	const otpauth = speakeasy.otpauthURL({
		secret: secret,
		label: `Transcendance (${user.username})`,
		issuer: 'Transcendance',
		encoding: 'base32',
		algorithm: 'sha1',
		period: 30
	})
	const qrCode = await qrcode.toDataURL(otpauth, { errorCorrectionLevel: 'H' })
	const data = {
		secret: secret,
		qrCode: qrCode,
	}
	return data
}

export async function refreshInfos(request, reply) {
	const { userId, accessToken } = request.body
	const { refreshToken } = request.cookies
	let newAccessToken = accessToken
	console.log("🔄 AccessToken avant vérification :", accessToken)
	try {
		console.log("userId :", userId)
		const user = userModel.getUserById(userId)
		if (!user)
			return reply.code(401).send({ success: false , error: 'User not found' })
		if (user.connection_status === "partially_connected" || accessToken == undefined || !accessToken)
			userModel.updateConnection(userId, "disconnected")
		if (accessToken) {
			const decodedAccess = fastify.jwt.decode(accessToken)
			const expiresInAccess = decodedAccess.exp - Math.floor(Date.now() / 1000)
			if (expiresInAccess <= 0 && refreshToken) {
				console.log("accessToken :", accessToken)
				console.log("refreshToken :", refreshToken)
				const decodedRefresh = fastify.jwt.decode(refreshToken)
				const expiresInRefresh = decodedRefresh.exp - Math.floor(Date.now() / 1000)
				if (expiresInRefresh > 0)
					newAccessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '1m' })
				else {
					newAccessToken = null
					userModel.updateConnection(userId, "disconnected")
					reply.clearCookie('refreshToken', { path: '/' })
				}
			}
			
		}
		if (!user.doubleAuth_enabled && user.doubleAuth_secret)
			userModel.updateDoubleAuth_secret(userId, null)
		const updateUser = userModel.getUserById(userId)
		return reply.code(200).send({ success: true, connection_status: updateUser.connection_status, accessToken: newAccessToken, message: 'User infos refreshed' })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}