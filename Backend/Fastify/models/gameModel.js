//CRUD Model actually and MVC Structure
import db from "../utils/db.js";

export const CREATE_GAMES_TABLE = `
	CREATE TABLE IF NOT EXISTS games (
		gameId INTEGER PRIMARY KEY AUTOINCREMENT,
		user1 TEXT UNIQUE NOT NULL,
		user2 TEXT UNIQUE NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);
`;