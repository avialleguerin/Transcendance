export const CGU_CONFIG = {
	CURRENT_VERSION: "1.0",
	VERSIONS: {
		"1.0": {
			releaseDate: "2024-01-01",
			required: true
		}
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