import Vault from 'node-vault';

export const vault = Vault({ endopint: process.env.VAULT_ADDR, token: process.env.VAULT_DEV_ROOT_TOKEN_ID });

export async function getSQLiteCreds() {
	try {
		const secret = await vault.read("secret/data/sqlite").then(res => res.data)
		return { user: secret.data.username, pass: secret.data.password }
	} catch (err) { throw new Error("Could not fetch credentials from Vault"); }
}

export async function getJwtSecret(request, reply) {
	try {
		const secret = await vault.read("secret/data/jwt").then(res => res.data)
		return secret.data.secret
	} catch (err) { throw new Error("Error retrieving Vault secret: " + err.message); }
}
