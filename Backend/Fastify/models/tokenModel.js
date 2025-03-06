//JWT

export const CREATE_BLACKLIST_ACCESS_TOKENS_TABLE = `
  CREATE TABLE IF NOT EXISTS blacklist_access_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export const CREATE_BLACKLIST_REFRESH_TOKENS_TABLE = `
  CREATE TABLE IF NOT EXISTS blacklist_refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export function blacklistAccessToken(token) {
    const stmt = db.prepare("INSERT INTO blacklist_access_tokens (token) VALUES (?)");
    stmt.run(token);
}

export function blacklistRefreshToken(token) {
    const stmt = db.prepare("INSERT INTO blacklist_refresh_tokens (token) VALUES (?)");
    stmt.run(token);
}

export function isAccessTokenBlacklisted(token) {
    const stmt = db.prepare("SELECT * FROM blacklist_access_tokens WHERE token = ?");
    return stmt.get(token) !== undefined;
}

export function isRefreshTokenBlacklisted(token) {
    const stmt = db.prepare("SELECT * FROM blacklist_refresh_tokens WHERE token = ?");
    return stmt.get(token) !== undefined;
}