import db from "../utils/db.js";

export const CREATE_PLATFORMERS_TABLE = `
	CREATE TABLE IF NOT EXISTS platformers (
		platformerId INTEGER PRIMARY KEY AUTOINCREMENT,
		user1_id INTEGER NOT NULL,
		user2_id INTEGER NOT NULL,
		score_player1 INTEGER NOT NULL DEFAULT 0 CHECK(score_player1 >= 0),
		score_player2 INTEGER NOT NULL DEFAULT 0 CHECK(score_player2 >= 0),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user1_id) REFERENCES users(userId) ON DELETE CASCADE,
		FOREIGN KEY (user2_id) REFERENCES users(userId) ON DELETE CASCADE
    );
`;

const platformersModel = {
	createPlatformer: (user1_id, user2_id, score_player1, score_player2) => { db.prepare("INSERT INTO platformers (user1_id, user2_id, score_player1, score_player2) VALUES (?, ?, ?, ?)").run(user1_id, user2_id, score_player1, score_player2) },
	getAllPlatformers: () => db.prepare(`
		SELECT p.platformerId, p.user1_id, p.user2_id, p.score_player1, p.score_player2, p.created_at,
			u1.username as user1_name, u2.username as user2_name
		FROM platformers p
		JOIN users u1 ON p.user1_id = u1.userId
		JOIN users u2 ON p.user2_id = u2.userId`).all(),
	getPlatformerById: (platformerId) => { return db.prepare("SELECT * FROM platformers WHERE platformerId = ?").get(platformerId) },
	deletePlatformer: (platformerId) => { return db.prepare("DELETE FROM platformers WHERE platformerId = ?").run(platformerId) },
	getUserPlatformer: (user) => { return db.prepare("SELECT p.platformerId, p.user1_id, p.score_player1, p.created_at, u.username FROM platformers p JOIN users u ON p.user1_id = u.userId WHERE p.user1_id = ? OR p.user2_id = ? ORDER BY p.created_at DESC").all(user, user) },
	getPlatformerByUserId: (userId) => { return db.prepare("SELECT * FROM platformers WHERE user1_id = ? OR user2_id = ? ORDER BY created_at DESC").all(userId) }
}

export default platformersModel;