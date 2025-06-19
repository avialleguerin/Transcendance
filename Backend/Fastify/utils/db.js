import Database from "better-sqlite3-multiple-ciphers";
import { getSQLiteCreds } from './vault.js';
import { CREATE_USERS_TABLE } from '../models/usersModel.js';
import { CREATE_GAMES_TABLE } from '../models/gamesModel.js';
import { CREATE_FRIENDSHIPS_TABLE } from '../models/friendshipsModel.js';
import { CREATE_PLATFORMERS_TABLE } from '../models/platformersModel.js';

const dbFile = "Data/db/database.sqlite";

// Déclarer dbInstance avant les fonctions pour éviter la Temporal Dead Zone
let dbInstance = null;

async function setupDatabase() {
    try {
        console.log("🔄 Setting up database connection...");
        const { user, pass } = await getSQLiteCreds();

        console.log("🔑 Database credentials retrieved from Vault");
        console.log(`📝 Username: ${user}`);
        console.log(`🔐 Password: [PROTECTED]`);
        
        const db = new Database(dbFile, {
            verbose: null,
            fileMustExist: false
        });

        // Configuration du chiffrement SQLite
        db.pragma(`cipher_compatibility = 4`);
        db.pragma(`key = '${pass}'`);

        // Tester la connexion
        db.pragma('cipher_integrity_check');
        
        console.log("✅ Database connection established successfully");
        return db;
    } catch (err) {
        console.error("❌ Error configuring SQLite:", err);
        throw err;
    }
}

export async function initDb() {
    try {
        const database = await setupDatabase();
        
        database.prepare(CREATE_USERS_TABLE).run();
        database.prepare(CREATE_GAMES_TABLE).run();
        database.prepare(CREATE_FRIENDSHIPS_TABLE).run();
        database.prepare(CREATE_PLATFORMERS_TABLE).run();
        
        console.log("✅ Database tables initialized successfully");
        
        return database;
    } catch (err) {
        console.error("❌ Error initializing database:", err);
        throw err;
    }
}

// Ne pas exporter de db par défaut qui s'exécute immédiatement
// export default db;

// À la place, exporter une fonction pour obtenir la DB quand nécessaire
export async function getDb() {
    if (!dbInstance) {
        dbInstance = await setupDatabase();
    }
    return dbInstance;
}
