let nb_powerUP_player_1 = 0;
let nb_powerUP_player_2 = 0;

// Sécurité globale pour éviter les conflits
let flashGrenadeActive = false;
let overlayRemovalTimeout = null;

export function init_nb_powerUP_grenadeFlash(number) {
	nb_powerUP_player_1 = number;
	nb_powerUP_player_2 = number;
}

export function reset_powerUP_grenade() {
	nb_powerUP_player_1 = 0;
	nb_powerUP_player_2 = 0;
	
	// Reset de la sécurité
	flashGrenadeActive = false;
	if (overlayRemovalTimeout) {
		clearTimeout(overlayRemovalTimeout);
		overlayRemovalTimeout = null;
	}
	
	// Nettoyer tout overlay existant
	force_remove_overlay();
}

function create_overlay() {
	// Vérifier si un overlay existe déjà
	const existingOverlay = document.getElementById("grenade_flash");
	if (existingOverlay) {
		console.log("Overlay déjà présent, extension de la durée");
		return; // Ne pas créer un nouvel overlay
	}

	const overlay = document.createElement("div");
	overlay.id = "grenade_flash";
	overlay.innerHTML = `
		<link rel="stylesheet" href="./static/js/css/grenade-flash.css">
		<div class="grenade-flash">
			<div class="flash"></div>
		</div>
	`;
	document.body.appendChild(overlay);
}

function remove_overlay() {
	const overlay = document.getElementById("grenade_flash");
	if (overlay) {
		overlay.style.opacity = '0';
		setTimeout(() => {
			if (overlay && overlay.parentNode) {
				document.body.removeChild(overlay);
			}
			flashGrenadeActive = false;
		}, 1000);
	} else {
		flashGrenadeActive = false;
	}
}

function force_remove_overlay() {
	const overlay = document.getElementById("grenade_flash");
	if (overlay && overlay.parentNode) {
		document.body.removeChild(overlay);
	}
	flashGrenadeActive = false;
}

let canUseFlashGrenade_1 = true;
let canUseFlashGrenade_2 = true;

export function grenade_flash_player1() {
	if (nb_powerUP_player_1 > 0 && canUseFlashGrenade_1) {
		canUseFlashGrenade_1 = false;
		
		// Si déjà actif, étendre la durée au lieu de créer un nouvel overlay
		if (flashGrenadeActive) {
			console.log("Flash grenade déjà active, extension de la durée");
			
			// Annuler le timeout précédent
			if (overlayRemovalTimeout) {
				clearTimeout(overlayRemovalTimeout);
			}
			
			// Programmer un nouveau timeout
			overlayRemovalTimeout = setTimeout(() => {
				remove_overlay();
				overlayRemovalTimeout = null;
			}, 1000);
			
		} else {
			// Première activation
			flashGrenadeActive = true;
			create_overlay();
			
			overlayRemovalTimeout = setTimeout(() => {
				remove_overlay();
				overlayRemovalTimeout = null;
			}, 1000);
		}
		
		nb_powerUP_player_1--;
		
		// Cooldown du joueur 1
		setTimeout(() => {
			canUseFlashGrenade_1 = true;
		}, 15000);
	}
}

export function grenade_flash_player2() {
	if (nb_powerUP_player_2 > 0 && canUseFlashGrenade_2) {
		canUseFlashGrenade_2 = false;
		
		// Si déjà actif, étendre la durée au lieu de créer un nouvel overlay
		if (flashGrenadeActive) {
			console.log("Flash grenade déjà active, extension de la durée");
			
			// Annuler le timeout précédent
			if (overlayRemovalTimeout) {
				clearTimeout(overlayRemovalTimeout);
			}
			
			// Programmer un nouveau timeout
			overlayRemovalTimeout = setTimeout(() => {
				remove_overlay();
				overlayRemovalTimeout = null;
			}, 1000);
			
		} else {
			// Première activation
			flashGrenadeActive = true;
			create_overlay();
			
			overlayRemovalTimeout = setTimeout(() => {
				remove_overlay();
				overlayRemovalTimeout = null;
			}, 1000);
		}
		
		nb_powerUP_player_2--;
		
		// Cooldown du joueur 2
		setTimeout(() => {
			canUseFlashGrenade_2 = true;
		}, 15000);
	}
}

// Fonction utilitaire pour debug
export function getFlashGrenadeStatus() {
	return {
		player1_grenades: nb_powerUP_player_1,
		player2_grenades: nb_powerUP_player_2,
		player1_canUse: canUseFlashGrenade_1,
		player2_canUse: canUseFlashGrenade_2,
		flashActive: flashGrenadeActive
	};
}