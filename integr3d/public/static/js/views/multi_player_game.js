import AbstractView from "./AbstractView.js";
import { getPowerUP_value_multi } from "./Game_menu.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("multi_player_game");

		this.cooldowns = {};

		this.cooldownTimes = {
			"z": 15000,
			"x": 15000,
			"1": 15000,
			"2": 15000,
		};

		document.addEventListener("keydown", this.handleKeyPress.bind(this));
	}

	async getHtml() {
		return `
			<link rel="stylesheet" href="./static/js/css/multi_player_game.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="container-Player1">
					<h1>Player 1 - Player 2</h1>
					<div class="container-item_player1">
						<p id="nb-item-grenade-1"></p>
						<div class="item-circle" id="item-circle-grenade1">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-1"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-1"></div>
						</div>
						<p id="nb-item-teammate-1"></p>
						<div class="item-circle" id="item-circle-teammate1">
							<img src="../../../srcs/game/assets/image/freeze.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-1"></div>
							<div class="overlay-reloading-freeze" id="overlay-reloading-freeze-1"></div>
						</div>
					</div>
				</div>
				<div class="container-Player2">
					<h1>Player 3 - Player 4</h1>
					<div class="container-item_player2">
						<p id="nb-item-grenade-2"></p>
						<div class="item-circle" id="item-circle-grenade2">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-2"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-2"></div>
						</div>
						<p id="nb-item-teammate-2"></p>
						<div class="item-circle" id="item-circle-teammate2">
							<img src="../../../srcs/game/assets/image/freeze.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-2"></div>
							<div class="overlay-reloading-freeze" id="overlay-reloading-freeze-2"></div>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	init_powerUP_player_multi() {
		// console.log("powerUP value == ", getPowerUP_value());
		document.getElementById("nb-item-grenade-1").innerHTML = getPowerUP_value_multi();
		document.getElementById("nb-item-teammate-1").innerHTML = getPowerUP_value_multi();
		document.getElementById("nb-item-grenade-2").innerHTML = getPowerUP_value_multi();
		document.getElementById("nb-item-teammate-2").innerHTML = getPowerUP_value_multi();
	}

	updateOverlays() {
		const nb_powerUP_grenade_player1 = parseInt(document.getElementById("nb-item-grenade-1").innerHTML, 10);
		const nb_powerUP_grenade_player2 = parseInt(document.getElementById("nb-item-grenade-2").innerHTML, 10);
		const nb_powerUP_teammate_player1 = parseInt(document.getElementById("nb-item-teammate-1").innerHTML, 10);
		const nb_powerUP_teammate_player2 = parseInt(document.getElementById("nb-item-teammate-2").innerHTML, 10);
	
		document.getElementById("overlay-grenade-1").classList.toggle("active", nb_powerUP_grenade_player1 === 0);
		document.getElementById("overlay-grenade-2").classList.toggle("active", nb_powerUP_grenade_player2 === 0);
		document.getElementById("overlay-teammate-1").classList.toggle("active", nb_powerUP_teammate_player1 === 0);
		document.getElementById("overlay-teammate-2").classList.toggle("active", nb_powerUP_teammate_player2 === 0);
	}

	handleKeyPress(event) {
		const key = event.key;
		
		if (!(key in this.cooldownTimes)) return;
	
		// Vérifier si la touche est en cooldown
		if (this.cooldowns[key]) return; // Ignore l'action si en cooldown

	
		let elem = null;
		switch (key) {
			case "z":
				elem = document.getElementById("nb-item-grenade-1");
				break;
			case "x":
				elem = document.getElementById("nb-item-teammate-1");
				break;
			case "1":
				elem = document.getElementById("nb-item-grenade-2");
				break;
			case "2":
				elem = document.getElementById("nb-item-teammate-2");
				break;
		}
		if (elem) {
			let currentValue = parseInt(elem.innerHTML, 10);
			if (currentValue > 0) {
				elem.innerHTML = currentValue - 1;
				
				console.log(`${key} utilisé, cooldown activé pour ${this.cooldownTimes[key]}ms`);
				
				// Mettre en cooldown cette touche
				this.cooldowns[key] = true;
				
				// Ajouter la classe d'animation pour démarrer l'overlay reloading
				let itemCircle = null;
				let overlayReloading = null;
				let overlayReloading_teammate = null;

				switch (key) {
					case "z":
						overlayReloading = document.getElementById("overlay-reloading-grenade-1");
						itemCircle = document.getElementById("item-circle-grenade1");
						break;
					case "x":
						overlayReloading_teammate = document.getElementById("overlay-reloading-freeze-1");
						itemCircle = document.getElementById("item-circle-teammate1");
						break;
					case "1":
						overlayReloading = document.getElementById("overlay-reloading-grenade-2");
						itemCircle = document.getElementById("item-circle-grenade2");
						break;
					case "2":
						overlayReloading_teammate = document.getElementById("overlay-reloading-freeze-2");
						itemCircle = document.getElementById("item-circle-teammate2");
						break;
				}

				if (currentValue - 1 === 0)
				{
					itemCircle.classList.add("active");
					this.updateOverlays();
					return;
				}

				if (overlayReloading && currentValue - 1 !== 0)
				{
					overlayReloading.classList.add("active");
				}
				if (itemCircle) {
					itemCircle.classList.add("active");
				}

				if (overlayReloading_teammate && currentValue - 1 !== 0)
				{
					overlayReloading_teammate.classList.add("active");
				}
	
				setTimeout(() =>
				{
					delete this.cooldowns[key];
					console.log(`${key} cooldown terminé`);
	
					if (overlayReloading && currentValue - 1 !== 0)
						overlayReloading.classList.remove("active");

					if (overlayReloading_teammate && currentValue - 1 !== 0)
						overlayReloading_teammate.classList.remove("active");
					
					if (itemCircle && currentValue - 1 !== 0)
						itemCircle.classList.remove("active");

				}, this.cooldownTimes[key]);
			}
		}
	}
}