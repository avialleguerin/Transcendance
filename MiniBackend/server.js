//ESM
import Fastify from "fastify";
import path from "path";
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';

//commonJS
// const path = require('path');

const fastify = Fastify({ logger: true })
 
// Pour obtenir __dirname en ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Plugin pour servir les fichiers statiques
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/', // URL de base pour accéder aux fichiers statiques
});

// On enregistre une route GET
// fastify.get('/',
// 	function (request, reply) {
// 		reply.send({ hello: 'world' })
// 	}
// )


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