import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import AbstractView from "./AbstractView.js";
import { startTournamentGame } from "../../../srcs/game/gameplay/babylon.js";
import { getPlayer_1_win } from "../../../srcs/game/gameplay/score.js";
let count = 0;
let tournamentStarted = false;
let tournament_finished = false;
let tournament_leave = false;
let secondeChance = false; // Variable pour la seconde chance
export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Tournament");
        if (window.location.pathname === "/tournament") {
            this.gameLoop = setInterval(() => this.checktournamentstart(), 1000);
        }
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken || accessToken === undefined) {
            history.pushState({}, '', '/');
            import('./Home.js').then((module) => {
                const Home = module.default;
                const homeInstance = new Home();
                homeInstance.getHtml().then((html) => {
                    const appElement = document.getElementById('app');
                    if (appElement) {
                        appElement.innerHTML = html;
                        if (homeInstance.createAccount && typeof homeInstance.createAccount === 'function') {
                            homeInstance.createAccount();
                        }
                    }
                });
            });
        }
        // tournamentStarted = localStorage.getItem('tournamentStarted') === 'true';
    }
    async getHtml() {
        return /*html*/ `
		<link rel="stylesheet" href="./static/js/css/tournament.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="tournament_view" id="tournament_view">
			<div class="tournament_view-content">
				<h1>TOURNAMENT</h1>
				<button id="start_tournament" form="container_name_player" class="btn_start_tournament">START</button>
				<button id="back_to_menu_view_tournament" class="btn_back_tournament">BACK</button>
				<form class="container_name_player" id="container_name_player" onsubmit="login_tournament(event)">
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
					<p class="joueur1" id="Player1">${localStorage.getItem('Player1')}</p>
					<p class="joueur2" id="Player2">${localStorage.getItem('Player2')}</p>
					<p class="joueur3" id="Player3">${localStorage.getItem('Player3')}</p>
					<p class="joueur4" id="Player4">${localStorage.getItem('Player4')}</p>
					<img src="../../../srcs/game/assets/image/tournament_with_bracket.svg" alt="tournament">
					<a id="start_game" class="btn_start_game" href="/tournament_game" data-link>JOUER</a>
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
    exit_tournament() {
        document.getElementById('back_to_menu_view_tournament').addEventListener('click', () => {
            handleViewTransitions('vue2', 'tournament');
            window.history.back();
        });
    }
    start_tournament_game() {
        document.getElementById('start_game').addEventListener('click', () => {
            handleViewTransitions('tournament_game_start', 'tournament');
            startTournamentGame();
            count = parseInt(localStorage.getItem('tournamentCount')) || 0;
            // count++;
            localStorage.setItem('tournamentCount', count.toString());
            console.log(`Match ${count} terminé.`);
            // Récupérer les éléments joueurs pour updateTournamentState
            const Player1 = document.getElementById('Player1');
            const Player2 = document.getElementById('Player2');
            const Player3 = document.getElementById('Player3');
            const Player4 = document.getElementById('Player4');
            // Mettre à jour l'état du tournoi AVANT de vérifier la fin
            updateTournamentState(count, Player1, Player2, Player3, Player4);
            // Maintenant récupérer l'état de la seconde chance (potentiellement mis à jour)
            secondeChance = localStorage.getItem('secondChance') === 'true';
            // Vérifier si le tournoi est marqué comme terminé
            const tournamentFinishedFlag = localStorage.getItem('tournament_finished') === 'true';
            console.log(`SecondChance: ${secondeChance}, TournamentFinished: ${tournamentFinishedFlag}`);
            // Afficher la fin du tournoi seulement si explicitement marqué comme terminé
            if (tournamentFinishedFlag) {
                document.getElementById('finiched_game').style.display = 'block';
                tournament_finished = true;
                // Réinitialiser la seconde chance après le tournoi
                localStorage.removeItem('secondChance');
                secondeChance = false;
            }
        });
    }
    // Fonction d'initialisation du tournoi
    init_tournament() {
        const Player1 = document.getElementById('Player1');
        const Player2 = document.getElementById('Player2');
        const Player3 = document.getElementById('Player3');
        const Player4 = document.getElementById('Player4');
        // Récupérer l'état depuis localStorage
        secondeChance = localStorage.getItem('secondChance') === 'true';
        count = parseInt(localStorage.getItem('tournamentCount')) || 0;
        console.log(`Init tournament - Count: ${count}, SecondChance: ${secondeChance}`);
        updateTournamentState(count, Player1, Player2, Player3, Player4);
        const maxCount = secondeChance ? 7 : 6;
        if (count >= maxCount) {
            const endContainer = document.getElementById('container_endTournament');
            const graphic = document.getElementById('tournament_graphic_id');
            if (endContainer && graphic) {
                endContainer.classList.add('active');
                graphic.classList.remove('active');
            }
            tournament_finished = true;
            localStorage.setItem('tournament_finished', 'true');
        }
    }
    tournament_event() {
        const start_tournament = document.getElementById('start_tournament');
        const container_name_player = document.getElementById('container_name_player');
        const tournament_graphic_id = document.getElementById('tournament_graphic_id');
        const back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');
        const finish_tournament = document.getElementById('finiched_game');
        // start_tournament.addEventListener('click', () => {
        // tournamentStarted = true;
        // localStorage.setItem('tournamentStarted', tournamentStarted.toString());
        // container_name_player.classList.add('hidden');
        // tournament_graphic_id.classList.add('active');
        // start_tournament.style.display = 'none';
        // back_to_menu_view_tournament.style.display = 'none';
        // Mettre en surbrillance les joueurs initiaux
        // if (localStorage.getItem("tournamentStarted") === 'true') {
        // 	highlightNextPlayers(Player1, Player2);
        // 	localStorage.setItem("current_player1", localStorage.getItem('Player1'));
        // 	localStorage.setItem("current_player2", localStorage.getItem('Player2'));
        // }
        // localStorage.setItem("current_player1", localStorage.getItem('Player1'));
        // localStorage.setItem("current_player2", localStorage.getItem('Player2'));
        // });
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
        const Player1 = document.getElementById('Player1');
        const Player2 = document.getElementById('Player2');
        const Player3 = document.getElementById('Player3');
        const Player4 = document.getElementById('Player4');
        confirm_leave_tournament.addEventListener('click', () => {
            message_id.classList.remove('active');
            tournament_graphic_id.style.filter = "none";
            tournament_graphic_id.style.pointerEvents = "auto";
            tournament_graphic_id.classList.remove('active');
            container_name_player.classList.remove('hidden');
            tournamentStarted = false;
            localStorage.setItem('tournamentStarted', tournamentStarted.toString());
            // Réinitialiser les styles des joueurs
            resetHighlight([Player1, Player2, Player3, Player4]);
            resetTournamentState(Player1, Player2, Player3, Player4);
            back_to_menu_view_tournament.style.display = 'block';
            start_tournament.style.display = 'block';
            count = 0;
            localStorage.setItem('tournamentCount', count.toString());
        });
        finish_tournament.addEventListener('click', () => {
            tournament_graphic_id.classList.remove('active');
            const player1 = localStorage.getItem('Player1');
            const profile_picture = localStorage.getItem('profile_picture');
            localStorage.clear();
            localStorage.setItem('Player1', player1);
            localStorage.setItem('profile_picture', profile_picture);
            container_name_player.classList.remove('hidden');
            const container_endTournament = document.getElementById('container_endTournament');
            container_endTournament.classList.remove('active');
            tournamentStarted = false;
            tournament_finished = false;
            tournament_leave = true;
            localStorage.setItem('tournamentStarted', tournamentStarted.toString());
            // Réinitialiser les styles des joueurs
            resetHighlight([Player1, Player2, Player3, Player4]);
            resetTournamentState(Player1, Player2, Player3, Player4);
            back_to_menu_view_tournament.style.display = 'block';
            start_tournament.style.display = 'block';
            count = 0;
        });
    }
    checktournamentstart() {
        if (window.location.pathname === "/tournament") {
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
            if (localStorage.getItem("tournamentStarted") == 'true' && tournament_finished == false) {
                container_name_player.classList.add('hidden');
                tournament_graphic_id.classList.add('active');
                start_tournament.style.display = 'none';
                back_to_menu_view_tournament.style.display = 'none';
            }
            if (tournament_finished == true) {
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
const POSITIONS = {
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
    grande_final: {
        winner: { top: '38%', left: '69.9%' },
    },
};
function resetTournamentState(Player1, Player2, Player3, Player4) {
    const joueurs = [Player1, Player2, Player3, Player4];
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
    localStorage.removeItem("secondChance");
    // Réinitialiser les positions des joueurs
    joueurs.forEach(joueur => {
        joueur.style.top = '';
        joueur.style.left = '';
        joueur.style.color = 'white';
    });
}
function updateTournamentState(count, Player1, Player2, Player3, Player4) {
    console.log('Count:', count);
    let match1_winner, match1_loser, match2_winner, match2_loser, match3_winner, match3_loser, match4_winner, match4_loser, match5_winner, match5_loser, match6_winner, match6_loser, match7_winner, match7_loser;
    if (count >= 0) {
        const players = [Player1, Player2, Player3, Player4];
        const positions = Object.values(POSITIONS.round1);
        players.forEach((joueur, index) => {
            joueur.style.top = positions[index].top;
            joueur.style.left = positions[index].left;
            resetHighlight([joueur]);
        });
        highlightNextPlayers(Player1, Player2);
        localStorage.setItem("current_player1", Player1.textContent);
        localStorage.setItem("current_player2", Player2.textContent);
    }
    if (count >= 1) {
        resetHighlight([Player1, Player2]);
        const match1_result = localStorage.getItem("match1_result");
        if (match1_result) {
            const { winner, loser } = JSON.parse(match1_result);
            match1_winner = document.getElementById(winner);
            match1_loser = document.getElementById(loser);
        }
        else {
            const player1_wins = getPlayer_1_win();
            match1_winner = player1_wins ? Player1 : Player2;
            match1_loser = player1_wins ? Player2 : Player1;
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
            highlightNextPlayers(Player3, Player4);
            localStorage.setItem("current_player1", Player3.textContent);
            localStorage.setItem("current_player2", Player4.textContent);
        }
    }
    if (count >= 2) {
        resetHighlight([Player3, Player4]);
        const match2_result = localStorage.getItem("match2_result");
        if (match2_result) {
            const { winner, loser } = JSON.parse(match2_result);
            match2_winner = document.getElementById(winner);
            match2_loser = document.getElementById(loser);
        }
        else {
            const player1_wins = getPlayer_1_win();
            match2_winner = player1_wins ? Player3 : Player4;
            match2_loser = player1_wins ? Player4 : Player3;
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
            highlightNextPlayers(match1_loser, match2_loser);
            localStorage.setItem("current_player1", match1_loser.textContent);
            localStorage.setItem("current_player2", match2_loser.textContent);
        }
    }
    if (count >= 3 && match1_loser && match2_loser) {
        resetHighlight([match1_loser, match2_loser]);
        const match3_result = localStorage.getItem("match3_result");
        if (match3_result) {
            const { winner, loser } = JSON.parse(match3_result);
            match3_winner = document.getElementById(winner);
            match3_loser = document.getElementById(loser);
        }
        else {
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
            highlightNextPlayers(match1_winner, match2_winner);
            localStorage.setItem("current_player1", match1_winner.textContent);
            localStorage.setItem("current_player2", match2_winner.textContent);
        }
    }
    if (count >= 4 && match1_winner && match2_winner) {
        resetHighlight([match1_winner, match2_winner]);
        const match4_result = localStorage.getItem("match4_result");
        if (match4_result) {
            const { winner, loser } = JSON.parse(match4_result);
            match4_winner = document.getElementById(winner);
            match4_loser = document.getElementById(loser);
        }
        else {
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
            highlightNextPlayers(match3_winner, match4_loser);
            localStorage.setItem("current_player1", match3_winner.textContent);
            localStorage.setItem("current_player2", match4_loser.textContent);
        }
    }
    if (count >= 5 && match3_winner && match4_loser) {
        resetHighlight([match3_winner, match4_loser]);
        const match5_result = localStorage.getItem("match5_result");
        if (match5_result) {
            const { winner, loser } = JSON.parse(match5_result);
            match5_winner = document.getElementById(winner);
            match5_loser = document.getElementById(loser);
        }
        else {
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
            highlightNextPlayers(match4_winner, match5_winner);
            localStorage.setItem("current_player1", match4_winner.textContent);
            localStorage.setItem("current_player2", match5_winner.textContent);
        }
    }
    if (count >= 6 && match4_winner && match5_winner) {
        resetHighlight([match4_winner, match5_winner]);
        const match6_result = localStorage.getItem("match6_result");
        if (match6_result) {
            const { winner, loser } = JSON.parse(match6_result);
            match6_winner = document.getElementById(winner);
            match6_loser = document.getElementById(loser);
        }
        else {
            const winnerIsFirst = getPlayer_1_win();
            match6_winner = winnerIsFirst ? match4_winner : match5_winner;
            match6_loser = winnerIsFirst ? match5_winner : match4_winner;
            localStorage.setItem("match6_result", JSON.stringify({
                winner: match6_winner.id,
                loser: match6_loser.id
            }));
        }
        if (match6_winner && match6_loser) {
            if (match6_winner.id === match5_winner.id) {
                console.log("Le joueur du losers bracket a gagné ! Seconde chance activée !");
                secondeChance = true;
                localStorage.setItem('secondChance', 'true');
                localStorage.removeItem('tournament_finished');
                tournament_finished = false;
                match6_winner.style.top = POSITIONS.demi_loser.winner.top;
                match6_winner.style.left = POSITIONS.demi_loser.winner.left;
                match6_loser.style.top = POSITIONS.demi_winer.winner.top;
                match6_loser.style.left = POSITIONS.demi_winer.winner.left;
                highlightNextPlayers(match6_loser, match6_winner);
            }
            else if (match6_winner.id === match4_winner.id) {
                console.log("Le joueur du winners bracket a gagné ! Tournoi terminé !");
                match6_winner.style.top = POSITIONS.grande_final.winner.top;
                match6_winner.style.left = POSITIONS.grande_final.winner.left;
                match6_loser.style.color = 'red';
                tournament_finished = true;
                localStorage.setItem('tournament_finished', 'true');
                secondeChance = false;
                localStorage.removeItem('secondChance');
                document.getElementById('first_place_name_id').textContent = localStorage.getItem(match6_winner.id);
                document.getElementById('second_place_name_id').textContent = localStorage.getItem(match6_loser.id);
                document.getElementById('third_place_name_id').textContent = localStorage.getItem(match5_loser.id);
            }
        }
    }
    // Match 7 - Grande finale (bracket reset)
    if (count >= 7 && secondeChance && match4_winner && match5_winner) {
        console.log("Match 7 - Grande finale avec bracket reset");
        // Récupérer les joueurs depuis les résultats précédents
        const match4_result = localStorage.getItem("match4_result");
        const match5_result = localStorage.getItem("match5_result");
        if (match4_result && match5_result) {
            const match4_data = JSON.parse(match4_result);
            const match5_data = JSON.parse(match5_result);
            const finalMatch4Winner = document.getElementById(match4_data.winner);
            const finalMatch5Winner = document.getElementById(match5_data.winner);
            resetHighlight([finalMatch4Winner, finalMatch5Winner]);
            const match7_result = localStorage.getItem("match7_result");
            if (match7_result) {
                const { winner, loser } = JSON.parse(match7_result);
                match7_winner = document.getElementById(winner);
                match7_loser = document.getElementById(loser);
            }
            else {
                const winnerIsFirst = getPlayer_1_win();
                match7_winner = winnerIsFirst ? finalMatch4Winner : finalMatch5Winner;
                match7_loser = winnerIsFirst ? finalMatch5Winner : finalMatch4Winner;
                localStorage.setItem("match7_result", JSON.stringify({
                    winner: match7_winner.id,
                    loser: match7_loser.id
                }));
            }
            if (match7_winner && match7_loser) {
                match7_winner.style.top = POSITIONS.grande_final.winner.top;
                match7_winner.style.left = POSITIONS.grande_final.winner.left;
                match7_loser.style.color = 'red';
                console.log("Tournoi terminé après le match 7 !");
                tournament_finished = true;
                localStorage.setItem('tournament_finished', 'true');
                secondeChance = false;
                localStorage.removeItem('secondChance');
                document.getElementById('first_place_name_id').textContent = localStorage.getItem(match7_winner.id);
                document.getElementById('second_place_name_id').textContent = localStorage.getItem(match7_loser.id);
                document.getElementById('third_place_name_id').textContent = localStorage.getItem(match5_loser.id);
            }
        }
    }
}
/**
 * Détermine le gagnant et le perdant d'un match.
 */
function determineMatchResult(player1Wins, player1, player2) {
    return player1Wins
        ? { winner: player1, loser: player2 }
        : { winner: player2, loser: player1 };
}
/**
 * Highlights the players who are currently active in the tournament
 * @param players
 */
function highlightNextPlayers(...players) {
    const allPlayers = document.querySelectorAll('.player');
    allPlayers.forEach((p) => {
        const player = p;
        player.style.filter = "brightness(1)";
        player.style.color = "";
        player.style.transform = "";
        player.style.textShadow = "";
        player.style.fontWeight = "";
    });
    players.forEach((player) => {
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
function resetHighlight(players) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91cm5hbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3MvdG91cm5hbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNwRixPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBRWQsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7QUFDOUIsSUFBSSxtQkFBbUIsR0FBRyxLQUFLLENBQUM7QUFDaEMsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7QUFFN0IsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUMsa0NBQWtDO0FBRzdELE1BQU0sQ0FBQyxPQUFPLE1BQU8sU0FBUSxZQUFZO0lBRXJDO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2xDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssYUFBYSxFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUNELE1BQU0sV0FBVyxHQUFrQixjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQy9DLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMs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QUcsc0JBQXNCLENBQUM7UUFDbEQsQ0FBQztJQUNGLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLE9BQXNDO0lBQzdELE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDeEIsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNaLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQztZQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7WUFDN0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDN0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsc0JBQXNCLENBQUM7UUFDbEQsQ0FBQztJQUNGLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG5pbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuaW1wb3J0IHsgc3RhcnRUb3VybmFtZW50R2FtZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvYmFieWxvbi5qc1wiO1xuaW1wb3J0IHsgZ2V0UGxheWVyXzFfd2luIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zY29yZS5qc1wiO1xubGV0IGNvdW50ID0gMDtcblxubGV0IHRvdXJuYW1lbnRTdGFydGVkID0gZmFsc2U7XG5sZXQgdG91cm5hbWVudF9maW5pc2hlZCA9IGZhbHNlO1xubGV0IHRvdXJuYW1lbnRfbGVhdmUgPSBmYWxzZTtcblxubGV0IHNlY29uZGVDaGFuY2UgPSBmYWxzZTsgLy8gVmFyaWFibGUgcG91ciBsYSBzZWNvbmRlIGNoYW5jZVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcblx0cHJpdmF0ZSBnYW1lTG9vcDogbnVtYmVyOyAgLy8gTk9URSAtIG9yICdhbnknXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2V0VGl0bGUoXCJUb3VybmFtZW50XCIpO1xuXHRcdGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IFwiL3RvdXJuYW1lbnRcIikge1xuXHRcdFx0dGhpcy5nYW1lTG9vcCA9IHNldEludGVydmFsKCgpID0+IHRoaXMuY2hlY2t0b3VybmFtZW50c3RhcnQoKSwgMTAwMCk7XG5cdFx0fVxuXHRcdGNvbnN0IGFjY2Vzc1Rva2VuOiBzdHJpbmcgfCBudWxsID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWNjZXNzVG9rZW4nKTtcblx0XHRpZiAoIWFjY2Vzc1Rva2VuIHx8IGFjY2Vzc1Rva2VuID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgJy8nKTtcblx0XHRcdGltcG9ydCgnLi9Ib21lLmpzJykudGhlbigobW9kdWxlOiBhbnkpID0+IHtcblx0XHRcdFx0Y29uc3QgSG9tZSA9IG1vZHVsZS5kZWZhdWx0O1xuXHRcdFx0XHRjb25zdCBob21lSW5zdGFuY2UgPSBuZXcgSG9tZSgpO1xuXHRcdFx0XHRob21lSW5zdGFuY2UuZ2V0SHRtbCgpLnRoZW4oKGh0bWw6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGFwcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG5cdFx0XHRcdFx0aWYgKGFwcEVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdGFwcEVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRcdFx0XHRcdGlmIChob21lSW5zdGFuY2UuY3JlYXRlQWNjb3VudCAmJiB0eXBlb2YgaG9tZUluc3RhbmNlLmNyZWF0ZUFjY291bnQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0aG9tZUluc3RhbmNlLmNyZWF0ZUFjY291bnQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8vIHRvdXJuYW1lbnRTdGFydGVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvdXJuYW1lbnRTdGFydGVkJykgPT09ICd0cnVlJztcbiAgICB9XG5cblx0YXN5bmMgZ2V0SHRtbCgpIHtcblx0XHRyZXR1cm4gLypodG1sKi9gXG5cdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvdG91cm5hbWVudC5jc3NcIj5cblx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwidG91cm5hbWVudF92aWV3XCIgaWQ9XCJ0b3VybmFtZW50X3ZpZXdcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ0b3VybmFtZW50X3ZpZXctY29udGVudFwiPlxuXHRcdFx0XHQ8aDE+VE9VUk5BTUVOVDwvaDE+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJzdGFydF90b3VybmFtZW50XCIgZm9ybT1cImNvbnRhaW5lcl9uYW1lX3BsYXllclwiIGNsYXNzPVwiYnRuX3N0YXJ0X3RvdXJuYW1lbnRcIj5TVEFSVDwvYnV0dG9uPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudFwiIGNsYXNzPVwiYnRuX2JhY2tfdG91cm5hbWVudFwiPkJBQ0s8L2J1dHRvbj5cblx0XHRcdFx0PGZvcm0gY2xhc3M9XCJjb250YWluZXJfbmFtZV9wbGF5ZXJcIiBpZD1cImNvbnRhaW5lcl9uYW1lX3BsYXllclwiIG9uc3VibWl0PVwibG9naW5fdG91cm5hbWVudChldmVudClcIj5cblx0XHRcdFx0XHQ8aDE+Q29ubmVjdCB5b3VyIG9wcG9uZW50czwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcl9zZWN0aW9uXCI+XG5cdFx0XHRcdFx0XHQ8cD5QbGF5ZXIgMjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInBsYXllcjJcIj5Vc2VybmFtZTwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidG91cm5hbWVudC11c2VybmFtZTJcIiBjbGFzcz1cImlucHV0X25hbWVfcGxheWVyXCIgcGxhY2Vob2xkZXI9XCJVc2VybmFtZSBwbGF5ZXIgMlwiPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwbGF5ZXIyXCI+UGFzc3dvcmQ8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJ0b3VybmFtZW50LXBhc3N3b3JkMlwiIGNsYXNzPVwiaW5wdXRfbmFtZV9wbGF5ZXJcIiBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkIHBsYXllciAyXCI+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyX3NlY3Rpb25cIj5cblx0XHRcdFx0XHRcdDxwPlBsYXllciAzPC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGxheWVyM1wiPlVzZXJuYW1lPC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ0b3VybmFtZW50LXVzZXJuYW1lM1wiIGNsYXNzPVwiaW5wdXRfbmFtZV9wbGF5ZXJcIiBwbGFjZWhvbGRlcj1cIlVzZXJuYW1lIHBsYXllciAzXCI+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInBsYXllcjNcIj5QYXNzd29yZDwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cInRvdXJuYW1lbnQtcGFzc3dvcmQzXCIgY2xhc3M9XCJpbnB1dF9uYW1lX3BsYXllclwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmQgcGxheWVyIDNcIj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXJfc2VjdGlvblwiPlxuXHRcdFx0XHRcdFx0PHA+UGxheWVyIDQ8L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwbGF5ZXI0XCI+VXNlcm5hbWU8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInRvdXJuYW1lbnQtdXNlcm5hbWU0XCIgY2xhc3M9XCJpbnB1dF9uYW1lX3BsYXllclwiIHBsYWNlaG9sZGVyPVwiVXNlcm5hbWUgUGxheWVyIDRcIj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGxheWVyNFwiPlBhc3N3b3JkPC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwidG91cm5hbWVudC1wYXNzd29yZDRcIiBjbGFzcz1cImlucHV0X25hbWVfcGxheWVyXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZCBwbGF5ZXIgNFwiPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZm9ybT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInRvdXJuYW1lbnRfZ3JhcGhpY1wiIGlkPVwidG91cm5hbWVudF9ncmFwaGljX2lkXCI+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJ3aW5uZXJCcmFja2V0XCIgaWQ9XCJ3aW5uZXJCcmFja2V0X2lkXCI+V2lubmVyIEJyYWNrZXQ8L3A+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJsb3NlckJyYWNrZXRcIiBpZD1cImxvc2VyQnJhY2tldF9pZFwiPkxvc2VyIEJyYWNrZXQ8L3A+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJqb3VldXIxXCIgaWQ9XCJQbGF5ZXIxXCI+JHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnUGxheWVyMScpfTwvcD5cblx0XHRcdFx0XHQ8cCBjbGFzcz1cImpvdWV1cjJcIiBpZD1cIlBsYXllcjJcIj4ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKCdQbGF5ZXIyJyl9PC9wPlxuXHRcdFx0XHRcdDxwIGNsYXNzPVwiam91ZXVyM1wiIGlkPVwiUGxheWVyM1wiPiR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1BsYXllcjMnKX08L3A+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJqb3VldXI0XCIgaWQ9XCJQbGF5ZXI0XCI+JHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnUGxheWVyNCcpfTwvcD5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdG91cm5hbWVudF93aXRoX2JyYWNrZXQuc3ZnXCIgYWx0PVwidG91cm5hbWVudFwiPlxuXHRcdFx0XHRcdDxhIGlkPVwic3RhcnRfZ2FtZVwiIGNsYXNzPVwiYnRuX3N0YXJ0X2dhbWVcIiBocmVmPVwiL3RvdXJuYW1lbnRfZ2FtZVwiIGRhdGEtbGluaz5KT1VFUjwvYT5cblx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwibGVhdmVfdG91cm5hbWVudFwiIGNsYXNzPVwiYnRuX2xlYXZlX3RvdXJuYW1lbnRcIj5YPC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWVzc2FnZVwiIGlkPVwibWVzc2FnZV9pZFwiPlxuXHRcdFx0XHRcdDxwPkFUVEVOVElPTiA6IFNpIHZvdXMgcXVpdHRleiBsZSB0b3Vybm9pLCB2b3VzIG5lIHBvdXJyZXogcGFzIHJldmVuaXIgZW4gYXJyacOocmUuPC9wPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjbG9zZV9tZXNzYWdlXCIgaWQ9XCJjbG9zZV9tZXNzYWdlX2lkXCI+WDwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjb21maXJtX2xlYXZlX3RvdXJuYW1lbnRcIiBpZD1cImNvbmZpcm1fbGVhdmVfdG91cm5hbWVudFwiPlF1aXR0ZXIgbGUgdG91cm5vaTwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lcl9lbmRUb3VybmFtZW50XCIgaWQ9XCJjb250YWluZXJfZW5kVG91cm5hbWVudFwiPlxuXHRcdFx0XHRcdDxoMT5UT1VSTkFNRU5UIEZJTklTSEVEPC9oMT5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdG91cm5hbWVudF9lbmQucG5nXCIgYWx0PVwidHJvcGh5XCIgY2xhc3M9XCJ0cm9waHlcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVzdWx0XCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZmlyc3RfcGxhY2VcIj5cblx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJmaXJzdF9wbGFjZV9uYW1lXCIgaWQ9XCJmaXJzdF9wbGFjZV9uYW1lX2lkXCI+PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2Vjb25kX3BsYWNlXCI+XG5cdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwic2Vjb25kX3BsYWNlX25hbWVcIiBpZD1cInNlY29uZF9wbGFjZV9uYW1lX2lkXCI+PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidGhpcmRfcGxhY2VcIj5cblx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0aGlyZF9wbGFjZV9uYW1lXCIgaWQ9XCJ0aGlyZF9wbGFjZV9uYW1lX2lkXCI+PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImZpbmlzaF90b3VybmFtZW50XCIgaWQ9XCJmaW5pY2hlZF9nYW1lXCI+RklOSVNIRUQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cdFxuXHRcdDwvZGl2PlxuXHRgO1xuXHR9XG5cblx0ZXhpdF90b3VybmFtZW50KClcblx0e1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoJ3Z1ZTInLCAndG91cm5hbWVudCcpO1xuXHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH0pO1xuXHR9XG5cblx0c3RhcnRfdG91cm5hbWVudF9nYW1lKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydF9nYW1lJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoJ3RvdXJuYW1lbnRfZ2FtZV9zdGFydCcsICd0b3VybmFtZW50Jyk7XG5cdFx0XHRzdGFydFRvdXJuYW1lbnRHYW1lKCk7XG5cdFx0XHRjb3VudCA9IHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b3VybmFtZW50Q291bnQnKSkgfHwgMDtcblx0XHRcdC8vIGNvdW50Kys7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG91cm5hbWVudENvdW50JywgY291bnQudG9TdHJpbmcoKSk7XG5cblx0XHRcdGNvbnNvbGUubG9nKGBNYXRjaCAke2NvdW50fSB0ZXJtaW7DqS5gKTtcblx0XHRcdFxuXHRcdFx0Ly8gUsOpY3Vww6lyZXIgbGVzIMOpbMOpbWVudHMgam91ZXVycyBwb3VyIHVwZGF0ZVRvdXJuYW1lbnRTdGF0ZVxuXHRcdFx0Y29uc3QgUGxheWVyMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdQbGF5ZXIxJyk7XG5cdFx0XHRjb25zdCBQbGF5ZXIyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1BsYXllcjInKTtcblx0XHRcdGNvbnN0IFBsYXllcjMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUGxheWVyMycpO1xuXHRcdFx0Y29uc3QgUGxheWVyNCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdQbGF5ZXI0Jyk7XG5cdFx0XHRcblx0XHRcdC8vIE1ldHRyZSDDoCBqb3VyIGwnw6l0YXQgZHUgdG91cm5vaSBBVkFOVCBkZSB2w6lyaWZpZXIgbGEgZmluXG5cdFx0XHR1cGRhdGVUb3VybmFtZW50U3RhdGUoY291bnQsIFBsYXllcjEsIFBsYXllcjIsIFBsYXllcjMsIFBsYXllcjQpO1xuXHRcdFx0XG5cdFx0XHQvLyBNYWludGVuYW50IHLDqWN1cMOpcmVyIGwnw6l0YXQgZGUgbGEgc2Vjb25kZSBjaGFuY2UgKHBvdGVudGllbGxlbWVudCBtaXMgw6Agam91cilcblx0XHRcdHNlY29uZGVDaGFuY2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2Vjb25kQ2hhbmNlJykgPT09ICd0cnVlJztcblx0XHRcdFxuXHRcdFx0Ly8gVsOpcmlmaWVyIHNpIGxlIHRvdXJub2kgZXN0IG1hcnF1w6kgY29tbWUgdGVybWluw6lcblx0XHRcdGNvbnN0IHRvdXJuYW1lbnRGaW5pc2hlZEZsYWcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG91cm5hbWVudF9maW5pc2hlZCcpID09PSAndHJ1ZSc7XG5cdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKGBTZWNvbmRDaGFuY2U6ICR7c2Vjb25kZUNoYW5jZX0sIFRvdXJuYW1lbnRGaW5pc2hlZDogJHt0b3VybmFtZW50RmluaXNoZWRGbGFnfWApO1xuXHRcdFx0XG5cdFx0XHQvLyBBZmZpY2hlciBsYSBmaW4gZHUgdG91cm5vaSBzZXVsZW1lbnQgc2kgZXhwbGljaXRlbWVudCBtYXJxdcOpIGNvbW1lIHRlcm1pbsOpXG5cdFx0XHRpZiAodG91cm5hbWVudEZpbmlzaGVkRmxhZykge1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluaWNoZWRfZ2FtZScpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHR0b3VybmFtZW50X2ZpbmlzaGVkID0gdHJ1ZTtcblx0XHRcdFx0Ly8gUsOpaW5pdGlhbGlzZXIgbGEgc2Vjb25kZSBjaGFuY2UgYXByw6hzIGxlIHRvdXJub2lcblx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3NlY29uZENoYW5jZScpO1xuXHRcdFx0XHRzZWNvbmRlQ2hhbmNlID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBGb25jdGlvbiBkJ2luaXRpYWxpc2F0aW9uIGR1IHRvdXJub2lcblx0aW5pdF90b3VybmFtZW50KCkge1xuXHRcdGNvbnN0IFBsYXllcjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUGxheWVyMScpO1xuXHRcdGNvbnN0IFBsYXllcjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUGxheWVyMicpO1xuXHRcdGNvbnN0IFBsYXllcjMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUGxheWVyMycpO1xuXHRcdGNvbnN0IFBsYXllcjQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUGxheWVyNCcpO1xuXG5cdFx0Ly8gUsOpY3Vww6lyZXIgbCfDqXRhdCBkZXB1aXMgbG9jYWxTdG9yYWdlXG5cdFx0c2Vjb25kZUNoYW5jZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZWNvbmRDaGFuY2UnKSA9PT0gJ3RydWUnO1xuXHRcdGNvdW50ID0gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvdXJuYW1lbnRDb3VudCcpKSB8fCAwO1xuXHRcdFxuXHRcdGNvbnNvbGUubG9nKGBJbml0IHRvdXJuYW1lbnQgLSBDb3VudDogJHtjb3VudH0sIFNlY29uZENoYW5jZTogJHtzZWNvbmRlQ2hhbmNlfWApO1xuXHRcdFxuXHRcdHVwZGF0ZVRvdXJuYW1lbnRTdGF0ZShjb3VudCwgUGxheWVyMSwgUGxheWVyMiwgUGxheWVyMywgUGxheWVyNCk7XG5cblx0XHRjb25zdCBtYXhDb3VudCA9IHNlY29uZGVDaGFuY2UgPyA3IDogNjtcblx0XHRpZiAoY291bnQgPj0gbWF4Q291bnQpIHtcblx0XHRcdGNvbnN0IGVuZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXJfZW5kVG91cm5hbWVudCcpO1xuXHRcdFx0Y29uc3QgZ3JhcGhpYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b3VybmFtZW50X2dyYXBoaWNfaWQnKTtcblx0XHRcdGlmIChlbmRDb250YWluZXIgJiYgZ3JhcGhpYykge1xuXHRcdFx0XHRlbmRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdGdyYXBoaWMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR9XG5cdFx0XHR0b3VybmFtZW50X2ZpbmlzaGVkID0gdHJ1ZTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b3VybmFtZW50X2ZpbmlzaGVkJywgJ3RydWUnKTtcblx0XHR9XG5cdH1cblxuXG4gICAgdG91cm5hbWVudF9ldmVudCgpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRfdG91cm5hbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydF90b3VybmFtZW50Jyk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lcl9uYW1lX3BsYXllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXJfbmFtZV9wbGF5ZXInKTtcbiAgICAgICAgY29uc3QgdG91cm5hbWVudF9ncmFwaGljX2lkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvdXJuYW1lbnRfZ3JhcGhpY19pZCcpO1xuXHRcdGNvbnN0IGJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudCcpO1xuXHRcdGNvbnN0IGZpbmlzaF90b3VybmFtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmljaGVkX2dhbWUnKTtcblxuXHRcdC8vIHN0YXJ0X3RvdXJuYW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHQvLyB0b3VybmFtZW50U3RhcnRlZCA9IHRydWU7XG5cdFx0XHQvLyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG91cm5hbWVudFN0YXJ0ZWQnLCB0b3VybmFtZW50U3RhcnRlZC50b1N0cmluZygpKTtcblx0XHRcdC8vIGNvbnRhaW5lcl9uYW1lX3BsYXllci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdC8vIHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdC8vIHN0YXJ0X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdC8vIGJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdFx0Ly8gTWV0dHJlIGVuIHN1cmJyaWxsYW5jZSBsZXMgam91ZXVycyBpbml0aWF1eFxuXHRcdFx0Ly8gaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidG91cm5hbWVudFN0YXJ0ZWRcIikgPT09ICd0cnVlJykge1xuXHRcdFx0Ly8gXHRoaWdobGlnaHROZXh0UGxheWVycyhQbGF5ZXIxLCBQbGF5ZXIyKTtcblx0XHRcdC8vIFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXJyZW50X3BsYXllcjFcIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1BsYXllcjEnKSk7XG5cdFx0XHQvLyBcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3VycmVudF9wbGF5ZXIyXCIsIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdQbGF5ZXIyJykpO1xuXHRcdFx0Ly8gfVxuXHRcdFx0Ly8gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXJyZW50X3BsYXllcjFcIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1BsYXllcjEnKSk7XG5cdFx0XHQvLyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImN1cnJlbnRfcGxheWVyMlwiLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnUGxheWVyMicpKTtcblx0XHQvLyB9KTtcblxuXHRcdGNvbnN0IGxlYXZlX3RvdXJuYW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGVhdmVfdG91cm5hbWVudCcpO1xuXHRcdGNvbnN0IG1lc3NhZ2VfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZV9pZCcpO1xuXG5cdFx0bGVhdmVfdG91cm5hbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG1lc3NhZ2VfaWQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuc3R5bGUuZmlsdGVyID0gXCJibHVyKDVweClcIjtcblx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG5cdFx0fSk7XG5cblx0XHRjb25zdCBjbG9zZV9tZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlX21lc3NhZ2VfaWQnKTtcblxuXHRcdGNsb3NlX21lc3NhZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRtZXNzYWdlX2lkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLnN0eWxlLmZpbHRlciA9IFwibm9uZVwiO1xuXHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImF1dG9cIjsgXG5cdFx0fSk7XG5cblx0XHRjb25zdCBjb25maXJtX2xlYXZlX3RvdXJuYW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29uZmlybV9sZWF2ZV90b3VybmFtZW50Jyk7XG5cblx0XHQvLyBHZXQgdGhlIHBsYXllciBlbGVtZW50c1xuXHRcdGNvbnN0IFBsYXllcjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUGxheWVyMScpO1xuXHRcdGNvbnN0IFBsYXllcjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUGxheWVyMicpO1xuXHRcdGNvbnN0IFBsYXllcjMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUGxheWVyMycpO1xuXHRcdGNvbnN0IFBsYXllcjQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnUGxheWVyNCcpO1xuXG5cdFx0Y29uZmlybV9sZWF2ZV90b3VybmFtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bWVzc2FnZV9pZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5zdHlsZS5maWx0ZXIgPSBcIm5vbmVcIjtcblx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRjb250YWluZXJfbmFtZV9wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHR0b3VybmFtZW50U3RhcnRlZCA9IGZhbHNlO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvdXJuYW1lbnRTdGFydGVkJywgdG91cm5hbWVudFN0YXJ0ZWQudG9TdHJpbmcoKSk7XG5cdFx0XHQvLyBSw6lpbml0aWFsaXNlciBsZXMgc3R5bGVzIGRlcyBqb3VldXJzXG5cdFx0XHRyZXNldEhpZ2hsaWdodChbUGxheWVyMSwgUGxheWVyMiwgUGxheWVyMywgUGxheWVyNF0pO1xuXG5cdFx0XHRyZXNldFRvdXJuYW1lbnRTdGF0ZShQbGF5ZXIxLCBQbGF5ZXIyLCBQbGF5ZXIzLCBQbGF5ZXI0KTtcblx0XHRcdGJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRzdGFydF90b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0Y291bnQgPSAwO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvdXJuYW1lbnRDb3VudCcsIGNvdW50LnRvU3RyaW5nKCkpO1xuXHRcdH0pO1xuXG5cdFx0ZmluaXNoX3RvdXJuYW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRjb25zdCBwbGF5ZXIxID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1BsYXllcjEnKTtcblx0XHRcdGNvbnN0IHByb2ZpbGVfcGljdHVyZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcm9maWxlX3BpY3R1cmUnKTtcblx0XHRcdGxvY2FsU3RvcmFnZS5jbGVhcigpXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnUGxheWVyMScsIHBsYXllcjEpO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGVfcGljdHVyZScsIHByb2ZpbGVfcGljdHVyZSk7XG5cdFx0XHRjb250YWluZXJfbmFtZV9wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHRjb25zdCBjb250YWluZXJfZW5kVG91cm5hbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXJfZW5kVG91cm5hbWVudCcpO1xuXHRcdFx0Y29udGFpbmVyX2VuZFRvdXJuYW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR0b3VybmFtZW50U3RhcnRlZCA9IGZhbHNlO1xuXHRcdFx0dG91cm5hbWVudF9maW5pc2hlZCA9IGZhbHNlO1xuXHRcdFx0dG91cm5hbWVudF9sZWF2ZSA9IHRydWU7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG91cm5hbWVudFN0YXJ0ZWQnLCB0b3VybmFtZW50U3RhcnRlZC50b1N0cmluZygpKTtcblxuXHRcdFx0Ly8gUsOpaW5pdGlhbGlzZXIgbGVzIHN0eWxlcyBkZXMgam91ZXVyc1xuXHRcdFx0cmVzZXRIaWdobGlnaHQoW1BsYXllcjEsIFBsYXllcjIsIFBsYXllcjMsIFBsYXllcjRdKTtcblxuXHRcdFx0cmVzZXRUb3VybmFtZW50U3RhdGUoUGxheWVyMSwgUGxheWVyMiwgUGxheWVyMywgUGxheWVyNCk7XG5cdFx0XHRiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0c3RhcnRfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdGNvdW50ID0gMDtcblx0XHR9KTtcbiAgICB9XG5cblx0Y2hlY2t0b3VybmFtZW50c3RhcnQoKSB7XG5cdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gXCIvdG91cm5hbWVudFwiKVxuXHRcdHtcblx0XHRcdC8vIFLDqWN1cMOpcmVyIHRvdXMgbGVzIMOpbMOpbWVudHMgbsOpY2Vzc2FpcmVzXG5cdFx0XHRjb25zdCBjb250YWluZXJfbmFtZV9wbGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyX25hbWVfcGxheWVyJyk7XG5cdFx0XHRjb25zdCB0b3VybmFtZW50X2dyYXBoaWNfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG91cm5hbWVudF9ncmFwaGljX2lkJyk7XG5cdFx0XHRjb25zdCBzdGFydF90b3VybmFtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0X3RvdXJuYW1lbnQnKTtcblx0XHRcdGNvbnN0IGJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudCcpO1xuXHRcdFx0Y29uc3QgY29udGFpbmVyX2VuZFRvdXJuYW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyX2VuZFRvdXJuYW1lbnQnKTtcblx0XHRcdFxuXHRcdFx0Ly8gVsOpcmlmaWVyIHF1ZSB0b3VzIGxlcyDDqWzDqW1lbnRzIGV4aXN0ZW50IGF2YW50IGRlIGxlcyBtYW5pcHVsZXJcblx0XHRcdGlmICghY29udGFpbmVyX25hbWVfcGxheWVyIHx8ICF0b3VybmFtZW50X2dyYXBoaWNfaWQgfHwgIXN0YXJ0X3RvdXJuYW1lbnQgfHwgIWJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuOyAvLyBTb3J0aXIgZGUgbGEgZm9uY3Rpb24gc2kgdW4gw6lsw6ltZW50IGVzdCBtYW5xdWFudFxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b3VybmFtZW50U3RhcnRlZFwiKSA9PSAndHJ1ZScgJiYgdG91cm5hbWVudF9maW5pc2hlZCA9PSBmYWxzZSkge1xuXHRcdFx0XHRjb250YWluZXJfbmFtZV9wbGF5ZXIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0c3RhcnRfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0XHRiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG91cm5hbWVudF9maW5pc2hlZCA9PSB0cnVlKSB7XG5cdFx0XHRcdGNvbnRhaW5lcl9uYW1lX3BsYXllci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRzdGFydF90b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRcdGJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdFx0Y29udGFpbmVyX2VuZFRvdXJuYW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0b3VybmFtZW50X2xlYXZlID09IHRydWUpIHtcblx0XHRcdFx0aWYgKGNvbnRhaW5lcl9uYW1lX3BsYXllci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpKSB7XG5cdFx0XHRcdFx0Y29udGFpbmVyX25hbWVfcGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdFx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0XHRzdGFydF90b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRcdFx0Y29udGFpbmVyX2VuZFRvdXJuYW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0dG91cm5hbWVudF9sZWF2ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmNvbnN0IFBPU0lUSU9OUyA9XG57XG5cdHJvdW5kMToge1xuXHRcdHBsYXllcjE6IHsgdG9wOiAnJywgbGVmdDogJycgfSxcblx0XHRwbGF5ZXIyOiB7IHRvcDogJycsIGxlZnQ6ICcnIH0sXG5cdFx0cGxheWVyMzogeyB0b3A6ICcnLCBsZWZ0OiAnJyB9LFxuXHRcdHBsYXllcjQ6IHsgdG9wOiAnJywgbGVmdDogJycgfVxuXHR9LFxuXHRxdWFydF93aW5uZXI6IHtcblx0XHR3aW5uZXIxXzI6IHsgdG9wOiAnMTEuNyUnLCBsZWZ0OiAnMzMuNSUnIH0sXG5cdFx0bG9zZXIxXzI6IHsgdG9wOiAnNjElJywgbGVmdDogJzIwJScgfSxcblx0XHR3aW5uZXIzXzQ6IHsgdG9wOiAnMzEuNyUnLCBsZWZ0OiAnMzMuNSUnIH0sXG5cdFx0bG9zZXIzXzQ6IHsgdG9wOiAnNzAlJywgbGVmdDogJzIwJScgfSxcblx0fSxcblx0cXVhcnRfbG9zZXI6IHtcblx0XHR3aW5uZXI6IHsgdG9wOiAnNjUuNSUnLCBsZWZ0OiAnMzMuNyUnIH0sXG5cdH0sXG5cdGRlbWlfd2luZXI6IHtcblx0XHR3aW5uZXI6IHsgdG9wOiAnMzMuNSUnLCBsZWZ0OiAnNTUuOSUnIH0sXG5cdFx0bG9zZXI6IHsgdG9wOiAnNzQuNSUnLCBsZWZ0OiAnMzMuNyUnIH0sXG5cdH0sXG5cdGRlbWlfbG9zZXI6IHtcblx0XHR3aW5uZXI6IHsgdG9wOiAnNDIuNSUnLCBsZWZ0OiAnNTUuOSUnIH0sXG5cdH0sXG5cdGdyYW5kZV9maW5hbDpcblx0e1xuXHRcdHdpbm5lcjogeyB0b3A6ICczOCUnLCBsZWZ0OiAnNjkuOSUnIH0sXG5cdH0sXG59O1xuXG5pbnRlcmZhY2UgUGxheWVyRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblx0c3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb247XG59XG5cbmludGVyZmFjZSBUb3VybmFtZW50UGxheWVyU3RhdGUge1xuXHRlbGVtZW50OiBQbGF5ZXJFbGVtZW50O1xuXHRwb3NpdGlvbj86IHtcblx0XHR0b3A6IHN0cmluZztcblx0XHRsZWZ0OiBzdHJpbmc7XG5cdH07XG5cdGNvbG9yOiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHJlc2V0VG91cm5hbWVudFN0YXRlKFBsYXllcjE6IFBsYXllckVsZW1lbnQsIFBsYXllcjI6IFBsYXllckVsZW1lbnQsIFBsYXllcjM6IFBsYXllckVsZW1lbnQsIFBsYXllcjQ6IFBsYXllckVsZW1lbnQpOiB2b2lkIHsgICAgXG4gICAgY29uc3Qgam91ZXVyczogUGxheWVyRWxlbWVudFtdID0gW1BsYXllcjEsIFBsYXllcjIsIFBsYXllcjMsIFBsYXllcjRdO1xuXG4gICAgLy8gRWZmYWNlciB0b3VzIGxlcyByw6lzdWx0YXRzIGRlcyBtYXRjaHMgZGFucyBsb2NhbFN0b3JhZ2VcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcIm1hdGNoMV9yZXN1bHRcIik7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJtYXRjaDJfcmVzdWx0XCIpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwibWF0Y2gzX3Jlc3VsdFwiKTtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcIm1hdGNoNF9yZXN1bHRcIik7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJtYXRjaDVfcmVzdWx0XCIpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwibWF0Y2g2X3Jlc3VsdFwiKTtcbiAgICBcbiAgICAvLyBSw6lpbml0aWFsaXNlciBsZSBjb21wdGV1ciBkZSBtYXRjaHNcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInRvdXJuYW1lbnRDb3VudFwiKTtcbiAgICBcbiAgICAvLyBSw6lpbml0aWFsaXNlciBsJ8OpdGF0IGR1IHRvdXJub2lcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInRvdXJuYW1lbnRTdGFydGVkXCIpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidG91cm5hbWVudF9maW5pc2hlZFwiKTtcblx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJzZWNvbmRDaGFuY2VcIik7XG4gICAgXG4gICAgLy8gUsOpaW5pdGlhbGlzZXIgbGVzIHBvc2l0aW9ucyBkZXMgam91ZXVyc1xuICAgIGpvdWV1cnMuZm9yRWFjaChqb3VldXIgPT4ge1xuICAgICAgICBqb3VldXIuc3R5bGUudG9wID0gJyc7XG4gICAgICAgIGpvdWV1ci5zdHlsZS5sZWZ0ID0gJyc7XG4gICAgICAgIGpvdWV1ci5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XG4gICAgfSk7XG59XG5cbmludGVyZmFjZSBQbGF5ZXJFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRzdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbjtcbn1cblxuaW50ZXJmYWNlIE1hdGNoUmVzdWx0IHtcblx0d2lubmVyOiBQbGF5ZXJFbGVtZW50O1xuXHRsb3NlcjogUGxheWVyRWxlbWVudDtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVRvdXJuYW1lbnRTdGF0ZShcblx0Y291bnQ6IG51bWJlcixcblx0UGxheWVyMTogUGxheWVyRWxlbWVudCxcblx0UGxheWVyMjogUGxheWVyRWxlbWVudCxcblx0UGxheWVyMzogUGxheWVyRWxlbWVudCxcblx0UGxheWVyNDogUGxheWVyRWxlbWVudFxuKTogdm9pZCB7XG5cdGNvbnNvbGUubG9nKCdDb3VudDonLCBjb3VudCk7XG5cblx0bGV0IG1hdGNoMV93aW5uZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsXG5cdFx0bWF0Y2gxX2xvc2VyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLFxuXHRcdG1hdGNoMl93aW5uZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsXG5cdFx0bWF0Y2gyX2xvc2VyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLFxuXHRcdG1hdGNoM193aW5uZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsXG5cdFx0bWF0Y2gzX2xvc2VyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLFxuXHRcdG1hdGNoNF93aW5uZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsXG5cdFx0bWF0Y2g0X2xvc2VyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLFxuXHRcdG1hdGNoNV93aW5uZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsXG5cdFx0bWF0Y2g1X2xvc2VyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLFxuXHRcdG1hdGNoNl93aW5uZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsXG5cdFx0bWF0Y2g2X2xvc2VyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLFxuXHRcdG1hdGNoN193aW5uZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsXG5cdFx0bWF0Y2g3X2xvc2VyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG5cdGlmIChjb3VudCA+PSAwKSB7XG5cdFx0Y29uc3QgcGxheWVyczogUGxheWVyRWxlbWVudFtdID0gW1BsYXllcjEsIFBsYXllcjIsIFBsYXllcjMsIFBsYXllcjRdO1xuXHRcdGNvbnN0IHBvc2l0aW9ucyA9IE9iamVjdC52YWx1ZXMoUE9TSVRJT05TLnJvdW5kMSk7XG5cblx0XHRwbGF5ZXJzLmZvckVhY2goKGpvdWV1ciwgaW5kZXgpID0+IHtcblx0XHRcdGpvdWV1ci5zdHlsZS50b3AgPSBwb3NpdGlvbnNbaW5kZXhdLnRvcDtcblx0XHRcdGpvdWV1ci5zdHlsZS5sZWZ0ID0gcG9zaXRpb25zW2luZGV4XS5sZWZ0O1xuXHRcdFx0cmVzZXRIaWdobGlnaHQoW2pvdWV1cl0pO1xuXHRcdH0pO1xuXG5cdFx0aGlnaGxpZ2h0TmV4dFBsYXllcnMoUGxheWVyMSwgUGxheWVyMik7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXJyZW50X3BsYXllcjFcIiwgUGxheWVyMS50ZXh0Q29udGVudCk7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXJyZW50X3BsYXllcjJcIiwgUGxheWVyMi50ZXh0Q29udGVudCk7XG5cdH1cblxuXHRpZiAoY291bnQgPj0gMSkge1xuXHRcdHJlc2V0SGlnaGxpZ2h0KFtQbGF5ZXIxLCBQbGF5ZXIyXSk7XG5cdFx0Y29uc3QgbWF0Y2gxX3Jlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibWF0Y2gxX3Jlc3VsdFwiKTtcblxuXHRcdGlmIChtYXRjaDFfcmVzdWx0KSB7XG5cdFx0XHRjb25zdCB7IHdpbm5lciwgbG9zZXIgfSA9IEpTT04ucGFyc2UobWF0Y2gxX3Jlc3VsdCk7XG5cdFx0XHRtYXRjaDFfd2lubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQod2lubmVyKSBhcyBQbGF5ZXJFbGVtZW50O1xuXHRcdFx0bWF0Y2gxX2xvc2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobG9zZXIpIGFzIFBsYXllckVsZW1lbnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHBsYXllcjFfd2lucyA9IGdldFBsYXllcl8xX3dpbigpO1xuXHRcdFx0bWF0Y2gxX3dpbm5lciA9IHBsYXllcjFfd2lucyA/IFBsYXllcjEgOiBQbGF5ZXIyO1xuXHRcdFx0bWF0Y2gxX2xvc2VyID0gcGxheWVyMV93aW5zID8gUGxheWVyMiA6IFBsYXllcjE7XG5cblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibWF0Y2gxX3Jlc3VsdFwiLCBKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdHdpbm5lcjogbWF0Y2gxX3dpbm5lci5pZCxcblx0XHRcdFx0bG9zZXI6IG1hdGNoMV9sb3Nlci5pZFxuXHRcdFx0fSkpO1xuXHRcdH1cblxuXHRcdGlmIChtYXRjaDFfd2lubmVyICYmIG1hdGNoMV9sb3Nlcikge1xuXHRcdFx0bWF0Y2gxX3dpbm5lci5zdHlsZS50b3AgPSBQT1NJVElPTlMucXVhcnRfd2lubmVyLndpbm5lcjFfMi50b3A7XG5cdFx0XHRtYXRjaDFfd2lubmVyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMucXVhcnRfd2lubmVyLndpbm5lcjFfMi5sZWZ0O1xuXHRcdFx0bWF0Y2gxX2xvc2VyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5xdWFydF93aW5uZXIubG9zZXIxXzIudG9wO1xuXHRcdFx0bWF0Y2gxX2xvc2VyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMucXVhcnRfd2lubmVyLmxvc2VyMV8yLmxlZnQ7XG5cdFx0XHRoaWdobGlnaHROZXh0UGxheWVycyhQbGF5ZXIzLCBQbGF5ZXI0KTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3VycmVudF9wbGF5ZXIxXCIsIFBsYXllcjMudGV4dENvbnRlbnQpO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXJyZW50X3BsYXllcjJcIiwgUGxheWVyNC50ZXh0Q29udGVudCk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGNvdW50ID49IDIpIHtcblx0XHRyZXNldEhpZ2hsaWdodChbUGxheWVyMywgUGxheWVyNF0pO1xuXHRcdGNvbnN0IG1hdGNoMl9yZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1hdGNoMl9yZXN1bHRcIik7XG5cblx0XHRpZiAobWF0Y2gyX3Jlc3VsdCkge1xuXHRcdFx0Y29uc3QgeyB3aW5uZXIsIGxvc2VyIH0gPSBKU09OLnBhcnNlKG1hdGNoMl9yZXN1bHQpO1xuXHRcdFx0bWF0Y2gyX3dpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHdpbm5lcikgYXMgUGxheWVyRWxlbWVudDtcblx0XHRcdG1hdGNoMl9sb3NlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxvc2VyKSBhcyBQbGF5ZXJFbGVtZW50O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBwbGF5ZXIxX3dpbnMgPSBnZXRQbGF5ZXJfMV93aW4oKTtcblx0XHRcdG1hdGNoMl93aW5uZXIgPSBwbGF5ZXIxX3dpbnMgPyBQbGF5ZXIzIDogUGxheWVyNDtcblx0XHRcdG1hdGNoMl9sb3NlciA9IHBsYXllcjFfd2lucyA/IFBsYXllcjQgOiBQbGF5ZXIzO1xuXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm1hdGNoMl9yZXN1bHRcIiwgSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHR3aW5uZXI6IG1hdGNoMl93aW5uZXIuaWQsXG5cdFx0XHRcdGxvc2VyOiBtYXRjaDJfbG9zZXIuaWRcblx0XHRcdH0pKTtcblx0XHR9XG5cblx0XHRpZiAobWF0Y2gyX3dpbm5lciAmJiBtYXRjaDJfbG9zZXIpIHtcblx0XHRcdG1hdGNoMl93aW5uZXIuc3R5bGUudG9wID0gUE9TSVRJT05TLnF1YXJ0X3dpbm5lci53aW5uZXIzXzQudG9wO1xuXHRcdFx0bWF0Y2gyX3dpbm5lci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLnF1YXJ0X3dpbm5lci53aW5uZXIzXzQubGVmdDtcblx0XHRcdG1hdGNoMl9sb3Nlci5zdHlsZS50b3AgPSBQT1NJVElPTlMucXVhcnRfd2lubmVyLmxvc2VyM180LnRvcDtcblx0XHRcdG1hdGNoMl9sb3Nlci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLnF1YXJ0X3dpbm5lci5sb3NlcjNfNC5sZWZ0O1xuXG5cdFx0XHRoaWdobGlnaHROZXh0UGxheWVycyhtYXRjaDFfbG9zZXIsIG1hdGNoMl9sb3Nlcik7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImN1cnJlbnRfcGxheWVyMVwiLCBtYXRjaDFfbG9zZXIudGV4dENvbnRlbnQpO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXJyZW50X3BsYXllcjJcIiwgbWF0Y2gyX2xvc2VyLnRleHRDb250ZW50KTtcblx0XHR9XG5cdH1cblxuXHRpZiAoY291bnQgPj0gMyAmJiBtYXRjaDFfbG9zZXIgJiYgbWF0Y2gyX2xvc2VyKSB7XG5cdFx0cmVzZXRIaWdobGlnaHQoW21hdGNoMV9sb3NlciwgbWF0Y2gyX2xvc2VyXSk7XG5cdFx0Y29uc3QgbWF0Y2gzX3Jlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibWF0Y2gzX3Jlc3VsdFwiKTtcblxuXHRcdGlmIChtYXRjaDNfcmVzdWx0KSB7XG5cdFx0XHRjb25zdCB7IHdpbm5lciwgbG9zZXIgfSA9IEpTT04ucGFyc2UobWF0Y2gzX3Jlc3VsdCk7XG5cdFx0XHRtYXRjaDNfd2lubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQod2lubmVyKSBhcyBQbGF5ZXJFbGVtZW50O1xuXHRcdFx0bWF0Y2gzX2xvc2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobG9zZXIpIGFzIFBsYXllckVsZW1lbnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHdpbm5lcklzRmlyc3QgPSBnZXRQbGF5ZXJfMV93aW4oKTtcblx0XHRcdG1hdGNoM193aW5uZXIgPSB3aW5uZXJJc0ZpcnN0ID8gbWF0Y2gxX2xvc2VyIDogbWF0Y2gyX2xvc2VyO1xuXHRcdFx0bWF0Y2gzX2xvc2VyID0gd2lubmVySXNGaXJzdCA/IG1hdGNoMl9sb3NlciA6IG1hdGNoMV9sb3NlcjtcblxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtYXRjaDNfcmVzdWx0XCIsIEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0d2lubmVyOiBtYXRjaDNfd2lubmVyLmlkLFxuXHRcdFx0XHRsb3NlcjogbWF0Y2gzX2xvc2VyLmlkXG5cdFx0XHR9KSk7XG5cdFx0fVxuXG5cdFx0aWYgKG1hdGNoM193aW5uZXIgJiYgbWF0Y2gzX2xvc2VyKSB7XG5cdFx0XHRtYXRjaDNfd2lubmVyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5xdWFydF9sb3Nlci53aW5uZXIudG9wO1xuXHRcdFx0bWF0Y2gzX3dpbm5lci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLnF1YXJ0X2xvc2VyLndpbm5lci5sZWZ0O1xuXHRcdFx0bWF0Y2gzX2xvc2VyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG5cdFx0XHRoaWdobGlnaHROZXh0UGxheWVycyhtYXRjaDFfd2lubmVyLCBtYXRjaDJfd2lubmVyKTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3VycmVudF9wbGF5ZXIxXCIsIG1hdGNoMV93aW5uZXIudGV4dENvbnRlbnQpO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXJyZW50X3BsYXllcjJcIiwgbWF0Y2gyX3dpbm5lci50ZXh0Q29udGVudCk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGNvdW50ID49IDQgJiYgbWF0Y2gxX3dpbm5lciAmJiBtYXRjaDJfd2lubmVyKSB7XG5cdFx0cmVzZXRIaWdobGlnaHQoW21hdGNoMV93aW5uZXIsIG1hdGNoMl93aW5uZXJdKTtcblx0XHRjb25zdCBtYXRjaDRfcmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYXRjaDRfcmVzdWx0XCIpO1xuXG5cdFx0aWYgKG1hdGNoNF9yZXN1bHQpIHtcblx0XHRcdGNvbnN0IHsgd2lubmVyLCBsb3NlciB9ID0gSlNPTi5wYXJzZShtYXRjaDRfcmVzdWx0KTtcblx0XHRcdG1hdGNoNF93aW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh3aW5uZXIpIGFzIFBsYXllckVsZW1lbnQ7XG5cdFx0XHRtYXRjaDRfbG9zZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsb3NlcikgYXMgUGxheWVyRWxlbWVudDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3Qgd2lubmVySXNGaXJzdCA9IGdldFBsYXllcl8xX3dpbigpO1xuXHRcdFx0bWF0Y2g0X3dpbm5lciA9IHdpbm5lcklzRmlyc3QgPyBtYXRjaDFfd2lubmVyIDogbWF0Y2gyX3dpbm5lcjtcblx0XHRcdG1hdGNoNF9sb3NlciA9IHdpbm5lcklzRmlyc3QgPyBtYXRjaDJfd2lubmVyIDogbWF0Y2gxX3dpbm5lcjtcblxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtYXRjaDRfcmVzdWx0XCIsIEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0d2lubmVyOiBtYXRjaDRfd2lubmVyLmlkLFxuXHRcdFx0XHRsb3NlcjogbWF0Y2g0X2xvc2VyLmlkXG5cdFx0XHR9KSk7XG5cdFx0fVxuXG5cdFx0aWYgKG1hdGNoNF93aW5uZXIgJiYgbWF0Y2g0X2xvc2VyKSB7XG5cdFx0XHRtYXRjaDRfd2lubmVyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5kZW1pX3dpbmVyLndpbm5lci50b3A7XG5cdFx0XHRtYXRjaDRfd2lubmVyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMuZGVtaV93aW5lci53aW5uZXIubGVmdDtcblxuXHRcdFx0bWF0Y2g0X2xvc2VyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5kZW1pX3dpbmVyLmxvc2VyLnRvcDtcblx0XHRcdG1hdGNoNF9sb3Nlci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLmRlbWlfd2luZXIubG9zZXIubGVmdDtcblxuXHRcdFx0aGlnaGxpZ2h0TmV4dFBsYXllcnMobWF0Y2gzX3dpbm5lciwgbWF0Y2g0X2xvc2VyKTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3VycmVudF9wbGF5ZXIxXCIsIG1hdGNoM193aW5uZXIudGV4dENvbnRlbnQpO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjdXJyZW50X3BsYXllcjJcIiwgbWF0Y2g0X2xvc2VyLnRleHRDb250ZW50KTtcblx0XHR9XG5cdH1cblxuXHRpZiAoY291bnQgPj0gNSAmJiBtYXRjaDNfd2lubmVyICYmIG1hdGNoNF9sb3Nlcikge1xuXHRcdHJlc2V0SGlnaGxpZ2h0KFttYXRjaDNfd2lubmVyLCBtYXRjaDRfbG9zZXJdKTtcblx0XHRjb25zdCBtYXRjaDVfcmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYXRjaDVfcmVzdWx0XCIpO1xuXG5cdFx0aWYgKG1hdGNoNV9yZXN1bHQpIHtcblx0XHRcdGNvbnN0IHsgd2lubmVyLCBsb3NlciB9ID0gSlNPTi5wYXJzZShtYXRjaDVfcmVzdWx0KTtcblx0XHRcdG1hdGNoNV93aW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh3aW5uZXIpIGFzIFBsYXllckVsZW1lbnQ7XG5cdFx0XHRtYXRjaDVfbG9zZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsb3NlcikgYXMgUGxheWVyRWxlbWVudDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3Qgd2lubmVySXNGaXJzdCA9IGdldFBsYXllcl8xX3dpbigpO1xuXHRcdFx0bWF0Y2g1X3dpbm5lciA9IHdpbm5lcklzRmlyc3QgPyBtYXRjaDNfd2lubmVyIDogbWF0Y2g0X2xvc2VyO1xuXHRcdFx0bWF0Y2g1X2xvc2VyID0gd2lubmVySXNGaXJzdCA/IG1hdGNoNF9sb3NlciA6IG1hdGNoM193aW5uZXI7XG5cblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibWF0Y2g1X3Jlc3VsdFwiLCBKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdHdpbm5lcjogbWF0Y2g1X3dpbm5lci5pZCxcblx0XHRcdFx0bG9zZXI6IG1hdGNoNV9sb3Nlci5pZFxuXHRcdFx0fSkpO1xuXHRcdH1cblxuXHRcdGlmIChtYXRjaDVfd2lubmVyICYmIG1hdGNoNV9sb3Nlcikge1xuXHRcdFx0bWF0Y2g1X3dpbm5lci5zdHlsZS50b3AgPSBQT1NJVElPTlMuZGVtaV9sb3Nlci53aW5uZXIudG9wO1xuXHRcdFx0bWF0Y2g1X3dpbm5lci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLmRlbWlfbG9zZXIud2lubmVyLmxlZnQ7XG5cblx0XHRcdG1hdGNoNV9sb3Nlci5zdHlsZS5jb2xvciA9ICdyZWQnO1xuXHRcdFx0aGlnaGxpZ2h0TmV4dFBsYXllcnMobWF0Y2g0X3dpbm5lciwgbWF0Y2g1X3dpbm5lcik7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImN1cnJlbnRfcGxheWVyMVwiLCBtYXRjaDRfd2lubmVyLnRleHRDb250ZW50KTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3VycmVudF9wbGF5ZXIyXCIsIG1hdGNoNV93aW5uZXIudGV4dENvbnRlbnQpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChjb3VudCA+PSA2ICYmIG1hdGNoNF93aW5uZXIgJiYgbWF0Y2g1X3dpbm5lcikge1xuXHRcdHJlc2V0SGlnaGxpZ2h0KFttYXRjaDRfd2lubmVyLCBtYXRjaDVfd2lubmVyXSk7XG5cdFx0Y29uc3QgbWF0Y2g2X3Jlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibWF0Y2g2X3Jlc3VsdFwiKTtcblxuXHRcdGlmIChtYXRjaDZfcmVzdWx0KSB7XG5cdFx0XHRjb25zdCB7IHdpbm5lciwgbG9zZXIgfSA9IEpTT04ucGFyc2UobWF0Y2g2X3Jlc3VsdCk7XG5cdFx0XHRtYXRjaDZfd2lubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQod2lubmVyKSBhcyBQbGF5ZXJFbGVtZW50O1xuXHRcdFx0bWF0Y2g2X2xvc2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobG9zZXIpIGFzIFBsYXllckVsZW1lbnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHdpbm5lcklzRmlyc3QgPSBnZXRQbGF5ZXJfMV93aW4oKTtcblx0XHRcdG1hdGNoNl93aW5uZXIgPSB3aW5uZXJJc0ZpcnN0ID8gbWF0Y2g0X3dpbm5lciA6IG1hdGNoNV93aW5uZXI7XG5cdFx0XHRtYXRjaDZfbG9zZXIgPSB3aW5uZXJJc0ZpcnN0ID8gbWF0Y2g1X3dpbm5lciA6IG1hdGNoNF93aW5uZXI7XG5cblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibWF0Y2g2X3Jlc3VsdFwiLCBKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdHdpbm5lcjogbWF0Y2g2X3dpbm5lci5pZCxcblx0XHRcdFx0bG9zZXI6IG1hdGNoNl9sb3Nlci5pZFxuXHRcdFx0fSkpO1xuXHRcdH1cblxuXHRcdGlmIChtYXRjaDZfd2lubmVyICYmIG1hdGNoNl9sb3Nlcikge1xuXHRcdFx0aWYgKG1hdGNoNl93aW5uZXIuaWQgPT09IG1hdGNoNV93aW5uZXIuaWQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJMZSBqb3VldXIgZHUgbG9zZXJzIGJyYWNrZXQgYSBnYWduw6kgISBTZWNvbmRlIGNoYW5jZSBhY3RpdsOpZSAhXCIpO1xuXHRcdFx0XHRzZWNvbmRlQ2hhbmNlID0gdHJ1ZTtcblx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NlY29uZENoYW5jZScsICd0cnVlJyk7XG5cdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b3VybmFtZW50X2ZpbmlzaGVkJyk7XG5cdFx0XHRcdHRvdXJuYW1lbnRfZmluaXNoZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRtYXRjaDZfd2lubmVyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5kZW1pX2xvc2VyLndpbm5lci50b3A7XG5cdFx0XHRcdG1hdGNoNl93aW5uZXIuc3R5bGUubGVmdCA9IFBPU0lUSU9OUy5kZW1pX2xvc2VyLndpbm5lci5sZWZ0O1xuXHRcdFx0XHRtYXRjaDZfbG9zZXIuc3R5bGUudG9wID0gUE9TSVRJT05TLmRlbWlfd2luZXIud2lubmVyLnRvcDtcblx0XHRcdFx0bWF0Y2g2X2xvc2VyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMuZGVtaV93aW5lci53aW5uZXIubGVmdDtcblx0XHRcdFx0XG5cdFx0XHRcdGhpZ2hsaWdodE5leHRQbGF5ZXJzKG1hdGNoNl9sb3NlciwgbWF0Y2g2X3dpbm5lcik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChtYXRjaDZfd2lubmVyLmlkID09PSBtYXRjaDRfd2lubmVyLmlkKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTGUgam91ZXVyIGR1IHdpbm5lcnMgYnJhY2tldCBhIGdhZ27DqSAhIFRvdXJub2kgdGVybWluw6kgIVwiKTtcblx0XHRcdFx0bWF0Y2g2X3dpbm5lci5zdHlsZS50b3AgPSBQT1NJVElPTlMuZ3JhbmRlX2ZpbmFsLndpbm5lci50b3A7XG5cdFx0XHRcdG1hdGNoNl93aW5uZXIuc3R5bGUubGVmdCA9IFBPU0lUSU9OUy5ncmFuZGVfZmluYWwud2lubmVyLmxlZnQ7XG5cdFx0XHRcdG1hdGNoNl9sb3Nlci5zdHlsZS5jb2xvciA9ICdyZWQnO1xuXHRcdFx0XHRcblx0XHRcdFx0dG91cm5hbWVudF9maW5pc2hlZCA9IHRydWU7XG5cdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b3VybmFtZW50X2ZpbmlzaGVkJywgJ3RydWUnKTtcblx0XHRcdFx0c2Vjb25kZUNoYW5jZSA9IGZhbHNlO1xuXHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnc2Vjb25kQ2hhbmNlJyk7XG5cblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpcnN0X3BsYWNlX25hbWVfaWQnKSEudGV4dENvbnRlbnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtYXRjaDZfd2lubmVyLmlkKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY29uZF9wbGFjZV9uYW1lX2lkJykhLnRleHRDb250ZW50ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obWF0Y2g2X2xvc2VyLmlkKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RoaXJkX3BsYWNlX25hbWVfaWQnKSEudGV4dENvbnRlbnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtYXRjaDVfbG9zZXIuaWQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIE1hdGNoIDcgLSBHcmFuZGUgZmluYWxlIChicmFja2V0IHJlc2V0KVxuXHRpZiAoY291bnQgPj0gNyAmJiBzZWNvbmRlQ2hhbmNlICYmIG1hdGNoNF93aW5uZXIgJiYgbWF0Y2g1X3dpbm5lcikge1xuXHRcdGNvbnNvbGUubG9nKFwiTWF0Y2ggNyAtIEdyYW5kZSBmaW5hbGUgYXZlYyBicmFja2V0IHJlc2V0XCIpO1xuXHRcdFxuXHRcdC8vIFLDqWN1cMOpcmVyIGxlcyBqb3VldXJzIGRlcHVpcyBsZXMgcsOpc3VsdGF0cyBwcsOpY8OpZGVudHNcblx0XHRjb25zdCBtYXRjaDRfcmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYXRjaDRfcmVzdWx0XCIpO1xuXHRcdGNvbnN0IG1hdGNoNV9yZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1hdGNoNV9yZXN1bHRcIik7XG5cdFx0XG5cdFx0aWYgKG1hdGNoNF9yZXN1bHQgJiYgbWF0Y2g1X3Jlc3VsdCkge1xuXHRcdFx0Y29uc3QgbWF0Y2g0X2RhdGEgPSBKU09OLnBhcnNlKG1hdGNoNF9yZXN1bHQpO1xuXHRcdFx0Y29uc3QgbWF0Y2g1X2RhdGEgPSBKU09OLnBhcnNlKG1hdGNoNV9yZXN1bHQpO1xuXHRcdFx0XG5cdFx0XHRjb25zdCBmaW5hbE1hdGNoNFdpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1hdGNoNF9kYXRhLndpbm5lcikgYXMgUGxheWVyRWxlbWVudDtcblx0XHRcdGNvbnN0IGZpbmFsTWF0Y2g1V2lubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobWF0Y2g1X2RhdGEud2lubmVyKSBhcyBQbGF5ZXJFbGVtZW50O1xuXHRcdFx0XG5cdFx0XHRyZXNldEhpZ2hsaWdodChbZmluYWxNYXRjaDRXaW5uZXIsIGZpbmFsTWF0Y2g1V2lubmVyXSk7XG5cdFx0XHRcblx0XHRcdGNvbnN0IG1hdGNoN19yZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1hdGNoN19yZXN1bHRcIik7XG5cblx0XHRcdGlmIChtYXRjaDdfcmVzdWx0KSB7XG5cdFx0XHRcdGNvbnN0IHsgd2lubmVyLCBsb3NlciB9ID0gSlNPTi5wYXJzZShtYXRjaDdfcmVzdWx0KTtcblx0XHRcdFx0bWF0Y2g3X3dpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHdpbm5lcikgYXMgUGxheWVyRWxlbWVudDtcblx0XHRcdFx0bWF0Y2g3X2xvc2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobG9zZXIpIGFzIFBsYXllckVsZW1lbnQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCB3aW5uZXJJc0ZpcnN0ID0gZ2V0UGxheWVyXzFfd2luKCk7XG5cdFx0XHRcdG1hdGNoN193aW5uZXIgPSB3aW5uZXJJc0ZpcnN0ID8gZmluYWxNYXRjaDRXaW5uZXIgOiBmaW5hbE1hdGNoNVdpbm5lcjtcblx0XHRcdFx0bWF0Y2g3X2xvc2VyID0gd2lubmVySXNGaXJzdCA/IGZpbmFsTWF0Y2g1V2lubmVyIDogZmluYWxNYXRjaDRXaW5uZXI7XG5cblx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtYXRjaDdfcmVzdWx0XCIsIEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHR3aW5uZXI6IG1hdGNoN193aW5uZXIuaWQsXG5cdFx0XHRcdFx0bG9zZXI6IG1hdGNoN19sb3Nlci5pZFxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChtYXRjaDdfd2lubmVyICYmIG1hdGNoN19sb3Nlcikge1xuXHRcdFx0XHRtYXRjaDdfd2lubmVyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5ncmFuZGVfZmluYWwud2lubmVyLnRvcDtcblx0XHRcdFx0bWF0Y2g3X3dpbm5lci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLmdyYW5kZV9maW5hbC53aW5uZXIubGVmdDtcblx0XHRcdFx0bWF0Y2g3X2xvc2VyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG5cdFx0XHRcdFxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlRvdXJub2kgdGVybWluw6kgYXByw6hzIGxlIG1hdGNoIDcgIVwiKTtcblx0XHRcdFx0dG91cm5hbWVudF9maW5pc2hlZCA9IHRydWU7XG5cdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b3VybmFtZW50X2ZpbmlzaGVkJywgJ3RydWUnKTtcblx0XHRcdFx0c2Vjb25kZUNoYW5jZSA9IGZhbHNlO1xuXHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnc2Vjb25kQ2hhbmNlJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlyc3RfcGxhY2VfbmFtZV9pZCcpIS50ZXh0Q29udGVudCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1hdGNoN193aW5uZXIuaWQpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Vjb25kX3BsYWNlX25hbWVfaWQnKSEudGV4dENvbnRlbnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtYXRjaDdfbG9zZXIuaWQpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhpcmRfcGxhY2VfbmFtZV9pZCcpIS50ZXh0Q29udGVudCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1hdGNoNV9sb3Nlci5pZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cblxuXG4vKipcbiAqIETDqXRlcm1pbmUgbGUgZ2FnbmFudCBldCBsZSBwZXJkYW50IGQndW4gbWF0Y2guXG4gKi9cbmZ1bmN0aW9uIGRldGVybWluZU1hdGNoUmVzdWx0KHBsYXllcjFXaW5zOiBib29sZWFuLCBwbGF5ZXIxOiBQbGF5ZXJFbGVtZW50LCBwbGF5ZXIyOiBQbGF5ZXJFbGVtZW50KTogTWF0Y2hSZXN1bHQge1xuICAgIHJldHVybiBwbGF5ZXIxV2luc1xuICAgICAgICA/IHsgd2lubmVyOiBwbGF5ZXIxLCBsb3NlcjogcGxheWVyMiB9XG4gICAgICAgIDogeyB3aW5uZXI6IHBsYXllcjIsIGxvc2VyOiBwbGF5ZXIxIH07XG59XG5cbmludGVyZmFjZSBQbGF5ZXJFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRzdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbjtcbn1cblxuLyoqXG4gKiBIaWdobGlnaHRzIHRoZSBwbGF5ZXJzIHdobyBhcmUgY3VycmVudGx5IGFjdGl2ZSBpbiB0aGUgdG91cm5hbWVudFxuICogQHBhcmFtIHBsYXllcnNcbiAqL1xuZnVuY3Rpb24gaGlnaGxpZ2h0TmV4dFBsYXllcnMoLi4ucGxheWVyczogKFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQpW10pOiB2b2lkIHtcblx0Y29uc3QgYWxsUGxheWVyczogTm9kZUxpc3RPZjxFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGF5ZXInKTtcblx0YWxsUGxheWVycy5mb3JFYWNoKChwOiBFbGVtZW50KSA9PiB7XG5cdFx0Y29uc3QgcGxheWVyID0gcCBhcyBIVE1MRWxlbWVudDtcblx0XHRwbGF5ZXIuc3R5bGUuZmlsdGVyID0gXCJicmlnaHRuZXNzKDEpXCI7XG5cdFx0cGxheWVyLnN0eWxlLmNvbG9yID0gXCJcIjtcblx0XHRwbGF5ZXIuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcblx0XHRwbGF5ZXIuc3R5bGUudGV4dFNoYWRvdyA9IFwiXCI7XG5cdFx0cGxheWVyLnN0eWxlLmZvbnRXZWlnaHQgPSBcIlwiO1xuXHR9KTtcblxuXHRwbGF5ZXJzLmZvckVhY2goKHBsYXllcjogUGxheWVyRWxlbWVudCB8IHVuZGVmaW5lZCkgPT4ge1xuXHRcdGlmIChwbGF5ZXIpIHtcblx0XHRcdHBsYXllci5zdHlsZS5maWx0ZXIgPSBcImJyaWdodG5lc3MoMi4wKSBzYXR1cmF0ZSgyLjApXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUuY29sb3IgPSBcIiNGRkZGMDBcIjtcblx0XHRcdHBsYXllci5zdHlsZS50cmFuc2Zvcm0gPSBcInNjYWxlKDEuMSlcIjtcblx0XHRcdHBsYXllci5zdHlsZS50ZXh0U2hhZG93ID0gXCIwIDAgMTBweCByZ2JhKDI1NSwgMjU1LCAwLCAwLjgpXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUuZm9udFdlaWdodCA9IFwiYm9sZFwiO1xuXHRcdFx0cGxheWVyLnN0eWxlLnRyYW5zaXRpb24gPSBcImFsbCAwLjNzIGVhc2UtaW4tb3V0XCI7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcmVzZXRIaWdobGlnaHQocGxheWVyczogKFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQpW10pOiB2b2lkIHtcblx0cGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG5cdFx0aWYgKHBsYXllcikge1xuXHRcdFx0cGxheWVyLnN0eWxlLmZpbHRlciA9IFwiYnJpZ2h0bmVzcygxKVwiO1xuXHRcdFx0cGxheWVyLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuXHRcdFx0cGxheWVyLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUudGV4dFNoYWRvdyA9IFwiXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUuZm9udFdlaWdodCA9IFwiXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUudHJhbnNpdGlvbiA9IFwiYWxsIDAuM3MgZWFzZS1pbi1vdXRcIjtcblx0XHR9XG5cdH0pO1xufSJdfQ==