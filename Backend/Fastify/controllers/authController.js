import { fastify } from '../server.js'
import userModel from '../models/userModel.js'
import { hashPassword, verifyPassword } from '../utils/hashUtils.js'
import { redisModel } from '../models/redisModel.js'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import fs from 'fs/promises';
import path from 'path';
import { get } from 'http'

const uploadDir = '/usr/share/nginx/uploads'
const SECRET_LENGHT = 30

async function getUserFromToken(request) {
	const accessToken = request.headers.authorization?.split(' ')[1];
	console.log("Access token :", accessToken)
	if (!accessToken || accessToken === "undefined" || accessToken === "null")
		return null
	const decoded = fastify.jwt.verify(accessToken);
	const userId = decoded.userId
	if (!userId)
		return null
	return userModel.getUserById(userId);
}

export async function selectUsers(request, reply) {
	try {
		const users = userModel.getAllUsers()
		return users
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function getUserProfile(request, reply) {
	try {
		const user = await getUserFromToken(request)
		if (!user)
			return reply.code(401).send({ error: '❌ Unauthorized' })
		const imgUrl = `uploads/${user.profile_picture}`
		return reply.send({ user, profile_picture: imgUrl })
	} catch (error) {
		reply.code(500).send({ error: '❌ Internal Server Error' })
	}
}

export async function register(request, reply) {
	const { username, email, password } = request.body

	if (!username || !password)
		return reply.code(400).send({ error: '❌ Username, Email and Password are required' })

	const sameUsername = userModel.getUserByUsername(username)
	if (sameUsername)
		return reply.code(409).send({ error: "❌ This username is already used" })
	const sameEmail = userModel.getUserByEmail(email)
	if (sameEmail)
		return reply.code(409).send({ error: "❌ This email is already used" })
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
	try {
		const user = userModel.getUserByEmail(email)
		if (!user || !await verifyPassword(user.password, password))
			return reply.code(401).send({ success: false, error: '❌ Invalid credentials' })
		if (user.doubleAuth_enabled)
			return reply.code(200).send({success: true, connection_status: "partially_connected", message: 'Double authentication required', user: user})
		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, {expiresIn: '15m' })
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, {expiresIn: '7d' })
		if (!accessToken || !refreshToken)
			return reply.code(500).send({ error: '❌ Internal Server Error' })
		reply
		.setCookie('refreshToken', refreshToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
		})
		.send({ success:true, message: 'Logged in', connection_status: "connected", doubleAuth_enabled: user.doubleAuth_enabled, accessToken: accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function logout(request, reply) {
	const { accessToken } = request.body
	const { refreshToken } = request.cookies
	if (!accessToken || accessToken === "undefined")
		return reply.code(401).send({ success: false, error: '❌ Access token is missing' })
	if (accessToken && accessToken !== "undefined") {
		const decoded = fastify.jwt.decode(accessToken)
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
		if (expiresIn > 0)
			redisModel.addToBlacklist(accessToken, expiresIn)
	}
	if (refreshToken && refreshToken !== "undefined") {
		const decoded = fastify.jwt.decode(refreshToken)
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
		if (expiresIn > 0)
			redisModel.addToBlacklist(refreshToken, expiresIn)
		reply.clearCookie('refreshToken', { path: '/' })
	}
	reply.send({ success: true, message: 'Logged out' })
}

export async function changeDoubleAuth(request, reply) {
	try {
		const user = await getUserFromToken(request)
		if (user){
			if (user.doubleAuth_enabled || user.doubleAuth_secret !== null)
			{
				userModel.updateDoubleAuth(userId, 0)
				userModel.updateDoubleAuth_secret(userId, null)
				// console.log("Double Auth disabled")
				return reply.code(200).send({message: "Double Auth disabled"})
			}
			const doubleAuthData = generateDoubleAuth(user.userId)
			// console.log("Double Auth qrCode", (await doubleAuthData).qrCode)
			// console.log("Double Auth secret", (await doubleAuthData).secret)

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
			return reply.code(404).send({ success: false, error: '❌ User not found' })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function accessProfileInfo(request, reply) {
	try {
		const { password } = request.body
		const user = await getUserFromToken(request)
		if (!user)
			return reply.code(404).send({ success: false, error: '❌ User not found' })
		if (!await verifyPassword(user.password, password))
			return reply.code(401).send({ success: false, error: '❌ Invalid password' })
		else
			return reply.code(200).send({success:true, message: 'access to profile infos accepted ', user: user})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function changeProfile(request, reply) {
	const { newUsername, newEmail, newPassword } = request.body
	try {
		const user = await getUserFromToken(request)
		if (user){
			if (newUsername)
			{
				const sameUsername = userModel.getUserByUsername(newUsername)
				if (sameUsername)
					return reply.code(409).send({ error: "❌ This username is already used" })
				userModel.updateUsername(user.userId, newUsername)
			}
			if (newEmail)
			{
				const sameEmail = userModel.getUserByEmail(newEmail)
				if (sameEmail)
					return reply.code(409).send({ error: "❌ This email is already used" })
				userModel.updateEmail(user.userId, newEmail)
			}
			if (newPassword)
			{
				const hashedPassword = await hashPassword(newPassword)
				userModel.updatePassword(user.userId, hashedPassword)
			}
			return reply.code(200).send({ success: true, message: 'Profile updated successfully!' })
		} else
			return reply.code(404).send({ success: false, error: '❌ User not found' })
} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function changeProfilePicture(request, reply) {
	try {
		const file = await request.body['profile-picture'];
		if (!file)
			return reply.code(400).send({ error: '❌ No file uploaded' })

		const user = await getUserFromToken(request)
		if (!user)
			return reply.code(404).send({ error: '❌ User not found' })

		const filename = `${Date.now()}-${user.username}-pp${path.extname(file.filename)}`;
		const filePath = path.join(uploadDir, filename);

		if(file._buf) {
			await fs.writeFile(filePath, file._buf);
		} else {
			const fileStream = await fs.open(filePath, 'w');
			const writeStream = fileStream.createWriteStream();
			await pipeline(file.file, writeStream);
		}


		const oldProfilePicture = user.profile_picture;

		if (oldProfilePicture !== "default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture);
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false);
				
				if (fileExists) {
					console.log(`🗑️ Deleting old profile picture: ${oldFilePath}`);
					await fs.unlink(oldFilePath);
				} else {
					console.log(`⚠️ Old profile picture doesn't exist: ${oldFilePath}`);
				}
			} catch (deleteErr) {
				console.error(`❌ Error deleting old profile picture: ${deleteErr.message}`);
			}
		}

		userModel.updateProfilePicture(user.userId, filename)

		reply.code(200).send({
			success: true,
			message: 'New profile picture uploaded successfully!',
			path: `/uploads/${filename}`
		});
	} catch (err) {
		console.error("❌ Error uploading new profile picture :", err);
		return reply.code(500).send({ error: err.message });
	}
}

export async function unregister(request, reply) {
	const refreshToken = request.cookies.refreshToken
	const accessToken = request.headers['authorization']?.split(' ')[1]
	if (refreshToken && refreshToken !== "undefined") {
		const decodedRefresh = fastify.jwt.decode(refreshToken)
		const expiresInRefresh = decodedRefresh.exp - Math.floor(Date.now() / 1000)
		if (expiresInRefresh > 0)
			redisModel.addToBlacklist(refreshToken, expiresInRefresh)
		reply.clearCookie('refreshToken', { path: '/' })
	}
	if (accessToken && accessToken !== "undefined") {
		const decodedAccess = fastify.jwt.decode(accessToken)
		const expiresInAccess = decodedAccess.exp - Math.floor(Date.now() / 1000)
		if (expiresInAccess > 0)
			redisModel.addToBlacklist(accessToken, expiresInAccess)
	}
	try {
		const user = await getUserFromToken(request)
		if (!user)
			return reply.code(404).send({ error: '❌ User not found' })
		const oldProfilePicture = user.profile_picture;
		if (oldProfilePicture !== "default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture);
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false);
				
				if (fileExists) {
					console.log(`🗑️ deleting old profile picture: ${oldFilePath}`);
					await fs.unlink(oldFilePath);
				} else {
					console.log(`⚠️ Old profile picture doesn't exist: ${oldFilePath}`);
				}
			} catch (deleteErr) {
				console.error(`❌ Error deleting old profile picture: ${deleteErr.message}`);
			}
		}
		const info = userModel.unregister(user.userId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "❌ User not found" })
		return reply.send({ success: true, message: "❌ User deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}

// export async function refreshAccessToken(request, reply) {
// 	const { refreshToken } = request.cookies

// 	if (!refreshToken || refreshToken === "undefined")
// 		return reply.code(401).send({ error: '❌ Refresh token is missing'})
// 	try {
// 		if (await redisModel.isTokenBlacklisted(refreshToken))
// 			return reply.code(401).send({ error: '❌ Refresh token is blacklisted' })

// 		const payload = fastify.jwt.verify(refreshToken)
// 		console.log("payload :", payload)

// 		const newAccessToken = fastify.jwt.sign({ userId: payload.userId }, { expiresIn: '15m' })
// 		console.log("newAccessToken :", newAccessToken)
// 		return newAccessToken
// 	} catch (err) {
// 		return reply.code(403).send({ success: false, error: '❌ Invalid refresh token' })
// 	}
// }

export async function verifyDoubleAuth(request, reply) {
	const { code } = request.body
	try {
		const user = await getUserFromToken(request)
		if (!user || !user.doubleAuth_secret) {
			return reply.code(400).send({ success: false, error: '❌ 2FA not enabled or user not found' })
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
			const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '15m' })
			const refreshToken = fastify.jwt.sign({ userId: user.userId }, { expiresIn: '7d' })
			console.log("🔑 Access Token created :", accessToken)
			console.log("🔑 Refresh Token created :", refreshToken)
			userModel.updateDoubleAuth(user.userId, 1)
			reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			})
			.send({ success:true, message: '2FA code is valid', connection_status: "connected", accessToken: accessToken })
		} else {
			userModel.updateDoubleAuth_secret(userId, null)
			console.error("❌ Invalid 2FA code")
			return reply.code(401).send({ success: false, error: '❌ Invalid 2FA code' })
		}
	} catch (err) {
		console.error(err)
		return reply.code(500).send({ success: false, error: '❌ Internal server error' })
	}
}

export async function activateDoubleAuth(request, reply) {
	const { code } = request.body
	const user = await getUserFromToken(request)
	if (!user)
		return reply.code(401).send({ success: false, error: '❌ User not found' })
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
			error: "❌ Verification failed. Please try scanning the QR code again."
		})
	}
}

export async function generateDoubleAuth(userId) {
	const user = await getUserFromToken(request)
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
	const accessToken = request.headers.authorization?.split(' ')[1];
	const { refreshToken } = request.cookies
	console.log("Request headers :", request.headers)

	try {
		let newAccessToken = null
		const user = await getUserFromToken(request)
		console.log("User :", user)
		if (!user)
			return reply.code(401).send({ success: false , error: '❌ User not found' })
		if (refreshToken && refreshToken !== "undefined") {
			const decodedRefresh = fastify.jwt.decode(refreshToken)
			const expiresInRefresh = decodedRefresh.exp - Math.floor(Date.now() / 1000)
			if (expiresInRefresh > 0) {
				newAccessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '15m' })
				if (accessToken && accessToken !== "undefined") {
					const decodedAccess = fastify.jwt.decode(accessToken)
					const expiresInAccess = decodedAccess.exp - Math.floor(Date.now() / 1000)
					if (expiresInAccess > 0)
						redisModel.addToBlacklist(accessToken, expiresInAccess)
				}
			} else
				reply.clearCookie('refreshToken', { path: '/' })
			if (!user.doubleAuth_enabled && user.doubleAuth_secret)
				userModel.updateDoubleAuth_secret(user.userId, null)
		}
		return reply.code(200).send({ success: true, accessToken: newAccessToken, message: 'User infos refreshed' })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}