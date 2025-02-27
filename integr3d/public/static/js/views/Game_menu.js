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
		<div class="view1" id="view1">
			<div class="view1-content">
				<button id="home_btn" class="btn">HOME</button>
				<button id="settings_btn" class="btn">SETTINGS</button>
			</div>
		</div>
		<div id="container" class="container_menu">
			<button id="btn_jouer">JOUER</button>
			<div class="view2" id="view2">
				<div class="view2-content">
					<h1>CHOISIE TON MODE DE JEUX</h1>
					<button id="solo_1v1_btn" class="btn" data-link="/solo_game_1v1">
						<a href="/solo_game_1v1" class="nav-link" data-link>1v1</a>
					</button>
					<button class="btn" data-link="/solo_game_ai">ai</button>
					<button id="multiplayer_btn" class="btn" data-link="/multiplayer_2v2">
						<a href="/duo_game" class="nav-link" data-link>2v2</a>
					</button>
				</div>
			</div>
		</div>

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

	game_menu()
	{
		const btn_jouer = document.getElementById('btn_jouer');
		const view1 = document.getElementById('view1');
		const view2 = document.getElementById('view2');
		const home_btn = document.getElementById('home_btn');
		const settings_btn = document.getElementById('settings_btn');

		// Afficher view1 quand on clique sur JOUER
		btn_jouer.addEventListener('click', () => {
			console.log('JOUER button clicked');
			view1.classList.add('active');
			btn_jouer.style.display = 'none';
		});

		if (!view2.classList.contains('active')) {
			home_btn.addEventListener('click', () => {
				// view1.classList.remove('active');
				view2.classList.add('active');
			});
		}

		// Retourner à l'écran principal quand on clique sur SETTINGS
		settings_btn.addEventListener('click', () => {
			view1.classList.remove('active');
			view2.classList.remove('active');
			btn_jouer.style.display = 'block';
		});
	}
}
