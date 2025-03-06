let nb_powerUP_player_1 = 0;
let nb_powerUP_player_2 = 0;

export function init_nb_powerUP_grenadeFlash(number) {
    // Assigner la valeur de la grenade pour chaque joueur
    nb_powerUP_player_1 = number;
    nb_powerUP_player_2 = number;

    console.log("Nombre de grenades flash:", nb_powerUP_player_1);

}

export function reset_powerUP_grenade()
{
	nb_powerUP_player_1 = 0;
	nb_powerUP_player_2 = 0;
}

function create_overlay() {
	const overlay = document.createElement("div");
	overlay.id = "grenade_flash";
	overlay.innerHTML = `
		<link rel="stylesheet" href="./static/js/css/grenade_flash.css">
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
		}, 1000);
	}
}

let canUseFlashGrenade_1 = true;
let canUseFlashGrenade_2 = true;

export function grenade_flash_player1()
{
	if (nb_powerUP_player_1 > 0 && canUseFlashGrenade_1) {
		canUseFlashGrenade_1 = false;
		
		create_overlay();
		nb_powerUP_player_1--;
		
		setTimeout(() => {
			remove_overlay();
		}, 1000);
		
		setTimeout(() => {
			canUseFlashGrenade_1 = true;
			console.log("Grenade flash rechargée !");
		}, 5000);
	}
}

export function grenade_flash_player2()
{
	if (nb_powerUP_player_2 > 0 && canUseFlashGrenade_2) {
		canUseFlashGrenade_2 = false;
		
		create_overlay();
		nb_powerUP_player_2--;
		
		setTimeout(() => {
			remove_overlay();
		}, 1000);
		
		setTimeout(() => {
			canUseFlashGrenade_2 = true;
			console.log("Grenade flash rechargée !");
		}, 5000);
	}
}