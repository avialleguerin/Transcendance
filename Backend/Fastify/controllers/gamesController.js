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
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		let user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		if (username)
			user = usersModel.getUserByUsername(username)
		const games = gamesModel.getUserGames(user.userId)
		console.log("game :", games)
		return reply.send({ success: true, user: user, games: games, accessToken: infos.accessToken })
	} catch (err) {
		return reply.code(500).send({ error: err.message })
	}
}

export async function create1v1Game(request, reply) {
	const { player1, player2, score_left, score_right } = request.body
	console.log("score_left :", score_left)
	console.log("score_right :", score_right)

	try {
		if (!player1 || !player2 || !score_left || !score_right)
			return reply.code(400).send({ success: false, error: "Missing parameters", accessToken: infos.accessToken })
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		const player1_id = usersModel.getUserByUsername(player1).userId
		const player2_id = usersModel.getUserByUsername(player2).userId
		gamesModel.create1v1Game(player1_id, player2_id, score_left, score_right)
		if (score_left < score_right) {
			usersModel.updateGamesLost(player1_id)
			usersModel.updateGamesWon(player2_id)
		} else {
			usersModel.updateGamesWon(player1_id)
			usersModel.updateGamesLost(player2_id)
		}

		return reply.code(201).send({ 
			success: true,
			message: "Game finished successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		console.error("Error finishing game:", err)
		return reply.code(500).send({ error: err.message })
	}
}

export async function create2v2Game(request, reply) {
	const { player1, player2, player3, player4, score_left, score_right } = request.body
	console.log("score_left :", score_left)
	console.log("score_right :", score_right)

	try {
		if (!player1 || !player2 || !player3 || !player4 || !score_left || !score_right)
			return reply.code(400).send({ success: false, error: "Missing parameters", accessToken: infos.accessToken })
		const infos = await getUserFromToken(request)
		if (!infos)
			return reply.code(401).send({ error: "Unauthorized" })
		const user = infos.user
		if (!user)
			return reply.code(401).send({ error: "User not found" })
		if (!infos.accessToken)
			return reply.code(401).send({ error: "Unauthorized" })
		const player1_id = usersModel.getUserByUsername(player1).userId
		const player2_id = usersModel.getUserByUsername(player2).userId
		const player3_id = usersModel.getUserByUsername(player3).userId
		const player4_id = usersModel.getUserByUsername(player4).userId
		gamesModel.create2v2Game(player1_id, player2_id, player3_id, player4_id, score_left, score_right)

		if (score_left < score_right) {
			usersModel.updateGamesLost(player1_id)
			usersModel.updateGamesLost(player2_id)
			usersModel.updateGamesWon(player3_id)
			usersModel.updateGamesWon(player4_id)
		} else {
			usersModel.updateGamesWon(player1_id)
			usersModel.updateGamesWon(player2_id)
			usersModel.updateGamesLost(player3_id)
			usersModel.updateGamesLost(player4_id)
		}

		return reply.code(201).send({ 
			success: true,
			message: "Game finished successfully",
			accessToken: infos.accessToken
		})
	} catch (err) {
		console.error("Error finishing game:", err)
		return reply.code(500).send({ error: err.message })
	}
}
