// index.js
const path = require('path');
const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('fastify-static');

// Enregistre le plugin fastify-static pour servir les fichiers du dossier "public"
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/', // accessible sur la racine : http://localhost:3000/
});

// Vous pouvez garder ou modifier vos routes API
fastify.get('/api', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    // Écoute sur le port 3000 et toutes les interfaces réseau
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server listening on http://0.0.0.0:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
