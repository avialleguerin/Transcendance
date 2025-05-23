//FIXME - CGU routes
// import db from "../utils/db.js";
// import { getCurrentCGUVersion } from "../config/cguConfig.js";

// export const CREATE_CGU_TABLE = `
// 	CREATE TABLE IF NOT EXISTS cgu_versions (
// 		id INTEGER PRIMARY KEY AUTOINCREMENT,
// 		version TEXT UNIQUE NOT NULL,
// 		content TEXT NOT NULL,
// 		release_date DATETIME DEFAULT CURRENT_TIMESTAMP,
// 		is_current BOOLEAN DEFAULT 0
// 	);
// `;

// const cguModel = {
// 	getCurrentVersion: () => {
// 		return db.prepare("SELECT * FROM cgu_versions WHERE is_current = 1").get();
// 	},
	
// 	getVersionByNumber: (version) => {
// 		return db.prepare("SELECT * FROM cgu_versions WHERE version = ?").get(version);
// 	},
	
// 	addNewVersion: (version, content) => {
// 		// D'abord, mettre à jour l'ancienne version comme non courante
// 		db.prepare("UPDATE cgu_versions SET is_current = 0").run();
		
// 		// Ensuite, insérer la nouvelle version
// 		return db.prepare("INSERT INTO cgu_versions (version, content, is_current) VALUES (?, ?, 1)").run(version, content);
// 	},
	
// 	getAllVersions: () => {
// 		return db.prepare("SELECT * FROM cgu_versions ORDER BY release_date DESC").all();
// 	}
// };

// // Initialiser avec la version actuelle si la table est vide
// export const initCGUVersions = () => {
// 	const versions = cguModel.getAllVersions();
// 	if (versions.length === 0) {
// 		const currentVersion = getCurrentCGUVersion();
// 		cguModel.addNewVersion(currentVersion, "Conditions Générales d'Utilisation initiales");
// 	}
// };

// export default cguModel; 