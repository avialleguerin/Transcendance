import { register, selectUsers, unregister, login, logout, changeRole, refreshToken, getUserProfile} from '../controllers/authController.js';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export default async function routes (fastify) {
	//userController
	fastify.get('/users', selectUsers);

	// fastify.get('/profile', { preHandler: fastify.authenticate}, getUserProfile);
	// fastify.get("/users/connected", { preHandler: fastify.authenticate }, getConnectedUsers); //test


	fastify.post('/users/add', register);
	fastify.delete('/users/delete/:id', unregister);
	fastify.put('/users/login', login);
	fastify.put('/users/logout/:id', logout);
	fastify.put('/users/role/:id', changeRole);
	fastify.delete('/users/delete/:id', unregister);
	// fastify.post('/refresh-token', refreshAccessToken);
	// Tokens
}