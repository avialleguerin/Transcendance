// import fastifyStatic from '@fastify/static';
import { join } from 'path';

// export default async function registerPlugins(fastify, options) {
	// Enregistrer le plugin pour servir les fichiers statiques du dossier "public"
	// fastify.register(fastifyStatic, {
	//   root: join(process.cwd(), 'public'),
	//   prefix: '/',
	// });
  
	// Enregistrer un plugin pour servir des fichiers depuis le dossier "utils"
	// fastify.register(fastifyStatic, {
	//   root: join(process.cwd(), 'utils'),
	//   prefix: '/utils/',
	// });
	// fastify.register(async function (instance, opts) {
	// 	instance.register(fastifyStatic, {
	// 	  root: join(process.cwd(), 'utils'),
	// 	  prefix: '/utils/', // Accessible via http://localhost:3000/utils/
	// 	});
	// });
// }