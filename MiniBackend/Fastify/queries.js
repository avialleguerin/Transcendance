// queries.js
export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    connected BOOLEAN DEFAULT FALSE
  );
`;

export const INSERT_USER = `
  INSERT INTO users (name, email) VALUES (?, ?);
`;

export const GET_ALL_USERS = `
  SELECT * FROM users;
`;

export const GET_USER_BY_ID = `
  SELECT * FROM users WHERE id = ?;
`;

export const GET_USER_BY_NAME = `
  SELECT * FROM users WHERE name = ? and email = ?;
`;

export const UPDATE_CONNECTION = `
  UPDATE users SET connected = ? WHERE id = ?;
`;

export const DELETE_USER = `
  DELETE FROM users WHERE id = ?;
`;