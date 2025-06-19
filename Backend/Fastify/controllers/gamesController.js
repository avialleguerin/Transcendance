import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'
import { getUserFromToken } from './utils.js'

export async function getUserGames(request, reply) {
	let name = null
	
	if (request.body) name = request.body.name

	try {
		const infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })

		let user = infos.user
		if (!user) return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })
		
		if (name) {
			if (typeof name !== 'string' || name.trim() === '') return reply.code(400).send({ error: "Invalid username", accessToken: infos.accessToken })
			
			user = usersModel.getUserByName(name)
			if (!user || user.anonymized_at) return reply.code(404).send({ error: "User not found", accessToken: infos.accessToken })
		}
		
		const games = gamesModel.getUserGames(user.userId)
		return reply.send({ success: true, user: user, games: games, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}

export async function create1v1Game(request, reply) {
	const { name1, name2, score_left, score_right } = request.body
	let infos;

	if (!name1 || !name2 || score_left === undefined || score_right === undefined) return reply.code(400).send({ success: false, error: "Missing parameters" })
	if (typeof name1 !== 'string' || typeof name2 !== 'string') return reply.code(400).send({ success: false, error: "Player names must be strings" })
	if (name1.trim() === '' || name2.trim() === '') return reply.code(400).send({ success: false, error: "Player names cannot be empty" })
	if (name1 === name2) return reply.code(400).send({ success: false, error: "Cannot create a game with the same player" })

	const scoreLeft = parseInt(score_left, 10)
	const scoreRight = parseInt(score_right, 10)
	if (isNaN(scoreLeft) || isNaN(scoreRight) || scoreLeft < 0 || scoreRight < 0) return reply.code(400).send({ success: false, error: "Scores must be valid positive numbers" })

	try {
		infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })
		if (!infos.user) return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })

		const user1 = usersModel.getUserByName(name1)
		const user2 = usersModel.getUserByName(name2)
		
		if (!user1 || user1.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${name1}' not found`, accessToken: infos.accessToken })
		if (!user2 || user2.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${name2}' not found`, accessToken: infos.accessToken })

		gamesModel.create1v1Game(user1.userId, user2.userId, scoreLeft, scoreRight)
		
		if (scoreLeft < scoreRight) {
			usersModel.updateGamesLost(user1.userId)
			usersModel.updateGamesWon(user2.userId)
		} else {
			usersModel.updateGamesWon(user1.userId)
			usersModel.updateGamesLost(user2.userId)
		}

		return reply.code(201).send({ success: true, message: "Game finished successfully", accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}

export async function create2v2Game(request, reply) {
	const { name1, name2, name3, name4, score_left, score_right } = request.body
	let infos;

	if (!name1 || !name2 || !name3 || !name4 || score_left === undefined || score_right === undefined)
		return reply.code(400).send({ success: false, error: "Missing parameters" })
	if (typeof name1 !== 'string' || typeof name2 !== 'string' || typeof name3 !== 'string' || typeof name4 !== 'string')
		return reply.code(400).send({ success: false, error: "Player names must be strings" })
	if (name1.trim() === '' || name2.trim() === '' || name3.trim() === '' || name4.trim() === '')
		return reply.code(400).send({ success: false, error: "Player names cannot be empty" })

	const players = [name1, name2, name3, name4]
	const uniquePlayers = new Set(players)
	if (uniquePlayers.size !== players.length) return reply.code(400).send({ success: false, error: "Cannot create a game with duplicate players" })

	const scoreLeft = parseInt(score_left, 10)
	const scoreRight = parseInt(score_right, 10)
	if (isNaN(scoreLeft) || isNaN(scoreRight) || scoreLeft < 0 || scoreRight < 0) return reply.code(400).send({ success: false, error: "Scores must be valid positive numbers" })

	try {
		infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })
		if (!infos.user) return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })

		const user1 = usersModel.getUserByName(name1)
		const user2 = usersModel.getUserByName(name2)
		const user3 = usersModel.getUserByName(name3)
		const user4 = usersModel.getUserByName(name4)
		
		if (!user1 || user1.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${name1}' not found`, accessToken: infos.accessToken })
		if (!user2 || user2.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${name2}' not found`, accessToken: infos.accessToken })
		if (!user3 || user3.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${name3}' not found`, accessToken: infos.accessToken })
		if (!user4 || user4.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${name4}' not found`, accessToken: infos.accessToken })

		gamesModel.create2v2Game(user1.userId, user2.userId, user3.userId, user4.userId, scoreLeft, scoreRight)

		if (scoreLeft < scoreRight) {
			usersModel.updateGamesLost(user1.userId)
			usersModel.updateGamesLost(user2.userId)
			usersModel.updateGamesWon(user3.userId)
			usersModel.updateGamesWon(user4.userId)
		} else {
			usersModel.updateGamesWon(user1.userId)
			usersModel.updateGamesWon(user2.userId)
			usersModel.updateGamesLost(user3.userId)
			usersModel.updateGamesLost(user4.userId)
		}

		return reply.code(201).send({ success: true, message: "Game finished successfully", accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}
