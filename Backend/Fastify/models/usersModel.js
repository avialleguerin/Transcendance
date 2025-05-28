//CRUD Model actually and MVC Structure
import db from "../utils/db.js";
import { getCurrentCGUVersion } from "../utils/cgu.js";

export const CREATE_USERS_TABLE = `
	CREATE TABLE IF NOT EXISTS users (
		userId INTEGER PRIMARY KEY AUTOINCREMENT,
		profile_picture TEXT DEFAULT 'default-profile-picture.png',
		username TEXT UNIQUE NOT NULL CHECK(length(username) <= 10),
		password TEXT NOT NULL CHECK(length(password) <= 255),
		doubleAuth_status INTEGER DEFAULT 0 CHECK(doubleAuth_status IN (0, 1)),
		doubleAuth_secret TEXT,
		games_won INTEGER DEFAULT 0,
		games_lost INTEGER DEFAULT 0,
		cgu_accepted DATETIME DEFAULT CURRENT_TIMESTAMP,
		cgu_version TEXT DEFAULT '1.0',
		last_connection DATETIME DEFAULT CURRENT_TIMESTAMP,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
`;

const usersModel = {
	createUser: (username, password) => {
		const currentCGUVersion = "1.0"; // À définir ailleurs ou en constante
		db.prepare("INSERT INTO users (username, password, cgu_version) VALUES (?, ?, ?)").run(username, password, currentCGUVersion);
		return { username };
	},
	getAllUsers: () => db.prepare("SELECT * FROM users").all(),
	getUserById: (userId) => { return db.prepare("SELECT * FROM users WHERE userId = ?").get(userId) },
	getUserByUsername: (username) => { return db.prepare("SELECT * FROM users WHERE username = ?").get(username) },
	updateDoubleAuth_status: (userId, doubleAuth_status) => { return db.prepare("UPDATE users SET doubleAuth_status = ? WHERE userId = ?").run(doubleAuth_status, userId) },
	updateDoubleAuth_secret: (userId, doubleAuth_secret) => { return db.prepare("UPDATE users SET doubleAuth_secret = ? WHERE userId = ?").run(doubleAuth_secret, userId) },
	updateUsername: (userId, newUsername) => { return db.prepare("UPDATE users SET username = ? WHERE userId = ?").run(newUsername, userId) },
	updatePassword: (userId, newPassword) => { return db.prepare("UPDATE users SET password = ? WHERE userId = ?").run(newPassword, userId) },
	updateProfilePicture: (userId, profile_picture) => { return db.prepare("UPDATE users SET profile_picture = ? WHERE userId = ?").run(profile_picture, userId) },
	delete: (userId) => { return db.prepare("DELETE FROM users WHERE userId = ?").run(userId) },
	updateGamesWon: (userId) => { return db.prepare("UPDATE users SET games_won = games_won + 1 WHERE userId = ?").run(userId) },
	updateGamesLost: (userId) => { return db.prepare("UPDATE users SET games_lost = games_lost + 1 WHERE userId = ?").run(userId) },
	updateUserCGUVersion: (userId, version) => { return db.prepare("UPDATE users SET cgu_version = ?, cgu_accepted = CURRENT_TIMESTAMP WHERE userId = ?").run(version, userId) },
	updateLastConnection: (userId) => { return db.prepare("UPDATE users SET last_connection = CURRENT_TIMESTAMP WHERE userId = ?").run(userId) },
	getUsersWithOldCGU: () => {
		const currentVersion = getCurrentCGUVersion();
		return db.prepare("SELECT * FROM users WHERE cgu_version != ?").all(currentVersion);
	},
	deleteInactiveUsers: () => { return db.prepare("DELETE FROM users WHERE last_connection <= date('now', '-3 years')").run() },
}

export default usersModel;