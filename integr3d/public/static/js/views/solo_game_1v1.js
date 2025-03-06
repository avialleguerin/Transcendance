import AbstractView from "./AbstractView.js";
// import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
// import { leave_Game } from "../../../srcs/game/gameplay/babylon.js";



export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Game_menu");
	}

	async getHtml() {
		return `
			<link rel="stylesheet" href="./static/js/css/solo_game_1v1.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="container-Player1">
					<h1>Player 1</h1>
					<div class="container-item_player1">
						<p id="nb-item-grenade-1"></p>
						<div class="item-circle">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
						</div>
						<p id="nb-item-teammate-1"></p>
						<div class="item-circle">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 2">
						</div>
						<p id="nb-item-autre-1"></p>
						<div class="item-circle">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 3">
						</div>
					</div>
				</div>
				<div class="container-Player2">
					<h1>Player 2</h1>
					<div class="container-item_player2">
						<p id="nb-item-grenade-2"></p>
						<div class="item-circle">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
						</div>
						<p id="nb-item-teamate-2"></p>
						<div class="item-circle">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 2">
						</div>
						<p id="nb-item-autre-2"></p>
						<div class="item-circle">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 3">
						</div>
					</div>
				</div>
			</div>
		`;
	}

	// Back_to_Menu() {
	// 	document.getElementById("back_button").addEventListener("click", () => {
	// 		console.log("Back to menu");
	// 		handleViewTransitions("vue2", "vue4");
	// 		setTimeout(() => {
	// 			leave_Game();
	// 		} , 1500);
	// 	});
	// }
}