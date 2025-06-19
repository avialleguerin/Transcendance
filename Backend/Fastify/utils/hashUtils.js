import argon2 from "argon2";

export async function hashPassword(password) {
	try {
		const hashedPassword = await argon2.hash(password, {
			type: argon2.argon2id,
			memoryCost: 65536,
			timeCost: 3,
			parallelism: 4
		});
		return hashedPassword;
	} catch (err) {
		fastify.log.error("Error during password hashing:", err);
		throw new Error("Password hashing failed");
	}
}

export async function verifyPassword(hashedPassword, password) {
	try {
		return await argon2.verify(hashedPassword, password);
	} catch (error) {
		fastify.log.error("Error during password verification:", error);
		return false;
	}
}
