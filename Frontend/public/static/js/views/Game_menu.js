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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZV9tZW51LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiR2FtZV9tZW51LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sWUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDakYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDBFQUEwRSxDQUFDO0FBQy9JLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNFQUFzRSxDQUFDO0FBQ3hJLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHFFQUFxRSxDQUFDO0FBQ2hKLE9BQU8sRUFBRSx3Q0FBd0MsRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLHFGQUFxRixDQUFDO0FBQ2pMLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLDBFQUEwRSxDQUFDO0FBQzdKLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbkUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLDhCQUE4QixFQUFFLHVDQUF1QyxFQUFFLDhCQUE4QixFQUFFLCtCQUErQixFQUFFLDhCQUE4QixFQUFFLCtCQUErQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDcFQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLDJCQUEyQixFQUFFLGtCQUFrQixFQUFFLHFDQUFxQyxFQUFFLG9DQUFvQyxFQUFFLG9DQUFvQyxFQUFFLHFDQUFxQyxFQUFFLG9DQUFvQyxFQUFFLHFDQUFxQyxFQUFFLG9DQUFvQyxFQUFFLHFDQUFxQyxFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFFMWMs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QUFDLENBQUM7WUFDekMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUM3QyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBRUosQ0FBQztDQUNEO0FBR0QsTUFBTSxVQUFVLGdCQUFnQjtJQUMvQixPQUFPLFVBQVUsQ0FBQztBQUNuQixDQUFDO0FBRUQsTUFBTSxVQUFVLHNCQUFzQjtJQUNyQyxPQUFPLGdCQUFnQixDQUFDO0FBQ3pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuaW1wb3J0IHsgc3RhcnRHYW1lLCBzdGFydEFJX0dhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IHN0YXJ0TXVsdGlHYW1lIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9iYWJ5bG9uLmpzXCI7XG5pbXBvcnQgeyBoYW5kbGVWaWV3VHJhbnNpdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3ZpZXdzL2NhbWVyYS5qc1wiO1xuaW1wb3J0IHsgaW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaCwgcmVzZXRfcG93ZXJVUF9ncmVuYWRlIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX0dyZW5hZGVGbGFzaC5qc1wiO1xuaW1wb3J0IHsgaW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlLCByZXNldF9wb3dlclVQX3RlYW1tYXRlIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX3RlYW1tYXRlLmpzXCI7XG5pbXBvcnQgeyBpbml0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIsIHJlc2V0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3NvbG8vMXYxX3BsYXllci9pbml0X3Bvd2VyVVBfaW52ZXJzZS5qc1wiO1xuaW1wb3J0IHsgaW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaF90ZWFtX3BsYXllciwgcmVzZXRfcG93ZXJVUF9ncmVuYWRlVGVhbV9wbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L211bHRpcGxheWVyLzJ2Ml9nYW1lL2luaXRfcG93ZXJVUF9HZXJuYWRlRmxhc2hfbXVsdGkuanNcIjtcbmltcG9ydCB7IGluaXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIsIHJlc2V0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9tdWx0aXBsYXllci8ydjJfZ2FtZS9pbml0X3Bvd2VyX3VwX2ZyZWV6ZS5qc1wiO1xuaW1wb3J0IHsgZ2V0VmFsdWVfbGVhdmVfZ2FtZSwgc2V0TGVhdmVHYW1lVmFyIH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBlbmFibGVfc2tpbl9wZXJzb19wbGF5ZXJfc29sbywgZGlzYWJsZV9za2luX3BlcnNvX3BsYXllcl9zb2xvLCBkaXNhYmxlX3NraW5fcGVyc29fcGxheWVyX3NvbG9fYW5kX3NhdmUsIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfbGVmdCwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9yaWdodCwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyMl9sZWZ0LCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX3JpZ2h0IH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvL3NraW4vaW5pdF9za2luX3BlcnNvLmpzXCI7XG5pbXBvcnQgeyBlbmFibGVfc2tpbl9tdWx0aSwgZGlzYWJsZV9za2luX2FuZF9zYXZlX211bHRpLCBkaXNhYmxlX3NraW5fbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfcmlnaHRfbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfbGVmdF9tdWx0aSwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyMl9sZWZ0X211bHRpLCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX3JpZ2h0X211bHRpLCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIzX2xlZnRfbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjNfcmlnaHRfbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjRfbGVmdF9tdWx0aSwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyNF9yaWdodF9tdWx0aSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvbXVsdGlwbGF5ZXIvaW5pdF9za2luX3BlcnNvX211bHRpLmpzXCI7XG5cbmxldCBwb3dlclVQX25iID0gMDtcbmxldCBwb3dlclVQX25iX211bHRpID0gMDtcblxuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZV9tZW51IGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwiR2FtZV9tZW51XCIpO1xuXHRcdFxuXHRcdC8vIEdldCBhY2Nlc3NUb2tlbiBmcm9tIGxvY2FsU3RvcmFnZSBvciBvdGhlciBzb3VyY2Vcblx0XHRjb25zdCBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgbnVsbCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2Nlc3NUb2tlbicpO1xuXHRcdFxuXHRcdGlmICghYWNjZXNzVG9rZW4gfHwgYWNjZXNzVG9rZW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCAnLycpO1xuXHRcdFx0aW1wb3J0KCcuL0hvbWUuanMnKS50aGVuKChtb2R1bGU6IGFueSkgPT4ge1xuXHRcdFx0XHRjb25zdCBIb21lID0gbW9kdWxlLmRlZmF1bHQ7XG5cdFx0XHRcdGNvbnN0IGhvbWVJbnN0YW5jZSA9IG5ldyBIb21lKCk7XG5cdFx0XHRcdGhvbWVJbnN0YW5jZS5nZXRIdG1sKCkudGhlbigoaHRtbDogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgYXBwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcblx0XHRcdFx0XHRpZiAoYXBwRWxlbWVudCkge1xuXHRcdFx0XHRcdFx0YXBwRWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xuXHRcdFx0XHRcdFx0aWYgKGhvbWVJbnN0YW5jZS5jcmVhdGVBY2NvdW50ICYmIHR5cGVvZiBob21lSW5zdGFuY2UuY3JlYXRlQWNjb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHRob21lSW5zdGFuY2UuY3JlYXRlQWNjb3VudCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBnZXRIdG1sKCk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0cmV0dXJuIC8qaHRtbCovYFxuXHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLi9zdGF0aWMvanMvY3NzL2dhbWVfbWVudS5jc3NcIj5cblx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwidmlldzFcIiBpZD1cInZpZXcxXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzEtY29udGVudFwiPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwidmlldzFfYnRuXCIgY2xhc3M9XCJidG5cIj5HQU1FIE1PREU8L2J1dHRvbj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cInNldHRpbmdzX2J0blwiIGNsYXNzPVwiYnRuXCI+U0VUVElOR1M8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJiYWNrLWhvbWVcIiBpZD1cImJhY2staG9tZVwiPlxuXHRcdFx0PGJ1dHRvbiBpZD1cImJ0bl9iYWNrX2hvbWVcIiBjbGFzcz1cImJ0blwiPkJBQ0s8L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgaWQ9XCJjb250YWluZXJcIiBjbGFzcz1cImNvbnRhaW5lcl9tZW51XCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJidG5fam91ZXJcIj5cblx0XHRcdFx0XHQ8aDE+UExBWTwvaDE+XG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzJcIiBpZD1cInZpZXcyXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXcyLWNvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMT5DSE9PU0UgWU9VUiBHQU1FIE1PREU8L2gxPlxuXHRcdFx0XHRcdFx0PGRpdiBpZD1cImdhbWVfbW9kZV9idG5cIiBjbGFzcz1cImdhbWVfbW9kZV9idG5cIj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInNvbG9cIiBjbGFzcz1cImJ0blwiPlNPTE88L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cIm11bHRpcGxheWVyXCIgY2xhc3M9XCJidG5cIj5NVUxUSVBMQVlFUjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwidG91cm5hbWVudF92aWV3XCIgY2xhc3M9XCJidG5fdG91cm5hbWVudFwiPlxuXHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiL3RvdXJuYW1lbnRcIiBjbGFzcz1cIm5hdi1saW5rXCIgZGF0YS1saW5rPlRPVVJOQU1FTlQ8L2E+XG5cdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwicGxhdGZvcm1lcl92aWV3XCIgY2xhc3M9XCJidG5fcGxhdGZvcm1lclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxhIGhyZWY9XCIvUGxhdGZvcm1WaWV3XCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5QTEFURk9STUVSPC9hPlxuXHRcdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXczXCIgaWQ9XCJ2aWV3M1wiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3My1jb250ZW50XCI+XG5cdFx0XHRcdFx0XHQ8aDE+U09MTyBHQU1FIE1PREU8L2gxPlxuXHRcdFx0XHRcdFx0PGRpdiBpZD1cImdhbWVfbW9kZV9idG5cIiBjbGFzcz1cImdhbWVfbW9kZV9idG5cIj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInByZXBhcl9nYW1lXzF2MVwiIGNsYXNzPVwiYnRuXCI+MXYxPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJwcmVwYXJfZ2FuZV9haVwiIGNsYXNzPVwiYnRuXCI+YWk8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3M1wiIGNsYXNzPVwiYnRuXCI+QkFDSyBUTyBNRU5VPC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzRcIiBpZD1cInZpZXc0XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXc0LWNvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMT5NVUxUSVBMQVlFUiBHQU1FIE1PREU8L2gxPlxuXHRcdFx0XHRcdFx0PGRpdiBpZD1cImdhbWVfbW9kZV9idG5cIiBjbGFzcz1cImdhbWVfbW9kZV9idG5cIj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInByZXBhcl9nYW1lX211bHRpXCIgY2xhc3M9XCJidG5cIj4ydjI8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3NFwiIGNsYXNzPVwiYnRuXCI+QkFDSyBUTyBNRU5VPC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzVcIiBpZD1cInZpZXc1XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXc1LWNvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMT5TRVRUSU5HUzwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlkPVwic2VsZWN0X3BhcmFtZXRyZXNcIiBjbGFzcz1cInNlbGVjdF9wYXJhbWV0cmVzXCI+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJwcm9maWxlX3BhcnJhbWV0cmVfYnRuXCIgY2xhc3M9XCJidG5cIj5QUk9GSUxFPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJwYXJyYW1ldHJlX2pldXhfYnRuXCIgY2xhc3M9XCJidG5cIj5HQU1FPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJvcHRpb25cIiBpZD1cIm9wdGlvbl9idG5cIj5cblx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvbWVudS5zdmdcIiBhbHQ9XCJsZWF2ZVwiPlxuXHRcdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cIm9wdGlvbl9kZWNvbm5lY3RcIiBpZD1cIm9wdGlvbl9kZWNvbm5lY3RcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3B0aW9uX2RlY29ubmVjdF9jb250ZW50XCI+XG5cdFx0XHRcdFx0XHQ8aDE+T1BUSU9OUzwvaDE+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiZGVjb25uZWN0X2J0blwiIGNsYXNzPVwib3B0aW9uX2RlY29ubmVjdF9idG5cIj5MT0cgT1VUPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwib3B0aW9uX2RlY29ubmVjdGVkX2J0blwiIGNsYXNzPVwib3B0aW9uX2RlY29ubmVjdGVkX2J0bl9iYWNrXCI+WDwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFyYW1ldHJlc19qZXVcIiBpZD1cInBhcmFtZXRyZXNfamV1XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBhcmFtZXRyZXNfamV1X2NvbnRlbnRcIiBpZD1cInBhcmFtZXRyZV9qZXV4X2NvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMT5HQU1FIFNFVFRJTkdTPC9oMT5cblx0XHRcdFx0XHRcdDxoMj5QT05HPC9oMj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwYXJhbWV0cmVfbW9kZV9qZXVcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGVfZGVfamV1X3NvbG9fcGFyYW1ldHJlXCI+XG5cdFx0XHRcdFx0XHRcdDxoMz5Tb2xvIEdhbWUgTW9kZTwvaDM+XG5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImpvdWV1cl90b3VjaFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJqb3VldXJcIiBpZD1cImpvdWV1cjFcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPlBsYXllciAxPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRyb2xzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxwPk1vdmVtZW50OiBXIC8gUzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UG93ZXJVUDogWiAvIFggLyBDPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImpvdWV1clwiIGlkPVwiam91ZXVyMlwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+UGxheWVyIDI8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udHJvbHNcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+TW92ZW1lbnQ6IOKshiAvIOKshzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UG93ZXJVUDogMSAvIDIgLyAzPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RlX2RlX2pldV9tdWx0aV9wYXJhbWV0cmVcIj5cblx0XHRcdFx0XHRcdFx0XHQ8aDM+TXVsdGlwbGF5ZXIgR2FtZSBNb2RlPC9oMz5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiam91ZXVyX3RvdWNoXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiam91ZXVyXCIgaWQ9XCJqb3VldXIxXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBsYXllciAxPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udHJvbHNcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Nb3ZlbWVudDogVyAvIFM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UG93ZXJVUDogWiAvIFggLyBDPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImpvdWV1clwiIGlkPVwiam91ZXVyMlwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5QbGF5ZXIgMjwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRyb2xzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+TW92ZW1lbnQ6IEUgLyBEPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVA6IFogLyBYIC8gQzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJqb3VldXJcIiBpZD1cImpvdWV1cjNcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UGxheWVyIDM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250cm9sc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPk1vdmVtZW50OiBPIC8gTDwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Qb3dlclVQOiAxIC8gMiAvIDM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiam91ZXVyXCIgaWQ9XCJqb3VldXI0XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBsYXllciA0PC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udHJvbHNcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Nb3ZlbWVudDog4qyGIC8g4qyHPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVA6IDEgLyAyIC8gMzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdCAgPC9kaXY+XG5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBhcnJhbWV0cmVzX3Byb2ZpbGVcIiBpZD1cInBhcmFtZXRyZXNfcHJvZmlsZVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwYXJhbWV0cmVzX3Byb2ZpbGVfY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPlBST0ZJTEUgU0VUVElOR1M8L2gxPlxuXHRcdFx0XHRcdFx0PGZvcm0gaWQ9XCJtb2RpZl9wcm9maWxcIiBjbGFzcz1cIm1vZGlmX3Byb2ZpbGVcIiBvbnN1Ym1pdD1cImFjY2Vzc1Byb2ZpbGVJbmZvKGV2ZW50KVwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwibWRwXCI+UGFzc3dvcmQ8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG5fdmFsaWRlcl9tZHBcIj5WYWxpZGVyPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZmlsZV9wYXJhbV91bmxvY2tlZFwiIGlkPVwicHJvZmlsZV9wYXJhbV91bmxvY2tlZF9pZFwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGhvdG9fcHJvZmlsZVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9maWxlX3Bob3RvX2NvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInByb2ZpbGVfcGhvdG9fY2lyY2xlXCIgaWQ9XCJwcm9maWxlX3Bob3RvX2NpcmNsZVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PGZvcm0gaWQ9XCJ1cGxvYWRGb3JtXCIgZW5jdHlwZT1cIm11bHRpcGFydC9mb3JtLWRhdGFcIiBvbnN1Ym1pdD1cImNoYW5nZVByb2ZpbGVQaWN0dXJlKGV2ZW50KVwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicHJvZmlsZV9waG90b19pbnB1dFwiIGNsYXNzPVwicGhvdG9fdXBsb2FkX2ljb25cIj48L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImZpbGVcIiBuYW1lPVwiaW1hZ2VcIiBpZD1cInByb2ZpbGVfcGhvdG9faW5wdXRcIiBzdHlsZT1cImNvbG9yOndoaXRlXCIvPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5VcGxvYWQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZm9ybT5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxmb3JtIG9uc3VibWl0PVwidXBkYXRlUHJvZmlsZUluZm8oZXZlbnQpXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0X2NvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInVzZXJuYW1lXCI+Q2hhbmdlIHVzZXJuYW1lPC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiY2hhbmdlX3VzZXJuYW1lXCIgbmFtZT1cInVzZXJuYW1lXCI+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0X2NvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cImVtYWlsXCI+Q2hhbmdlIGVtYWlsPC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiZW1haWxcIiBpZD1cImNoYW5nZV9lbWFpbFwiIG5hbWU9XCJlbWFpbFwiPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dF9jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiPkNoYW5nZSBwYXNzd29yZDwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJjaGFuZ2VfcGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIioqKioqKlwiPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dF9jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJjb25maXJtX3Bhc3N3b3JkXCI+Q29uZmlybSBuZXcgcGFzc3dvcmQ8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwiY29uZmlybV9jaGFuZ2VfcGFzc3dvcmRcIiBuYW1lPVwiY29uZmlybV9wYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiKioqKioqXCI+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBpZD1cImZhX3NlbGVjdG9yXCIgY2xhc3M9XCJmYV9zZWxlY3RvclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxwPjJGQSA6PHNwYW4gaWQ9XCJhY3RpdmVfZmFcIiBjbGFzcz1cImFjdGl2ZV9mYVwiPjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgaWQ9XCJ2YWxpZF9wcm9maWxlX2luZm9cIiBjbGFzcz1cInZhbGlkX3Byb2ZpbGVfaW5mb19idG5cIj5WYWxpZGVyPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDwvZm9ybT5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImJ0bl9kZWNvbm5lY3RcIj5cblx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiZGVjb25uZWN0X2J0blwiIGNsYXNzPVwiYnRuX2RlY29ubmVjdF9idG5cIiBvbmNsaWNrPVwibG9nb3V0KClcIj5EZWNvbm5leGlvbjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImJ0bl9kZWxldGVcIj5cblx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiZGVsZXRlX2J0blwiIGNsYXNzPVwiYnRuX2RlbGV0ZV9idG5cIiBvbmNsaWNrPVwidW5yZWdpc3RlcigpXCI+RGVsZXRlIGFjY291bnQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxwIGlkPVwidXBkYXRlUHJvZmlsZS1yZXN1bHRNZXNzYWdlXCIgY2xhc3M9XCJyZXN1bHRNZXNzYWdlXCIgc3R5bGU9XCJjb2xvcjp3aGl0ZVwiPjwvcD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzZcIiBpZD1cInZpZXc2XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXc2LWNvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMSBpZD1cImN1c3RvbV90YV9nYW1lXCI+Q1VTVE9NSVpFIFlPVVIgR0FNRTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUFwiPlxuXHRcdFx0XHRcdFx0XHQ8cD5Qb3dlclVQOiA8c3BhbiBpZD1cInBvd2VyX3VwX2luZm9faWRcIiBjbGFzcz1cInBvd2VyX3VwX2luZm9cIj48L3NwYW4+PHNwYW4gaWQ9XCJwb3dlclVQXCIgY2xhc3M9XCJhY3RpdmVfcG93ZXJVUFwiPjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0XHRcdDxkaXYgaWQ9XCJwb3dlcl9zZWxlY3RvclwiIGNsYXNzPVwicG93ZXJfc2VsZWN0b3JcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPjE8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzFcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+MzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfM1wiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD41PC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF81XCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJza2luXCI+XG5cdFx0XHRcdFx0XHRcdDxwPkN1c3RvbSBTa2luOiA8c3BhbiBpZD1cInNraW5fcGVyc29cIiBjbGFzcz1cInNraW5fcGVyc29cIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwic29sb18xdjFfYnRuXCIgY2xhc3M9XCJidG5cIj5cblx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIi9zb2xvX2dhbWVfMXYxXCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5TdGFydCBHYW1lPC9hPlxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzdcIiBpZD1cInZpZXc3XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXc3LWNvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMT5DVVNUT01JU0UgVEEgR0FNRSBDT05UUkUgTCdJQTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUFwiPlxuXHRcdFx0XHRcdFx0XHQ8cD5Qb3dlclVQIDo8c3BhbiBpZD1cInBvd2VyVVBcIiBjbGFzcz1cImFjdGl2ZV9wb3dlclVQXCI+PC9zcGFuPjwvcD5cblx0XHRcdFx0XHRcdFx0PGRpdiBpZD1cInBvd2VyX3NlbGVjdG9yXCIgY2xhc3M9XCJwb3dlcl9zZWxlY3RvclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+MTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfMVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD4zPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF8zXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPjU8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzVcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNraW5cIj5cblx0XHRcdFx0XHRcdFx0PHA+U2tpbiBQZXJzb25uYWxpc2UgOjxzcGFuIGlkPVwic2tpbl9wZXJzb1wiIGNsYXNzPVwic2tpbl9wZXJzb1wiPC9zcGFuPjwvcD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInNvbG9fYWlfYnRuXCIgY2xhc3M9XCJidG5cIj5cblx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIi9zb2xvX2dhbWVfYWlcIiBjbGFzcz1cIm5hdi1saW5rXCIgZGF0YS1saW5rPkxhbmNlciBsYSBwYXJ0aWU8L2E+XG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3OFwiIGlkPVwidmlldzhcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzgtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxIGlkPVwiY3VzdG9tX3RhX2dhbWVfbXVsdGlcIj5DVVNUT01JWkUgWU9VUiBNVUxUSVBMQVlFUiBHQU1FPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQXCI+XG5cdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVA6IDxzcGFuIGlkPVwicG93ZXJfdXBfaW5mb19pZF9tdWx0aVwiIGNsYXNzPVwicG93ZXJfdXBfaW5mb1wiPjwvc3Bhbj48c3BhbiBpZD1cInBvd2VyVVBfbXVsdGlcIiBjbGFzcz1cImFjdGl2ZV9wb3dlclVQXCI+PC9zcGFuPjwvcD5cblx0XHRcdFx0XHRcdFx0PGRpdiBpZD1cInBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGlcIiBjbGFzcz1cInBvd2VyX3NlbGVjdG9yXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD4xPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGlcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+MzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfM19nYW1lX211bHRpXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPjU8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2tpblwiPlxuXHRcdFx0XHRcdFx0XHQ8cD5DdXN0b20gU2tpbjogPHNwYW4gaWQ9XCJza2luX3BlcnNvX2dhbWVfbXVsdGlcIiBjbGFzcz1cInNraW5fcGVyc29cIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwibXVsdGlwbGF5ZXJfYnRuXCIgY2xhc3M9XCJidG5cIj5cblx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cIi9tdWx0aV9wbGF5ZXJfZ2FtZVwiIGNsYXNzPVwibmF2LWxpbmtcIiBkYXRhLWxpbms+U3RhcnQgR2FtZTwvYT5cblx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cImJhY2tcIiBpZD1cImJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzZcIj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3NlwiIGNsYXNzPVwiYnRuX2JhY2tcIj5CQUNLPC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJiYWNrXCIgaWQ9XCJiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc3XCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJiYWNrX3RvX21lbnVfdmlldzdcIiBjbGFzcz1cImJ0bl9iYWNrXCI+QkFDSzwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiYmFja1wiIGlkPVwiYmFja190b19zZWxlY3RfbW9kZV92aWV3OFwiPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXc4XCIgY2xhc3M9XCJidG5fYmFja1wiPkJBQ0s8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cImNob29zZV95b3VyX3NraW5cIiBpZD1cImNob29zZV95b3VyX3NraW5cIj5cblx0XHRcdFx0PGgxPkNVU1RPTUlaRSBZT1VSIFNLSU48L2gxPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyMVwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9sZWZ0XCIgaWQ9XCJzd2l0Y2hfc2tuX2xlZnRfaWQxXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX3JpZ2h0XCIgaWQ9XCJzd2l0Y2hfc2tuX3JpZ2h0X2lkMVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxwPlBsYXllciAxPC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcjJcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fbGVmdFwiIGlkPVwic3dpdGNoX3Nrbl9sZWZ0X2lkMlwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9yaWdodFwiIGlkPVwic3dpdGNoX3Nrbl9yaWdodF9pZDJcIj48L2J1dHRvbj5cblx0XHRcdFx0XHQ8cD5QbGF5ZXIgMjwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJ2YWxpZGVfdG9uX3NraW5cIiBjbGFzcz1cImJ0blwiPkNvbmZpcm08L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpXCIgaWQ9XCJjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGlcIj5cblx0XHRcdFx0PGgxPkNVU1RPTUlaRSBZT1VSIFNLSU48L2gxPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyMV9nYW1lX211bHRpXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX2xlZnRcIiBpZD1cInN3aXRjaF9za25fbGVmdF9pZDFfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9yaWdodFwiIGlkPVwic3dpdGNoX3Nrbl9yaWdodF9pZDFfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxwPlBsYXllciAxPC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcjJfZ2FtZV9tdWx0aVwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9sZWZ0XCIgaWQ9XCJzd2l0Y2hfc2tuX2xlZnRfaWQyX2dhbWVfbXVsdGlcIj48L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fcmlnaHRcIiBpZD1cInN3aXRjaF9za25fcmlnaHRfaWQyX2dhbWVfbXVsdGlcIj48L2J1dHRvbj5cblx0XHRcdFx0XHQ8cD5QbGF5ZXIgMjwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXIzX2dhbWVfbXVsdGlcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fbGVmdFwiIGlkPVwic3dpdGNoX3Nrbl9sZWZ0X2lkM19nYW1lX211bHRpXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX3JpZ2h0XCIgaWQ9XCJzd2l0Y2hfc2tuX3JpZ2h0X2lkM19nYW1lX211bHRpXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PHA+UGxheWVyIDM8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyNF9nYW1lX211bHRpXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX2xlZnRcIiBpZD1cInN3aXRjaF9za25fbGVmdF9pZDRfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9yaWdodFwiIGlkPVwic3dpdGNoX3Nrbl9yaWdodF9pZDRfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxwPlBsYXllciA0PC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cInZhbGlkZV90b25fc2tpbl9nYW1lX211bHRpXCIgY2xhc3M9XCJidG5cIj5Db25maXJtPC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgaWQ9XCJjb250YWluZXJfaW5mb19wb3dlcl91cFwiIGNsYXNzPVwiY29udGFpbmVyX2luZm9fcG93ZXJfdXBcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ0ZXh0X3Bvd2VyVVBcIj5cblx0XHRcdFx0PGgxPlBvd2VyLVVQPC9oMT5cblx0XHRcdFx0PHAgY2xhc3M9XCJleHBsaWNhdGlvbl9nZW5lcmFsXCI+VGhlIFBvd2VyLVVwIGlzIGEgYm9udXMgdGhhdCBnaXZlcyB5b3UgYW4gYWR2YW50YWdlIG92ZXIgeW91ciBvcHBvbmVudC4gQnkgZW5hYmxpbmcgdGhpcyBvcHRpb24sIHlvdSB3aWxsIHN0YXJ0IHRoZSBtYXRjaCB3aXRoIGF0IGxlYXN0IG9uZSBQb3dlci1VcCBvZiBlYWNoIHR5cGUuIFlvdSBjYW4gYWxzbyBjdXN0b21pemUgdGhpcyBhbW91bnQgYW5kIHN0YXJ0IHdpdGggdGhyZWUgb3IgZml2ZSBvZiBlYWNoLjwvcD5cblx0XHRcdFx0PHAgY2xhc3M9XCJleHBsaWNhdGlvbl9wb3dlclVQX2dyZW5hZGVcIj5UaGUgRmxhc2ggR3JlbmFkZSBQb3dlci1VcCBhbGxvd3MgeW91IHRvIHRocm93IGEgZ3JlbmFkZSB0aGF0IHdpbGwgYmxpbmQgeW91ciBvcHBvbmVudC4gQnV0IGJlIGNhcmVmdWwhIEl0IHdvcmtzIGluIGEgc2ltcGxlIHdheTogaXQgY29tcGxldGVseSBkYXJrZW5zIHRoZSBnYW1lIHNjcmVlbiwgbWVhbmluZyBldmVuIHRoZSBvbmUgd2hvIHRocm93cyBpdCBnZXRzIGJsaW5kZWQuPC9wPlxuXHRcdFx0XHQ8cCBjbGFzcz1cImV4cGxpY2F0aW9uX3Bvd2VyVVBfdGVhbW1hdGVcIj5UaGUgVGVhbW1hdGUgUG93ZXItVXAgbGV0cyB5b3UgY2FsbCBpbiBhIG5ldyBwbGF5ZXIgdG8gam9pbiB0aGUgZ2FtZSBmb3IgYSBzaG9ydCB0aW1lLiBZb3UgY2FuIG1vdmUgdGhlbSB1c2luZyBFL0QgZm9yIHBsYXllciAxIGFuZCBPL0wgZm9yIHBsYXllciAyLjwvcD5cblx0XHRcdFx0PHAgY2xhc3M9XCJleHBsaWNhdGlvbl9wb3dlclVQX2ludmVyc2VcIj5UaGUgUmV2ZXJzZSBQb3dlci1VcCBsZXRzIHlvdSBpbnZlcnQgeW91ciBvcHBvbmVudOKAmXMgY29udHJvbHMgZm9yIGEgc2hvcnQgZHVyYXRpb24uPC9wPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZGVsYXlfcG93ZXJVUF8xXCI+XG5cdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RpbWVyLXJlc2V0LnN2Z1wiIGFsdD1cImRlbGF5XCI+XG5cdFx0XHRcdFx0PHA+Q09PTERPV04gVElNRTogMTBzPC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImRlbGF5X3Bvd2VyVVBfMlwiPlxuXHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90aW1lci1yZXNldC5zdmdcIiBhbHQ9XCJkZWxheVwiPlxuXHRcdFx0XHRcdDxwPkNPT0xET1dOIFRJTUU6IDE1czwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJkZWxheV9wb3dlclVQXzNcIj5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdGltZXItcmVzZXQuc3ZnXCIgYWx0PVwiZGVsYXlcIj5cblx0XHRcdFx0XHQ8cD5DT09MRE9XTiBUSU1FOiAxMHM8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyX2ltYWdlX3Bvd2VyVVBcIj5cblx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2dyZW5hZGVfbm9fYmcucG5nXCIgYWx0PVwiZ3JlbmFkZVwiIGNsYXNzPVwiZ3JlbmFkZVwiPlxuXHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdGVhbW1hdGVfbm9fYmcucG5nXCIgYWx0PVwidGVhbW1hdGVcIiBjbGFzcz1cInRlYW1tYXRlXCI+XG5cdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9yZXZlcnNlX25vX2JnLnBuZ1wiIGFsdD1cImludmVyc2VfcGxheWVyXCIgY2xhc3M9XCJpbnZlcnNlX3BsYXllclwiPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGlkPVwiZXhpdF9wb3dlclVQX2luZm9cIiBjbGFzcz1cImV4aXRfcG93ZXJVUF9pbmZvXCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJleGl0X3Bvd2VyVVBfaW5mb19idG5cIiBjbGFzcz1cImJ0blwiPlxuXHRcdFx0XHRcdFhcblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj5cblxuXHRcdDxkaXYgaWQ9XCJjb250YWluZXJfaW5mb19wb3dlcl91cF9tdWx0aVwiIGNsYXNzPVwiY29udGFpbmVyX2luZm9fcG93ZXJfdXBcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ0ZXh0X3Bvd2VyVVBcIj5cblx0XHRcdFx0PGgxPlBvd2VyLVVQPC9oMT5cblx0XHRcdFx0PHAgY2xhc3M9XCJleHBsaWNhdGlvbl9nZW5lcmFsXCI+VGhlIFBvd2VyLVVwIGlzIGEgYm9udXMgdGhhdCBnaXZlcyB5b3UgYW4gYWR2YW50YWdlIG92ZXIgeW91ciBvcHBvbmVudC4gQnkgZW5hYmxpbmcgdGhpcyBvcHRpb24sIHlvdSB3aWxsIHN0YXJ0IHRoZSBtYXRjaCB3aXRoIGF0IGxlYXN0IG9uZSBQb3dlci1VcCBvZiBlYWNoIHR5cGUuIFlvdSBjYW4gYWxzbyBjdXN0b21pemUgdGhpcyBhbW91bnQgYW5kIHN0YXJ0IHdpdGggdGhyZWUgb3IgZml2ZSBvZiBlYWNoLjwvcD5cblx0XHRcdFx0PHAgY2xhc3M9XCJleHBsaWNhdGlvbl9wb3dlclVQX2dyZW5hZGVfbXVsdGlcIj5UaGUgRmxhc2ggR3JlbmFkZSBQb3dlci1VcCBsZXRzIHlvdSB0aHJvdyBhIGdyZW5hZGUgdGhhdCBibGluZHMgeW91ciBvcHBvbmVudC4gQnV0IGJlIGNhcmVmdWwhIEl0IHdvcmtzIHNpbXBseTogaXQgY29tcGxldGVseSBkYXJrZW5zIHRoZSBnYW1lIHNjcmVlbiwgbWVhbmluZyBldmVuIHRoZSBvbmUgd2hvIHRocm93cyBpdCBpcyBibGluZGVkLjwvcD5cblx0XHRcdFx0PHAgY2xhc3M9XCJleHBsaWNhdGlvbl9wb3dlclVQX2ZyZWV6ZVwiPlRoZSBGcmVlemUgUG93ZXItVXAgdGVtcG9yYXJpbHkgaW1tb2JpbGl6ZXMgdGhlIG9wcG9zaW5nIHRlYW0uPC9wPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZGVsYXlfcG93ZXJVUF8xX211bHRpXCI+XG5cdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RpbWVyLXJlc2V0LnN2Z1wiIGFsdD1cImRlbGF5XCI+XG5cdFx0XHRcdFx0PHA+Q09PTERPV04gVElNRTogMTBzPC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImRlbGF5X3Bvd2VyVVBfMl9tdWx0aVwiPlxuXHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90aW1lci1yZXNldC5zdmdcIiBhbHQ9XCJkZWxheVwiPlxuXHRcdFx0XHRcdDxwPkNPT0xET1dOIFRJTUU6IDEwczwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJfaW1hZ2VfcG93ZXJVUF9tdWx0aVwiPlxuXHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvZ3JlbmFkZV9ub19iZy5wbmdcIiBhbHQ9XCJncmVuYWRlXCIgY2xhc3M9XCJncmVuYWRlXCI+XG5cdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9mcmVlemVfbm9fYmcucG5nXCIgYWx0PVwiZnJlZXplXCIgY2xhc3M9XCJmcmVlemVcIj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBpZD1cImV4aXRfcG93ZXJVUF9pbmZvX211bHRpXCIgY2xhc3M9XCJleGl0X3Bvd2VyVVBfaW5mb1wiPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwiZXhpdF9wb3dlclVQX2luZm9fYnRuX211bHRpXCIgY2xhc3M9XCJidG5cIj5cblx0XHRcdFx0XHRYXG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdGA7fVxuXG5cdGluaXRfc29sb19nYW1lKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29sb18xdjFfYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIlNvbG8gMXYxIGdhbWUgc3RhcnRlZFwiKTtcblx0XHRcdHN0YXJ0R2FtZSgpO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlM1wiLCBcInZ1ZTJcIik7XG5cdFx0fSk7XG5cdH1cblxuXHRpbml0RXZlbnRzKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXVsdGlwbGF5ZXJfYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIk11bHRpcGxheWVyIDJ2MiBnYW1lIHN0YXJ0ZWRcIik7XG5cdFx0XHRzdGFydE11bHRpR2FtZSgpO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlM1wiLCBcInZ1ZTJcIik7XG5cdFx0fSk7XG5cdH1cblxuXHRpbml0X3NvbG9fZ2FtZV9haSgpIHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvbG9fYWlfYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIlNvbG8gQUkgZ2FtZSBzdGFydGVkXCIpO1xuXHRcdFx0c3RhcnRBSV9HYW1lKCk7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUzXCIsIFwidnVlMlwiKTtcblx0XHR9KTtcblx0fVxuXG5cdHRvdXJuYW1lbnRfdmlldygpIHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvdXJuYW1lbnRfdmlld1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJUb3VybmFtZW50IHZpZXcgc3RhcnRlZFwiKTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInRvdXJuYW1lbnRcIik7XG5cdFx0fSk7XG5cdH1cblxuXHRoYW5kbGVEZWNvbm5lY3Rpb24oKSB7XG5cdFx0Y29uc3QgZGVjb25uZWN0X2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVjb25uZWN0X2J0blwiKTtcblxuXHRcdGRlY29ubmVjdF9idG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTFcIiwgXCJ2dWUyXCIpO1xuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJCYWNrIHRvIGhvbWUgcGFnZVwiKTtcblx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHR9KTtcblx0fVxuXG5cdGdhbWVfbWVudSgpXG5cdHtcblx0XHRjb25zdCBidG5fam91ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuX2pvdWVyJyk7XG5cdFx0Y29uc3QgdmlldzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzEnKTtcblx0XHRjb25zdCB2aWV3MiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3MicpO1xuXHRcdGNvbnN0IHZpZXczID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXczJyk7XG5cdFx0Y29uc3QgdmlldzQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzQnKTtcblx0XHRjb25zdCB2aWV3MV9idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzFfYnRuJyk7XG5cdFx0Y29uc3Qgc2V0dGluZ3NfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldHRpbmdzX2J0bicpO1xuXHRcdGNvbnN0IHNvbG8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc29sbycpO1xuXHRcdGNvbnN0IG11bHRpcGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ211bHRpcGxheWVyJyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXczID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3MycpO1xuXHRcdGNvbnN0IGJhY2tfdG9fbWVudV92aWV3NCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlldzQnKTtcblx0XHRjb25zdCBidG5fYmFja19ob21lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2staG9tZScpO1xuXHRcdGNvbnN0IHZpZXc1ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXc1Jyk7XG5cdFx0Y29uc3QgdmlldzYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzYnKTtcblx0XHRjb25zdCB2aWV3NyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3NycpO1xuXHRcdGNvbnN0IHZpZXc4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXc4Jyk7XG5cdFx0Y29uc3QgcHJlcGFyX2dhbWVfMXYxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXBhcl9nYW1lXzF2MScpO1xuXHRcdGNvbnN0IHByZXBhcl9nYW5lX2FpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXBhcl9nYW5lX2FpJyk7XG5cdFx0Y29uc3QgcHJlcGFyX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlcGFyX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlldzYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXc2Jyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXc3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3NycpO1xuXHRcdGNvbnN0IGJhY2tfdG9fbWVudV92aWV3OCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlldzgnKTtcblx0XHRjb25zdCBwb3dlclVQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bvd2VyVVAnKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzEnKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF8zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzMnKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF81ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzUnKTtcblx0XHRjb25zdCBwb3dlcl9zZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlcl9zZWxlY3RvcicpO1xuXHRcdGNvbnN0IHNraW5fcGVyc28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbl9wZXJzbycpO1xuXHRcdGNvbnN0IGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19zZWxlY3RfbW9kZV92aWV3NicpO1xuXHRcdGNvbnN0IGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19zZWxlY3RfbW9kZV92aWV3NycpO1xuXHRcdGNvbnN0IGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19zZWxlY3RfbW9kZV92aWV3OCcpO1xuXG5cdFx0Ly8gY29uc3QgYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50Jyk7XG5cblx0XHRidG5fam91ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnSk9VRVIgYnV0dG9uIGNsaWNrZWQnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2pvdWVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0fSk7XG5cblx0XHR2aWV3MV9idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnTW9kZSBkZSBqZXV4IGJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0XHRcblx0XHRcdGlmICh2aWV3NS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHZpZXc1LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH0gXG5cdFx0XHRlbHNlIGlmICghdmlldzIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKlNFVFRJTkdTKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdFx0c2V0dGluZ3NfYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3NS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKk1PREVfREVfSkVVWCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdFx0c29sby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXcyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRtdWx0aXBsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXcyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKipCQUNLX1RPX01FTlUqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRpZiAoIXZpZXczLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdGNvbnNvbGUubG9nKCd2aWV3MyBpcyBhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fbWVudV92aWV3My5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0dmlldzMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3MS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICghdmlldzQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ3ZpZXc0IGlzIGFjdGl2ZScpO1xuXHRcdFx0YmFja190b19tZW51X3ZpZXc0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHR2aWV3NC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHQvLyBcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTJcIiwgXCJ0b3VybmFtZW50XCIpO1xuXHRcdC8vIFx0dG91cm5hbWVudF92aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0Ly8gXHRcdHZpZXcyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0XHR2aWV3MS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHQvLyBcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHQvLyBcdH0gLCAxMDAwKTtcblx0XHQvLyB9KTtcblxuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqQkFDS19IT01FKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdFx0YnRuX2JhY2tfaG9tZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGlmICh2aWV3Mi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHZpZXcyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0YnRuX2pvdWVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZpZXc1LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0dmlldzUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fam91ZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdHByZXBhcl9nYW1lXzF2MS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXczLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cblx0XHRwcmVwYXJfZ2FuZV9haS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXczLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzcuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc3LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0cHJlcGFyX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3NC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc4LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3OC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblx0XHRcblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqQkFDS19UT19NRU5VKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0YmFja190b19tZW51X3ZpZXc2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3My5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRpZiAoc2tpbl9wZXJzby5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdHtcblx0XHRcdFx0c2tpbl9wZXJzby5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdGlmIChjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdHNvbG9fMXYxX2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0XHRjdXN0b21fdGFfZ2FtZS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAocG93ZXJfc2VsZWN0b3IuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSlcblx0XHRcdHtcblx0XHRcdFx0cG93ZXJfc2VsZWN0b3IuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyVVAuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2dyZW5hZGUoKTtcblx0XHRcdFx0cmVzZXRfcG93ZXJVUF90ZWFtbWF0ZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2ludmVyc2VfcGxheWVyKCk7XG5cdFx0XHRcdHBvd2VyVVBfbmIgPSAwO1xuXHRcdFx0XHRpZiAobnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfMy5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblxuXHRcdGNvbnN0IHNraW5fcGVyc29fZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdza2luX3BlcnNvX2dhbWVfbXVsdGknKTtcblxuXHRcdGJhY2tfdG9fbWVudV92aWV3Ny5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdCYWNrIHRvIG1lbnUgdmlldzcgY2xpY2tlZCcpO1xuXHRcdFx0dmlldzMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3Ny5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRpZiAoc2tpbl9wZXJzby5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdHtcblx0XHRcdFx0c2tpbl9wZXJzby5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdGlmIChjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdHNvbG9fMXYxX2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0XHRjdXN0b21fdGFfZ2FtZS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0XHRcdGRpc2FibGVfc2tpbl9wZXJzb19wbGF5ZXJfc29sbygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAocG93ZXJfc2VsZWN0b3IuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSlcblx0XHRcdHtcblx0XHRcdFx0cG93ZXJfc2VsZWN0b3IuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyVVAuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2dyZW5hZGUoKTtcblx0XHRcdFx0cmVzZXRfcG93ZXJVUF90ZWFtbWF0ZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2ludmVyc2VfcGxheWVyKCk7XG5cdFx0XHRcdHBvd2VyVVBfbmIgPSAwO1xuXHRcdFx0XHRpZiAobnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfMy5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0YmFja190b19tZW51X3ZpZXc4LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzguY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3NC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzguY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRpZiAoc2tpbl9wZXJzb19nYW1lX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKVxuXHRcdFx0e1xuXHRcdFx0XHRza2luX3BlcnNvX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHRpZiAoY2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0bXVsdGlwbGF5ZXJfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lX211bHRpLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdFx0ZGlzYWJsZV9za2luX211bHRpKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpXG5cdFx0XHR7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyVVBfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2dyZW5hZGVUZWFtX3BsYXllcigpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2ZyZWV6ZV9UZWFtX3BsYXllcigpO1xuXHRcdFx0XHRwb3dlclVQX25iID0gMDtcblx0XHRcdFx0cG93ZXJVUF9uYl9tdWx0aSA9IDA7XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKlBPV0VSX1VQX1NPTE8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuXHRcdHBvd2VyVVAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRwb3dlclVQLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblxuXHRcdFx0aWYgKHBvd2VyVVAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1Bvd2VyVVAgaXMgYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2dyZW5hZGUoKTtcblx0XHRcdFx0cmVzZXRfcG93ZXJVUF90ZWFtbWF0ZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2ludmVyc2VfcGxheWVyKCk7XG5cdFx0XHRcdHBvd2VyVVBfbmIgPSAwO1xuXHRcdFx0XHRwb3dlclVQX25iX211bHRpID0gMDtcblx0XHRcdFx0aWYgKG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8xLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobnVtYmVyX3Bvd2VyVVBfMy5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfMS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzEgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMyBhbmQgNSB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoKDEpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlKDEpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ludmVyc2VfcGxheWVyKDEpO1xuXHRcdFx0cG93ZXJVUF9uYiA9IDE7XG5cblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKVxuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdGNvbnNvbGUubG9nKCczIHBvd2VyVVAgc2VsZWN0ZWQgYW5kIDEgYW5kIDUgdW5zZWxlY3RlZCcpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaCgzKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF90ZWFtbWF0ZSgzKTtcblx0XHRcdGluaXRfcG93ZXJVUF9pbnZlcnNlX3BsYXllcigzKTtcblx0XHRcdHBvd2VyVVBfbmIgPSAzO1xuXHRcdH0pO1xuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfNS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzUgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMSBhbmQgMyB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoKDUpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlKDUpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ludmVyc2VfcGxheWVyKDUpO1xuXHRcdFx0cG93ZXJVUF9uYiA9IDU7XG5cdFx0fSk7XG5cblxuXG5cblxuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqUE9XRVJfVVBfbXVsdGkqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cblxuXHRcdGNvbnN0IHBvd2VyVVBfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG93ZXJVUF9tdWx0aScpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfM19nYW1lX211bHRpJyk7XG5cdFx0Y29uc3QgbnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aScpO1xuXG5cdFx0cG93ZXJVUF9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHBvd2VyVVBfbXVsdGkuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpO1xuXG5cdFx0XHRpZiAocG93ZXJVUF9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnUG93ZXJVUCBpcyBhY3RpdmUnKTtcblx0XHRcdFx0cG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnUG93ZXJVUCBpcyBpbmFjdGl2ZScpO1xuXHRcdFx0XHRwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2dyZW5hZGVUZWFtX3BsYXllcigpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2ZyZWV6ZV9UZWFtX3BsYXllcigpO1xuXHRcdFx0XHRwb3dlclVQX25iID0gMDtcblx0XHRcdFx0cG93ZXJVUF9uYl9tdWx0aSA9IDA7XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblxuXHRcdG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJylcblx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzEgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMyBhbmQgNSB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoX3RlYW1fcGxheWVyKDEpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ZyZWV6ZV9UZWFtX3BsYXllcigxKTtcblx0XHRcdHBvd2VyVVBfbmJfbXVsdGkgPSAxO1xuXHRcdFx0XG5cdFx0fSk7XG5cblx0XHRudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdGNvbnNvbGUubG9nKCczIHBvd2VyVVAgc2VsZWN0ZWQgYW5kIDEgYW5kIDUgdW5zZWxlY3RlZCcpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaF90ZWFtX3BsYXllcigzKTtcblx0XHRcdGluaXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIoMyk7XG5cdFx0XHRwb3dlclVQX25iX211bHRpID0gMztcblxuXHRcdH0pO1xuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKVxuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnNSBwb3dlclVQIHNlbGVjdGVkIGFuZCAxIGFuZCAzIHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2hfdGVhbV9wbGF5ZXIoNSk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyKDUpO1xuXHRcdFx0cG93ZXJVUF9uYl9tdWx0aSA9IDU7XG5cdFx0fSk7XG5cblx0XHRpZiAoZ2V0VmFsdWVfbGVhdmVfZ2FtZSgpID09IHRydWUpXG5cdFx0e1xuXHRcdFx0cG93ZXJVUF9uYiA9IDA7XG5cdFx0XHRwb3dlclVQX25iX211bHRpID0gMDtcblx0XHRcdHNldExlYXZlR2FtZVZhcihmYWxzZSk7XG5cdFx0fVxuXG5cblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKlNLSU4tU09MTyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuXHRcdGNvbnN0IGNob29zZV95b3VyX3NraW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hvb3NlX3lvdXJfc2tpbicpO1xuXHRcdGNvbnN0IHZhbGlkZV90b25fc2tpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWxpZGVfdG9uX3NraW4nKTtcblx0XHRjb25zdCBjdXN0b21fdGFfZ2FtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21fdGFfZ2FtZScpO1xuXHRcdGNvbnN0IHNvbG9fMXYxX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb2xvXzF2MV9idG4nKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX2xlZnRfaWQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fbGVmdF9pZDEnKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX3JpZ2h0X2lkMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX3JpZ2h0X2lkMScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fbGVmdF9pZDIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9sZWZ0X2lkMicpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fcmlnaHRfaWQyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fcmlnaHRfaWQyJyk7XG5cblx0XHRza2luX3BlcnNvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0c2tpbl9wZXJzby5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cdFx0XHRcblx0XHRcdGlmIChza2luX3BlcnNvLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdTa2luIHBlcnNvIGlzIGFjdGl2ZScpO1xuXHRcdFx0XHRjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRzb2xvXzF2MV9idG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdFx0Y3VzdG9tX3RhX2dhbWUuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuXHRcdFx0XHRlbmFibGVfc2tpbl9wZXJzb19wbGF5ZXJfc29sbygpO1xuXG5cdFx0XHRcdHZhbGlkZV90b25fc2tpbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgLy8gTk9URSAtIEkgcmVtb3ZlZCB0aGUgaWYgc3RhdGVtZW50IGhlcmVcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnVmFsaWRlIHRvbiBza2luIGJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0XHRcdFx0Y2hvb3NlX3lvdXJfc2tpbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0XHRzb2xvXzF2MV9idG4uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRcdFx0Y3VzdG9tX3RhX2dhbWUuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblx0XHRcdFx0XHRkaXNhYmxlX3NraW5fcGVyc29fcGxheWVyX3NvbG9fYW5kX3NhdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdTa2luIHBlcnNvIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdGlmIChjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdHNvbG9fMXYxX2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0XHRjdXN0b21fdGFfZ2FtZS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0XHRcdGRpc2FibGVfc2tpbl9wZXJzb19wbGF5ZXJfc29sbygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX2xlZnRfaWQxLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1N3aXRjaCBza2luIGxlZnQgaWQxIGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfbGVmdCgpO1xuXHRcdH0pO1xuXG5cdFx0c3dpdGNoX3Nrbl9yaWdodF9pZDEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gcmlnaHQgaWQxIGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfcmlnaHQoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gbGVmdCBpZDIgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyMl9sZWZ0KCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX3JpZ2h0X2lkMi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiByaWdodCBpZDIgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyMl9yaWdodCgpO1xuXHRcdH0pO1xuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqU0tJTl9NVUxUSSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGNvbnN0IGNob29zZV95b3VyX3NraW5fZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCB2YWxpZGVfdG9uX3NraW5fZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWxpZGVfdG9uX3NraW5fZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fbGVmdF9pZDFfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX2xlZnRfaWQxX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX3JpZ2h0X2lkMV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fcmlnaHRfaWQxX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX2xlZnRfaWQyX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9sZWZ0X2lkMl9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9yaWdodF9pZDJfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX3JpZ2h0X2lkMl9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9sZWZ0X2lkM19nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fbGVmdF9pZDNfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fcmlnaHRfaWQzX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9yaWdodF9pZDNfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fbGVmdF9pZDRfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX2xlZnRfaWQ0X2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX3JpZ2h0X2lkNF9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fcmlnaHRfaWQ0X2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBjdXN0b21fdGFfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21fdGFfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IG11bHRpcGxheWVyX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtdWx0aXBsYXllcl9idG4nKTtcblxuXHRcdHNraW5fcGVyc29fZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHNraW5fcGVyc29fZ2FtZV9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cdFx0XHRcblx0XHRcdGlmIChza2luX3BlcnNvX2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1NraW4gcGVyc28gaXMgYWN0aXZlJyk7XG5cdFx0XHRcdGNob29zZV95b3VyX3NraW5fZ2FtZV9tdWx0aS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0bXVsdGlwbGF5ZXJfYnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRcdGN1c3RvbV90YV9nYW1lX211bHRpLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcblx0XHRcdFx0ZW5hYmxlX3NraW5fbXVsdGkoKTtcblxuXHRcdFx0XHR2YWxpZGVfdG9uX3NraW5fZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgLy8gTk9URSAtIEkgcmVtb3ZlZCB0aGUgaWYgc3RhdGVtZW50IGhlcmUgZm9yIFR5cGVzY3JpcHRcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnVmFsaWRlIHRvbiBza2luIGJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0XHRcdFx0Y2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdG11bHRpcGxheWVyX2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0XHRjdXN0b21fdGFfZ2FtZV9tdWx0aS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0XHRcdGRpc2FibGVfc2tpbl9hbmRfc2F2ZV9tdWx0aSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1NraW4gcGVyc28gaXMgaW5hY3RpdmUnKTtcblx0XHRcdFx0aWYgKGNob29zZV95b3VyX3NraW5fZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdFx0Y2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdG11bHRpcGxheWVyX2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0XHRjdXN0b21fdGFfZ2FtZV9tdWx0aS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0XHRcdGRpc2FibGVfc2tpbl9tdWx0aSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX2xlZnRfaWQxX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gbGVmdCBpZDEgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9sZWZ0X211bHRpKCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX3JpZ2h0X2lkMV9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1N3aXRjaCBza2luIHJpZ2h0IGlkMSBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIxX3JpZ2h0X211bHRpKCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX2xlZnRfaWQyX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gbGVmdCBpZDIgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyMl9sZWZ0X211bHRpKCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX3JpZ2h0X2lkMl9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1N3aXRjaCBza2luIHJpZ2h0IGlkMiBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX3JpZ2h0X211bHRpKCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX2xlZnRfaWQzX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gbGVmdCBpZDMgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyM19sZWZ0X211bHRpKCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX3JpZ2h0X2lkM19nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1N3aXRjaCBza2luIHJpZ2h0IGlkMyBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIzX3JpZ2h0X211bHRpKCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX2xlZnRfaWQ0X2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gbGVmdCBpZDQgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyNF9sZWZ0X211bHRpKCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX3JpZ2h0X2lkNF9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1N3aXRjaCBza2luIHJpZ2h0IGlkNCBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXI0X3JpZ2h0X211bHRpKCk7XG5cdFx0fSk7XG5cblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKlBPV0VSX1VQX0lORk8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdFx0Y29uc3QgcG93ZXJfdXBfaW5mb19pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlcl91cF9pbmZvX2lkJyk7XG5cdFx0Y29uc3QgY29udGFpbmVyX2luZm9fcG93ZXJfdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyX2luZm9fcG93ZXJfdXAnKTtcblx0XHRjb25zdCBleGl0X3Bvd2VyVVBfaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGl0X3Bvd2VyVVBfaW5mbycpO1xuXG5cdFx0cG93ZXJfdXBfaW5mb19pZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0ZXhpdF9wb3dlclVQX2luZm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb250YWluZXJfaW5mb19wb3dlcl91cC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ni5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKlBPV0VSX1VQX0lORk9fTVVMVEkqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGNvbnN0IHBvd2VyX3VwX2luZm9faWRfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG93ZXJfdXBfaW5mb19pZF9tdWx0aScpO1xuXHRcdGNvbnN0IGNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwX211bHRpJyk7XG5cdFx0Y29uc3QgZXhpdF9wb3dlclVQX2luZm9fbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhpdF9wb3dlclVQX2luZm9fbXVsdGknKTtcblxuXHRcdHBvd2VyX3VwX2luZm9faWRfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb250YWluZXJfaW5mb19wb3dlcl91cF9tdWx0aS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc4LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3OC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdGV4aXRfcG93ZXJVUF9pbmZvX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29udGFpbmVyX2luZm9fcG93ZXJfdXBfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3OC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzguY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKipQQVJSQU1FVFJFIEpFVSBFVCBQUk9GSUxFKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGNvbnN0IHBhcmFtZXRyZV9qZXUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFycmFtZXRyZV9qZXV4X2J0bicpO1xuXHRcdGNvbnN0IHBhcmFtZXRyZV9wcm9maWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2ZpbGVfcGFycmFtZXRyZV9idG4nKTtcblx0XHRjb25zdCBwYXJhbWV0cmVfamV1X3ZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFyYW1ldHJlc19qZXUnKTtcblx0XHRjb25zdCBwYXJhbWV0cmVfcHJvZmlsZV92aWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhcmFtZXRyZXNfcHJvZmlsZScpO1xuXHRcdGNvbnN0IGNvbnRhaW5lcl9tZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuXG5cdFx0cGFyYW1ldHJlX2pldS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdQYXJyYW1ldHJlIGpldSBjbGlja2VkJyk7XG5cdFx0XHRwYXJhbWV0cmVfamV1X3ZpZXcuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3NS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGNvbnRhaW5lcl9tZW51LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblx0XHRcblx0XHRwYXJhbWV0cmVfcHJvZmlsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdQYXJyYW1ldHJlIHByb2ZpbGUgY2xpY2tlZCcpO1xuXHRcdFx0cGFyYW1ldHJlX3Byb2ZpbGVfdmlldy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXG5cdFx0YnRuX2JhY2tfaG9tZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGlmIChwYXJhbWV0cmVfamV1X3ZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRwYXJhbWV0cmVfamV1X3ZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXc1LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHQvLyBidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3MS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0Y29udGFpbmVyX21lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAocGFyYW1ldHJlX3Byb2ZpbGVfdmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHBhcmFtZXRyZV9wcm9maWxlX3ZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXc1LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHQvLyBidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3MS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKlBhcmFtZXRyZV9wcm9maWwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Y29uc3QgdmFsaWRfbWRwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhbGlkX21kcCcpO1xuXHRcdGNvbnN0IG1vZGlmX3Byb2ZpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RpZl9wcm9maWwnKTtcblx0XHQvLyBjb25zdCBtb2RpZl9wcm9maWxfcGhvdG8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZmlsZV9waG90b19jaXJjbGUnKTtcblx0XHRjb25zdCBwcm9maWxlX3BhcmFtX3VubG9ja2VkX2lkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2ZpbGVfcGFyYW1fdW5sb2NrZWRfaWQnKTtcblx0XHRjb25zdCB2YWxpZF9wcm9maWxlX2luZm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmFsaWRfcHJvZmlsZV9pbmZvJyk7XG5cdFx0Y29uc3QgZmFfc2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmFfc2VsZWN0b3InKTtcblx0XHRjb25zdCBhY3RpdmVfZmEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZlX2ZhJyk7XG5cblxuXHRcdC8vIHZhbGlkX21kcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHQvLyBcdGNvbnNvbGUubG9nKCdWYWxpZGUgbWRwIGNsaWNrZWQnKTtcblx0XHQvLyBcdG1vZGlmX3Byb2ZpbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHQvLyBcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRwcm9maWxlX3BhcmFtX3VubG9ja2VkX2lkLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIH0pO1xuXG5cdFx0Ly8gbW9kaWZfcHJvZmlsX3Bob3RvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0Y29uc29sZS5sb2coJ21vZGlmIHByb2ZpbGUgcGhvdG8gY2xpY2tlZCcpO1xuXHRcdC8vIFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9maWxlX3Bob3RvX2lucHV0XCIpLmNsaWNrKCk7XG5cdFx0Ly8gXHRjaGFuZ2VQcm9maWxlUGljdHVyZSgpO1xuXHRcdC8vIH0pO1xuXG5cdFx0Ly8gdmFsaWRfcHJvZmlsZV9pbmZvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0Y29uc29sZS5sb2coJ1ZhbGlkZSBwcm9maWxlIGluZm8gY2xpY2tlZCcpO1xuXHRcdC8vIFx0cHJvZmlsZV9wYXJhbV91bmxvY2tlZF9pZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHQvLyBcdG1vZGlmX3Byb2ZpbC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHQvLyBcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Ly8gfSk7XG5cblx0XHRhY3RpdmVfZmEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRhY3RpdmVfZmEuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpO1xuXHRcdFx0aWYgKGFjdGl2ZV9mYS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnRkEgaXMgYWN0aXZlJyk7XG5cdFx0XHRcdGZhX3NlbGVjdG9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGQSBpcyBpbmFjdGl2ZScpO1xuXHRcdFx0XHRmYV9zZWxlY3Rvci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqcGxhdGZvcm1lcioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRjb25zdCBwbGF0Zm9ybWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXRmb3JtZXJfdmlldycpO1xuXG5cdFx0cGxhdGZvcm1lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdQbGF0Zm9ybWVyIGJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJwbGF0Zm9ybWVyXCIsIFwidnVlMlwiKTtcblx0XHR9KTtcblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKk9wdGlvbiBkZWNvbm5lY3RlZCoqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Y29uc3Qgb3B0aW9uX2RlY29ubmVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHRpb25fZGVjb25uZWN0Jyk7XG5cdFx0Y29uc3Qgb3B0aW9uX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHRpb25fYnRuJyk7XG5cdFx0Y29uc3Qgb3B0aW9uX2RlY29ubmVjdGVkX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHRpb25fZGVjb25uZWN0ZWRfYnRuJyk7XG5cblx0XHRvcHRpb25fYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ09wdGlvbiBkZWNvbm5lY3QgY2xpY2tlZCcpO1xuXHRcdFx0b3B0aW9uX2RlY29ubmVjdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0b3B0aW9uX2RlY29ubmVjdGVkX2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdPcHRpb24gZGVjb25uZWN0IGJhY2sgY2xpY2tlZCcpO1xuXHRcdFx0b3B0aW9uX2RlY29ubmVjdC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG93ZXJVUF92YWx1ZSgpIHtcblx0cmV0dXJuIHBvd2VyVVBfbmI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCkge1xuXHRyZXR1cm4gcG93ZXJVUF9uYl9tdWx0aTtcbn0iXX0=