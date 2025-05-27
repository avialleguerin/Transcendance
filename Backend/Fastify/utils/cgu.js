export const CGU_CONFIG = {
	CURRENT_VERSION: "1.0",
	VERSIONS: {
		"1.0": {
			releaseDate: "2024-01-01",
			required: true
		}
		// "1.1": {
		// 	releaseDate: "2024-05-23",
		// 	required: true,
		// 	changes: "Mise à jour de la section sur la protection des données"
		// }
	}
};

export const getCurrentCGUVersion = () => {
	return CGU_CONFIG.CURRENT_VERSION;
};

export const isCGUVersionValid = (userVersion) => {
	return userVersion === CGU_CONFIG.CURRENT_VERSION;
};

export const needsCGUUpdate = (userVersion) => {
	if (!userVersion) return true;
	return userVersion !== CGU_CONFIG.CURRENT_VERSION;
};

// export const acceptCGU = () => { //FIXME - 
// 	try {
// 		const { userId } = request.user;
// 		const { version } = request.body;
		
// 		const currentVersion = getCurrentCGUVersion();
		
// 		if (version !== currentVersion) {
// 			return reply.code(400).send({ 
// 				error: "INVALID_VERSION", 
// 				message: "Version des CGU invalide" 
// 			});
// 		}
		
// 		usersModel.updateUserCGUVersion(userId, version);
		
// 		return reply.send({ success: true, message: "CGU acceptées avec succès" });
// 	} catch (error) {
// 		console.error("Erreur lors de l'acceptation des CGU:", error);
// 		return reply.code(500).send({ error: "Erreur serveur" });
// 	}
// };

// export const checkCGU = () => {
// 	try {
// 		const { userId } = request.user;
// 		const user = usersModel.getUserById(userId);
// 		const currentVersion = getCurrentCGUVersion();
		
// 		if (user.cgu_version !== currentVersion) {
// 			return reply.send({ 
// 				error: "CGU_UPDATE_REQUIRED", 
// 				currentVersion 
// 			});
// 		}
		
// 		return reply.send({ status: "up-to-date" });
// 	} catch (error) {
// 		console.error("Erreur lors de la vérification des CGU:", error);
// 		return reply.code(500).send({ error: "Erreur serveur" });
// 	}
// };