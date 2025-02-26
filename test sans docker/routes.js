import { join } from 'path';
//commands
import insertUser, {selectUsers, deleteUsers} from './controllers/userController.js';


/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export default async function routes (fastify, options) {
	// On suppose que l'instance de base de données est passée dans options.db
	// Par exemple : options = { db: votreInstanceDeDatabase }

	// --- Optionnel : Route GET pour servir la page d'administration ---
	fastify.get('/admin', async (request, reply) => {
		// Cette route renvoie le fichier admin.html (placé dans votre dossier static, ex: public)
		return reply.sendFile('admin.html');
	});

	/* --- USERSSS --- */

	// Route POST pour ajouter un utilisateur
	//   fastify.post('/users', async (request, reply) => {
	// 	const { name, email } = request.body;
	// 	try {
	// 	  const stmt = options.db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
	// 	  const info = stmt.run(name, email);
	// 	  reply.code(201);
	// 	  return { id: info.lastInsertRowid, name, email };
	// 	} catch (err) {
	// 	  fastify.log.error(err);
	// 	  reply.code(500);
	// 	  return { error: err.message };
	// 	}
	//   });

	fastify.post('/users/add', insertUser);
	fastify.delete('/users/:id', deleteUsers);
	fastify.get('/users', selectUsers);

	// Route GET pour servir le script admin.js situé dans le dossier "utils"
	fastify.get("/utils/admin.js", async (request, reply) => {
		// Le deuxième argument de sendFile permet d'indiquer un répertoire personnalisé
		return reply.sendFile("admin.js", join(process.cwd(), "utils"));
	});

	// Route GET pour servir la page index.html
	fastify.get('/', (request, reply) => {
	return reply.sendFile('index.html');
	});

	/*fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
	});*/
}