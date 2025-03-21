import Database from "better-sqlite3-multiple-ciphers";
import { getSQLiteCreds } from './vault.js';
import { CREATE_USERS_TABLE } from '../models/userModel.js';
import { CREATE_BLACKLIST_ACCESS_TOKENS_TABLE, CREATE_BLACKLIST_REFRESH_TOKENS_TABLE } from "../models/tokenModel.js";

const dbFile = "Data/db/database.sqlite";
// const passphrase = "votre-mot-de-passe-securise"; // Remplacez ceci par un mot de passe sécurisé
// const dbFile = path.resolve()

async function setupDatabase() {
	try {
		const { user, pass } = await getSQLiteCreds()
		
		const db = new Database(dbFile, {
			verbose: null,
			fileMustExist: false
		})

		// db.pragma(`key = 'test'`)
		// db.pragma(`user_key = '${user}'`)
		db.pragma(`key = '${pass}'`)
		console.log(`Connected to SQLite as ${user}`)
	
		return db
	} catch (err) {
		console.error("Error config of SQLite:", err)
		throw err
	}
}

const db = await setupDatabase();

export function initDb() {
	db.prepare(CREATE_USERS_TABLE).run();
	console.log("\n✅ Base de données initialisée !");
}

export default db;
