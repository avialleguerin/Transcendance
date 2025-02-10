import Fastify from 'fastify'
 
// On crée une instance de fastify en activant les logs
const fastify = Fastify({ logger: true })
 
// On enregistre une route GET
fastify.get('/',
	function (request, reply) {
		reply.send({ hello: 'world' })
	}
)

// Run the server!
const start = async () => {
	try {
		await fastify.listen({ port: 3000 })
		
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()