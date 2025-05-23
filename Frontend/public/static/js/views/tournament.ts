import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import AbstractView from "./AbstractView.js";
import { startTournamentGame } from "../../../srcs/game/gameplay/babylon.js";
import { getPlayer_1_win } from "../../../srcs/game/gameplay/score.js";
let count = 0;

let tournamentStarted = false;
let tournament_finished = false;
let tournament_leave = false;


export default class extends AbstractView {
	private gameLoop: number;  // NOTE - or 'any'
    constructor() {
        super();
        this.setTitle("Tournament");

		if (window.location.pathname === "/tournament") {
			this.gameLoop = setInterval(() => this.checktournamentstart(), 1000);
		}
		// tournamentStarted = localStorage.getItem('tournamentStarted') === 'true';
    }

	async getHtml() {
		return /*html*/`
		<link rel="stylesheet" href="./static/js/css/tournament.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="tournament_view" id="tournament_view">
			<div class="tournament_view-content">
				<h1>TOURNAMENT</h1>
				<button id="start_tournament" class="btn_start_tournament">START</button>
				<button id="back_to_menu_view_tournament" class="btn_back_tournament">BACK</button>
				<div class="container_name_player" id="container_name_player">
					<h1>Connect your opponents</h1>
					<div class="player_section">
						<p>Player 2</p>
						<div class="input-container">
							<label for="player2">Email</label>
							<input type="text" id="player2" class="input_name_player" placeholder="Email player 2">
						</div>
						<div class="input-container">
							<label for="player2">Password</label>
							<input type="password" id="player2" class="input_name_player" placeholder="Password player 2">
						</div>
					</div>
					<div class="player_section">
						<p>Player 3</p>
						<div class="input-container">
							<label for="player3">Email</label>
							<input type="text" id="player3" class="input_name_player" placeholder="Player namer 3">
						</div>
						<div class="input-container">
							<label for="player3">Password</label>
							<input type="password" id="player3" class="input_name_player" placeholder="Password player 3">
						</div>
					</div>
					<div class="player_section">
						<p>Player 4</p>
						<div class="input-container">
							<label for="player4">Email</label>
							<input type="text" id="player4" class="input_name_player" placeholder="Player namer 4">
						</div>
						<div class="input-container">
							<label for="player4">Password</label>
							<input type="password" id="player4" class="input_name_player" placeholder="Password player 4">
						</div>
					</div>
					<button id="continue" class="continue_btn">OK</button>
				</div>
				<div class="tournament_graphic" id="tournament_graphic_id">
					<p class="winnerBracket" id="winnerBracket_id">Winner Bracket</p>
					<p class="loserBracket" id="loserBracket_id">Loser Bracket</p>
					<p class="joueur1" id="joueur1_id">joueur 1</p>
					<p class="joueur2" id="joueur2_id">joueur 2</p>
					<p class="joueur3" id="joueur3_id">joueur 3</p>
					<p class="joueur4" id="joueur4_id">joueur 4</p>
					<img src="../../../srcs/game/assets/image/tournament_with_bracket.svg" alt="tournament">
					<button id="start_game" class="btn_start_game">
						<a href="/tournament_game" class="nav-link" data-link>JOUER</a>
					</button>
					<button id="leave_tournament" class="btn_leave_tournament">X</button>
				</div>
				<div class="message" id="message_id">
					<p>ATTENTION : Si vous quittez le tournoi, vous ne pourrez pas revenir en arrière.</p>
					<button class="close_message" id="close_message_id">X</button>
					<button class="comfirm_leave_tournament" id="confirm_leave_tournament">Quitter le tournoi</button>
				</div>
				<div class="container_endTournament" id="container_endTournament">
					<h1>TOURNAMENT FINISHED</h1>
					<img src="../../../srcs/game/assets/image/tournament_end.png" alt="trophy" class="trophy">
					<div class="result">
						<div class="first_place">
							<p class="first_place_name" id="first_place_name_id"></p>
						</div>
						<div class="second_place">
							<p class="second_place_name" id="second_place_name_id"></p>
						</div>
						<div class="third_place">
							<p class="third_place_name" id="third_place_name_id"></p>
						</div>
					</div>
					<button class="finish_tournament" id="finiched_game">FINISHED</button>
				</div>
			</div>	
		</div>
	`;
	}

	exit_tournament()
	{
		document.getElementById('back_to_menu_view_tournament').addEventListener('click', () => {
			handleViewTransitions('vue2', 'tournament');
			window.history.back();
		});
	}

	start_tournament_game()
	{
		document.getElementById('start_game').addEventListener('click', () => {
			console.log('Start game clicked');
			handleViewTransitions('tournament_game_start', 'tournament');
			startTournamentGame();
			count = parseInt(localStorage.getItem('tournamentCount')) || 0;
			count++;
			localStorage.setItem('tournamentCount', count.toString());
			if (count >= 6)
			{
				const finiched_game = document.getElementById('finiched_game');
				finiched_game.style.display = 'block';
				tournament_finished = true;
			}
		});
	}

	init_tournament()
	{
		const joueur1_id = document.getElementById('joueur1_id');
		const joueur2_id = document.getElementById('joueur2_id');
		const joueur3_id = document.getElementById('joueur3_id');
		const joueur4_id = document.getElementById('joueur4_id');

		updateTournamentState(count, joueur1_id, joueur2_id, joueur3_id, joueur4_id);

		const countFromStorage = parseInt(localStorage.getItem('tournamentCount')) || 0;
		console.log('Tournament count:', count);
		console.log('Tournament started:', tournamentStarted);
		console.log('Tournament count from storage:', countFromStorage);

		if (countFromStorage >= 6) {
			const endTournamentContainer = document.getElementById('container_endTournament');
			const tournament_graphic_id = document.getElementById('tournament_graphic_id');

			console.log('Tournament count:', count);
			endTournamentContainer.classList.add('active');
			tournament_graphic_id.classList.remove('active');
			console.log("tournament removed");

		}
	}


    tournament_event() {
        const start_tournament = document.getElementById('start_tournament');
        const container_name_player = document.getElementById('container_name_player');
        const tournament_graphic_id = document.getElementById('tournament_graphic_id');
		const back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');
		const finish_tournament = document.getElementById('finiched_game');

		start_tournament.addEventListener('click', () => {
			tournamentStarted = true;
			localStorage.setItem('tournamentStarted', tournamentStarted.toString());
			container_name_player.classList.add('hidden');
			tournament_graphic_id.classList.add('active');
			start_tournament.style.display = 'none';
			back_to_menu_view_tournament.style.display = 'none';

			// Mettre en surbrillance les joueurs initiaux
			highlightNextPlayers(joueur1_id, joueur2_id);
		});

		const leave_tournament = document.getElementById('leave_tournament');
		const message_id = document.getElementById('message_id');

		leave_tournament.addEventListener('click', () => {
			message_id.classList.add('active');
			tournament_graphic_id.style.filter = "blur(5px)";
			tournament_graphic_id.style.pointerEvents = "none";
		});

		const close_message = document.getElementById('close_message_id');

		close_message.addEventListener('click', () => {
			message_id.classList.remove('active');
			tournament_graphic_id.style.filter = "none";
			tournament_graphic_id.style.pointerEvents = "auto";
		});

		const confirm_leave_tournament = document.getElementById('confirm_leave_tournament');

		// Get the player elements
		const joueur1_id = document.getElementById('joueur1_id');
		const joueur2_id = document.getElementById('joueur2_id');
		const joueur3_id = document.getElementById('joueur3_id');
		const joueur4_id = document.getElementById('joueur4_id');

		confirm_leave_tournament.addEventListener('click', () => {
			message_id.classList.remove('active');
			tournament_graphic_id.style.filter = "none";
			tournament_graphic_id.style.pointerEvents = "auto";
			tournament_graphic_id.classList.remove('active');
			container_name_player.classList.remove('hidden');
			tournamentStarted = false;

			// Réinitialiser les styles des joueurs
			resetHighlight([joueur1_id, joueur2_id, joueur3_id, joueur4_id]);

			resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
			back_to_menu_view_tournament.style.display = 'block';
			start_tournament.style.display = 'block';
			count = 0;
			localStorage.setItem('tournamentCount', count.toString());
		});

		finish_tournament.addEventListener('click', () => {
			tournament_graphic_id.classList.remove('active');
			container_name_player.classList.remove('hidden');
			const container_endTournament = document.getElementById('container_endTournament');
			container_endTournament.classList.remove('active');
			tournamentStarted = false;
			tournament_finished = false;
			tournament_leave = true;

			// Réinitialiser les styles des joueurs
			resetHighlight([joueur1_id, joueur2_id, joueur3_id, joueur4_id]);

			resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
			back_to_menu_view_tournament.style.display = 'block';
			start_tournament.style.display = 'block';
			count = 0;
			localStorage.setItem('tournamentCount', count.toString());
		});
    }

	checktournamentstart() {
		if (window.location.pathname === "/tournament")
		{
			// Récupérer tous les éléments nécessaires
			const container_name_player = document.getElementById('container_name_player');
			const tournament_graphic_id = document.getElementById('tournament_graphic_id');
			const start_tournament = document.getElementById('start_tournament');
			const back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');
			const container_endTournament = document.getElementById('container_endTournament');
			
			// Vérifier que tous les éléments existent avant de les manipuler
			if (!container_name_player || !tournament_graphic_id || !start_tournament || !back_to_menu_view_tournament) {
				return; // Sortir de la fonction si un élément est manquant
			}
			
			if (tournamentStarted == true && tournament_finished == false) {
				container_name_player.classList.add('hidden');
				tournament_graphic_id.classList.add('active');
				start_tournament.style.display = 'none';
				back_to_menu_view_tournament.style.display = 'none';
			}
			else if (tournament_finished == true) {
				container_name_player.classList.add('hidden');
				tournament_graphic_id.classList.remove('active');
				start_tournament.style.display = 'none';
				back_to_menu_view_tournament.style.display = 'none';
				container_endTournament.classList.add('active');
			}
			else if (tournament_leave == true) {
				if (container_name_player.classList.contains('hidden')) {
					container_name_player.classList.remove('hidden');
					tournament_graphic_id.classList.remove('active');
					start_tournament.style.display = 'block';
					back_to_menu_view_tournament.style.display = 'block';
					container_endTournament.classList.remove('active');
					tournament_leave = false;
				}
			}
		}
	}
}

const POSITIONS =
{
	round1: {
		player1: { top: '', left: '' },
		player2: { top: '', left: '' },
		player3: { top: '', left: '' },
		player4: { top: '', left: '' }
	},
	quart_winner: {
		winner1_2: { top: '12%', left: '38%' },
		loser1_2: { top: '62%', left: '24%' },
		winner3_4: { top: '32%', left: '38%' },
		loser3_4: { top: '70%', left: '24%' },
	},
	quart_loser: {
		winner: { top: '67%', left: '38%' },
	},
	demi_winer: {
		winner: { top: '34%', left: '58%' },
		loser: { top: '75%', left: '38%' },
	},
	demi_loser: {
		winner: { top: '43%', left: '58%' },
	},
	grande_final:
	{
		winner: { top: '38%', left: '72%' },
	},
};

interface PlayerElement extends HTMLElement {
	style: CSSStyleDeclaration;
}

interface TournamentPlayerState {
	element: PlayerElement;
	position?: {
		top: string;
		left: string;
	};
	color: string;
}

function resetTournamentState(joueur1_id: PlayerElement, joueur2_id: PlayerElement, joueur3_id: PlayerElement, joueur4_id: PlayerElement): void {    
    const joueurs: PlayerElement[] = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];

    // Effacer tous les résultats des matchs dans localStorage
    localStorage.removeItem("match1_result");
    localStorage.removeItem("match2_result");
    localStorage.removeItem("match3_result");
    localStorage.removeItem("match4_result");
    localStorage.removeItem("match5_result");
    localStorage.removeItem("match6_result");
    
    // Réinitialiser le compteur de matchs
    localStorage.removeItem("tournamentCount");
    
    // Réinitialiser l'état du tournoi
    localStorage.removeItem("tournamentStarted");
    localStorage.removeItem("tournament_finished");
    
    // Réinitialiser les positions des joueurs
    joueurs.forEach(joueur => {
        joueur.style.top = '';
        joueur.style.left = '';
        joueur.style.color = 'white';
    });
}

interface PlayerElement extends HTMLElement {
	style: CSSStyleDeclaration;
}

interface MatchResult {
	winner: PlayerElement;
	loser: PlayerElement;
}
function updateTournamentState(
	count: number,
	joueur1_id: PlayerElement,
	joueur2_id: PlayerElement,
	joueur3_id: PlayerElement,
	joueur4_id: PlayerElement
): void {
	console.log('Count:', count);

	let match1_winner: PlayerElement | undefined,
		match1_loser: PlayerElement | undefined,
		match2_winner: PlayerElement | undefined,
		match2_loser: PlayerElement | undefined,
		match3_winner: PlayerElement | undefined,
		match3_loser: PlayerElement | undefined,
		match4_winner: PlayerElement | undefined,
		match4_loser: PlayerElement | undefined,
		match5_winner: PlayerElement | undefined,
		match5_loser: PlayerElement | undefined,
		match6_winner: PlayerElement | undefined,
		match6_loser: PlayerElement | undefined;

	if (count >= 0) {
		const players: PlayerElement[] = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];
		const positions = Object.values(POSITIONS.round1);

		players.forEach((joueur, index) => {
			joueur.style.top = positions[index].top;
			joueur.style.left = positions[index].left;
			resetHighlight([joueur]);
		});

		highlightNextPlayers(joueur1_id, joueur2_id);
	}

	if (count >= 1) {
		resetHighlight([joueur1_id, joueur2_id]);
		const match1_result = localStorage.getItem("match1_result");

		if (match1_result) {
			const { winner, loser } = JSON.parse(match1_result);
			match1_winner = document.getElementById(winner) as PlayerElement;
			match1_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const player1_wins = getPlayer_1_win();
			match1_winner = player1_wins ? joueur1_id : joueur2_id;
			match1_loser = player1_wins ? joueur2_id : joueur1_id;

			localStorage.setItem("match1_result", JSON.stringify({
				winner: match1_winner.id,
				loser: match1_loser.id
			}));
		}

		if (match1_winner && match1_loser) {
			match1_winner.style.top = POSITIONS.quart_winner.winner1_2.top;
			match1_winner.style.left = POSITIONS.quart_winner.winner1_2.left;
			match1_loser.style.top = POSITIONS.quart_winner.loser1_2.top;
			match1_loser.style.left = POSITIONS.quart_winner.loser1_2.left;
			highlightNextPlayers(joueur3_id, joueur4_id);
		}
	}

	if (count >= 2) {
		resetHighlight([joueur3_id, joueur4_id]);
		const match2_result = localStorage.getItem("match2_result");

		if (match2_result) {
			const { winner, loser } = JSON.parse(match2_result);
			match2_winner = document.getElementById(winner) as PlayerElement;
			match2_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const player1_wins = getPlayer_1_win();
			match2_winner = player1_wins ? joueur3_id : joueur4_id;
			match2_loser = player1_wins ? joueur4_id : joueur3_id;

			localStorage.setItem("match2_result", JSON.stringify({
				winner: match2_winner.id,
				loser: match2_loser.id
			}));
		}

		if (match2_winner && match2_loser) {
			match2_winner.style.top = POSITIONS.quart_winner.winner3_4.top;
			match2_winner.style.left = POSITIONS.quart_winner.winner3_4.left;
			match2_loser.style.top = POSITIONS.quart_winner.loser3_4.top;
			match2_loser.style.left = POSITIONS.quart_winner.loser3_4.left;

			highlightNextPlayers(match1_loser!, match2_loser);
		}
	}

	if (count >= 3 && match1_loser && match2_loser) {
		resetHighlight([match1_loser, match2_loser]);
		const match3_result = localStorage.getItem("match3_result");

		if (match3_result) {
			const { winner, loser } = JSON.parse(match3_result);
			match3_winner = document.getElementById(winner) as PlayerElement;
			match3_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const winnerIsFirst = getPlayer_1_win();
			match3_winner = winnerIsFirst ? match1_loser : match2_loser;
			match3_loser = winnerIsFirst ? match2_loser : match1_loser;

			localStorage.setItem("match3_result", JSON.stringify({
				winner: match3_winner.id,
				loser: match3_loser.id
			}));
		}

		if (match3_winner && match3_loser) {
			match3_winner.style.top = POSITIONS.quart_loser.winner.top;
			match3_winner.style.left = POSITIONS.quart_loser.winner.left;
			match3_loser.style.color = 'red';
			highlightNextPlayers(match1_winner!, match2_winner!);
		}
	}

	if (count >= 4 && match1_winner && match2_winner) {
		resetHighlight([match1_winner, match2_winner]);
		const match4_result = localStorage.getItem("match4_result");

		if (match4_result) {
			const { winner, loser } = JSON.parse(match4_result);
			match4_winner = document.getElementById(winner) as PlayerElement;
			match4_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const winnerIsFirst = getPlayer_1_win();
			match4_winner = winnerIsFirst ? match1_winner : match2_winner;
			match4_loser = winnerIsFirst ? match2_winner : match1_winner;

			localStorage.setItem("match4_result", JSON.stringify({
				winner: match4_winner.id,
				loser: match4_loser.id
			}));
		}

		if (match4_winner && match4_loser) {
			match4_winner.style.top = POSITIONS.demi_winer.winner.top;
			match4_winner.style.left = POSITIONS.demi_winer.winner.left;

			match4_loser.style.top = POSITIONS.demi_winer.loser.top;
			match4_loser.style.left = POSITIONS.demi_winer.loser.left;

			highlightNextPlayers(match3_winner!, match4_loser);
		}
	}

	if (count >= 5 && match3_winner && match4_loser) {
		resetHighlight([match3_winner, match4_loser]);
		const match5_result = localStorage.getItem("match5_result");

		if (match5_result) {
			const { winner, loser } = JSON.parse(match5_result);
			match5_winner = document.getElementById(winner) as PlayerElement;
			match5_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const winnerIsFirst = getPlayer_1_win();
			match5_winner = winnerIsFirst ? match3_winner : match4_loser;
			match5_loser = winnerIsFirst ? match4_loser : match3_winner;

			localStorage.setItem("match5_result", JSON.stringify({
				winner: match5_winner.id,
				loser: match5_loser.id
			}));
		}

		if (match5_winner && match5_loser) {
			match5_winner.style.top = POSITIONS.demi_loser.winner.top;
			match5_winner.style.left = POSITIONS.demi_loser.winner.left;

			match5_loser.style.color = 'red';
			highlightNextPlayers(match4_winner!, match5_winner);
		}
	}

	if (count >= 6 && match4_winner && match5_winner) {
		resetHighlight([match4_winner, match5_winner]);
		const match6_result = localStorage.getItem("match6_result");

		if (match6_result) {
			const { winner, loser } = JSON.parse(match6_result);
			match6_winner = document.getElementById(winner) as PlayerElement;
			match6_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const winnerIsFirst = getPlayer_1_win();
			match6_winner = winnerIsFirst ? match4_winner : match5_winner;
			match6_loser = winnerIsFirst ? match5_winner : match4_winner;

			localStorage.setItem("match6_result", JSON.stringify({
				winner: match6_winner.id,
				loser: match6_loser.id
			}));
		}

		if (match6_winner && match6_loser) {
			match6_winner.style.top = POSITIONS.grande_final.winner.top;
			match6_winner.style.left = POSITIONS.grande_final.winner.left;

			match6_loser.style.color = 'red';
			console.log("Tournoi terminé !");
		}
	}
}



/**
 * Détermine le gagnant et le perdant d'un match.
 */
function determineMatchResult(player1Wins: boolean, player1: PlayerElement, player2: PlayerElement): MatchResult {
    return player1Wins
        ? { winner: player1, loser: player2 }
        : { winner: player2, loser: player1 };
}

interface PlayerElement extends HTMLElement {
	style: CSSStyleDeclaration;
}

/**
 * Highlights the players who are currently active in the tournament
 * @param players
 */
function highlightNextPlayers(...players: (PlayerElement | undefined)[]): void {
	const allPlayers: NodeListOf<Element> = document.querySelectorAll('.player');
	allPlayers.forEach((p: Element) => {
		const player = p as HTMLElement;
		player.style.filter = "brightness(1)";
		player.style.color = "";
		player.style.transform = "";
		player.style.textShadow = "";
		player.style.fontWeight = "";
	});

	players.forEach((player: PlayerElement | undefined) => {
		if (player) {
			player.style.filter = "brightness(2.0) saturate(2.0)";
			player.style.color = "#FFFF00";
			player.style.transform = "scale(1.1)";
			player.style.textShadow = "0 0 10px rgba(255, 255, 0, 0.8)";
			player.style.fontWeight = "bold";
			player.style.transition = "all 0.3s ease-in-out";
		}
	});
}

function resetHighlight(players: (PlayerElement | undefined)[]): void {
	players.forEach(player => {
		if (player) {
			player.style.filter = "brightness(1)";
			player.style.color = "white";
			player.style.transform = "";
			player.style.textShadow = "";
			player.style.fontWeight = "";
			player.style.transition = "all 0.3s ease-in-out";
		}
	});
}