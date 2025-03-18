import { register, selectUsers, unregister, login, logout, changeRole, refreshAccessToken, getAccessToken} from '../controllers/authController.js';
import { getSQLiteCreds } from '../utils/vault.js'

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options 
 */
export default async function routes (fastify) {

	fastify.addHook("onRequest", async (request, reply) => {
		console.log(`📡 Requête reçue : [${request.method}] ${request.url}`);
	});
	//userController
	fastify.get('/users', selectUsers);
	fastify.post('/users/add', register);
	fastify.put('/users/login', login);
	fastify.post('/users/logout/:userId', logout);
	fastify.put('/users/role/:userId', changeRole);
	fastify.delete('/users/delete/:userId', unregister);
	// Tokens
	fastify.post('/refresh-token', refreshAccessToken);
	fastify.post('/users/get-access-token', getAccessToken);
	fastify.get('/db-credentials', getSQLiteCreds);
}
