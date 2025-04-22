import { register, selectUsers, unregister, login, logout, changeDoubleAuth, changeRole, refreshAccessToken, getUserProfile, generateDoubleAuth, verifyDoubleAuth } from '../controllers/authController.js';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export default async function routes (fastify) {

	fastify.addHook("onRequest", async (request, reply) => {
		console.log(`\n📡 Requête reçue : [${request.method}] ${request.url}\n`);
	});
	//authController
	fastify.get('/profile', { preHandler: fastify.authenticate}, getUserProfile);
	// fastify.get("/generate-2fa/:userId", { preHandler: fastify.authenticate}, generateDoubleAuth);
	fastify.get('/users', selectUsers);
	fastify.post('/users/add', register);
	fastify.put('/users/login', login);
	fastify.post('/users/logout/:userId', logout);
	fastify.put('/users/doubleAuth/:userId', changeDoubleAuth);
	fastify.put('/users/verify-2fa', verifyDoubleAuth);
	fastify.put('/users/role/:userId', changeRole);
	fastify.delete('/users/delete/:userId', unregister);

	// Tokens
	fastify.post('/refresh-token', refreshAccessToken);
}
