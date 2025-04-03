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
				<p class="upper_bracket">upper bracket</p>
				<p class="lower_bracket">lower bracket</p>
				<p class="joueur1" id="joueur1_id">joueur 1</p>
				<p class="joueur2" id="joueur2_id">joueur 2</p>
				<p class="joueur3" id="joueur3_id">joueur 3</p>
				<p class="joueur4" id="joueur4_id">joueur 4</p>
				<img src="../../../srcs/game/assets/image/Untitled.svg" alt="tournament">
			</div>
			<button id="start_tournament" class="btn_start_tournament">Lancer le tournoi</button>
			<button id="back_to_menu_view_tournament" class="btn_back_tournament">
				<a href="/Game_menu" class="nav-link" data-link>BACK</a>
			</button>
			<button id="incremente_place" class="btn_incremente_place">+</button>
			<button id="start_game" class="btn_start_game">
				<a href="/tournament_game" class="nav-link" data-link>JOUER</a>
			</button>
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

		// Récupérer la valeur du compteur depuis localStorage ou initialiser à 0
		// let count = parseInt(localStorage.getItem('tournamentCount')) || 0;
		
		// Appliquer l'état actuel du tournoi en fonction du compteur sauvegardé
		updateTournamentState(count, joueur1_id, joueur2_id, joueur3_id, joueur4_id);

		incremente_place.addEventListener('click', () => {
			console.log('Incremente place clicked');
			count = 0;
			localStorage.setItem('tournamentCount', count);
			resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
		});
	}
}
// Fonctions pour déterminer les vainqueurs (à remplacer par votre logique de jeu)

  
  function getWinnerBracketFinalWin() {
	// Retourne true si le gagnant du premier match gagne en demi-finale
	return true; // À remplacer par votre logique
  }
  
  function getLoserBracketWin() {
	// Retourne true si le perdant du premier match gagne le match de consolation
	return true; // À remplacer par votre logique
  }
  
  function getLoserBracketFinalWin() {
	// Retourne true si le gagnant du loser bracket gagne contre le perdant de la demi-finale
	return false; // À remplacer par votre logique
  }
  
  function getGrandFinalWin() {
	// Retourne true si le gagnant du winner bracket gagne la finale
	return true; // À remplacer par votre logique
  }
  
  // Positions des joueurs (inchangées comme demandé)
  const POSITIONS = {
	round1: {
	  player1: { top: '8%', left: '24%' },
	  player2: { top: '17%', left: '24%' },
	  player3: { top: '29%', left: '24%' },
	  player4: { top: '38%', left: '24%' }
	},
	round2: {
	  winner1_2: { top: '13%', left: '37%' },
	  loser1_2: { top: '63%', left: '24%' },
	  winner3_4: { top: '33%', left: '37%' },
	  loser3_4: { top: '71%', left: '24%' }
	},
	round2_loser: {
	  winner_loser_bracket: { top: '67%', left: '37%' }
	},
	round3: {
	  winner_semifinal: { top: '59%', left: '35%' },
	  loser_semifinal: { top: '76%', left: '37%' }
	},
	round3_loser: {
	  winner_loser_final: { top: '59%', left: '59%' }
	},
	final: {
	  winner: { top: '40%', left: '73%' },
	  loser: { top: '38%', left: '72%' }
	}
  };
  
  // Fonction pour réinitialiser l'état du tournoi
  function resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id) {
	const joueurs = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];
	
	joueurs.forEach(joueur => {
	  // Réinitialiser toutes les propriétés de style
	  joueur.style.top = '0';
	  joueur.style.left = '0';
	  joueur.style.color = 'white';
	  joueur.style.opacity = '1';
	});
  }
  
  function updateTournamentState(count, joueur1_id, joueur2_id, joueur3_id, joueur4_id) {
	// Réinitialiser les styles pour commencer avec un état propre
	resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
	
	// Variables pour suivre les joueurs à travers le tournoi
	let match1_winner, match1_loser, match2_winner, match2_loser;
	let loser_bracket_winner, semifinal_winner, semifinal_loser, loser_final_winner, grand_final_winner;
	
	// Round 1: Initialiser le tournoi avec les positions des 4 joueurs
	if (count >= 0) {
	  const players = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];
	  const positions = Object.values(POSITIONS.round1);
	  
	  players.forEach((joueur, index) => {
		joueur.style.top = positions[index].top;
		joueur.style.left = positions[index].left;
		joueur.style.color = 'white';
	  });
	}
	
	// Round 2: Premier match (joueur1 vs joueur2) et deuxième match (joueur3 vs joueur4)
	if (count >= 1) {
	  // Match 1: joueur1 vs joueur2
	  const player1_wins = getPlayer_1_win();
	  match1_winner = player1_wins ? joueur1_id : joueur2_id;
	  match1_loser = player1_wins ? joueur2_id : joueur1_id;
	  
	  // Déplacer le gagnant vers la position du vainqueur
	  match1_winner.style.top = POSITIONS.round2.winner1_2.top;
	  match1_winner.style.left = POSITIONS.round2.winner1_2.left;
	  
	  // Déplacer le perdant vers le loser bracket
	  match1_loser.style.top = POSITIONS.round2.loser1_2.top;
	  match1_loser.style.left = POSITIONS.round2.loser1_2.left;
	  match1_loser.style.color = 'orange'; // Marquer comme perdant
	}
	
	if (count >= 2) {
	  // Match 2: joueur3 vs joueur4
	  const player2_wins = getPlayer_2_win();
	  match2_winner = player2_wins ? joueur3_id : joueur4_id;
	  match2_loser = player2_wins ? joueur4_id : joueur3_id;
	  
	  // Déplacer le gagnant vers la position du vainqueur
	  match2_winner.style.top = POSITIONS.round2.winner3_4.top;
	  match2_winner.style.left = POSITIONS.round2.winner3_4.left;
	  
	  // Déplacer le perdant vers le loser bracket
	  match2_loser.style.top = POSITIONS.round2.loser3_4.top;
	  match2_loser.style.left = POSITIONS.round2.loser3_4.left;
	  match2_loser.style.color = 'orange'; // Marquer comme perdant
	}
	
	// Round 3: Match de loser bracket (loser1_2 vs loser3_4)
	if (count >= 3 && match1_loser && match2_loser) {
	  const loser_bracket_match_winner = getLoserBracketWin();
	  loser_bracket_winner = loser_bracket_match_winner ? match1_loser : match2_loser;
	  const loser_bracket_match_loser = loser_bracket_match_winner ? match2_loser : match1_loser;
	  
	  // Déplacer le gagnant du loser bracket
	  loser_bracket_winner.style.top = POSITIONS.round2_loser.winner_loser_bracket.top;
	  loser_bracket_winner.style.left = POSITIONS.round2_loser.winner_loser_bracket.left;
	  
	  // Marquer le perdant définitif en rouge et le laisser à sa place
	  loser_bracket_match_loser.style.color = 'red';
	}
	
	// Round 4: Demi-finale du winner bracket (winner1_2 vs winner3_4)
	if (count >= 4 && match1_winner && match2_winner) {
	  const semifinal_winner_is_match1 = getWinnerBracketFinalWin();
	  semifinal_winner = semifinal_winner_is_match1 ? match1_winner : match2_winner;
	  semifinal_loser = semifinal_winner_is_match1 ? match2_winner : match1_winner;
	  
	  // Déplacer le gagnant vers la finale
	  semifinal_winner.style.top = POSITIONS.round3.winner_semifinal.top;
	  semifinal_winner.style.left = POSITIONS.round3.winner_semifinal.left;
	  semifinal_winner.style.color = 'gold'; // Marquer comme finaliste
	  
	  // Déplacer le perdant vers le loser bracket final
	  semifinal_loser.style.top = POSITIONS.round3.loser_semifinal.top;
	  semifinal_loser.style.left = POSITIONS.round3.loser_semifinal.left;
	  semifinal_loser.style.color = 'orange'; // Marquer comme en attente
	}
	
	// Round 5: Finale du loser bracket (loser_bracket_winner vs semifinal_loser)
	if (count >= 5 && loser_bracket_winner && semifinal_loser) {
	  const loser_final_winner_is_loser_bracket = getLoserBracketFinalWin();
	  loser_final_winner = loser_final_winner_is_loser_bracket ? loser_bracket_winner : semifinal_loser;
	  const loser_final_loser = loser_final_winner_is_loser_bracket ? semifinal_loser : loser_bracket_winner;
	  
	  // Déplacer le gagnant vers la grande finale
	  loser_final_winner.style.top = POSITIONS.round3_loser.winner_loser_final.top;
	  loser_final_winner.style.left = POSITIONS.round3_loser.winner_loser_final.left;
	  
	  // Marquer le perdant définitif en rouge
	  loser_final_loser.style.color = 'red';
	}
	
	// Round 6: Grande finale (semifinal_winner vs loser_final_winner)
	if (count >= 6 && semifinal_winner && loser_final_winner) {
	  const grand_final_winner_is_semifinal = getGrandFinalWin();
	  grand_final_winner = grand_final_winner_is_semifinal ? semifinal_winner : loser_final_winner;
	  const grand_final_loser = grand_final_winner_is_semifinal ? loser_final_winner : semifinal_winner;
	  
	  // Déplacer le champion à sa position finale
	  grand_final_winner.style.top = POSITIONS.final.winner.top;
	  grand_final_winner.style.left = POSITIONS.final.winner.left;
	  grand_final_winner.style.color = 'yellow'; // Champion en jaune
	  
	  // Marquer le finaliste
	  grand_final_loser.style.top = POSITIONS.final.loser.top;
	  grand_final_loser.style.left = POSITIONS.final.loser.left;
	  grand_final_loser.style.color = 'silver'; // Finaliste en argent
	}
  }

// // Fonction pour réinitialiser les styles
// function resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id) {
//   const joueurs = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];
//   joueurs.forEach(joueur => {
//     joueur.style.top = '';
//     joueur.style.left = '';
//     joueur.style.color = 'white';
//   });
// }