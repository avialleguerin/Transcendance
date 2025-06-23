import fs from 'fs';
import https from 'https';

// console.log("Configuration Vault:");
// console.log("VAULT_ADDR:", process.env.VAULT_ADDR);

// Fonction pour obtenir le token Vault
function getVaultToken() {
	// D'abord essayer le fichier persistant (priorité pour mode production)
	try {
		const tokenPath = '/app/vault/data/root_token';
		if (fs.existsSync(tokenPath)) {
			const token = fs.readFileSync(tokenPath, 'utf8').trim();
			if (token) return token;
		}
	} catch (err) {
		console.log("Impossible de lire le token depuis le fichier:", err.message);
	}
	
	// Ensuite essayer la variable d'environnement VAULT_TOKEN
	if (process.env.VAULT_TOKEN) {
		return process.env.VAULT_TOKEN;
	}
	
	// En dernier recours, essayer le mode dev token
	if (process.env.VAULT_DEV_ROOT_TOKEN_ID) {
		return process.env.VAULT_DEV_ROOT_TOKEN_ID;
	}
	
	throw new Error("Aucun token Vault trouvé");
}

const vaultToken = getVaultToken();
// console.log("Token Vault:", vaultToken ? "***défini***" : "NON DÉFINI");

// Agent HTTPS qui ignore les certificats auto-signés
const httpsAgent = new https.Agent({
	rejectUnauthorized: false
});

// Fonction utilitaire pour faire des requêtes HTTP à Vault
async function makeVaultRequest(path, method = 'GET', data = null) {
	return new Promise((resolve, reject) => {
		const url = new URL(path, process.env.VAULT_ADDR);
		
		const options = {
			hostname: url.hostname,
			port: url.port,
			path: url.pathname,
			method: method,
			headers: {
				'X-Vault-Token': vaultToken,
				'Content-Type': 'application/json'
			},
			agent: httpsAgent
		};

		const req = https.request(options, (res) => {
			let responseData = '';
			
			res.on('data', (chunk) => {
				responseData += chunk;
			});
			
			res.on('end', () => {
				try {
					const parsedData = JSON.parse(responseData);
					if (res.statusCode >= 200 && res.statusCode < 300) {
						resolve(parsedData);
					} else {
						reject(new Error(`HTTP ${res.statusCode}: ${parsedData.errors?.join(', ') || responseData}`));
					}
				} catch (err) {
					reject(new Error(`Erreur de parsing JSON: ${err.message}`));
				}
			});
		});

		req.on('error', (err) => {
			reject(err);
		});

		if (data) {
			req.write(JSON.stringify(data));
		}
		
		req.end();
	});
}

export async function getSQLiteCreds() {
	try {
		// console.log("🔍 Tentative de récupération des credentials SQLite...");
		// console.log("🔑 Token disponible:", vaultToken ? "Oui" : "Non");
		
		// Retry logic pour attendre que Vault soit prêt
		let retries = 5;
		while (retries > 0) {
			try {
				// console.log(`🔄 Tentative ${6 - retries}/5 de connexion à Vault...`);
				const response = await makeVaultRequest('/v1/secret/data/sqlite');
				// console.log("\x1b[32m%s\x1b[0m", "SQLite credentials retrieved successfully");
				return { 
					user: response.data.data.username, 
					pass: response.data.data.password 
				};
			} catch (err) {
				// console.log(`❌ Erreur lors de la tentative ${6 - retries}:`, err.message);
				if (retries === 1) throw err;
				retries--;
				await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes
			}
		}
	} catch (err) { 
		console.error("Erreur Vault:", err.message);
		throw new Error("Could not fetch credentials from Vault"); 
	}
}

export async function getJwtSecret(request, reply) {
	try {
		// Retry logic pour attendre que Vault soit prêt
		let retries = 5;
		while (retries > 0) {
			try {
				const response = await makeVaultRequest('/v1/secret/data/jwt');
				return response.data.data.secret;
			} catch (err) {
				// console.log(`Tentative de connexion à Vault pour JWT... ${6 - retries}/5`);
				if (retries === 1) throw err;
				retries--;
				await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes
			}
		}
	} catch (err) { 
		console.error("Erreur Vault JWT:", err.message);
		throw new Error("Error retrieving Vault secret: " + err.message); 
	}
}
