import Vault from 'node-vault';

const vault = Vault({
	endopint: 'http://vault:8200',
	token: 'root' // TODO Replace with AppRole in production
});

// Export vault instance
export { vault };

export async function getSQLiteCreds() {
	try {
		const secret = await vault.read("secret/data/sqlite").then(res => res.data)

		// fastify.log.info(secret)
		return {
			user: secret.data.username,
			pass: secret.data.password
		}
	} catch (err) {
		fastify.log.error("Error retrieving Vault secret :\n", err)
		throw Error("Could not fetch credentials from Vault");
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



