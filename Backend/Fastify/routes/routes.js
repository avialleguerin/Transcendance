import { getUserProfilePicture, createUser , deleteAccount, login, login1v1, login2v2, logout, updateDoubleAuth, accessProfileInfo, changeProfilePicture, changeProfile, getUserProfile, verifyDoubleAuth, activateDoubleAuth, refreshInfos, exportUserData } from '../controllers/usersController.js';
import { getUserGames, create1v1Game, create2v2Game } from '../controllers/gamesController.js';
import { getUserFriendships, addFriend, acceptFriend, deleteFriend } from '../controllers/friendshipsController.js';
import { getAllUsers, deleteUser, getAllGames, createGame, deleteGame, getAllFriendships, addFriendship, deleteFriendship } from '../controllers/adminController.js';
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

	// Hook d'authentification global // FIXME - A revoir
	// fastify.addHook("preHandler", async (request, reply) => {
	// 	// Liste des routes qui ne nécessitent pas d'authentification
	// 	const publicRoutes = [
	// 	  '/user/create-user',
	// 	  '/user/login',
	// 	  '/user/verify-2fa',
	// 	  '/db-credentials'
	// 	  // Ajoutez d'autres routes publiques si nécessaire
	// 	];
	
	// 	// Skip l'authentification pour les routes publiques
	// 	if (publicRoutes.some(route => request.url.includes(route))) {
	// 	  return;
	// 	}
	
	// 	// Appliquer l'authentification pour toutes les autres routes
	// 	await fastify.authenticate(request, reply);
	// });

	// adminController
	fastify.get('/admin/get-all-users', getAllUsers)
	fastify.delete('/admin/delete-user', deleteUser)
	fastify.get('/admin/get-all-games', getAllGames)
	fastify.post('/admin/create-game', createGame)
	fastify.delete('/admin/delete-game', deleteGame)
	fastify.get('/admin/get-all-friendships', getAllFriendships)
	fastify.post('/admin/create-friendship', addFriendship)
	fastify.delete('/admin/delete-friendship', deleteFriendship)

	//usersController
	fastify.get('/profile', getUserProfile)
	fastify.get('/user/profile-picture', getUserProfilePicture)
	fastify.post('/user/create-user', createUser)
	fastify.post('/user/login', login)
	fastify.post('/user/login-1v1', login1v1)
	fastify.post('/user/login-2v2', login2v2)
	fastify.post('/user/logout', logout)
	fastify.put('/user/access-profile-infos', accessProfileInfo)
	fastify.put('/user/update-2fa', updateDoubleAuth)
	fastify.post('/user/verify-2fa', verifyDoubleAuth)
	fastify.post('/user/activate-2fa', activateDoubleAuth)
	fastify.post('/user/update-profile-picture', changeProfilePicture)
	fastify.put('/user/update-profile', changeProfile)
	fastify.delete('/user/delete-account', deleteAccount)
	fastify.post('/user/refresh-infos', refreshInfos)
	fastify.get('/user/export-data', exportUserData) // NOTE - new route to export user data
	//friendsController
	fastify.get('/friendship/get-user-friendships', getUserFriendships)
	fastify.post('/friendship/add-friend', addFriend)
	fastify.post('/friendship/accept-friend', acceptFriend)
	fastify.delete('/friendship/delete-friend', deleteFriend)

	//gamesController
	fastify.get('/game/get-user-games', getUserGames)
	fastify.post('/game/get-friend-games', getUserGames)
	fastify.post('/game/create-1v1-game', create1v1Game)
	fastify.post('/game/create-2v2-game', create2v2Game)

	// Tokens
	// fastify.post('/refresh-token', refreshAccessToken)
	fastify.get('/db-credentials', getSQLiteCreds)

	// CGU // FIXME - CGU routes
	// fastify.get('/check-cgu-status', { preValidation: [fastify.authenticate] }, checkCGU)
	// fastify.get('/accept-cgu', { preValidation: [fastify.authenticate] }, acceptCGU)
}
