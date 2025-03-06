import { register, selectUsers, unregister, login, logout, adminUser, refreshToken, getUserProfile} from '../controllers/authController.js';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export default async function routes (fastify) {
	//userController
	fastify.get('/users', selectUsers);
	// fastify.get('/profile', fetchUserProfile);
	// fastify.get('/me', { prehandler: fastify.authenticate}, async (request, reply) => {
	// 	return {user: request.user};
	// });

	fastify.get('/profile', { preHandler: fastify.authenticate}, getUserProfile);

	fastify.post('/users/add', register);
	fastify.put('/users/login', login);
	fastify.put('/users/logout/:id', logout);
	fastify.put('/users/admin/:id', adminUser);
	fastify.delete('/users/delete/:id', unregister);
	// Tokens
	fastify.post('/refresh', refreshToken);
}