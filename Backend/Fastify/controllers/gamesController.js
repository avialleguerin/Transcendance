import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'
import { getUserFromToken } from './utils.js'

export async function getUserGames(request, reply) {
	let username = null
	if (request.body)
		username = request.body.username
	try {
		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('Games access denied: Unauthorized request')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		let user = infos.user
		if (!user) {
			fastify.log.warn('Games access denied: User not found in token')
			return reply.code(401).send({ error: "User not found" })
		}
		if (!infos.accessToken) {
			fastify.log.warn('Games access denied: Missing access token')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		if (username) {
			user = usersModel.getUserByUsername(username)
			fastify.log.info(`Retrieving games for specific user: ${username}`)
		}
		const games = gamesModel.getUserGames(user.userId)
		fastify.log.info(`Games retrieved for user: ${user.username} (${games.length} found)`)
		return reply.send({ success: true, user: user, games: games, accessToken: infos.accessToken })
	} catch (err) {
		fastify.log.error(`Error retrieving user games: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function create1v1Game(request, reply) {
	const { player1, player2, score_left, score_right } = request.body

	try {
		if (!player1 || !player2 || score_left === undefined || score_right === undefined) {
			fastify.log.warn('1v1 game creation failed: Missing parameters')
			return reply.code(400).send({ success: false, error: "Missing parameters" })
		}

		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('1v1 game creation denied: Unauthorized request')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const user = infos.user
		if (!user) {
			fastify.log.warn('1v1 game creation failed: User not found in token')
			return reply.code(401).send({ error: "User not found" })
		}
		if (!infos.accessToken) {
			fastify.log.warn('1v1 game creation denied: Missing access token')
			return reply.code(401).send({ error: "Unauthorized" })
		}

		const player1User = usersModel.getUserByUsername(player1)
		const player2User = usersModel.getUserByUsername(player2)
		
		if (!player1User) {
			fastify.log.warn(`1v1 game creation failed: Player1 '${player1}' not found`)
			return reply.code(404).send({ success: false, error: `Player '${player1}' not found`, accessToken: infos.accessToken })
		}
		if (!player2User) {
			fastify.log.warn(`1v1 game creation failed: Player2 '${player2}' not found`)
			return reply.code(404).send({ success: false, error: `Player '${player2}' not found`, accessToken: infos.accessToken })
		}

		fastify.log.info(`Creating 1v1 game: ${player1} (${score_left}) vs ${player2} (${score_right})`)
		
		gamesModel.create1v1Game(player1User.userId, player2User.userId, score_left, score_right)
		
		if (score_left < score_right) {
			usersModel.updateGamesLost(player1User.userId)
			usersModel.updateGamesWon(player2User.userId)
			fastify.log.info(`🏆 1v1 game result: ${player2} wins against ${player1}`)
		} else {
			usersModel.updateGamesWon(player1User.userId)
			usersModel.updateGamesLost(player2User.userId)
			fastify.log.info(`🏆 1v1 game result: ${player1} wins against ${player2}`)
		}

		fastify.log.info(`1v1 game created successfully: ${player1} vs ${player2}`)
		return reply.code(201).send({ 
			success: true,
			message: "Game finished successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		fastify.log.error(`Error creating 1v1 game: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}

export async function create2v2Game(request, reply) {
	const { player1, player2, player3, player4, score_left, score_right } = request.body

	try {
		if (!player1 || !player2 || !player3 || !player4 || score_left === undefined || score_right === undefined) {
			fastify.log.warn('2v2 game creation failed: Missing parameters')
			return reply.code(400).send({ success: false, error: "Missing parameters" })
		}

		const infos = await getUserFromToken(request)
		if (!infos) {
			fastify.log.warn('2v2 game creation denied: Unauthorized request')
			return reply.code(401).send({ error: "Unauthorized" })
		}
		const user = infos.user
		if (!user) {
			fastify.log.warn('2v2 game creation failed: User not found in token')
			return reply.code(401).send({ error: "User not found" })
		}
		if (!infos.accessToken) {
			fastify.log.warn('2v2 game creation denied: Missing access token')
			return reply.code(401).send({ error: "Unauthorized" })
		}

		const player1User = usersModel.getUserByUsername(player1)
		const player2User = usersModel.getUserByUsername(player2)
		const player3User = usersModel.getUserByUsername(player3)
		const player4User = usersModel.getUserByUsername(player4)
		
		if (!player1User) {
			fastify.log.warn(`2v2 game creation failed: Player1 '${player1}' not found`)
			return reply.code(404).send({ success: false, error: `Player '${player1}' not found`, accessToken: infos.accessToken })
		}
		if (!player2User) {
			fastify.log.warn(`2v2 game creation failed: Player2 '${player2}' not found`)
			return reply.code(404).send({ success: false, error: `Player '${player2}' not found`, accessToken: infos.accessToken })
		}
		if (!player3User) {
			fastify.log.warn(`2v2 game creation failed: Player3 '${player3}' not found`)
			return reply.code(404).send({ success: false, error: `Player '${player3}' not found`, accessToken: infos.accessToken })
		}
		if (!player4User) {
			fastify.log.warn(`2v2 game creation failed: Player4 '${player4}' not found`)
			return reply.code(404).send({ success: false, error: `Player '${player4}' not found`, accessToken: infos.accessToken })
		}

		fastify.log.info(`Creating 2v2 game: ${player1} & ${player2} (${score_left}) vs ${player3} & ${player4} (${score_right})`)
		
		gamesModel.create2v2Game(player1User.userId, player2User.userId, player3User.userId, player4User.userId, score_left, score_right)

		if (score_left < score_right) {
			usersModel.updateGamesLost(player1User.userId)
			usersModel.updateGamesLost(player2User.userId)
			usersModel.updateGamesWon(player3User.userId)
			usersModel.updateGamesWon(player4User.userId)
			fastify.log.info(`🏆 2v2 game result: ${player3} & ${player4} win against ${player1} & ${player2}`)
		} else {
			usersModel.updateGamesWon(player1User.userId)
			usersModel.updateGamesWon(player2User.userId)
			usersModel.updateGamesLost(player3User.userId)
			usersModel.updateGamesLost(player4User.userId)
			fastify.log.info(`🏆 2v2 game result: ${player1} & ${player2} win against ${player3} & ${player4}`)
		}

		fastify.log.info(`2v2 game created successfully: ${player1} & ${player2} vs ${player3} & ${player4}`)
		return reply.code(201).send({ 
			success: true,
			message: "Game finished successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		fastify.log.error(`Error creating 2v2 game: ${err.message}`)
		return reply.code(500).send({ error: err.message })
	}
}
