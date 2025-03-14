import Vault from 'node-vault';

const vault = Vault({
	endopint: 'http://vault:8200',
	token: 'root' // ⚠ Remplacer avec AppRole en production
});

export async function getSQLiteCreds() {
	try {
		const secret = await vault.read("secret/data/sqlite")
		return {
			user: secret.data.username,
			pass: secret.data.password
		}
	} catch (err) {
		console.error("Error retrieving Vault secret :\n", err)
		throw new Error("Could not fetch credentials from Vault");
	}
}


// export async function getJwtSecret(request, reply) {
// 	try {
// 		const secret = await vault.read("secret/data/jwt")
// 		return secret.data.secret
// 	} catch (err) {
// 		console.error("Error retrieving Vault secret :\n", err)
// 		return reply.status(500).send({ error: "Error retrieving Vault secret :", err })
// 	}
// }


