import { getCurrentCGUVersion } from "../utils/cgu.js";
import {getDb} from "../utils/db.js";

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
		online_status BOOL DEFAULT false,
		last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		deleted_at DATETIME DEFAULT NULL,
		google_id TEXT UNIQUE
	);
`;

const usersModel = {
	//* Create
	createUser: async (username, password) => {
		const db = await getDb();
		const currentCGUVersion = "1.0";
		db.prepare("INSERT INTO users (username, password, cgu_version) VALUES (?, ?, ?)").run(username, password, currentCGUVersion);
		return { username };
	},

	//* Read
	createGoogleUser: async (username, password, googleId, profilePicture) => {
		const db = await getDb();
		const currentCGUVersion = getCurrentCGUVersion();
		return db.prepare(`
			INSERT INTO users (username, password, google_id, profile_picture, cgu_version)
			VALUES (?, ?, ?, ?, ?)
		`).run(username, password, googleId, profilePicture, currentCGUVersion);
	},
	getAllUsers: async () => {
		const db = await getDb();
		return db.prepare("SELECT * FROM users").all();
	},
	getUserById: async (userId) => {
		const db = await getDb();
		return db.prepare("SELECT * FROM users WHERE userId = ?").get(userId);
	},
	getUserByUsername: async (username) => {
		const db = await getDb();
		return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
	},
	getUsersWithOldCGU: async () => {
		const db = await getDb();
		const currentVersion = getCurrentCGUVersion();
		return db.prepare("SELECT * FROM users WHERE cgu_version != ?").all(currentVersion);
	},
	getActiveUsers: async () => {
		const db = await getDb();
		return db.prepare("SELECT * FROM users WHERE deleted_at IS NULL").all();
	},
	getDeletedUsers: async () => {
		const db = await getDb();
		return db.prepare("SELECT userId, username, deleted_at FROM users WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC").all();
	},
	getUserByGoogleId: async (googleId) => {
		const db = await getDb();
		return db.prepare("SELECT * FROM users WHERE google_id = ?").get(googleId);
	},

	//* Update
	updateDoubleAuth_status: async (userId, doubleAuth_status) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET doubleAuth_status = ? WHERE userId = ?").run(doubleAuth_status, userId);
	},
	updateDoubleAuth_secret: async (userId, doubleAuth_secret) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET doubleAuth_secret = ? WHERE userId = ?").run(doubleAuth_secret, userId);
	},
	updateUsername: async (userId, newUsername) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET username = ? WHERE userId = ?").run(newUsername, userId);
	},
	updatePassword: async (userId, newPassword) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET password = ? WHERE userId = ?").run(newPassword, userId);
	},
	updateOnlineStatus: async (userId, NewOnlineStatus) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET online_status = ? WHERE userId = ?").run(NewOnlineStatus, userId);
	},
	setInactiveUsersOffline: async (inactiveSince) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET online_status = 0 WHERE last_activity <= ?").run(inactiveSince);
	},
	updateProfilePicture: async (userId, profile_picture) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET profile_picture = ? WHERE userId = ?").run(profile_picture, userId);
	},
	updateGamesWon: async (userId) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET games_won = games_won + 1 WHERE userId = ?").run(userId);
	},
	updateGamesLost: async (userId) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET games_lost = games_lost + 1 WHERE userId = ?").run(userId);
	},
	updateUserCGUVersion: async (userId, version) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET cgu_version = ?, cgu_accepted = CURRENT_TIMESTAMP WHERE userId = ?").run(version, userId);
	},
	updateLastActivity: async (userId) => {
		const db = await getDb();
		return db.prepare("UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE userId = ?").run(userId);
	},

	//* Delete
	delete: async (userId) => {
		const db = await getDb();
		return db.prepare("DELETE FROM users WHERE userId = ?").run(userId);
	},
	deleteInactiveUsers: async () => {
		const db = await getDb();
		return db.prepare("DELETE FROM users WHERE last_activity <= date('now', '-3 years')").run();
	},
	anonymizeUser: async (userId) => {
		const db = await getDb();
		const anonymizedUsername = `del_${userId}`;
		const anonymizedPassword = 'DELETED_ACCOUNT';
		const defaultProfilePicture = 'default-profile-picture.png';
		return db.prepare(`UPDATE users SET username = ?, password = ?, profile_picture = ?, doubleAuth_status = 0, doubleAuth_secret = ?, google_id = NULL, deleted_at = CURRENT_TIMESTAMP WHERE userId = ?`).run(anonymizedUsername, anonymizedPassword, defaultProfilePicture, null, userId);
	},
	forceDeleteUser: async (userId) => {
		const db = await getDb();
		const transaction = db.transaction(() => {
			db.prepare("DELETE FROM games WHERE user1_id = ? OR user2_id = ? OR user3_id = ? OR user4_id = ?").run(userId, userId, userId, userId);
			db.prepare("DELETE FROM friendships WHERE userId = ? OR friendId = ?").run(userId, userId);
			return db.prepare("DELETE FROM users WHERE userId = ?").run(userId);
		});
		return transaction();
	},
}

export default usersModel;