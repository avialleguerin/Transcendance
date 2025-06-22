import Fastify from "fastify"
import { initDb } from "./utils/db.js"
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
import { getJwtSecret } from './utils/vault.js'

export const fastify = Fastify({
	logger: process.env.LOG_ACTIVE === 'true' ? {
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

export const log = fastify.logger;

/**
 * Main function for run the server
 * @explication Pour Fastify dans docker, il faut ecouter sur toutes les IP, donc: 0.0.0.0
 */
const start = async () => {
	try {
		await fastify.register(websocket)
		await fastify.register(cookie)
		await fastify.register(colorLoggerPlugin)
		setupRedisLogging(fastify);
		await redisClient.connect();
		fastify.decorate('redis', redisClient);
		
		await fastify.register(fastifyMultipart, { 
			attachFieldsToBody: true, 
			limits: { fileSize: 5 * 1024 * 1024 } 
		});
		const jwtSecret = await getJwtSecret();
		await fastify.register(jwt, { 
			secret: jwtSecret, 
			cookie: { cookieName: 'token', signed: false } 
		});
		await fastify.register(websocketPlugin)
		await fastify.register(routes, { prefix: '/request' })
		initDb();
		usersModel.delogAllUsers();
		setupCronJobs();
		checkEmailConfig();
		await fastify.listen({ port: 3000, host: '0.0.0.0' })
		
	} catch (err) {
		fastify.log.error('Failed to start server: ' + err.message)
		process.exit(1)
	}
}

/**
 * Setup cron jobs
 */
function setupCronJobs() {
	cron.schedule('0 0 * * *', () => {
		fastify.log.info('Clean inactive users...');
		const result = usersModel.deleteInactiveUsers();
		fastify.log.info(`Number of supressed accounts : ${result.changes}`);
	});
}

start()