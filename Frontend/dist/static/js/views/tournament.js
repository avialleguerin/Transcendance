import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import AbstractView from "./AbstractView.js";
import { startTournamentGame } from "../../../srcs/game/gameplay/babylon.js";
import { getPlayer_1_win, getPlayer_2_win } from "../../../srcs/game/gameplay/score.js";
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
        return `
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
            localStorage.setItem('tournamentCount', count);
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
            localStorage.setItem('tournamentStarted', tournamentStarted);
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
            localStorage.setItem('tournamentCount', count);
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
    localStorage.setItem('tournamentCount', count);
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
function highlightNextPlayers(...players) {
    // D'abord réinitialiser tous les joueurs
    const allPlayers = document.querySelectorAll('.player');
    allPlayers.forEach(p => {
        p.style.filter = "brightness(1)";
        p.style.color = "";
        p.style.transform = "";
        p.style.textShadow = "";
        p.style.fontWeight = "";
    });
    // Mettre en évidence les joueurs actifs
    players.forEach(player => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91cm5hbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3MvdG91cm5hbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNwRixPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRXhGLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUVkLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0FBRTlCLE1BQU0sQ0FBQyxPQUFPLE1BQU8sU0FBUSxZQUFZO0lBQ3JDO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWxDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssYUFBYSxFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUNELDRFQUE0RTtJQUMxRSxDQUFDO0lBRUosS0FBSyxDQUFDLE9BQU87UUFDWixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaURQLENBQUM7SUFDRixDQUFDO0lBRUQsZUFBZTtRQUVkLFFBQVEsQ0FBQyxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3RGLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM1QyxNQUFNLENB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QUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQztRQUNyRCxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsOERBQThEO0FBQzlELFNBQVMsY0FBYyxDQUFDLE9BQU87SUFDOUIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN4QixJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1osTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQztRQUNsRCxDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcbmltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3LmpzXCI7XG5pbXBvcnQgeyBzdGFydFRvdXJuYW1lbnRHYW1lIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9iYWJ5bG9uLmpzXCI7XG5pbXBvcnQgeyBnZXRQbGF5ZXJfMV93aW4sIGdldFBsYXllcl8yX3dpbiB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvc2NvcmUuanNcIjtcblxubGV0IGNvdW50ID0gMDtcblxubGV0IHRvdXJuYW1lbnRTdGFydGVkID0gZmFsc2U7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcIlRvdXJuYW1lbnRcIik7XG5cblx0XHRpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBcIi90b3VybmFtZW50XCIpIHtcblx0XHRcdHRoaXMuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbCgoKSA9PiB0aGlzLmNoZWNrdG91cm5hbWVudHN0YXJ0KCksIDEwMDApO1xuXHRcdH1cblx0XHQvLyB0b3VybmFtZW50U3RhcnRlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b3VybmFtZW50U3RhcnRlZCcpID09PSAndHJ1ZSc7XG4gICAgfVxuXG5cdGFzeW5jIGdldEh0bWwoKSB7XG5cdFx0cmV0dXJuIGBcblx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi4vc3RhdGljL2pzL2Nzcy90b3VybmFtZW50LmNzc1wiPlxuXHRcdDxsaW5rIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJsYWNrK09wcytPbmUmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuXHRcdDxkaXYgY2xhc3M9XCJ0b3VybmFtZW50X3ZpZXdcIiBpZD1cInRvdXJuYW1lbnRfdmlld1wiPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRvdXJuYW1lbnRfdmlldy1jb250ZW50XCI+XG5cdFx0XHRcdDxoMT5UT1VSTkFNRU5UPC9oMT5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cInN0YXJ0X3RvdXJuYW1lbnRcIiBjbGFzcz1cImJ0bl9zdGFydF90b3VybmFtZW50XCI+U1RBUlQ8L2J1dHRvbj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnRcIiBjbGFzcz1cImJ0bl9iYWNrX3RvdXJuYW1lbnRcIj5CQUNLPC9idXR0b24+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJfbmFtZV9wbGF5ZXJcIiBpZD1cImNvbnRhaW5lcl9uYW1lX3BsYXllclwiPlxuXHRcdFx0XHRcdDxoMT5DdXN0b21pemUgeW91ciBuYW1lPC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGxheWVyMVwiPnBsYXllciAxPC9sYWJlbD5cblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicGxheWVyMVwiIGNsYXNzPVwiaW5wdXRfbmFtZV9wbGF5ZXJcIiBwbGFjZWhvbGRlcj1cIlBsYXllciBuYW1lIDFcIj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGxheWVyMlwiPnBsYXllciAyPC9sYWJlbD5cblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicGxheWVyMlwiIGNsYXNzPVwiaW5wdXRfbmFtZV9wbGF5ZXJcIiBwbGFjZWhvbGRlcj1cIlBsYXllciBuYW1lciAyXCI+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInBsYXllcjNcIj5wbGF5ZXIgMzwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInBsYXllcjNcIiBjbGFzcz1cImlucHV0X25hbWVfcGxheWVyXCIgcGxhY2Vob2xkZXI9XCJQbGF5ZXIgbmFtZXIgM1wiPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwbGF5ZXI0XCI+cGxheWVyIDQ8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJwbGF5ZXI0XCIgY2xhc3M9XCJpbnB1dF9uYW1lX3BsYXllclwiIHBsYWNlaG9sZGVyPVwiUGxheWVyIG5hbWVyIDRcIj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiY29udGludWVcIiBjbGFzcz1cImNvbnRpbnVlX2J0blwiPk9LPC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidG91cm5hbWVudF9ncmFwaGljXCIgaWQ9XCJ0b3VybmFtZW50X2dyYXBoaWNfaWRcIj5cblx0XHRcdFx0XHQ8cCBjbGFzcz1cIndpbm5lckJyYWNrZXRcIiBpZD1cIndpbm5lckJyYWNrZXRfaWRcIj5XaW5uZXIgQnJhY2tldDwvcD5cblx0XHRcdFx0XHQ8cCBjbGFzcz1cImxvc2VyQnJhY2tldFwiIGlkPVwibG9zZXJCcmFja2V0X2lkXCI+TG9zZXIgQnJhY2tldDwvcD5cblx0XHRcdFx0XHQ8cCBjbGFzcz1cImpvdWV1cjFcIiBpZD1cImpvdWV1cjFfaWRcIj5qb3VldXIgMTwvcD5cblx0XHRcdFx0XHQ8cCBjbGFzcz1cImpvdWV1cjJcIiBpZD1cImpvdWV1cjJfaWRcIj5qb3VldXIgMjwvcD5cblx0XHRcdFx0XHQ8cCBjbGFzcz1cImpvdWV1cjNcIiBpZD1cImpvdWV1cjNfaWRcIj5qb3VldXIgMzwvcD5cblx0XHRcdFx0XHQ8cCBjbGFzcz1cImpvdWV1cjRcIiBpZD1cImpvdWV1cjRfaWRcIj5qb3VldXIgNDwvcD5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdG91cm5hbWVudF93aXRoX2JyYWNrZXQuc3ZnXCIgYWx0PVwidG91cm5hbWVudFwiPlxuXHRcdFx0XHRcdDxidXR0b24gaWQ9XCJzdGFydF9nYW1lXCIgY2xhc3M9XCJidG5fc3RhcnRfZ2FtZVwiPlxuXHRcdFx0XHRcdFx0PGEgaHJlZj1cIi90b3VybmFtZW50X2dhbWVcIiBjbGFzcz1cIm5hdi1saW5rXCIgZGF0YS1saW5rPkpPVUVSPC9hPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gaWQ9XCJmaW5pY2hlZF9nYW1lXCIgY2xhc3M9XCJidG5fZmluaXNoZWRfZ2FtZVwiPkZJTklTSEVEPC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImxlYXZlX3RvdXJuYW1lbnRcIiBjbGFzcz1cImJ0bl9sZWF2ZV90b3VybmFtZW50XCI+WDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cIm1lc3NhZ2VcIiBpZD1cIm1lc3NhZ2VfaWRcIj5cblx0XHRcdFx0XHQ8cD5BVFRFTlRJT04gOiBTaSB2b3VzIHF1aXR0ZXogbGUgdG91cm5vaSwgdm91cyBuZSBwb3VycmV6IHBhcyByZXZlbmlyIGVuIGFycmnDqHJlLjwvcD5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiY2xvc2VfbWVzc2FnZVwiIGlkPVwiY2xvc2VfbWVzc2FnZV9pZFwiPlg8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiY29tZmlybV9sZWF2ZV90b3VybmFtZW50XCIgaWQ9XCJjb25maXJtX2xlYXZlX3RvdXJuYW1lbnRcIj5RdWl0dGVyIGxlIHRvdXJub2k8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cdFxuXHRcdDwvZGl2PlxuXHRgO1xuXHR9XG5cblx0ZXhpdF90b3VybmFtZW50KClcblx0e1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoJ3Z1ZTInLCAndG91cm5hbWVudCcpO1xuXHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH0pO1xuXHR9XG5cblx0c3RhcnRfdG91cm5hbWVudF9nYW1lKClcblx0e1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydF9nYW1lJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3RhcnQgZ2FtZSBjbGlja2VkJyk7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoJ3RvdXJuYW1lbnRfZ2FtZV9zdGFydCcsICd0b3VybmFtZW50Jyk7XG5cdFx0XHRzdGFydFRvdXJuYW1lbnRHYW1lKCk7XG5cdFx0XHRjb3VudCA9IHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b3VybmFtZW50Q291bnQnKSkgfHwgMDtcblx0XHRcdGNvdW50Kys7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG91cm5hbWVudENvdW50JywgY291bnQpO1xuXHRcdFx0aWYgKGNvdW50ID49IDYpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IHN0YXJ0X2dhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRfZ2FtZScpO1xuXHRcdFx0XHRzdGFydF9nYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRcdGNvbnN0IGZpbmljaGVkX2dhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluaWNoZWRfZ2FtZScpO1xuXHRcdFx0XHRmaW5pY2hlZF9nYW1lLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0aW5pdF90b3VybmFtZW50KClcblx0e1xuXHRcdGNvbnN0IGpvdWV1cjFfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91ZXVyMV9pZCcpO1xuXHRcdGNvbnN0IGpvdWV1cjJfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91ZXVyMl9pZCcpO1xuXHRcdGNvbnN0IGpvdWV1cjNfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91ZXVyM19pZCcpO1xuXHRcdGNvbnN0IGpvdWV1cjRfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91ZXVyNF9pZCcpO1xuXG5cdFx0dXBkYXRlVG91cm5hbWVudFN0YXRlKGNvdW50LCBqb3VldXIxX2lkLCBqb3VldXIyX2lkLCBqb3VldXIzX2lkLCBqb3VldXI0X2lkKTtcblxuXHRcdGNvbnN0IGNvdW50RnJvbVN0b3JhZ2UgPSBwYXJzZUludChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG91cm5hbWVudENvdW50JykpIHx8IDA7XG5cdFx0Y29uc29sZS5sb2coJ1RvdXJuYW1lbnQgY291bnQ6JywgY291bnQpO1xuXHRcdGNvbnNvbGUubG9nKCdUb3VybmFtZW50IHN0YXJ0ZWQ6JywgdG91cm5hbWVudFN0YXJ0ZWQpO1xuXHRcdGNvbnNvbGUubG9nKCdUb3VybmFtZW50IGNvdW50IGZyb20gc3RvcmFnZTonLCBjb3VudEZyb21TdG9yYWdlKTtcblxuXHRcdGlmIChjb3VudEZyb21TdG9yYWdlID49IDYpIHtcblx0XHRcdGNvbnN0IHN0YXJ0R2FtZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydF9nYW1lJyk7XG5cdFx0XHRjb25zdCBmaW5pc2hHYW1lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmljaGVkX2dhbWUnKTtcblxuXHRcdFx0aWYgKHN0YXJ0R2FtZUJ0bikgc3RhcnRHYW1lQnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRpZiAoZmluaXNoR2FtZUJ0bikgZmluaXNoR2FtZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZmluaXNoR2FtZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5pY2hlZF9nYW1lJyk7XG5cdFx0XHRpZiAoZmluaXNoR2FtZUJ0bikgZmluaXNoR2FtZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdH1cblx0fVxuXG5cbiAgICB0b3VybmFtZW50X2V2ZW50KCkge1xuICAgICAgICBjb25zdCBzdGFydF90b3VybmFtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0X3RvdXJuYW1lbnQnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyX25hbWVfcGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcl9uYW1lX3BsYXllcicpO1xuICAgICAgICBjb25zdCB0b3VybmFtZW50X2dyYXBoaWNfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG91cm5hbWVudF9ncmFwaGljX2lkJyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50Jyk7XG5cdFx0Y29uc3QgZmluaXNoX3RvdXJuYW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluaWNoZWRfZ2FtZScpO1xuXG4gICAgICAgIHN0YXJ0X3RvdXJuYW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR0b3VybmFtZW50U3RhcnRlZCA9IHRydWU7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG91cm5hbWVudFN0YXJ0ZWQnLCB0b3VybmFtZW50U3RhcnRlZCk7XG4gICAgICAgICAgICBjb250YWluZXJfbmFtZV9wbGF5ZXIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgICAgICB0b3VybmFtZW50X2dyYXBoaWNfaWQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRzdGFydF90b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH0pO1xuXG5cdFx0Y29uc3QgbGVhdmVfdG91cm5hbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsZWF2ZV90b3VybmFtZW50Jyk7XG5cdFx0Y29uc3QgbWVzc2FnZV9pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlX2lkJyk7XG5cblx0XHRsZWF2ZV90b3VybmFtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bWVzc2FnZV9pZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5zdHlsZS5maWx0ZXIgPSBcImJsdXIoNXB4KVwiO1xuXHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcblx0XHR9KTtcblxuXHRcdGNvbnN0IGNsb3NlX21lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VfbWVzc2FnZV9pZCcpO1xuXG5cdFx0Y2xvc2VfbWVzc2FnZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG1lc3NhZ2VfaWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuc3R5bGUuZmlsdGVyID0gXCJub25lXCI7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYXV0b1wiO1xuXHRcdH0pO1xuXG5cdFx0Y29uc3QgY29uZmlybV9sZWF2ZV90b3VybmFtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbmZpcm1fbGVhdmVfdG91cm5hbWVudCcpO1xuXG5cdFx0Y29uZmlybV9sZWF2ZV90b3VybmFtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bWVzc2FnZV9pZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5zdHlsZS5maWx0ZXIgPSBcIm5vbmVcIjtcblx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG5cdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRjb250YWluZXJfbmFtZV9wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHR0b3VybmFtZW50U3RhcnRlZCA9IGZhbHNlO1xuXHRcdFx0cmVzZXRUb3VybmFtZW50U3RhdGUoam91ZXVyMV9pZCwgam91ZXVyMl9pZCwgam91ZXVyM19pZCwgam91ZXVyNF9pZCk7XG5cdFx0XHRiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0c3RhcnRfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHR9KTtcblxuXHRcdGZpbmlzaF90b3VybmFtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dG91cm5hbWVudF9ncmFwaGljX2lkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0Y29udGFpbmVyX25hbWVfcGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdFx0dG91cm5hbWVudFN0YXJ0ZWQgPSBmYWxzZTtcblx0XHRcdHJlc2V0VG91cm5hbWVudFN0YXRlKGpvdWV1cjFfaWQsIGpvdWV1cjJfaWQsIGpvdWV1cjNfaWQsIGpvdWV1cjRfaWQpO1xuXHRcdFx0YmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdHN0YXJ0X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRjb3VudCA9IDA7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG91cm5hbWVudENvdW50JywgY291bnQpO1xuXHRcdH0pO1xuICAgIH1cblxuXHRjaGVja3RvdXJuYW1lbnRzdGFydCgpIHtcblx0XHRpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBcIi90b3VybmFtZW50XCIpXG5cdFx0e1xuXHRcdFx0Ly8gUsOpY3Vww6lyZXIgdG91cyBsZXMgw6lsw6ltZW50cyBuw6ljZXNzYWlyZXNcblx0XHRcdGNvbnN0IGNvbnRhaW5lcl9uYW1lX3BsYXllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXJfbmFtZV9wbGF5ZXInKTtcblx0XHRcdGNvbnN0IHRvdXJuYW1lbnRfZ3JhcGhpY19pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b3VybmFtZW50X2dyYXBoaWNfaWQnKTtcblx0XHRcdGNvbnN0IHN0YXJ0X3RvdXJuYW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRfdG91cm5hbWVudCcpO1xuXHRcdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50Jyk7XG5cdFx0XHRcblx0XHRcdC8vIFbDqXJpZmllciBxdWUgdG91cyBsZXMgw6lsw6ltZW50cyBleGlzdGVudCBhdmFudCBkZSBsZXMgbWFuaXB1bGVyXG5cdFx0XHRpZiAoIWNvbnRhaW5lcl9uYW1lX3BsYXllciB8fCAhdG91cm5hbWVudF9ncmFwaGljX2lkIHx8ICFzdGFydF90b3VybmFtZW50IHx8ICFiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50KSB7XG5cdFx0XHRcdHJldHVybjsgLy8gU29ydGlyIGRlIGxhIGZvbmN0aW9uIHNpIHVuIMOpbMOpbWVudCBlc3QgbWFucXVhbnRcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKHRvdXJuYW1lbnRTdGFydGVkID09IHRydWUpIHtcblx0XHRcdFx0Y29udGFpbmVyX25hbWVfcGxheWVyLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdFx0XHR0b3VybmFtZW50X2dyYXBoaWNfaWQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdHN0YXJ0X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdFx0YmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKGNvbnRhaW5lcl9uYW1lX3BsYXllci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpKSB7XG5cdFx0XHRcdFx0Y29udGFpbmVyX25hbWVfcGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdFx0XHRcdHRvdXJuYW1lbnRfZ3JhcGhpY19pZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0XHRzdGFydF90b3VybmFtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuY29uc3QgUE9TSVRJT05TID1cbntcblx0cm91bmQxOiB7XG5cdFx0cGxheWVyMTogeyB0b3A6ICcnLCBsZWZ0OiAnJyB9LFxuXHRcdHBsYXllcjI6IHsgdG9wOiAnJywgbGVmdDogJycgfSxcblx0XHRwbGF5ZXIzOiB7IHRvcDogJycsIGxlZnQ6ICcnIH0sXG5cdFx0cGxheWVyNDogeyB0b3A6ICcnLCBsZWZ0OiAnJyB9XG5cdH0sXG5cdHF1YXJ0X3dpbm5lcjoge1xuXHRcdHdpbm5lcjFfMjogeyB0b3A6ICcxMiUnLCBsZWZ0OiAnMzglJyB9LFxuXHRcdGxvc2VyMV8yOiB7IHRvcDogJzYyJScsIGxlZnQ6ICcyNCUnIH0sXG5cdFx0d2lubmVyM180OiB7IHRvcDogJzMyJScsIGxlZnQ6ICczOCUnIH0sXG5cdFx0bG9zZXIzXzQ6IHsgdG9wOiAnNzAlJywgbGVmdDogJzI0JScgfSxcblx0fSxcblx0cXVhcnRfbG9zZXI6IHtcblx0XHR3aW5uZXI6IHsgdG9wOiAnNjclJywgbGVmdDogJzM4JScgfSxcblx0fSxcblx0ZGVtaV93aW5lcjoge1xuXHRcdHdpbm5lcjogeyB0b3A6ICczNCUnLCBsZWZ0OiAnNTglJyB9LFxuXHRcdGxvc2VyOiB7IHRvcDogJzc1JScsIGxlZnQ6ICczOCUnIH0sXG5cdH0sXG5cdGRlbWlfbG9zZXI6IHtcblx0XHR3aW5uZXI6IHsgdG9wOiAnNDMlJywgbGVmdDogJzU4JScgfSxcblx0fSxcblx0Z3JhbmRlX2ZpbmFsOlxuXHR7XG5cdFx0d2lubmVyOiB7IHRvcDogJzM4JScsIGxlZnQ6ICc3MiUnIH0sXG5cdH0sXG59O1xuXG5mdW5jdGlvbiByZXNldFRvdXJuYW1lbnRTdGF0ZShqb3VldXIxX2lkLCBqb3VldXIyX2lkLCBqb3VldXIzX2lkLCBqb3VldXI0X2lkKVxue1xuXHQvLyBjb3VudCA9IDA7XG5cdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b3VybmFtZW50Q291bnQnLCBjb3VudCk7XG5cdGNvbnN0IGpvdWV1cnMgPSBbam91ZXVyMV9pZCwgam91ZXVyMl9pZCwgam91ZXVyM19pZCwgam91ZXVyNF9pZF07XG5cblx0am91ZXVycy5mb3JFYWNoKGpvdWV1ciA9PiB7XG5cdFx0am91ZXVyLnN0eWxlLnRvcCA9ICcnO1xuXHRcdGpvdWV1ci5zdHlsZS5sZWZ0ID0gJyc7XG5cdFx0am91ZXVyLnN0eWxlLmNvbG9yID0gJ3doaXRlJztcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvdXJuYW1lbnRTdGF0ZShjb3VudCwgam91ZXVyMV9pZCwgam91ZXVyMl9pZCwgam91ZXVyM19pZCwgam91ZXVyNF9pZClcbntcblx0cmVzZXRUb3VybmFtZW50U3RhdGUoam91ZXVyMV9pZCwgam91ZXVyMl9pZCwgam91ZXVyM19pZCwgam91ZXVyNF9pZCk7XG5cdGNvbnNvbGUubG9nKCdDb3VudDonLCBjb3VudCk7XG5cblx0bGV0IG1hdGNoMV93aW5uZXIsIG1hdGNoMV9sb3NlciwgbWF0Y2gyX3dpbm5lciwgbWF0Y2gyX2xvc2VyLCBtYXRjaDNfd2lubmVyLCBtYXRjaDNfbG9zZXIsIFxuXHRtYXRjaDRfd2lubmVyLCBtYXRjaDRfbG9zZXIsIG1hdGNoNV93aW5uZXIsIG1hdGNoNV9sb3NlciwgbWF0Y2g2X3dpbm5lciwgbWF0Y2g2X2xvc2VyO1xuXG5cdGlmIChjb3VudCA+PSAwKSB7XG5cdFx0Y29uc3QgcGxheWVycyA9IFtqb3VldXIxX2lkLCBqb3VldXIyX2lkLCBqb3VldXIzX2lkLCBqb3VldXI0X2lkXTtcblx0XHRjb25zdCBwb3NpdGlvbnMgPSBPYmplY3QudmFsdWVzKFBPU0lUSU9OUy5yb3VuZDEpO1xuXHRcdFxuXHRcdHBsYXllcnMuZm9yRWFjaCgoam91ZXVyLCBpbmRleCkgPT4ge1xuXHRcdGpvdWV1ci5zdHlsZS50b3AgPSBwb3NpdGlvbnNbaW5kZXhdLnRvcDtcblx0XHRqb3VldXIuc3R5bGUubGVmdCA9IHBvc2l0aW9uc1tpbmRleF0ubGVmdDtcblx0XHRqb3VldXIuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuXG5cdFx0aGlnaGxpZ2h0TmV4dFBsYXllcnMoam91ZXVyMV9pZCwgam91ZXVyMl9pZCk7XG5cblx0XHR9KTtcblx0fVxuXG5cdGlmIChjb3VudCA+PSAxKVxuXHR7XG5cdFx0cmVzZXRIaWdobGlnaHQoW2pvdWV1cjFfaWQsIGpvdWV1cjJfaWRdKTtcblx0XHRjb25zb2xlLmxvZygnTWF0Y2ggMScpO1xuXHRcdGNvbnNvbGUubG9nKFwicm91bmQxXCIpO1xuXHRcdGNvbnN0IHBsYXllcjFfd2lucyA9IGdldFBsYXllcl8xX3dpbigpO1xuXG5cdFx0aWYgKHBsYXllcjFfd2lucylcblx0XHR7XG5cdFx0XHRtYXRjaDFfd2lubmVyID0gam91ZXVyMV9pZDtcblx0XHRcdG1hdGNoMV9sb3NlciA9IGpvdWV1cjJfaWQ7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRtYXRjaDFfd2lubmVyID0gam91ZXVyMl9pZDtcblx0XHRcdG1hdGNoMV9sb3NlciA9IGpvdWV1cjFfaWQ7XG5cdFx0fVxuXHRcdFxuXHRcdG1hdGNoMV93aW5uZXIuc3R5bGUudG9wID0gUE9TSVRJT05TLnF1YXJ0X3dpbm5lci53aW5uZXIxXzIudG9wO1xuXHRcdG1hdGNoMV93aW5uZXIuc3R5bGUubGVmdCA9IFBPU0lUSU9OUy5xdWFydF93aW5uZXIud2lubmVyMV8yLmxlZnQ7XG5cdFx0bWF0Y2gxX2xvc2VyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5xdWFydF93aW5uZXIubG9zZXIxXzIudG9wO1xuXHRcdG1hdGNoMV9sb3Nlci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLnF1YXJ0X3dpbm5lci5sb3NlcjFfMi5sZWZ0O1xuXG5cdFx0aGlnaGxpZ2h0TmV4dFBsYXllcnMoam91ZXVyM19pZCwgam91ZXVyNF9pZCk7XG5cdH1cblxuXHRpZiAoY291bnQgPj0gMilcblx0e1xuXHRcdHJlc2V0SGlnaGxpZ2h0KFtqb3VldXIzX2lkLCBqb3VldXI0X2lkXSk7XG5cdFx0Y29uc29sZS5sb2coJ01hdGNoIDInKTtcblx0XHRjb25zb2xlLmxvZyhcInJvdW5kMlwiKTtcblx0XHRjb25zdCBwbGF5ZXIxX3dpbnMgPSBnZXRQbGF5ZXJfMV93aW4oKTtcblxuXHRcdGlmIChwbGF5ZXIxX3dpbnMpXG5cdFx0e1xuXHRcdFx0bWF0Y2gyX3dpbm5lciA9IGpvdWV1cjNfaWQ7XG5cdFx0XHRtYXRjaDJfbG9zZXIgPSBqb3VldXI0X2lkO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0bWF0Y2gyX3dpbm5lciA9IGpvdWV1cjRfaWQ7XG5cdFx0XHRtYXRjaDJfbG9zZXIgPSBqb3VldXIzX2lkO1xuXHRcdH1cblx0XHRcblx0XHRtYXRjaDJfd2lubmVyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5xdWFydF93aW5uZXIud2lubmVyM180LnRvcDtcblx0XHRtYXRjaDJfd2lubmVyLnN0eWxlLmxlZnQgPSBQT1NJVElPTlMucXVhcnRfd2lubmVyLndpbm5lcjNfNC5sZWZ0O1xuXG5cdFx0bWF0Y2gyX2xvc2VyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5xdWFydF93aW5uZXIubG9zZXIzXzQudG9wO1xuXHRcdG1hdGNoMl9sb3Nlci5zdHlsZS5sZWZ0ID0gUE9TSVRJT05TLnF1YXJ0X3dpbm5lci5sb3NlcjNfNC5sZWZ0O1xuXHRcdGhpZ2hsaWdodE5leHRQbGF5ZXJzKG1hdGNoMV9sb3NlciwgbWF0Y2gyX2xvc2VyKTtcblxuXHR9XG5cblx0aWYgKGNvdW50ID49IDMgJiYgbWF0Y2gxX2xvc2VyICYmIG1hdGNoMl9sb3Nlcilcblx0e1xuXHRcdHJlc2V0SGlnaGxpZ2h0KFttYXRjaDFfbG9zZXIsIG1hdGNoMl9sb3Nlcl0pO1xuXHRcdGNvbnN0IHF1YXJ0X2xvc2VyX2JyYWNrZXQgPSBnZXRQbGF5ZXJfMV93aW4oKTtcblxuXHRcdGlmIChxdWFydF9sb3Nlcl9icmFja2V0KVxuXHRcdHtcblx0XHRcdG1hdGNoM193aW5uZXIgPSBtYXRjaDFfbG9zZXI7XG5cdFx0XHRtYXRjaDNfbG9zZXIgPSBtYXRjaDJfbG9zZXI7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRtYXRjaDNfd2lubmVyID0gbWF0Y2gxX2xvc2VyO1xuXHRcdFx0bWF0Y2gzX2xvc2VyID0gbWF0Y2gyX2xvc2VyO1xuXHRcdH1cblx0XHRtYXRjaDNfd2lubmVyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5xdWFydF9sb3Nlci53aW5uZXIudG9wO1xuXHRcdG1hdGNoM193aW5uZXIuc3R5bGUubGVmdCA9IFBPU0lUSU9OUy5xdWFydF9sb3Nlci53aW5uZXIubGVmdDtcblxuXHRcdG1hdGNoM19sb3Nlci5zdHlsZS5jb2xvciA9ICdyZWQnO1xuXG5cdFx0aGlnaGxpZ2h0TmV4dFBsYXllcnMobWF0Y2gxX3dpbm5lciwgbWF0Y2gyX3dpbm5lcik7XG5cdH1cblxuXHRpZiAoY291bnQgPj0gNCAmJiBtYXRjaDFfd2lubmVyICYmIG1hdGNoMl93aW5uZXIpXG5cdHtcblx0XHRyZXNldEhpZ2hsaWdodChbbWF0Y2gxX3dpbm5lciwgbWF0Y2gyX3dpbm5lcl0pO1xuXHRcdGNvbnN0IGRlbWlfd2lubmVyX2JyYWNrZXQgPSBnZXRQbGF5ZXJfMV93aW4oKTtcblxuXHRcdGlmIChkZW1pX3dpbm5lcl9icmFja2V0KVxuXHRcdHtcblx0XHRcdG1hdGNoNF93aW5uZXIgPSBtYXRjaDFfd2lubmVyO1xuXHRcdFx0bWF0Y2g0X2xvc2VyID0gbWF0Y2gyX3dpbm5lcjtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdG1hdGNoNF93aW5uZXIgPSBtYXRjaDJfd2lubmVyO1xuXHRcdFx0bWF0Y2g0X2xvc2VyID0gbWF0Y2gxX3dpbm5lcjtcblx0XHR9XG5cdFx0XG5cdFx0bWF0Y2g0X3dpbm5lci5zdHlsZS50b3AgPSBQT1NJVElPTlMuZGVtaV93aW5lci53aW5uZXIudG9wO1xuXHRcdG1hdGNoNF93aW5uZXIuc3R5bGUubGVmdCA9IFBPU0lUSU9OUy5kZW1pX3dpbmVyLndpbm5lci5sZWZ0O1xuXG5cdFx0bWF0Y2g0X2xvc2VyLnN0eWxlLnRvcCA9IFBPU0lUSU9OUy5kZW1pX3dpbmVyLmxvc2VyLnRvcDtcblx0XHRtYXRjaDRfbG9zZXIuc3R5bGUubGVmdCA9IFBPU0lUSU9OUy5kZW1pX3dpbmVyLmxvc2VyLmxlZnQ7XG5cblx0XHRoaWdobGlnaHROZXh0UGxheWVycyhtYXRjaDNfd2lubmVyLCBtYXRjaDRfbG9zZXIpO1xuXHR9XG5cblx0aWYgKGNvdW50ID49IDUgJiYgbWF0Y2gzX2xvc2VyICYmIG1hdGNoNF9sb3Nlcilcblx0e1xuXHRcdHJlc2V0SGlnaGxpZ2h0KFttYXRjaDNfbG9zZXIsIG1hdGNoNF9sb3Nlcl0pO1xuXHRcdGNvbnN0IGRlbWlfbG9zZXJfYnJhY2tldCA9IGdldFBsYXllcl8xX3dpbigpO1xuXG5cdFx0aWYgKGRlbWlfbG9zZXJfYnJhY2tldClcblx0XHR7XG5cdFx0XHRtYXRjaDVfd2lubmVyID0gbWF0Y2gzX2xvc2VyO1xuXHRcdFx0bWF0Y2g1X2xvc2VyID0gbWF0Y2g0X2xvc2VyO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0bWF0Y2g1X3dpbm5lciA9IG1hdGNoNF9sb3Nlcjtcblx0XHRcdG1hdGNoNV9sb3NlciA9IG1hdGNoM19sb3Nlcjtcblx0XHR9XG5cdFx0XG5cdFx0bWF0Y2g1X3dpbm5lci5zdHlsZS50b3AgPSBQT1NJVElPTlMuZGVtaV9sb3Nlci53aW5uZXIudG9wO1xuXHRcdG1hdGNoNV93aW5uZXIuc3R5bGUubGVmdCA9IFBPU0lUSU9OUy5kZW1pX2xvc2VyLndpbm5lci5sZWZ0O1xuXG5cdFx0bWF0Y2g1X2xvc2VyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG5cblx0XHRoaWdobGlnaHROZXh0UGxheWVycyhtYXRjaDRfd2lubmVyLCBtYXRjaDVfd2lubmVyKTtcblx0fVxuXG5cdGlmIChjb3VudCA+PSA2ICYmIG1hdGNoNV93aW5uZXIgJiYgbWF0Y2g0X3dpbm5lcilcblx0e1xuXHRcdHJlc2V0SGlnaGxpZ2h0KFttYXRjaDVfd2lubmVyLCBtYXRjaDRfd2lubmVyXSk7XG5cdFx0Y29uc3QgZ3JhbmRlX2ZpbmFsX2JyYWNrZXQgPSBnZXRQbGF5ZXJfMV93aW4oKTtcblxuXHRcdGlmIChncmFuZGVfZmluYWxfYnJhY2tldClcblx0XHR7XG5cdFx0XHRtYXRjaDZfd2lubmVyID0gbWF0Y2g1X3dpbm5lcjtcblx0XHRcdG1hdGNoNl9sb3NlciA9IG1hdGNoNF93aW5uZXI7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRtYXRjaDZfd2lubmVyID0gbWF0Y2g0X3dpbm5lcjtcblx0XHRcdG1hdGNoNl9sb3NlciA9IG1hdGNoNV93aW5uZXI7XG5cdFx0fVxuXHRcdFxuXHRcdG1hdGNoNl93aW5uZXIuc3R5bGUudG9wID0gUE9TSVRJT05TLmdyYW5kZV9maW5hbC53aW5uZXIudG9wO1xuXHRcdG1hdGNoNl93aW5uZXIuc3R5bGUubGVmdCA9IFBPU0lUSU9OUy5ncmFuZGVfZmluYWwud2lubmVyLmxlZnQ7XG5cblx0XHRtYXRjaDZfbG9zZXIuc3R5bGUuY29sb3IgPSAncmVkJztcblx0fVxuXG59XG5cbmZ1bmN0aW9uIGhpZ2hsaWdodE5leHRQbGF5ZXJzKC4uLnBsYXllcnMpIHtcbiAgICAvLyBEJ2Fib3JkIHLDqWluaXRpYWxpc2VyIHRvdXMgbGVzIGpvdWV1cnNcbiAgICBjb25zdCBhbGxQbGF5ZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllcicpO1xuICAgIGFsbFBsYXllcnMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgcC5zdHlsZS5maWx0ZXIgPSBcImJyaWdodG5lc3MoMSlcIjtcbiAgICAgICAgcC5zdHlsZS5jb2xvciA9IFwiXCI7XG4gICAgICAgIHAuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcbiAgICAgICAgcC5zdHlsZS50ZXh0U2hhZG93ID0gXCJcIjtcbiAgICAgICAgcC5zdHlsZS5mb250V2VpZ2h0ID0gXCJcIjtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBNZXR0cmUgZW4gw6l2aWRlbmNlIGxlcyBqb3VldXJzIGFjdGlmc1xuICAgIHBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAvLyBFZmZldCBkZSBsdW1pw6hyZSBiZWF1Y291cCBwbHVzIHByb25vbmPDqVxuICAgICAgICAgICAgcGxheWVyLnN0eWxlLmZpbHRlciA9IFwiYnJpZ2h0bmVzcygyLjApIHNhdHVyYXRlKDIuMClcIjtcbiAgICAgICAgICAgIC8vIENvdWxldXIgZGUgdGV4dGUgdHLDqHMgdmlzaWJsZVxuICAgICAgICAgICAgcGxheWVyLnN0eWxlLmNvbG9yID0gXCIjRkZGRjAwXCI7IC8vIEphdW5lIHZpZlxuICAgICAgICAgICAgLy8gTMOpZ8OocmUgbWlzZSDDoCBsJ8OpY2hlbGxlIHBvdXIgYXR0aXJlciBsJ2F0dGVudGlvblxuICAgICAgICAgICAgcGxheWVyLnN0eWxlLnRyYW5zZm9ybSA9IFwic2NhbGUoMS4xKVwiO1xuICAgICAgICAgICAgLy8gQWpvdXRlciB1biBoYWxvIGRlIHRleHRlIHBvdXIgcGx1cyBkZSBsdW1pbm9zaXTDqVxuICAgICAgICAgICAgcGxheWVyLnN0eWxlLnRleHRTaGFkb3cgPSBcIjAgMCAxMHB4IHJnYmEoMjU1LCAyNTUsIDAsIDAuOClcIjtcbiAgICAgICAgICAgIC8vIFRleHRlIGVuIGdyYXMgcG91ciBwbHVzIGRlIHZpc2liaWxpdMOpXG4gICAgICAgICAgICBwbGF5ZXIuc3R5bGUuZm9udFdlaWdodCA9IFwiYm9sZFwiO1xuICAgICAgICAgICAgLy8gVHJhbnNpdGlvbiBkb3VjZSBwb3VyIGxlcyBjaGFuZ2VtZW50c1xuICAgICAgICAgICAgcGxheWVyLnN0eWxlLnRyYW5zaXRpb24gPSBcImFsbCAwLjNzIGVhc2UtaW4tb3V0XCI7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8gRm9uY3Rpb24gcG91ciByw6lpbml0aWFsaXNlciBsYSBtaXNlIGVuIMOpdmlkZW5jZSBkZXMgam91ZXVyc1xuZnVuY3Rpb24gcmVzZXRIaWdobGlnaHQocGxheWVycykge1xuXHRwbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcblx0XHRpZiAocGxheWVyKSB7XG5cdFx0XHRwbGF5ZXIuc3R5bGUuZmlsdGVyID0gXCJicmlnaHRuZXNzKDEpXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUuY29sb3IgPSBcIlwiO1xuXHRcdFx0cGxheWVyLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUudGV4dFNoYWRvdyA9IFwiXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUuZm9udFdlaWdodCA9IFwiXCI7XG5cdFx0XHRwbGF5ZXIuc3R5bGUudHJhbnNpdGlvbiA9IFwiYWxsIDAuM3MgZWFzZS1pbi1vdXRcIjtcblx0XHR9XG5cdH0pO1xufSJdfQ==