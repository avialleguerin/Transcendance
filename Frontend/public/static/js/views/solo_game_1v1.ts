import AbstractView from "./AbstractView.js";
import { getPowerUP_value } from "./Game_menu.js";
import { leave_Game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { setLeaveGameVar } from "../index.js";
import { isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { disable_skin_perso_player_first_and_seconde } from "../../../srcs/game/gameplay/solo/skin/init_skin_player_podium.js";
import { getPlayer_1_win, getPlayer_2_win } from "../../../srcs/game/gameplay/score.js";

let spacePressed = false;
let bool = false;

export default class solo_game extends AbstractView {

	cooldowns: { [key: string]: boolean };
	cooldownTimes: { [key: string]: number };
	boundKeyPressHandler: (event: KeyboardEvent) => void;
	gameLoop: number | null;

	constructor() {
		super();
		this.setTitle("solo_game");

		this.cooldowns = {};

		this.cooldownTimes = {
			"z": 15000,
			"x": 20000,
			"c": 15000,
			"1": 15000,
			"2": 20000,
			"3": 15000,
			"t": 1000,
			" ": 1000,
		};

		this.boundKeyPressHandler = this.handleKeyPress.bind(this);
    
		
		if (bool == false) {
			if (window.location.pathname === "/solo_game_1v1") {
				console.log("solo_game_1v1.js ////////////////////////////////////////////////////////////////////////////////////////////////////////");

				document.addEventListener("keydown", this.boundKeyPressHandler);
				this.gameLoop = setInterval(() => { this.checkGameOver();}, 1000 );
				bool = true;
			}
		}
	}

	async getHtml(): Promise<string> {
		return /*html*/`
			<link rel="stylesheet" href="./static/js/css/solo_game_1v1.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="press_space" >
					<h1 id="press_space_id">Press SPACE to Start</h1>
				</div>

				<div class="container-Player1" id="container-player1_id">
					<h1>Player 1</h1>
					<div class="container-item_player1">
						<p id="nb-item-grenade-1"></p>
						<p class="touch_player1">Z</p>
						<div class="item-circle" id="item-circle-grenade1">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-1"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-1"></div>
						</div>
						<p id="nb-item-teammate-1"></p>
						<p class="touch_player1">X</p>
						<div class="item-circle" id="item-circle-teammate1">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-1"></div>
							<div class="overlay-reloading-teammate" id="overlay-reloading-teammate-1"></div>
						</div>
						<p id="nb-item-autre-1"></p>
						<p class="touch_player1">C</p>
						<div class="item-circle" id="item-circle-inverse1">
							<img src="../../../srcs/game/assets/image/inverse_powerUP.png" alt="Item 3">
							<div class="overlay" id="overlay-inverse-1"></div>
							<div class="overlay-reloading" id="overlay-reloading-inverse-1"></div>
						</div>
					</div>
				</div>
				<div class="container-Player2" id="container-player2_id">
					<h1>Player 2</h1>
					<div class="container-item_player2">
						<p id="nb-item-grenade-2"></p>
						<p class="touch_player2">1</p>
						<div class="item-circle" id="item-circle-grenade2">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-2"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-2"></div>
						</div>
						<p id="nb-item-teammate-2"></p>
						<p class="touch_player2">2</p>
						<div class="item-circle" id="item-circle-teammate2">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-2"></div>
							<div class="overlay-reloading-teammate" id="overlay-reloading-teammate-2"></div>
						</div>
						<p id="nb-item-autre-2"></p>
						<p class="touch_player2">3</p>
						<div class="item-circle" id="item-circle-inverse2">
							<img src="../../../srcs/game/assets/image/inverse_powerUP.png" alt="Item 3">
							<div class="overlay" id="overlay-inverse-2"></div>
							<div class="overlay-reloading" id="overlay-reloading-inverse-2"></div>
						</div>
					</div>
				</div>
				<div class="container-EndGame">
					<div class="winner">
						<h1 id="winner_id"></h1>
					</div>
					<div class="looser">
						<h1 id="looser_id"></h1>
					</div>
					<button class="leave_game_2" id="leave_game_2_id">Quitter la partie</button>
				</div>
			</div>
		`;
	}

	cleanup() {
		document.removeEventListener("keydown", this.boundKeyPressHandler);
		clearInterval(this.gameLoop);
	}

	leave_game_2() {
		document.getElementById("leave_game_2_id").addEventListener("click", () => {
			
			this.cleanup();
			setLeaveGameVar(true);
			disable_skin_perso_player_first_and_seconde();
			spacePressed = false;
			bool = false;
			handleViewTransitions("vue2", "vue4");
			setTimeout(() => {
				window.history.back();
				leave_Game();
			}, 1500);
		});
	}
		

	init_powerUP_player() {
		console.log("powerUP value == ", getPowerUP_value());

		const container_player1 = document.getElementById("container-player1_id");
		const container_player2 = document.getElementById("container-player2_id");
        if (getPowerUP_value() !== 0) {
			console.log("powerUP valueje reeeeedjkhkjefwhjkewhfkjwe == ", getPowerUP_value());
			container_player1.classList.add("active");
			container_player2.classList.add("active");
		}
        else {
			console.log(" else    powerUP valueje reeeeedjkhkjefwhjkewhfkjwe == ", getPowerUP_value());
			if (container_player1.classList.contains("active"))
				container_player1.classList.remove("active");
			if (container_player2.classList.contains("active"))
				container_player2.classList.remove("active");
		}

		document.getElementById("nb-item-grenade-1").innerHTML = getPowerUP_value().toString();
		document.getElementById("nb-item-teammate-1").innerHTML = getPowerUP_value().toString();
		document.getElementById("nb-item-autre-1").innerHTML = getPowerUP_value().toString();
		document.getElementById("nb-item-grenade-2").innerHTML = getPowerUP_value().toString();
		document.getElementById("nb-item-teammate-2").innerHTML = getPowerUP_value().toString();
		document.getElementById("nb-item-autre-2").innerHTML = getPowerUP_value().toString();
	}

	updateOverlays() {
		const nb_powerUP_grenade_player1 = parseInt(document.getElementById("nb-item-grenade-1").innerHTML, 10);
		const nb_powerUP_grenade_player2 = parseInt(document.getElementById("nb-item-grenade-2").innerHTML, 10);
		const nb_powerUP_teammate_player1 = parseInt(document.getElementById("nb-item-teammate-1").innerHTML, 10);
		const nb_powerUP_teammate_player2 = parseInt(document.getElementById("nb-item-teammate-2").innerHTML, 10);
		const nb_powerUP_inverse_player1 = parseInt(document.getElementById("nb-item-autre-1").innerHTML, 10);
		const nb_powerUP_inverse_player2 = parseInt(document.getElementById("nb-item-autre-2").innerHTML, 10);
	
		document.getElementById("overlay-grenade-1").classList.toggle("active", nb_powerUP_grenade_player1 === 0);
		document.getElementById("overlay-grenade-2").classList.toggle("active", nb_powerUP_grenade_player2 === 0);
		document.getElementById("overlay-teammate-1").classList.toggle("active", nb_powerUP_teammate_player1 === 0);
		document.getElementById("overlay-teammate-2").classList.toggle("active", nb_powerUP_teammate_player2 === 0);
		document.getElementById("overlay-inverse-1").classList.toggle("active", nb_powerUP_inverse_player1 === 0);
		document.getElementById("overlay-inverse-2").classList.toggle("active", nb_powerUP_inverse_player2 === 0);
	}

	handleKeyPress(event: KeyboardEvent) { //NOTE - jai ajouter le type event: KeyboardEvent
		console.log("Key pressed:", event.key);
		console.log("Current cooldowns state:", this.cooldowns);
		const key = event.key;
		
		
		
		
		// Vérifier si la touche a un cooldown défini
		if (!(key in this.cooldownTimes)) return;
		
		if (this.cooldowns[key]) {
			console.log(`Key ${key} is in cooldown, ignoring`);
			return;
		} // Ignore l'action si en cooldown
		// Vérifier si la touche est en cooldown

		if (key === " ") {
			const press_space = document.getElementById("press_space_id");
			if (press_space) {
				press_space.style.visibility = "hidden";
				press_space.style.animation = "none";
            }
            else {
				console.error("press_space_id introuvable !");
			}
			spacePressed = true;
		}


		if (spacePressed)
		{
			let elem = null;
			switch (key) {
				case "z":
					elem = document.getElementById("nb-item-grenade-1");
					break;
				case "x":
					elem = document.getElementById("nb-item-teammate-1");
					break;
				case "c":
					elem = document.getElementById("nb-item-autre-1");
					break;
				case "1":
					elem = document.getElementById("nb-item-grenade-2");
					break;
				case "2":
					elem = document.getElementById("nb-item-teammate-2");
					break;
				case "3":
					elem = document.getElementById("nb-item-autre-2");
					break;
			}
		
			if (elem) {
				let currentValue = parseInt(elem.innerHTML, 10);
				if (currentValue > 0) {
					elem.innerHTML = (currentValue - 1).toString();
					
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
							overlayReloading_teammate = document.getElementById("overlay-reloading-teammate-1");
							itemCircle = document.getElementById("item-circle-teammate1");
							break;
						case "c":
							overlayReloading = document.getElementById("overlay-reloading-inverse-1");
							itemCircle = document.getElementById("item-circle-inverse1");
							break;
						case "1":
							overlayReloading = document.getElementById("overlay-reloading-grenade-2");
							itemCircle = document.getElementById("item-circle-grenade2");
							break;
						case "2":
							overlayReloading_teammate = document.getElementById("overlay-reloading-teammate-2");
							itemCircle = document.getElementById("item-circle-teammate2");
							break;
						case "3":
							overlayReloading = document.getElementById("overlay-reloading-inverse-2");
							itemCircle = document.getElementById("item-circle-inverse2");
							break;
					}

					if (currentValue - 1 === 0)
					{
						itemCircle.classList.add("active");
						this.updateOverlays();
						return;
					}

					if (overlayReloading && currentValue - 1 !== 0) {
						// Lancer l'animation en ajoutant une classe CSS pour démarrer
						overlayReloading.classList.add("active"); // Assurez-vous que .item-loading est défini dans votre CSS
					}
					if (itemCircle) {
						itemCircle.classList.add("active");
					}

					if (overlayReloading_teammate && currentValue - 1 !== 0) {
						// Lancer l'animation en ajoutant une classe CSS pour démarrer
						overlayReloading_teammate.classList.add("active"); // Assurez-vous que .item-loading est défini dans votre CSS
					}
		
					// Retirer le cooldown après le délai défini pour cette touche
					setTimeout(() => {
						//  vérifiez que this.cooldowns est bien accessible
						console.log("Timeout executed for key:", key);
    					console.log("this.cooldowns before:", this.cooldowns);
						console.log("spacePressed:", spacePressed);
						// Terminer le cooldown et arrêter l'animation
						delete this.cooldowns[key];

						console.log("this.cooldowns after:", this.cooldowns);
						console.log(`${key} cooldown terminé`);
		
						// Retirer la classe d'animation après le cooldown
						if (overlayReloading && currentValue - 1 !== 0) {
							overlayReloading.classList.remove("active");
						}
						if (overlayReloading_teammate && currentValue - 1 !== 0) {
							overlayReloading_teammate.classList.remove("active");
						}
						if (itemCircle && currentValue - 1 !== 0) {
							itemCircle.classList.remove("active");
						}

					}, this.cooldownTimes[key]);
				}
			}
		}
	}

	checkGameOver() {
		if (window.location.pathname !== "/solo_game_1v1")
			return;
		const winnerContainer = document.querySelector(".container-EndGame");
		let player_1_win = getPlayer_1_win();
		let player_2_win = getPlayer_2_win();
		const container_player1 = document.getElementById("container-player1_id");
		const container_player2 = document.getElementById("container-player2_id");

		if (!winnerContainer)
			return;
		if (isGameFinished()) {
			winnerContainer.classList.add("active");
			clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
			if (player_1_win)
			{
				document.getElementById("winner_id").innerHTML = "Player 1 Win";
				document.getElementById("looser_id").innerHTML = "Player 2 Loose";
			}
			else if (player_2_win)
			{
				document.getElementById("winner_id").innerHTML = "Player 2 Win";
				document.getElementById("looser_id").innerHTML = "Player 1 Loose";
			}
			if (container_player1.classList.contains("active"))
				container_player1.classList.remove("active");
			if (container_player2.classList.contains("active"))
				container_player2.classList.remove("active");
		}
		else 
		{
			winnerContainer.classList.remove("active");
		}
	}
}