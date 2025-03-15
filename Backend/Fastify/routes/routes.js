import { register, selectUsers, unregister, login, logout, changeRole, refreshAccessToken, getUserProfile, getAccessToken} from '../controllers/authController.js';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export default async function routes (fastify) {

	fastify.addHook("onRequest", async (request, reply) => {
		console.log(`📡 Requête reçue : [${request.method}] ${request.url}`);
	});
	//userController
	fastify.get('/users', selectUsers);

	fastify.get('/profile', { preHandler: fastify.authenticate}, getUserProfile);
	// fastify.get("/users/connected", { preHandler: fastify.authenticate }, getConnectedUsers); //test


	fastify.post('/users/add', register);
	fastify.put('/users/login', login);
	fastify.post('/users/logout/:userId', logout);
	fastify.put('/users/role/:userId', changeRole);
	fastify.delete('/users/delete/:userId', unregister);
	// Tokens
	fastify.post('/refresh-token', refreshAccessToken);
	fastify.post('/users/get-access-token', getAccessToken);
}
