import { register, getAllUsers, deleteAccount, deleteUser, login, logout, changeDoubleAuth, accessProfileInfo, changeProfilePicture, changeProfile, getUserProfile, verifyDoubleAuth, activateDoubleAuth, refreshInfos } from '../controllers/authController.js';
import { getAllGames, addGame, deleteGame } from '../controllers/gameController.js';
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
	fastify.get('/admin/get-all-users', getAllUsers)
	fastify.delete('/admin/delete-user', deleteUser)
	fastify.get('/profile', getUserProfile)
	fastify.post('/user/register', register)
	fastify.post('/user/login', login)
	fastify.post('/user/logout', logout)
	fastify.put('/user/access-profile-infos', accessProfileInfo)
	fastify.put('/user/update-2fa', changeDoubleAuth)
	fastify.post('/user/verify-2fa', verifyDoubleAuth)
	fastify.post('/user/activate-2fa', activateDoubleAuth)
	fastify.post('/user/update-profile-picture', changeProfilePicture)
	fastify.put('/user/update-profile', changeProfile)
	fastify.delete('/user/delete-account', deleteAccount)
	fastify.post('/user/refresh-infos', refreshInfos)

	//gameController
	fastify.get('/admin/get-all-games', getAllGames)
	fastify.post('/game/create-game', addGame)
	fastify.delete('/admin/delete-game', deleteGame)

	// Tokens
	// fastify.post('/refresh-token', refreshAccessToken)
	fastify.get('/db-credentials', getSQLiteCreds)
}
