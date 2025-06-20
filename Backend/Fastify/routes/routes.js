import { getUserProfilePicture, createAccount , deleteAccount, login, login1v1, login2v2, logout, enableDoubleAuth, disableDoubleAuth, accessProfileInfo, changeProfilePicture, changeProfile, getUserProfile, verifyDoubleAuth, activateDoubleAuth, exportUserData, anonymizeUser, googleSignIn, googleConfig } from '../controllers/usersController.js';
import { getUserGames, create1v1Game, create2v2Game } from '../controllers/gamesController.js';
import { getUserPlatformer, createPlatformer } from '../controllers/platformerController.js';
import { getUserFriendships, addFriend, acceptFriend, deleteFriend } from '../controllers/friendshipsController.js';
import { getAllUsers, getDeletedUsers, deleteUser, forceDeleteUser, getAllGames, addGame, deleteGame, getAllPlatformers, addPlatformer, deletePlatformer, getAllFriendships, addFriendship, deleteFriendship } from '../controllers/adminController.js';
import { getSQLiteCreds } from '../utils/vault.js';
import { refreshInfos } from '../controllers/utils.js';
import { env } from 'process';
import { envLogConfig } from '../utils/logger.js';
import { create } from 'domain';

export default async function routes (fastify) {

	fastify.addHook("onRequest", async (request, reply) => {
		const getRouteDescription = (method, url) => {
			if (url.includes('/admin/')) return `Admin ${method}`;
			if (url.includes('/user/')) return `User ${method}`;
			if (url.includes('/game/')) return `Game ${method}`;
			if (url.includes('/friendship/')) return `Friend ${method}`;
			if (url.includes('/platformer/')) return `Platform ${method}`;
			return `${method}`;
		};
		const description = getRouteDescription(request.method, request.url);
		fastify.log.info(`${description} → ${request.url}`);
	});

	fastify.get('/admin/get-all-users', getAllUsers);
	fastify.get('/admin/get-all-games', getAllGames);
	fastify.get('/admin/get-all-platformers', getAllPlatformers);
	fastify.get('/admin/get-all-friendships', getAllFriendships);
	fastify.get('/admin/get-deleted-users', getDeletedUsers);
	fastify.post('/admin/create-user', createAccount);
	fastify.post('/admin/create-game', addGame);
	fastify.post('/admin/create-platformer', addPlatformer);
	fastify.post('/admin/create-friendship', addFriendship);
	fastify.delete('/admin/delete-user', deleteUser);
	fastify.delete('/admin/delete-game', deleteGame);
	fastify.delete('/admin/delete-platformer', deletePlatformer);
	fastify.delete('/admin/delete-friendship', deleteFriendship);
	fastify.delete('/admin/force-delete-user', forceDeleteUser);

	fastify.get('/profile', getUserProfile);
	fastify.get('/user/profile-picture', getUserProfilePicture);
	fastify.get('/user/google-config', googleConfig);
	fastify.get('/user/export-data', exportUserData);
	fastify.put('/user/access-profile-infos', accessProfileInfo);
	fastify.put('/user/enable-2fa', enableDoubleAuth);
	fastify.put('/user/disable-2fa', disableDoubleAuth);
	fastify.put('/user/update-profile', changeProfile);
	fastify.put('/user/anonymize-account', anonymizeUser);
	fastify.post('/user/create-account', createAccount);
	fastify.post('/user/login', login);
	fastify.post('/user/login-1v1', login1v1);
	fastify.post('/user/login-2v2', login2v2);
	fastify.post('/user/logout', logout);
	fastify.post('/user/verify-2fa', verifyDoubleAuth);
	fastify.post('/user/activate-2fa', activateDoubleAuth);
	fastify.post('/user/update-profile-picture', changeProfilePicture);
	fastify.post('/user/refresh-infos', refreshInfos);
	fastify.post('/user/google-signin', googleSignIn);
	fastify.delete('/user/delete-account', deleteAccount);

	fastify.get('/friendship/get-user-friendships', getUserFriendships);
	fastify.post('/friendship/add-friend', addFriend);
	fastify.post('/friendship/accept-friend', acceptFriend);
	fastify.delete('/friendship/delete-friend', deleteFriend);

	fastify.get('/game/get-user-games', getUserGames);
	fastify.post('/game/get-friend-games', getUserGames);
	fastify.post('/game/create-1v1-game', create1v1Game);
	fastify.post('/game/create-2v2-game', create2v2Game);

	fastify.get('/platformer/get-user-platformers', getUserPlatformer);
	fastify.post('/platformer/create-platformer', createPlatformer);

	fastify.get('/db-credentials', getSQLiteCreds);
	fastify.get('/config/logger', envLogConfig)
}
