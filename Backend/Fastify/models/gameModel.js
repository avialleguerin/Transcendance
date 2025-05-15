//CRUD Model actually and MVC Structure
import db from "../utils/db.js";

export const CREATE_GAMES_TABLE = `
	CREATE TABLE IF NOT EXISTS games (
		gameId INTEGER PRIMARY KEY AUTOINCREMENT,
		user1 TEXT NOT NULL,
		user2 TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user1) REFERENCES users(username),
		FOREIGN KEY (user2) REFERENCES users(username)
	);
`;

const gameModel = {
	createGame: (user1, user2) => {
		db.prepare("INSERT INTO games (user1, user2) VALUES (?, ?)").run(user1, user2);
		return { user1, user2 };
	},
	// getAllGames: () => db.prepare("SELECT * FROM games").all(),
	// getGameById: (gameId) => { return db.prepare("SELECT * FROM games WHERE gameId = ?").get(gameId) },
	// getGameByUser: (user) => { return db.prepare("SELECT * FROM games WHERE user1 = ? OR user2 = ?").all(user, user) },
}

export default gameModel;