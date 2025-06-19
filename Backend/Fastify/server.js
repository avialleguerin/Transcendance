import Fastify from "fastify"
import jwt from "@fastify/jwt"
import cookie from "@fastify/cookie"
import fastifyMultipart from '@fastify/multipart'
import routes from "./routes/routes.js"
import { redisClient, setupRedisLogging } from './utils/redis.js'
import cron from 'node-cron'
import usersModel from './models/usersModel.js'
import websocketPlugin from './utils/websocket.js'
import colorLoggerPlugin from './utils/logger.js'
import websocket from '@fastify/websocket'
import { checkEmailConfig } from './utils/mailer.js'

const logActive = process.env.LOG_ACTIVE === 'true';

export const fastify = Fastify({
	logger: logActive ? {
		level: 'debug',
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:H:MM',
				ignore: 'pid,hostname',
			}
		}
	} : false,
	disableRequestLogging: true
})

await fastify.register(websocket)
setupRedisLogging(fastify);
await redisClient.connect();

await fastify.register(fastifyMultipart, { attachFieldsToBody: true, limits: { fileSize: 5 * 1024 * 1024 } });
await fastify.register(jwt, { secret: 'supersecretkey', cookie: { cookieName: 'token', signed: false } });
await fastify.register(cookie);
await fastify.register(colorLoggerPlugin)
export const log = fastify.logger;
await fastify.register(websocketPlugin)

fastify.register(routes, { prefix: '/request' })

fastify.decorate('redis', redisClient);

cron.schedule('0 0 * * *', () => {
	fastify.log.info('Clean inactive users...');
	const result = usersModel.deleteInactiveUsers();
	fastify.log.info(`Number of supressed accounts : ${result.changes}`);
	console.log(`Number of supressed accounts : ${result.changes}`);
});

// Initialiser la base de données de manière asynchrone APRÈS que Fastify soit configuré
async function initializeDatabase() {
    console.log("🔄 Initializing database...");
    
    // Attendre un peu que Vault soit prêt
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const { initializeDb } = await import("./utils/db.js");
    await initializeDb(fastify);
    console.log("✅ Database initialization completed");
}

/**
 * Main function for run the server
 * @explication Pour Fastify dans docker, il faut ecouter sur toutes les IP, donc: 0.0.0.0
 */
const start = async () => {
	try {
		checkEmailConfig();
		
		// Démarrer le serveur Fastify
		await fastify.listen({ port: 3000, host: '0.0.0.0' })
		console.log("🚀 Fastify server started successfully on port 3000");
		
		// Initialiser la base de données APRÈS que le serveur soit démarré
		try {
			await initializeDatabase();
		} catch (err) {
			console.error("❌ Failed to initialize database:", err);
			// Ne pas faire process.exit(1) ici pour éviter de tuer le serveur
		}
		
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()