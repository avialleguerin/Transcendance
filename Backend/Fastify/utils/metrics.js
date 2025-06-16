import fastify from 'fastify';
import client from 'prom-client';

const register = new client.Registry(); // A registry is a collection of metrics

client.collectDefaultMetrics({ register }); // default metrics like CPU and memory usage

// Custom metrics for HTTP request duration and total requests
const httpRequestDuration = new client.Histogram({
	name: 'http_request_duration_seconds',
	help: 'Duration of HTTP requests in seconds',
	labelNames: ['method', 'route', 'status_code'],
	buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method', 'route', 'status_code']
});

// Métriques applicatives
const activeUsers = new client.Gauge({
	name: 'fastify_active_users_total',
	help: 'Number of currently active users'
});
  
const gamesPlayed = new client.Counter({
	name: 'fastify_games_total',
	help: 'Total number of games played',
	labelNames: ['game_type']
});
  
const authAttempts = new client.Counter({
	name: 'fastify_auth_attempts_total',
	help: 'Total authentication attempts',
	labelNames: ['status', 'method']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(activeUsers);
register.registerMetric(gamesPlayed);
register.registerMetric(authAttempts);



export { 
	register, 
	httpRequestDuration, 
	httpRequestsTotal, 
	activeUsers, 
	gamesPlayed, 
	authAttempts 
};

export async function getMetrics(request, reply) {
	try {
		reply.header('Content-Type', register.contentType);
		reply.send(await register.metrics());
	} catch (error) {
		request.log.error(error);
		fastify.log.error('Error retrieving metrics:', error);
		reply.status(500).send('Error retrieving metrics');
	}
}