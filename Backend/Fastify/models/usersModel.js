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
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		deleted_at DATETIME DEFAULT NULL,
        google_id TEXT UNIQUE
	);
`;

const usersModel = {
	//** CRUD */
	
	//* Create
	createUser: (username, password) => { const currentCGUVersion = "1.0"; db.prepare("INSERT INTO users (username, password, cgu_version) VALUES (?, ?, ?)").run(username, password, currentCGUVersion); return { username }; },

	//* Read
	createGoogleUser: (username, password, googleId, profilePicture) => {
		const currentCGUVersion = getCurrentCGUVersion();
		return db.prepare(`
			INSERT INTO users (username, password, google_id, profile_picture, cgu_version) 
			VALUES (?, ?, ?, ?, ?)
		`).run(username, password, googleId, profilePicture, currentCGUVersion);
	},
	getAllUsers: () => { db.prepare("SELECT * FROM users").all() },
	getUserById: (userId) => { return db.prepare("SELECT * FROM users WHERE userId = ?").get(userId) },
	getUserByUsername: (username) => { return db.prepare("SELECT * FROM users WHERE username = ?").get(username) },
	getUsersWithOldCGU: () => { const currentVersion = getCurrentCGUVersion(); return db.prepare("SELECT * FROM users WHERE cgu_version != ?").all(currentVersion); },
	getActiveUsers: () => { return db.prepare("SELECT * FROM users WHERE deleted_at IS NULL").all(); },
	getDeletedUsers: () => { return db.prepare("SELECT userId, username, deleted_at FROM users WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC").all(); },
	getUserByGoogleId: (googleId) => { return db.prepare("SELECT * FROM users WHERE google_id = ?").get(googleId); },

	//* Update
	updateDoubleAuth_status: (userId, doubleAuth_status) => { return db.prepare("UPDATE users SET doubleAuth_status = ? WHERE userId = ?").run(doubleAuth_status, userId) },
	updateDoubleAuth_secret: (userId, doubleAuth_secret) => { return db.prepare("UPDATE users SET doubleAuth_secret = ? WHERE userId = ?").run(doubleAuth_secret, userId) },
	updateUsername: (userId, newUsername) => { return db.prepare("UPDATE users SET username = ? WHERE userId = ?").run(newUsername, userId) },
	updatePassword: (userId, newPassword) => { return db.prepare("UPDATE users SET password = ? WHERE userId = ?").run(newPassword, userId) },
	updateProfilePicture: (userId, profile_picture) => { return db.prepare("UPDATE users SET profile_picture = ? WHERE userId = ?").run(profile_picture, userId) },
	updateGamesWon: (userId) => { return db.prepare("UPDATE users SET games_won = games_won + 1 WHERE userId = ?").run(userId) },
	updateGamesLost: (userId) => { return db.prepare("UPDATE users SET games_lost = games_lost + 1 WHERE userId = ?").run(userId) },
	updateUserCGUVersion: (userId, version) => { return db.prepare("UPDATE users SET cgu_version = ?, cgu_accepted = CURRENT_TIMESTAMP WHERE userId = ?").run(version, userId) },
	updateLastConnection: (userId) => { return db.prepare("UPDATE users SET last_connection = CURRENT_TIMESTAMP WHERE userId = ?").run(userId) },
	
	//* Delete
	delete: (userId) => { return db.prepare("DELETE FROM users WHERE userId = ?").run(userId) },
	deleteInactiveUsers: () => { return db.prepare("DELETE FROM users WHERE last_connection <= date('now', '-3 years')").run() },
	anonymizeUser: (userId) => {
		const anonymizedUsername = `del_${userId}`;
		const anonymizedPassword = 'DELETED_ACCOUNT';
		const defaultProfilePicture = 'default-profile-picture.png';
		
		return db.prepare(`
			UPDATE users
			SET username = ?,
				password = ?,
				profile_picture = ?,
				doubleAuth_status = 0,
				doubleAuth_secret = ?,
				google_id = NULL,
				deleted_at = CURRENT_TIMESTAMP
			WHERE userId = ?
		`).run(anonymizedUsername, anonymizedPassword, defaultProfilePicture, null, userId);
	},
	forceDeleteUser: (userId) => {
		// Utiliser une transaction pour supprimer toutes les références
		const transaction = db.transaction(() => {
			// Supprimer toutes les parties où l'utilisateur est impliqué
			db.prepare("DELETE FROM games WHERE user1_id = ? OR user2_id = ? OR user3_id = ? OR user4_id = ?")
				.run(userId, userId, userId, userId);
			
			// Supprimer toutes les amitiés de l'utilisateur
			db.prepare("DELETE FROM friendships WHERE userId = ? OR friendId = ?")
				.run(userId, userId);
			
			// Supprimer l'utilisateur
			return db.prepare("DELETE FROM users WHERE userId = ?").run(userId);
		});
		
		return transaction();
	},
	
	
}

export default usersModel;