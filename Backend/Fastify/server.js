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
await fastify.register(fastifyMultipart, { attachFieldsToBody: true, limits: { fileSize: 5 * 1024 * 1024 } });
await fastify.register(jwt, { secret: 'supersecretkey', cookie: { cookieName: 'token', signed: false } });
await fastify.register(cookie);
await fastify.register(colorLoggerPlugin)
export const log = fastify.logger;
console.log("");
await fastify.register(websocketPlugin);
setupRedisLogging(log);
await redisClient.connect();
const { initializeDb } = await import("./utils/db.js");
await initializeDb(log);
fastify.register(routes, { prefix: '/request' })
fastify.decorate('redis', redisClient);

cron.schedule('0 0 * * *', () => {
	log.info('Clean inactive users...');
	const result = usersModel.deleteInactiveUsers();
	log.info(`Number of suppressed accounts : ${result.changes}`);
	console.log(`Number of suppressed accounts : ${result.changes}`);
});

/**
 * Main function for run the server
 * @explication Pour Fastify dans docker, il faut ecouter sur toutes les IP, donc: 0.0.0.0
 */
const start = async () => {
	try {
		checkEmailConfig();
		await fastify.listen({ port: 3000, host: '0.0.0.0' })
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()