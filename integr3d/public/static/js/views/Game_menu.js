import AbstractView from "./AbstractView.js";
import { startGame } from "../../../srcs/game/gameplay/babylon.js";
import { startMultiGame } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Game_menu");
	}

	async getHtml() {
		return `
		<link rel="stylesheet" href="./static/js/css/game_menu.css">
		<div id="container" class="container_game_mode">
			<button type="submit" id="btn_jouer">JOUER</button>
			<div class="button-container" style="display: none;">
				<h1>CHOISIE TON MODE DE JEUX</h1>
				<button id="solo_1v1_btn" class="btn" data-link="/solo_game_1v1">
					<a href="/solo_game_1v1" class="nav-link" data-link>1v1</a>
				</button>
				<button class="btn" data-link="/solo_game_ai">mav vs qi</button>
				<button id="multiplayer_btn" class="btn" data-link="/multiplayer_2v2">
					<a href="/duo_game" class="nav-link" data-link>2v2</a>
				</button>
			</div>
		</div>

		// <script>
		// 	console.log('Game Menu Script Loading');
		// </script>
		
		// <script>
		// 	// Utilise 'DOMContentLoaded' pour attendre que tout le DOM soit chargé
		// 	document.addEventListener('DOMContentLoaded', function () {
		// 		const btn_jouer = document.getElementById('btn_jouer');
		// 		const btn_container = document.querySelector('.button-container');
			
		// 		if (!btn_jouer) {
		// 			console.error("ERREUR: #btn_jouer introuvable !");
		// 			return;
		// 		}
			
		// 		btn_jouer.addEventListener('click', () => {
		// 			console.log('JOUER button clicked');
		// 			btn_container.style.display = 'block';
		// 			btn_jouer.style.display = 'none';
		// 		});
		// 	});
		// </script>
		`;
	}

	init_solo_game() {
		document.getElementById("solo_1v1_btn").addEventListener("click", () => {
			console.log("Solo 1v1 game started");
			handleViewTransitions("vue3", "vue2");
			startGame();
		});
	}

	initEvents() {
		document.getElementById("multiplayer_btn").addEventListener("click", () => {
			console.log("Multiplayer 2v2 game started");
			handleViewTransitions("vue3", "vue2");
			startMultiGame();
		});
	}
}
