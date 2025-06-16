
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
import { httpRequestDuration, httpRequestsTotal, activeUsers, register, authAttempts } from './utils/metrics.js'; //STUB

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
initDb();
fastify.decorate('redis', redisClient);

cron.schedule('0 0 * * *', () => {
	fastify.log.info('Clean inactive users...');
	const result = usersModel.deleteInactiveUsers();
	fastify.log.info(`Number of supressed accounts : ${result.changes}`);
	console.log(`Number of supressed accounts : ${result.changes}`);
});

// Middleware pour les métriques
fastify.addHook('onRequest', async (request, reply) => {
	request.startTime = Date.now();
});

fastify.addHook('onResponse', async (request, reply) => {
	const duration = (Date.now() - request.startTime) / 1000;
	const route = request.routerPath || request.url;

	httpRequestDuration
		.labels(request.method, route, reply.statusCode.toString())
		.observe(duration);
		
	httpRequestsTotal
		.labels(request.method, route, reply.statusCode.toString())
		.inc();
});

/**
 * Main function for run the server
 * @explication Pour Fastify dans docker, il faut ecouter sur toutes les IP, donc: 0.0.0.0
 * @type test
 */
const start = async () => {
	try {
		checkEmailConfig();
		authAttempts.labels('success', 'login').inc(0); // Initialize auth attempts metric
		await fastify.listen({ port: 3000, host: '0.0.0.0' })
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()