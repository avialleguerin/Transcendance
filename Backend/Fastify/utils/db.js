import Database from "better-sqlite3-multiple-ciphers";
import { getSQLiteCreds } from './vault.js';

const dbFile = "Data/db/database.sqlite";
export let db = null;

async function setupDatabase(log) {
    try {
        const { user, pass } = await getSQLiteCreds(log);
        
        const database = new Database(dbFile, {
            verbose: null,
            fileMustExist: false
        });

        database.pragma(`cipher_compatibility = 4`);
        database.pragma(`key = '${pass}'`);
        database.pragma('cipher_integrity_check');
        
        return database;
    } catch (err) {
        log.error("Error configuring SQLite:", err);
        throw err;
    }
}

export async function initializeDb(log) {
    if (!db) {
        db = await setupDatabase(log);
        
        const { CREATE_USERS_TABLE } = await import('../models/usersModel.js');
        const { CREATE_GAMES_TABLE } = await import('../models/gamesModel.js');
        const { CREATE_FRIENDSHIPS_TABLE } = await import('../models/friendshipsModel.js');
        const { CREATE_PLATFORMERS_TABLE } = await import('../models/platformersModel.js');
        
        db.prepare(CREATE_USERS_TABLE).run();
        db.prepare(CREATE_GAMES_TABLE).run();
        db.prepare(CREATE_FRIENDSHIPS_TABLE).run();
        db.prepare(CREATE_PLATFORMERS_TABLE).run();
        
        log.success("Db created successfully");
    }
    return db;
}

// Garder getDb pour la compatibilité (mais maintenant elle retourne juste db)
export async function getDb() {
    if (!db) {
        throw new Error("Database not initialized. Call initializeDb() first.");
    }
    return db;
}
