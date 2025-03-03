import insertUser, {selectUsers, deleteUsers, loginUser, logoutUser, adminUser, refreshToken, getUserProfile} from './controllers/userController.js';

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

	fastify.get('/profile', { prehandler: fastify.authenticate}, getUserProfile);


	fastify.post('/users/add', insertUser);
	fastify.put('/users/login', loginUser);
	fastify.put('/users/logout/:id', logoutUser);
	fastify.put('/users/admin/:id', adminUser);
	fastify.delete('/users/delete/:id', deleteUsers);
	// Tokens
	fastify.post('/refresh', refreshToken);
}