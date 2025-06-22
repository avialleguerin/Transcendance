import AbstractView from "./AbstractView.js";
import { getPlayer_1_win, getPlayer_2_win, isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { leave_tournament_game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { homeView } from "../../../api/utils.js";
import { getIsloading } from "../../../srcs/game/gameplay/views/loading_screen.js";

export default class extends AbstractView {
	private cooldowns:		Record<string, boolean>;
	private cooldownTimes:	Record<string, number>;
	private gameLoop:		ReturnType<typeof setInterval> | null;
	private boundKeyPressHandler: (event: KeyboardEvent) => void;

	constructor() {
		super();
		this.setTitle("Tournament");

		this.cooldowns = {};

		this.cooldownTimes = {
			" ": 1000,
		};

		this.boundKeyPressHandler = this.handleKeyPress.bind(this);
		document.addEventListener("keydown", this.boundKeyPressHandler);

		if (window.location.pathname === "/tournament-game")
			this.gameLoop = setInterval(() => { this.checkGameOver_tournament(); 1000 });
		const accessToken = sessionStorage.getItem("accessToken");
		if (!accessToken || accessToken === undefined)
			homeView();
	}

	async getHtml() {
		return /*html*/`
		<link rel="stylesheet" href="./static/js/css/tournament-game.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="press_space" >
			<h1 id="press_space_id">Press SPACE to Start</h1>
		</div>
		<div class="container-EndGame">
			<div class="winner">
				<h1 id="winner_id"></h1>
			</div>
			<button class="leave_game_2" id="leave_game_2_id" onclick="create_1v1_game(event, '${localStorage.getItem('current_player1')}', '${localStorage.getItem('current_player2')}')">Leave Game</button>
		</div>
	`;
	}

	handleKeyPress(event: KeyboardEvent) {
		const key = event.key;
		if (!(key in this.cooldownTimes)) return;
	
		if (this.cooldowns[key]) return;

		if (getIsloading() === false) {
			if (key === " ") {
				const press_space = document.getElementById("press_space_id");
				if (press_space) {
					press_space.style.visibility = "hidden";
					press_space.style.animation = "none";
				} else {
					console.error("press_space_id introuvable !");
				}
			}
		}
	}

	checkGameOver_tournament() {
		if (window.location.pathname !== "/tournament-game")
			return;
		const winnerContainer = document.querySelector(".container-EndGame");
		let player_1_win = getPlayer_1_win();
		let player_2_win = getPlayer_2_win();	
		if (!winnerContainer)
			return;
		if (isGameFinished()) {
			winnerContainer.classList.add("active");
			clearInterval(this.gameLoop);
			if (player_1_win)
				document.getElementById("winner_id").innerHTML = localStorage.getItem("current_player1") + " won !";
			else if (player_2_win)
				document.getElementById("winner_id").innerHTML = localStorage.getItem("current_player2") + " won !";
		}
		else 
		{
			winnerContainer.classList.remove("active");
		}
	}

	event_tournament_game() {
		const leave_game_2 = document.getElementById("leave_game_2_id");

		leave_game_2.addEventListener("click", () => {
			window.history.back();
			clearInterval(this.gameLoop);
			handleViewTransitions('tournament', 'vue4');
			setTimeout(() => {
				leave_tournament_game();
			}, 1500);
		});
	}
}
