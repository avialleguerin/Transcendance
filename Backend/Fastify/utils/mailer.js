import nodemailer from 'nodemailer';
import { fastify } from '../server.js';

// Configuration du transporteur avec gestion d'erreurs
const createTransporter = () => {
	try {
		return nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS
		},
		// Options de sécurité supplémentaires
		secure: true,
		tls: {
			rejectUnauthorized: false
		}
		});
	} catch (error) {
		fastify.log.error('Erreur lors de la création du transporteur email:' + error);
		throw error;
	}
};

/**
 * Envoie un e-mail de bienvenue avec mot de passe temporaire.
 * @param {string} to - Adresse email du destinataire
 * @param {string} username - Nom d'utilisateur
 * @param {string} tempPassword - Mot de passe temporaire
 */
export default async function sendWelcomeEmail(to, username, tempPassword) {
	// Vérification des variables d'environnement
	if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
		fastify.log.warn('Variables d\'environnement email non configurées, email non envoyé');
		return false;
	}

	const transporter = createTransporter();
	
	const mailOptions = {
		from: `"Transcendance Game" <${process.env.GMAIL_USER}>`,
		to,
		subject: "🎮 Bienvenue sur Transcendance - Identifiants temporaires",
		html: `
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
				<h2>🎮 Bienvenue sur Transcendance !</h2>
			</div>
			<div class="content">
				<p>Bonjour <strong>${username}</strong>,</p>
				
				<p>Votre compte a été créé avec succès via Google Sign-In. Voici vos identifiants de connexion temporaires :</p>
				
				<div class="credentials">
				<h3>📋 Vos identifiants :</h3>
				<ul>
					<li><strong>Nom d'utilisateur :</strong> ${username}</li>
					<li><strong>Email :</strong> ${to}</li>
					<li><strong>Mot de passe temporaire :</strong> <code>${tempPassword}</code></li>
				</ul>
				</div>
				
				<div class="warning">
				<h4>⚠️ Important :</h4>
				<p>Pour votre sécurité, nous vous recommandons fortement de :</p>
				<ul>
					<li>Vous connecter et changer ce mot de passe temporaire</li>
					<li>Activer l'authentification à deux facteurs (2FA)</li>
					<li>Ne pas partager ces identifiants</li>
				</ul>
				</div>
				
				<p style="margin-top: 20px;">
				<a href="${process.env.FRONTEND_URL || 'https://localhost:8443'}" 
					style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
					🎮 Accéder à Transcendance
				</a>
				</p>
				
				<p style="margin-top: 30px; color: #666; font-size: 14px;">
				Cet email a été envoyé automatiquement. Si vous n'avez pas créé de compte, veuillez ignorer ce message.
				</p>
			</div>
			</div>
		</body>
		</html>
		`,
		// Version texte pour les clients qui ne supportent pas HTML
		text: `
		Bienvenue ${username} sur Transcendance !
		
		Vos identifiants temporaires :
		- Nom d'utilisateur : ${username}
		- Email : ${to}
		- Mot de passe temporaire : ${tempPassword}
		
		Connectez-vous et changez ce mot de passe dès que possible pour votre sécurité.
		
		Lien : ${process.env.FRONTEND_URL || 'https://localhost:8443'}
		`
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		fastify.log.info(`📧 Email de bienvenue envoyé à ${to} : ${info.messageId}`);
		return true;
	} catch (err) {
		fastify.log.error(`❌ Erreur lors de l'envoi du mail à ${to} :` + err);
		return false;
	}
}

export function checkEmailConfig() {
	if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
		fastify.log.warn('⚠️ Configuration email manquante - Les emails ne seront pas envoyés');
		return false;
	}
	fastify.log.info('Mail initialized successfully');
	return true;
}