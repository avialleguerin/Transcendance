//CRUD Model actually and MVC Structure
import db from "../utils/db.js";

export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
    connected BOOLEAN DEFAULT FALSE
  );
`;

export const INSERT_USER = `
  INSERT INTO users (username, email, password) VALUES (?, ?, ?);
`;

const userModel = {
  createUser: (username, email, password) => {
    db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?);").run(username, email, password);
    return { username, email };
  },

  getAllUsers: () => db.prepare("SELECT * FROM users").all(),

  getUserById: (id) => { return db.prepare("SELECT * FROM users WHERE id = ?").get(id) },

  getUserByEmail: (email) => { return db.prepare("SELECT * FROM users WHERE email = ?").get(email) },

  updateUserConnectionStatus: (id, connected) => { return db.prepare("UPDATE users SET connected = ? WHERE id = ?").run(connected, id) },

  updateRole: (id, role) => { return db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role === 'user' ? 'admin' : 'user', id) },

  unregister: (id) => { return db.prepare("DELETE FROM users WHERE id = ?").run(id) }
}

export const GET_ALL_USERS = `
  SELECT * FROM users;
`;

export const GET_USER_BY_ID = `
SELECT * FROM users WHERE id = ?;
`;

export const GET_USER_BY_USERNAME = `
SELECT * FROM users WHERE username = ? AND email = ?;
`;
export const GET_USER_BY_EMAIL = `
SELECT * FROM users WHERE email = ?;
`;

export const UPDATE_CONNECTION = `
  UPDATE users SET connected = ? WHERE id = ?;
`;

export const UPDATE_ROLE = `
UPDATE users SET role = ? WHERE id = ?;
`;

export const DELETE_USER = `
  DELETE FROM users WHERE id = ?;
`;

export default userModel;