import { fastify } from '../server.js'
import usersModel from '../models/usersModel.js'
import gamesModel from '../models/gamesModel.js'
import { getUserFromToken, sanitizeInput } from './utils.js'
import friendshipsModel from '../models/friendshipsModel.js'

export async function getUserGames(request, reply) {
	try {
		const infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })

		let user = infos.user
		if (!user) return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })

		const games = gamesModel.getUserGames(user.userId)
		return reply.send({ success: true, user: user, games: games, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}

export async function getFriendGames(request, reply) {
	let username = null
	
	if (request.body) username = request.body.username
	if (!sanitizeInput(username, 'username').success)
			return reply.code(400).send({ error: "This user doesn't exist" })
	try {
		const infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })

		let user = infos.user
		if (!user) return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })
		
		if (username) {
			if (typeof username !== 'string' || username.trim() === '') return reply.code(400).send({ error: "Invalid username", accessToken: infos.accessToken })
				
			const friend = usersModel.getUserByUsername(username)
			if (!friend || friend.anonymized_at) return reply.code(404).send({ error: `Friend '${username}' not found`, accessToken: infos.accessToken })
				const friendship = friendshipsModel.getFriendship(user.userId, friend.userId)
			if (!friendship) return reply.code(404).send({ success: false, error: `Friendship with '${username}' not found`, accessToken: infos.accessToken })
				const isFriendId = user.userId === friendship.userId ? friendship.userId : friendship.friendId
			console.log(`Fetching games for : ${isFriendId}`)
			const games = gamesModel.getUserGames(isFriendId)
			return reply.send({ success: true, user: friend, games: games, accessToken: infos.accessToken })
		} else 
			return reply.code(400).send({ error: "Username is required", accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}

export async function create1v1Game(request, reply) {
	const { player1, player2, score_left, score_right } = request.body

	if (!sanitizeInput(player1, 'username').success || !sanitizeInput(player2, 'username').success ||
		!sanitizeInput(score_left, 'score').success || !sanitizeInput(score_right, 'score').success)
			return reply.code(400).send({ error: "Invalid inputs" })

	let infos;

	if (!player1 || !player2 || score_left === undefined || score_right === undefined) return reply.code(400).send({ success: false, error: "Missing parameters" })
	if (typeof player1 !== 'string' || typeof player2 !== 'string') return reply.code(400).send({ success: false, error: "Player names must be strings" })
	if (player1.trim() === '' || player2.trim() === '') return reply.code(400).send({ success: false, error: "Player names cannot be empty" })
	if (player1 === player2) return reply.code(400).send({ success: false, error: "Cannot create a game with the same player" })

	const scoreLeft = parseInt(score_left, 10)
	const scoreRight = parseInt(score_right, 10)
	if (isNaN(scoreLeft) || isNaN(scoreRight) || scoreLeft < 0 || scoreRight < 0) return reply.code(400).send({ success: false, error: "Scores must be valid positive numbers" }) // ?

	try {

		infos = await getUserFromToken(request)
		if (!infos) return reply.code(401).send({ error: "Unauthorized" })
		if (!infos.user) return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken) return reply.code(401).send({ error: "Unauthorized" })

		const player1User = usersModel.getUserByUsername(player1)
		const player2User = usersModel.getUserByUsername(player2)
		
		if (!player1User || player1User.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${player1}' not found`, accessToken: infos.accessToken })
		if (!player2User || player2User.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${player2}' not found`, accessToken: infos.accessToken })

		gamesModel.create1v1Game(player1User.userId, player2User.userId, scoreLeft, scoreRight)
		
		if (scoreLeft < scoreRight) {
			usersModel.updateGamesLost(player1User.userId)
			usersModel.updateGamesWon(player2User.userId)
		} else {
			usersModel.updateGamesWon(player1User.userId)
			usersModel.updateGamesLost(player2User.userId)
		}

		return reply.code(201).send({ success: true, message: "Game finished successfully", accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}

export async function create2v2Game(request, reply) {
	const { player1, player2, player3, player4, score_left, score_right } = request.body

	if (!sanitizeInput(player1, 'username').success || !sanitizeInput(player2, 'username').success ||
		!sanitizeInput(player3, 'username').success || !sanitizeInput(player4, 'username').success ||
		!sanitizeInput(score_left, 'score').success || !sanitizeInput(score_right, 'score').success)
			return reply.code(400).send({ error: "Invalid input" })
	let infos;

	if (!player1 || !player2 || !player3 || !player4 || score_left === undefined || score_right === undefined)
		return reply.code(400).send({ success: false, error: "Missing parameters" })
	if (typeof player1 !== 'string' || typeof player2 !== 'string' || typeof player3 !== 'string' || typeof player4 !== 'string')
		return reply.code(400).send({ success: false, error: "Player names must be strings" })
	if (player1.trim() === '' || player2.trim() === '' || player3.trim() === '' || player4.trim() === '')
		return reply.code(400).send({ success: false, error: "Player names cannot be empty" })

	const players = [player1, player2, player3, player4]
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

		const player1User = usersModel.getUserByUsername(player1)
		const player2User = usersModel.getUserByUsername(player2)
		const player3User = usersModel.getUserByUsername(player3)
		const player4User = usersModel.getUserByUsername(player4)
		
		if (!player1User || player1User.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${player1}' not found`, accessToken: infos.accessToken })
		if (!player2User || player2User.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${player2}' not found`, accessToken: infos.accessToken })
		if (!player3User || player3User.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${player3}' not found`, accessToken: infos.accessToken })
		if (!player4User || player4User.anonymized_at) return reply.code(404).send({ success: false, error: `Player '${player4}' not found`, accessToken: infos.accessToken })

		gamesModel.create2v2Game(player1User.userId, player2User.userId, player3User.userId, player4User.userId, scoreLeft, scoreRight)

		if (scoreLeft < scoreRight) {
			usersModel.updateGamesLost(player1User.userId)
			usersModel.updateGamesLost(player2User.userId)
			usersModel.updateGamesWon(player3User.userId)
			usersModel.updateGamesWon(player4User.userId)
		} else {
			usersModel.updateGamesWon(player1User.userId)
			usersModel.updateGamesWon(player2User.userId)
			usersModel.updateGamesLost(player3User.userId)
			usersModel.updateGamesLost(player4User.userId)
		}

		return reply.code(201).send({ success: true, message: "Game finished successfully", accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: "Internal server error", accessToken: infos?.accessToken })
	}
}
