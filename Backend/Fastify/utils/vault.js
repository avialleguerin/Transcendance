import vault from 'node-vault';
import fs from 'fs';
import https from 'https';

// Agent HTTPS qui ignore les certificats auto-signés
const httpsAgent = new https.Agent({
	rejectUnauthorized: false
});

function getVaultToken() {
	try {
		const tokenPath = '/app/vault/data/root_token';
		if (fs.existsSync(tokenPath)) {
		const token = fs.readFileSync(tokenPath, 'utf8').trim();
		if (token) return token;
		}
	} catch (err) {
		console.log("Impossible de lire le token depuis le fichier:", err.message);
	}
	
	if (process.env.VAULT_TOKEN) return process.env.VAULT_TOKEN;
	if (process.env.VAULT_DEV_ROOT_TOKEN_ID) return process.env.VAULT_DEV_ROOT_TOKEN_ID;
	
	throw new Error("Aucun token Vault trouvé");
}

const vaultClient = vault({
	apiVersion: 'v1',
	endpoint: process.env.VAULT_ADDR,
	token: getVaultToken(),
	requestOptions: {
		httpsAgent: httpsAgent,
		agent: httpsAgent,
		rejectUnauthorized: false,
		strictSSL: false,
		secureProtocol: 'TLSv1_2_method'
	}
});

export async function getSQLiteCreds() {
	try {
		let retries = 5;
		while (retries > 0) {
		try {
			const response = await vaultClient.read('secret/data/sqlite');
			return {
			user: response.data.data.username,
			pass: response.data.data.password
			};
		} catch (err) {
			if (retries === 1) throw err;
			retries--;
			await new Promise(resolve => setTimeout(resolve, 2000));
		}
		}
	} catch (err) {
		console.error("Erreur Vault:", err.message);
		throw new Error("Could not fetch credentials from Vault");
	}
}

export async function getJwtSecret(request, reply) {
	try {
		let retries = 5;
		while (retries > 0) {
		try {
			const response = await vaultClient.read('secret/data/jwt');
			return response.data.data.secret;
		} catch (err) {
			if (retries === 1) throw err;
			retries--;
			await new Promise(resolve => setTimeout(resolve, 2000));
		}
		}
	} catch (err) {
		console.error("Erreur Vault JWT:", err.message);
		throw new Error("Error retrieving Vault secret: " + err.message);
	}
}