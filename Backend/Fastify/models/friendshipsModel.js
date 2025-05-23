import db from "../utils/db.js";

export const CREATE_FRIENDSHIPS_TABLE = `
	CREATE TABLE IF NOT EXISTS friendships (
		friendshipId INTEGER PRIMARY KEY AUTOINCREMENT,
		userId INTEGER NOT NULL,
		friendId INTEGER NOT NULL,
		status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
		FOREIGN KEY (friendId) REFERENCES users(userId) ON DELETE CASCADE,
		UNIQUE(userId, friendId),
		UNIQUE(friendId, userId)
	);
`;
const friendshipsModel = {
	getAllFriendships: () => db.prepare("SELECT f.friendshipId as friendshipId, f.userId as userId, f.friendId as friendId, f.status, f.created_at, u1.username as username, u2.username as friend_username FROM friendships f JOIN users u1 ON f.userId = u1.userId JOIN users u2 ON f.friendId = u2.userId ORDER BY f.created_at DESC").all(),
	getFriendshipById: (friendshipId) => { return db.prepare("SELECT * FROM friendships WHERE friendshipId = ?").get(friendshipId) },
	getUserFriendships: (userId) => db.prepare(`SELECT f.friendshipId, f.userId, f.friendId, f.status, f.created_at, u.username as friend_username, u.profile_picture as friendProfilePicture FROM friendships f JOIN users u ON (CASE WHEN f.userId = ? THEN f.friendId = u.userId WHEN f.friendId = ? THEN f.userId = u.userId END) WHERE f.userId = ? OR f.friendId = ? ORDER BY f.created_at`).all(userId, userId, userId, userId),
	createFriendship: (userId, friendId) => { return db.prepare("INSERT INTO friendships (userId, friendId) VALUES (?, ?)").run(userId, friendId) },
	acceptFriendship: (userId, friendId) => { return db.prepare("UPDATE friendships SET status = 'accepted' WHERE userId = ? AND friendId = ?").run(userId, friendId) },
	rejectFriendship: (userId, friendId) => { return db.prepare("UPDATE friendships SET status = 'rejected' WHERE userId = ? AND friendId = ?").run(userId, friendId) },
	getFriendshipsList: (userId) => { return db.prepare(`SELECT user.userId, user.username, user.profile_picture, friend.status FROM users user JOIN friendships friend ON user.userId = friend.friendId WHERE friend.userId = ? AND friend.status = 'accepted'`).all(userId) },
	getFriendRequests: (userId) => { return db.prepare(`SELECT user.userId, user.username, user.profile_picture FROM users user JOIN friendships friend ON user.userId = friend.userId WHERE friend.friendId = ? AND friend.status = 'pending'`).all(userId)},
	deleteFriendship: (userId, friendId) => { return db.prepare(`DELETE FROM friendships WHERE (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?)`).run(userId, friendId, friendId, userId) },
	checkFriendshipStatus: (userId, friendId) => {
		const requestSent = db.prepare(` SELECT status FROM friendships WHERE userId = ? AND friendId = ?`).get(userId, friendId);
		const requestReceived = db.prepare(`SELECT status FROM friendships WHERE userId = ? AND friendId = ?`).get(friendId, userId);
		return { requestSent, requestReceived };
	}
}

export default friendshipsModel;