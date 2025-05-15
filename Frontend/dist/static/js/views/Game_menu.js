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
export default class Game_menu extends AbstractView {
    constructor() {
        super();
        this.setTitle("Game_menu");
        // Get accessToken from localStorage or other source
        const accessToken = localStorage.getItem('accessToken');
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
    }
    async getHtml() {
        return /*html*/ `
		<link rel="stylesheet" href="./static/js/css/game_menu.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="view1" id="view1">
			<div class="view1-content">
				<button id="view1_btn" class="btn">GAME MODE</button>
				<button id="settings_btn" class="btn">SETTINGS</button>
			</div>
		</div>
		<div class="back-home" id="back-home">
			<button id="btn_back_home" class="btn">BACK</button>
		</div>
			<div id="container" class="container_menu">
				<button id="btn_jouer">
					<h1>PLAY</h1>
				</button>
				<div class="view2" id="view2">
					<div class="view2-content">
						<h1>CHOOSE YOUR GAME MODE</h1>
						<div id="game_mode_btn" class="game_mode_btn">
							<button id="solo" class="btn">SOLO</button>
							<button id="multiplayer" class="btn">MULTIPLAYER</button>
							<button id="tournament_view" class="btn_tournament">
							<a href="/tournament" class="nav-link" data-link>TOURNAMENT</a>
							</button>
							<button id="platformer_view" class="btn_platformer">
								<a href="/PlatformView" class="nav-link" data-link>PLATFORMER</a>
							</button>
						</div>
					</div>
				</div>
				<div class="view3" id="view3">
					<div class="view3-content">
						<h1>SOLO GAME MODE</h1>
						<div id="game_mode_btn" class="game_mode_btn">
							<button id="prepar_game_1v1" class="btn">1v1</button>
							<button id="prepar_gane_ai" class="btn">ai</button>
						</div>
						<button id="back_to_menu_view3" class="btn">BACK TO MENU</button>
					</div>
				</div>
				<div class="view4" id="view4">
					<div class="view4-content">
						<h1>MULTIPLAYER GAME MODE</h1>
						<div id="game_mode_btn" class="game_mode_btn">
							<button id="prepar_game_multi" class="btn">2v2</button>
						</div>
						<button id="back_to_menu_view4" class="btn">BACK TO MENU</button>
					</div>
				</div>
				<div class="view5" id="view5">
					<div class="view5-content">
						<h1>SETTINGS</h1>
						<div id="select_parametres" class="select_parametres">
							<button id="profile_parrametre_btn" class="btn">PROFILE</button>
							<button id="parrametre_jeux_btn" class="btn">GAME</button>
							<button class="option" id="option_btn">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
							</button>
						</div>
					</div>
				</div>
				<div class="option_deconnect" id="option_deconnect">
					<div class="option_deconnect_content">
						<h1>OPTIONS</h1>
						<button id="deconnect_btn" class="option_deconnect_btn">LOG OUT</button>
						<button id="option_deconnected_btn" class="option_deconnected_btn_back">X</button>
					</div>
				</div>

				<div class="parametres_jeu" id="parametres_jeu">
					<div class="parametres_jeu_content" id="parametre_jeux_content">
						<h1>GAME SETTINGS</h1>
						<h2>PONG</h2>
						<div class="parametre_mode_jeu">
							<div class="mode_de_jeu_solo_parametre">
							<h3>Solo Game Mode</h3>

							<div class="joueur_touch">
								<div class="joueur" id="joueur1">
									<p>Player 1</p>
									<div class="controls">
										<p>Movement: W / S</p>
										<p>PowerUP: Z / X / C</p>
									</div>
								</div>
								<div class="joueur" id="joueur2">
									<p>Player 2</p>
									<div class="controls">
										<p>Movement: ⬆ / ⬇</p>
										<p>PowerUP: 1 / 2 / 3</p>
									</div>
								</div>
							</div>

							<div class="mode_de_jeu_multi_parametre">
								<h3>Multiplayer Game Mode</h3>
								<div class="joueur_touch">
									<div class="joueur" id="joueur1">
										<p>Player 1</p>
										<div class="controls">
											<p>Movement: W / S</p>
											<p>PowerUP: Z / X / C</p>
										</div>
									</div>
									<div class="joueur" id="joueur2">
										<p>Player 2</p>
										<div class="controls">
											<p>Movement: E / D</p>
											<p>PowerUP: Z / X / C</p>
										</div>
									</div>
									<div class="joueur" id="joueur3">
										<p>Player 3</p>
										<div class="controls">
											<p>Movement: O / L</p>
											<p>PowerUP: 1 / 2 / 3</p>
										</div>
									</div>
									<div class="joueur" id="joueur4">
										<p>Player 4</p>
										<div class="controls">
											<p>Movement: ⬆ / ⬇</p>
											<p>PowerUP: 1 / 2 / 3</p>
										</div>
									</div>
								</div>
								</div>
							</div>
						</div>
					</div>
			  </div>

				<div class="parrametres_profile" id="parametres_profile">
					<div class="parametres_profile_content">
						<h1>PROFILE SETTINGS</h1>
						<form id="modif_profil" class="modif_profile" onsubmit="accessProfileInfo(event)">
							<label for="mdp">Password</label>
							<input type="password" id="password" name="password" placeholder="Password" required>
							<button type="submit" class="btn_valider_mdp">Valider</button>
						</form>
						<div class="profile_param_unlocked" id="profile_param_unlocked_id">
							<div class="photo_profile">
								<div class="profile_photo_container">
									<div class="profile_photo_circle" id="profile_photo_circle"></div>
									<form id="uploadForm" enctype="multipart/form-data" onsubmit="changeProfilePicture(event)">
										<label for="profile_photo_input" class="photo_upload_icon"></label>
										<input type="file" name="image" id="profile_photo_input" style="color:white"/>
										<button type="submit">Upload</button>
									</form>
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
								<div id="fa_selector" class="fa_selector">
								<p>2FA :<span id="active_fa" class="active_fa"></span></p>
								</div>
								<button type="submit" id="valid_profile_info" class="valid_profile_info_btn">Valider</button>
							</form>
							<div class="btn_deconnect">
								<button id="deconnect_btn" class="btn_deconnect_btn" onclick="logout()">Deconnexion</button>
							</div>
							<div class="btn_delete">
								<button id="delete_btn" class="btn_delete_btn" onclick="unregister()">Delete account</button>
							</div>
							<p id="updateProfile-resultMessage" class="resultMessage" style="color:white"></p>
						</div>
					</div>
				</div>

				<div class="view6" id="view6">
					<div class="view6-content">
						<h1 id="custom_ta_game">CUSTOMIZE YOUR GAME</h1>
						<div class="powerUP">
							<p>PowerUP: <span id="power_up_info_id" class="power_up_info"></span><span id="powerUP" class="active_powerUP"></span></p>
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
							<p>Custom Skin: <span id="skin_perso" class="skin_perso"></span></p>
						</div>
						<button id="solo_1v1_btn" class="btn">
							<a href="/solo_game_1v1" class="nav-link" data-link>Start Game</a>
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
						<h1 id="custom_ta_game_multi">CUSTOMIZE YOUR MULTIPLAYER GAME</h1>
						<div class="powerUP">
							<p>PowerUP: <span id="power_up_info_id_multi" class="power_up_info"></span><span id="powerUP_multi" class="active_powerUP"></span></p>
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
							<p>Custom Skin: <span id="skin_perso_game_multi" class="skin_perso"></span></p>
						</div>
						<button id="multiplayer_btn" class="btn">
							<a href="/multi_player_game" class="nav-link" data-link>Start Game</a>
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
				<h1>CUSTOMIZE YOUR SKIN</h1>
				<div class="player1">
					<button class="switch_skin_left" id="switch_skn_left_id1"></button>
					<button class="switch_skin_right" id="switch_skn_right_id1"></button>
					<p>Player 1</p>
				</div>
				<div class="player2">
					<button class="switch_skin_left" id="switch_skn_left_id2"></button>
					<button class="switch_skin_right" id="switch_skn_right_id2"></button>
					<p>Player 2</p>
				</div>
				<button id="valide_ton_skin" class="btn">Confirm</button>
			</div>

			<div class="choose_your_skin_game_multi" id="choose_your_skin_game_multi">
				<h1>CUSTOMIZE YOUR SKIN</h1>
				<div class="player1_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id1_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id1_game_multi"></button>
					<p>Player 1</p>
				</div>
				<div class="player2_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id2_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id2_game_multi"></button>
					<p>Player 2</p>
				</div>
				<div class="player3_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id3_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id3_game_multi"></button>
					<p>Player 3</p>
				</div>
				<div class="player4_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id4_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id4_game_multi"></button>
					<p>Player 4</p>
				</div>
				<button id="valide_ton_skin_game_multi" class="btn">Confirm</button>
			</div>
			<div id="container_info_power_up" class="container_info_power_up">
			<div class="text_powerUP">
				<h1>Power-UP</h1>
				<p class="explication_general">The Power-Up is a bonus that gives you an advantage over your opponent. By enabling this option, you will start the match with at least one Power-Up of each type. You can also customize this amount and start with three or five of each.</p>
				<p class="explication_powerUP_grenade">The Flash Grenade Power-Up allows you to throw a grenade that will blind your opponent. But be careful! It works in a simple way: it completely darkens the game screen, meaning even the one who throws it gets blinded.</p>
				<p class="explication_powerUP_teammate">The Teammate Power-Up lets you call in a new player to join the game for a short time. You can move them using E/D for player 1 and O/L for player 2.</p>
				<p class="explication_powerUP_inverse">The Reverse Power-Up lets you invert your opponent’s controls for a short duration.</p>
				<div class="delay_powerUP_1">
					<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
					<p>COOLDOWN TIME: 10s</p>
				</div>
				<div class="delay_powerUP_2">
					<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
					<p>COOLDOWN TIME: 15s</p>
				</div>
				<div class="delay_powerUP_3">
					<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
					<p>COOLDOWN TIME: 10s</p>
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
				<p class="explication_general">The Power-Up is a bonus that gives you an advantage over your opponent. By enabling this option, you will start the match with at least one Power-Up of each type. You can also customize this amount and start with three or five of each.</p>
				<p class="explication_powerUP_grenade_multi">The Flash Grenade Power-Up lets you throw a grenade that blinds your opponent. But be careful! It works simply: it completely darkens the game screen, meaning even the one who throws it is blinded.</p>
				<p class="explication_powerUP_freeze">The Freeze Power-Up temporarily immobilizes the opposing team.</p>
				<div class="delay_powerUP_1_multi">
					<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
					<p>COOLDOWN TIME: 10s</p>
				</div>
				<div class="delay_powerUP_2_multi">
					<img src="../../../srcs/game/assets/image/timer-reset.svg" alt="delay">
					<p>COOLDOWN TIME: 10s</p>
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
	`;
    }
    init_solo_game() {
        document.getElementById("solo_1v1_btn").addEventListener("click", () => {
            // console.log("Solo 1v1 game started");
            startGame();
            handleViewTransitions("vue3", "vue2");
        });
    }
    initEvents() {
        document.getElementById("multiplayer_btn").addEventListener("click", () => {
            // console.log("Multiplayer 2v2 game started");
            startMultiGame();
            handleViewTransitions("vue3", "vue2");
        });
    }
    init_solo_game_ai() {
        document.getElementById("solo_ai_btn").addEventListener("click", () => {
            // console.log("Solo AI game started");
            startAI_Game();
            handleViewTransitions("vue3", "vue2");
        });
    }
    tournament_view() {
        document.getElementById("tournament_view").addEventListener("click", () => {
            // console.log("Tournament view started");
            handleViewTransitions("tournament");
        });
    }
    handleDeconnection() {
        const deconnect_btn = document.getElementById("deconnect_btn");
        deconnect_btn.addEventListener("click", () => {
            handleViewTransitions("vue1", "vue2");
            // console.log("Back to home page");
            window.history.back();
        });
    }
    game_menu() {
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
            if (skin_perso.classList.contains('checked')) {
                skin_perso.classList.remove('checked');
                if (choose_your_skin.classList.contains('active')) {
                    choose_your_skin.classList.remove('active');
                    solo_1v1_btn.style.display = 'block';
                    custom_ta_game.style.visibility = 'visible';
                }
            }
            if (power_selector.classList.contains('active')) {
                power_selector.classList.remove('active');
                powerUP.classList.remove('checked');
                reset_powerUP_grenade();
                reset_powerUP_teammate();
                reset_powerUP_inverse_player();
                powerUP_nb = 0;
                if (number_powerUP_1.classList.contains('checked')) {
                    number_powerUP_1.classList.remove('checked');
                }
                if (number_powerUP_3.classList.contains('checked')) {
                    number_powerUP_3.classList.remove('checked');
                }
                if (number_powerUP_5.classList.contains('checked')) {
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
            if (skin_perso.classList.contains('checked')) {
                skin_perso.classList.remove('checked');
                if (choose_your_skin.classList.contains('active')) {
                    choose_your_skin.classList.remove('active');
                    solo_1v1_btn.style.display = 'block';
                    custom_ta_game.style.visibility = 'visible';
                    disable_skin_perso_player_solo();
                }
            }
            if (power_selector.classList.contains('active')) {
                power_selector.classList.remove('active');
                powerUP.classList.remove('checked');
                reset_powerUP_grenade();
                reset_powerUP_teammate();
                reset_powerUP_inverse_player();
                powerUP_nb = 0;
                if (number_powerUP_1.classList.contains('checked')) {
                    number_powerUP_1.classList.remove('checked');
                }
                if (number_powerUP_3.classList.contains('checked')) {
                    number_powerUP_3.classList.remove('checked');
                }
                if (number_powerUP_5.classList.contains('checked')) {
                    number_powerUP_5.classList.remove('checked');
                }
            }
        });
        back_to_menu_view8.addEventListener('click', () => {
            view8.classList.remove('active');
            view4.classList.add('active');
            back_to_select_mode_view8.classList.remove('active');
            if (skin_perso_game_multi.classList.contains('checked')) {
                skin_perso_game_multi.classList.remove('checked');
                if (choose_your_skin_game_multi.classList.contains('active')) {
                    choose_your_skin_game_multi.classList.remove('active');
                    multiplayer_btn.style.display = 'block';
                    custom_ta_game_multi.style.visibility = 'visible';
                    disable_skin_multi();
                }
            }
            if (power_selector_game_multi.classList.contains('active')) {
                power_selector_game_multi.classList.remove('active');
                powerUP_multi.classList.remove('checked');
                reset_powerUP_grenadeTeam_player();
                reset_powerUP_freeze_Team_player();
                powerUP_nb = 0;
                powerUP_nb_multi = 0;
                if (number_powerUP_1_game_multi.classList.contains('checked')) {
                    number_powerUP_1_game_multi.classList.remove('checked');
                }
                if (number_powerUP_3_game_multi.classList.contains('checked')) {
                    number_powerUP_3_game_multi.classList.remove('checked');
                }
                if (number_powerUP_5_game_multi.classList.contains('checked')) {
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
                if (number_powerUP_1.classList.contains('checked')) {
                    number_powerUP_1.classList.remove('checked');
                }
                if (number_powerUP_3.classList.contains('checked')) {
                    number_powerUP_3.classList.remove('checked');
                }
                if (number_powerUP_5.classList.contains('checked')) {
                    number_powerUP_5.classList.remove('checked');
                }
            }
        });
        number_powerUP_1.addEventListener('click', () => {
            number_powerUP_1.classList.toggle('checked');
            number_powerUP_3.classList.remove('checked');
            number_powerUP_5.classList.remove('checked');
            console.log('1 powerUP selected and 3 and 5 unselected');
            init_nb_powerUP_grenadeFlash(1);
            init_nb_powerUP_teammate(1);
            init_powerUP_inverse_player(1);
            powerUP_nb = 1;
        });
        number_powerUP_3.addEventListener('click', () => {
            number_powerUP_3.classList.toggle('checked');
            number_powerUP_1.classList.remove('checked');
            number_powerUP_5.classList.remove('checked');
            console.log('3 powerUP selected and 1 and 5 unselected');
            init_nb_powerUP_grenadeFlash(3);
            init_nb_powerUP_teammate(3);
            init_powerUP_inverse_player(3);
            powerUP_nb = 3;
        });
        number_powerUP_5.addEventListener('click', () => {
            number_powerUP_5.classList.toggle('checked');
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
                if (number_powerUP_1_game_multi.classList.contains('checked')) {
                    number_powerUP_1_game_multi.classList.remove('checked');
                }
                if (number_powerUP_3_game_multi.classList.contains('checked')) {
                    number_powerUP_3_game_multi.classList.remove('checked');
                }
                if (number_powerUP_5_game_multi.classList.contains('checked')) {
                    number_powerUP_5_game_multi.classList.remove('checked');
                }
            }
        });
        number_powerUP_1_game_multi.addEventListener('click', () => {
            number_powerUP_1_game_multi.classList.toggle('checked');
            number_powerUP_3_game_multi.classList.remove('checked');
            number_powerUP_5_game_multi.classList.remove('checked');
            console.log('1 powerUP selected and 3 and 5 unselected');
            init_nb_powerUP_grenadeFlash_team_player(1);
            init_powerUP_freeze_Team_player(1);
            powerUP_nb_multi = 1;
        });
        number_powerUP_3_game_multi.addEventListener('click', () => {
            number_powerUP_3_game_multi.classList.toggle('checked');
            number_powerUP_1_game_multi.classList.remove('checked');
            number_powerUP_5_game_multi.classList.remove('checked');
            console.log('3 powerUP selected and 1 and 5 unselected');
            init_nb_powerUP_grenadeFlash_team_player(3);
            init_powerUP_freeze_Team_player(3);
            powerUP_nb_multi = 3;
        });
        number_powerUP_5_game_multi.addEventListener('click', () => {
            number_powerUP_5_game_multi.classList.toggle('checked');
            number_powerUP_1_game_multi.classList.remove('checked');
            number_powerUP_3_game_multi.classList.remove('checked');
            console.log('5 powerUP selected and 1 and 3 unselected');
            init_nb_powerUP_grenadeFlash_team_player(5);
            init_powerUP_freeze_Team_player(5);
            powerUP_nb_multi = 5;
        });
        if (getValue_leave_game() == true) {
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
                valide_ton_skin.addEventListener('click', () => {
                    console.log('Valide ton skin button clicked');
                    choose_your_skin.classList.remove('active');
                    solo_1v1_btn.style.display = 'block';
                    custom_ta_game.style.visibility = 'visible';
                    disable_skin_perso_player_solo_and_save();
                });
            }
            else {
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
                valide_ton_skin_game_multi.addEventListener('click', () => {
                    console.log('Valide ton skin button clicked');
                    choose_your_skin_game_multi.classList.remove('active');
                    multiplayer_btn.style.display = 'block';
                    custom_ta_game_multi.style.visibility = 'visible';
                    disable_skin_and_save_multi();
                });
            }
            else {
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
        // const modif_profil_photo = document.getElementById('profile_photo_circle');
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
        // modif_profil_photo.addEventListener('click', () => {
        // 	console.log('modif profile photo clicked');
        // 	document.getElementById("profile_photo_input").click();
        // 	changeProfilePicture();
        // });
        // valid_profile_info.addEventListener('click', () => {
        // 	console.log('Valide profile info clicked');
        // 	profile_param_unlocked_id.classList.remove('active');
        // 	modif_profil.classList.remove('hidden');
        // 	btn_back_home.classList.add('active');
        // });
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
        /***********************************************************************/
        /*************************Option deconnected****************************/
        /***********************************************************************/
        const option_deconnect = document.getElementById('option_deconnect');
        const option_btn = document.getElementById('option_btn');
        const option_deconnected_btn = document.getElementById('option_deconnected_btn');
        option_btn.addEventListener('click', () => {
            console.log('Option deconnect clicked');
            option_deconnect.classList.add('active');
            view5.classList.remove('active');
            btn_back_home.classList.remove('active');
            view1.classList.remove('active');
        });
        option_deconnected_btn.addEventListener('click', () => {
            console.log('Option deconnect back clicked');
            option_deconnect.classList.remove('active');
            view5.classList.add('active');
            btn_back_home.classList.add('active');
            view1.classList.add('active');
        });
    }
}
export function getPowerUP_value() {
    return powerUP_nb;
}
export function getPowerUP_value_multi() {
    return powerUP_nb_multi;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZV9tZW51LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy9HYW1lX21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNqRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDeEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDcEYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHFCQUFxQixFQUFFLE1BQU0sMEVBQTBFLENBQUM7QUFDL0ksT0FBTyxFQUFFLHdCQUF3QixFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0VBQXNFLENBQUM7QUFDeEksT0FBTyxFQUFFLDJCQUEyQixFQUFFLDRCQUE0QixFQUFFLE1BQU0scUVBQXFFLENBQUM7QUFDaEosT0FBTyxFQUFFLHdDQUF3QyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0scUZBQXFGLENBQUM7QUFDakwsT0FBTyxFQUFFLCtCQUErQixFQUFFLGdDQUFnQyxFQUFFLE1BQU0sMEVBQTBFLENBQUM7QUFDN0osT0FBTyxFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNuRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsOEJBQThCLEVBQUUsdUNBQXVDLEVBQUUsOEJBQThCLEVBQUUsK0JBQStCLEVBQUUsOEJBQThCLEVBQUUsK0JBQStCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNwVCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsMkJBQTJCLEVBQUUsa0JBQWtCLEVBQUUscUNBQXFDLEVBQUUsb0NBQW9DLEVBQUUsb0NBQW9DLEVBQUUscUNBQXFDLEVBQUUsb0NBQW9DLEVBQUUscUNBQXFDLEVBQUUsb0NBQW9DLEVBQUUs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QUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVILHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQzdDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFFSixDQUFDO0NBQ0Q7QUFHRCxNQUFNLFVBQVUsZ0JBQWdCO0lBQy9CLE9BQU8sVUFBVSxDQUFDO0FBQ25CLENBQUM7QUFFRCxNQUFNLFVBQVUsc0JBQXNCO0lBQ3JDLE9BQU8sZ0JBQWdCLENBQUM7QUFDekIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3LmpzXCI7XG5pbXBvcnQgeyBzdGFydEdhbWUsIHN0YXJ0QUlfR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvYmFieWxvbi5qc1wiO1xuaW1wb3J0IHsgc3RhcnRNdWx0aUdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG5pbXBvcnQgeyBpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoLCByZXNldF9wb3dlclVQX2dyZW5hZGUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3NvbG8vMXYxX3BsYXllci9pbml0X3Bvd2VyVVBfR3JlbmFkZUZsYXNoLmpzXCI7XG5pbXBvcnQgeyBpbml0X25iX3Bvd2VyVVBfdGVhbW1hdGUsIHJlc2V0X3Bvd2VyVVBfdGVhbW1hdGUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3NvbG8vMXYxX3BsYXllci9pbml0X3Bvd2VyVVBfdGVhbW1hdGUuanNcIjtcbmltcG9ydCB7IGluaXRfcG93ZXJVUF9pbnZlcnNlX3BsYXllciwgcmVzZXRfcG93ZXJVUF9pbnZlcnNlX3BsYXllciB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvc29sby8xdjFfcGxheWVyL2luaXRfcG93ZXJVUF9pbnZlcnNlLmpzXCI7XG5pbXBvcnQgeyBpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoX3RlYW1fcGxheWVyLCByZXNldF9wb3dlclVQX2dyZW5hZGVUZWFtX3BsYXllciB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvbXVsdGlwbGF5ZXIvMnYyX2dhbWUvaW5pdF9wb3dlclVQX0dlcm5hZGVGbGFzaF9tdWx0aS5qc1wiO1xuaW1wb3J0IHsgaW5pdF9wb3dlclVQX2ZyZWV6ZV9UZWFtX3BsYXllciwgcmVzZXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L211bHRpcGxheWVyLzJ2Ml9nYW1lL2luaXRfcG93ZXJfdXBfZnJlZXplLmpzXCI7XG5pbXBvcnQgeyBnZXRWYWx1ZV9sZWF2ZV9nYW1lLCBzZXRMZWF2ZUdhbWVWYXIgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcbmltcG9ydCB7IGVuYWJsZV9za2luX3BlcnNvX3BsYXllcl9zb2xvLCBkaXNhYmxlX3NraW5fcGVyc29fcGxheWVyX3NvbG8sIGRpc2FibGVfc2tpbl9wZXJzb19wbGF5ZXJfc29sb19hbmRfc2F2ZSwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9sZWZ0LCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIxX3JpZ2h0LCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX2xlZnQsIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjJfcmlnaHQgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3NvbG8vc2tpbi9pbml0X3NraW5fcGVyc28uanNcIjtcbmltcG9ydCB7IGVuYWJsZV9za2luX211bHRpLCBkaXNhYmxlX3NraW5fYW5kX3NhdmVfbXVsdGksIGRpc2FibGVfc2tpbl9tdWx0aSwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9yaWdodF9tdWx0aSwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9sZWZ0X211bHRpLCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX2xlZnRfbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjJfcmlnaHRfbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjNfbGVmdF9tdWx0aSwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyM19yaWdodF9tdWx0aSwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyNF9sZWZ0X211bHRpLCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXI0X3JpZ2h0X211bHRpIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9tdWx0aXBsYXllci9pbml0X3NraW5fcGVyc29fbXVsdGkuanNcIjtcblxubGV0IHBvd2VyVVBfbmIgPSAwO1xubGV0IHBvd2VyVVBfbmJfbXVsdGkgPSAwO1xuXG5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lX21lbnUgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0VGl0bGUoXCJHYW1lX21lbnVcIik7XG5cdFx0XG5cdFx0Ly8gR2V0IGFjY2Vzc1Rva2VuIGZyb20gbG9jYWxTdG9yYWdlIG9yIG90aGVyIHNvdXJjZVxuXHRcdGNvbnN0IGFjY2Vzc1Rva2VuOiBzdHJpbmcgfCBudWxsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY2Vzc1Rva2VuJyk7XG5cdFx0XG5cdFx0aWYgKCFhY2Nlc3NUb2tlbiB8fCBhY2Nlc3NUb2tlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsICcvJyk7XG5cdFx0XHRpbXBvcnQoJy4vSG9tZS5qcycpLnRoZW4oKG1vZHVsZTogYW55KSA9PiB7XG5cdFx0XHRcdGNvbnN0IEhvbWUgPSBtb2R1bGUuZGVmYXVsdDtcblx0XHRcdFx0Y29uc3QgaG9tZUluc3RhbmNlID0gbmV3IEhvbWUoKTtcblx0XHRcdFx0aG9tZUluc3RhbmNlLmdldEh0bWwoKS50aGVuKChodG1sOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0XHRjb25zdCBhcHBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuXHRcdFx0XHRcdGlmIChhcHBFbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRhcHBFbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XG5cdFx0XHRcdFx0XHRpZiAoaG9tZUluc3RhbmNlLmNyZWF0ZUFjY291bnQgJiYgdHlwZW9mIGhvbWVJbnN0YW5jZS5jcmVhdGVBY2NvdW50ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRcdGhvbWVJbnN0YW5jZS5jcmVhdGVBY2NvdW50KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGFzeW5jIGdldEh0bWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcblx0XHRyZXR1cm4gLypodG1sKi9gXG5cdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvZ2FtZV9tZW51LmNzc1wiPlxuXHRcdDxsaW5rIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJsYWNrK09wcytPbmUmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuXHRcdDxkaXYgY2xhc3M9XCJ2aWV3MVwiIGlkPVwidmlldzFcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3MS1jb250ZW50XCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJ2aWV3MV9idG5cIiBjbGFzcz1cImJ0blwiPkdBTUUgTU9ERTwvYnV0dG9uPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwic2V0dGluZ3NfYnRuXCIgY2xhc3M9XCJidG5cIj5TRVRUSU5HUzwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdFx0PGRpdiBjbGFzcz1cImJhY2staG9tZVwiIGlkPVwiYmFjay1ob21lXCI+XG5cdFx0XHQ8YnV0dG9uIGlkPVwiYnRuX2JhY2tfaG9tZVwiIGNsYXNzPVwiYnRuXCI+QkFDSzwvYnV0dG9uPlxuXHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBpZD1cImNvbnRhaW5lclwiIGNsYXNzPVwiY29udGFpbmVyX21lbnVcIj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cImJ0bl9qb3VlclwiPlxuXHRcdFx0XHRcdDxoMT5QTEFZPC9oMT5cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3MlwiIGlkPVwidmlldzJcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzItY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPkNIT09TRSBZT1VSIEdBTUUgTU9ERTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlkPVwiZ2FtZV9tb2RlX2J0blwiIGNsYXNzPVwiZ2FtZV9tb2RlX2J0blwiPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwic29sb1wiIGNsYXNzPVwiYnRuXCI+U09MTzwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwibXVsdGlwbGF5ZXJcIiBjbGFzcz1cImJ0blwiPk1VTFRJUExBWUVSPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJ0b3VybmFtZW50X3ZpZXdcIiBjbGFzcz1cImJ0bl90b3VybmFtZW50XCI+XG5cdFx0XHRcdFx0XHRcdDxhIGhyZWY9XCIvdG91cm5hbWVudFwiIGNsYXNzPVwibmF2LWxpbmtcIiBkYXRhLWxpbms+VE9VUk5BTUVOVDwvYT5cblx0XHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJwbGF0Zm9ybWVyX3ZpZXdcIiBjbGFzcz1cImJ0bl9wbGF0Zm9ybWVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIi9QbGF0Zm9ybVZpZXdcIiBjbGFzcz1cIm5hdi1saW5rXCIgZGF0YS1saW5rPlBMQVRGT1JNRVI8L2E+XG5cdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzNcIiBpZD1cInZpZXczXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXczLWNvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMT5TT0xPIEdBTUUgTU9ERTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlkPVwiZ2FtZV9tb2RlX2J0blwiIGNsYXNzPVwiZ2FtZV9tb2RlX2J0blwiPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwicHJlcGFyX2dhbWVfMXYxXCIgY2xhc3M9XCJidG5cIj4xdjE8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInByZXBhcl9nYW5lX2FpXCIgY2xhc3M9XCJidG5cIj5haTwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXczXCIgY2xhc3M9XCJidG5cIj5CQUNLIFRPIE1FTlU8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3NFwiIGlkPVwidmlldzRcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzQtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPk1VTFRJUExBWUVSIEdBTUUgTU9ERTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlkPVwiZ2FtZV9tb2RlX2J0blwiIGNsYXNzPVwiZ2FtZV9tb2RlX2J0blwiPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwicHJlcGFyX2dhbWVfbXVsdGlcIiBjbGFzcz1cImJ0blwiPjJ2MjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXc0XCIgY2xhc3M9XCJidG5cIj5CQUNLIFRPIE1FTlU8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3NVwiIGlkPVwidmlldzVcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzUtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPlNFVFRJTkdTPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgaWQ9XCJzZWxlY3RfcGFyYW1ldHJlc1wiIGNsYXNzPVwic2VsZWN0X3BhcmFtZXRyZXNcIj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInByb2ZpbGVfcGFycmFtZXRyZV9idG5cIiBjbGFzcz1cImJ0blwiPlBST0ZJTEU8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInBhcnJhbWV0cmVfamV1eF9idG5cIiBjbGFzcz1cImJ0blwiPkdBTUU8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cIm9wdGlvblwiIGlkPVwib3B0aW9uX2J0blwiPlxuXHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9tZW51LnN2Z1wiIGFsdD1cImxlYXZlXCI+XG5cdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3B0aW9uX2RlY29ubmVjdFwiIGlkPVwib3B0aW9uX2RlY29ubmVjdFwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvcHRpb25fZGVjb25uZWN0X2NvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMT5PUFRJT05TPC9oMT5cblx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJkZWNvbm5lY3RfYnRuXCIgY2xhc3M9XCJvcHRpb25fZGVjb25uZWN0X2J0blwiPkxPRyBPVVQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJvcHRpb25fZGVjb25uZWN0ZWRfYnRuXCIgY2xhc3M9XCJvcHRpb25fZGVjb25uZWN0ZWRfYnRuX2JhY2tcIj5YPC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwYXJhbWV0cmVzX2pldVwiIGlkPVwicGFyYW1ldHJlc19qZXVcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFyYW1ldHJlc19qZXVfY29udGVudFwiIGlkPVwicGFyYW1ldHJlX2pldXhfY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPkdBTUUgU0VUVElOR1M8L2gxPlxuXHRcdFx0XHRcdFx0PGgyPlBPTkc8L2gyPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBhcmFtZXRyZV9tb2RlX2pldVwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kZV9kZV9qZXVfc29sb19wYXJhbWV0cmVcIj5cblx0XHRcdFx0XHRcdFx0PGgzPlNvbG8gR2FtZSBNb2RlPC9oMz5cblxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiam91ZXVyX3RvdWNoXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImpvdWV1clwiIGlkPVwiam91ZXVyMVwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+UGxheWVyIDE8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udHJvbHNcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+TW92ZW1lbnQ6IFcgLyBTPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Qb3dlclVQOiBaIC8gWCAvIEM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiam91ZXVyXCIgaWQ9XCJqb3VldXIyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD5QbGF5ZXIgMjwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250cm9sc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Nb3ZlbWVudDog4qyGIC8g4qyHPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Qb3dlclVQOiAxIC8gMiAvIDM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGVfZGVfamV1X211bHRpX3BhcmFtZXRyZVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxoMz5NdWx0aXBsYXllciBHYW1lIE1vZGU8L2gzPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJqb3VldXJfdG91Y2hcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJqb3VldXJcIiBpZD1cImpvdWV1cjFcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UGxheWVyIDE8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250cm9sc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPk1vdmVtZW50OiBXIC8gUzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Qb3dlclVQOiBaIC8gWCAvIEM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiam91ZXVyXCIgaWQ9XCJqb3VldXIyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBsYXllciAyPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udHJvbHNcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Nb3ZlbWVudDogRSAvIEQ8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UG93ZXJVUDogWiAvIFggLyBDPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImpvdWV1clwiIGlkPVwiam91ZXVyM1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5QbGF5ZXIgMzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRyb2xzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+TW92ZW1lbnQ6IE8gLyBMPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVA6IDEgLyAyIC8gMzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJqb3VldXJcIiBpZD1cImpvdWV1cjRcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UGxheWVyIDQ8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250cm9sc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPk1vdmVtZW50OiDirIYgLyDirIc8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UG93ZXJVUDogMSAvIDIgLyAzPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0ICA8L2Rpdj5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFycmFtZXRyZXNfcHJvZmlsZVwiIGlkPVwicGFyYW1ldHJlc19wcm9maWxlXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBhcmFtZXRyZXNfcHJvZmlsZV9jb250ZW50XCI+XG5cdFx0XHRcdFx0XHQ8aDE+UFJPRklMRSBTRVRUSU5HUzwvaDE+XG5cdFx0XHRcdFx0XHQ8Zm9ybSBpZD1cIm1vZGlmX3Byb2ZpbFwiIGNsYXNzPVwibW9kaWZfcHJvZmlsZVwiIG9uc3VibWl0PVwiYWNjZXNzUHJvZmlsZUluZm8oZXZlbnQpXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJtZHBcIj5QYXNzd29yZDwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCIgbmFtZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIHJlcXVpcmVkPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bl92YWxpZGVyX21kcFwiPlZhbGlkZXI8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZm9ybT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9maWxlX3BhcmFtX3VubG9ja2VkXCIgaWQ9XCJwcm9maWxlX3BhcmFtX3VubG9ja2VkX2lkXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwaG90b19wcm9maWxlXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInByb2ZpbGVfcGhvdG9fY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZmlsZV9waG90b19jaXJjbGVcIiBpZD1cInByb2ZpbGVfcGhvdG9fY2lyY2xlXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8Zm9ybSBpZD1cInVwbG9hZEZvcm1cIiBlbmN0eXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIG9uc3VibWl0PVwiY2hhbmdlUHJvZmlsZVBpY3R1cmUoZXZlbnQpXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwcm9maWxlX3Bob3RvX2lucHV0XCIgY2xhc3M9XCJwaG90b191cGxvYWRfaWNvblwiPjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiZmlsZVwiIG5hbWU9XCJpbWFnZVwiIGlkPVwicHJvZmlsZV9waG90b19pbnB1dFwiIHN0eWxlPVwiY29sb3I6d2hpdGVcIi8+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlVwbG9hZDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGZvcm0gb25zdWJtaXQ9XCJ1cGRhdGVQcm9maWxlSW5mbyhldmVudClcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXRfY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwidXNlcm5hbWVcIj5DaGFuZ2UgdXNlcm5hbWU8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJjaGFuZ2VfdXNlcm5hbWVcIiBuYW1lPVwidXNlcm5hbWVcIj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXRfY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwiZW1haWxcIj5DaGFuZ2UgZW1haWw8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJlbWFpbFwiIGlkPVwiY2hhbmdlX2VtYWlsXCIgbmFtZT1cImVtYWlsXCI+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0X2NvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInBhc3N3b3JkXCI+Q2hhbmdlIHBhc3N3b3JkPC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cImNoYW5nZV9wYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiKioqKioqXCI+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0X2NvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cImNvbmZpcm1fcGFzc3dvcmRcIj5Db25maXJtIG5ldyBwYXNzd29yZDwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJjb25maXJtX2NoYW5nZV9wYXNzd29yZFwiIG5hbWU9XCJjb25maXJtX3Bhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCIqKioqKipcIj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGlkPVwiZmFfc2VsZWN0b3JcIiBjbGFzcz1cImZhX3NlbGVjdG9yXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHA+MkZBIDo8c3BhbiBpZD1cImFjdGl2ZV9mYVwiIGNsYXNzPVwiYWN0aXZlX2ZhXCI+PC9zcGFuPjwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBpZD1cInZhbGlkX3Byb2ZpbGVfaW5mb1wiIGNsYXNzPVwidmFsaWRfcHJvZmlsZV9pbmZvX2J0blwiPlZhbGlkZXI8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYnRuX2RlY29ubmVjdFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJkZWNvbm5lY3RfYnRuXCIgY2xhc3M9XCJidG5fZGVjb25uZWN0X2J0blwiIG9uY2xpY2s9XCJsb2dvdXQoKVwiPkRlY29ubmV4aW9uPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYnRuX2RlbGV0ZVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJkZWxldGVfYnRuXCIgY2xhc3M9XCJidG5fZGVsZXRlX2J0blwiIG9uY2xpY2s9XCJ1bnJlZ2lzdGVyKClcIj5EZWxldGUgYWNjb3VudDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PHAgaWQ9XCJ1cGRhdGVQcm9maWxlLXJlc3VsdE1lc3NhZ2VcIiBjbGFzcz1cInJlc3VsdE1lc3NhZ2VcIiBzdHlsZT1cImNvbG9yOndoaXRlXCI+PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3NlwiIGlkPVwidmlldzZcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzYtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxIGlkPVwiY3VzdG9tX3RhX2dhbWVcIj5DVVNUT01JWkUgWU9VUiBHQU1FPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQXCI+XG5cdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVA6IDxzcGFuIGlkPVwicG93ZXJfdXBfaW5mb19pZFwiIGNsYXNzPVwicG93ZXJfdXBfaW5mb1wiPjwvc3Bhbj48c3BhbiBpZD1cInBvd2VyVVBcIiBjbGFzcz1cImFjdGl2ZV9wb3dlclVQXCI+PC9zcGFuPjwvcD5cblx0XHRcdFx0XHRcdFx0PGRpdiBpZD1cInBvd2VyX3NlbGVjdG9yXCIgY2xhc3M9XCJwb3dlcl9zZWxlY3RvclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+MTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfMVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD4zPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF8zXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPjU8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzVcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNraW5cIj5cblx0XHRcdFx0XHRcdFx0PHA+Q3VzdG9tIFNraW46IDxzcGFuIGlkPVwic2tpbl9wZXJzb1wiIGNsYXNzPVwic2tpbl9wZXJzb1wiPjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJzb2xvXzF2MV9idG5cIiBjbGFzcz1cImJ0blwiPlxuXHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiL3NvbG9fZ2FtZV8xdjFcIiBjbGFzcz1cIm5hdi1saW5rXCIgZGF0YS1saW5rPlN0YXJ0IEdhbWU8L2E+XG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3N1wiIGlkPVwidmlldzdcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzctY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPkNVU1RPTUlTRSBUQSBHQU1FIENPTlRSRSBMJ0lBPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQXCI+XG5cdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVAgOjxzcGFuIGlkPVwicG93ZXJVUFwiIGNsYXNzPVwiYWN0aXZlX3Bvd2VyVVBcIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGlkPVwicG93ZXJfc2VsZWN0b3JcIiBjbGFzcz1cInBvd2VyX3NlbGVjdG9yXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD4xPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF8xXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPjM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzNcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+NTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfNVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2tpblwiPlxuXHRcdFx0XHRcdFx0XHQ8cD5Ta2luIFBlcnNvbm5hbGlzZSA6PHNwYW4gaWQ9XCJza2luX3BlcnNvXCIgY2xhc3M9XCJza2luX3BlcnNvXCI8L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwic29sb19haV9idG5cIiBjbGFzcz1cImJ0blwiPlxuXHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiL3NvbG9fZ2FtZV9haVwiIGNsYXNzPVwibmF2LWxpbmtcIiBkYXRhLWxpbms+TGFuY2VyIGxhIHBhcnRpZTwvYT5cblx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXc4XCIgaWQ9XCJ2aWV3OFwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3OC1jb250ZW50XCI+XG5cdFx0XHRcdFx0XHQ8aDEgaWQ9XCJjdXN0b21fdGFfZ2FtZV9tdWx0aVwiPkNVU1RPTUlaRSBZT1VSIE1VTFRJUExBWUVSIEdBTUU8L2gxPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBcIj5cblx0XHRcdFx0XHRcdFx0PHA+UG93ZXJVUDogPHNwYW4gaWQ9XCJwb3dlcl91cF9pbmZvX2lkX211bHRpXCIgY2xhc3M9XCJwb3dlcl91cF9pbmZvXCI+PC9zcGFuPjxzcGFuIGlkPVwicG93ZXJVUF9tdWx0aVwiIGNsYXNzPVwiYWN0aXZlX3Bvd2VyVVBcIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGlkPVwicG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aVwiIGNsYXNzPVwicG93ZXJfc2VsZWN0b3JcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPjE8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD4zPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGlcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+NTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJza2luXCI+XG5cdFx0XHRcdFx0XHRcdDxwPkN1c3RvbSBTa2luOiA8c3BhbiBpZD1cInNraW5fcGVyc29fZ2FtZV9tdWx0aVwiIGNsYXNzPVwic2tpbl9wZXJzb1wiPjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJtdWx0aXBsYXllcl9idG5cIiBjbGFzcz1cImJ0blwiPlxuXHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiL211bHRpX3BsYXllcl9nYW1lXCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5TdGFydCBHYW1lPC9hPlxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiYmFja1wiIGlkPVwiYmFja190b19zZWxlY3RfbW9kZV92aWV3NlwiPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXc2XCIgY2xhc3M9XCJidG5fYmFja1wiPkJBQ0s8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cImJhY2tcIiBpZD1cImJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzdcIj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3N1wiIGNsYXNzPVwiYnRuX2JhY2tcIj5CQUNLPC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJiYWNrXCIgaWQ9XCJiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4XCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJiYWNrX3RvX21lbnVfdmlldzhcIiBjbGFzcz1cImJ0bl9iYWNrXCI+QkFDSzwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2hvb3NlX3lvdXJfc2tpblwiIGlkPVwiY2hvb3NlX3lvdXJfc2tpblwiPlxuXHRcdFx0XHQ8aDE+Q1VTVE9NSVpFIFlPVVIgU0tJTjwvaDE+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXIxXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX2xlZnRcIiBpZD1cInN3aXRjaF9za25fbGVmdF9pZDFcIj48L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fcmlnaHRcIiBpZD1cInN3aXRjaF9za25fcmlnaHRfaWQxXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PHA+UGxheWVyIDE8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyMlwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9sZWZ0XCIgaWQ9XCJzd2l0Y2hfc2tuX2xlZnRfaWQyXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX3JpZ2h0XCIgaWQ9XCJzd2l0Y2hfc2tuX3JpZ2h0X2lkMlwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxwPlBsYXllciAyPC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cInZhbGlkZV90b25fc2tpblwiIGNsYXNzPVwiYnRuXCI+Q29uZmlybTwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cblx0XHRcdDxkaXYgY2xhc3M9XCJjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGlcIiBpZD1cImNob29zZV95b3VyX3NraW5fZ2FtZV9tdWx0aVwiPlxuXHRcdFx0XHQ8aDE+Q1VTVE9NSVpFIFlPVVIgU0tJTjwvaDE+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXIxX2dhbWVfbXVsdGlcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fbGVmdFwiIGlkPVwic3dpdGNoX3Nrbl9sZWZ0X2lkMV9nYW1lX211bHRpXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX3JpZ2h0XCIgaWQ9XCJzd2l0Y2hfc2tuX3JpZ2h0X2lkMV9nYW1lX211bHRpXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PHA+UGxheWVyIDE8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyMl9nYW1lX211bHRpXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX2xlZnRcIiBpZD1cInN3aXRjaF9za25fbGVmdF9pZDJfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9yaWdodFwiIGlkPVwic3dpdGNoX3Nrbl9yaWdodF9pZDJfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxwPlBsYXllciAyPC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcjNfZ2FtZV9tdWx0aVwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9sZWZ0XCIgaWQ9XCJzd2l0Y2hfc2tuX2xlZnRfaWQzX2dhbWVfbXVsdGlcIj48L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fcmlnaHRcIiBpZD1cInN3aXRjaF9za25fcmlnaHRfaWQzX2dhbWVfbXVsdGlcIj48L2J1dHRvbj5cblx0XHRcdFx0XHQ8cD5QbGF5ZXIgMzwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXI0X2dhbWVfbXVsdGlcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fbGVmdFwiIGlkPVwic3dpdGNoX3Nrbl9sZWZ0X2lkNF9nYW1lX211bHRpXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX3JpZ2h0XCIgaWQ9XCJzd2l0Y2hfc2tuX3JpZ2h0X2lkNF9nYW1lX211bHRpXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PHA+UGxheWVyIDQ8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwidmFsaWRlX3Rvbl9za2luX2dhbWVfbXVsdGlcIiBjbGFzcz1cImJ0blwiPkNvbmZpcm08L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBpZD1cImNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwXCIgY2xhc3M9XCJjb250YWluZXJfaW5mb19wb3dlcl91cFwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRleHRfcG93ZXJVUFwiPlxuXHRcdFx0XHQ8aDE+UG93ZXItVVA8L2gxPlxuXHRcdFx0XHQ8cCBjbGFzcz1cImV4cGxpY2F0aW9uX2dlbmVyYWxcIj5UaGUgUG93ZXItVXAgaXMgYSBib251cyB0aGF0IGdpdmVzIHlvdSBhbiBhZHZhbnRhZ2Ugb3ZlciB5b3VyIG9wcG9uZW50LiBCeSBlbmFibGluZyB0aGlzIG9wdGlvbiwgeW91IHdpbGwgc3RhcnQgdGhlIG1hdGNoIHdpdGggYXQgbGVhc3Qgb25lIFBvd2VyLVVwIG9mIGVhY2ggdHlwZS4gWW91IGNhbiBhbHNvIGN1c3RvbWl6ZSB0aGlzIGFtb3VudCBhbmQgc3RhcnQgd2l0aCB0aHJlZSBvciBmaXZlIG9mIGVhY2guPC9wPlxuXHRcdFx0XHQ8cCBjbGFzcz1cImV4cGxpY2F0aW9uX3Bvd2VyVVBfZ3JlbmFkZVwiPlRoZSBGbGFzaCBHcmVuYWRlIFBvd2VyLVVwIGFsbG93cyB5b3UgdG8gdGhyb3cgYSBncmVuYWRlIHRoYXQgd2lsbCBibGluZCB5b3VyIG9wcG9uZW50LiBCdXQgYmUgY2FyZWZ1bCEgSXQgd29ya3MgaW4gYSBzaW1wbGUgd2F5OiBpdCBjb21wbGV0ZWx5IGRhcmtlbnMgdGhlIGdhbWUgc2NyZWVuLCBtZWFuaW5nIGV2ZW4gdGhlIG9uZSB3aG8gdGhyb3dzIGl0IGdldHMgYmxpbmRlZC48L3A+XG5cdFx0XHRcdDxwIGNsYXNzPVwiZXhwbGljYXRpb25fcG93ZXJVUF90ZWFtbWF0ZVwiPlRoZSBUZWFtbWF0ZSBQb3dlci1VcCBsZXRzIHlvdSBjYWxsIGluIGEgbmV3IHBsYXllciB0byBqb2luIHRoZSBnYW1lIGZvciBhIHNob3J0IHRpbWUuIFlvdSBjYW4gbW92ZSB0aGVtIHVzaW5nIEUvRCBmb3IgcGxheWVyIDEgYW5kIE8vTCBmb3IgcGxheWVyIDIuPC9wPlxuXHRcdFx0XHQ8cCBjbGFzcz1cImV4cGxpY2F0aW9uX3Bvd2VyVVBfaW52ZXJzZVwiPlRoZSBSZXZlcnNlIFBvd2VyLVVwIGxldHMgeW91IGludmVydCB5b3VyIG9wcG9uZW504oCZcyBjb250cm9scyBmb3IgYSBzaG9ydCBkdXJhdGlvbi48L3A+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJkZWxheV9wb3dlclVQXzFcIj5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdGltZXItcmVzZXQuc3ZnXCIgYWx0PVwiZGVsYXlcIj5cblx0XHRcdFx0XHQ8cD5DT09MRE9XTiBUSU1FOiAxMHM8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZGVsYXlfcG93ZXJVUF8yXCI+XG5cdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RpbWVyLXJlc2V0LnN2Z1wiIGFsdD1cImRlbGF5XCI+XG5cdFx0XHRcdFx0PHA+Q09PTERPV04gVElNRTogMTVzPC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImRlbGF5X3Bvd2VyVVBfM1wiPlxuXHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90aW1lci1yZXNldC5zdmdcIiBhbHQ9XCJkZWxheVwiPlxuXHRcdFx0XHRcdDxwPkNPT0xET1dOIFRJTUU6IDEwczwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJfaW1hZ2VfcG93ZXJVUFwiPlxuXHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvZ3JlbmFkZV9ub19iZy5wbmdcIiBhbHQ9XCJncmVuYWRlXCIgY2xhc3M9XCJncmVuYWRlXCI+XG5cdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90ZWFtbWF0ZV9ub19iZy5wbmdcIiBhbHQ9XCJ0ZWFtbWF0ZVwiIGNsYXNzPVwidGVhbW1hdGVcIj5cblx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3JldmVyc2Vfbm9fYmcucG5nXCIgYWx0PVwiaW52ZXJzZV9wbGF5ZXJcIiBjbGFzcz1cImludmVyc2VfcGxheWVyXCI+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgaWQ9XCJleGl0X3Bvd2VyVVBfaW5mb1wiIGNsYXNzPVwiZXhpdF9wb3dlclVQX2luZm9cIj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cImV4aXRfcG93ZXJVUF9pbmZvX2J0blwiIGNsYXNzPVwiYnRuXCI+XG5cdFx0XHRcdFx0WFxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXG5cdFx0PGRpdiBpZD1cImNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwX211bHRpXCIgY2xhc3M9XCJjb250YWluZXJfaW5mb19wb3dlcl91cFwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRleHRfcG93ZXJVUFwiPlxuXHRcdFx0XHQ8aDE+UG93ZXItVVA8L2gxPlxuXHRcdFx0XHQ8cCBjbGFzcz1cImV4cGxpY2F0aW9uX2dlbmVyYWxcIj5UaGUgUG93ZXItVXAgaXMgYSBib251cyB0aGF0IGdpdmVzIHlvdSBhbiBhZHZhbnRhZ2Ugb3ZlciB5b3VyIG9wcG9uZW50LiBCeSBlbmFibGluZyB0aGlzIG9wdGlvbiwgeW91IHdpbGwgc3RhcnQgdGhlIG1hdGNoIHdpdGggYXQgbGVhc3Qgb25lIFBvd2VyLVVwIG9mIGVhY2ggdHlwZS4gWW91IGNhbiBhbHNvIGN1c3RvbWl6ZSB0aGlzIGFtb3VudCBhbmQgc3RhcnQgd2l0aCB0aHJlZSBvciBmaXZlIG9mIGVhY2guPC9wPlxuXHRcdFx0XHQ8cCBjbGFzcz1cImV4cGxpY2F0aW9uX3Bvd2VyVVBfZ3JlbmFkZV9tdWx0aVwiPlRoZSBGbGFzaCBHcmVuYWRlIFBvd2VyLVVwIGxldHMgeW91IHRocm93IGEgZ3JlbmFkZSB0aGF0IGJsaW5kcyB5b3VyIG9wcG9uZW50LiBCdXQgYmUgY2FyZWZ1bCEgSXQgd29ya3Mgc2ltcGx5OiBpdCBjb21wbGV0ZWx5IGRhcmtlbnMgdGhlIGdhbWUgc2NyZWVuLCBtZWFuaW5nIGV2ZW4gdGhlIG9uZSB3aG8gdGhyb3dzIGl0IGlzIGJsaW5kZWQuPC9wPlxuXHRcdFx0XHQ8cCBjbGFzcz1cImV4cGxpY2F0aW9uX3Bvd2VyVVBfZnJlZXplXCI+VGhlIEZyZWV6ZSBQb3dlci1VcCB0ZW1wb3JhcmlseSBpbW1vYmlsaXplcyB0aGUgb3Bwb3NpbmcgdGVhbS48L3A+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJkZWxheV9wb3dlclVQXzFfbXVsdGlcIj5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdGltZXItcmVzZXQuc3ZnXCIgYWx0PVwiZGVsYXlcIj5cblx0XHRcdFx0XHQ8cD5DT09MRE9XTiBUSU1FOiAxMHM8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZGVsYXlfcG93ZXJVUF8yX211bHRpXCI+XG5cdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RpbWVyLXJlc2V0LnN2Z1wiIGFsdD1cImRlbGF5XCI+XG5cdFx0XHRcdFx0PHA+Q09PTERPV04gVElNRTogMTBzPC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lcl9pbWFnZV9wb3dlclVQX211bHRpXCI+XG5cdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9ncmVuYWRlX25vX2JnLnBuZ1wiIGFsdD1cImdyZW5hZGVcIiBjbGFzcz1cImdyZW5hZGVcIj5cblx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2ZyZWV6ZV9ub19iZy5wbmdcIiBhbHQ9XCJmcmVlemVcIiBjbGFzcz1cImZyZWV6ZVwiPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGlkPVwiZXhpdF9wb3dlclVQX2luZm9fbXVsdGlcIiBjbGFzcz1cImV4aXRfcG93ZXJVUF9pbmZvXCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJleGl0X3Bvd2VyVVBfaW5mb19idG5fbXVsdGlcIiBjbGFzcz1cImJ0blwiPlxuXHRcdFx0XHRcdFhcblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj5cblx0YDt9XG5cblx0aW5pdF9zb2xvX2dhbWUoKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb2xvXzF2MV9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiU29sbyAxdjEgZ2FtZSBzdGFydGVkXCIpO1xuXHRcdFx0c3RhcnRHYW1lKCk7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUzXCIsIFwidnVlMlwiKTtcblx0XHR9KTtcblx0fVxuXG5cdGluaXRFdmVudHMoKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtdWx0aXBsYXllcl9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiTXVsdGlwbGF5ZXIgMnYyIGdhbWUgc3RhcnRlZFwiKTtcblx0XHRcdHN0YXJ0TXVsdGlHYW1lKCk7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUzXCIsIFwidnVlMlwiKTtcblx0XHR9KTtcblx0fVxuXG5cdGluaXRfc29sb19nYW1lX2FpKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29sb19haV9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiU29sbyBBSSBnYW1lIHN0YXJ0ZWRcIik7XG5cdFx0XHRzdGFydEFJX0dhbWUoKTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTNcIiwgXCJ2dWUyXCIpO1xuXHRcdH0pO1xuXHR9XG5cblx0dG91cm5hbWVudF92aWV3KCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG91cm5hbWVudF92aWV3XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIlRvdXJuYW1lbnQgdmlldyBzdGFydGVkXCIpO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidG91cm5hbWVudFwiKTtcblx0XHR9KTtcblx0fVxuXG5cdGhhbmRsZURlY29ubmVjdGlvbigpIHtcblx0XHRjb25zdCBkZWNvbm5lY3RfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWNvbm5lY3RfYnRuXCIpO1xuXG5cdFx0ZGVjb25uZWN0X2J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlMVwiLCBcInZ1ZTJcIik7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIkJhY2sgdG8gaG9tZSBwYWdlXCIpO1xuXHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH0pO1xuXHR9XG5cblx0Z2FtZV9tZW51KClcblx0e1xuXHRcdGNvbnN0IGJ0bl9qb3VlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5fam91ZXInKTtcblx0XHRjb25zdCB2aWV3MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3MScpO1xuXHRcdGNvbnN0IHZpZXcyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXcyJyk7XG5cdFx0Y29uc3QgdmlldzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzMnKTtcblx0XHRjb25zdCB2aWV3NCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3NCcpO1xuXHRcdGNvbnN0IHZpZXcxX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3MV9idG4nKTtcblx0XHRjb25zdCBzZXR0aW5nc19idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3NfYnRuJyk7XG5cdFx0Y29uc3Qgc29sbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb2xvJyk7XG5cdFx0Y29uc3QgbXVsdGlwbGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVsdGlwbGF5ZXInKTtcblx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlldzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXczJyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXc0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3NCcpO1xuXHRcdGNvbnN0IGJ0bl9iYWNrX2hvbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFjay1ob21lJyk7XG5cdFx0Y29uc3QgdmlldzUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzUnKTtcblx0XHRjb25zdCB2aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3NicpO1xuXHRcdGNvbnN0IHZpZXc3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXc3Jyk7XG5cdFx0Y29uc3QgdmlldzggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzgnKTtcblx0XHRjb25zdCBwcmVwYXJfZ2FtZV8xdjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlcGFyX2dhbWVfMXYxJyk7XG5cdFx0Y29uc3QgcHJlcGFyX2dhbmVfYWkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlcGFyX2dhbmVfYWknKTtcblx0XHRjb25zdCBwcmVwYXJfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmVwYXJfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IGJhY2tfdG9fbWVudV92aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlldzYnKTtcblx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlldzcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXc3Jyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXc4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3OCcpO1xuXHRcdGNvbnN0IHBvd2VyVVAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG93ZXJVUCcpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfMScpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfMycpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfNScpO1xuXHRcdGNvbnN0IHBvd2VyX3NlbGVjdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bvd2VyX3NlbGVjdG9yJyk7XG5cdFx0Y29uc3Qgc2tpbl9wZXJzbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdza2luX3BlcnNvJyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV92aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2Jyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV92aWV3NyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc3Jyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV92aWV3OCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4Jyk7XG5cblx0XHQvLyBjb25zdCBiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQnKTtcblxuXHRcdGJ0bl9qb3Vlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdKT1VFUiBidXR0b24gY2xpY2tlZCcpO1xuXHRcdFx0dmlldzEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRidG5fam91ZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHR9KTtcblxuXHRcdHZpZXcxX2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdNb2RlIGRlIGpldXggYnV0dG9uIGNsaWNrZWQnKTtcblx0XHRcdFxuXHRcdFx0aWYgKHZpZXc1LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0dmlldzUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fSBcblx0XHRcdGVsc2UgaWYgKCF2aWV3Mi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHZpZXcyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqU0VUVElOR1MqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblx0XHRzZXR0aW5nc19idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3Mi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqTU9ERV9ERV9KRVVYKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblx0XHRzb2xvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3My5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdG11bHRpcGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3NC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKkJBQ0tfVE9fTUVOVSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGlmICghdmlldzMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ3ZpZXczIGlzIGFjdGl2ZScpO1xuXHRcdFx0YmFja190b19tZW51X3ZpZXczLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHR2aWV3My5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCF2aWV3NC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRjb25zb2xlLmxvZygndmlldzQgaXMgYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX21lbnVfdmlldzQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdHZpZXc0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlMlwiLCBcInRvdXJuYW1lbnRcIik7XG5cdFx0Ly8gXHR0b3VybmFtZW50X3ZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHQvLyBcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0fSAsIDEwMDApO1xuXHRcdC8vIH0pO1xuXG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKipCQUNLX0hPTUUqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblx0XHRidG5fYmFja19ob21lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0aWYgKHZpZXcyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0dmlldzIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fam91ZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmlldzUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHR2aWV3NS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzEuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdGJ0bl9qb3Vlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0cHJlcGFyX2dhbWVfMXYxLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3Ni5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblxuXHRcdHByZXBhcl9nYW5lX2FpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3Ny5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzcuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRwcmVwYXJfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXc0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzguY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKipCQUNLX1RPX01FTlUqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRiYWNrX3RvX21lbnVfdmlldzYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3Ni5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXczLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ni5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGlmIChza2luX3BlcnNvLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKVxuXHRcdFx0e1xuXHRcdFx0XHRza2luX3BlcnNvLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0aWYgKGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0c29sb18xdjFfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChwb3dlcl9zZWxlY3Rvci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKVxuXHRcdFx0e1xuXHRcdFx0XHRwb3dlcl9zZWxlY3Rvci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0cG93ZXJVUC5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX3RlYW1tYXRlKCk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIoKTtcblx0XHRcdFx0cG93ZXJVUF9uYiA9IDA7XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF8xLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblxuXG5cdFx0Y29uc3Qgc2tpbl9wZXJzb19nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NraW5fcGVyc29fZ2FtZV9tdWx0aScpO1xuXG5cdFx0YmFja190b19tZW51X3ZpZXc3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ0JhY2sgdG8gbWVudSB2aWV3NyBjbGlja2VkJyk7XG5cdFx0XHR2aWV3My5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc3LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ny5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGlmIChza2luX3BlcnNvLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKVxuXHRcdFx0e1xuXHRcdFx0XHRza2luX3BlcnNvLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0aWYgKGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0c29sb18xdjFfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdFx0ZGlzYWJsZV9za2luX3BlcnNvX3BsYXllcl9zb2xvKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChwb3dlcl9zZWxlY3Rvci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKVxuXHRcdFx0e1xuXHRcdFx0XHRwb3dlcl9zZWxlY3Rvci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0cG93ZXJVUC5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX3RlYW1tYXRlKCk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIoKTtcblx0XHRcdFx0cG93ZXJVUF9uYiA9IDA7XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF8xLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRiYWNrX3RvX21lbnVfdmlldzguYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3OC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3OC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGlmIChza2luX3BlcnNvX2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHR7XG5cdFx0XHRcdHNraW5fcGVyc29fZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdGlmIChjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNob29zZV95b3VyX3NraW5fZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0XHRtdWx0aXBsYXllcl9idG4uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRcdFx0Y3VzdG9tX3RhX2dhbWVfbXVsdGkuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblx0XHRcdFx0XHRkaXNhYmxlX3NraW5fbXVsdGkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSlcblx0XHRcdHtcblx0XHRcdFx0cG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0cG93ZXJVUF9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZVRlYW1fcGxheWVyKCk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyKCk7XG5cdFx0XHRcdHBvd2VyVVBfbmIgPSAwO1xuXHRcdFx0XHRwb3dlclVQX25iX211bHRpID0gMDtcblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqUE9XRVJfVVBfU09MTyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdFx0cG93ZXJVUC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHBvd2VyVVAuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpO1xuXG5cdFx0XHRpZiAocG93ZXJVUC5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnUG93ZXJVUCBpcyBhY3RpdmUnKTtcblx0XHRcdFx0cG93ZXJfc2VsZWN0b3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1Bvd2VyVVAgaXMgaW5hY3RpdmUnKTtcblx0XHRcdFx0cG93ZXJfc2VsZWN0b3IuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX3RlYW1tYXRlKCk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIoKTtcblx0XHRcdFx0cG93ZXJVUF9uYiA9IDA7XG5cdFx0XHRcdHBvd2VyVVBfbmJfbXVsdGkgPSAwO1xuXHRcdFx0XHRpZiAobnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfMy5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHRudW1iZXJfcG93ZXJVUF8xLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJylcblx0XHRcdG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnMSBwb3dlclVQIHNlbGVjdGVkIGFuZCAzIGFuZCA1IHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2goMSk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfdGVhbW1hdGUoMSk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIoMSk7XG5cdFx0XHRwb3dlclVQX25iID0gMTtcblxuXHRcdH0pO1xuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfMy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzMgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMSBhbmQgNSB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoKDMpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlKDMpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ludmVyc2VfcGxheWVyKDMpO1xuXHRcdFx0cG93ZXJVUF9uYiA9IDM7XG5cdFx0fSk7XG5cblx0XHRudW1iZXJfcG93ZXJVUF81LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJylcblx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMy5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnNSBwb3dlclVQIHNlbGVjdGVkIGFuZCAxIGFuZCAzIHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2goNSk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfdGVhbW1hdGUoNSk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIoNSk7XG5cdFx0XHRwb3dlclVQX25iID0gNTtcblx0XHR9KTtcblxuXG5cblxuXG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKipQT1dFUl9VUF9tdWx0aSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblxuXG5cdFx0Y29uc3QgcG93ZXJVUF9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlclVQX211bHRpJyk7XG5cdFx0Y29uc3QgbnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3QgcG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpJyk7XG5cblx0XHRwb3dlclVQX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0cG93ZXJVUF9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cblx0XHRcdGlmIChwb3dlclVQX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGFjdGl2ZScpO1xuXHRcdFx0XHRwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZVRlYW1fcGxheWVyKCk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyKCk7XG5cdFx0XHRcdHBvd2VyVVBfbmIgPSAwO1xuXHRcdFx0XHRwb3dlclVQX25iX211bHRpID0gMDtcblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKVxuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfM19nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnMSBwb3dlclVQIHNlbGVjdGVkIGFuZCAzIGFuZCA1IHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2hfdGVhbV9wbGF5ZXIoMSk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyKDEpO1xuXHRcdFx0cG93ZXJVUF9uYl9tdWx0aSA9IDE7XG5cdFx0XHRcblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJylcblx0XHRcdG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzMgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMSBhbmQgNSB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoX3RlYW1fcGxheWVyKDMpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ZyZWV6ZV9UZWFtX3BsYXllcigzKTtcblx0XHRcdHBvd2VyVVBfbmJfbXVsdGkgPSAzO1xuXG5cdFx0fSk7XG5cblx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfM19nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdGNvbnNvbGUubG9nKCc1IHBvd2VyVVAgc2VsZWN0ZWQgYW5kIDEgYW5kIDMgdW5zZWxlY3RlZCcpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaF90ZWFtX3BsYXllcig1KTtcblx0XHRcdGluaXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIoNSk7XG5cdFx0XHRwb3dlclVQX25iX211bHRpID0gNTtcblx0XHR9KTtcblxuXHRcdGlmIChnZXRWYWx1ZV9sZWF2ZV9nYW1lKCkgPT0gdHJ1ZSlcblx0XHR7XG5cdFx0XHRwb3dlclVQX25iID0gMDtcblx0XHRcdHBvd2VyVVBfbmJfbXVsdGkgPSAwO1xuXHRcdFx0c2V0TGVhdmVHYW1lVmFyKGZhbHNlKTtcblx0XHR9XG5cblxuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqU0tJTi1TT0xPKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdFx0Y29uc3QgY2hvb3NlX3lvdXJfc2tpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaG9vc2VfeW91cl9za2luJyk7XG5cdFx0Y29uc3QgdmFsaWRlX3Rvbl9za2luID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhbGlkZV90b25fc2tpbicpO1xuXHRcdGNvbnN0IGN1c3RvbV90YV9nYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbV90YV9nYW1lJyk7XG5cdFx0Y29uc3Qgc29sb18xdjFfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvbG9fMXYxX2J0bicpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fbGVmdF9pZDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9sZWZ0X2lkMScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fcmlnaHRfaWQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fcmlnaHRfaWQxJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9sZWZ0X2lkMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX2xlZnRfaWQyJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9yaWdodF9pZDIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9yaWdodF9pZDInKTtcblxuXHRcdHNraW5fcGVyc28uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRza2luX3BlcnNvLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblx0XHRcdFxuXHRcdFx0aWYgKHNraW5fcGVyc28uY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1NraW4gcGVyc28gaXMgYWN0aXZlJyk7XG5cdFx0XHRcdGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdHNvbG9fMXYxX2J0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0XHRjdXN0b21fdGFfZ2FtZS5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG5cdFx0XHRcdGVuYWJsZV9za2luX3BlcnNvX3BsYXllcl9zb2xvKCk7XG5cblx0XHRcdFx0dmFsaWRlX3Rvbl9za2luLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyAvLyBOT1RFIC0gSSByZW1vdmVkIHRoZSBpZiBzdGF0ZW1lbnQgaGVyZVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdWYWxpZGUgdG9uIHNraW4gYnV0dG9uIGNsaWNrZWQnKTtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdHNvbG9fMXYxX2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0XHRjdXN0b21fdGFfZ2FtZS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0XHRcdGRpc2FibGVfc2tpbl9wZXJzb19wbGF5ZXJfc29sb19hbmRfc2F2ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1NraW4gcGVyc28gaXMgaW5hY3RpdmUnKTtcblx0XHRcdFx0aWYgKGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRcdGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0c29sb18xdjFfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdFx0ZGlzYWJsZV9za2luX3BlcnNvX3BsYXllcl9zb2xvKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gbGVmdCBpZDEgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9sZWZ0KCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX3JpZ2h0X2lkMS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiByaWdodCBpZDEgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9yaWdodCgpO1xuXHRcdH0pO1xuXG5cdFx0c3dpdGNoX3Nrbl9sZWZ0X2lkMi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkMiBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX2xlZnQoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1N3aXRjaCBza2luIHJpZ2h0IGlkMiBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX3JpZ2h0KCk7XG5cdFx0fSk7XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKipTS0lOX01VTFRJKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Y29uc3QgY2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nob29zZV95b3VyX3NraW5fZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHZhbGlkZV90b25fc2tpbl9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhbGlkZV90b25fc2tpbl9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9sZWZ0X2lkMV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fbGVmdF9pZDFfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fcmlnaHRfaWQxX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9yaWdodF9pZDFfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fbGVmdF9pZDJfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX2xlZnRfaWQyX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX3JpZ2h0X2lkMl9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fcmlnaHRfaWQyX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX2xlZnRfaWQzX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9sZWZ0X2lkM19nYW1lX211bHRpJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9yaWdodF9pZDNfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX3JpZ2h0X2lkM19nYW1lX211bHRpJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9sZWZ0X2lkNF9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fbGVmdF9pZDRfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fcmlnaHRfaWQ0X2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9yaWdodF9pZDRfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IGN1c3RvbV90YV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbV90YV9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3QgbXVsdGlwbGF5ZXJfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ211bHRpcGxheWVyX2J0bicpO1xuXG5cdFx0c2tpbl9wZXJzb19nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0c2tpbl9wZXJzb19nYW1lX211bHRpLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblx0XHRcdFxuXHRcdFx0aWYgKHNraW5fcGVyc29fZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU2tpbiBwZXJzbyBpcyBhY3RpdmUnKTtcblx0XHRcdFx0Y2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRtdWx0aXBsYXllcl9idG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdFx0Y3VzdG9tX3RhX2dhbWVfbXVsdGkuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuXHRcdFx0XHRlbmFibGVfc2tpbl9tdWx0aSgpO1xuXG5cdFx0XHRcdHZhbGlkZV90b25fc2tpbl9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyAvLyBOT1RFIC0gSSByZW1vdmVkIHRoZSBpZiBzdGF0ZW1lbnQgaGVyZSBmb3IgVHlwZXNjcmlwdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdWYWxpZGUgdG9uIHNraW4gYnV0dG9uIGNsaWNrZWQnKTtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0bXVsdGlwbGF5ZXJfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lX211bHRpLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdFx0ZGlzYWJsZV9za2luX2FuZF9zYXZlX211bHRpKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU2tpbiBwZXJzbyBpcyBpbmFjdGl2ZScpO1xuXHRcdFx0XHRpZiAoY2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0bXVsdGlwbGF5ZXJfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lX211bHRpLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdFx0ZGlzYWJsZV9za2luX211bHRpKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDFfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkMSBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIxX2xlZnRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQxX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gcmlnaHQgaWQxIGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfcmlnaHRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDJfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkMiBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX2xlZnRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQyX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gcmlnaHQgaWQyIGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjJfcmlnaHRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDNfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkMyBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIzX2xlZnRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQzX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gcmlnaHQgaWQzIGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjNfcmlnaHRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDRfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkNCBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXI0X2xlZnRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQ0X2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gcmlnaHQgaWQ0IGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjRfcmlnaHRfbXVsdGkoKTtcblx0XHR9KTtcblxuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqUE9XRVJfVVBfSU5GTyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblx0XHRjb25zdCBwb3dlcl91cF9pbmZvX2lkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bvd2VyX3VwX2luZm9faWQnKTtcblx0XHRjb25zdCBjb250YWluZXJfaW5mb19wb3dlcl91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXJfaW5mb19wb3dlcl91cCcpO1xuXHRcdGNvbnN0IGV4aXRfcG93ZXJVUF9pbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4aXRfcG93ZXJVUF9pbmZvJyk7XG5cblx0XHRwb3dlcl91cF9pbmZvX2lkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29udGFpbmVyX2luZm9fcG93ZXJfdXAuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3Ni5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRleGl0X3Bvd2VyVVBfaW5mby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqUE9XRVJfVVBfSU5GT19NVUxUSSoqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Y29uc3QgcG93ZXJfdXBfaW5mb19pZF9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlcl91cF9pbmZvX2lkX211bHRpJyk7XG5cdFx0Y29uc3QgY29udGFpbmVyX2luZm9fcG93ZXJfdXBfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyX2luZm9fcG93ZXJfdXBfbXVsdGknKTtcblx0XHRjb25zdCBleGl0X3Bvd2VyVVBfaW5mb19tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGl0X3Bvd2VyVVBfaW5mb19tdWx0aScpO1xuXG5cdFx0cG93ZXJfdXBfaW5mb19pZF9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwX211bHRpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzguY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0ZXhpdF9wb3dlclVQX2luZm9fbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb250YWluZXJfaW5mb19wb3dlcl91cF9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc4LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3OC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKlBBUlJBTUVUUkUgSkVVIEVUIFBST0ZJTEUqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Y29uc3QgcGFyYW1ldHJlX2pldSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXJyYW1ldHJlX2pldXhfYnRuJyk7XG5cdFx0Y29uc3QgcGFyYW1ldHJlX3Byb2ZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZmlsZV9wYXJyYW1ldHJlX2J0bicpO1xuXHRcdGNvbnN0IHBhcmFtZXRyZV9qZXVfdmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXJhbWV0cmVzX2pldScpO1xuXHRcdGNvbnN0IHBhcmFtZXRyZV9wcm9maWxlX3ZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFyYW1ldHJlc19wcm9maWxlJyk7XG5cdFx0Y29uc3QgY29udGFpbmVyX21lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG5cblx0XHRwYXJhbWV0cmVfamV1LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1BhcnJhbWV0cmUgamV1IGNsaWNrZWQnKTtcblx0XHRcdHBhcmFtZXRyZV9qZXVfdmlldy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0Y29udGFpbmVyX21lbnUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHBhcmFtZXRyZV9wcm9maWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1BhcnJhbWV0cmUgcHJvZmlsZSBjbGlja2VkJyk7XG5cdFx0XHRwYXJhbWV0cmVfcHJvZmlsZV92aWV3LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzEuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cblx0XHRidG5fYmFja19ob21lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0aWYgKHBhcmFtZXRyZV9qZXVfdmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHBhcmFtZXRyZV9qZXVfdmlldy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdC8vIGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRjb250YWluZXJfbWVudS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHRcdGlmIChwYXJhbWV0cmVfcHJvZmlsZV92aWV3LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0cGFyYW1ldHJlX3Byb2ZpbGVfdmlldy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdC8vIGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqUGFyYW1ldHJlX3Byb2ZpbCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRjb25zdCB2YWxpZF9tZHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmFsaWRfbWRwJyk7XG5cdFx0Y29uc3QgbW9kaWZfcHJvZmlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGlmX3Byb2ZpbCcpO1xuXHRcdC8vIGNvbnN0IG1vZGlmX3Byb2ZpbF9waG90byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9maWxlX3Bob3RvX2NpcmNsZScpO1xuXHRcdGNvbnN0IHByb2ZpbGVfcGFyYW1fdW5sb2NrZWRfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZmlsZV9wYXJhbV91bmxvY2tlZF9pZCcpO1xuXHRcdGNvbnN0IHZhbGlkX3Byb2ZpbGVfaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWxpZF9wcm9maWxlX2luZm8nKTtcblx0XHRjb25zdCBmYV9zZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYV9zZWxlY3RvcicpO1xuXHRcdGNvbnN0IGFjdGl2ZV9mYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY3RpdmVfZmEnKTtcblxuXG5cdFx0Ly8gdmFsaWRfbWRwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0Y29uc29sZS5sb2coJ1ZhbGlkZSBtZHAgY2xpY2tlZCcpO1xuXHRcdC8vIFx0bW9kaWZfcHJvZmlsLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdC8vIFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHQvLyBcdHByb2ZpbGVfcGFyYW1fdW5sb2NrZWRfaWQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Ly8gfSk7XG5cblx0XHQvLyBtb2RpZl9wcm9maWxfcGhvdG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0Ly8gXHRjb25zb2xlLmxvZygnbW9kaWYgcHJvZmlsZSBwaG90byBjbGlja2VkJyk7XG5cdFx0Ly8gXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2ZpbGVfcGhvdG9faW5wdXRcIikuY2xpY2soKTtcblx0XHQvLyBcdGNoYW5nZVByb2ZpbGVQaWN0dXJlKCk7XG5cdFx0Ly8gfSk7XG5cblx0XHQvLyB2YWxpZF9wcm9maWxlX2luZm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0Ly8gXHRjb25zb2xlLmxvZygnVmFsaWRlIHByb2ZpbGUgaW5mbyBjbGlja2VkJyk7XG5cdFx0Ly8gXHRwcm9maWxlX3BhcmFtX3VubG9ja2VkX2lkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0bW9kaWZfcHJvZmlsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdC8vIFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHQvLyB9KTtcblxuXHRcdGFjdGl2ZV9mYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGFjdGl2ZV9mYS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cdFx0XHRpZiAoYWN0aXZlX2ZhLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGQSBpcyBhY3RpdmUnKTtcblx0XHRcdFx0ZmFfc2VsZWN0b3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0ZBIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdGZhX3NlbGVjdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKipwbGF0Zm9ybWVyKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGNvbnN0IHBsYXRmb3JtZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxhdGZvcm1lcl92aWV3Jyk7XG5cblx0XHRwbGF0Zm9ybWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1BsYXRmb3JtZXIgYnV0dG9uIGNsaWNrZWQnKTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInBsYXRmb3JtZXJcIiwgXCJ2dWUyXCIpO1xuXHRcdH0pO1xuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqT3B0aW9uIGRlY29ubmVjdGVkKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRjb25zdCBvcHRpb25fZGVjb25uZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29wdGlvbl9kZWNvbm5lY3QnKTtcblx0XHRjb25zdCBvcHRpb25fYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29wdGlvbl9idG4nKTtcblx0XHRjb25zdCBvcHRpb25fZGVjb25uZWN0ZWRfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29wdGlvbl9kZWNvbm5lY3RlZF9idG4nKTtcblxuXHRcdG9wdGlvbl9idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnT3B0aW9uIGRlY29ubmVjdCBjbGlja2VkJyk7XG5cdFx0XHRvcHRpb25fZGVjb25uZWN0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzEuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRvcHRpb25fZGVjb25uZWN0ZWRfYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ09wdGlvbiBkZWNvbm5lY3QgYmFjayBjbGlja2VkJyk7XG5cdFx0XHRvcHRpb25fZGVjb25uZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0fVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3dlclVQX3ZhbHVlKCkge1xuXHRyZXR1cm4gcG93ZXJVUF9uYjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKSB7XG5cdHJldHVybiBwb3dlclVQX25iX211bHRpO1xufSJdfQ==