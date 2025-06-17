import Vault from 'node-vault';
import fs from 'fs';

// const vault = Vault({
// 	endopint: 'http://vault:8200',
// 	// token: 'root' // TODO Remplacer avec AppRole en production
// });

let vaultClient = null;

// const role_id = "8a5c7e1b-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
// const secret_id = "57d4c1a2-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

// export async function authenticate() {
// 	try {
// 		const response = await vault.approleLogin({
// 		role_id,
// 		secret_id,
// 		});

// 		vault.token = response.auth.client_token;
// 		fastify.log.info("Authenticated with Vault, token acquired.");
// 	} catch (error) {
// 		fastify.log.error("Vault authentication failed:", error);
// 	}
// }

async function initVault() {
    if (vaultClient) return vaultClient;

    try {
        // En production, lire le token depuis le fichier généré par le script setup
        let token = process.env.VAULT_TOKEN;
        
        // Si pas de token en variable d'env, essayer de lire depuis le fichier
        if (!token) {
            try {
                token = fs.readFileSync('/app/vault/data/root_token.txt', 'utf8').trim();
            } catch (err) {
                console.warn('Could not read vault token from file, using fallback token');
                token = 'root'; // Fallback pour le développement
            }
        }

        vaultClient = Vault({
            endpoint: process.env.VAULT_ADDR || 'http://vault:8200', // Correction: endopint -> endpoint
            token: token
        });

        // Tester la connexion
        await vaultClient.read('auth/token/lookup-self');
        console.log('✅ Vault connection established');
        
        return vaultClient;
    } catch (error) {
        console.error('❌ Failed to initialize Vault:', error.message);
        throw error;
    }
}

export async function getSQLiteCreds() {
	try {
		const vault = await initVault();
		const secret = await vault.read("secret/data/sqlite");

		console.log("✅ SQLite credentials retrieved from Vault");

		// fastify.log.info(secret)
		return {
            user: secret.data.data.username,  // Note: KV v2 a une structure data.data
            pass: secret.data.data.password
        };
	} catch (err) {
		console.log("Error retrieving Vault secret :\n", err)
		throw Error("Could not fetch credentials from Vault");
	}
}

// Fonction utilitaire pour obtenir d'autres secrets
export async function getSecret(path) {
    try {
        const vault = await initVault();
        const secret = await vault.read(`secret/data/${path}`);
        return secret.data.data;
    } catch (err) {
        console.error(`❌ Error retrieving secret ${path}:`, err);
        throw new Error(`Could not fetch secret ${path} from Vault`);
    }
}

// export async function getJwtSecret(request, reply) {
// 	try {
// 		const secret = await vault.read("secret/data/jwt")
// 		return secret.data.secret
// 	} catch (err) {
// 		fastify.log.error("Error retrieving Vault secret :\n", err)
// 		return reply.status(500).send({ error: "Error retrieving Vault secret :", err })
// 	}
// }



