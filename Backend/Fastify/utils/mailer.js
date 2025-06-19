import nodemailer from 'nodemailer';
import { fastify } from '../server.js';

const createTransporter = () => {
	try {
		return nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS
		},

		secure: true,
		tls: {
			rejectUnauthorized: false
		}
		});
	} catch (error) {
		fastify.log.error('Error creating email transporter:' + error);
		throw error;
	}
};

/**
 * Sends welcome email with temporary password.
 * @param {string} to - Recipient email address
 * @param {string} username - Username
 * @param {string} tempPassword - Temporary password
 */
export default async function sendWelcomeEmail(to, username, tempPassword) {
	if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
		fastify.log.warn('Email environment variables not configured, email not sent');
		return false;
	}

	const transporter = createTransporter();
	
	const mailOptions = {
		from: `"Transcendance Game" <${process.env.GMAIL_USER}>`,
		to,
		subject: "Welcome to Transcendance - Temporary Credentials",
		html: /*html*/`
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<style>
			body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
			.container { max-width: 600px; margin: 0 auto; padding: 20px; }
			.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
			.content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
			.credentials { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; }
			.warning { background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107; margin-top: 15px; }
			</style>
		</head>
		<body>
			<div class="container">
			<div class="header">
				<h2>Welcome to Transcendance!</h2>
			</div>
			<div class="content">
				<p>Hello <strong>${username}</strong>,</p>
				
				<p>Your account has been successfully created via Google Sign-In. Here are your temporary login credentials:</p>
				
				<div class="credentials">
				<h3>📋 Your credentials:</h3>
				<ul>
					<li><strong>Username:</strong> ${username}</li>
					<li><strong>Email:</strong> ${to}</li>
					<li><strong>Temporary password:</strong> <code>${tempPassword}</code></li>
				</ul>
				</div>
				
				<div class="warning">
				<h4>Important:</h4>
				<p>For your security, we strongly recommend that you:</p>
				<ul>
					<li>Login and change this temporary password</li>
					<li>Enable two-factor authentication (2FA)</li>
					<li>Do not share these credentials</li>
				</ul>
				</div>
				
				<p style="margin-top: 20px;">
				<a href="${process.env.FRONTEND_URL || 'https://localhost:8443'}" 
					style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
					Access Transcendance
				</a>
				</p>
				
				<p style="margin-top: 30px; color: #666; font-size: 14px;">
				This email was sent automatically. If you did not create an account, please ignore this message.
				</p>
			</div>
			</div>
		</body>
		</html>
		`,
		text: `
		Welcome ${username} to Transcendance!
		
		Your temporary credentials:
		- Username: ${username}
		- Email: ${to}
		- Temporary password: ${tempPassword}
		
		Please login and change this password as soon as possible for your security.
		
		Link: ${process.env.FRONTEND_URL || 'https://localhost:8443'}
		`
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		fastify.log.info(`📧 Welcome email sent to ${to}: ${info.messageId}`);
		return true;
	} catch (err) {
		fastify.log.error(`Error sending email to ${to}:` + err);
		return false;
	}
}

export function checkEmailConfig() {
	if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
		fastify.log.warn('Email configuration missing - Emails will not be sent');
		return false;
	}
	fastify.log.info('Mail initialized successfully');
	return true;
}