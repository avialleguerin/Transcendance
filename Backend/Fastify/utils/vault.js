import Vault from 'node-vault';
import fs from 'fs';

let vaultClient = null;

// Fonction pour attendre avec un délai
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction pour attendre que Vault soit disponible et unsealed
async function waitForVault(log, maxRetries = 30, delayMs = 2000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch('http://vault:8200/v1/sys/health');
            const health = await response.json();
            
            if (!health.sealed) {
                if (log) {
                    log.success(`Vault is ready and unsealed (attempt ${i + 1}/${maxRetries})`);
                } else {
                    console.log(`Vault is ready and unsealed (attempt ${i + 1}/${maxRetries})`);
                }
                return true;
            } else {
                if (log) {
                    log.warn(`Vault is sealed, waiting... (attempt ${i + 1}/${maxRetries})`);
                } else {
                    console.log(`Vault is sealed, waiting... (attempt ${i + 1}/${maxRetries})`);
                }
            }
        } catch (error) {
            if (log) {
                log.warn(`Vault not available yet, retrying... (attempt ${i + 1}/${maxRetries})`);
            } else {
                console.log(`Vault not available yet, retrying... (attempt ${i + 1}/${maxRetries})`);
            }
        }
        
        if (i < maxRetries - 1) {
            await sleep(delayMs);
        }
    }
    
    throw new Error('Vault not available or still sealed after maximum retries');
}

async function initVault(log) {
    if (vaultClient) return vaultClient;

    // Attendre que Vault soit prêt
    await waitForVault(log);

    try {
        // En production, lire le token depuis le fichier généré par le script setup
        let token = process.env.VAULT_TOKEN;
        
        // Si pas de token en variable d'env, essayer de lire depuis le fichier
        if (!token) {
            try {
                token = fs.readFileSync('/app/vault/data/root_token.txt', 'utf8').trim();
            } catch (err) {
                if (log) {
                    log.warn('Could not read vault token from file, using fallback token');
                } else {
                    console.warn('Could not read vault token from file, using fallback token');
                }
                token = 'root'; // Fallback pour le développement
            }
        }

        vaultClient = Vault({
            endpoint: process.env.VAULT_ADDR || 'http://vault:8200',
            token: token
        });

        // Tester la connexion avec retry
        let lastError;
        for (let i = 0; i < 5; i++) {
            try {
                await vaultClient.read('auth/token/lookup-self');
                if (log) {
                    log.success('Vault connection established');
                } else {
                    console.log('Vault connection established');
                }
                return vaultClient;
            } catch (error) {
                lastError = error;
                if (log) {
                    log.warn(`Vault connection attempt ${i + 1}/5 failed: ${error.message}`);
                } else {
                    console.warn(`Vault connection attempt ${i + 1}/5 failed: ${error.message}`);
                }
                if (i < 4) await sleep(1000);
            }
        }
        
        throw lastError;
    } catch (error) {
        if (log) {
            log.error('Failed to initialize Vault:', error.message);
        } else {
            console.error('Failed to initialize Vault:', error.message);
        }
        throw error;
    }
}

export async function getSQLiteCreds(log) {
	try {
		const vault = await initVault(log);
		const secret = await vault.read("secret/data/sqlite");

		if (log) {
			log.success("SQLite credentials retrieved from Vault");
		} else {
			console.log("SQLite credentials retrieved from Vault");
		}

		return {
            user: secret.data.data.username,  // Note: KV v2 a une structure data.data
            pass: secret.data.data.password
        };
	} catch (err) {
		if (log) {
			log.error("Error retrieving SQLite credentials:", err.message);
		} else {
			console.error("Error retrieving SQLite credentials:", err.message);
		}
		throw err;
	}
}

// Fonction utilitaire pour obtenir d'autres secrets
export async function getSecret(path, log) {
    try {
        const vault = await initVault(log);
        const secret = await vault.read(`secret/data/${path}`);
        return secret.data.data;
    } catch (err) {
        if (log) {
            log.error(`Error retrieving secret ${path}:`, err);
        } else {
            console.error(`Error retrieving secret ${path}:`, err);
        }
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



