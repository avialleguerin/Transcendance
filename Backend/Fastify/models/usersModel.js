import db from "../utils/db.js";
import { getCurrentCGUVersion } from "../utils/cgu.js";

export const CREATE_USERS_TABLE = `
	CREATE TABLE IF NOT EXISTS users (
		userId INTEGER PRIMARY KEY AUTOINCREMENT,
		profile_picture TEXT DEFAULT 'default-profile-picture.png',
		name TEXT UNIQUE NOT NULL CHECK(length(name) >= 3 AND length(name) <= 10),
		password TEXT NOT NULL CHECK(length(password) <= 255),
		doubleAuth_status INTEGER DEFAULT 0 CHECK(doubleAuth_status IN (0, 1)),
		doubleAuth_secret TEXT,
		games_won INTEGER DEFAULT 0,
		games_lost INTEGER DEFAULT 0,
		cgu_accepted DATETIME DEFAULT CURRENT_TIMESTAMP,
		cgu_version TEXT DEFAULT '1.0',
		online_status BOOL DEFAULT false,
		last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		deleted_at DATETIME DEFAULT NULL,
		google_id TEXT UNIQUE
	);
`;

const usersModel = {
	//* Create
	createUser: (name, password) => { const currentCGUVersion = "1.0"; db.prepare("INSERT INTO users (name, password, cgu_version) VALUES (?, ?, ?)").run(name, password, currentCGUVersion); return { name }; },

	//* Read
	createGoogleUser: (name, password, googleId, profilePicture) => {
		const currentCGUVersion = getCurrentCGUVersion();
		return db.prepare(`
			INSERT INTO users (name, password, google_id, profile_picture, cgu_version) 
			VALUES (?, ?, ?, ?, ?)
		`).run(name, password, googleId, profilePicture, currentCGUVersion);
	},
	getAllUsers: () => { db.prepare("SELECT * FROM users").all() },
	getUserById: (userId) => { return db.prepare("SELECT * FROM users WHERE userId = ?").get(userId) },
	getUserByName: (name) => { return db.prepare("SELECT * FROM users WHERE name = ?").get(name) },
	getUsersWithOldCGU: () => { const currentVersion = getCurrentCGUVersion(); return db.prepare("SELECT * FROM users WHERE cgu_version != ?").all(currentVersion); },
	getActiveUsers: () => { return db.prepare("SELECT * FROM users WHERE deleted_at IS NULL").all(); },
	getDeletedUsers: () => { return db.prepare("SELECT userId, name, deleted_at FROM users WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC").all(); },
	getUserByGoogleId: (googleId) => { return db.prepare("SELECT * FROM users WHERE google_id = ?").get(googleId); },

	//* Update
	updateDoubleAuth_status: (userId, doubleAuth_status) => { return db.prepare("UPDATE users SET doubleAuth_status = ? WHERE userId = ?").run(doubleAuth_status, userId) },
	updateDoubleAuth_secret: (userId, doubleAuth_secret) => { return db.prepare("UPDATE users SET doubleAuth_secret = ? WHERE userId = ?").run(doubleAuth_secret, userId) },
	updateName: (userId, newName) => { return db.prepare("UPDATE users SET name = ? WHERE userId = ?").run(newName, userId) },
	updatePassword: (userId, newPassword) => { return db.prepare("UPDATE users SET password = ? WHERE userId = ?").run(newPassword, userId) },
	updateOnlineStatus: (userId, NewOnlineStatus) => { return db.prepare("UPDATE users SET online_status = ? WHERE userId = ?").run(NewOnlineStatus, userId) },
	setInactiveUsersOffline: (inactiveSince) => { return db.prepare("UPDATE users SET online_status = 0 WHERE last_activity <= ?").run(inactiveSince); },
	updateProfilePicture: (userId, profile_picture) => { return db.prepare("UPDATE users SET profile_picture = ? WHERE userId = ?").run(profile_picture, userId) },
	updateGamesWon: (userId) => { return db.prepare("UPDATE users SET games_won = games_won + 1 WHERE userId = ?").run(userId) },
	updateGamesLost: (userId) => { return db.prepare("UPDATE users SET games_lost = games_lost + 1 WHERE userId = ?").run(userId) },
	updateUserCGUVersion: (userId, version) => { return db.prepare("UPDATE users SET cgu_version = ?, cgu_accepted = CURRENT_TIMESTAMP WHERE userId = ?").run(version, userId) },
	updateLastActivity: (userId) => { return db.prepare("UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE userId = ?").run(userId) },
	
	//* Delete
	delete: (userId) => { return db.prepare("DELETE FROM users WHERE userId = ?").run(userId) },
	deleteInactiveUsers: () => { return db.prepare("DELETE FROM users WHERE last_activity <= date('now', '-3 years')").run() },
	anonymizeUser: (userId) => {
		const anonymizedName = `del_${userId}`;
		const anonymizedPassword = 'DELETED_ACCOUNT';
		const defaultProfilePicture = 'default-profile-picture.png';
		return db.prepare(`UPDATE users SET name = ?, password = ?, profile_picture = ?, doubleAuth_status = 0, doubleAuth_secret = ?, google_id = NULL, deleted_at = CURRENT_TIMESTAMP WHERE userId = ?`).run(anonymizedName, anonymizedPassword, defaultProfilePicture, null, userId);
	},
	forceDeleteUser: (userId) => {
		const transaction = db.transaction(() => {
			db.prepare("DELETE FROM games WHERE user1_id = ? OR user2_id = ? OR user3_id = ? OR user4_id = ?").run(userId, userId, userId, userId);
			db.prepare("DELETE FROM friendships WHERE userId = ? OR friendId = ?").run(userId, userId);
			return db.prepare("DELETE FROM users WHERE userId = ?").run(userId);
		});
		return transaction();
	},
	
	
}

export default usersModel;