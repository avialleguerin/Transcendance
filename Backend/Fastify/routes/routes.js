import { register, selectUsers, unregister, login, logout, changeDoubleAuth, accessProfileInfo, changeProfilePicture, changeProfile, refreshAccessToken, getUserProfile, verifyDoubleAuth, activateDoubleAuth, refreshInfos } from '../controllers/authController.js';
import { getSQLiteCreds } from '../utils/vault.js'

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options 
 */
export default async function routes (fastify) {

	fastify.addHook("onRequest", async (request, reply) => {
		console.log(`\n📡 Requête reçue : [${request.method}] ${request.url}\n`)
	});
	//authController
	fastify.get('/profile', getUserProfile)
	fastify.get('/users', selectUsers)
	fastify.post('/users/add', register)
	fastify.put('/users/login', login)
	fastify.post('/users/logout', logout)
	fastify.put('/users/access-profile-infos', accessProfileInfo)
	fastify.put('/users/update-2fa/:userId', changeDoubleAuth)
	fastify.post('/users/verify-2fa', verifyDoubleAuth)
	fastify.post('/users/activate-2fa', activateDoubleAuth)
	fastify.post('/users/update-profile-picture', changeProfilePicture)
	fastify.put('/users/update-profile/:userId', changeProfile)
	fastify.delete('/users/delete', unregister)
	fastify.post('/users/refresh-infos', refreshInfos)
	// Tokens
	fastify.post('/refresh-token', refreshAccessToken)
	fastify.get('/db-credentials', getSQLiteCreds)
}
