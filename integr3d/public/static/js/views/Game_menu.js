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
			<script type="module" src="./static/js/script/game_menu.js"></script>
			<div class="container">
				<h1>Game Menu</h1>
				<div class="button-container">
					<button id="solo_1v1_btn" class="btn" data-link="/solo_game_1v1">
						<a href="/solo_game_1v1" class="nav-link" data-link>1v1</a>
					</button>
					<button class="btn" data-link="/solo_game_ai">mav vs qi</button>
					<button id="multiplayer_btn" class="btn" data-link="/multiplayer_2v2">2v2</button>
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
}
