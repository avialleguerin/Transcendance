import { register, selectUsers, unregister, login, logout, changeRole, refreshAccessToken} from '../controllers/authController.js';
import { getSQLiteCreds } from '../utils/vault.js'

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options 
 */
export default async function routes (fastify) {
	//userController
	fastify.get('/users', selectUsers);
	fastify.post('/users/add', register);
	fastify.put('/users/login', login);
	fastify.put('/users/logout/:id', logout);
	fastify.put('/users/admin/:id', changeRole);
	fastify.delete('/users/delete/:id', unregister);
	// Tokens, Vault ...
	fastify.post('/refresh', refreshAccessToken);
	fastify.get('/db-credentials', getSQLiteCreds);
}
