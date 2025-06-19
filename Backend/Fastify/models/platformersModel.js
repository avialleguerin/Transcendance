import db from "../utils/db.js";

export const CREATE_PLATFORMERS_TABLE = `
	CREATE TABLE IF NOT EXISTS platformers (
		platformerId INTEGER PRIMARY KEY AUTOINCREMENT,
		user1_id INTEGER NOT NULL,
		user2_id INTEGER NOT NULL,
		score1 INTEGER NOT NULL DEFAULT 0 CHECK(score1 >= 0),
		score2 INTEGER NOT NULL DEFAULT 0 CHECK(score2 >= 0),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user1_id) REFERENCES users(userId) ON DELETE CASCADE,
		FOREIGN KEY (user2_id) REFERENCES users(userId) ON DELETE CASCADE
    );
`;

const platformersModel = {
	createPlatformer: (user1_id, user2_id, score1, score2) => { db.prepare("INSERT INTO platformers (user1_id, user2_id, score1, score2) VALUES (?, ?, ?, ?)").run(user1_id, user2_id, score1, score2) },
	getAllPlatformers: () => db.prepare(`
		SELECT p.platformerId, p.user1_id, p.user2_id, p.score1, p.score2, p.created_at,
			u1.name as user1_name, u2.name as user2_name
		FROM platformers p
		JOIN users u1 ON p.user1_id = u1.userId
		JOIN users u2 ON p.user2_id = u2.userId`).all(),
	getPlatformerById: (platformerId) => { return db.prepare("SELECT * FROM platformers WHERE platformerId = ?").get(platformerId) },
	deletePlatformer: (platformerId) => { return db.prepare("DELETE FROM platformers WHERE platformerId = ?").run(platformerId) },
	getUserPlatformer: (user) => { 
		return db.prepare(`
			SELECT p.platformerId, p.user1_id, p.user2_id, p.score1, p.score2, p.created_at,
				u1.name as player1, u2.name as player2
			FROM platformers p
			JOIN users u1 ON p.user1_id = u1.userId
			JOIN users u2 ON p.user2_id = u2.userId
			WHERE p.user1_id = ? OR p.user2_id = ?
			ORDER BY p.created_at DESC
		`).all(user, user) 
	},
	getPlatformerByUserId: (userId) => { return db.prepare("SELECT * FROM platformers WHERE user1_id = ? OR user2_id = ? ORDER BY created_at DESC").all(userId) }
}

export default platformersModel;