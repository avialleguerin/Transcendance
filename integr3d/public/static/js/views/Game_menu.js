import AbstractView from "./AbstractView.js";
import { startGame, startAI_Game } from "../../../srcs/game/gameplay/babylon.js";
import { startMultiGame } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { init_nb_powerUP_grenadeFlash, reset_powerUP_grenade } from "../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_GrenadeFlash.js";
import { init_nb_powerUP_teammate, reset_powerUP_teammate } from "../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_teammate.js";
import { init_powerUP_inverse_player } from "../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_inverse.js";
import { init_nb_powerUP_grenadeFlash_team_player } from "../../../srcs/game/gameplay/multiplayer/2v2_game/init_powerUP_GernadeFlash_multi.js";
import { init_powerUP_inverse_Team_player } from "../../../srcs/game/gameplay/multiplayer/2v2_game/init_powerUP_inverse_multi.js";

let powerUP_nb = 0;
let powerUP_nb_multi = 0;


export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Game_menu");
	}

	async getHtml() {
		return `
		<link rel="stylesheet" href="./static/js/css/game_menu.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="view1" id="view1">
			<div class="view1-content">
				<button id="view1_btn" class="btn">MODE DE JEUX</button>
				<button id="settings_btn" class="btn">PARAMETRES</button>
			</div>
		</div>
		<div class="back-home" id="back-home">
			<button id="btn_back_home" class="btn">ACCUEIL</button>
		</div>
		<div id="container" class="container_menu">
			<button id="btn_jouer">
				<h1>JOUER</h1>
			</button>
			<div class="view2" id="view2">
				<div class="view2-content">
					<h1>CHOISIS TON MODE DE JEUX</h1>
					<div id="game_mode_btn" class="game_mode_btn">
						<button id="solo" class="btn">SOLO</button>
						<button id="multiplayer" class="btn">MULTIPLAYER</button>
					</div>
				</div>
			</div>
			<div class="view3" id="view3">
				<div class="view3-content">
					<h1>MODE DE JEUX EN SOLO</h1>
					<div id="game_mode_btn" class="game_mode_btn">
						<button id="prepar_game_1v1" class="btn">1v1</button>
						<button id="prepar_gane_ai" class="btn">ai</button>
					</div>
					<button id="back_to_menu_view3" class="btn">BACK TO MENU</button>
				</div>
			</div>
			<div class="view4" id="view4">
				<div class="view4-content">
					<h1>MODE DE JEUX MULTIPLAYER</h1>
					<div id="game_mode_btn" class="game_mode_btn">
						<button id="prepar_game_multi" class="btn">2v2</button>
					</div>
					<button id="back_to_menu_view4" class="btn">BACK TO MENU</button>
				</div>
			</div>
			<div class="view5" id="view5">
				<div class="view5-content">
					<h1>PARAMETRES</h1>
				</div>
			</div>
			<div class="view6" id="view6">
				<div class="view6-content">
					<h1>CUSTOMISE TA GAME</h1>
					<div class="powerUP">
						<p>PowerUP :<span id="powerUP" class="active_powerUP"></span></p>
						<div id="power_selector" class="power_selector">
							<div class="powerUP_number">
								<p>1</p>
								<span id="number_powerUP_1" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>3</p>
								<span id="number_powerUP_3" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>5</p>
								<span id="number_powerUP_5" class="number_powerUP"></span>
							</div>
						</div>
					</div>
					<div class="skin">
						<p>Skin Personnalise :<span id="skin_perso" class="skin_perso"</span></p>
					</div>
					<button id="solo_1v1_btn" class="btn">
						<a href="/solo_game_1v1" class="nav-link" data-link>Lancer la partie</a>
					</button>
				</div>
			</div>
			<div class="view7" id="view7">
				<div class="view7-content">
					<h1>CUSTOMISE TA GAME CONTRE L'IA</h1>
					<div class="powerUP">
						<p>PowerUP :<span id="powerUP" class="active_powerUP"></span></p>
						<div id="power_selector" class="power_selector">
							<div class="powerUP_number">
								<p>1</p>
								<span id="number_powerUP_1" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>3</p>
								<span id="number_powerUP_3" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>5</p>
								<span id="number_powerUP_5" class="number_powerUP"></span>
							</div>
						</div>
					</div>
					<div class="skin">
						<p>Skin Personnalise :<span id="skin_perso" class="skin_perso"</span></p>
					</div>
					<button id="solo_ai_btn" class="btn">
						<a href="/solo_game_ai" class="nav-link" data-link>Lancer la partie</a>
					</button>
				</div>
			</div>
			<div class="view8" id="view8">
				<div class="view8-content">
					<h1>CUSTOMISE TA GAME EN MULTI</h1>
					<div class="powerUP">
						<p>PowerUP :<span id="powerUP_multi" class="active_powerUP"></span></p>
						<div id="power_selector_game_multi" class="power_selector">
							<div class="powerUP_number">
								<p>1</p>
								<span id="number_powerUP_1_game_multi" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>3</p>
								<span id="number_powerUP_3_game_multi" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>5</p>
								<span id="number_powerUP_5_game_multi" class="number_powerUP"></span>
							</div>
						</div>
					</div>
					<div class="skin">
						<p>Skin Personnalise :<span id="skin_perso_game_multi" class="skin_perso"</span></p>
					</div>
					<button id="multiplayer_btn" class="btn">
						<a href="/multi_player_game" class="nav-link" data-link>Lancer la partie</a>
					</button>
				</div>
			</div>
		</div>
		<div class="back" id="back_to_select_mode_view6">
			<button id="back_to_menu_view6" class="btn_back">BACK</button>
		</div>
		<div class="back" id="back_to_select_mode_view7">
			<button id="back_to_menu_view7" class="btn_back">BACK</button>
		</div>
		<div class="back" id="back_to_select_mode_view8">
			<button id="back_to_menu_view8" class="btn_back">BACK</button>
		</div>
		</div>


		`;
	}

	init_solo_game() {
		document.getElementById("solo_1v1_btn").addEventListener("click", () => {
			console.log("Solo 1v1 game started");
			handleViewTransitions("vue3", "vue2");
			startGame();
		});
	}

	initEvents() {
		document.getElementById("multiplayer_btn").addEventListener("click", () => {
			console.log("Multiplayer 2v2 game started");
			handleViewTransitions("vue3", "vue2");
			startMultiGame();
		});
	}

	init_solo_game_ai() {
		document.getElementById("solo_ai_btn").addEventListener("click", () => {
			console.log("Solo AI game started");
			handleViewTransitions("vue3", "vue2");
			startAI_Game();
		});
	}

	game_menu()
	{
		const btn_jouer = document.getElementById('btn_jouer');
		const view1 = document.getElementById('view1');
		const view2 = document.getElementById('view2');
		const view3 = document.getElementById('view3');
		const view4 = document.getElementById('view4');
		const view1_btn = document.getElementById('view1_btn');
		const settings_btn = document.getElementById('settings_btn');
		const solo = document.getElementById('solo');
		const multiplayer = document.getElementById('multiplayer');
		const back_to_menu_view3 = document.getElementById('back_to_menu_view3');
		const back_to_menu_view4 = document.getElementById('back_to_menu_view4');
		const btn_back_home = document.getElementById('back-home');
		const view5 = document.getElementById('view5');
		const view6 = document.getElementById('view6');
		const view7 = document.getElementById('view7');
		const view8 = document.getElementById('view8');
		const prepar_game_1v1 = document.getElementById('prepar_game_1v1');
		const prepar_gane_ai = document.getElementById('prepar_gane_ai');
		const prepar_game_multi = document.getElementById('prepar_game_multi');
		const back_to_menu_view6 = document.getElementById('back_to_menu_view6');
		const back_to_menu_view7 = document.getElementById('back_to_menu_view7');
		const back_to_menu_view8 = document.getElementById('back_to_menu_view8');
		const powerUP = document.getElementById('powerUP');
		const number_powerUP_1 = document.getElementById('number_powerUP_1');
		const number_powerUP_3 = document.getElementById('number_powerUP_3');
		const number_powerUP_5 = document.getElementById('number_powerUP_5');
		const power_selector = document.getElementById('power_selector');
		const skin_perso = document.getElementById('skin_perso');
		const back_to_select_mode_view6 = document.getElementById('back_to_select_mode_view6');
		const back_to_select_mode_view7 = document.getElementById('back_to_select_mode_view7');
		const back_to_select_mode_view8 = document.getElementById('back_to_select_mode_view8');

		btn_jouer.addEventListener('click', () => {
			console.log('JOUER button clicked');
			view1.classList.add('active');
			view2.classList.add('active');
			btn_back_home.classList.add('active');
			btn_jouer.style.display = 'none';
		});

		view1_btn.addEventListener('click', () => {
			console.log('Mode de jeux button clicked');
			
			if (view5.classList.contains('active')) {
				view5.classList.remove('active');
				view2.classList.add('active');
			} 
			else if (!view2.classList.contains('active')) {
				view2.classList.add('active');
			}
		});



		settings_btn.addEventListener('click', () => {
			view2.classList.remove('active');
			view5.classList.add('active');
		});

		solo.addEventListener('click', () => {
			view2.classList.remove('active');
			view3.classList.add('active');
			view1.classList.remove('active');
			btn_back_home.classList.remove('active');
		});

		multiplayer.addEventListener('click', () => {
			view2.classList.remove('active');
			view4.classList.add('active');
			view1.classList.remove('active');
			btn_back_home.classList.remove('active');
		});

		if (!view3.classList.contains('active')) {
			console.log('view3 is active');
			back_to_menu_view3.addEventListener('click', () => {
				view3.classList.remove('active');
				view2.classList.add('active');
				view1.classList.add('active');
				btn_back_home.classList.add('active');
			});
		}

		if (!view4.classList.contains('active')) {
			console.log('view4 is active');
			back_to_menu_view4.addEventListener('click', () => {
				view4.classList.remove('active');
				view2.classList.add('active');
				view1.classList.add('active');
				btn_back_home.classList.add('active');
			});
		}

		btn_back_home.addEventListener('click', () => {
			if (view2.classList.contains('active')) {
				view2.classList.remove('active');
				view1.classList.remove('active');
				btn_back_home.classList.remove('active');
				btn_jouer.style.display = 'block';
			}
			if (view5.classList.contains('active')) {
				view5.classList.remove('active');
				view1.classList.remove('active');
				btn_back_home.classList.remove('active');
				btn_jouer.style.display = 'block';
			}
		});

		prepar_game_1v1.addEventListener('click', () => {
			view3.classList.remove('active');
			view6.classList.add('active');
			back_to_select_mode_view6.classList.add('active');
		});


		prepar_gane_ai.addEventListener('click', () => {
			view3.classList.remove('active');
			view7.classList.add('active');
			back_to_select_mode_view7.classList.add('active');
		});

		prepar_game_multi.addEventListener('click', () => {
			view4.classList.remove('active');
			view8.classList.add('active');
			back_to_select_mode_view8.classList.add('active');
		});

		back_to_menu_view6.addEventListener('click', () => {
			view6.classList.remove('active');
			view3.classList.add('active');
			back_to_select_mode_view6.classList.remove('active');
		});

		back_to_menu_view7.addEventListener('click', () => {
			console.log('Back to menu view7 clicked');
			view3.classList.add('active');
			view7.classList.remove('active');
			back_to_select_mode_view7.classList.remove('active');
		});

		back_to_menu_view8.addEventListener('click', () => {
			view8.classList.remove('active');
			view4.classList.add('active');
			back_to_select_mode_view8.classList.remove('active');
		});

		powerUP.addEventListener('click', () => {
			powerUP.classList.toggle('checked');

			if (powerUP.classList.contains('checked')) {
				console.log('PowerUP is active');
				power_selector.classList.add('active');
			}
			else {
				console.log('PowerUP is inactive');
				power_selector.classList.remove('active');
				reset_powerUP_grenade();
				reset_powerUP_teammate();
			}
		});


		number_powerUP_1.addEventListener('click', () => {
			number_powerUP_1.classList.toggle('checked')
			number_powerUP_3.classList.remove('checked');
			number_powerUP_5.classList.remove('checked');
			console.log('1 powerUP selected and 3 and 5 unselected');
			init_nb_powerUP_grenadeFlash(1);
			init_nb_powerUP_teammate(1);
			init_powerUP_inverse_player(1);
			powerUP_nb = 1;

		});

		number_powerUP_3.addEventListener('click', () => {
			number_powerUP_3.classList.toggle('checked')
			number_powerUP_1.classList.remove('checked');
			number_powerUP_5.classList.remove('checked');
			console.log('3 powerUP selected and 1 and 5 unselected');
			init_nb_powerUP_grenadeFlash(3);
			init_nb_powerUP_teammate(3);
			init_powerUP_inverse_player(3);
			powerUP_nb = 3;
		});

		number_powerUP_5.addEventListener('click', () => {
			number_powerUP_5.classList.toggle('checked')
			number_powerUP_1.classList.remove('checked');
			number_powerUP_3.classList.remove('checked');
			console.log('5 powerUP selected and 1 and 3 unselected');
			init_nb_powerUP_grenadeFlash(5);
			init_nb_powerUP_teammate(5);
			init_powerUP_inverse_player(5);
			powerUP_nb = 5;
		});

		skin_perso.addEventListener('click', () => {
			skin_perso.classList.toggle('checked');
			console.log('Skin perso selected');
		});

		const powerUP_multi = document.getElementById('powerUP_multi');
		const number_powerUP_1_game_multi = document.getElementById('number_powerUP_1_game_multi');
		const number_powerUP_3_game_multi = document.getElementById('number_powerUP_3_game_multi');
		const number_powerUP_5_game_multi = document.getElementById('number_powerUP_5_game_multi');
		const power_selector_game_multi = document.getElementById('power_selector_game_multi');

		powerUP_multi.addEventListener('click', () => {
			powerUP_multi.classList.toggle('checked');

			if (powerUP_multi.classList.contains('checked')) {
				console.log('PowerUP is active');
				power_selector_game_multi.classList.add('active');
			}
			else {
				console.log('PowerUP is inactive');
				power_selector_game_multi.classList.remove('active');
				reset_powerUP_grenade();
				reset_powerUP_teammate();
			}
		});


		number_powerUP_1_game_multi.addEventListener('click', () => {
			number_powerUP_1_game_multi.classList.toggle('checked')
			number_powerUP_3_game_multi.classList.remove('checked');
			number_powerUP_5_game_multi.classList.remove('checked');
			console.log('1 powerUP selected and 3 and 5 unselected');
			init_nb_powerUP_grenadeFlash_team_player(1);
			init_powerUP_inverse_Team_player(1);
			powerUP_nb_multi = 1;
		});

		number_powerUP_3_game_multi.addEventListener('click', () => {
			number_powerUP_3_game_multi.classList.toggle('checked')
			number_powerUP_1_game_multi.classList.remove('checked');
			number_powerUP_5_game_multi.classList.remove('checked');
			console.log('3 powerUP selected and 1 and 5 unselected');
			init_nb_powerUP_grenadeFlash_team_player(3);
			init_powerUP_inverse_Team_player(3);
			powerUP_nb_multi = 3;
		});

		number_powerUP_5_game_multi.addEventListener('click', () => {
			number_powerUP_5_game_multi.classList.toggle('checked')
			number_powerUP_1_game_multi.classList.remove('checked');
			number_powerUP_3_game_multi.classList.remove('checked');
			console.log('5 powerUP selected and 1 and 3 unselected');
			init_nb_powerUP_grenadeFlash_team_player(5);
			init_powerUP_inverse_Team_player(5);
			powerUP_nb_multi = 5;
		});
	}
}


export function getPowerUP_value() {
	return powerUP_nb;
}

export function getPowerUP_value_multi() {
	return powerUP_nb_multi;
}