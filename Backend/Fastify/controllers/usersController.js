import { fastify, log } from '../server.js'
import usersModel from '../models/usersModel.js'
import { hashPassword, verifyPassword } from '../utils/hashUtils.js'
import { redisModel } from '../models/redisModel.js'
import { getUserFromToken } from './utils.js'
import friendshipsModel from '../models/friendshipsModel.js'
import sendWelcomeEmail from '../utils/mailer.js'
import gamesModel from '../models/gamesModel.js'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import fs from 'fs/promises'
import path from 'path'

const uploadDir = '/usr/share/nginx/uploads'
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
		fastify.log.debug(`Google config requested - Client ID: ${process.env.GOOGLE_CLIENT_ID}`)
		return {
			success: true,
			client_id: process.env.GOOGLE_CLIENT_ID
		}
	} catch (err) {
		fastify.log.error(`Google config error: ${err.message}`)
		reply.code(500).send({ error: 'Server error' })
	}
}

export async function googleSignIn(request, reply) {
	try {
		const { access_token } = request.body
		if (!access_token) {
			fastify.log.warn('Google sign-in attempted without access token')
			return reply.code(400).send({ 
				success: false, 
				error: 'Google access_token is required' 
			})
		}

		fastify.log.info('Validating Google access token')
		const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`)
		
		if (!response.ok) {
			fastify.log.error(`Google API error: ${response.status}`)
			return reply.code(401).send({ 
				success: false, 
				error: 'Invalid Google access token' 
			})
		}

		const googleUser = await response.json()
		if (!googleUser.id) {
			fastify.log.warn('Google sign-in failed: Invalid user data received')
			return reply.code(401).send({ success: false, error: 'Invalid Google user data'})
		}
		
		const { id: googleId, name, picture: profilePictureUrl, email } = googleUser
		fastify.log.info(`Google user attempting sign-in: ${name} (${email})`)
		
		let user = usersModel.getUserByGoogleId(googleId)
		let isNewUser = false
        let tempPassword = null

		if (!user || user.anonymized_at) {
			if (user && user.anonymized_at)
				fastify.log.info(`Previously anonymized Google user ${googleId} creating new account`)
			
			const username = name.replace(/\s+/g, '').toLowerCase().substring(0,10)
			const randomPassword = Math.random().toString(36).substring(2, 17)
			const hashedPassword = await hashPassword(randomPassword)

			tempPassword = randomPassword
			isNewUser = true
			
			let profilePicture = "default-profile-picture.png"
			if (profilePictureUrl) {
				try {
					fastify.log.info(`Downloading Google profile picture for ${username}`)
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
							
							fastify.log.info(`Google profile picture validated and saved: ${secureFilename}`);
						} catch (validationError) {
							fastify.log.warn(`Google profile picture validation failed: ${validationError.message}, using default`);
							profilePicture = "default-profile-picture.png";
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
			fastify.log.info(`New Google user created: ${username} (ID: ${user.userId})`)
		} else {
			fastify.log.info(`Existing Google user signing in: ${user.username} (ID: ${user.userId})`)
		}

		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, { expiresIn: '15m' })
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, { expiresIn: '7d' })
		
		usersModel.updateLastActivity(user.userId)

		if (isNewUser && tempPassword && email) {
            try {
				fastify.log.info(`📧 Sending welcome email to ${email} for user ${user.username}`)
                const emailSent = await sendWelcomeEmail(email, user.username, tempPassword)
                if (emailSent) {
                    fastify.log.info(`Welcome email sent successfully to ${email}`)
				} else {
					fastify.log.warn(`Welcome email failed to send to ${email}`)
				}
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
		if (!infos) {
			fastify.log.warn('Profile access denied: Unauthorized request')
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		}

		const user = infos.user
		const accessToken = infos.accessToken
		if (!user) {
			fastify.log.warn('Profile access denied: User not found in token')
			return reply.code(401).send({ error: 'Unauthorized' })
		}

		const imgUrl = `uploads/${user.profile_picture}`
		fastify.log.info(`Profile retrieved for user: ${user.username}`)
		return reply.code(200).send({ success: true, user: user, accessToken: accessToken, profile_picture: imgUrl })
	} catch (error) {
		fastify.log.error(`Error retrieving user profile: ${error.message}`)
		reply.code(500).send({ error: 'Internal Server Error' })
	}
}

export async function getUserProfilePicture(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Profile picture access denied: Unauthorized request')
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		}

		const user = infos.user
		const accessToken = infos.accessToken
		if (!user) {
			fastify.log.warn('Profile picture access denied: User not found in token')
			return reply.code(401).send({ error: 'Unauthorized' })
		}

		const imgUrl = `uploads/${user.profile_picture}`
		fastify.log.debug(`Profile picture retrieved for user: ${user.username}`)
		return reply.code(200).send({ success: true, username: user.username, accessToken: accessToken, profile_picture: imgUrl })
	} catch (error) {
		fastify.log.error(`Error retrieving profile picture: ${error.message}`)
		reply.code(500).send({ error: 'Internal Server Error' })
	}
}

export async function createUser(request, reply) {
	const { username, password } = request.body

	if (!username || !password) {
		fastify.log.warn('User creation failed: Missing username or password')
		return reply.code(400).send({ error: 'Username and Password are required' })
	}

	const usernameRegex = /^[A-Za-z0-9._-]+$/
	if (!usernameRegex.test(username)) {
		fastify.log.warn(`User creation failed: Invalid username format: ${username}`)
		return reply.code(400).send({ error: 'Username can only contain letters, numbers, dots, underscores, and hyphens' })
	}

	const sameUsername = usersModel.getUserByUsername(username)
	if (sameUsername) {
		fastify.log.warn(`User creation failed: Username already exists: ${username}`)
		return reply.code(409).send({ error: "This username is already used" })
	}

	try {
		fastify.log.info(`Creating new user: ${username}`)
		const hashedPassword = await hashPassword(password)
		const info = usersModel.createUser(username, hashedPassword)
		fastify.log.info(`User created successfully: ${username} (ID: ${info.lastInsertRowid})`)
		return reply.code(201).send({ success: true, id: info.lastInsertRowid, username, message: 'Account created successfully' })
	} catch (err) {
		fastify.log.error(`Critical error creating user ${username}: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function login(request, reply) {
	const { username, password } = request.body
	try {
		fastify.log.info(`Login attempt for username: ${username}`)
		const user = usersModel.getUserByUsername(username)
		
		if (!user) {
			fastify.log.warn(`Login failed: User not found - ${username}`)
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		}
		
		if (user.anonymized_at) {
			fastify.log.warn(`Login attempt on anonymized account: ${username}`)
			return reply.code(401).send({ success: false, error: 'This account has been deleted' })
		}
		
		if (!await verifyPassword(user.password, password)) {
			fastify.log.warn(`Login failed: Invalid password - ${username}`)
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		}
		
		if (user.doubleAuth_status) {
			const ticket = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
			await redisModel.setex(`2fa_ticket_${ticket}`, 300, user.userId.toString())
			return reply.code(200).send({success: true, connection_status: "partially_connected", doubleAuth_status: user.doubleAuth_status, message: 'Double authentication required', ticket: ticket})
		}
		
		const accessToken = fastify.jwt.sign({ userId: user.userId, username: user.username }, {expiresIn: '15m' })
		const refreshToken = fastify.jwt.sign({ userId: user.userId }, {expiresIn: '7d' })
		
		if (!accessToken || !refreshToken) {
			fastify.log.error(`Token generation failed for user: ${username}`)
			return reply.code(500).send({ error: 'Internal Server Error' })
		}

		usersModel.updateLastActivity(user.userId)
		usersModel.updateOnlineStatus(user.userId, 1)
		
		fastify.log.info(`Login successful: ${username}`)
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
			user: user,
			username: user.username,
			userId: user.userId,
			profile_picture: user.profile_picture,
			doubleAuth_status: user.doubleAuth_status,
			accessToken: accessToken
		})
	} catch (err) {
		fastify.log.error(`Critical login error for ${username}: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function login1v1(request, reply) {
	const { username, password } = request.body
	try {
		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('1v1 login denied: Unauthorized request')
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		}

		const user = infos.user
		const accessToken = infos.accessToken
		if (!user || !accessToken) {
			fastify.log.warn('1v1 login denied: Invalid user or token')
			return reply.code(401).send({ error: 'Unauthorized' })
		}

		fastify.log.info(`1v1 opponent login attempt: ${username} (Player 1: ${user.username})`)
		const player2 = usersModel.getUserByUsername(username)
		if (!player2 || !await verifyPassword(player2.password, password)) {
			fastify.log.warn(`1v1 login failed: Invalid credentials for ${username}`)
			return reply.code(401).send({ success: false, error: 'Invalid credentials' })
		}

		if (player2.anonymized_at) {
			fastify.log.warn(`1v1 login failed: Anonymized account ${username}`)
			return reply.code(401).send({ success: false, error: 'This account has been deleted' })
		}

		usersModel.updateLastActivity(player2.userId)
		fastify.log.info(`1v1 game ready: ${user.username} vs ${player2.username}`)
		reply.code(200).send({ success: true, message: 'Opponent logged in', user: user, player2: player2, accessToken: accessToken })
	} catch (err) {
		fastify.log.error(`Critical error in 1v1 login: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function login2v2(request, reply) {
	const { username2, password2, username3, password3, username4, password4 } = request.body
	try {
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ success: false, message: 'You must be logged in to play 2v2', error: `infos: ${infos}` })
		const user = infos.user
		const accessToken = infos.accessToken
		if (!user)
			return reply.code(401).send({ success: false, message: 'You must be logged in to play 2v2', error: 'User not found' })
		if (!accessToken)
			return reply.code(401).send({ success: false, message: 'You must be logged in to play 2v2', error: 'Access token not found' })
		const player2 = usersModel.getUserByUsername(username2)
		const player3 = usersModel.getUserByUsername(username3)
		const player4 = usersModel.getUserByUsername(username4)
		
		if (!player2 || !await verifyPassword(player2.password, password2)) {
			fastify.log.warn(`2v2 login failed: Invalid credentials for Player 2: ${username2}`)
			return reply.code(401).send({ success: false, error: 'Player 2: Invalid credentials' })
		}
		if (!player3 || !await verifyPassword(player3.password, password3)) {
			fastify.log.warn(`2v2 login failed: Invalid credentials for Player 3: ${username3}`)
			return reply.code(401).send({ success: false, error: 'Player 3: Invalid credentials' })
		}
		if (!player4 || !await verifyPassword(player4.password, password4)) {
			fastify.log.warn(`2v2 login failed: Invalid credentials for Player 4: ${username4}`)
			return reply.code(401).send({ success: false, error: 'Player 4: Invalid credentials' })
		}

		usersModel.updateLastActivity(player2.userId)
		usersModel.updateLastActivity(player3.userId)
		usersModel.updateLastActivity(player4.userId)
		
		fastify.log.info(`2v2 game ready: ${user.username} & ${player2.username} vs ${player3.username} & ${player4.username}`)
		reply.code(200).send({ 
			success: true, 
			message: 'Opponents logged in', 
			player1: user, 
			player2: player2, 
			player3: player3, 
			player4: player4, 
			accessToken: accessToken 
		})
	} catch (err) {
		fastify.log.error(`Critical error in 2v2 login: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function logout(request, reply) {
	const accessToken = request.headers.authorization?.split(' ')[1]
	const { refreshToken } = request.cookies
	
	if (!accessToken || accessToken === "undefined") {
		fastify.log.warn('Logout attempt without valid access token')
		return reply.code(401).send({ success: false, error: 'Access token is missing' })
	}

	let username = 'unknown'
	try {
		const decoded = fastify.jwt.decode(accessToken)
		username = decoded?.username || 'unknown'
		fastify.log.info(`🚪 Logout initiated for user: ${username}`)
	} catch (decodeError) {
		fastify.log.warn(`Failed to decode token during logout: ${decodeError.message}`)
	}

	if (accessToken && accessToken !== "undefined") {
		const decoded = fastify.jwt.decode(accessToken)
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
		if (expiresIn > 0) {
			redisModel.addToBlacklist(accessToken, expiresIn)
			fastify.log.debug(`Access token blacklisted for ${username}`)
		}
	}

	if (refreshToken && refreshToken !== "undefined") {
		const decoded = fastify.jwt.decode(refreshToken)
		const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
		if (expiresIn > 0) {
			redisModel.addToBlacklist(refreshToken, expiresIn)
			fastify.log.debug(`Refresh token blacklisted for ${username}`)
		}
		reply.clearCookie('refreshToken', { path: '/' })
	}

	fastify.log.info(`Logout successful for user: ${username}`)
	reply.code(200).send({ success: true, message: 'Logged out' })
}

export async function enableDoubleAuth(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ success: false, error: 'Unauthorized' })

		const user = infos.user
		if (!user) return reply.code(404).send({ success: false, error: 'User not found' })

		fastify.log.info(`Enabling 2FA for user: ${user.username}`)
		const doubleAuthData = await generateDoubleAuth(user.userId)

		return reply.code(200).send({ success: true, doubleAuth_status: true, message: 'Double authentication waiting for activation', secret: doubleAuthData.secret, qrCode: doubleAuthData.qrCode })
	} catch (err) {
		fastify.log.error(`Critical error updating double auth: ${err.message}`)
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
		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Access to profile info denied: Unauthorized request')
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		}

		const user = infos.user
		const accessToken = infos.accessToken
		if (!user) {
			fastify.log.warn('Access to profile info denied: User not found in token')
			return reply.code(404).send({ success: false, error: 'User not found' })
		}

		if (!await verifyPassword(user.password, password)) {
			fastify.log.warn(`Access to profile info denied: Invalid password for ${user.username}`)
			return reply.code(401).send({ success: false, error: 'Invalid password' })
		}
		
		fastify.log.info(`Access to profile info granted for user: ${user.username}`)
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
		if (!infos) {
			fastify.log.warn('Profile update denied: Unauthorized request')
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		}

		const user = infos.user
		const accessToken = infos.accessToken
		if (!user) {
			fastify.log.warn('Profile update failed: User not found in token')
			return reply.code(404).send({ success: false, error: 'User not found' })
		}

		let updated = false
		if (newUsername) {
			const sameUsername = usersModel.getUserByUsername(newUsername)
			if (sameUsername) {
				fastify.log.warn(`Profile update failed: Username already used - ${newUsername}`)
				return reply.code(409).send({ error: "This username is already used" })
			}
			fastify.log.info(`✏️ Updating username for user: ${user.username} to ${newUsername}`)
			usersModel.updateUsername(user.userId, newUsername)
			updated = true
		} 
		
		if (newPassword) {
			const hashedPassword = await hashPassword(newPassword)
			fastify.log.info(`Updating password for user: ${user.username}`)
			usersModel.updatePassword(user.userId, hashedPassword)
			updated = true
		}

		if (updated) {
			fastify.log.info(`Profile updated successfully for user: ${user.username}`)
			return reply.code(200).send({ success: true, accessToken: accessToken, message: 'Profile updated successfully!' })
		} else {
			fastify.log.info(`No changes made to profile for user: ${user.username}`)
			return reply.code(200).send({ success: true, message: 'No changes made' })
		}
	} catch (err) {
		fastify.log.error(`Critical error updating profile: ${err.message}`)
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
		throw new Error('Invalid image format. Only PNG and JPEG files are allowed.');

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
	return `${timestamp}-${sanitizedUsername}-${randomString}${extension}`;
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
		if (oldProfilePicture !== "default-profile-picture.png") {
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
			profile_picture: `uploads/${secureFilename}`
		})

	} catch (err) {
		fastify.log.error("Error uploading new profile picture:", err);
		return reply.code(500).send({ success: false, error: 'Internal server error while uploading image' });
	}
}

export async function deleteAccount(request, reply) {
	try {
		const { refreshToken } = request.cookies
		const infos = await getUserFromToken(request)
		fastify.log.info("infos :" + infos)
		if (!infos) {
			fastify.log.warn('Account deletion denied: Unauthorized request')
			return reply.code(401).send({ success: false, error: 'Unauthorized' })
		}

		const user = infos.user
		const accessToken = infos.accessToken
		if (!user) {
			fastify.log.warn('Account deletion failed: User not found in token')
			return reply.code(404).send({ error: 'User not found' })
		}

		if (refreshToken && refreshToken !== undefined && refreshToken !== null) {
			const decodedRefresh = fastify.jwt.decode(refreshToken)
			const expiresInRefresh = decodedRefresh.exp - Math.floor(Date.now() / 1000)
			if (expiresInRefresh > 0) {
				redisModel.addToBlacklist(refreshToken, expiresInRefresh)
				fastify.log.debug(`Refresh token blacklisted for account deletion: ${user.username}`)
			}
			reply.clearCookie('refreshToken', { path: '/' })
		}

		if (accessToken && accessToken !== undefined && accessToken !== null) {
			const decodedAccess = fastify.jwt.decode(accessToken)
			const expiresInAccess = decodedAccess.exp - Math.floor(Date.now() / 1000)
			if (expiresInAccess > 0) {
				redisModel.addToBlacklist(accessToken, expiresInAccess)
				fastify.log.debug(`Access token blacklisted for account deletion: ${user.username}`)
			}
		}

		const oldProfilePicture = user.profile_picture
		if (oldProfilePicture !== "default-profile-picture.png") {
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

		const info = usersModel.anonymizeUser(user.userId)
			
		if (info.changes === 0) {
			fastify.log.warn(`Account deletion failed: User not found - ${user.userId}`)
			return reply.code(404).send({ error: "User not found" })
		}

		fastify.log.info(`User ${user.username} (ID: ${user.userId}) has been anonymized`)
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
		return reply.code(200).send(JSON.stringify({ success: true, ...exportData }, null, 2))
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
		if (!user) {
			fastify.log.warn('Anonymization failed: User not found in token')
			return reply.code(401).send({ success: false, error: 'User not found' })
		}
		
		const anonymizedUsername = `Anonym${user.userId}`
		const anonymizedProfilePicture = "default-profile-picture.png"
		
		fastify.log.info(`Anonymizing user account: ${user.username}`)
		usersModel.updateUsername(user.userId, anonymizedUsername)
		usersModel.updateProfilePicture(user.userId, anonymizedProfilePicture)
		
		fastify.log.info(`User account anonymized successfully: ${user.username}`)
		return reply.code(200).send({ success: true, message: 'User account anonymized successfully' })
	} catch (error) {
		fastify.log.error(`Error anonymizing user account: ${error.message}`)
		return reply.code(500).send({ success: false, error: 'Failed to anonymize user account : ' + error.message })
	}
}