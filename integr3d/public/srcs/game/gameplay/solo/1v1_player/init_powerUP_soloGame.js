let nb_powerUP = 0;

export function init_nb_powerUP(number)
{
	nb_powerUP = number;
	console.log("Nombre de grenades flash:", nb_powerUP);
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

let canUseFlashGrenade = true;

export function grenade_flash()
{
	if (nb_powerUP > 0 && canUseFlashGrenade) {
		canUseFlashGrenade = false;
		
		create_overlay();
		nb_powerUP--;
		
		setTimeout(() => {
			remove_overlay();
		}, 1000);
		
		setTimeout(() => {
			canUseFlashGrenade = true;
			console.log("Grenade flash rechargée !");
		}, 5000);
	}
}