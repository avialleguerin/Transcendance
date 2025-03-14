import Database from "better-sqlite3";
import { getSQLiteCreds } from './vault.js';
import { CREATE_USERS_TABLE } from '../models/userModel.js';
import { CREATE_BLACKLIST_ACCESS_TOKENS_TABLE, CREATE_BLACKLIST_REFRESH_TOKENS_TABLE } from "../models/tokenModel.js";

async function setupDatabase() {
	const { user, pass } = await getSQLiteCreds();

	// const db = new Database('database.sqlite', { verbose: console.log });
	const db = new Database('database.sqlite');

	console.log(`Connected to SQLite as ${user}`);
	return db;
}

export function initDb() {
	db.prepare(CREATE_USERS_TABLE).run();
	db.prepare(CREATE_BLACKLIST_ACCESS_TOKENS_TABLE).run();
	db.prepare(CREATE_BLACKLIST_REFRESH_TOKENS_TABLE).run();

	console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n✅ Base de données initialisée !");
}

const db = await setupDatabase();
export default db;
