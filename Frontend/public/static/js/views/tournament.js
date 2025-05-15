import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import AbstractView from "./AbstractView.js";
import { startTournamentGame } from "../../../srcs/game/gameplay/babylon.js";
import { getPlayer_1_win } from "../../../srcs/game/gameplay/score.js";
let count = 0;
let tournamentStarted = false;
export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Tournament");
        if (window.location.pathname === "/tournament") {
            this.gameLoop = setInterval(() => this.checktournamentstart(), 1000);
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
				<button id="start_tournament" class="btn_start_tournament">START</button>
				<button id="back_to_menu_view_tournament" class="btn_back_tournament">BACK</button>
				<div class="container_name_player" id="container_name_player">
					<h1>Customize your name</h1>
					<div class="input-container">
						<label for="player1">player 1</label>
						<input type="text" id="player1" class="input_name_player" placeholder="Player name 1">
					</div>
					<div class="input-container">
						<label for="player2">player 2</label>
						<input type="text" id="player2" class="input_name_player" placeholder="Player namer 2">
					</div>
					<div class="input-container">
						<label for="player3">player 3</label>
						<input type="text" id="player3" class="input_name_player" placeholder="Player namer 3">
					</div>
					<div class="input-container">
						<label for="player4">player 4</label>
						<input type="text" id="player4" class="input_name_player" placeholder="Player namer 4">
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
					<button id="finiched_game" class="btn_finished_game">FINISHED</button>
					<button id="leave_tournament" class="btn_leave_tournament">X</button>
				</div>
				<div class="message" id="message_id">
					<p>ATTENTION : Si vous quittez le tournoi, vous ne pourrez pas revenir en arrière.</p>
					<button class="close_message" id="close_message_id">X</button>
					<button class="comfirm_leave_tournament" id="confirm_leave_tournament">Quitter le tournoi</button>
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
            console.log('Start game clicked');
            handleViewTransitions('tournament_game_start', 'tournament');
            startTournamentGame();
            count = parseInt(localStorage.getItem('tournamentCount')) || 0;
            count++;
            localStorage.setItem('tournamentCount', count.toString());
            if (count >= 6) {
                const start_game = document.getElementById('start_game');
                start_game.style.display = 'none';
                const finiched_game = document.getElementById('finiched_game');
                finiched_game.style.display = 'block';
            }
        });
    }
    init_tournament() {
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
            const startGameBtn = document.getElementById('start_game');
            const finishGameBtn = document.getElementById('finiched_game');
            if (startGameBtn)
                startGameBtn.style.display = 'none';
            if (finishGameBtn)
                finishGameBtn.style.display = 'block';
        }
        else {
            const finishGameBtn = document.getElementById('finiched_game');
            if (finishGameBtn)
                finishGameBtn.style.display = 'none';
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
            resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
            back_to_menu_view_tournament.style.display = 'block';
            start_tournament.style.display = 'block';
        });
        finish_tournament.addEventListener('click', () => {
            tournament_graphic_id.classList.remove('active');
            container_name_player.classList.remove('hidden');
            tournamentStarted = false;
            resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
            back_to_menu_view_tournament.style.display = 'block';
            start_tournament.style.display = 'block';
            count = 0;
            localStorage.setItem('tournamentCount', count.toString());
        });
    }
    checktournamentstart() {
        if (window.location.pathname === "/tournament") {
            // Récupérer tous les éléments nécessaires
            const container_name_player = document.getElementById('container_name_player');
            const tournament_graphic_id = document.getElementById('tournament_graphic_id');
            const start_tournament = document.getElementById('start_tournament');
            const back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');
            // Vérifier que tous les éléments existent avant de les manipuler
            if (!container_name_player || !tournament_graphic_id || !start_tournament || !back_to_menu_view_tournament) {
                return; // Sortir de la fonction si un élément est manquant
            }
            if (tournamentStarted == true) {
                container_name_player.classList.add('hidden');
                tournament_graphic_id.classList.add('active');
                start_tournament.style.display = 'none';
                back_to_menu_view_tournament.style.display = 'none';
            }
            else {
                if (container_name_player.classList.contains('hidden')) {
                    container_name_player.classList.remove('hidden');
                    tournament_graphic_id.classList.remove('active');
                    start_tournament.style.display = 'block';
                    back_to_menu_view_tournament.style.display = 'block';
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
    grande_final: {
        winner: { top: '38%', left: '72%' },
    },
};
function resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id) {
    // count = 0;
    localStorage.setItem('tournamentCount', count.toString());
    const joueurs = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];
    joueurs.forEach(joueur => {
        joueur.style.top = '';
        joueur.style.left = '';
        joueur.style.color = 'white';
    });
}
function updateTournamentState(count, joueur1_id, joueur2_id, joueur3_id, joueur4_id) {
    resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
    console.log('Count:', count);
    let match1_winner, match1_loser, match2_winner, match2_loser, match3_winner, match3_loser, match4_winner, match4_loser, match5_winner, match5_loser, match6_winner, match6_loser;
    if (count >= 0) {
        const players = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];
        const positions = Object.values(POSITIONS.round1);
        players.forEach((joueur, index) => {
            joueur.style.top = positions[index].top;
            joueur.style.left = positions[index].left;
            joueur.style.color = 'white';
            highlightNextPlayers(joueur1_id, joueur2_id);
        });
    }
    if (count >= 1) {
        resetHighlight([joueur1_id, joueur2_id]);
        console.log('Match 1');
        console.log("round1");
        const player1_wins = getPlayer_1_win();
        if (player1_wins) {
            match1_winner = joueur1_id;
            match1_loser = joueur2_id;
        }
        else {
            match1_winner = joueur2_id;
            match1_loser = joueur1_id;
        }
        match1_winner.style.top = POSITIONS.quart_winner.winner1_2.top;
        match1_winner.style.left = POSITIONS.quart_winner.winner1_2.left;
        match1_loser.style.top = POSITIONS.quart_winner.loser1_2.top;
        match1_loser.style.left = POSITIONS.quart_winner.loser1_2.left;
        highlightNextPlayers(joueur3_id, joueur4_id);
    }
    if (count >= 2) {
        resetHighlight([joueur3_id, joueur4_id]);
        console.log('Match 2');
        console.log("round2");
        const player1_wins = getPlayer_1_win();
        if (player1_wins) {
            match2_winner = joueur3_id;
            match2_loser = joueur4_id;
        }
        else {
            match2_winner = joueur4_id;
            match2_loser = joueur3_id;
        }
        match2_winner.style.top = POSITIONS.quart_winner.winner3_4.top;
        match2_winner.style.left = POSITIONS.quart_winner.winner3_4.left;
        match2_loser.style.top = POSITIONS.quart_winner.loser3_4.top;
        match2_loser.style.left = POSITIONS.quart_winner.loser3_4.left;
        highlightNextPlayers(match1_loser, match2_loser);
    }
    if (count >= 3 && match1_loser && match2_loser) {
        resetHighlight([match1_loser, match2_loser]);
        const quart_loser_bracket = getPlayer_1_win();
        if (quart_loser_bracket) {
            match3_winner = match1_loser;
            match3_loser = match2_loser;
        }
        else {
            match3_winner = match1_loser;
            match3_loser = match2_loser;
        }
        match3_winner.style.top = POSITIONS.quart_loser.winner.top;
        match3_winner.style.left = POSITIONS.quart_loser.winner.left;
        match3_loser.style.color = 'red';
        highlightNextPlayers(match1_winner, match2_winner);
    }
    if (count >= 4 && match1_winner && match2_winner) {
        resetHighlight([match1_winner, match2_winner]);
        const demi_winner_bracket = getPlayer_1_win();
        if (demi_winner_bracket) {
            match4_winner = match1_winner;
            match4_loser = match2_winner;
        }
        else {
            match4_winner = match2_winner;
            match4_loser = match1_winner;
        }
        match4_winner.style.top = POSITIONS.demi_winer.winner.top;
        match4_winner.style.left = POSITIONS.demi_winer.winner.left;
        match4_loser.style.top = POSITIONS.demi_winer.loser.top;
        match4_loser.style.left = POSITIONS.demi_winer.loser.left;
        highlightNextPlayers(match3_winner, match4_loser);
    }
    if (count >= 5 && match3_loser && match4_loser) {
        resetHighlight([match3_loser, match4_loser]);
        const demi_loser_bracket = getPlayer_1_win();
        if (demi_loser_bracket) {
            match5_winner = match3_loser;
            match5_loser = match4_loser;
        }
        else {
            match5_winner = match4_loser;
            match5_loser = match3_loser;
        }
        match5_winner.style.top = POSITIONS.demi_loser.winner.top;
        match5_winner.style.left = POSITIONS.demi_loser.winner.left;
        match5_loser.style.color = 'red';
        highlightNextPlayers(match4_winner, match5_winner);
    }
    if (count >= 6 && match5_winner && match4_winner) {
        resetHighlight([match5_winner, match4_winner]);
        const grande_final_bracket = getPlayer_1_win();
        if (grande_final_bracket) {
            match6_winner = match5_winner;
            match6_loser = match4_winner;
        }
        else {
            match6_winner = match4_winner;
            match6_loser = match5_winner;
        }
        match6_winner.style.top = POSITIONS.grande_final.winner.top;
        match6_winner.style.left = POSITIONS.grande_final.winner.left;
        match6_loser.style.color = 'red';
    }
}
/**
 * Highlights the players who are currently active in the tournament
 * @param players - The players to highlight
 */
function highlightNextPlayers(...players) {
    // D'abord réinitialiser tous les joueurs
    const allPlayers = document.querySelectorAll('.player');
    allPlayers.forEach((p) => {
        const player = p;
        player.style.filter = "brightness(1)";
        player.style.color = "";
        player.style.transform = "";
        player.style.textShadow = "";
        player.style.fontWeight = "";
    });
    // Mettre en évidence les joueurs actifs
    players.forEach((player) => {
        if (player) {
            // Effet de lumière beaucoup plus prononcé
            player.style.filter = "brightness(2.0) saturate(2.0)";
            // Couleur de texte très visible
            player.style.color = "#FFFF00"; // Jaune vif
            // Légère mise à l'échelle pour attirer l'attention
            player.style.transform = "scale(1.1)";
            // Ajouter un halo de texte pour plus de luminosité
            player.style.textShadow = "0 0 10px rgba(255, 255, 0, 0.8)";
            // Texte en gras pour plus de visibilité
            player.style.fontWeight = "bold";
            // Transition douce pour les changements
            player.style.transition = "all 0.3s ease-in-out";
        }
    });
}
// Fonction pour réinitialiser la mise en évidence des joueurs
function resetHighlight(players) {
    players.forEach(player => {
        if (player) {
            player.style.filter = "brightness(1)";
            player.style.color = "";
            player.style.transform = "";
            player.style.textShadow = "";
            player.style.fontWeight = "";
            player.style.transition = "all 0.3s ease-in-out";
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91cm5hbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvdXJuYW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDcEYsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGVBQWUsRUFBbUIsTUFBTSxzQ0FBc0MsQ0FBQztBQUV4RixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFFZCxJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztBQUU5QixNQUFNLENBQUMsT0FBTyxNQUFPLFNBQVEsWUFBWTtJQUVyQztRQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVsQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLGFBQWEsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFDRCw0RUFBNEU7SUFDMUUsQ0FBQztJQUVKLEtBQUssQ0FBQyxPQUFPO1FBQ1osT0FBTyxRQUFRLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFpRGYsQ0FBQztJQUNGLENBQUM7SUFFRCxlQUFlO1FBRWQsUUFBUSxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDdEYscUJBQXFCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIs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aWV3VHJhbnNpdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3ZpZXdzL2NhbWVyYS5qc1wiO1xuaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tIFwiLi9BYnN0cmFjdFZpZXcuanNcIjtcbmltcG9ydCB7IHN0YXJ0VG91cm5hbWVudEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IGdldFBsYXllcl8xX3dpbiwgZ2V0UGxheWVyXzJfd2luIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zY29yZS5qc1wiO1xuXG5sZXQgY291bnQgPSAwO1xuXG5sZXQgdG91cm5hbWVudFN0YXJ0ZWQgPSBmYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXHRwcml2YXRlIGdhbWVMb29wOiBOb2RlSlMuVGltZW91dDsgIC8vIE5PVEUgLSBvciAnYW55J1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNldFRpdGxlKFwiVG91cm5hbWVudFwiKTtcblxuXHRcdGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IFwiL3RvdXJuYW1lbnRcIikge1xuXHRcdFx0dGhpcy5nYW1lTG9vcCA9IHNldEludGVydmFsKCgpID0+IHRoaXMuY2hlY2t0b3VybmFtZW50c3RhcnQoKSwgMTAwMCk7XG5cdFx0fVxuXHRcdC8vIHRvdXJuYW1lbnRTdGFydGVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvdXJuYW1lbnRTdGFydGVkJykgPT09ICd0cnVlJztcbiAgICB9XG5cblx0YXN5bmMgZ2V0SHRtbCgpIHtcblx0XHRyZXR1cm4gLypodG1sKi9gXG5cdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvdG91cm5hbWVudC5jc3NcIj5cblx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwidG91cm5hbWVudF92aWV3XCIgaWQ9XCJ0b3VybmFtZW50X3ZpZXdcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ0b3VybmFtZW50X3ZpZXctY29udGVudFwiPlxuXHRcdFx0XHQ8aDE+VE9VUk5BTUVOVDwvaDE+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJzdGFydF90b3VybmFtZW50XCIgY2xhc3M9XCJidG5fc3RhcnRfdG91cm5hbWVudFwiPlNUQVJUPC9idXR0b24+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50XCIgY2xhc3M9XCJidG5fYmFja190b3VybmFtZW50XCI+QkFDSzwvYnV0dG9uPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyX25hbWVfcGxheWVyXCIgaWQ9XCJjb250YWluZXJfbmFtZV9wbGF5ZXJcIj5cblx0XHRcdFx0XHQ8aDE+Q3VzdG9taXplIHlvdXIgbmFtZTwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInBsYXllcjFcIj5wbGF5ZXIgMTwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInBsYXllcjFcIiBjbGFzcz1cImlucHV0X25hbWVfcGxheWVyXCIgcGxhY2Vob2xkZXI9XCJQbGF5ZXIgbmFtZSAxXCI+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInBsYXllcjJcIj5wbGF5ZXIgMjwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInBsYXllcjJcIiBjbGFzcz1cImlucHV0X25hbWVfcGxheWVyXCIgcGxhY2Vob2xkZXI9XCJQbGF5ZXIgbmFtZXIgMlwiPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwbGF5ZXIzXCI+cGxheWVyIDM8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJwbGF5ZXIzXCIgY2xhc3M9XCJpbnB1dF9uYW1lX3BsYXllclwiIHBsYWNlaG9sZGVyPVwiUGxheWVyIG5hbWVyIDNcIj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGxheWVyNFwiPnBsYXllciA0PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicGxheWVyNFwiIGNsYXNzPVwiaW5wdXRfbmFtZV9wbGF5ZXJcIiBwbGFjZWhvbGRlcj1cIlBsYXllciBuYW1lciA0XCI+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImNvbnRpbnVlXCIgY2xhc3M9XCJjb250aW51ZV9idG5cIj5PSzwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInRvdXJuYW1lbnRfZ3JhcGhpY1wiIGlkPVwidG91cm5hbWVudF9ncmFwaGljX2lkXCI+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJ3aW5uZXJCcmFja2V0XCIgaWQ9XCJ3aW5uZXJCcmFja2V0X2lkXCI+V2lubmVyIEJyYWNrZXQ8L3A+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJsb3NlckJyYWNrZXRcIiBpZD1cImxvc2VyQnJhY2tldF9pZFwiPkxvc2VyIEJyYWNrZXQ8L3A+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJqb3VldXIxXCIgaWQ9XCJqb3VldXIxX2lkXCI+am91ZXVyIDE8L3A+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJqb3VldXIyXCIgaWQ9XCJqb3VldXIyX2lkXCI+am91ZXVyIDI8L3A+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJqb3VldXIzXCIgaWQ9XCJqb3VldXIzX2lkXCI+am91ZXVyIDM8L3A+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJqb3VldXI0XCIgaWQ9XCJqb3VldXI0X2lkXCI+am91ZXVyIDQ8L3A+XG5cdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RvdXJuYW1lbnRfd2l0aF9icmFja2V0LnN2Z1wiIGFsdD1cInRvdXJuYW1lbnRcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwic3RhcnRfZ2FtZVwiIGNsYXNzPVwiYnRuX3N0YXJ0X2dhbWVcIj5cblx0XHRcdFx0XHRcdDxhIGhyZWY9XCIvdG91cm5hbWVudF9nYW1lXCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5KT1VFUjwvYT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiZmluaWNoZWRfZ2FtZVwiIGNsYXNzPVwiYnRuX2ZpbmlzaGVkX2dhbWVcIj5GSU5JU0hFRDwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gaWQ9XCJsZWF2ZV90b3VybmFtZW50XCIgY2xhc3M9XCJidG5fbGVhdmVfdG91cm5hbWVudFwiPlg8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJtZXNzYWdlXCIgaWQ9XCJtZXNzYWdlX2lkXCI+XG5cdFx0XHRcdFx0PHA+QVRURU5USU9OIDogU2kgdm91cyBxdWl0dGV6IGxlIHRvdXJub2ksIHZvdXMgbmUgcG91cnJleiBwYXMgcmV2ZW5pciBlbiBhcnJpw6hyZS48L3A+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImNsb3NlX21lc3NhZ2VcIiBpZD1cImNsb3NlX21lc3NhZ2VfaWRcIj5YPC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImNvbWZpcm1fbGVhdmVfdG91cm5hbWVudFwiIGlkPVwiY29uZmlybV9sZWF2ZV90b3VybmFtZW50XCI+UXVpdHRlciBsZSB0b3Vybm9pPC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XHRcblx0XHQ8L2Rpdj5cblx0YDtcblx0fVxuXG5cdGV4aXRfdG91cm5hbWVudCgpXG5cdHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKCd2dWUyJywgJ3RvdXJuYW1lbnQnKTtcblx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHR9KTtcblx0fVxuXG5cdHN0YXJ0X3RvdXJuYW1lbnRfZ2FtZSgpXG5cdHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRfZ2FtZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1N0YXJ0IGdhbWUgY2xpY2tlZCcpO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKCd0b3VybmFtZW50X2dhbWVfc3RhcnQnLCAndG91cm5hbWVudCcpO1xuXHRcdFx0c3RhcnRUb3VybmFtZW50R2FtZSgpO1xuXHRcdFx0Y291bnQgPSBwYXJzZUludChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG91cm5hbWVudENvdW50JykpIHx8IDA7XG5cdFx0XHRjb3VudCsrO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvdXJuYW1lbnRDb3VudCcsIGNvdW50LnRvU3RyaW5nKCkpO1xuXHRcdFx0aWYgKGNvdW50ID49IDYpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IHN0YXJ0X2dhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRfZ2FtZScpO1xuXHRcdFx0XHRzdGFydF9nYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRcdGNvbnN0IGZpbmljaGVkX2dhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluaWNoZWRfZ2FtZScpO1xuXHRcdFx0XHRmaW5pY2hlZF9nYW1lLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0aW5pdF90b3VybmFtZW50KClcblx0e1xuXHRcdGNvbnN0IGpvdWV1cjFfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91ZXVyMV9pZCcpO1xuXHRcdGNvbnN0IGpvdWV1cjJfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91ZXVyMl9pZCcpO1xuXHRcdGNvbnN0IGpvdWV1cjNfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91ZXVyM19pZCcpO1xuXHRcdGNvbnN0IGpvdWV1cjRfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91ZXVyNF9pZCcpO1xuXG5cdFx0dXBkYXRlVG91cm5hbWVudFN0YXRlKGNvdW50LCBqb3VldXIxX2lkLCBqb3VldXIyX2lkLCBqb3VldXIzX2lkLCBqb3VldXI0X2lkKTtcblxuXHRcdGNvbnN0IGNvdW50RnJvbVN0b3JhZ2UgPSBwYXJzZUludChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG91cm5hbWVudENvdW50JykpIHx8IDA7XG5cdFx0Y29uc29sZS5sb2coJ1RvdXJuYW1lbnQgY291bnQ6JywgY291bnQpO1xuXHRcdGNvbnNvbGUubG9nKCdUb3VybmFtZW50IHN0YXJ0ZWQ6JywgdG91cm5hbWVudFN0YXJ0ZWQpO1xuXHRcdGNvbnNvbGUubG9nKCdUb3VybmFtZW50IGNvdW50IGZyb20gc3RvcmFnZTonLCBjb3VudEZyb21TdG9yYWdlKTtcblxuXHRcdGlmIChjb3VudEZyb21TdG9yYWdlID49IDYpIHtcblx0XHRcdGNvbnN0IHN0YXJ0R2FtZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydF9nYW1lJyk7XG5cdFx0XHRjb25zdCBmaW5pc2hHYW1lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmljaGVkX2dhbWUnKTtcblxuXHRcdFx0aWYgKHN0YXJ0R2FtZUJ0bikgc3RhcnRHYW1lQnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRpZiAoZmluaXNoR2FtZUJ0bikgZmluaXNoR2FtZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZmluaXNoR2FtZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5pY2hlZF9nYW1lJyk7XG5cdFx0XHRpZiAoZmluaXNoR2FtZUJ0bikgZmluaXNoR2FtZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdH1cblx0fVxuXG5cbiAgICB0b3VybmFtZW50X2V2ZW50KCkge1xuICAgICAgICBjb25zdCBzdGFydF90b3VybmFtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0X3RvdXJuYW1lbnQnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyX25hbWVfcGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcl9uYW1lX3BsYXllcicpO1xuICAgICAgICBjb25zdCB0b3VybmFtZW50X2dyYXBoaWNfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG91cm5hbWVudF9ncmFwaGljX2lkJyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50Jyk7XG5cdFx0Y29uc3QgZmluaXNoX3RvdXJuYW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluaWNoZWRfZ2FtZScpO1xuXG5cdFx0c3RhcnRfdG91cm5hbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHRvdXJuYW1lbnRTdGFydGVkID0gdHJ1ZTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b3VybmFtZW50U3RhcnRlZCcsIHRvdXJuYW1lbnRTdGFydGVkLnRvU3RyaW5nKCkpO1xuXHRcdFx0Y29udGFpbmVyX25hbWVfcGxheWVyLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0c3RhcnRfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0YmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdH0pO1xuXG5cdFx0Y29uc3QgbGVhdmVfdG91cm5hbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsZWF2ZV90b3VybmFtZW50Jyk7XG5cdFx0Y29uc3QgbWVzc2FnZV9pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlX2lkJyk7XG5cblx0XHRsZWF2ZV90b3VybmFtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bWVzc2FnZV9pZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5zdHlsZS5maWx0ZXIgPSBcImJsdXIoNXB4KVwiO1xuXHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcblx0XHR9KTtcblxuXHRcdGNvbnN0IGNsb3NlX21lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VfbWVzc2FnZV9pZCcpO1xuXG5cdFx0Y2xvc2VfbWVzc2FnZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG1lc3NhZ2VfaWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuc3R5bGUuZmlsdGVyID0gXCJub25lXCI7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYXV0b1wiO1xuXHRcdH0pO1xuXG5cdFx0Y29uc3QgY29uZmlybV9sZWF2ZV90b3VybmFtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbmZpcm1fbGVhdmVfdG91cm5hbWVudCcpO1xuXG5cdFx0Ly8gR2V0IHRoZSBwbGF5ZXIgZWxlbWVudHNcblx0XHRjb25zdCBqb3VldXIxX2lkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pvdWV1cjFfaWQnKTtcblx0XHRjb25zdCBqb3VldXIyX2lkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pvdWV1cjJfaWQnKTtcblx0XHRjb25zdCBqb3VldXIzX2lkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pvdWV1cjNfaWQnKTtcblx0XHRjb25zdCBqb3VldXI0X2lkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pvdWV1cjRfaWQnKTtcblxuXHRcdGNvbmZpcm1fbGVhdmVfdG91cm5hbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG1lc3NhZ2VfaWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuc3R5bGUuZmlsdGVyID0gXCJub25lXCI7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYXV0b1wiO1xuXHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0Y29udGFpbmVyX25hbWVfcGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdFx0dG91cm5hbWVudFN0YXJ0ZWQgPSBmYWxzZTtcblx0XHRcdFxuXHRcdFx0cmVzZXRUb3VybmFtZW50U3RhdGUoam91ZXVyMV9pZCwgam91ZXVyMl9pZCwgam91ZXVyM19pZCwgam91ZXVyNF9pZCk7XG5cdFx0XHRiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0c3RhcnRfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHR9KTtcblxuXHRcdGZpbmlzaF90b3VybmFtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0Y29udGFpbmVyX25hbWVfcGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdFx0dG91cm5hbWVudFN0YXJ0ZWQgPSBmYWxzZTtcblx0XHRcdHJlc2V0VG91cm5hbWVudFN0YXRlKGpvdWV1cjFfaWQsIGpvdWV1cjJfaWQsIGpvdWV1cjNfaWQsIGpvdWV1cjRfaWQpO1xuXHRcdFx0YmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdHN0YXJ0X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRjb3VudCA9IDA7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG91cm5hbWVudENvdW50JywgY291bnQudG9TdHJpbmcoKSk7XG5cdFx0fSk7XG4gICAgfVxuXG5cdGNoZWNrdG91cm5hbWVudHN0YXJ0KCkge1xuXHRcdGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IFwiL3RvdXJuYW1lbnRcIilcblx0XHR7XG5cdFx0XHQvLyBSw6ljdXDDqXJlciB0b3VzIGxlcyDDqWzDqW1lbnRzIG7DqWNlc3NhaXJlc1xuXHRcdFx0Y29uc3QgY29udGFpbmVyX25hbWVfcGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcl9uYW1lX3BsYXllcicpO1xuXHRcdFx0Y29uc3QgdG91cm5hbWVudF9ncmFwaGljX2lkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvdXJuYW1lbnRfZ3JhcGhpY19pZCcpO1xuXHRcdFx0Y29uc3Qgc3RhcnRfdG91cm5hbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydF90b3VybmFtZW50Jyk7XG5cdFx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQnKTtcblx0XHRcdFxuXHRcdFx0Ly8gVsOpcmlmaWVyIHF1ZSB0b3VzIGxlcyDDqWzDqW1lbnRzIGV4aXN0ZW50IGF2YW50IGRlIGxlcyBtYW5pcHVsZXJcblx0XHRcdGlmICghY29udGFpbmVyX25hbWVfcGxheWVyIHx8ICF0b3VybmFtZW50X2dyYXBoaWNfaWQgfHwgIXN0YXJ0X3RvdXJuYW1lbnQgfHwgIWJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuOyAvLyBTb3J0aXIgZGUgbGEgZm9uY3Rpb24gc2kgdW4gw6lsw6ltZW50IGVzdCBtYW5xdWFudFxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAodG91cm5hbWVudFN0YXJ0ZWQgPT0gdHJ1ZSkge1xuXHRcdFx0XHRjb250YWluZXJfbmFtZV9wbGF5ZXIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0c3RhcnRfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0XHRiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoY29udGFpbmVyX25hbWVfcGxheWVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJykpIHtcblx0XHRcdFx0XHRjb250YWluZXJfbmFtZV9wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdHN0YXJ0X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRcdFx0YmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5jb25zdCBQT1NJVElPTlMgPVxue1xuXHRyb3VuZDE6IHtcblx0XHRwbGF5ZXIxOiB7IHRvcDogJycsIGxlZnQ6ICcnIH0sXG5cdFx0cGxheWVyMjogeyB0b3A6ICcnLCBsZWZ0OiAnJyB9LFxuXHRcdHBsYXllcjM6IHsgdG9wOiAnJywgbGVmdDogJycgfSxcblx0XHRwbGF5ZXI0OiB7IHRvcDogJycsIGxlZnQ6ICcnIH1cblx0fSxcblx0cXVhcnRfd2lubmVyOiB7XG5cdFx0d2lubmVyMV8yOiB7IHRvcDogJzEyJScsIGxlZnQ6ICczOCUnIH0sXG5cdFx0bG9zZXIxXzI6IHsgdG9wOiAnNjIlJywgbGVmdDogJzI0JScgfSxcblx0XHR3aW5uZXIzXzQ6IHsgdG9wOiAnMzIlJywgbGVmdDogJzM4JScgfSxcblx0XHRsb3NlcjNfNDogeyB0b3A6ICc3MCUnLCBsZWZ0OiAnMjQlJyB9LFxuXHR9LFxuXHRxdWFydF9sb3Nlcjoge1xuXHRcdHdpbm5lcjogeyB0b3A6ICc2NyUnLCBsZWZ0OiAnMzglJyB9LFxuXHR9LFxuXHRkZW1pX3dpbmVyOiB7XG5cdFx0d2lubmVyOiB7IHRvcDogJzM0JScsIGxlZnQ6ICc1OCUnIH0sXG5cdFx0bG9zZXI6IHsgdG9wOiAnNzUlJywgbGVmdDogJzM4JScgfSxcblx0fSxcblx0ZGVtaV9sb3Nlcjoge1xuXHRcdHdpbm5lcjogeyB0b3A6ICc0MyUnLCBsZWZ0OiAnNTglJyB9LFxuXHR9LFxuXHRncmFuZGVfZmluYWw6XG5cdHtcblx0XHR3aW5uZXI6IHsgdG9wOiAnMzglJywgbGVmdDogJzcyJScgfSxcblx0fSxcbn07XG5cbmludGVyZmFjZSBQbGF5ZXJFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRzdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbjtcbn1cblxuaW50ZXJmYWNlIFRvdXJuYW1lbnRQbGF5ZXJTdGF0ZSB7XG5cdGVsZW1lbnQ6IFBsYXllckVsZW1lbnQ7XG5cdHBvc2l0aW9uPzoge1xuXHRcdHRvcDogc3RyaW5nO1xuXHRcdGxlZnQ6IHN0cmluZztcblx0fTtcblx0Y29sb3I6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gcmVzZXRUb3VybmFtZW50U3RhdGUoam91ZXVyMV9pZDogUGxheWVyRWxlbWVudCwgam91ZXVyMl9pZDogUGxheWVyRWxlbWVudCwgam91ZXVyM19pZDogUGxheWVyRWxlbWVudCwgam91ZXVyNF9pZDogUGxheWVyRWxlbWVudCk6IHZvaWQge1xuXHQvLyBjb3VudCA9IDA7XG5cdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b3VybmFtZW50Q291bnQnLCBjb3VudC50b1N0cmluZygpKTtcblx0Y29uc3Qgam91ZXVyczogUGxheWVyRWxlbWVudFtdID0gW2pvdWV1cjFfaWQsIGpvdWV1cjJfaWQsIGpvdWV1cjNfaWQsIGpvdWV1cjRfaWRdO1xuXG5cdGpvdWV1cnMuZm9yRWFjaChqb3VldXIgPT4ge1xuXHRcdGpvdWV1ci5zdHlsZS50b3AgPSAnJztcblx0XHRqb3VldXIuc3R5bGUubGVmdCA9ICcnO1xuXHRcdGpvdWV1ci5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XG5cdH0pO1xufVxuXG5pbnRlcmZhY2UgUGxheWVyRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblx0c3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb247XG59XG5cbmludGVyZmFjZSBNYXRjaFJlc3VsdCB7XG5cdHdpbm5lcjogUGxheWVyRWxlbWVudDtcblx0bG9zZXI6IFBsYXllckVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvdXJuYW1lbnRTdGF0ZShcblx0Y291bnQ6IG51bWJlciwgXG5cdGpvdWV1cjFfaWQ6IFBsYXllckVsZW1lbnQsIFxuXHRqb3VldXIyX2lkOiBQbGF5ZXJFbGVtZW50LCBcblx0am91ZXVyM19pZDogUGxheWVyRWxlbWVudCwgXG5cdGpvdWV1cjRfaWQ6IFBsYXllckVsZW1lbnRcbik6IHZvaWQge1xuXHRyZXNldFRvdXJuYW1lbnRTdGF0ZShqb3VldXIxX2lkLCBqb3VldXIyX2lkLCBqb3VldXIzX2lkLCBqb3VldXI0X2lkKTtcblx0Y29uc29sZS5sb2coJ0NvdW50OicsIGNvdW50KTtcblxuXHRsZXQgbWF0Y2gxX3dpbm5lcjogUGxheWVyRWxlbWVudCB8IHVuZGVmaW5lZCwgXG5cdFx0bWF0Y2gxX2xvc2VyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLCBcblx0XHRtYXRjaDJfd2lubmVyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLCBcblx0XHRtYXRjaDJfbG9zZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsIFxuXHRcdG1hdGNoM193aW5uZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsIFxuXHRcdG1hdGNoM19sb3NlcjogUGxheWVyRWxlbWVudCB8IHVuZGVmaW5lZCwgXG5cdFx0bWF0Y2g0X3dpbm5lcjogUGxheWVyRWxlbWVudCB8IHVuZGVmaW5lZCwgXG5cdFx0bWF0Y2g0X2xvc2VyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLCBcblx0XHRtYXRjaDVfd2lubmVyOiBQbGF5ZXJFbGVtZW50IHwgdW5kZWZpbmVkLCBcblx0XHRtYXRjaDVfbG9zZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsIFxuXHRcdG1hdGNoNl93aW5uZXI6IFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQsIFxuXHRcdG1hdGNoNl9sb3NlcjogUGxheWVyRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuXHRpZiAoY291bnQgPj0gMCkge1xuXHRcdGNvbnN0IHBsYXllcnM6IFBsYXllckVsZW1lbnRbXSA9IFtqb3VldXIxX2lkLCBqb3VldXIyX2lkLCBqb3VldXIzX2lkLCBqb3VldXI0X2lkXTtcblx0XHRjb25zdCBwb3NpdGlvbnMgPSBPYmplY3QudmFsdWVzKFBPU0lUSU9OUy5yb3VuZDEpO1xuXHRcdFxuXHRcdHBsYXllcnMuZm9yRWFjaCgoam91ZXVyLCBpbmRleCkgPT4ge1xuXHRcdFx0am91ZXVyLnN0eWxlLnRvcCA9IHBvc2l0aW9uc1tpbmRleF0udG9wO1xuXHRcdFx0am91ZXVyLnN0eWxlLmxlZnQgPSBwb3NpdGlvbnNbaW5kZXhdLmxlZnQ7XG5cdFx0XHRqb3VldXIuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuXG5cdFx0XHRoaWdobGlnaHROZXh0UGxheWVycyhqb3VldXIxX2lkLCBqb3VldXIyX2lkKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmIChjb3VudCA+PSAxKSB7XG5cdFx0cmVzZXRIaWdobGlnaHQoW2pvdWV1cjFfaWQsIGpvdWV1cjJfaWRdKTtcblx0XHRjb25zb2xlLmxvZygnTWF0Y2ggMScpO1xuXHRcdGNvbnNvbGUubG9nKFwicm91bmQxXCIpO1xuXHRcdGNvbnN0IHBsYXllcjFfd2luczogYm9vbGVhbiA9IGdldFBsYXllcl8xX3dpbigpO1xuXG5cdFx0aWYgKHBsYXllcjFfd2lucykge1xuXHRcdFx0bWF0Y2gxX3dpbm5lciA9IGpvdWV1cjFfaWQ7XG5cdFx0XHRtYXRjaDFfbG9zZXIgPSBqb3VldXIyX2lkO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXRjaDFfd2lubmVyID0gam91ZXVyMl9pZDtcblx0XHRcdG1hdGNoMV9sb3NlciA9IGpvdWV1cjFfaWQ7XG5cdFx0fVxuXHRcdFxuXHRcdG1hdGNoMV93aW5uZXIuc3R5bGUudG9wID0gUE9TSVRJT05TLnF1YXJ0X3dpbm5lci53aW5uZXIxXzIudG9wO1xuXHRcdG1hdGNoMV93aW5uZXIuc3R5bGUubGVmdCA9IFBPU0lUSU9OUy5xdWFydF93aW5uZXIud2lubmVyMV8yLmxlZnQ7XG5cdFx0bWF0Y2gxX2xvc2VyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5xdWFydF93aW5uZXIubG9zZXIxXzIudG9wO1xuXHRcdG1hdGNoMV9sb3Nlci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLnF1YXJ0X3dpbm5lci5sb3NlcjFfMi5sZWZ0O1xuXG5cdFx0aGlnaGxpZ2h0TmV4dFBsYXllcnMoam91ZXVyM19pZCwgam91ZXVyNF9pZCk7XG5cdH1cblxuXHRpZiAoY291bnQgPj0gMikge1xuXHRcdHJlc2V0SGlnaGxpZ2h0KFtqb3VldXIzX2lkLCBqb3VldXI0X2lkXSk7XG5cdFx0Y29uc29sZS5sb2coJ01hdGNoIDInKTtcblx0XHRjb25zb2xlLmxvZyhcInJvdW5kMlwiKTtcblx0XHRjb25zdCBwbGF5ZXIxX3dpbnM6IGJvb2xlYW4gPSBnZXRQbGF5ZXJfMV93aW4oKTtcblxuXHRcdGlmIChwbGF5ZXIxX3dpbnMpIHtcblx0XHRcdG1hdGNoMl93aW5uZXIgPSBqb3VldXIzX2lkO1xuXHRcdFx0bWF0Y2gyX2xvc2VyID0gam91ZXVyNF9pZDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2gyX3dpbm5lciA9IGpvdWV1cjRfaWQ7XG5cdFx0XHRtYXRjaDJfbG9zZXIgPSBqb3VldXIzX2lkO1xuXHRcdH1cblx0XHRcblx0XHRtYXRjaDJfd2lubmVyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5xdWFydF93aW5uZXIud2lubmVyM180LnRvcDtcblx0XHRtYXRjaDJfd2lubmVyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMucXVhcnRfd2lubmVyLndpbm5lcjNfNC5sZWZ0O1xuXG5cdFx0bWF0Y2gyX2xvc2VyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5xdWFydF93aW5uZXIubG9zZXIzXzQudG9wO1xuXHRcdG1hdGNoMl9sb3Nlci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLnF1YXJ0X3dpbm5lci5sb3NlcjNfNC5sZWZ0O1xuXHRcdGhpZ2hsaWdodE5leHRQbGF5ZXJzKG1hdGNoMV9sb3NlciwgbWF0Y2gyX2xvc2VyKTtcblx0fVxuXG5cdGlmIChjb3VudCA+PSAzICYmIG1hdGNoMV9sb3NlciAmJiBtYXRjaDJfbG9zZXIpIHtcblx0XHRyZXNldEhpZ2hsaWdodChbbWF0Y2gxX2xvc2VyLCBtYXRjaDJfbG9zZXJdKTtcblx0XHRjb25zdCBxdWFydF9sb3Nlcl9icmFja2V0OiBib29sZWFuID0gZ2V0UGxheWVyXzFfd2luKCk7XG5cblx0XHRpZiAocXVhcnRfbG9zZXJfYnJhY2tldCkge1xuXHRcdFx0bWF0Y2gzX3dpbm5lciA9IG1hdGNoMV9sb3Nlcjtcblx0XHRcdG1hdGNoM19sb3NlciA9IG1hdGNoMl9sb3Nlcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2gzX3dpbm5lciA9IG1hdGNoMV9sb3Nlcjtcblx0XHRcdG1hdGNoM19sb3NlciA9IG1hdGNoMl9sb3Nlcjtcblx0XHR9XG5cdFx0bWF0Y2gzX3dpbm5lci5zdHlsZS50b3AgPSBQT1NJVElPTlMucXVhcnRfbG9zZXIud2lubmVyLnRvcDtcblx0XHRtYXRjaDNfd2lubmVyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMucXVhcnRfbG9zZXIud2lubmVyLmxlZnQ7XG5cblx0XHRtYXRjaDNfbG9zZXIuc3R5bGUuY29sb3IgPSAncmVkJztcblxuXHRcdGhpZ2hsaWdodE5leHRQbGF5ZXJzKG1hdGNoMV93aW5uZXIsIG1hdGNoMl93aW5uZXIpO1xuXHR9XG5cblx0aWYgKGNvdW50ID49IDQgJiYgbWF0Y2gxX3dpbm5lciAmJiBtYXRjaDJfd2lubmVyKSB7XG5cdFx0cmVzZXRIaWdobGlnaHQoW21hdGNoMV93aW5uZXIsIG1hdGNoMl93aW5uZXJdKTtcblx0XHRjb25zdCBkZW1pX3dpbm5lcl9icmFja2V0OiBib29sZWFuID0gZ2V0UGxheWVyXzFfd2luKCk7XG5cblx0XHRpZiAoZGVtaV93aW5uZXJfYnJhY2tldCkge1xuXHRcdFx0bWF0Y2g0X3dpbm5lciA9IG1hdGNoMV93aW5uZXI7XG5cdFx0XHRtYXRjaDRfbG9zZXIgPSBtYXRjaDJfd2lubmVyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXRjaDRfd2lubmVyID0gbWF0Y2gyX3dpbm5lcjtcblx0XHRcdG1hdGNoNF9sb3NlciA9IG1hdGNoMV93aW5uZXI7XG5cdFx0fVxuXHRcdFxuXHRcdG1hdGNoNF93aW5uZXIuc3R5bGUudG9wID0gUE9TSVRJT05TLmRlbWlfd2luZXIud2lubmVyLnRvcDtcblx0XHRtYXRjaDRfd2lubmVyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMuZGVtaV93aW5lci53aW5uZXIubGVmdDtcblxuXHRcdG1hdGNoNF9sb3Nlci5zdHlsZS50b3AgPSBQT1NJVElPTlMuZGVtaV93aW5lci5sb3Nlci50b3A7XG5cdFx0bWF0Y2g0X2xvc2VyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMuZGVtaV93aW5lci5sb3Nlci5sZWZ0O1xuXG5cdFx0aGlnaGxpZ2h0TmV4dFBsYXllcnMobWF0Y2gzX3dpbm5lciwgbWF0Y2g0X2xvc2VyKTtcblx0fVxuXG5cdGlmIChjb3VudCA+PSA1ICYmIG1hdGNoM19sb3NlciAmJiBtYXRjaDRfbG9zZXIpIHtcblx0XHRyZXNldEhpZ2hsaWdodChbbWF0Y2gzX2xvc2VyLCBtYXRjaDRfbG9zZXJdKTtcblx0XHRjb25zdCBkZW1pX2xvc2VyX2JyYWNrZXQ6IGJvb2xlYW4gPSBnZXRQbGF5ZXJfMV93aW4oKTtcblxuXHRcdGlmIChkZW1pX2xvc2VyX2JyYWNrZXQpIHtcblx0XHRcdG1hdGNoNV93aW5uZXIgPSBtYXRjaDNfbG9zZXI7XG5cdFx0XHRtYXRjaDVfbG9zZXIgPSBtYXRjaDRfbG9zZXI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1hdGNoNV93aW5uZXIgPSBtYXRjaDRfbG9zZXI7XG5cdFx0XHRtYXRjaDVfbG9zZXIgPSBtYXRjaDNfbG9zZXI7XG5cdFx0fVxuXHRcdFxuXHRcdG1hdGNoNV93aW5uZXIuc3R5bGUudG9wID0gUE9TSVRJT05TLmRlbWlfbG9zZXIud2lubmVyLnRvcDtcblx0XHRtYXRjaDVfd2lubmVyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMuZGVtaV9sb3Nlci53aW5uZXIubGVmdDtcblxuXHRcdG1hdGNoNV9sb3Nlci5zdHlsZS5jb2xvciA9ICdyZWQnO1xuXG5cdFx0aGlnaGxpZ2h0TmV4dFBsYXllcnMobWF0Y2g0X3dpbm5lciwgbWF0Y2g1X3dpbm5lcik7XG5cdH1cblxuXHRpZiAoY291bnQgPj0gNiAmJiBtYXRjaDVfd2lubmVyICYmIG1hdGNoNF93aW5uZXIpIHtcblx0XHRyZXNldEhpZ2hsaWdodChbbWF0Y2g1X3dpbm5lciwgbWF0Y2g0X3dpbm5lcl0pO1xuXHRcdGNvbnN0IGdyYW5kZV9maW5hbF9icmFja2V0OiBib29sZWFuID0gZ2V0UGxheWVyXzFfd2luKCk7XG5cblx0XHRpZiAoZ3JhbmRlX2ZpbmFsX2JyYWNrZXQpIHtcblx0XHRcdG1hdGNoNl93aW5uZXIgPSBtYXRjaDVfd2lubmVyO1xuXHRcdFx0bWF0Y2g2X2xvc2VyID0gbWF0Y2g0X3dpbm5lcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2g2X3dpbm5lciA9IG1hdGNoNF93aW5uZXI7XG5cdFx0XHRtYXRjaDZfbG9zZXIgPSBtYXRjaDVfd2lubmVyO1xuXHRcdH1cblx0XHRcblx0XHRtYXRjaDZfd2lubmVyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5ncmFuZGVfZmluYWwud2lubmVyLnRvcDtcblx0XHRtYXRjaDZfd2lubmVyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMuZ3JhbmRlX2ZpbmFsLndpbm5lci5sZWZ0O1xuXG5cdFx0bWF0Y2g2X2xvc2VyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG5cdH1cbn1cblxuLy8gSW50ZXJmYWNlIGZvciBwbGF5ZXIgZWxlbWVudHNcbmludGVyZmFjZSBQbGF5ZXJFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRzdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbjtcbn1cblxuLyoqXG4gKiBIaWdobGlnaHRzIHRoZSBwbGF5ZXJzIHdobyBhcmUgY3VycmVudGx5IGFjdGl2ZSBpbiB0aGUgdG91cm5hbWVudFxuICogQHBhcmFtIHBsYXllcnMgLSBUaGUgcGxheWVycyB0byBoaWdobGlnaHRcbiAqL1xuZnVuY3Rpb24gaGlnaGxpZ2h0TmV4dFBsYXllcnMoLi4ucGxheWVyczogKFBsYXllckVsZW1lbnQgfCB1bmRlZmluZWQpW10pOiB2b2lkIHtcblx0Ly8gRCdhYm9yZCByw6lpbml0aWFsaXNlciB0b3VzIGxlcyBqb3VldXJzXG5cdGNvbnN0IGFsbFBsYXllcnM6IE5vZGVMaXN0T2Y8RWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyJyk7XG5cdGFsbFBsYXllcnMuZm9yRWFjaCgocDogRWxlbWVudCkgPT4ge1xuXHRcdGNvbnN0IHBsYXllciA9IHAgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0cGxheWVyLnN0eWxlLmZpbHRlciA9IFwiYnJpZ2h0bmVzcygxKVwiO1xuXHRcdHBsYXllci5zdHlsZS5jb2xvciA9IFwiXCI7XG5cdFx0cGxheWVyLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG5cdFx0cGxheWVyLnN0eWxlLnRleHRTaGFkb3cgPSBcIlwiO1xuXHRcdHBsYXllci5zdHlsZS5mb250V2VpZ2h0ID0gXCJcIjtcblx0fSk7XG5cdFxuXHQvLyBNZXR0cmUgZW4gw6l2aWRlbmNlIGxlcyBqb3VldXJzIGFjdGlmc1xuXHRwbGF5ZXJzLmZvckVhY2goKHBsYXllcjogUGxheWVyRWxlbWVudCB8IHVuZGVmaW5lZCkgPT4ge1xuXHRcdGlmIChwbGF5ZXIpIHtcblx0XHRcdC8vIEVmZmV0IGRlIGx1bWnDqHJlIGJlYXVjb3VwIHBsdXMgcHJvbm9uY8OpXG5cdFx0XHRwbGF5ZXIuc3R5bGUuZmlsdGVyID0gXCJicmlnaHRuZXNzKDIuMCkgc2F0dXJhdGUoMi4wKVwiO1xuXHRcdFx0Ly8gQ291bGV1ciBkZSB0ZXh0ZSB0csOocyB2aXNpYmxlXG5cdFx0XHRwbGF5ZXIuc3R5bGUuY29sb3IgPSBcIiNGRkZGMDBcIjsgLy8gSmF1bmUgdmlmXG5cdFx0XHQvLyBMw6lnw6hyZSBtaXNlIMOgIGwnw6ljaGVsbGUgcG91ciBhdHRpcmVyIGwnYXR0ZW50aW9uXG5cdFx0XHRwbGF5ZXIuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgxLjEpXCI7XG5cdFx0XHQvLyBBam91dGVyIHVuIGhhbG8gZGUgdGV4dGUgcG91ciBwbHVzIGRlIGx1bWlub3NpdMOpXG5cdFx0XHRwbGF5ZXIuc3R5bGUudGV4dFNoYWRvdyA9IFwiMCAwIDEwcHggcmdiYSgyNTUsIDI1NSwgMCwgMC44KVwiO1xuXHRcdFx0Ly8gVGV4dGUgZW4gZ3JhcyBwb3VyIHBsdXMgZGUgdmlzaWJpbGl0w6lcblx0XHRcdHBsYXllci5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG5cdFx0XHQvLyBUcmFuc2l0aW9uIGRvdWNlIHBvdXIgbGVzIGNoYW5nZW1lbnRzXG5cdFx0XHRwbGF5ZXIuc3R5bGUudHJhbnNpdGlvbiA9IFwiYWxsIDAuM3MgZWFzZS1pbi1vdXRcIjtcblx0XHR9XG5cdH0pO1xufVxuXG4vLyBGb25jdGlvbiBwb3VyIHLDqWluaXRpYWxpc2VyIGxhIG1pc2UgZW4gw6l2aWRlbmNlIGRlcyBqb3VldXJzXG5mdW5jdGlvbiByZXNldEhpZ2hsaWdodChwbGF5ZXJzOiAoUGxheWVyRWxlbWVudCB8IHVuZGVmaW5lZClbXSk6IHZvaWQge1xuXHRwbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcblx0XHRpZiAocGxheWVyKSB7XG5cdFx0XHRwbGF5ZXIuc3R5bGUuZmlsdGVyID0gXCJicmlnaHRuZXNzKDEpXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUuY29sb3IgPSBcIlwiO1xuXHRcdFx0cGxheWVyLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUudGV4dFNoYWRvdyA9IFwiXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUuZm9udFdlaWdodCA9IFwiXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUudHJhbnNpdGlvbiA9IFwiYWxsIDAuM3MgZWFzZS1pbi1vdXRcIjtcblx0XHR9XG5cdH0pO1xufSJdfQ==