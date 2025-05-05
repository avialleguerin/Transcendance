import { register, selectUsers, unregister, login, logout, changeDoubleAuth, accessProfileInfo, changeRole, changeProfilePicture, changeProfile, refreshAccessToken, getUserProfile, verifyDoubleAuth, activateDoubleAuth, refreshInfos } from '../controllers/authController.js';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export default async function routes (fastify) {

	fastify.addHook("onRequest", async (request, reply) => {
		console.log(`\n📡 Requête reçue : [${request.method}] ${request.url}\n`);
	});
	//authController
	fastify.get('/profile', { preHandler: fastify.authenticate}, getUserProfile);
	fastify.get('/users', selectUsers);
	fastify.post('/users/add', register);
	fastify.put('/users/login', login);
	fastify.post('/users/logout/:userId', logout);
	fastify.put('/users/doubleAuth/:userId', changeDoubleAuth);
	fastify.put('/users/accessProfileInfo/:userId', accessProfileInfo);
	fastify.post('/users/verify-2fa', verifyDoubleAuth);
	fastify.post('/users/activate-2fa', activateDoubleAuth);
	fastify.put('/users/role/:userId', changeRole);
	fastify.put('/users/update-profile-picture/:userId', changeProfilePicture);
	fastify.put('/users/update-profile/:userId', changeProfile);
	fastify.delete('/users/delete/:userId', unregister);
	fastify.post('/users/refresh-infos/:userId', refreshInfos);

	// Tokens
	fastify.post('/refresh-token', refreshAccessToken);
}
