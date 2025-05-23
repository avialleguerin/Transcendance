import AbstractView from "./AbstractView.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { leave_Multiplayer_Game } from "../../../srcs/game/gameplay/babylon.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Game_menu");
	}

	async getHtml() {
		return /*html*/`
			<link rel="stylesheet" href="./static/js/css/solo_game_1v1.css">
			<script type="module" src="./static/js/script/game_menu.js"></script>
			<div class="container">
				<h1>Solo_game</h1>
				<div class="button-container">
					<button id="back_button" class="btn" data-link="/back_button"> 
						<a href="/Game_menu" class="nav-link" data-link>Leave the game</a>
					</button>
				</div>
			</div>
		`;
	}

	Back_to_Menu_duo() {
		document.getElementById("back_button").addEventListener("click", () => {
			console.log("Back to menu");
			handleViewTransitions("vue2", "vue4");
			setTimeout(() => {
				leave_Multiplayer_Game();
			} , 1500);
		});
	}
}