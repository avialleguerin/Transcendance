import { OAuth2Client } from 'google-auth-library';
import { fastify, log } from '../server.js';
import usersModel from '../models/usersModel.js';
import { hashPassword } from '../utils/hashUtils.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleSignIn(request, reply) {
	try {
		const { token } = request.body;
		
		// Verify the Google token
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		
		const payload = ticket.getPayload();
		const { sub: googleId, email, name, picture } = payload;
		
		// Check if user already exists
		let user = usersModel.getUserByGoogleId(googleId);
		
		if (!user) {
			// Check if email already exists
			const existingUser = usersModel.getUserByEmail(email);
			if (existingUser) {
				return reply.code(409).send({ 
					success: false, 
					error: 'An account with this email already exists' 
				});
			}
			
			// Create new user
			const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 4);
			const randomPassword = Math.random().toString(36).substr(2, 15);
			const hashedPassword = await hashPassword(randomPassword);
			
			const userInfo = usersModel.createGoogleUser(username, hashedPassword, email, googleId, name, picture);
			user = usersModel.getUserById(userInfo.lastInsertRowid);
		}
		
		// Generate JWT tokens
		const accessToken = fastify.jwt.sign(
			{ userId: user.userId, username: user.username }, 
			{ expiresIn: '15m' }
		);
		const refreshToken = fastify.jwt.sign(
			{ userId: user.userId }, 
			{ expiresIn: '7d' }
		);
		
		usersModel.updateLastConnection(user.userId);
		
		reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			})
			.code(200)
			.send({
				success: true,
				message: 'Google Sign-In successful',
				connection_status: "connected",
				user: {
					userId: user.userId,
					username: user.username,
					email: user.email,
					profile_picture: user.profile_picture
				},
				accessToken: accessToken
			});
			
	} catch (error) {
		fastify.log.error('Google Sign-In error:', error);
		return reply.code(500).send({ 
			success: false, 
			error: 'Google Sign-In failed' 
		});
	}
}