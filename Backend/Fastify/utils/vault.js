import Vault from 'node-vault';

const vault = Vault({
	endopint: 'http://vault:8200',
	token: 'root' // ⚠️ Remplacer avec AppRole en production
});

// const role_id = "8a5c7e1b-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
// const secret_id = "57d4c1a2-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

// export async function authenticate() {
// 	try {
// 		const response = await vault.approleLogin({
// 		role_id,
// 		secret_id,
// 		});

// 		vault.token = response.auth.client_token;
// 		console.log("Authenticated with Vault, token acquired.");
// 	} catch (error) {
// 		console.error("Vault authentication failed:", error);
// 	}
// }
  
export async function getSQLiteCreds() {
	try {
		const secret = await vault.read("secret/data/sqlite").then(res => res.data)

		// console.log(secret)
		return {
			user: secret.data.username,
			pass: secret.data.password
		}
	} catch (err) {
		console.error("Error retrieving Vault secret :\n", err)
		throw Error("Could not fetch credentials from Vault");
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



