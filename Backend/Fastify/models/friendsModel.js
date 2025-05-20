export const CREATE_FRIENDS_TABLE = `
  CREATE TABLE IF NOT EXISTS friendships (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	friend_id INTEGER NOT NULL,
	status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(userId) ON DELETE CASCADE,
	FOREIGN KEY (friend_id) REFERENCES users(userId) ON DELETE CASCADE,
	UNIQUE(user_id, friend_id)
  );
`;
const friendsModel = {
	addFriend: (userId, friendId) => { return db.prepare("INSERT INTO friends (user_id, friend_id) VALUES (?, ?)").run(userId, friendId) },
	acceptFriendRequest: (userId, friendId) => { return db.prepare("UPDATE friends SET status = 'accepted' WHERE user_id = ? AND friend_id = ?").run(friendId, userId) },
	rejectFriendRequest: (userId, friendId) => { return db.prepare("UPDATE friends SET status = 'rejected' WHERE user_id = ? AND friend_id = ?").run(friendId, userId) },
	getFriendsList: (userId) => { return db.prepare(`SELECT user.userId, user.username, user.profile_picture, friend.status FROM users user JOIN friends friend ON user.userId = friend.friend_id WHERE friend.user_id = ? AND friend.status = 'accepted'`).all(userId) },
	getFriendRequests: (userId) => { return db.prepare(`SELECT user.userId, user.username, user.profile_picture FROM users user JOIN friends friend ON user.userId = friend.user_id WHERE friend.friend_id = ? AND friend.status = 'pending'`).all(userId)},
	removeFriend: (userId, friendId) => { return db.prepare(`DELETE FROM friends WHERE (user_id = ? AND friend_id = ?)  OR (user_id = ? AND friend_id = ?)`).run(userId, friendId, friendId, userId) },
	checkfFriendStatus: (userId, friendId) => {
		const requestSent = db.prepare(` SELECT status FROM friends WHERE user_id = ? AND friend_id = ?`).get(userId, friendId);
		const requestReceived = db.prepare(`SELECT status FROM friends WHERE user_id = ? AND friend_id = ?`).get(friendId, userId);
		return { requestSent, requestReceived };
	}
}

export default friendsModel;