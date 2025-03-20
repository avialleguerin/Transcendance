//CRUD Model actually and MVC Structure
import db from "../utils/db.js";

export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user'
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

  updateRole: (userId, role) => { return db.prepare("UPDATE users SET role = ? WHERE userId = ?").run(role === 'user' ? 'admin' : 'user', userId) },

  unregister: (userId) => { return db.prepare("DELETE FROM users WHERE userId = ?").run(userId) }
}

export default userModel;