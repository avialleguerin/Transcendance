//CRUD Model actually and MVC Structure
import db from "../utils/db.js";

export const CREATE_PLATFORMERS_TABLE = `
	CREATE TABLE IF NOT EXISTS platformers (
		platformerId INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id TEXT NOT NULL,
		chrono INTEGER NOT NULL DEFAULT 0 CHECK(chrono >= 0 AND chrono <= 300),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(userId) ON DELETE CASCADE
	);
`;

const platformersModel = {
	createPlatformer: (user_id, chrono) => { db.prepare("INSERT INTO platformers (user_id, chrono) VALUES (?, ?)").run(user_id, chrono) },
	getAllPlatformers: () => db.prepare("SELECT g.platformerId, g.user_id, g.chrono, g.created_at, u.username as username FROM platformers g JOIN users u ON g.user_id = u.userId").all(),
	getPlatformerById: (platformerId) => { return db.prepare("SELECT * FROM platformers WHERE platformerId = ?").get(platformerId) },
	updateChrono: (platformerId, chrono) => { db.prepare("UPDATE platformer SET chrono = ? WHERE platformerId = ?").run(chrono, platformerId) },
	deletePlatformer: (platformerId) => { return db.prepare("DELETE FROM platformers WHERE platformerId = ?").run(platformerId) },
	getUserPlatformer: (user) => { return db.prepare("SELECT g.platformerId, g.user_id, g.chrono, g.created_at, u.username as username as FROM platformers g JOIN users u ON g.user_id = u.userId WHERE g.user_id = ? ORDER BY g.created_at DESC").all(user) },
	getPlatformerByUserId: (userId) => { return db.prepare("SELECT * FROM platformers WHERE user_id = ? ORDER BY created_at DESC").all(userId) }
}

export default platformersModel;