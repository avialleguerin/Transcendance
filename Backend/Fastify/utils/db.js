import Database from "better-sqlite3";
import { getSQLiteCreds } from './vault.js';
import { CREATE_USERS_TABLE } from '../models/userModel.js';
import { CREATE_BLACKLIST_ACCESS_TOKENS_TABLE, CREATE_BLACKLIST_REFRESH_TOKENS_TABLE } from "../models/tokenModel.js";

async function setupDatabase() {
	try {
		const { user, pass } = await getSQLiteCreds()
		
		const db = new Database('database.sqlite', { verbose: console.log })
		// const db = new Database('database.sqlite');

		db.pragma(`user_key = '${user}'`)
	
		console.log(`Connected to SQLite as ${user}`)
		return db
	} catch (err) {
		console.error("Error connecting to SQLite:", err)
		throw new Error("Error connecting to SQLite: " + err)
	}
}

export function initDb() {
	db.prepare(CREATE_USERS_TABLE).run();
	db.prepare(CREATE_BLACKLIST_ACCESS_TOKENS_TABLE).run();
	db.prepare(CREATE_BLACKLIST_ACCESS_TOKENS_TABLE).run();
	db.prepare(CREATE_BLACKLIST_REFRESH_TOKENS_TABLE).run();

	console.log("\n✅ Base de données initialisée !");
}

const db = await setupDatabase();
export default db;
