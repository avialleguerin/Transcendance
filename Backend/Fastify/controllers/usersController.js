import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import { hashPassword, verifyPassword } from '../utils/hashUtils.js'
import { redisModel } from '../models/redisModel.js'
import { getUserFromToken } from './utils.js'
import friendshipsModel from '../models/friendshipsModel.js'; //NOTE - new
import gamesModel from '../models/gamesModel.js'; //NOTE - new
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import fs from 'fs/promises';
import path from 'path';

const uploadDir = '/usr/share/nginx/uploads'
const SECRET_LENGHT = 30

export async function getUserProfile(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(401).send({ error: 'Unauthorized' })
		const imgUrl = `uploads/${user.profile_picture}`
		return reply.code(200).send({ success: true, user: user, accessToken: accessToken, profile_picture: imgUrl })
	} catch (error) {
		reply.code(500).send({ error: 'Internal Server Error' })
	}
}

export async function getUserProfilePicture(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(401).send({ error: 'Unauthorized' })
		const imgUrl = `uploads/${user.profile_picture}`
		return reply.code(200).send({ success: true, username: user.username, accessToken: accessToken, profile_picture: imgUrl })
	} catch (error) {
		reply.code(500).send({ error: 'Internal Server Error' })
	}
}

export async function createUser(request, reply) {
	const { username, password } = request.body

	if (!username || !password)
		return reply.code(400).send({ error: 'Username and Password are required' })

	const sameUsername = usersModel.getUserByUsername(username)
	if (sameUsername)
		return reply.code(409).send({ error: "This username is already used" })
	try {
		const hashedPassword = await hashPassword(password)
		const info = usersModel.createUser(username, hashedPassword)
		return reply.code(201).send({ success: true, id: info.lastInsertRowid, username, message: 'Account created successfully' })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function login(request, reply) {
	const { username, password } = request.body
	try {
		console.log("username :", username)
		const user = usersModel.getUserByUsername(username)
		if (!user || !await verifyPassword(user.password, password))
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		if (user.doubleAuth_status)
			return reply.code(200).send({success: true, connection_status: "partially_connected", message: 'Double authentication required', user: user})
		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, {expiresIn: '15m' })
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, {expiresIn: '7d' })
		if (!accessToken || !refreshToken)
			return reply.code(500).send({ error: 'Internal Server Error' })
		reply
		.setCookie('refreshToken', refreshToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
		})
		.code(200)
		.send({ success: true, message: 'Logged in', connection_status: "connected", user: user, doubleAuth_status: user.doubleAuth_status, accessToken: accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function loginOpponent(request, reply) {
	const { username, password } = request.body
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(401).send({ error: 'Unauthorized' })
		if (!accessToken)
			return reply.code(401).send({ error: 'Unauthorized' })
		const opponent = usersModel.getUserByUsername(username)
		if (!opponent || !await verifyPassword(opponent.password, password))
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })

		reply.code(200).send({ success: true, message: 'Opponent logged in', user: user, opponent: opponent, accessToken: accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function logout(request, reply) {
	const accessToken = request.headers.authorization?.split(' ')[1]
	const { refreshToken } = request.cookies
	if (!accessToken || accessToken === "undefined")
		return reply.code(401).send({ success: false, error: 'Access token is missing' })
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
	reply.code(200).send({ success: true, message: 'Logged out' })
}

export async function updateDoubleAuth(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		// console.log("🔑 infos :", infos)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		if (!user)
			return reply.code(404).send({ success: false, error: 'User not found' })
		if (user.doubleAuth_status || user.doubleAuth_secret !== null)
		{
			usersModel.updateDoubleAuth_status(user.userId, 0)
			usersModel.updateDoubleAuth_secret(user.userId, null)
			// console.log("Double Auth disabled")
			return reply.code(200).send({success: true, message: "2FA disabled successfully!", doubleAuth_secret: false})
		}
		const doubleAuthData = generateDoubleAuth(user.userId)
		// console.log("Double Auth qrCode", (await doubleAuthData).qrCode)
		// console.log("Double Auth secret", (await doubleAuthData).secret)

		return reply.code(200).send({
			success: true,
			doubleAuth_status: true,
			message: 'Double authentication waiting for activation',
			secret: (await doubleAuthData).secret,
			qrCode: (await doubleAuthData).qrCode
		})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function accessProfileInfo(request, reply) {
	try {
		const { password } = request.body
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(404).send({ success: false, error: 'User not found' })
		if (!await verifyPassword(user.password, password))
			return reply.code(401).send({ success: false, error: 'Invalid password' })
		else
			return reply.code(200).send({success: true, accessToken: accessToken, message: 'access to profile infos accepted ', user: user})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function changeProfile(request, reply) {
	const { newUsername, newPassword } = request.body
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(404).send({ success: false, error: 'User not found' })
		if (newUsername) {
			const sameUsername = usersModel.getUserByUsername(newUsername)
			if (sameUsername)
				return reply.code(409).send({ error: "This username is already used" })
			usersModel.updateUsername(user.userId, newUsername)
		} if (newPassword) {
			const hashedPassword = await hashPassword(newPassword)
			usersModel.updatePassword(user.userId, hashedPassword)
		}
		return reply.code(200).send({ success: true, accessToken: accessToken, message: 'Profile updated successfully!' })
} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function changeProfilePicture(request, reply) {
	try {
		const file = await request.body['profile-picture'];
		if (!file)
			return reply.code(400).send({ error: 'No file uploaded' })

		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(404).send({ error: 'User not found' })

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

		usersModel.updateProfilePicture(user.userId, filename)

		reply.code(200).send({
			success: true,
			accessToken: accessToken,
			message: 'Profile picture updated successfully!',
			path: `/uploads/${filename}`
		});
	} catch (err) {
		console.error("❌ Error uploading new profile picture :", err);
		return reply.code(500).send({ error: err.message });
	}
}

export async function deleteAccount(request, reply) {
	try {
		const { refreshToken } = request.cookies
		const infos = await getUserFromToken(request)
		console.log("infos :", infos)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(404).send({ error: 'User not found' })

		 // Anonymize user before deletion
		 try {
            const anonymizedUsername = `Anonym${user.userId}`;
            const anonymizedProfilePicture = "default-profile-picture.png";
            
            usersModel.updateUsername(user.userId, anonymizedUsername);
            usersModel.updateProfilePicture(user.userId, anonymizedProfilePicture);
            console.log(`🔒 User ${user.username} anonymized before deletion`);
        } catch (anonymizeError) {
            console.error(`❌ Error anonymizing user before deletion: ${anonymizeError.message}`);
            // Continue with deletion even if anonymization fails
        }
		
		if (refreshToken && refreshToken !== undefined && refreshToken !== null) {
			const decodedRefresh = fastify.jwt.decode(refreshToken)
			const expiresInRefresh = decodedRefresh.exp - Math.floor(Date.now() / 1000)
			if (expiresInRefresh > 0)
				redisModel.addToBlacklist(refreshToken, expiresInRefresh)
			reply.clearCookie('refreshToken', { path: '/' })
		}
		if (accessToken && accessToken !== undefined && accessToken !== null) {
			const decodedAccess = fastify.jwt.decode(accessToken)
			const expiresInAccess = decodedAccess.exp - Math.floor(Date.now() / 1000)
			if (expiresInAccess > 0)
				redisModel.addToBlacklist(accessToken, expiresInAccess)
		}
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
		const info = usersModel.delete(user.userId)
		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" })
		return reply.send({ success: true, message: "User deleted successfully"})
	} catch (err) {
		fastify.log.error(err)
		return reply.code(500).send({ error: err.message })
	}
}

export async function verifyDoubleAuth(request, reply) {
	const { userId, code } = request.body
	try {
		const user = usersModel.getUserById(userId)
		if (!user)
			return reply.code(400).send({ success: false, error: 'User not found' })
		if (!user.doubleAuth_secret)
			return reply.code(400).send({ success: false, error: '2FA not enabled' })

		const isValid = speakeasy.totp.verify({
			secret: user.doubleAuth_secret,
			encoding: 'base32',
			token: code,
			window: 1
		})

		if (isValid) {
			const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '15m' })
			const refreshToken = fastify.jwt.sign({ userId: user.userId }, { expiresIn: '7d' })
			usersModel.updateDoubleAuth_status(user.userId, 1)
			reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			})
			.send({ success:true, message: '2FA validated successfully!', username: user.username, connection_status: "connected", accessToken: accessToken })
		} else {
			usersModel.updateDoubleAuth_secret(userId, null)
			return reply.code(401).send({ success: false, error: 'Invalid 2FA code' })
		}
	} catch (err) {
		console.error(err)
		return reply.code(500).send({ success: false, error: 'Internal server error' })
	}
}

export async function activateDoubleAuth(request, reply) {
	const { code } = request.body
	const infos = await getUserFromToken(request)
	if (!infos)
		return reply.code(401).send({ success: false, error: 'Unauthorized' })
	const user = infos.user
	if (!user)
		return reply.code(401).send({ success: false, error: 'User not found' })
	const isValid = speakeasy.totp.verify({
		secret: user.doubleAuth_secret,
		encoding: 'base32',
		token: code,
		window: 1
	})
	if (isValid) {
		usersModel.updateDoubleAuth_status(user.userId, 1)
		return reply.send({ success: true, message: "2FA successfully activated" })
	} else {
		return reply.code(400).send({ 
			success: false, 
			error: "Verification failed. Please try scanning the QR code again."
		})
	}
}

export async function generateDoubleAuth(userId) {
	const user = usersModel.getUserById(userId)
	if (!user) {
		throw new Error(`User with ID ${userId} not found`)
	}
	const secretObj = speakeasy.generateSecret({ length: SECRET_LENGHT })
	const secret = secretObj.base32
	usersModel.updateDoubleAuth_secret(userId, secret)

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

	try {
		const infos = await getUserFromToken(request, reply)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(401).send({ success: false , error: 'User not found' })
		if (!user.doubleAuth_status && user.doubleAuth_secret)
			usersModel.updateDoubleAuth_secret(user.userId, null)
		return reply.code(200).send({ success: true, user: user, accessToken: accessToken, message: 'User infos refreshed' })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}



export async function exportUserData(request, reply) {
	  try {
		const infos = await getUserFromToken(request, reply)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(401).send({ success: false , error: 'User not found' })

		delete user.password;
		delete user.doubleAuth_secret;
		
		const games = await gamesModel.getGamesByUserId(user.userId);
		
		const friendships = await friendshipsModel.getFriendshipsByUserId(user.userId);
		
		const exportData = {
			personal_information: {
				userId: user.userId,
				username: user.username,
				profile_picture: user.profile_picture,
				created_at: user.created_at,
				doubleAuth_status: !!user.doubleAuth_status
			},
			games_history: games,
			friendships: friendships
		};
		
		reply.header('Content-Disposition', 'attachment; filename="user-data-export.json"');
		reply.type('application/json');
		
		return reply.code(200).send(JSON.stringify({ success: true, ...exportData }, null, 2));
	} catch (error) {
		console.error('Error exporting user data:', error);
		return reply.code(500).send({ success: false, error: 'Failed to export user data' });
	}
}

export async function anonymizeUser(request, reply) {
	try {
		const infos = await getUserFromToken(request, reply)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ success: false , error: 'User not found' })
		
		const anonymizedUsername = `Anonym${user.userId}`;
		const anonymizedProfilePicture = "default-profile-picture.png";
		
		usersModel.updateUsername(user.userId, anonymizedUsername);
		usersModel.updateProfilePicture(user.userId, anonymizedProfilePicture);
		
		return reply.code(200).send({ success: true, message: 'User account anonymized successfully' });
	} catch (error) {
		// ADD color in log
		console.error(`\x1b[31mError anonymizing user account: ${error.message}\x1b[0m`);
		// console.error( 'Error anonymizing user account:', error);
		return reply.code(500).send({ success: false, error: 'Failed to anonymize user account : ' + error.message });
	}
}