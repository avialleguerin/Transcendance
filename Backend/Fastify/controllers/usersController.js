import { fastify, log } from '../server.js'
import usersModel from '../models/usersModel.js'
import { hashPassword, verifyPassword } from '../utils/hashUtils.js'
import { redisModel } from '../models/redisModel.js'
import { getUserFromToken } from './utils.js'
import friendshipsModel from '../models/friendshipsModel.js'; //NOTE - new
import gamesModel from '../models/gamesModel.js'; //NOTE - new
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import fs from 'fs/promises'
import path from 'path'
// import { get } from 'http'

const uploadDir = '/usr/share/nginx/uploads'
const SECRET_LENGHT = 30

export async function googleConfig(request, reply) {
	try {
		fastify.log.debug("ID du client Google :", process.env.GOOGLE_CLIENT_ID);
        return {
            success: true,
            client_id: process.env.GOOGLE_CLIENT_ID
        };
    } catch (err) {
        console.error("❌ Erreur lors de la récupération de la config Google :", err);
        reply.code(500).send({ error: 'Erreur serveur' });
    }
}

export async function googleSignIn(request, reply) {
	try {
		const { access_token } = request.body;
		if (!access_token) {
			return reply.code(400).send({ 
				success: false, 
				error: 'Google access_token is required' 
			});
		}

		const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
		
		if (!response.ok) {
			fastify.log.error('Google API error:', response.status);
			return reply.code(401).send({ 
				success: false, 
				error: 'Invalid Google access token' 
			});
		}

		const googleUser = await response.json();
		if (!googleUser.id)
			return reply.code(401).send({ success: false, error: 'Invalid Google user data'});
		
		const { id: googleId, name, picture: profilePictureUrl } = googleUser;
		
		let user = usersModel.getUserByGoogleId(googleId);
		if (!user || user.anonymized_at) {

			if (user && user.anonymized_at)
				fastify.log.info(`User with Google ID ${googleId} was previously anonymized, creating new account`);
		
			
			const username = name.replace(/\s+/g, '').toLowerCase().substring(0,10);
			const randomPassword = Math.random().toString(36).substring(2, 17);
			const hashedPassword = await hashPassword(randomPassword);
			
			let profilePicture = "default-profile-picture.png";
			if (profilePictureUrl) {
				try {
					const imageResponse = await fetch(profilePictureUrl);
					if (imageResponse.ok) {
						const imageBuffer = await imageResponse.arrayBuffer();
						const buffer = Buffer.from(imageBuffer);
						
						const contentType = imageResponse.headers.get('content-type');
						let extension = '.jpg';
						if (contentType?.includes('png')) extension = '.png';
						else if (contentType?.includes('gif')) extension = '.gif';
						else if (contentType?.includes('webp')) extension = '.webp';
						
						const filename = `${Date.now()}-${username}-pp${extension}`;
						const filePath = path.join(uploadDir, filename);
						
						await fs.writeFile(filePath, buffer);
						profilePicture = filename;
						
						fastify.log.info(`✅ Google profile picture saved: ${filename}`);
					} else {
						fastify.log.warn('Failed to download Google profile picture');
					}
				} catch (error) {
					fastify.log.error('Error downloading Google profile picture:', error);
				}
			}
			
			const newUserInfo = usersModel.createGoogleUser(username, hashedPassword, googleId, profilePicture);
			user = usersModel.getUserById(newUserInfo.lastInsertRowid);
		}
		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '15m' });
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, { expiresIn: '7d' });
		
		usersModel.updateLastConnection(user.userId);
		
		return reply.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			}).code(200).send({ success: true, message: 'Google Sign-In successful', connection_status: "connected", user: user, accessToken: accessToken });
			
	} catch (error) {
		fastify.log.error('Google Sign-In error:', error);
		return reply.code(500).send({ success: false, error: 'Google Sign-In failed' });
	}
}

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
	const usernameRegex = /^[A-Za-z0-9._-]+$/;
	if (!usernameRegex.test(username))
		return reply.code(400).send({ error: 'Username can only contain letters, numbers, dots, underscores, and hyphens' })
	// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	// if (!passwordRegex.test(password))
	// 	return reply.code(400).send({ error: 'Your password doesn\'t respect the conditions' })
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
		fastify.log.info("username : " + username)
		const user = usersModel.getUserByUsername(username)
		
		// Vérifier si l'utilisateur existe
		if (!user) {
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		}
		
		// Vérifier si l'utilisateur a été anonymisé
		if (user.anonymized_at) {
			fastify.log.warn(`Tentative de connexion d'un utilisateur anonymisé: ${username}`)
			return reply.code(401).send({ success: false, error: 'This account has been deleted' })
		}
		
		// Vérifier le mot de passe
		if (!await verifyPassword(user.password, password)) {
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		}
		
		if (user.doubleAuth_status)
			return reply.code(200).send({success: true, connection_status: "partially_connected", message: 'Double authentication required', user: user})
		
		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, {expiresIn: '15m' })
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, {expiresIn: '7d' })
		
		if (!accessToken || !refreshToken)
			return reply.code(500).send({ error: 'Internal Server Error' })
		usersModel.updateLastConnection(user.userId)
		usersModel.updateOnlineStatus(user.userId, 1)
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
		fastify.log.error("Error during login : " + err.message)
		return reply.code(500).send({ error: err.message })
	}
}

export async function login1v1(request, reply) {
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
		const player2 = usersModel.getUserByUsername(username)
		if (!player2 || !await verifyPassword(player2.password, password))
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		
		
		// Vérifier si l'adversaire a été anonymisé
		if (player2.anonymized_at) {
			return reply.code(401).send({ success: false, error: 'This account has been deleted' })
		}
		
		// Vérifier le mot de passe
		if (!await verifyPassword(player2.password, password)) {
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		}
		usersModel.updateLastConnection(player2.userId)
		reply.code(200).send({ success: true, message: 'Opponent logged in', user: user, player2: player2, accessToken: accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function login2v2(request, reply) {
	const { username2, password2, username3, password3, username4, password4 } = request.body
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
		const player2 = usersModel.getUserByUsername(username2)
		const player3 = usersModel.getUserByUsername(username3)
		const player4 = usersModel.getUserByUsername(username4)
		if (!player2 || !await verifyPassword(player2.password, password2))
			return reply.code(401).send({ success: false, error: 'Player 2: Invalid credentials' })
		if (!player3 || !await verifyPassword(player3.password, password3))
			return reply.code(401).send({ success: false, error: 'Player 3: Invalid credentials' })
		if (!player4 || !await verifyPassword(player4.password, password4))
			return reply.code(401).send({ success: false, error: 'Player 4: Invalid credentials' })
		usersModel.updateLastConnection(player2.userId)
		usersModel.updateLastConnection(player3.userId)
		usersModel.updateLastConnection(player4.userId)
		reply.code(200).send({ success: true, message: 'Opponents logged in', player1: user, player2: player2, player3: player3, player4: player4, accessToken: accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function logout(request, reply) {
	// const { username } = request.body
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
	// const user = usersModel.getUserByUsername(username)
	// usersModel.updateOnlineStatus(user.userId, 0)
	reply.code(200).send({ success: true, message: 'Logged out' })
}

export async function updateDoubleAuth(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		if (!user)
			return reply.code(404).send({ success: false, error: 'User not found' })
		if (user.doubleAuth_status || user.doubleAuth_secret !== null)
		{
			usersModel.updateDoubleAuth_status(user.userId, 0)
			usersModel.updateDoubleAuth_secret(user.userId, null)
			return reply.code(200).send({success: true, message: "2FA disabled successfully!", doubleAuth_secret: false})
		}
		const doubleAuthData = generateDoubleAuth(user.userId)

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
					fastify.log.info(`🗑️ Deleting old profile picture: ${oldFilePath}`);
					await fs.unlink(oldFilePath);
				} else {
					fastify.log.info(`⚠️ Old profile picture doesn't exist: ${oldFilePath}`);
				}
			} catch (deleteErr) {
				fastify.log.error(`❌ Error deleting old profile picture: ${deleteErr.message}`);
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
		fastify.log.error("❌ Error uploading new profile picture :", err);
		return reply.code(500).send({ error: err.message });
	}
}

export async function deleteAccount(request, reply) {
	try {
		const { refreshToken } = request.cookies
		const infos = await getUserFromToken(request)
		fastify.log.info("infos :" + infos)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(404).send({ error: 'User not found' })
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
					fastify.log.info(`🗑️ deleting old profile picture: ${oldFilePath}`);
					await fs.unlink(oldFilePath);
				} else {
					fastify.log.info(`⚠️ Old profile picture doesn't exist: ${oldFilePath}`);
				}
			} catch (deleteErr) {
				fastify.log.error(`❌ Error deleting old profile picture: ${deleteErr.message}`);
			}
		}
		// const info = usersModel.delete(user.userId)
		const info = usersModel.anonymizeUser(user.userId) // Anonymiser l'utilisateur au lieu de le supprimer complètement // Cela préserve les références dans les parties
			
			
		if (info.changes === 0)
			return reply.code(404).send({ error: "User not found" })
		// return reply.send({ success: true, message: "User deleted successfully"})
		console.log(`🔒 User ${user.username} (ID: ${user.userId}) has been anonymized`)
		return reply.send({ success: true, message: "Account anonymized successfully"})
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
			usersModel.updateLastConnection(user.userId)
			reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			})
			.send({ success:true, message: '2FA validated successfully!', username: user.username, profile_picture: user.profile_picture, connection_status: "connected", accessToken: accessToken })
		} else
			return reply.code(401).send({ success: false, error: 'Invalid 2FA code' })
	} catch (err) {
		fastify.log.error(err)
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
		return reply.code(200).send({ success: true, user: user, deleted_account: user.deleted_at , accessToken: accessToken, message: 'User infos refreshed' }) //REVIEW - Security of envoi du user en entier
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
		
		const games = gamesModel.getGamesByUserId(user.userId);
		
		const friendships = friendshipsModel.getFriendshipsByUserId(user.userId);
		
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
		fastify.log.error('Error exporting user data:', error);
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
			return reply.code(401).send({ success: false, error: 'User not found' })
		
		const anonymizedUsername = `Anonym${user.userId}`;
		const anonymizedProfilePicture = "default-profile-picture.png";
		
		usersModel.updateUsername(user.userId, anonymizedUsername);
		usersModel.updateProfilePicture(user.userId, anonymizedProfilePicture);
		
		return reply.code(200).send({ success: true, message: 'User account anonymized successfully' });
	} catch (error) {
		fastify.log.error(`\x1b[31mError anonymizing user account: ${error.message}\x1b[0m`);
		return reply.code(500).send({ success: false, error: 'Failed to anonymize user account : ' + error.message });
	}
}