import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import AbstractView from "./AbstractView.js";
import { startTournamentGame } from "../../../srcs/game/gameplay/babylon.js";
import { getPlayer_1_win, getPlayer_2_win } from "../../../srcs/game/gameplay/score.js";

let count = 0;

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Tournament");

		
	}

	async getHtml() {
		return `
		<link rel="stylesheet" href="./static/js/css/tournament.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="tournament_view" id="tournament_view">
		<div class="tournament_view-content">
			<h1>TOURNOI</h1>
			<div class="tournament_graphic" id="tournament_graphic_id">
				<p class="joueur1" id="joueur1_id">joueur 1</p>
				<p class="joueur2" id="joueur2_id">joueur 2</p>
				<p class="joueur3" id="joueur3_id">joueur 3</p>
				<p class="joueur4" id="joueur4_id">joueur 4</p>
				<img src="../../../srcs/game/assets/image/Untitled_LEvRAI.svg" alt="tournament">
			</div>
			<button id="start_tournament" class="btn_start_tournament">Lancer le tournoi</button>
			<button id="back_to_menu_view_tournament" class="btn_back_tournament">
				<a href="/Game_menu" class="nav-link" data-link>BACK</a>
			</button>
			<button id="incremente_place" class="btn_incremente_place">+</button>
			<button id="start_game" class="btn_start_game">
				<a href="/tournament_game" class="nav-link" data-link>JOUER</a>
			</button>
			<button id="finiched_game" class="btn_finished_game">FINISHED</button>
		</div>
	</div>
	`;
	}

	exit_tournament()
	{
		document.getElementById('back_to_menu_view_tournament').addEventListener('click', () => {
			handleViewTransitions('vue2', 'tournament');
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
			localStorage.setItem('tournamentCount', count);
			if (count >= 6)
			{
				const start_game = document.getElementById('start_game');
				start_game.style.display = 'none';
				const finiched_game = document.getElementById('finiched_game');
				finiched_game.style.display = 'block';
			}
		});
	}

	init_tournament()
	{
		const incremente_place = document.getElementById('incremente_place');
		const reset_tournament = document.getElementById('reset_tournament');
		const joueur1_id = document.getElementById('joueur1_id');
		const joueur2_id = document.getElementById('joueur2_id');
		const joueur3_id = document.getElementById('joueur3_id');
		const joueur4_id = document.getElementById('joueur4_id');

		updateTournamentState(count, joueur1_id, joueur2_id, joueur3_id, joueur4_id);

		incremente_place.addEventListener('click', () => {
			console.log('Incremente place clicked');
			count = 0;
			localStorage.setItem('tournamentCount', count);
			resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
		});

		const countFromStorage = parseInt(localStorage.getItem('tournamentCount')) || 0;
		console.log('Count from storage:', countFromStorage);
		if (countFromStorage >= 6) {
			const startGameBtn = document.getElementById('start_game');
			const finishGameBtn = document.getElementById('finiched_game');

			if (startGameBtn) startGameBtn.style.display = 'none';
			if (finishGameBtn) finishGameBtn.style.display = 'block';
		} else {
			const finishGameBtn = document.getElementById('finiched_game');
			if (finishGameBtn) finishGameBtn.style.display = 'none';
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
	final: {
		winner1_2: { top: '17%', left: '48%' },
		winner3_4: { top: '45%', left: '48%' },
	},
	winner_place: {
		winner: { top: '31%', left: '72%' },
	}
};

function resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id)
{
	const joueurs = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];

	joueurs.forEach(joueur => {
		joueur.style.top = '';
		joueur.style.left = '';
		joueur.style.color = 'white';
	});
}

function updateTournamentState(count, joueur1_id, joueur2_id, joueur3_id, joueur4_id)
{
	resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);

	let match1_winner, match1_loser, match2_winner, match2_loser, match3_winner, match3_loser, 
	match4_winner, match4_loser, match5_winner, match5_loser, match6_winner, match6_loser;

	if (count >= 0) {
		const players = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];
		const positions = Object.values(POSITIONS.round1);
		
		players.forEach((joueur, index) => {
		joueur.style.top = positions[index].top;
		joueur.style.left = positions[index].left;
		joueur.style.color = 'white';
		});
	}

	if (count >= 1)
	{
		console.log('Match 1');
		console.log("round1");
		const player1_wins = getPlayer_1_win();

		if (player1_wins)
		{
			match1_winner = joueur1_id;
			match1_loser = joueur2_id;
		}
		else
		{
			match1_winner = joueur2_id;
			match1_loser = joueur1_id;
		}

		// match1_winner = player1_wins ? joueur1_id : joueur2_id;
		// match1_loser = player1_wins ? joueur2_id : joueur1_id;
		
		match1_winner.style.top = POSITIONS.final.winner1_2.top;
		match1_winner.style.left = POSITIONS.final.winner1_2.left;
		
		match1_loser.style.color = 'red';
	}

	if (count >= 2)
	{
		console.log('Match 2');
		console.log("round2");
		const player1_wins = getPlayer_1_win();

		if (player1_wins)
		{
			match2_winner = joueur3_id;
			match2_loser = joueur4_id;
		}
		else
		{
			match2_winner = joueur4_id;
			match2_loser = joueur3_id;
		}

		// match2_winner = player2_wins ? joueur3_id : joueur4_id;
		// match2_loser = player2_wins ? joueur4_id : joueur3_id;
		
		match2_winner.style.top = POSITIONS.final.winner3_4.top;
		match2_winner.style.left = POSITIONS.final.winner3_4.left;
		
		match2_loser.style.color = 'red';

	}

	if (count >= 3 && match1_winner && match2_winner)
	{
		console.log("final");
		const grand_final_winner_is_semifinal = getPlayer_1_win();

		if (grand_final_winner_is_semifinal)
		{
			match3_winner = match1_winner;
			match3_loser = match2_winner;
		}
		else
		{
			match3_winner = match1_winner;
			match3_loser = match2_winner;
		}
		match3_winner.style.top = POSITIONS.winner_place.winner.top;
		match3_winner.style.left = POSITIONS.winner_place.winner.left;
		match3_winner.style.color = 'yellow';
		match3_loser.style.color = 'red';
	}
}
