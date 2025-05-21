import Database from "better-sqlite3-multiple-ciphers";
import { getSQLiteCreds } from './vault.js';
import { CREATE_USERS_TABLE } from '../models/usersModel.js';
import { CREATE_GAMES_TABLE } from '../models/gamesModel.js';
import { CREATE_FRIENDSHIPS_TABLE } from '../models/friendshipsModel.js';

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
	db.prepare(CREATE_GAMES_TABLE).run();
	db.prepare(CREATE_FRIENDSHIPS_TABLE).run();
	console.log("\n✅ Bases de données initialisée !");
}

const db = await setupDatabase();
export default db;
