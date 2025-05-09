import Database from "better-sqlite3-multiple-ciphers";
import { getSQLiteCreds } from './vault.js';
import { CREATE_USERS_TABLE } from '../models/userModel.js';

const dbFile = "Data/db/database.sqlite";

async function setupDatabase() {
	try {
		const { user, pass } = await getSQLiteCreds()
		const db = new Database(dbFile, {
			verbose: null,
			fileMustExist: false
		})

		db.pragma(`user_key = '${user}'`)
		db.pragma(`key = '${pass}'`)
		return db
	} catch (err) {
		console.error("Error config of SQLite:", err)
		throw err
	}
}

export function initDb() {
	db.prepare(CREATE_USERS_TABLE).run();
	console.log("\n✅ Base de données initialisée !");
}

const db = await setupDatabase();
export default db;
