//CRUD Model actually and MVC Structure

export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    admin BOOLEAN DEFAULT FALSE,
    connected BOOLEAN DEFAULT FALSE
  );
`;

export const INSERT_USER = `
  INSERT INTO users (name, email, password) VALUES (?, ?, ?);
`;

export const GET_ALL_USERS = `
  SELECT * FROM users;
`;

export const GET_USER_BY_ID = `
  SELECT * FROM users WHERE id = ?;
`;

export const GET_USER_BY_NAME = `
  SELECT * FROM users WHERE name = ? AND email = ?;
`;
export const GET_USER_BY_EMAIL = `
  SELECT * FROM users WHERE email = ? AND password = ?;
`;

export const UPDATE_CONNECTION = `
  UPDATE users SET connected = ? WHERE id = ?;
`;

export const UPDATE_ADMIN = `
  UPDATE users SET admin = ? WHERE id = ?;
`;

export const DELETE_USER = `
  DELETE FROM users WHERE id = ?;
`;