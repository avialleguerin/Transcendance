import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import AbstractView from "./AbstractView.js";
import { startTournamentGame } from "../../../srcs/game/gameplay/babylon.js";
import { getPlayer_1_win } from "../../../srcs/game/gameplay/score.js";
import { homeView, StorageKeys } from "../../../api/utils.js";
import { login_tournament } from "../../../api/auth.js";

let count = 0;
let tournamentStarted = false;
let tournament_finished = false;
let tournament_leave = false;
let secondeChance = false;


export default class extends AbstractView {
	private gameLoop: ReturnType<typeof setInterval> | null = null;
	constructor() {
		super();
		this.setTitle("Tournament");
		if (window.location.pathname === "/tournament")
			this.gameLoop = setInterval(() => this.checktournamentstart(), 1000);
		const accessToken: string | null = sessionStorage.getItem('accessToken');
		if (!accessToken || accessToken === undefined)
			homeView();
	}

	async getHtml() {
		return /*html*/`
		<link rel="stylesheet" href="./static/js/css/tournament.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="tournament_view" id="tournament_view">
			<div class="tournament_view-content">
				<h1>TOURNAMENT</h1>
				<button id="start_tournament" form="container_name_player" class="btn_start_tournament">START</button>
				<button id="back_to_menu_view_tournament" class="btn_back_tournament">BACK</button>
				<form class="container_name_player" id="container_name_player"> <!-- onsubmit="login_tournament(event)" -->
					<h1>Connect your opponents</h1>
					<div class="player_section">
						<p>Player 2</p>
						<div class="input-container">
							<label for="player2">Username</label>
							<input type="text" id="tournament-username2" class="input_name_player" placeholder="Username player 2">
						</div>
						<div class="input-container">
							<label for="player2">Password</label>
							<input type="password" id="tournament-password2" class="input_name_player" placeholder="Password player 2">
						</div>
					</div>
					<div class="player_section">
						<p>Player 3</p>
						<div class="input-container">
							<label for="player3">Username</label>
							<input type="text" id="tournament-username3" class="input_name_player" placeholder="Username player 3">
						</div>
						<div class="input-container">
							<label for="player3">Password</label>
							<input type="password" id="tournament-password3" class="input_name_player" placeholder="Password player 3">
						</div>
					</div>
					<div class="player_section">
						<p>Player 4</p>
						<div class="input-container">
							<label for="player4">Username</label>
							<input type="text" id="tournament-username4" class="input_name_player" placeholder="Username Player 4">
						</div>
						<div class="input-container">
							<label for="player4">Password</label>
							<input type="password" id="tournament-password4" class="input_name_player" placeholder="Password player 4">
						</div>
					</div>
				</form>
				<div class="tournament_graphic" id="tournament_graphic_id">
					<p class="winnerBracket" id="winnerBracket_id">Winner Bracket</p>
					<p class="loserBracket" id="loserBracket_id">Loser Bracket</p>
					<p class="joueur1" id="Player1">${StorageKeys.PLAYER1}</p>
					<p class="joueur2" id="Player2">${StorageKeys.PLAYER2}</p>
					<p class="joueur3" id="Player3">${StorageKeys.PLAYER3}</p>
					<p class="joueur4" id="Player4">${StorageKeys.PLAYER4}</p>
					<img src="../../../srcs/game/assets/image/tournament_with_bracket.svg" alt="tournament">
					<a id="start_game" class="btn_start_game" href="/tournament-game" data-link>JOUER</a>
					<button id="leave_tournament" class="btn_leave_tournament">X</button>
				</div>
				<div class="message" id="message_id">
					<p>WARNING: If you leave the tournament, you cannot go back.</p>
					<button class="close_message" id="close_message_id">X</button>
					<button class="comfirm_leave_tournament" id="confirm_leave_tournament">Leave Tournament</button>
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
		const backBtn = document.getElementById('back_to_menu_view_tournament');
		backBtn?.addEventListener('click', () => {
			handleViewTransitions('vue2', 'tournament');
			window.history.back();
		});
	}

	start_tournament_game() {
		const startBtn = document.getElementById('start_game');
		startBtn?.addEventListener('click', () => {
			handleViewTransitions('tournament_game_start', 'tournament');
			startTournamentGame();
			count = StorageKeys.TOURNAMENT_COUNT;
			StorageKeys.TOURNAMENT_COUNT = count;
			StorageKeys.CAN_PLAY = true;
			console.log("canPlay set to true");

			const Player1 = document.getElementById('Player1') as PlayerElement;
			const Player2 = document.getElementById('Player2') as PlayerElement;
			const Player3 = document.getElementById('Player3') as PlayerElement;
			const Player4 = document.getElementById('Player4') as PlayerElement;
			
			if (Player1 && Player2 && Player3 && Player4) {
				updateTournamentState(count, Player1, Player2, Player3, Player4);
			}
			
			StorageKeys.SECOND_CHANCE = true;
			
			const tournamentFinishedFlag = StorageKeys.TOURNAMENT_FINISHED === true;

			
			if (tournamentFinishedFlag) {
				const finishedGameElement = document.getElementById('finiched_game');
				if (finishedGameElement) finishedGameElement.style.display = 'block';
				tournament_finished = true;
				StorageKeys.SECOND_CHANCE = false;
				secondeChance = false;
			}
		});
	}

	init_tournament() {
		const Player1 = document.getElementById('Player1') as PlayerElement;
		const Player2 = document.getElementById('Player2') as PlayerElement;
		const Player3 = document.getElementById('Player3') as PlayerElement;
		const Player4 = document.getElementById('Player4') as PlayerElement;

		StorageKeys.SECOND_CHANCE = true;
		count = StorageKeys.TOURNAMENT_COUNT;
		
		if (Player1 && Player2 && Player3 && Player4) {
			updateTournamentState(count, Player1, Player2, Player3, Player4);
		}
		

		const maxCount = secondeChance ? 7 : 6;
		if (count >= maxCount) {
			const endContainer = document.getElementById('container_endTournament');
			const graphic = document.getElementById('tournament_graphic_id');
			if (endContainer && graphic) {
				endContainer.classList.add('active');
				graphic.classList.remove('active');
			}
			tournament_finished = true;
			StorageKeys.TOURNAMENT_FINISHED = tournament_finished;
		}
	}


	tournament_event() {
		const start_tournament = document.getElementById('start_tournament');
		const container_name_player = document.getElementById('container_name_player');
		const tournament_graphic_id = document.getElementById('tournament_graphic_id');
		const back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');
		const finish_tournament = document.getElementById('finiched_game');

		const leave_tournament = document.getElementById('leave_tournament');
		const message_id = document.getElementById('message_id');


        
        container_name_player?.addEventListener('submit', async (event) => { await login_tournament(event); });

		leave_tournament?.addEventListener('click', () => {
			message_id?.classList.add('active');
			if (tournament_graphic_id) {
				tournament_graphic_id.style.filter = "blur(5px)";
				tournament_graphic_id.style.pointerEvents = "none";
			}
		});

		const close_message = document.getElementById('close_message_id');

		close_message?.addEventListener('click', () => {
			message_id?.classList.remove('active');
			if (tournament_graphic_id) {
				tournament_graphic_id.style.filter = "none";
				tournament_graphic_id.style.pointerEvents = "auto";
			}
		});

		const confirm_leave_tournament = document.getElementById('confirm_leave_tournament');
		const Player1 = document.getElementById('Player1') as PlayerElement;
		const Player2 = document.getElementById('Player2') as PlayerElement;
		const Player3 = document.getElementById('Player3') as PlayerElement;
		const Player4 = document.getElementById('Player4') as PlayerElement;

		confirm_leave_tournament?.addEventListener('click', () => {
			message_id?.classList.remove('active');
			if (tournament_graphic_id) {
				tournament_graphic_id.style.filter = "none";
				tournament_graphic_id.style.pointerEvents = "auto";
				tournament_graphic_id.classList.remove('active');
			}
			container_name_player?.classList.remove('hidden');
			tournamentStarted = false;
			StorageKeys.TOURNAMENT_STARTED = false;
			
			if (Player1 && Player2 && Player3 && Player4) {
				resetHighlight([Player1, Player2, Player3, Player4]);
				resetTournamentState(Player1, Player2, Player3, Player4);
			}
			
			if (back_to_menu_view_tournament) back_to_menu_view_tournament.style.display = 'block';
			if (start_tournament) start_tournament.style.display = 'block';
			count = 0;
			StorageKeys.TOURNAMENT_COUNT = count;
		});

		finish_tournament?.addEventListener('click', () => {
			tournament_graphic_id?.classList.remove('active');
			container_name_player?.classList.remove('hidden');
			const container_endTournament = document.getElementById('container_endTournament');
			container_endTournament?.classList.remove('active');
			tournamentStarted = false;
			tournament_finished = false;
			tournament_leave = true;
			StorageKeys.TOURNAMENT_STARTED = false;

			if (Player1 && Player2 && Player3 && Player4) {
				resetHighlight([Player1, Player2, Player3, Player4]);
				resetTournamentState(Player1, Player2, Player3, Player4);
			}

			if (back_to_menu_view_tournament) back_to_menu_view_tournament.style.display = 'block';
			if (start_tournament) start_tournament.style.display = 'block';
			count = 0;
		});
	}

	checktournamentstart()
	{
		if (window.location.pathname === "/tournament")
		{
			const container_name_player = document.getElementById('container_name_player');
			const tournament_graphic_id = document.getElementById('tournament_graphic_id');
			const start_tournament = document.getElementById('start_tournament');
			const back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');
			const container_endTournament = document.getElementById('container_endTournament');

			if (!container_name_player || !tournament_graphic_id || !start_tournament || !back_to_menu_view_tournament) {
				return;
			}
			
			if (StorageKeys.TOURNAMENT_STARTED == true && tournament_finished == false) {
				container_name_player.classList.add('hidden');
				tournament_graphic_id.classList.add('active');
				start_tournament.style.display = 'none';
				back_to_menu_view_tournament.style.display = 'none';
			}
			if (tournament_finished == true) {
				container_name_player?.classList.add('hidden');
				tournament_graphic_id?.classList.remove('active');
				if (start_tournament) start_tournament.style.display = 'none';
				if (back_to_menu_view_tournament) back_to_menu_view_tournament.style.display = 'none';
				container_endTournament?.classList.add('active');
			}
			else if (tournament_leave == true) {
				if (container_name_player?.classList.contains('hidden')) {
					container_name_player.classList.remove('hidden');
					tournament_graphic_id?.classList.remove('active');
					if (start_tournament) start_tournament.style.display = 'block';
					if (back_to_menu_view_tournament) back_to_menu_view_tournament.style.display = 'block';
					container_endTournament?.classList.remove('active');
					tournament_leave = false;
				}
			}
		}
		console.log("Checking tournament start... Count: " + count + ", Tournament Started: " + StorageKeys.TOURNAMENT_STARTED + ", Tournament Finished: " + StorageKeys.TOURNAMENT_FINISHED);
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
		winner1_2: { top: '11.7%', left: '33.5%' },
		loser1_2: { top: '61%', left: '20%' },
		winner3_4: { top: '31.7%', left: '33.5%' },
		loser3_4: { top: '70%', left: '20%' },
	},
	quart_loser: {
		winner: { top: '65.5%', left: '33.7%' },
	},
	demi_winer: {
		winner: { top: '33.5%', left: '55.9%' },
		loser: { top: '74.5%', left: '33.7%' },
	},
	demi_loser: {
		winner: { top: '42.5%', left: '55.9%' },
	},
	grande_final:
	{
		winner: { top: '38%', left: '69.9%' },
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

export function resetTournamentState(Player1: PlayerElement, Player2: PlayerElement, Player3: PlayerElement, Player4: PlayerElement): void {    
	const joueurs: PlayerElement[] = [Player1, Player2, Player3, Player4];

	StorageKeys.MATCH_RESULT1 = "";
	StorageKeys.MATCH_RESULT2 = "";
	StorageKeys.MATCH_RESULT3 = "";
	StorageKeys.MATCH_RESULT4 = "";
	StorageKeys.MATCH_RESULT5 = "";
	StorageKeys.MATCH_RESULT6 = "";
	StorageKeys.MATCH_RESULT7 = "";

	// Reset tournament rankings
	StorageKeys.TOURNAMENT_FIRST_PLACE = "";
	StorageKeys.TOURNAMENT_SECOND_PLACE = "";
	StorageKeys.TOURNAMENT_THIRD_PLACE = "";
	StorageKeys.TOURNAMENT_FOURTH_PLACE = "";

	StorageKeys.TOURNAMENT_COUNT = 0;
	StorageKeys.TOURNAMENT_STARTED = false;
	StorageKeys.TOURNAMENT_FINISHED = false;
	StorageKeys.SECOND_CHANCE = false;

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
	Player1: PlayerElement,
	Player2: PlayerElement,
	Player3: PlayerElement,
	Player4: PlayerElement
): void {
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
		match6_loser: PlayerElement | undefined,
		match7_winner: PlayerElement | undefined,
		match7_loser: PlayerElement | undefined;


	if (count >= 0) {
		const players: PlayerElement[] = [Player1, Player2, Player3, Player4];
		const positions = Object.values(POSITIONS.round1);

		players.forEach((joueur, index) => {
			joueur.style.top = positions[index].top;
			joueur.style.left = positions[index].left;
			resetHighlight([joueur]);
		});

		highlightNextPlayers(Player1, Player2);
		StorageKeys.CURRENT_PLAYER1 = Player1.textContent || "";
		StorageKeys.CURRENT_PLAYER2 = Player2.textContent || "";
	}

	if (count >= 1) {
		resetHighlight([Player1, Player2]);

		const match1_result = StorageKeys.MATCH_RESULT1;


		if (match1_result) {
			const { winner, loser } = JSON.parse(match1_result);
			
			match1_winner = document.getElementById(winner) as PlayerElement;
			match1_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const player1_wins = getPlayer_1_win();
			match1_winner = player1_wins ? Player1 : Player2;
			match1_loser = player1_wins ? Player2 : Player1;

			StorageKeys.MATCH_RESULT1 = JSON.stringify({
				winner: match1_winner.id,
				loser: match1_loser.id
			});
		}

		if (match1_winner && match1_loser) {
			match1_winner.style.top = POSITIONS.quart_winner.winner1_2.top;
			match1_winner.style.left = POSITIONS.quart_winner.winner1_2.left;
			match1_loser.style.top = POSITIONS.quart_winner.loser1_2.top;
			match1_loser.style.left = POSITIONS.quart_winner.loser1_2.left;
			highlightNextPlayers(Player3, Player4);
			StorageKeys.CURRENT_PLAYER1 = Player3.textContent || "";
			StorageKeys.CURRENT_PLAYER2 = Player4.textContent || "";
		}
	}

	if (count >= 2) {
		resetHighlight([Player3, Player4]);
		const match2_result = StorageKeys.MATCH_RESULT2;

		if (match2_result) {
			const { winner, loser } = JSON.parse(match2_result);
			match2_winner = document.getElementById(winner) as PlayerElement;
			match2_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const player1_wins = getPlayer_1_win();
			match2_winner = player1_wins ? Player3 : Player4;
			match2_loser = player1_wins ? Player4 : Player3;

			StorageKeys.MATCH_RESULT2 = JSON.stringify({
				winner: match2_winner.id,
				loser: match2_loser.id
			});
		}

		if (match2_winner && match2_loser) {
			match2_winner.style.top = POSITIONS.quart_winner.winner3_4.top;
			match2_winner.style.left = POSITIONS.quart_winner.winner3_4.left;
			match2_loser.style.top = POSITIONS.quart_winner.loser3_4.top;
			match2_loser.style.left = POSITIONS.quart_winner.loser3_4.left;

			highlightNextPlayers(match1_loser, match2_loser);
			StorageKeys.CURRENT_PLAYER1 = match1_loser?.textContent || "";
			StorageKeys.CURRENT_PLAYER2 = match2_loser?.textContent || "";
		}
	}

	if (count >= 3 && match1_loser && match2_loser) {
		resetHighlight([match1_loser, match2_loser]);
		const match3_result = StorageKeys.MATCH_RESULT3;

		if (match3_result) {
			const { winner, loser } = JSON.parse(match3_result);
			match3_winner = document.getElementById(winner) as PlayerElement;
			match3_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const winnerIsFirst = getPlayer_1_win();
			match3_winner = winnerIsFirst ? match1_loser : match2_loser;
			match3_loser = winnerIsFirst ? match2_loser : match1_loser;

			StorageKeys.MATCH_RESULT3 = JSON.stringify({
				winner: match3_winner.id,
				loser: match3_loser.id
			});
		}

		if (match3_winner && match3_loser) {
			match3_winner.style.top = POSITIONS.quart_loser.winner.top;
			match3_winner.style.left = POSITIONS.quart_loser.winner.left;
			match3_loser.style.color = 'red';
			highlightNextPlayers(match1_winner, match2_winner);
			StorageKeys.CURRENT_PLAYER1 = match1_winner?.textContent || "";
			StorageKeys.CURRENT_PLAYER2 = match2_winner?.textContent || "";
		}
	}

	if (count >= 4 && match1_winner && match2_winner) {
		resetHighlight([match1_winner, match2_winner]);
		const match4_result = StorageKeys.MATCH_RESULT4;

		if (match4_result) {
			const { winner, loser } = JSON.parse(match4_result);
			match4_winner = document.getElementById(winner) as PlayerElement;
			match4_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const winnerIsFirst = getPlayer_1_win();
			match4_winner = winnerIsFirst ? match1_winner : match2_winner;
			match4_loser = winnerIsFirst ? match2_winner : match1_winner;

			StorageKeys.MATCH_RESULT4 = JSON.stringify({
				winner: match4_winner.id,
				loser: match4_loser.id
			});
		}

		if (match4_winner && match4_loser) {
			match4_winner.style.top = POSITIONS.demi_winer.winner.top;
			match4_winner.style.left = POSITIONS.demi_winer.winner.left;

			match4_loser.style.top = POSITIONS.demi_winer.loser.top;
			match4_loser.style.left = POSITIONS.demi_winer.loser.left;

			highlightNextPlayers(match3_winner, match4_loser);
			StorageKeys.CURRENT_PLAYER1 = match3_winner?.textContent || "";
			StorageKeys.CURRENT_PLAYER2 = match4_loser?.textContent || "";
		}
	}

	if (count >= 5 && match3_winner && match4_loser) {
		resetHighlight([match3_winner, match4_loser]);
		const match5_result = StorageKeys.MATCH_RESULT5;

		if (match5_result) {
			const { winner, loser } = JSON.parse(match5_result);
			match5_winner = document.getElementById(winner) as PlayerElement;
			match5_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const winnerIsFirst = getPlayer_1_win();
			match5_winner = winnerIsFirst ? match3_winner : match4_loser;
			match5_loser = winnerIsFirst ? match4_loser : match3_winner;

			StorageKeys.MATCH_RESULT5 = JSON.stringify({
				winner: match5_winner.id,
				loser: match5_loser.id
			});
		}

		if (match5_winner && match5_loser) {
			match5_winner.style.top = POSITIONS.demi_loser.winner.top;
			match5_winner.style.left = POSITIONS.demi_loser.winner.left;

			match5_loser.style.color = 'red';
			highlightNextPlayers(match4_winner, match5_winner);
			StorageKeys.CURRENT_PLAYER1 = match4_winner?.textContent || "";
			StorageKeys.CURRENT_PLAYER2 = match5_winner?.textContent || "";
		}
	}

	if (count >= 6 && match4_winner && match5_winner) {
		resetHighlight([match4_winner, match5_winner]);
		const match6_result = StorageKeys.MATCH_RESULT6;

		if (match6_result) {
			const { winner, loser } = JSON.parse(match6_result);
			match6_winner = document.getElementById(winner) as PlayerElement;
			match6_loser = document.getElementById(loser) as PlayerElement;
		} else {
			const winnerIsFirst = getPlayer_1_win();
			match6_winner = winnerIsFirst ? match4_winner : match5_winner;
			match6_loser = winnerIsFirst ? match5_winner : match4_winner;

			StorageKeys.MATCH_RESULT6 = JSON.stringify({
				winner: match6_winner.id,
				loser: match6_loser.id
			});
		}

		if (match6_winner && match6_loser) {
			if (match6_winner.id === match5_winner.id) {
				secondeChance = true;
				
				StorageKeys.SECOND_CHANCE = true;
				StorageKeys.TOURNAMENT_FINISHED = false;
				tournament_finished = false;

				match6_winner.style.top = POSITIONS.demi_loser.winner.top;
				match6_winner.style.left = POSITIONS.demi_loser.winner.left;
				match6_loser.style.top = POSITIONS.demi_winer.winner.top;
				match6_loser.style.left = POSITIONS.demi_winer.winner.left;
				
				highlightNextPlayers(match6_loser, match6_winner);
			}
			else if (match6_winner.id === match4_winner.id) {
				match6_winner.style.top = POSITIONS.grande_final.winner.top;
				match6_winner.style.left = POSITIONS.grande_final.winner.left;
				match6_loser.style.color = 'red';
				
				tournament_finished = true;
				StorageKeys.TOURNAMENT_FINISHED = tournament_finished;
				secondeChance = false;
				StorageKeys.SECOND_CHANCE = false;

				// Store final rankings
				StorageKeys.TOURNAMENT_FIRST_PLACE = match6_winner?.textContent || "";
				StorageKeys.TOURNAMENT_SECOND_PLACE = match6_loser?.textContent || "";
				StorageKeys.TOURNAMENT_THIRD_PLACE = match5_loser?.textContent || "";
				StorageKeys.TOURNAMENT_FOURTH_PLACE = match3_loser?.textContent || "";

				document.getElementById('first_place_name_id')!.textContent = StorageKeys.TOURNAMENT_FIRST_PLACE;
				document.getElementById('second_place_name_id')!.textContent = StorageKeys.TOURNAMENT_SECOND_PLACE;
				document.getElementById('third_place_name_id')!.textContent = StorageKeys.TOURNAMENT_THIRD_PLACE;
			}
		}
	}

	if (count >= 7 && secondeChance && match4_winner && match5_winner) {
		const match4_result = StorageKeys.MATCH_RESULT4;
		const match5_result = StorageKeys.MATCH_RESULT5;
		
		if (match4_result && match5_result) {
			const match4_data = JSON.parse(match4_result);
			const match5_data = JSON.parse(match5_result);
			
			const finalMatch4Winner = document.getElementById(match4_data.winner) as PlayerElement;
			const finalMatch5Winner = document.getElementById(match5_data.winner) as PlayerElement;
			
			resetHighlight([finalMatch4Winner, finalMatch5Winner]);
			
			const match7_result = StorageKeys.MATCH_RESULT7;

			if (match7_result) {
				const { winner, loser } = JSON.parse(match7_result);
				match7_winner = document.getElementById(winner) as PlayerElement;
				match7_loser = document.getElementById(loser) as PlayerElement;
			} else {
				const winnerIsFirst = getPlayer_1_win();
				match7_winner = winnerIsFirst ? finalMatch4Winner : finalMatch5Winner;
				match7_loser = winnerIsFirst ? finalMatch5Winner : finalMatch4Winner;

				StorageKeys.MATCH_RESULT7 = JSON.stringify({
					winner: match7_winner.id,
					loser: match7_loser.id
				});
			}

			if (match7_winner && match7_loser) {
				match7_winner.style.top = POSITIONS.grande_final.winner.top;
				match7_winner.style.left = POSITIONS.grande_final.winner.left;
				match7_loser.style.color = 'red';
				
				tournament_finished = true;
				StorageKeys.TOURNAMENT_FINISHED = tournament_finished;
				secondeChance = false;
				StorageKeys.SECOND_CHANCE = false;
				
				// Store final rankings for second chance scenario
				StorageKeys.TOURNAMENT_FIRST_PLACE = match7_winner.textContent || '';
				StorageKeys.TOURNAMENT_SECOND_PLACE = match7_loser.textContent || '';
				StorageKeys.TOURNAMENT_THIRD_PLACE = match5_loser?.textContent || '';
				StorageKeys.TOURNAMENT_FOURTH_PLACE = match3_loser?.textContent || '';

				document.getElementById('first_place_name_id')!.textContent = StorageKeys.TOURNAMENT_FIRST_PLACE;
				document.getElementById('second_place_name_id')!.textContent = StorageKeys.TOURNAMENT_SECOND_PLACE;
				document.getElementById('third_place_name_id')!.textContent = StorageKeys.TOURNAMENT_THIRD_PLACE;
			}
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