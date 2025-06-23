import db from "../utils/db.js";

export const CREATE_GAMES_TABLE = `
	CREATE TABLE IF NOT EXISTS games (
		gameId INTEGER PRIMARY KEY AUTOINCREMENT,
		user1_id TEXT NOT NULL,
		user2_id TEXT NOT NULL,
		user3_id TEXT DEFAULT NULL,
		user4_id TEXT DEFAULT NULL,
		score_left INTEGER DEFAULT 0,
		score_right INTEGER DEFAULT 0,
		created_at DATETIME DEFAULT (datetime('now', 'localtime')),
		FOREIGN KEY (user1_id) REFERENCES users(userId),
		FOREIGN KEY (user2_id) REFERENCES users(userId),
		FOREIGN KEY (user3_id) REFERENCES users(userId),
		FOREIGN KEY (user4_id) REFERENCES users(userId)
	);
`;

const gamesModel = {
	createGame: (user1_id, user2_id) => {
		db.prepare("INSERT INTO games (user1_id, user2_id) VALUES (?, ?)").run(user1_id, user2_id);
		return { user1_id, user2_id };
	},
	create1v1Game: (user1_id, user2_id, score_left, score_user2) => {
		db.prepare("INSERT INTO games (user1_id, user2_id, score_left, score_right) VALUES (?, ?, ?, ?)").run(user1_id, user2_id, score_left, score_user2);
	},
	create2v2Game: (user1_id, user2_id, user3_id, user4_id, score_left, score_right) => {
		db.prepare("INSERT INTO games (user1_id, user2_id, user3_id, user4_id, score_left, score_right) VALUES (?, ?, ?, ?, ?, ?)").run(user1_id, user2_id, user3_id, user4_id, score_left, score_right);
	},

	getAllGames: () => db.prepare(`
		SELECT g.gameId, g.user1_id, g.user2_id, g.user3_id, g.user4_id, g.score_left, g.score_right, g.created_at,
			u1.username as user1_name,  u2.username as user2_name, u3.username as user3_name, u4.username as user4_name
		FROM games g
		JOIN users u1 ON g.user1_id = u1.userId
		JOIN users u2 ON g.user2_id = u2.userId
		LEFT JOIN users u3 ON g.user3_id = u3.userId
		LEFT JOIN users u4 ON g.user4_id = u4.userId`
	).all(),

	getUserGames: (user) => {
		return db.prepare(`
			SELECT g.gameId, g.user1_id, g.user2_id, g.user3_id, g.user4_id, g.score_left, g.score_right, g.created_at,
				u1.username as user1_username, u1.profile_picture as user1ProfilePicture, u2.username as user2_username, u2.profile_picture as user2ProfilePicture, u3.username as user3_username, u3.profile_picture as user3ProfilePicture, u4.username as user4_username, u4.profile_picture as user4ProfilePicture
			FROM games g
			JOIN users u1 ON g.user1_id = u1.userId 
			JOIN users u2 ON g.user2_id = u2.userId
			LEFT JOIN users u3 ON g.user3_id = u3.userId
			LEFT JOIN users u4 ON g.user4_id = u4.userId
			WHERE g.user1_id = ? OR g.user2_id = ? OR g.user3_id = ? OR g.user4_id = ?
			ORDER BY g.created_at DESC
		`).all(user, user, user, user)
	},

	getgameById: (gameId) => { return db.prepare("SELECT * FROM games WHERE gameId = ?").get(gameId) },
	updateScore: (gameId, score_left, score_right) => { db.prepare("UPDATE games SET score_left = ?, score_user2 = ? WHERE gameId = ?").run(score_left, score_right, gameId) },
	deleteGame: (gameId) => { return db.prepare("DELETE FROM games WHERE gameId = ?").run(gameId) },
	getGamesByUserId: (userId) => { return db.prepare("SELECT * FROM games WHERE user1_id = ? OR user2_id = ? ORDER BY created_at DESC").all(userId, userId) }

}

export default gamesModel;