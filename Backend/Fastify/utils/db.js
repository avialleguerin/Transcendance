import Database from "better-sqlite3";
import { CREATE_USERS_TABLE } from '../models/userModel.js';
import { CREATE_BLACKLIST_ACCESS_TOKENS_TABLE, CREATE_BLACKLIST_REFRESH_TOKENS_TABLE } from "../models/tokenModel.js";


const db = new Database('database.sqlite');

export function initDb() {
	db.prepare(CREATE_USERS_TABLE).run();
	db.prepare(CREATE_BLACKLIST_ACCESS_TOKENS_TABLE).run();
	db.prepare(CREATE_BLACKLIST_REFRESH_TOKENS_TABLE).run();

	console.log("✅ Base de données initialisée !");
}


export default db;