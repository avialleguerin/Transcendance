//CRUD Model actually and MVC Structure
import db from "../utils/db.js";

export const CREATE_GAMES_TABLE = `
	CREATE TABLE IF NOT EXISTS games (
		gameId INTEGER PRIMARY KEY AUTOINCREMENT,
		user1_id TEXT NOT NULL,
		user2_id TEXT NOT NULL,
		winner_id TEXT DEFAULT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user1_id) REFERENCES users(userId) ON DELETE CASCADE,
		FOREIGN KEY (user2_id) REFERENCES users(userId) ON DELETE CASCADE,
		FOREIGN KEY (winner_id) REFERENCES users(userId) ON DELETE SET NULL
	);
`;

const gamesModel = {
	createGame: (user1_id, user2_id) => {
		db.prepare("INSERT INTO games (user1_id, user2_id) VALUES (?, ?)").run(user1_id, user2_id);
		return { user1_id, user2_id };
	},
	getAllGames: () => db.prepare("SELECT g.gameId, g.user1_id, g.user2_id, g.winner_id, g.created_at, u1.username as user1_name, u2.username as user2_name, w.username as winner_name FROM games g JOIN users u1 ON g.user1_id = u1.userId JOIN users u2 ON g.user2_id = u2.userId LEFT JOIN users w ON g.winner_id = w.userId").all(),
	getgameById: (gameId) => { return db.prepare("SELECT * FROM games WHERE gameId = ?").get(gameId) },
	delete: (gameId) => { return db.prepare("DELETE FROM games WHERE gameId = ?").run(gameId) },
	getGamesByUserId: (userId) => { return db.prepare("SELECT * FROM games WHERE user1_id = ? OR user2_id = ? ORDER BY created_at DESC").all(userId, userId) }
	// getGameByUser: (user) => { return db.prepare("SELECT * FROM games WHERE user1 = ? OR user2 = ?").all(user, user) }, //FIXME - change to this

}

export default gamesModel;