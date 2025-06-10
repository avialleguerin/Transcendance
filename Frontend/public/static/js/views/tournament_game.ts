import AbstractView from "./AbstractView.js";
import { getPlayer_1_win, getPlayer_2_win, isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { leave_tournament_game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { homeView } from "../../../api/utils.js";
// import { log } from '../../../utils/logger.js';
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

		if (window.location.pathname === "/tournament_game") {
			this.gameLoop = setInterval(() => { this.checkGameOver_tournament(); 1000 });
		}
		// const accessToken: string | null = sessionStorage.getItem('accessToken');
		// if (!accessToken || accessToken === undefined) {
		// 	history.pushState({}, '', '/');
		// 	import('./Home.js').then((module: any) => {
		// 		const Home = module.default;
		// 		const homeInstance = new Home();
		// 		homeInstance.getHtml().then((html: string) => {
		// 			const appElement = document.getElementById('app');
		// 			if (appElement) {
		// 				appElement.innerHTML = html;
		// 				if (homeInstance.createAccount && typeof homeInstance.createAccount === 'function') {
		// 					homeInstance.createAccount();
		// 				}
		// 			}
		// 		});
		// 	});
		// }
		homeView();
	}

	async getHtml() {
		return /*html*/`
		<link rel="stylesheet" href="./static/js/css/tournament_game.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="press_space" >
			<h1 id="press_space_id">Press SPACE to Start</h1>
		</div>
		<div class="container-EndGame">
			<div class="winner">
				<h1 id="winner_id"></h1>
			</div>
			<button class="leave_game_2" id="leave_game_2_id" onclick="create_1v1_game(event, '${localStorage.getItem('current_player1')}', '${localStorage.getItem('current_player2')}')">Quitter la partie</button>
		</div>
		<div id="notification-container" class="fixed top-0 left-0 right-0 flex justify-center z-50 mt-4">
			<p id="resultMessage" class="py-2 px-4 rounded shadow-lg transition-all duration-300 transform translate-y-0 opacity-0"></p>
		</div>
	`;
	}

	handleKeyPress(event: KeyboardEvent) {
		const key = event.key;
		if (!(key in this.cooldownTimes)) return;
	
		if (this.cooldowns[key]) return; // Ignore l'action si en cooldown

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

	checkGameOver_tournament() {
		if (window.location.pathname !== "/tournament_game")
			return;
		const winnerContainer = document.querySelector(".container-EndGame");
		let player_1_win = getPlayer_1_win();
		let player_2_win = getPlayer_2_win();	
		if (!winnerContainer)
			return;
		if (isGameFinished()) {
			winnerContainer.classList.add("active");
			clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
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
			clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
			handleViewTransitions('tournament', 'vue4');
			console.log("Destruction de l'environnement et des objets du jeu");
			setTimeout(() => {
				leave_tournament_game();
			}, 1500);
		});
	}
}
