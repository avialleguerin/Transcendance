import argon2 from "argon2";

export async function hashPassword(password) {
	try {
		const hashedPassword = await argon2.hash(password, {
			type: argon2.argon2id,	// ✅ Le plus sécurisé
			memoryCost: 65536,		// 64MB de mémoire
			timeCost: 3,		 	// 3 itérations
			parallelism: 4			// 4 threads
		});
		return hashedPassword;
	} catch (err) {
		console.error("Erreur lors du hashage du mot de passe :", err);
		throw new Error("Hashage du mot de passe échoué");
	}
}

export async function verifyPassword(hashedPassword, password) {
	try {
		return await argon2.verify(hashedPassword, password);
	} catch (error) {
		console.error("Erreur lors de la vérification du mot de passe :", error);
		return false;
	}
}
