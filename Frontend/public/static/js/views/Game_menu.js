import AbstractView from "./AbstractView.js";
import { startGame, startAI_Game } from "../../../srcs/game/gameplay/babylon.js";
import { startMultiGame } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { init_nb_powerUP_grenadeFlash, reset_powerUP_grenade } from "../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_GrenadeFlash.js";
import { init_nb_powerUP_teammate, reset_powerUP_teammate } from "../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_teammate.js";
import { init_powerUP_inverse_player, reset_powerUP_inverse_player } from "../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_inverse.js";
import { init_nb_powerUP_grenadeFlash_team_player, reset_powerUP_grenadeTeam_player } from "../../../srcs/game/gameplay/multiplayer/2v2_game/init_powerUP_GernadeFlash_multi.js";
import { init_powerUP_freeze_Team_player, reset_powerUP_freeze_Team_player } from "../../../srcs/game/gameplay/multiplayer/2v2_game/init_power_up_freeze.js";
import { getValue_leave_game, setLeaveGameVar } from "../index.js";
import { enable_skin_perso_player_solo, disable_skin_perso_player_solo, disable_skin_perso_player_solo_and_save, switch_skin_perso_player1_left, switch_skin_perso_player1_right, switch_skin_perso_player2_left, switch_skin_perso_player2_right } from "../../../srcs/game/gameplay/solo/skin/init_skin_perso.js";
import { enable_skin_multi, disable_skin_and_save_multi, disable_skin_multi, switch_skin_perso_player1_right_multi, switch_skin_perso_player1_left_multi, switch_skin_perso_player2_left_multi, switch_skin_perso_player2_right_multi, switch_skin_perso_player3_left_multi, switch_skin_perso_player3_right_multi, switch_skin_perso_player4_left_multi, switch_skin_perso_player4_right_multi } from "../../../srcs/game/gameplay/multiplayer/init_skin_perso_multi.js";

let powerUP_nb = 0;
let powerUP_nb_multi = 0;




export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Game_menu");
		// if (!accessToken) {
		// 	// S'il n'y a pas d'accessToken, redirige vers la page principale ("/")
		// 	history.pushState({}, '', '/');
		// 	// handleViewTransitions("vue1", "vue2");
		// 	// Charge dynamiquement la vue Home (ou login)
		// 	import('./Home.js').then(module => {
		// 		const Home = module.default;
		// 		const homeInstance = new Home();
		// 		homeInstance.getHtml().then(html => {
		// 			document.getElementById('app').innerHTML = html;
		// 			// Si besoin, on peut initialiser des événements spécifiques à Home ici
		// 			if (homeInstance.createAccount) {
		// 				homeInstance.createAccount();
		// 			}
		// 		});
		// 	});
		// 	return; // On arrête l'exécution du constructeur
		// }
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
			<button id="btn_back_home" class="btn">BACK</button>
		</div>
			<div id="container" class="container_menu">
				<button id="btn_jouer">
					<h1>JOUER</h1>
				</button>
				<div class="view2" id="view2">
					<div class="view2-content">
						<h1>CHOISIS TON MODE DE JEU</h1>
						<div id="game_mode_btn" class="game_mode_btn">
							<button id="solo" class="btn">SOLO</button>
							<button id="multiplayer" class="btn">MULTIJOUEUR</button>
							<button id="tournament_view" class="btn_tournament">
							<a href="/tournament" class="nav-link" data-link>TOURNOI</a>
							</button>
							<button id="platformer_view" class="btn_platformer">
								<a href="/PlatformView" class="nav-link" data-link>PLATFORMER</a>
							</button>
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
						<div id="select_parametres" class="select_parametres">
							<button id="profile_parrametre_btn" class="btn">PROFILE</button>
							<button id="parrametre_jeux_btn" class="btn">JEU</button>
						</div>
					</div>
				</div>


				<div class="parametres_jeu" id="parametres_jeu">
					<div class="parametres_jeu_content" id="parametre_jeux_content">
						<h1>PARAMETRES DE JEU</h1>
						<h2>PONG</h2>
						<div class="parametre_mode_jeu">
							<div class="mode_de_jeu_solo_parametre">
								<h3>Mode de jeu en solo</h3>
							
								<div class="joueur_touch">
									<div class="joueur" id="joueur1">
										<p>Joueur 1</p>
										<div class="controls">
											<p>Deplacement : W / S</p>
											<p>PowerUP : Z / X / C</p>
										</div>
									</div>
									<div class="joueur" id="joueur2">
										<p>Joueur 2</p>
										<div class="controls">
											<p>Deplacement : ⬆  / ⬇</p>
											<p>PowerUP : 1 / 2 / 3</p>
										</div>
									</div>
								</div>
							</div>

							<div class="mode_de_jeu_multi_parametre">
								<h3>Mode de jeu en multijoueur</h3>
								<div class="joueur_touch">
									<div class="joueur" id="joueur1">
										<p>Joueur 1</p>
										<div class="controls">
											<p>Deplacement : W / S</p>
											<p>PowerUP : Z / X / C</p>
										</div>
									</div>
									<div class="joueur" id="joueur2">
										<p>Joueur 2</p>
										<div class="controls">
											<p>Deplacement : E  / D</p>
											<p>PowerUP : Z / X / C</p>
										</div>
									</div>
									<div class="joueur" id="joueur3">
										<p>Joueur 3</p>
										<div class="controls">
											<p>Deplacement : O  / L</p>
											<p>PowerUP : 1 / 2 / 3</p>
										</div>
									</div>
									<div class="joueur" id="joueur4">
									<p>Joueur 4</p>
									<div class="controls">
										<p>Deplacement : ⬆  / ⬇</p>
										<p>PowerUP : 1 / 2 / 3</p>
									</div>
								</div>
								</div>
							</div>
						</div>
					</div>
			  </div>

				<div class="parrametres_profile" id="parametres_profile">
					<div class="parametres_profile_content">
						<h1>PARAMETRES DU PROFIL</h1>
						<form id="modif_profil" class="modif_profile" onsubmit="accessProfileInfo(event)">
							<label for="mdp">Mot de passe</label>
							<input type="password" id="password" name="password" placeholder="Password" required>
							<button type="submit" class="btn_valider_mdp">Valider</button>
						</form>
						<div class="profile_param_unlocked" id="profile_param_unlocked_id">
							<div class="photo_profile">
								<div class="profile_photo_container">
									<div class="profile_photo_circle" id="profile_photo_circle">
										
										<label for="profile_photo_input" class="photo_upload_icon">
											<i class="fa fa-camera"></i>
										</label>
									</div>
									<input type="file" id="profile_photo_input" accept="image/*" style="display: none;">
								</div>
							</div>
							<form onsubmit="updateProfileInfo(event)">
								<div class="input_container">
									<label for="username">Change username</label>
									<input type="text" id="change_username" name="username">
								</div>
								<div class="input_container">
									<label for="email">Change email</label>
									<input type="email" id="change_email" name="email">
								</div>
								<div class="input_container">
									<label for="password">Change password</label>
									<input type="password" id="change_password" name="password" placeholder="******">
								</div>
								<div class="input_container">
									<label for="confirm_password">Confirm new password</label>
									<input type="password" id="confirm_change_password" name="confirm_password" placeholder="******">
								</div>
								<div class="btn_deconnect">
									<button id="deconnect_btn" class="btn_deconnect_btn" onclick="logout()">Deconnexion</button>
								</div>
								<div id="fa_selector" class="fa_selector">
									<p>2FA :<span id="active_fa" class="active_fa"></span></p>
								</div>
								<button id="valid_profile_info" class="valid_profile_info_btn">Valider</button>
							</form>
						</div>
					</div>
				</div>




				<div class="view6" id="view6">
					<div class="view6-content">
						<h1 id="custom_ta_game">CUSTOMISE TA GAME</h1>
						<div class="powerUP">
							<p>PowerUP :<span id="power_up_info_id" class="power_up_info"></span><span id="powerUP" class="active_powerUP"></span></p>
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
						<h1 id="custom_ta_game_multi">CUSTOMISE TA GAME EN MULTI</h1>
						<div class="powerUP">
							<p>PowerUP :<span id="power_up_info_id_multi" class="power_up_info"></span><span id="powerUP_multi" class="active_powerUP"></span></p>
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
			<div class="choose_your_skin" id="choose_your_skin">
				<h1>PERSONNALISE TON SKIN</h1>
				<div class="player1">
					<button class="switch_skin_left" id="switch_skn_left_id1"></button>
					<button class="switch_skin_right" id="switch_skn_right_id1"></button>
					<p>Joueur 1</p>
				</div>
				<div class="player2">
					<button class="switch_skin_left" id="switch_skn_left_id2"></button>
					<button class="switch_skin_right" id="switch_skn_right_id2"></button>
					<p>Joueur 2</p>
				</div>
				<button id="valide_ton_skin" class="btn">Valider</button>
			</div>

			<div class="choose_your_skin_game_multi" id="choose_your_skin_game_multi">
				<h1>PERSONNALISE TON SKIN</h1>
				<div class="player1_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id1_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id1_game_multi"></button>
					<p>Joueur 1</p>
				</div>
				<div class="player2_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id2_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id2_game_multi"></button>
					<p>Joueur 2</p>
				</div>
				<div class="player3_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id3_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id3_game_multi"></button>
					<p>Joueur 3</p>
				</div>
				<div class="player4_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id4_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id4_game_multi"></button>
					<p>Joueur 4</p>
				</div>
				<button id="valide_ton_skin_game_multi" class="btn">Valider</button>
			</div>
			<div id="container_info_power_up" class="container_info_power_up">
				<div class="text_powerUP">
					<h1>Power-UP</h1>
					<p class="explication_general">Le Power-Up est un bonus qui te donne un avantage sur ton adversaire. En activant cette option, tu commenceras la partie avec au moins un Power-Up de chaque type. Tu peux également personnaliser ce nombre et en obtenir trois ou cinq de chaque.</p>
					<p class="explication_powerUP_grenade">Le Power-Up Grenade Flash te permet de lancer une grenade qui aveuglera ton adversaire. Mais attention ! Son fonctionnement est simple : elle obscurcit entièrement l’écran de jeu, ce qui signifie que même celui qui la lance est ébloui.</p>
					<p class="explication_powerUP_teammate">Le Power-Up Coéquipier te permet d'appeler un nouveau joueur dans la partie pour une courte durée. Tu peux le déplacer avec E/D pour le joueur 1 et O/L pour le joueur 2.</p>
					<p class="explication_powerUP_inverse">Le Power-Up Inverse te permet d'inverser les contrôles de ton adversaire pendant une courte durée.</p>
					<div class="delay_powerUP_1">
						<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
						<p>DELAIS DE RECUPERATION                  : 10s</p>
					</div>
					<div class="delay_powerUP_2">
						<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
						<p>DELAIS DE RECUPERATION : 15s</p>
					</div>
					<div class="delay_powerUP_3">
						<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
						<p>DELAIS DE RECUPERATION : 10s</p>
					</div>
				</div>
				<div class="container_image_powerUP">
					<img src="../../../srcs/game/assets/image/grenade_no_bg.png" alt="grenade" class="grenade">
					<img src="../../../srcs/game/assets/image/teammate_no_bg.png" alt="teammate" class="teammate">
					<img src="../../../srcs/game/assets/image/reverse_no_bg.png" alt="inverse_player" class="inverse_player">
				</div>
				<div id="exit_powerUP_info" class="exit_powerUP_info">
					<button id="exit_powerUP_info_btn" class="btn">
						X
					</button>
				</div>
			</div>


			<div id="container_info_power_up_multi" class="container_info_power_up">
				<div class="text_powerUP">
					<h1>Power-UP</h1>
					<p class="explication_general">Le Power-Up est un bonus qui te donne un avantage sur ton adversaire. En activant cette option, tu commenceras la partie avec au moins un Power-Up de chaque type. Tu peux également personnaliser ce nombre et en obtenir trois ou cinq de chaque.</p>
					<p class="explication_powerUP_grenade_multi">Le Power-Up Grenade Flash te permet de lancer une grenade qui aveuglera ton adversaire. Mais attention ! Son fonctionnement est simple : elle obscurcit entièrement l’écran de jeu, ce qui signifie que même celui qui la lance est ébloui.</p>
					<p class="explication_powerUP_freeze">Le Power-Up Freeze permet de rendre immobile l'equipe adverse pendant un cour instant.</p>
					<div class="delay_powerUP_1_multi">
						<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
						<p>DELAIS DE RECUPERATION : 10s</p>
					</div>
					<div class="delay_powerUP_2_multi">
						<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
						<p>DELAIS DE RECUPERATION : 10s</p>
					</div>
				</div>
				<div class="container_image_powerUP_multi">
					<img src="../../../srcs/game/assets/image/grenade_no_bg.png" alt="grenade" class="grenade">
					<img src="../../../srcs/game/assets/image/freeze_no_bg.png" alt="freeze" class="freeze">
				</div>
				<div id="exit_powerUP_info_multi" class="exit_powerUP_info">
					<button id="exit_powerUP_info_btn_multi" class="btn">
						X
					</button>
				</div>
			</div>
		</div>
		`;
	}

	init_solo_game() {
		document.getElementById("solo_1v1_btn").addEventListener("click", () => {
			console.log("Solo 1v1 game started");
			startGame();
			handleViewTransitions("vue3", "vue2");
		});
	}

	initEvents() {
		document.getElementById("multiplayer_btn").addEventListener("click", () => {
			console.log("Multiplayer 2v2 game started");
			startMultiGame();
			handleViewTransitions("vue3", "vue2");
		});
	}

	init_solo_game_ai() {
		document.getElementById("solo_ai_btn").addEventListener("click", () => {
			console.log("Solo AI game started");
			startAI_Game();
			handleViewTransitions("vue3", "vue2");
		});
	}

	tournament_view()
	{
		document.getElementById("tournament_view").addEventListener("click", () => {
			console.log("Tournament view started");
			handleViewTransitions("tournament");
		});
	}

	handleDeconnection()
	{
		const deconnect_btn = document.getElementById("deconnect_btn");

		deconnect_btn.addEventListener("click", () => {
			handleViewTransitions("vue1", "vue2");
			console.log("Back to home page");
			window.history.back();
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

		// const back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');

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


		/***********************************************************************/
		/**************************SETTINGS************************************/
		/***********************************************************************/


		settings_btn.addEventListener('click', () => {
			view2.classList.remove('active');
			view5.classList.add('active');
		});


		/***********************************************************************/
		/**************************MODE_DE_JEUX********************************/
		/***********************************************************************/


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


		/***********************************************************************/
		/**************************BACK_TO_MENU********************************/
		/***********************************************************************/

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

		// back_to_menu_view_tournament.addEventListener('click', () => {
		// 	handleViewTransitions("vue2", "tournament");
		// 	tournament_view.classList.remove('active');
		// 	setTimeout(() => {
		// 		view2.classList.add('active');
		// 		view1.classList.add('active');
		// 		btn_back_home.classList.add('active');
		// 	} , 1000);
		// });



		/***********************************************************************/
		/**************************BACK_HOME************************************/
		/***********************************************************************/


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
		
		/***********************************************************************/
		/**************************BACK_TO_MENU********************************/
		/***********************************************************************/

		back_to_menu_view6.addEventListener('click', () => {
			view6.classList.remove('active');
			view3.classList.add('active');
			back_to_select_mode_view6.classList.remove('active');
			if (skin_perso.classList.contains('checked'))
			{
				skin_perso.classList.remove('checked');
				if (choose_your_skin.classList.contains('active'))
				{
					choose_your_skin.classList.remove('active');
					solo_1v1_btn.style.display = 'block';
					custom_ta_game.style.visibility = 'visible';
				}
			}
			if (power_selector.classList.contains('active'))
			{
				power_selector.classList.remove('active');
				powerUP.classList.remove('checked');
				reset_powerUP_grenade();
				reset_powerUP_teammate();
				reset_powerUP_inverse_player();
				powerUP_nb = 0;
				if (number_powerUP_1.classList.contains('checked'))
				{
					number_powerUP_1.classList.remove('checked');
				}
				if (number_powerUP_3.classList.contains('checked'))
				{
					number_powerUP_3.classList.remove('checked');
				}
				if (number_powerUP_5.classList.contains('checked'))
				{
					number_powerUP_5.classList.remove('checked');
				}
			}
		});



		const skin_perso_game_multi = document.getElementById('skin_perso_game_multi');

		back_to_menu_view7.addEventListener('click', () => {
			console.log('Back to menu view7 clicked');
			view3.classList.add('active');
			view7.classList.remove('active');
			back_to_select_mode_view7.classList.remove('active');
			if (skin_perso.classList.contains('checked'))
			{
				skin_perso.classList.remove('checked');
				if (choose_your_skin.classList.contains('active'))
				{
					choose_your_skin.classList.remove('active');
					solo_1v1_btn.style.display = 'block';
					custom_ta_game.style.visibility = 'visible';
					disable_skin_perso_player_solo();
				}
			}
			if (power_selector.classList.contains('active'))
			{
				power_selector.classList.remove('active');
				powerUP.classList.remove('checked');
				reset_powerUP_grenade();
				reset_powerUP_teammate();
				reset_powerUP_inverse_player();
				powerUP_nb = 0;
				if (number_powerUP_1.classList.contains('checked'))
				{
					number_powerUP_1.classList.remove('checked');
				}
				if (number_powerUP_3.classList.contains('checked'))
				{
					number_powerUP_3.classList.remove('checked');
				}
				if (number_powerUP_5.classList.contains('checked'))
				{
					number_powerUP_5.classList.remove('checked');
				}
			}
		});

		back_to_menu_view8.addEventListener('click', () => {
			view8.classList.remove('active');
			view4.classList.add('active');
			back_to_select_mode_view8.classList.remove('active');
			if (skin_perso_game_multi.classList.contains('checked'))
			{
				skin_perso_game_multi.classList.remove('checked');
				if (choose_your_skin_game_multi.classList.contains('active'))
				{
					choose_your_skin_game_multi.classList.remove('active');
					multiplayer_btn.style.display = 'block';
					custom_ta_game_multi.style.visibility = 'visible';
					disable_skin_multi();
				}
			}
			if (power_selector_game_multi.classList.contains('active'))
			{
				power_selector_game_multi.classList.remove('active');
				powerUP_multi.classList.remove('checked');
				reset_powerUP_grenadeTeam_player();
				reset_powerUP_freeze_Team_player();
				powerUP_nb = 0;
				powerUP_nb_multi = 0;
				if (number_powerUP_1_game_multi.classList.contains('checked'))
				{
					number_powerUP_1_game_multi.classList.remove('checked');
				}
				if (number_powerUP_3_game_multi.classList.contains('checked'))
				{
					number_powerUP_3_game_multi.classList.remove('checked');
				}
				if (number_powerUP_5_game_multi.classList.contains('checked'))
				{
					number_powerUP_5_game_multi.classList.remove('checked');
				}
			}
		});



		/***********************************************************************/
		/**************************POWER_UP_SOLO********************************/
		/***********************************************************************/


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
				reset_powerUP_inverse_player();
				powerUP_nb = 0;
				powerUP_nb_multi = 0;
				if (number_powerUP_1.classList.contains('checked'))
				{
					number_powerUP_1.classList.remove('checked');
				}
				if (number_powerUP_3.classList.contains('checked'))
				{
					number_powerUP_3.classList.remove('checked');
				}
				if (number_powerUP_5.classList.contains('checked'))
				{
					number_powerUP_5.classList.remove('checked');
				}
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







		/***********************************************************************/
		/**************************POWER_UP_multi*******************************/
		/***********************************************************************/




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
				reset_powerUP_grenadeTeam_player();
				reset_powerUP_freeze_Team_player();
				powerUP_nb = 0;
				powerUP_nb_multi = 0;
				if (number_powerUP_1_game_multi.classList.contains('checked'))
				{
					number_powerUP_1_game_multi.classList.remove('checked');
				}
				if (number_powerUP_3_game_multi.classList.contains('checked'))
				{
					number_powerUP_3_game_multi.classList.remove('checked');
				}
				if (number_powerUP_5_game_multi.classList.contains('checked'))
				{
					number_powerUP_5_game_multi.classList.remove('checked');
				}
			}
		});


		number_powerUP_1_game_multi.addEventListener('click', () => {
			number_powerUP_1_game_multi.classList.toggle('checked')
			number_powerUP_3_game_multi.classList.remove('checked');
			number_powerUP_5_game_multi.classList.remove('checked');
			console.log('1 powerUP selected and 3 and 5 unselected');
			init_nb_powerUP_grenadeFlash_team_player(1);
			init_powerUP_freeze_Team_player(1);
			powerUP_nb_multi = 1;
			
		});

		number_powerUP_3_game_multi.addEventListener('click', () => {
			number_powerUP_3_game_multi.classList.toggle('checked')
			number_powerUP_1_game_multi.classList.remove('checked');
			number_powerUP_5_game_multi.classList.remove('checked');
			console.log('3 powerUP selected and 1 and 5 unselected');
			init_nb_powerUP_grenadeFlash_team_player(3);
			init_powerUP_freeze_Team_player(3);
			powerUP_nb_multi = 3;

		});

		number_powerUP_5_game_multi.addEventListener('click', () => {
			number_powerUP_5_game_multi.classList.toggle('checked')
			number_powerUP_1_game_multi.classList.remove('checked');
			number_powerUP_3_game_multi.classList.remove('checked');
			console.log('5 powerUP selected and 1 and 3 unselected');
			init_nb_powerUP_grenadeFlash_team_player(5);
			init_powerUP_freeze_Team_player(5);
			powerUP_nb_multi = 5;
		});

		if (getValue_leave_game() == true)
		{
			powerUP_nb = 0;
			powerUP_nb_multi = 0;
			setLeaveGameVar(false);
		}




		/***********************************************************************/
		/**************************SKIN-SOLO************************************/
		/***********************************************************************/


		const choose_your_skin = document.getElementById('choose_your_skin');
		const valide_ton_skin = document.getElementById('valide_ton_skin');
		const custom_ta_game = document.getElementById('custom_ta_game');
		const solo_1v1_btn = document.getElementById('solo_1v1_btn');
		const switch_skn_left_id1 = document.getElementById('switch_skn_left_id1');
		const switch_skn_right_id1 = document.getElementById('switch_skn_right_id1');
		const switch_skn_left_id2 = document.getElementById('switch_skn_left_id2');
		const switch_skn_right_id2 = document.getElementById('switch_skn_right_id2');

		skin_perso.addEventListener('click', () => {
			skin_perso.classList.toggle('checked');
			
			if (skin_perso.classList.contains('checked')) {
				console.log('Skin perso is active');
				choose_your_skin.classList.add('active');
				solo_1v1_btn.style.display = 'none';
				custom_ta_game.style.visibility = 'hidden';
				enable_skin_perso_player_solo();

				if (valide_ton_skin.addEventListener('click', () => {
					console.log('Valide ton skin button clicked');
					choose_your_skin.classList.remove('active');
					solo_1v1_btn.style.display = 'block';
					custom_ta_game.style.visibility = 'visible';
					disable_skin_perso_player_solo_and_save();
				}));
			}
			else
			{
				console.log('Skin perso is inactive');
				if (choose_your_skin.classList.contains('active')) {
					choose_your_skin.classList.remove('active');
					solo_1v1_btn.style.display = 'block';
					custom_ta_game.style.visibility = 'visible';
					disable_skin_perso_player_solo();
				}
			}
		});

		switch_skn_left_id1.addEventListener('click', () => {
			console.log('Switch skin left id1 clicked');
			switch_skin_perso_player1_left();
		});

		switch_skn_right_id1.addEventListener('click', () => {
			console.log('Switch skin right id1 clicked');
			switch_skin_perso_player1_right();
		});

		switch_skn_left_id2.addEventListener('click', () => {
			console.log('Switch skin left id2 clicked');
			switch_skin_perso_player2_left();
		});

		switch_skn_right_id2.addEventListener('click', () => {
			console.log('Switch skin right id2 clicked');
			switch_skin_perso_player2_right();
		});


		/***********************************************************************/
		/**************************SKIN_MULTI***********************************/
		/***********************************************************************/

		const choose_your_skin_game_multi = document.getElementById('choose_your_skin_game_multi');
		const valide_ton_skin_game_multi = document.getElementById('valide_ton_skin_game_multi');
		const switch_skn_left_id1_game_multi = document.getElementById('switch_skn_left_id1_game_multi');
		const switch_skn_right_id1_game_multi = document.getElementById('switch_skn_right_id1_game_multi');
		const switch_skn_left_id2_game_multi = document.getElementById('switch_skn_left_id2_game_multi');
		const switch_skn_right_id2_game_multi = document.getElementById('switch_skn_right_id2_game_multi');
		const switch_skn_left_id3_game_multi = document.getElementById('switch_skn_left_id3_game_multi');
		const switch_skn_right_id3_game_multi = document.getElementById('switch_skn_right_id3_game_multi');
		const switch_skn_left_id4_game_multi = document.getElementById('switch_skn_left_id4_game_multi');
		const switch_skn_right_id4_game_multi = document.getElementById('switch_skn_right_id4_game_multi');
		const custom_ta_game_multi = document.getElementById('custom_ta_game_multi');
		const multiplayer_btn = document.getElementById('multiplayer_btn');

		skin_perso_game_multi.addEventListener('click', () => {
			skin_perso_game_multi.classList.toggle('checked');
			
			if (skin_perso_game_multi.classList.contains('checked')) {
				console.log('Skin perso is active');
				choose_your_skin_game_multi.classList.add('active');
				multiplayer_btn.style.display = 'none';
				custom_ta_game_multi.style.visibility = 'hidden';
				enable_skin_multi();

				if (valide_ton_skin_game_multi.addEventListener('click', () => {
					console.log('Valide ton skin button clicked');
					choose_your_skin_game_multi.classList.remove('active');
					multiplayer_btn.style.display = 'block';
					custom_ta_game_multi.style.visibility = 'visible';
					disable_skin_and_save_multi();
				}));
			}
			else
			{
				console.log('Skin perso is inactive');
				if (choose_your_skin_game_multi.classList.contains('active')) {
					choose_your_skin_game_multi.classList.remove('active');
					multiplayer_btn.style.display = 'block';
					custom_ta_game_multi.style.visibility = 'visible';
					disable_skin_multi();
				}
			}
		});

		switch_skn_left_id1_game_multi.addEventListener('click', () => {
			console.log('Switch skin left id1 clicked');
			switch_skin_perso_player1_left_multi();
		});

		switch_skn_right_id1_game_multi.addEventListener('click', () => {
			console.log('Switch skin right id1 clicked');
			switch_skin_perso_player1_right_multi();
		});

		switch_skn_left_id2_game_multi.addEventListener('click', () => {
			console.log('Switch skin left id2 clicked');
			switch_skin_perso_player2_left_multi();
		});

		switch_skn_right_id2_game_multi.addEventListener('click', () => {
			console.log('Switch skin right id2 clicked');
			switch_skin_perso_player2_right_multi();
		});

		switch_skn_left_id3_game_multi.addEventListener('click', () => {
			console.log('Switch skin left id3 clicked');
			switch_skin_perso_player3_left_multi();
		});

		switch_skn_right_id3_game_multi.addEventListener('click', () => {
			console.log('Switch skin right id3 clicked');
			switch_skin_perso_player3_right_multi();
		});

		switch_skn_left_id4_game_multi.addEventListener('click', () => {
			console.log('Switch skin left id4 clicked');
			switch_skin_perso_player4_left_multi();
		});

		switch_skn_right_id4_game_multi.addEventListener('click', () => {
			console.log('Switch skin right id4 clicked');
			switch_skin_perso_player4_right_multi();
		});



		/***********************************************************************/
		/**************************POWER_UP_INFO*******************************/
		/***********************************************************************/


		const power_up_info_id = document.getElementById('power_up_info_id');
		const container_info_power_up = document.getElementById('container_info_power_up');
		const exit_powerUP_info = document.getElementById('exit_powerUP_info');

		power_up_info_id.addEventListener('click', () => {
			container_info_power_up.classList.add('active');
			view6.classList.remove('active');
			back_to_select_mode_view6.classList.remove('active');
		});

		exit_powerUP_info.addEventListener('click', () => {
			container_info_power_up.classList.remove('active');
			view6.classList.add('active');
			back_to_select_mode_view6.classList.add('active');
		});


		/***********************************************************************/
		/**************************POWER_UP_INFO_MULTI*************************/
		/***********************************************************************/

		const power_up_info_id_multi = document.getElementById('power_up_info_id_multi');
		const container_info_power_up_multi = document.getElementById('container_info_power_up_multi');
		const exit_powerUP_info_multi = document.getElementById('exit_powerUP_info_multi');

		power_up_info_id_multi.addEventListener('click', () => {
			container_info_power_up_multi.classList.add('active');
			view8.classList.remove('active');
			back_to_select_mode_view8.classList.remove('active');
		});

		exit_powerUP_info_multi.addEventListener('click', () => {
			container_info_power_up_multi.classList.remove('active');
			view8.classList.add('active');
			back_to_select_mode_view8.classList.add('active');
		});

		/***********************************************************************/
		/*************************PARRAMETRE JEU ET PROFILE*********************/
		/***********************************************************************/

		const parametre_jeu = document.getElementById('parrametre_jeux_btn');
		const parametre_profile = document.getElementById('profile_parrametre_btn');
		const parametre_jeu_view = document.getElementById('parametres_jeu');
		const parametre_profile_view = document.getElementById('parametres_profile');
		const container_menu = document.getElementById('container');

		parametre_jeu.addEventListener('click', () => {
			console.log('Parrametre jeu clicked');
			parametre_jeu_view.classList.add('active');
			view5.classList.remove('active');
			btn_back_home.classList.remove('active');
			view1.classList.remove('active');
			container_menu.classList.add('active');
			btn_back_home.classList.add('active');
		});
		
		parametre_profile.addEventListener('click', () => {
			console.log('Parrametre profile clicked');
			parametre_profile_view.classList.add('active');
			// fetchProfile();
			view5.classList.remove('active');
			btn_back_home.classList.remove('active');
			view1.classList.remove('active');
			btn_back_home.classList.add('active');
		});


		btn_back_home.addEventListener('click', () => {
			if (parametre_jeu_view.classList.contains('active')) {
				parametre_jeu_view.classList.remove('active');
				view5.classList.add('active');
				// btn_back_home.classList.remove('active');
				view1.classList.add('active');
				container_menu.classList.remove('active');
			}
			if (parametre_profile_view.classList.contains('active')) {
				parametre_profile_view.classList.remove('active');
				view5.classList.add('active');
				// btn_back_home.classList.remove('active');
				view1.classList.add('active');
			}
		});

		/***********************************************************************/
		/*************************Parametre_profil******************************/
		/***********************************************************************/

		const valid_mdp = document.getElementById('valid_mdp');
		const modif_profil = document.getElementById('modif_profil');
		const profile_param_unlocked_id = document.getElementById('profile_param_unlocked_id');
		const valid_profile_info = document.getElementById('valid_profile_info');
		const fa_selector = document.getElementById('fa_selector');
		const active_fa = document.getElementById('active_fa');


		// valid_mdp.addEventListener('click', () => {
		// 	console.log('Valide mdp clicked');
		// 	modif_profil.classList.add('hidden');
		// 	btn_back_home.classList.remove('active');
		// 	profile_param_unlocked_id.classList.add('active');
		// });

		valid_profile_info.addEventListener('click', () => {
			console.log('Valide profile info clicked');
			profile_param_unlocked_id.classList.remove('active');
			modif_profil.classList.remove('hidden');
			btn_back_home.classList.add('active');
		});

		active_fa.addEventListener('click', () => {
			active_fa.classList.toggle('checked');
			if (active_fa.classList.contains('checked')) {
				console.log('FA is active');
				fa_selector.classList.add('active');
			}
			else {
				console.log('FA is inactive');
				fa_selector.classList.remove('active');
			}
		});


		/***********************************************************************/
		/*************************platformer************************************/
		/***********************************************************************/

		const platformer = document.getElementById('platformer_view');

		platformer.addEventListener('click', () => {
			console.log('Platformer button clicked');
			handleViewTransitions("platformer", "vue2");
		});
	}
}


export function getPowerUP_value() {
	return powerUP_nb;
}

export function getPowerUP_value_multi() {
	return powerUP_nb_multi;
}
