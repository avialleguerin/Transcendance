//CRUD Model actually and MVC Structure
import db from "../utils/db.js";

export const CREATE_USERS_TABLE = `
	CREATE TABLE IF NOT EXISTS users (
		userId INTEGER PRIMARY KEY AUTOINCREMENT,
		profile_picture TEXT DEFAULT 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Image-Transparent-Background.png',
		username TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
		doubleAuth_enabled INTEGER DEFAULT 0 CHECK(doubleAuth_enabled IN (0, 1)),
		doubleAuth_secret TEXT,
		connection_status TEXT CHECK(connection_status IN ('disconnected', 'partially_connected', 'connected')) DEFAULT 'disconnected',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);
`;

const userModel = {
	createUser: (username, email, password) => {
		db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)").run(username, email, password);
		return { username, email };
	},
	getAllUsers: () => db.prepare("SELECT * FROM users").all(),
	getUserById: (userId) => { return db.prepare("SELECT * FROM users WHERE userId = ?").get(userId) },
	getUserByEmail: (email) => { return db.prepare("SELECT * FROM users WHERE email = ?").get(email) },
	updateDoubleAuth: (userId, doubleAuth_enabled) => { return db.prepare("UPDATE users SET doubleAuth_enabled = ? WHERE userId = ?").run(doubleAuth_enabled, userId) },
	updateDoubleAuth_secret: (userId, doubleAuth_secret) => { return db.prepare("UPDATE users SET doubleAuth_secret = ? WHERE userId = ?").run(doubleAuth_secret, userId) },
	updateRole: (userId, role) => { return db.prepare("UPDATE users SET role = ? WHERE userId = ?").run(role === 'user' ? 'admin' : 'user', userId) },
	updateProfilePicture: (userId, profile_picture) => { return db.prepare("UPDATE users SET profile_picture = ? WHERE userId = ?").run(profile_picture, userId) },
	updateConnection: (userId, connection_status) => { return db.prepare("UPDATE users SET connection_status = ? WHERE userId = ?").run(connection_status, userId) },
	unregister: (userId) => { return db.prepare("DELETE FROM users WHERE userId = ?").run(userId) }
}

export default userModel;