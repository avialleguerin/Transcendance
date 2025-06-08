import { getUserProfilePicture, createUser , deleteAccount, login, login1v1, login2v2, logout, updateDoubleAuth, accessProfileInfo, changeProfilePicture, changeProfile, getUserProfile, verifyDoubleAuth, activateDoubleAuth, exportUserData, anonymizeUser, googleSignIn, googleConfig } from '../controllers/usersController.js';
import { getUserGames, create1v1Game, create2v2Game } from '../controllers/gamesController.js';
import { getUserPlatformer, createPlatformer } from '../controllers/platformerController.js';
import { getUserFriendships, addFriend, acceptFriend, deleteFriend } from '../controllers/friendshipsController.js';
import { getAllUsers, getDeletedUsers, deleteUser, forceDeleteUser, getAllGames, createGame, deleteGame, getAllPlatformers, addPlatformer, deletePlatformer, getAllFriendships, addFriendship, deleteFriendship } from '../controllers/adminController.js';
import { getSQLiteCreds } from '../utils/vault.js'
import { refreshInfos } from '../controllers/utils.js';
import { env } from 'process';
import { envLogConfig } from '../utils/logger.js';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options 
 */
export default async function routes (fastify) {

	//// fastify.addHook("onRequest", async (request, reply) => {
	//// 	const cleanUrl = request.url.replace('/request', '');
	//// 	fastify.log.info(`→ ${request.method} ${cleanUrl}`);
	//// });

	fastify.addHook("onRequest", async (request, reply) => { // OPTION 3
		const getRouteDescription = (method, url) => {
			if (url.includes('/admin/')) return `🛡️  Admin ${method}`;
			if (url.includes('/user/')) return `👤  User ${method}`;
			if (url.includes('/game/')) return `🎮  Game ${method}`;
			if (url.includes('/friendship/')) return `👥  Friend ${method}`;
			return `🔍 ${method}`;
		};
		const description = getRouteDescription(request.method, request.url);
		fastify.log.info(`${description} → ${request.url}`);
		// fastify.colorLogger.info(`${description} → ${request.url}`);
	});


	//// // Hook d'authentification global // FIXME - A revoir
	//// fastify.addHook("preHandler", async (request, reply) => {
	//// 	// Liste des routes qui ne nécessitent pas d'authentification
	//// 	const publicRoutes = [
	//// 	  '/user/create-user',
	//// 	  '/user/login',
	//// 	  '/user/verify-2fa',
	//// 	  '/db-credentials'
	//// 	  // Ajoutez d'autres routes publiques si nécessaire
	//// 	];
	//// 	// Skip l'authentification pour les routes publiques
	//// 	if (publicRoutes.some(route => request.url.includes(route))) {
	//// 	  return;
	//// 	}
	//// 	// Appliquer l'authentification pour toutes les autres routes
	//// 		await fastify.authenticate(request, reply);
	//// });

	//* ADMIN
	fastify.get('/admin/get-all-users', getAllUsers)
	fastify.get('/admin/get-deleted-users', getDeletedUsers)
	fastify.delete('/admin/delete-user', deleteUser)
	fastify.delete('/admin/force-delete-user', forceDeleteUser)
	fastify.get('/admin/get-all-games', getAllGames)
	fastify.post('/admin/create-game', createGame)
	fastify.delete('/admin/delete-game', deleteGame)
	fastify.get('/admin/get-all-platformers', getAllPlatformers)
	fastify.post('/admin/create-platformer', addPlatformer)
	fastify.delete('/admin/delete-platformer', deletePlatformer)
	fastify.get('/admin/get-all-friendships', getAllFriendships)
	fastify.post('/admin/create-friendship', addFriendship)
	fastify.delete('/admin/delete-friendship', deleteFriendship)

	//* USERS
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
	fastify.put('/user/anonymize-account', anonymizeUser) //NOTE - new route to anonymize user account
	fastify.get('/user/google-config', googleConfig)
	fastify.post('/user/google-signin', googleSignIn) // NOTE - new route for Google Sign-In

	//* FRIENDS
	fastify.get('/friendship/get-user-friendships', getUserFriendships)
	fastify.post('/friendship/add-friend', addFriend)
	fastify.post('/friendship/accept-friend', acceptFriend)
	fastify.delete('/friendship/delete-friend', deleteFriend)

	//* GAMES
	fastify.get('/game/get-user-games', getUserGames)
	fastify.post('/game/get-friend-games', getUserGames)
	fastify.post('/game/create-1v1-game', create1v1Game)
	fastify.post('/game/create-2v2-game', create2v2Game)
	//platformerController
	fastify.get('/platformer/get-user-platformer', getUserPlatformer)
	fastify.post('/platformer/create-platformer', createPlatformer)

	//* TOKENS / OTHER 
	//// fastify.post('/refresh-token', refreshAccessToken)
	fastify.get('/db-credentials', getSQLiteCreds)
	fastify.get('/config/logger', envLogConfig)
}
