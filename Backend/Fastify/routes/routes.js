import insertUser, {selectUsers, deleteUsers, loginUser, logoutUser, adminUser, refreshToken, getPassword} from './controllers/userController.js';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options 
 */
export default async function routes (fastify) {
	//userController
	fastify.get('/users', selectUsers);
	fastify.post('/users/add', insertUser);
	fastify.put('/users/login', loginUser);
	fastify.put('/users/logout/:id', logoutUser);
	fastify.put('/users/admin/:id', adminUser);
	fastify.delete('/users/delete/:id', deleteUsers);
	// Tokens, Vault ...
	fastify.post('/refresh', refreshToken);
	fastify.get('/get-secret', getPassword);

}
