//CRUD Model actually and MVC Structure
import db from "../utils/db.js";

export const CREATE_USERS_TABLE = `
	CREATE TABLE IF NOT EXISTS users (
		userId INTEGER PRIMARY KEY AUTOINCREMENT,
		profile_picture TEXT DEFAULT 'default-profile-picture.png',
		username TEXT UNIQUE NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		doubleAuth_status INTEGER DEFAULT 0 CHECK(doubleAuth_status IN (0, 1)),
		doubleAuth_secret TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
`;

const usersModel = {
	createUser: (username, email, password) => {
		db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)").run(username, email, password);
		return { username, email };
	},
	getAllUsers: () => db.prepare("SELECT * FROM users").all(),
	getUserById: (userId) => { return db.prepare("SELECT * FROM users WHERE userId = ?").get(userId) },
	getUserByUsername: (username) => { return db.prepare("SELECT * FROM users WHERE username = ?").get(username) },
	getUserByEmail: (email) => { return db.prepare("SELECT * FROM users WHERE email = ?").get(email) },
	updateDoubleAuth_status: (userId, doubleAuth_status) => { return db.prepare("UPDATE users SET doubleAuth_status = ? WHERE userId = ?").run(doubleAuth_status, userId) },
	updateDoubleAuth_secret: (userId, doubleAuth_secret) => { return db.prepare("UPDATE users SET doubleAuth_secret = ? WHERE userId = ?").run(doubleAuth_secret, userId) },
	updateUsername: (userId, newUsername) => { return db.prepare("UPDATE users SET username = ? WHERE userId = ?").run(newUsername, userId) },
	updateEmail: (userId, newEmail) => { return db.prepare("UPDATE users SET email = ? WHERE userId = ?").run(newEmail, userId) },
	updatePassword: (userId, newPassword) => { return db.prepare("UPDATE users SET password = ? WHERE userId = ?").run(newPassword, userId) },
	updateProfilePicture: (userId, profile_picture) => { return db.prepare("UPDATE users SET profile_picture = ? WHERE userId = ?").run(profile_picture, userId) },
	delete: (userId) => { return db.prepare("DELETE FROM users WHERE userId = ?").run(userId) }
}

export default usersModel;