//ESM
import Fastify from "fastify";

// Pour post du html
import path from "path";
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';

//Pour SQLite
import Database from "better-sqlite3";

//commonJS (CJS)
// const path = require('path');

// VARIABLES
const fastify = Fastify({ logger: true })

const db = new Database('database.sqlite', { verbose: console.log });


// FUNCTIONS
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`).run();


 
// Pour obtenir __dirname en ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Enregistrement du plugin pour servir les fichiers statiques depuis le dossier "public"
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/', // URL de base pour accéder aux fichiers statiques
});

//a essayer :
// Servir les fichiers statiques depuis le dossier public
// fastify.register(fastifyStatic, {
//     root: join(process.cwd(), "public"),
//     prefix: "/", // Les fichiers seront accessibles directement depuis la racine
// });
//--

// On enregistre une route GET sans fichier html
// fastify.get('/',
// 	function (request, reply) {
// 		reply.send({ hello: 'world' })
// 	}
// )

/* ADMINN */

// Route POST pour ajouter un utilisateur
fastify.post('/admin', async (request, reply) => {
	const { name, email } = request.body;
	try {
	  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
	  const info = stmt.run(name, email);
	  reply.code(201);
	  return { id: info.lastInsertRowid, name, email };
	} catch (err) {
	  fastify.log.error(err);
	  reply.code(500);
	  return { error: err.message };
	}
  });

// Route GET pour lister tous les utilisateurs
// fastify.get('/admin', async (request, reply) => {
// 	try {
// 	  const users = db.prepare('SELECT * FROM users').all();
// 	  return users;
// 	} catch (err) {
// 	  fastify.log.error(err);
// 	  reply.code(500);
// 	  return { error: err.message };
// 	}
//   });

// Route DELETE pour supprimer un utilisateur par son id
fastify.delete('/admin/:id', async (request, reply) => {
	const { id } = request.params;
	try {
	  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
	  const info = stmt.run(id);
	  if (info.changes === 0) {
		reply.code(404);
		return { error: 'Utilisateur non trouvé' };
	  }
	  return { message: 'Utilisateur supprimé avec succès' };
	} catch (err) {
	  fastify.log.error(err);
	  reply.code(500);
	  return { error: err.message };
	}
  });

// Optionnel : Route GET pour servir la page d'administration
fastify.get('/admin', async (request, reply) => {
	return reply.sendFile('admin.html');
  });

/* USERSSS */

// Route POST pour ajouter un utilisateur
fastify.post('/users',
	async (request, reply) => {
		const {name, email} = request.body;
		const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
		const info = stmt.run (name, email);
		return { id: info.lastInsertRowid, name, email };
});

// Route GET pour récupérer tous les utilisateurs
fastify.get('/users', async (request, reply) => {
	const users = db.prepare('SELECT * FROM users').all();
	return users;
  });

fastify.get('/',
	function (request, reply) {
		reply.sendFile('index.html')
	}
)


// Run the server!
/**
 * @explication Pour Fastify dans docker, il faut ecouter sur toutes les IP, donc: 0.0.0.0
 * @type test
 */
const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' })
		
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()