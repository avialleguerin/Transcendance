import fp from 'fastify-plugin'

const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	bright: '\x1b[1m',
}

const colorize = {
	red: (text) => `${colors.red}${text}${colors.reset}`,
	green: (text) => `${colors.green}${text}${colors.reset}`,
	yellow: (text) => `${colors.yellow}${text}${colors.reset}`,
	blue: (text) => `${colors.blue}${text}${colors.reset}`,
	magenta: (text) => `${colors.magenta}${text}${colors.reset}`,
	cyan: (text) => `${colors.cyan}${text}${colors.reset}`,

	error: (text) => `${colors.red} ${text}${colors.reset}`,
	success: (text) => `${colors.green} ${text}${colors.reset}`,
	warning: (text) => `${colors.yellow} ${text}${colors.reset}`,
	info: (text) => `${colors.blue} ${text}${colors.reset}`,
	debug: (text) => `${colors.cyan} ${text}${colors.reset}`,
}

async function colorLoggerPlugin(fastify) {
	fastify.decorate('logger', {
		red: (message) => fastify.log.info(colorize.red(message)),
		green: (message) => fastify.log.info(colorize.green(message)),
		yellow: (message) => fastify.log.info(colorize.yellow(message)),
		blue: (message) => fastify.log.info(colorize.blue(message)),
		magenta: (message) => fastify.log.info(colorize.magenta(message)),
		cyan: (message) => fastify.log.info(colorize.cyan(message)),
		
		error: (message) => fastify.log.error(colorize.error(message)),
		
		success: (message) => fastify.log.info(colorize.success(message)),
		warn: (message) => fastify.log.warn(colorize.warning(message)),
		info: (message) => fastify.log.info(colorize.info(message)),
		debug: (message) => fastify.log.debug(colorize.debug(message)),
	})
}

export default fp(colorLoggerPlugin, {
	name: 'color-logger'
})


export async function envLogConfig(request, reply) {
    return {
        LOG_ACTIVE: process.env.LOG_ACTIVE === 'true',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info'
    };
}