import { fastify, log } from '../server.js'
import usersModel from '../models/usersModel.js'
import { hashPassword, verifyPassword } from '../utils/hashUtils.js'
import { redisModel } from '../models/redisModel.js'
import { getUserFromToken, sanitizeInput } from './utils.js'
import friendshipsModel from '../models/friendshipsModel.js'
import sendWelcomeEmail from '../utils/mailer.js'
import gamesModel from '../models/gamesModel.js'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import fs from 'fs/promises'
import path from 'path'
import { generateRandomString } from './utils.js'
import { getUserConnection, notifyAllFriends } from '../utils/websocket.js'
import { verify } from 'crypto'

const uploadDir = '/usr/share/nginx'
const SECRET_LENGHT = 30

const IMAGE_SECURITY = {
	MAGIC_BYTES: {
		PNG: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
		JPEG_FF_D8_FF_E0: [0xFF, 0xD8, 0xFF, 0xE0],
		JPEG_FF_D8_FF_E1: [0xFF, 0xD8, 0xFF, 0xE1],
		JPEG_FF_D8_FF_E2: [0xFF, 0xD8, 0xFF, 0xE2],
		JPEG_FF_D8_FF_E3: [0xFF, 0xD8, 0xFF, 0xE3],
		JPEG_FF_D8_FF_DB: [0xFF, 0xD8, 0xFF, 0xDB],
		JPEG_FF_D8_FF_EE: [0xFF, 0xD8, 0xFF, 0xEE]
	},
	MAX_FILE_SIZE: 5 * 1024 * 1024,
	ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg'],
	MAX_DIMENSIONS: { width: 2048, height: 2048 }
};

export async function googleConfig(request, reply) {
	try {
		return reply.code(200).send({ success: true, client_id: process.env.GOOGLE_CLIENT_ID })
	} catch (err) {
		reply.code(500).send({ error: 'Server error' })
	}
}

export async function googleSignIn(request, reply) {
	try {
		const { access_token } = request.body
		if (!access_token) return reply.code(400).send({ success: false, error: 'Unauthorized' })

		const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`)
		if (!response.ok) return reply.code(401).send({ success: false, error: 'Invalid Google access token' })
		const googleUser = await response.json()
		if (!googleUser.id) return reply.code(401).send({ success: false, error: 'Invalid Google user data'})
		
		const { id: googleId, name, picture: profilePictureUrl, email } = googleUser
		
		let user = usersModel.getUserByGoogleId(googleId)
		let isNewUser = false
		let tempPassword = null

		if (!user || user.deleted_at) {
			const username = generateUniqueGoogleUsername(name)
			const randomPassword = Math.random().toString(36).substring(2, 17)
			const hashedPassword = await hashPassword(randomPassword)

			tempPassword = randomPassword
			isNewUser = true
			
			let profilePicture = "/assets/image/default-profile-picture.png"
			if (profilePictureUrl) {
				try {
					const imageResponse = await fetch(profilePictureUrl)
					if (imageResponse.ok) {
						const imageBuffer = await imageResponse.arrayBuffer();
						const buffer = Buffer.from(imageBuffer);
						try {
							const imageValidation = await validateImageFile(buffer, 'google-profile.jpg');
							const secureFilename = generateSecureFilename(username, imageValidation.extension);
							const filePath = path.join(uploadDir, secureFilename);
							
							await fs.writeFile(filePath, buffer);
							profilePicture = secureFilename;
						} catch (validationError) {
							profilePicture = "/assets/image/default-profile-picture.png";
						}
					} else {
						fastify.log.warn(`Failed to download Google profile picture: ${imageResponse.status}`)
					}
				} catch (error) {
					fastify.log.error(`Error downloading Google profile picture: ${error.message}`)
				}
			}
			
			const newUserInfo = usersModel.createGoogleUser(username, hashedPassword, googleId, profilePicture)
			user = usersModel.getUserById(newUserInfo.lastInsertRowid)
		}

		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '15m' })
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, { expiresIn: '7d' })
		
		usersModel.updateLastActivity(user.userId)

		if (isNewUser && tempPassword && email) {
			try {
				await sendWelcomeEmail(email, user.username, tempPassword)
			} catch (emailError) {
				fastify.log.error(`Welcome email error: ${emailError.message}`)
			}
		}

		fastify.log.info(`Google sign-in successful for ${user.username}`)
		return reply.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			}).code(200).send({ 
				success: true, 
				message: 'Google Sign-In successful', 
				connection_status: "connected", 
				// user: user, //todo: change to multiple infos
				name: user.username,
				avatar: user.profile_picture,
				accessToken: accessToken 
			})
			
	} catch (error) {
		fastify.log.error(`Critical Google sign-in error: ${error.message}`)
		return reply.code(500).send({ success: false, error: 'Google Sign-In failed' })
	}
}

export async function getUserProfile(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		fastify.log.debug(`User profile requested - Infos: ${JSON.stringify(infos)}`)
		if (!infos) {
			fastify.log.warn('Profile access denied: Unauthorized request')
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		}

		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(401).send({ error: 'Unauthorized' })

		return reply.code(200).send({ success: true, user: user, accessToken: accessToken, profile_picture: user.profile_picture })
	} catch (error) {
		fastify.log.error(`Error retrieving user profile: ${error.message}`)
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

		return reply.code(200).send({ success: true, username: user.username, accessToken: accessToken, profile_picture: user.profile_picture })
	} catch (error) {
		fastify.log.error(`Error retrieving profile picture: ${error.message}`)
		reply.code(500).send({ error: 'Internal Server Error' })
	}
}

export async function createAccount(request, reply) {
	const { username, password } = request.body

	if (!username || !password)
		return reply.code(400).send({ error: 'Username and Password are required' })
	const sanitizedUsername = sanitizeInput(username, 'username')
	if (!sanitizedUsername.success)
		return reply.code(400).send({ error: sanitizedUsername.error })
	const sameUsername = usersModel.getUserByUsername(sanitizedUsername.input)
	if (sameUsername)
		return reply.code(409).send({ error: "This username is already used" })
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?@&*#])[A-Za-z\d!?@&*#]{8,20}$/;
	if (!passwordRegex.test(password))
		return reply.code(400).send({ error: 'Password must contain 8-20 characters, one lowercase, one uppercase, one number, and one special character (!?@&*#)' })
	try {
		const hashedPassword = await hashPassword(password)
		usersModel.createUser(username, hashedPassword)
		return reply.code(201).send({ success: true, message: 'Account created successfully' })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function login(request, reply) {
	const { username, password } = request.body
	try {
		fastify.log.info(`Login attempt for username: ${username}`)
		if (!sanitizeInput(username, 'username').success || !sanitizeInput(password, 'password').success)
			return reply.code(400).send({ error: "Invalid credentials" })
		const user = usersModel.getUserByUsername(username)
		
		if (!user) return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		if (getUserConnection(user.userId)) return reply.code(401).send({ success: false, error: 'You are already connected in another session' })
		if (user.deleted_at) return reply.code(401).send({ success: false, error: 'This account has been deleted' })
		if (!await verifyPassword(user.password, password)) return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		
		if (user.doubleAuth_status) {
			const ticket = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
			await redisModel.setex(`2fa_ticket_${ticket}`, 300, user.userId.toString())
			return reply.code(200).send({success: true, connection_status: "partially_connected", doubleAuth_status: user.doubleAuth_status, message: 'Double authentication required', ticket: ticket})
		}

		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, {expiresIn: '15m' })
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, {expiresIn: '7d' })
		
		if (!accessToken || !refreshToken)
			return reply.code(500).send({ error: 'Internal Server Error' })

		usersModel.updateLastActivity(user.userId)
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
		.send({ success: true,
			message: 'Logged in',
			connection_status: "connected",
			username: user.username,
			profile_picture: user.profile_picture,
			doubleAuth_status: user.doubleAuth_status,
			accessToken: accessToken
		})
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function login1v1(request, reply) {
	const { username, password } = request.body
	try {
		if (!sanitizeInput(username, 'username').success || !sanitizeInput(password, 'password').success)
			return reply.code(400).send({ error: "Invalid credentials" })
		const infos = await getUserFromToken(request)
		if (!infos || !infos.user || !infos.accessToken) return reply.code(401).send({ success: false, error: 'Unauthorized' })		
		const player2 = usersModel.getUserByUsername(username)
		if (!player2) return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		if (player2.deleted_at) return reply.code(401).send({ success: false, error: 'This account has been deleted' })
		if (!await verifyPassword(player2.password, password)) return reply.code(401).send({ success: false, error: 'Invalid credentials' })

		usersModel.updateLastActivity(player2.userId)
		reply.code(200).send({ success: true, message: 'Opponent logged in', user: infos.user, player2: player2, accessToken: infos.accessToken })
	} catch (err) { return reply.code(500).send({ error: err.message }) }
}

export async function login2v2(request, reply) {
	const { username2, password2, username3, password3, username4, password4 } = request.body
	try {
		if (!sanitizeInput(username2, 'username').success || !sanitizeInput(password2, 'password').success)
			return reply.code(400).send({ error: "Player 2: Invalid credentials" })
		if (!sanitizeInput(username3, 'username').success || !sanitizeInput(password3, 'password').success)
			return reply.code(400).send({ error: "Player 2: Invalid credentials" })
		if (!sanitizeInput(username4, 'username').success || !sanitizeInput(password4, 'password').success)
			return reply.code(400).send({ error: "Player 2: Invalid credentials" })
		const infos = await getUserFromToken(request)
		fastify.log.debug(`Login 2v2 attempt - Infos: ${JSON.stringify(infos)}`)
		if (!infos || !infos.user || !infos.accessToken) return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const player2 = usersModel.getUserByUsername(username2)
		const player3 = usersModel.getUserByUsername(username3)
		const player4 = usersModel.getUserByUsername(username4)
		if (!player2) return reply.code(401).send({ success: false, error: 'Player 2: User not found' })
		if (player2.deleted_at) return reply.code(401).send({ success: false, error: 'Player 2: This account has been deleted' })
		if (!await verifyPassword(player2.password, password2)) return reply.code(401).send({ success: false, error: 'Player 2: Invalid credentials' })
		if (!player3) return reply.code(401).send({ success: false, error: 'Player 3: User not found' })
		if (player3.deleted_at) return reply.code(401).send({ success: false, error: 'Player 3: This account has been deleted' })
		if (!await verifyPassword(player3.password, password3)) return reply.code(401).send({ success: false, error: 'Player 3: Invalid credentials' })
		if (!player4) return reply.code(401).send({ success: false, error: 'Player 4: User not found' })
		if (player4.deleted_at) return reply.code(401).send({ success: false, error: 'Player 4: This account has been deleted' })
		if (!await verifyPassword(player4.password, password4)) return reply.code(401).send({ success: false, error: 'Player 4: Invalid credentials' })

		usersModel.updateLastActivity(player2.userId)
		usersModel.updateLastActivity(player3.userId)
		usersModel.updateLastActivity(player4.userId)
		reply.code(200).send({ success: true, message: 'Opponents logged in', accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function logout(request, reply) {
	const accessToken = request.headers.authorization?.split(' ')[1]
	const { refreshToken } = request.cookies
	
	if (!accessToken || accessToken === "undefined")
		return reply.code(401).send({ success: false, error: 'Access token is missing' })

	let username = 'unknown'
	try {
		const decoded = fastify.jwt.decode(accessToken)
		username = decoded?.username || 'unknown'
	} catch (decodeError) {
		fastify.log.warn(`Failed to decode token during logout: ${decodeError.message}`)
	}

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

export async function enableDoubleAuth(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ success: false, error: 'Unauthorized' })

		const user = infos.user
		if (!user) return reply.code(404).send({ success: false, error: 'User not found' })

		const doubleAuthData = await generateDoubleAuth(user.userId)

		return reply.code(200).send({ success: true, doubleAuth_status: true, message: 'Double authentication waiting for activation', secret: doubleAuthData.secret, qrCode: doubleAuthData.qrCode })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function disableDoubleAuth(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ success: false, error: 'Unauthorized' })

		const user = infos.user
		if (!user) return reply.code(404).send({ success: false, error: 'User not found' })

		usersModel.updateDoubleAuth_status(user.userId, 0)
		usersModel.updateDoubleAuth_secret(user.userId, null)

		return reply.code(200).send({ success: true, message: '2FA disabled successfully' })
	} catch (err) {
		fastify.log.error(`Critical error disabling double auth: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function accessProfileInfo(request, reply) {
	try {
		const { password } = request.body
		if (!sanitizeInput(password, 'password').success)
			return reply.code(400).send({ error: "Invalid password" })
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ success: false, error: 'Unauthorized' })

		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(404).send({ success: false, error: 'User not found' })

		if (!await verifyPassword(user.password, password))
			return reply.code(401).send({ success: false, error: 'Invalid password' })
		
		return reply.code(200).send({success: true, accessToken: accessToken, message: 'Access to profile infos accepted', user: user})
	} catch (err) {
		fastify.log.error(`Critical error accessing profile info: ${err.message}`)
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
		let newAccessToken = infos.accessToken
		if (!user)
			return reply.code(404).send({ success: false, error: 'User not found' })

		let updated = false
		if (newUsername) {
			const sanitizedUsername = sanitizeInput(newUsername, 'username')
			if (!sanitizedUsername.success)
				return reply.code(400).send({ error: sanitizedUsername.error })
			const username = sanitizedUsername.input
			if (username === user.username)
				return reply.code(400).send({ error: 'New username cannot be the same as the current username' })
			const sameUsername = usersModel.getUserByUsername(username)
			if (sameUsername)
				return reply.code(409).send({ error: "This username is already used" })
			usersModel.updateUsername(user.userId, username)
			newAccessToken = fastify.jwt.sign({ userId: user.userId, username: username }, { expiresIn: '15m' })

			const decoded = fastify.jwt.decode(infos.accessToken)
			const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
			if (expiresIn > 0) {
				redisModel.addToBlacklist(infos.accessToken, expiresIn)
			}
			updated = true
		} 
		
		if (newPassword) {
			const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?@&*#])[A-Za-z\d!?@&*#]{8,20}$/;
			if (!passwordRegex.test(newPassword))
				return reply.code(400).send({ error: 'Password must contain 8-20 characters, one lowercase, one uppercase, one number, and one special character (!?@&*#)' })
			fastify.log.info(`Updating password for user: ${user.username}`)
			const hashedPassword = await hashPassword(newPassword)
			usersModel.updatePassword(user.userId, hashedPassword)
			updated = true
		}

		if (updated)
			return reply.code(200).send({ success: true, accessToken: newAccessToken, message: 'Profile updated successfully!' })
		else
			return reply.code(200).send({ success: true, message: 'No changes made' })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}


function checkMagicBytes(buffer, magicBytes) {
	if (buffer.length < magicBytes.length) return false;
	for (let i = 0; i < magicBytes.length; i++)
		if (buffer[i] !== magicBytes[i]) return false;
	return true;
}

function validateImageType(buffer) {
	const { MAGIC_BYTES } = IMAGE_SECURITY;

	if (checkMagicBytes(buffer, MAGIC_BYTES.PNG))
		return { isValid: true, type: 'png', extension: '.png' };

	const jpegVariants = [
		MAGIC_BYTES.JPEG_FF_D8_FF_E0,
		MAGIC_BYTES.JPEG_FF_D8_FF_E1,
		MAGIC_BYTES.JPEG_FF_D8_FF_E2,
		MAGIC_BYTES.JPEG_FF_D8_FF_E3,
		MAGIC_BYTES.JPEG_FF_D8_FF_DB,
		MAGIC_BYTES.JPEG_FF_D8_FF_EE
	];

	for (const variant of jpegVariants)
		if (checkMagicBytes(buffer, variant))
			return { isValid: true, type: 'jpeg', extension: '.jpg' };

	return { isValid: false, type: null, extension: null };
}

async function validateImageFile(buffer, originalFilename) {
	if (buffer.length > IMAGE_SECURITY.MAX_FILE_SIZE)
		throw new Error(`File size too large. Maximum allowed: ${IMAGE_SECURITY.MAX_FILE_SIZE / (1024 * 1024)}MB`);

	const typeValidation = validateImageType(buffer);
	if (!typeValidation.isValid)
		throw new Error('Invalid image format. Only PNG, JPG and JPEG files are allowed.');

	const originalExt = path.extname(originalFilename).toLowerCase();
	if (!IMAGE_SECURITY.ALLOWED_EXTENSIONS.includes(originalExt))
		throw new Error('Invalid file extension. Only .png, .jpg, and .jpeg are allowed.');

	if (typeValidation.type === 'png' && !['.png'].includes(originalExt))
		fastify.log.warn(`File extension mismatch: ${originalExt} but detected PNG`);

	if (typeValidation.type === 'jpeg' && !['.jpg', '.jpeg'].includes(originalExt))
		fastify.log.warn(`File extension mismatch: ${originalExt} but detected JPEG`);
	return typeValidation;
}

function generateSecureFilename(username, extension) {
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 8);
	const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
	return `/uploads/${timestamp}-${sanitizedUsername}-${randomString}${extension}`;
}

export async function changeProfilePicture(request, reply) {
	try {
		const file = await request.body['profile-picture']
		if (!file) {
			fastify.log.warn('Profile picture update failed: No file uploaded')
			return reply.code(400).send({ 
				success: false, 
				error: 'No file uploaded' 
			});
		}

		const infos = await getUserFromToken(request);
		if (!infos)
			return reply.code(401).send({ 
				success: false, 
				error: 'Unauthorized' 
			});
		
		const user = infos.user;
		const accessToken = infos.accessToken;
		if (!user)
			return reply.code(404).send({ 
				success: false, 
				error: 'User not found' 
			});

		if (file.size && file.size > IMAGE_SECURITY.MAX_FILE_SIZE) {
			fastify.log.warn(`Uploaded file too large: ${file.size} bytes`);
			return reply.code(413).send({ 
				success: false, 
				error: `File size too large. Maximum allowed: ${IMAGE_SECURITY.MAX_FILE_SIZE / (1024 * 1024)}MB` 
			});
		}

		let fileBuffer;
		if (file._buf)
			fileBuffer = file._buf;
		else if (file.file) {
			const chunks = [];
			for await (const chunk of file.file)
				chunks.push(chunk);
			fileBuffer = Buffer.concat(chunks);
		} else {
			return reply.code(400).send({ 
				success: false, 
				error: 'Invalid file format' 
			});
		}

		let imageValidation;
		try {
			imageValidation = await validateImageFile(fileBuffer, file.filename);
			fastify.log.info(`Image validation passed: ${imageValidation.type} format detected`);
		} catch (validationError) {
			fastify.log.warn(`Image validation failed: ${validationError.message}`);
			return reply.code(400).send({ 
				success: false, 
				error: validationError.message 
			});
		}

		const secureFilename = generateSecureFilename(user.username, imageValidation.extension);
		const filePath = path.join(uploadDir, secureFilename);

		try {
			await fs.writeFile(filePath, fileBuffer);
			fastify.log.info(`Profile picture saved: ${secureFilename}`);
		} catch (writeError) {
			fastify.log.error(`Error writing file: ${writeError.message}`);
			return reply.code(500).send({ 
				success: false, 
				error: 'Failed to save image file' 
			});
		}

		const oldProfilePicture = user.profile_picture
		if (oldProfilePicture !== "/assets/image/default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture)
				const fileExists = await fs.access(oldFilePath)
					.then(() => true)
					.catch(() => false)
				
				if (fileExists) {
					fastify.log.info(`🗑️ Deleting old profile picture: ${oldFilePath}`);
					await fs.unlink(oldFilePath);
				} else
					fastify.log.info(`Old profile picture doesn't exist: ${oldFilePath}`);
			} catch (deleteErr) {
				fastify.log.error(`Error deleting old profile picture: ${deleteErr.message}`);
			}
		}

		usersModel.updateProfilePicture(user.userId, secureFilename);

		fastify.log.info(`Profile picture updated successfully for user: ${user.username}`)
		return reply.code(200).send({
			success: true,
			accessToken: accessToken,
			message: 'Profile picture updated successfully!',
			profile_picture: secureFilename
		})

	} catch (err) {
		fastify.log.error("Error uploading new profile picture:", err);
		return reply.code(500).send({ success: false, error: 'Internal server error while uploading image' });
	}
}

// Utility function to generate anonymous username
async function generateAnonymousUsername(userId) {
	const adjectives = ['Cool', 'Fast', 'Wild', 'Bold', 'Wise', 'Smart', 'Calm', 'Quick']
	const nouns = ['Cat', 'Fox', 'Wolf', 'Bear', 'Lion', 'Hawk', 'Tiger', 'Owl']
	
	let anonymizedUsername = ''
	let updateSuccess = false
	let attempts = 0
	const maxAttempts = 50 // Safety limit to prevent infinite loops
	
	while (!updateSuccess && attempts < maxAttempts) {
		const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
		const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
		const randomNumber = Math.floor(Math.random() * 9) + 1  // 1-9 (single digit)
		
		anonymizedUsername = `${randomAdjective}${randomNoun}${randomNumber}`
		
		// Ensure username is under 10 characters
		if (anonymizedUsername.length < 10) {
			try {
				const result = usersModel.updateUsername(userId, anonymizedUsername)
				if (result && result.changes > 0) {
					updateSuccess = true
					fastify.log.info(`Username updated successfully to: ${anonymizedUsername}`)
				} else {
					fastify.log.warn(`Username ${anonymizedUsername} already exists, retrying...`)
					attempts++
				}
			} catch (error) {
				fastify.log.warn(`Error updating username ${anonymizedUsername}: ${error.message}, retrying...`)
				attempts++
			}
		}
		attempts++
	}
	
	if (!updateSuccess) {
		fastify.log.error(`Failed to generate unique username after ${maxAttempts} attempts`)
		throw new Error('Failed to generate unique username')
	}
	
	return anonymizedUsername
}

export async function deleteAccount(request, reply) {
	try {
		const { refreshToken } = request.cookies
		const infos = await getUserFromToken(request)
		if (!infos || !infos.user || !infos.accessToken) return reply.code(401).send({ success: false, error: 'Unauthorized' })
		const user = infos.user


		if (refreshToken && refreshToken !== undefined && refreshToken !== null) {
			const decodedRefresh = fastify.jwt.decode(refreshToken)
			const expiresInRefresh = decodedRefresh.exp - Math.floor(Date.now() / 1000)
			if (expiresInRefresh > 0) {
				redisModel.addToBlacklist(refreshToken, expiresInRefresh)
				fastify.log.debug(`Refresh token blacklisted for account deletion: ${user.username}`)
			}
			reply.clearCookie('refreshToken', { path: '/' })
		}

		const accessToken = infos.accessToken
		if (accessToken && accessToken !== undefined && accessToken !== null) {
			const decodedAccess = fastify.jwt.decode(accessToken)
			const expiresInAccess = decodedAccess.exp - Math.floor(Date.now() / 1000)
			if (expiresInAccess > 0) {
				redisModel.addToBlacklist(accessToken, expiresInAccess)
				fastify.log.debug(`Access token blacklisted for account deletion: ${user.username}`)
			}
		}

		const oldProfilePicture = user.profile_picture
		if (oldProfilePicture !== "/assets/image/default-profile-picture.png") {
			try {
				const oldFilePath = path.join(uploadDir, oldProfilePicture)
				const fileExists = await fs.access(oldFilePath)
				.then(() => true)
				.catch(() => false)
				
				if (fileExists) {
					fastify.log.info(`deleting old profile picture: ${oldFilePath}`)
					await fs.unlink(oldFilePath)
				} else {
					fastify.log.info(`Old profile picture doesn't exist: ${oldFilePath}`);
				}
			} catch (deleteErr) {
				fastify.log.error(`Error deleting old profile picture: ${deleteErr.message}`);
			}
		}

		notifyAllFriends(infos.user.userId, "account_deleted");
		friendshipsModel.deleteAllUserFriendships(user.userId)
		const anonymizedUsername = generateRandomString(9)
		usersModel.updateUsername(user.userId, anonymizedUsername)
		const anonymizedPassword = generateRandomString(9)
		const defaultProfilePicture = '/assets/image/default-profile-picture.png';
		const info = usersModel.anonymizeUserData(user.userId, anonymizedPassword, defaultProfilePicture)
		if (info.changes === 0) return reply.code(404).send({ error: "User not found" })

		return reply.send({ success: true, message: "Account anonymized successfully"})
	} catch (err) {
		fastify.log.error(`Critical error deleting account: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function verifyDoubleAuth(request, reply) {
	try {
		const { ticket, code } = request.body
		if (!ticket || !code)
			return reply.code(400).send({ success: false, error: 'Ticket and code are required' })
		const userId = await redisModel.get(`2fa_ticket_${ticket}`);
		if (!userId) {
			return reply.code(401).send({ success: false, error: 'Invalid or expired authentication session' });}
		const user = usersModel.getUserById(userId);
		if (!user || !user.doubleAuth_secret)
			return reply.code(400).send({ success: false, error: 'Invalid user or 2FA not enabled' })
		if (!user.doubleAuth_secret)
			return reply.code(400).send({ success: false, error: '2FA not enabled' })

		const isValid = speakeasy.totp.verify({
			secret: user.doubleAuth_secret,
			encoding: 'base32',
			token: code,
			window: 1
		})

		if (isValid) {
			await redisModel.del(`2fa_ticket_${ticket}`);
			const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '15m' })
			const refreshToken = fastify.jwt.sign({ userId: user.userId }, { expiresIn: '7d' })
			usersModel.updateLastActivity(user.userId)
			
			fastify.log.info(`2FA verification successful for user: ${user.username}`)
			reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			})
			.send({ 
				success:  true, 
				message: '2FA validated successfully!', 
				username: user.username, 
				profile_picture: user.profile_picture, 
				connection_status: "connected", 
				accessToken: accessToken 
			})
		} else {
			fastify.log.warn(`2FA verification failed: Invalid code for user ${user.username}`)
			return reply.code(401).send({ success: false, error: 'Invalid 2FA code' })
		}
	} catch (err) {
		fastify.log.error(`Critical error in 2FA verification: ${err.message}`)
		return reply.code(500).send({ success: false, error: 'Internal server error' })
	}
}

export async function activateDoubleAuth(request, reply) {
	const { code } = request.body
	const infos = await getUserFromToken(request)
	if (!infos) {
		fastify.log.warn('2FA activation denied: Unauthorized request')
		return reply.code(401).send({ success: false, error: 'Unauthorized' })
	}

	const user = infos.user
	if (!user) {
		fastify.log.warn('2FA activation failed: User not found in token')
		return reply.code(401).send({ success: false, error: 'User not found' })
	}

	const isValid = speakeasy.totp.verify({
		secret: user.doubleAuth_secret,
		encoding: 'base32',
		token: code,
		window: 1
	})

	if (isValid) {
		usersModel.updateDoubleAuth_status(user.userId, 1)
		fastify.log.info(`2FA successfully activated for user: ${user.username}`)
		return reply.send({ success: true, message: "2FA successfully activated" })
	} else {
		fastify.log.warn(`2FA activation failed: Invalid code for user ${user.username}`)
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

export async function exportUserData(request, reply) {
	  try {
		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Data export denied: Unauthorized request')
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		}

		const user = infos.user
		const accessToken = infos.accessToken
		if (!user) {
			fastify.log.warn('Data export failed: User not found in token')
			return reply.code(401).send({ success: false , error: 'User not found' })
		}

		delete user.password
		delete user.doubleAuth_secret
		
		const games = gamesModel.getGamesByUserId(user.userId)
		const friendships = friendshipsModel.getFriendshipsByUserId(user.userId)
		
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
		}
		
		reply.header('Content-Disposition', 'attachment; filename="user-data-export.json"')
		reply.type('application/json')
		
		fastify.log.info(`User data export successful for user: ${user.username}`)
		return reply.code(200).send(JSON.stringify({ success: true, ...exportData, accessToken: accessToken }, null, 2))
	} catch (error) {
		fastify.log.error(`Error exporting user data: ${error.message}`)
		return reply.code(500).send({ success: false, error: 'Failed to export user data' })
	}
}

export async function anonymizeUser(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Anonymization denied: Unauthorized request')
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		}

		const user = infos.user
		let newAccessToken = infos.accessToken
		if (!user)
			return reply.code(401).send({ success: false, error: 'User not found' })

		const anonymizedUsername = await generateAnonymousUsername(user.userId)
		const anonymizedProfilePicture = "/assets/image/default-profile-picture.png"
		usersModel.updateProfilePicture(user.userId, anonymizedProfilePicture)
		newAccessToken = fastify.jwt.sign({ userId: user.userId, username: anonymizedUsername }, { expiresIn: '15m' })

		const decoded = fastify.jwt.decode(infos.accessToken)
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
		if (expiresIn > 0)
			redisModel.addToBlacklist(infos.accessToken, expiresIn)

		fastify.log.info(`User account anonymized successfully: ${user.username}`)
		return reply.code(200).send({ success: true, profile_picture: anonymizedProfilePicture, accessToken: newAccessToken, message: 'User account anonymized successfully' })
	} catch (error) {
		fastify.log.error(`Error anonymizing user account: ${error.message}`)
		return reply.code(500).send({ success: false, error: 'Failed to anonymize user account : ' + error.message })
	}
}

function generateUniqueGoogleUsername(googleName) {
	let baseUsername = googleName.replace(/\s+/g, '').toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '').substring(0, 8);
	if (baseUsername.length < 3) baseUsername = baseUsername.padEnd(3, 'x');
	if (!usersModel.getUserByUsername(baseUsername)) return baseUsername;
	
	for (let i = 1; i <= 99; i++) {
		const variant = baseUsername + i;
		
		if (variant.length <= 10)
			if (!usersModel.getUserByUsername(variant)) return variant;
		else {
			const shorterBase = baseUsername.substring(0, baseUsername.length - 1);
			const variant = shorterBase + i;
			if (variant.length <= 10 && !usersModel.getUserByUsername(variant)) return variant;
		}
	}
	
	for (let attempt = 0; attempt < 50; attempt++) {
		const randomSuffix = Math.floor(Math.random() * 1000);
		const fallbackUsername = `user${randomSuffix}`;
		
		if (fallbackUsername.length <= 10 && !usersModel.getUserByUsername(fallbackUsername)) return fallbackUsername;
	}
	
	throw new Error('Unable to generate unique username');
}