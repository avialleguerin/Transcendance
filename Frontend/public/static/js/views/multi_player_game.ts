import AbstractView from "./AbstractView.js";
import { getPowerUP_value_multi } from "./Game_menu.js";
import { leave_Multiplayer_Game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { setLeaveGameVar } from "../index.js";
import { disable_skin_multi_podium } from "../../../srcs/game/gameplay/multiplayer/init_teamPlayer_podium.js";
import { isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { getIsTeam1Win, getIsTeam2Win } from "../../../srcs/game/gameplay/score.js";

let space_pressed = false;

export default class extends AbstractView {

	cooldowns: any;
	cooldownTimes: any;
	boundKeyPressHandler: (event: KeyboardEvent) => void;
	gameLoop: NodeJS.Timeout | null;
	

	constructor() {
		super();
		this.setTitle("multi_player_game");

		this.cooldowns = {};

		this.cooldownTimes = {
			"z": 15000,
			"x": 15000,
			"1": 15000,
			"2": 15000,
			" ": 1000,
		};

		this.boundKeyPressHandler = this.handleKeyPress.bind(this);
		document.addEventListener("keydown", this.boundKeyPressHandler);

		if (window.location.pathname === "/multi_player_game") {
			this.gameLoop = setInterval(() => { this.checkGameOver(); 1000 });
		}
	}

	async getHtml() {
		return /*html*/`
			<link rel="stylesheet" href="./static/js/css/multi_player_game.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="press_space" >
					<h1 id="press_space_id">Press SPACE to Start</h1>
				</div>
				<div class="container-leave">
					<button class="option" id="option_btn">
						<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
					</button>
				</div>
				<div class="panel" id="panel_id">
					<button class="option-in-panel" id="option_btn-remove">
						<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
					</button>
					<button class="leave_game" id="leave_game_id">Leave Game</button>
				</div>
				<div class="container-Player1" id="container-player1-id">
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
				<div class="container-Player2" id="container-player2-id">
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
				<div class="container-EndGame">
					<div class="winner">
						<h1 id="Winner_id"></h1>
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

	leave_game_multi() {
		document.getElementById("leave_game_id").addEventListener("click", () => {
			console.log("leave_the_game");
			this.cleanup();

			setLeaveGameVar(true);
			space_pressed = false;
			handleViewTransitions("vue2", "vue4");
			setTimeout(() => {
				window.history.back();
				leave_Multiplayer_Game();
			}, 1500);
		});
	}

	leave_game_2_multi() {
		document.getElementById("leave_game_2_id").addEventListener("click", () => {
			console.log("leave_the_game2222222222");
			this.cleanup();

			setLeaveGameVar(true);
			disable_skin_multi_podium();
			space_pressed = false;
			handleViewTransitions("vue2", "vue4");
			setTimeout(() => {
				window.history.back();
				leave_Multiplayer_Game();
			}, 1500);
		});
	}

	init_powerUP_player_multi() {

		const container_player1 = document.getElementById("container-player1-id");
		const container_player2 = document.getElementById("container-player2-id");

		console.log("powerUP_value_multi", getPowerUP_value_multi());
        if (getPowerUP_value_multi() !== 0) {
			console.log("powerUP_value_multi je rentre ici");
			// container_player1.classList.add("active");
			// container_player2.classList.add("active");
			container_player1.style.visibility = "visible";
			container_player2.style.visibility = "visible";
		}
        else {
			console.log("powerUP_value_multi je rentre ici222");
			// container_player1.classList.remove("active");
			// container_player2.classList.remove("active");
			container_player1.style.visibility = "hidden";
			container_player2.style.visibility = "hidden";
		}
		document.getElementById("nb-item-grenade-1").innerHTML = getPowerUP_value_multi().toString();
		document.getElementById("nb-item-teammate-1").innerHTML = getPowerUP_value_multi().toString();
		document.getElementById("nb-item-grenade-2").innerHTML = getPowerUP_value_multi().toString();
		document.getElementById("nb-item-teammate-2").innerHTML = getPowerUP_value_multi().toString();
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

	handleKeyPress(event: KeyboardEvent) {
		// Vérifier si la touche est une touche de l'inventaire
		const key = event.key;
		
		if (!(key in this.cooldownTimes)) return;
	
		// Vérifier si la touche est en cooldown
		if (this.cooldowns[key]) return; // Ignore l'action si en cooldown

		if (key === " ") {
			console.log("space pressed");
			const press_space = document.getElementById("press_space_id");
			if (press_space) {
				press_space.style.visibility = "hidden";
				press_space.style.animation = "none";
			} else {
				console.error("press_space_id introuvable !");
			}
			space_pressed = true;
		}

		if (space_pressed)
		{
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
				elem.innerHTML = (currentValue - 1).toString(); //NOTE - jai changer le type pour que ca passe ici
				
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

	event_multiPlayer_game() {
		const option = document.getElementById("option_btn");
		const panel = document.getElementById("panel_id");
		const option_remove = document.getElementById("option_btn-remove");

		
		option.addEventListener("click", () => {
			console.log("option clicked");
			panel.classList.add("active");
			panel.classList.remove("remove");
			option.classList.add("active");
		});
	
		option_remove.addEventListener("click", () => {
			console.log("option_remove clicked");
			panel.classList.add("remove");
			option.classList.remove("active");
			setTimeout(() => {
				panel.classList.remove("active");
			}, 1100);
		});
	}

	checkGameOver() {
		if (window.location.pathname !== "/multi_player_game")
			return;
		const winnerContainer = document.querySelector(".container-EndGame");
		let team_player1_win = getIsTeam1Win();
		let team_player2_win = getIsTeam2Win();
		if (!winnerContainer)
			return;
		if (isGameFinished()) {
			winnerContainer.classList.add("active");
			clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
            if (team_player1_win) {
				document.getElementById("Winner_id").innerHTML = "Player 1 - Player 2 Win";
				document.getElementById("looser_id").innerHTML = "Player 3 - Player 4 Loose";
			}
            else if (team_player2_win) {
				document.getElementById("Winner_id").innerHTML = "Player 3 - Player 4 Win";
				document.getElementById("looser_id").innerHTML = "Player 1 - Player 2 Loose";
			}
		}
        else {
			winnerContainer.classList.remove("active");
		}
	}
}
