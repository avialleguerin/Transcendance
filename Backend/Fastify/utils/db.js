import Database from "better-sqlite3";
import { CREATE_USERS_TABLE } from '../models/userModel.js';

const db = new Database('database.sqlite');

export function initDb() {
	db.prepare(CREATE_USERS_TABLE).run();
	console.log("✅ Base de données initialisée !\n\n\n");
}


export default db;