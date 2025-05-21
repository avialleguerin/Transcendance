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
		// const accessToken: string | null = localStorage.getItem('accessToken');
		const accessToken: string | null = sessionStorage.getItem('accessToken');
		if (!accessToken || accessToken === undefined) {
			history.pushState({}, '', '/');
			import('./Home.js').then((module: any) => {
				const Home = module.default;
				const homeInstance = new Home();
				homeInstance.getHtml().then((html: string) => {
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

	async getHtml(): Promise<string> {
		return /*html*/`
		<link rel="stylesheet" href="./static/js/css/game_menu.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="navbar_menu">
			<div class="profile_photo_circle_nav_bar" id="profile_photo_circle_nav_bar"></div>
			<h1 class="player_name">ILYAN</h1>
			<button class="option_navBar" id="option_btn_navBar" onclick="togglePanel(event)">
				<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
			</button>
			
		</div>
		<div class="panel_option_navbar" id="panel_option_navbar">
			<button class="option-in-panel" id="option_btn_remove">
				<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
			</button>
			<h1>Friend list</h1>
			<div class="friend_list_container">
				<table class="friend_list_scrollable">
					<tbody id="friendships-table"></tbody>
				</table>

				<form class="add_friend_section" onsubmit="addFriend(event)">
					<input type="text" id="friend_name_input" placeholder="Username..." />
					<button type="submit" id="add_friend_btn">Ajouter</button>
				</form>
			</div>
			<div class="game_history_navBar" id="game_history_navBar">
				<div class="game_history_content_navBar">
					<div class="game_history_header_navBar">
						<div class="profile_photo_circle_Game_History_navBar" id="profile_photo_circle_Game_History_navBar"></div>
						<h1>ILYAN</h1>
					</div>
					<h1>GAME HISTORY</h1>

					<div class="game_history_scrollable_navBar">
						<!-- Game 1 -->
						<div class="game_card_navBar win">
							<div class="profile_navBar">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username_navBar">You</p>
							</div>
							<div class="vs_info_navBar">
								<p class="score_navBar">5 - 2</p>
								<p class="result_navBar">Win</p>
							</div>
							<div class="opponent_navBar">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username_navBar">Enemy1</p>
							</div>
						</div>

						<div class="game_card_navBar lose">
							<div class="profile_navBar">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username_navBar">You</p>
							</div>
							<div class="vs_info_navBar">
								<p class="score_navBar">2 - 5</p>
								<p class="result_navBar">lose</p>
							</div>
							<div class="opponent_navBar">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username_navBar">Enemy1</p>
							</div>
						</div>

					</div>
				</div>
			</div>
			<button class="deconexion_navBar" id="deconnect_btn_navBar" onclick="logout()">Disconnect</button>
		</div>
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
							<button id="Game_History_btn" class="btn">GAME HISTORY</button>
						</div>
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
									<input type="file" name="image" id="profile_photo_input" accept="image/*" />
									
									<button type="button" onclick="document.getElementById('profile_photo_input').click()">
										Choose File
									</button>
									
									<div id="fileName"></div>

										<button type="submit">Upload</button>
									</form>
								</div>
							</div>
							<form id="updateProfileForm" onsubmit="updateProfileInfo(event)">
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
									<p>2FA :<input type="checkbox" id="active_fa" class="active_fa" onchange="this.checked ? update_doubleAuth() : update_doubleAuth()" /></p>
								</div>
								<button type="submit" id="valid_profile_info" class="valid_profile_info_btn">Valider</button>
							</form>
							<div class="btn_deconnect">
								<button id="deconnect_btn" class="btn_deconnect_btn" onclick="logout()">Deconnexion</button>
							</div>
							<div class="btn_delete">
								<button id="delete_btn" class="btn_delete_btn" onclick="delete_account()">Delete account</button>
							</div>

							<h1>GAME STATISTICS</h1>
							<div class="game_statistics">
								<div class="statistics">
									<p>Games Played: <span id="games_played" class="games_played"></span></p>
									<p>Games Won: <span id="games_won" class="games_won"></span></p>
									<p>Games Lost: <span id="games_lost" class="games_lost"></span></p>
									<p>Win Rate: <span id="win_rate" class="win_rate"></span></p>
								</div>
							</div>
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

			<form id="code_validation_id" class="code_validation hidden" onsubmit="activate2FA(event)">
				<img id="qrCode" src="../../../srcs/game/assets/image/timer-reset.svg" style="width:auto" alt="delay">
				<label for="code">code</label>
				<input type="code" id="activate-2fa-code" name="code" placeholder="code" required>
				<button type="submit" class="btn_valider_qr_code">Validate</button>
			</form>

			<div class="game_history" id="game_history">
				<div class="game_history_content">
					<div class="game_history_header">
						<div class="profile_photo_circle_Game_History" id="profile_photo_circle_Game_History"></div>
						<h1>ILYAN</h1>
					</div>
					<h1>GAME HISTORY</h1>

					<div class="game_history_scrollable">
						<!-- Game 1 -->
						<div class="game_card win">
							<div class="profile">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">You</p>
							</div>
							<div class="vs_info">
								<p class="score">5 - 2</p>
								<p class="result">Win</p>
							</div>
							<div class="opponent">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">Enemy1</p>
							</div>
						</div>

						<!-- Game 2 -->
						<div class="game_card lose">
							<div class="profile">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">You</p>
							</div>
							<div class="vs_info">
								<p class="score">3 - 5</p>
								<p class="result">Lose</p>
							</div>
							<div class="opponent">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">Enemy2</p>
							</div>
						</div>
						<!-- Game 2 -->
						<div class="game_card lose">
							<div class="profile">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">You</p>
							</div>
							<div class="vs_info">
								<p class="score">3 - 5</p>
								<p class="result">Lose</p>
							</div>
							<div class="opponent">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">Enemy2</p>
							</div>
						</div>
						<!-- Game 2 -->
						<div class="game_card lose">
							<div class="profile">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">You</p>
							</div>
							<div class="vs_info">
								<p class="score">3 - 5</p>
								<p class="result">Lose</p>
							</div>
							<div class="opponent">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">Enemy2</p>
							</div>
						</div>
						<!-- Game 2 -->
						<div class="game_card lose">
							<div class="profile">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">You</p>
							</div>
							<div class="vs_info">
								<p class="score">3 - 5</p>
								<p class="result">Lose</p>
							</div>
							<div class="opponent">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">Enemy2</p>
							</div>
						</div>
						<!-- Game 2 -->
						<div class="game_card lose">
							<div class="profile">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">You</p>
							</div>
							<div class="vs_info">
								<p class="score">3 - 5</p>
								<p class="result">Lose</p>
							</div>
							<div class="opponent">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">Enemy2</p>
							</div>
						</div>
						<!-- Game 2 -->
						<div class="game_card lose">
							<div class="profile">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">You</p>
							</div>
							<div class="vs_info">
								<p class="score">3 - 5</p>
								<p class="result">Lose</p>
							</div>
							<div class="opponent">
								<img src="../../../srcs/game/assets/image/menu.svg" alt="profile" />
								<p class="username">Enemy2</p>
							</div>
						</div>

						<div class="exit_game_history" id="exit_game_history">
							<button id="exit_game_history_btn" class="exit_game_history_btn">
								X
							</button>
						</div>
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
		<div id="notification-container" class="fixed top-0 left-0 right-0 flex justify-center z-50 mt-4">
			<p id="resultMessage" class="py-2 px-4 rounded shadow-lg transition-all duration-300 transform translate-y-0 opacity-0"></p>
		</div>
	`;}

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

				valide_ton_skin.addEventListener('click', () => { // NOTE - I removed the if statement here
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

				valide_ton_skin_game_multi.addEventListener('click', () => { // NOTE - I removed the if statement here for Typescript
					console.log('Valide ton skin button clicked');
					choose_your_skin_game_multi.classList.remove('active');
					multiplayer_btn.style.display = 'block';
					custom_ta_game_multi.style.visibility = 'visible';
					disable_skin_and_save_multi();
				});
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
			view5.classList.remove('active');
			btn_back_home.classList.remove('active');
			view1.classList.remove('active');
			btn_back_home.classList.add('active');
			container_menu.classList.add('active');
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
				container_menu.classList.remove('active');
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
		const active_fa = document.getElementById('active_fa') as HTMLInputElement;;


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

		const code_validation_id = document.getElementById('code_validation_id');

		active_fa.addEventListener('change', () => {
			if (active_fa.checked) {
				console.log('FA is active');
				code_validation_id.classList.add('active');
				fa_selector.classList.remove('hidden');
			}
			else {
				console.log('FA is inactive');
				// fa_selector.classList.remove('active');
				fa_selector.classList.add('hidden');

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

		// /***********************************************************************/
		// /*************************Option deconnected****************************/
		// /***********************************************************************/

		// const option_deconnect = document.getElementById('option_deconnect');
		// const option_btn = document.getElementById('option_btn');
		// const option_deconnected_btn = document.getElementById('option_deconnected_btn');

		// option_btn.addEventListener('click', () => {
		// 	console.log('Option deconnect clicked');
		// 	option_deconnect.classList.add('active');	
		// 	view5.classList.remove('active');
		// 	btn_back_home.classList.remove('active');
		// 	view1.classList.remove('active');
		// });

		// option_deconnected_btn.addEventListener('click', () => {
		// 	console.log('Option deconnect back clicked');
		// 	option_deconnect.classList.remove('active');
		// 	view5.classList.add('active');
		// 	btn_back_home.classList.add('active');
		// 	view1.classList.add('active');
		// });


		/***********************************************************************/
		/*************************navbar****************************************/
		/***********************************************************************/

		const option_btn_navBar = document.getElementById('option_btn_navBar');
		const panel_option_navbar = document.getElementById('panel_option_navbar');
		const option_btn_remove = document.getElementById('option_btn_remove');
		const deconnect_btn_navBar = document.getElementById('deconnect_btn_navBar');

		option_btn_navBar.addEventListener('click', () => {
			console.log('Option deconnect clicked');
			panel_option_navbar.classList.toggle('active');
		});

		option_btn_remove.addEventListener('click', () => {
			console.log('Option deconnect back clicked');
			panel_option_navbar.classList.remove('active');
		});

		deconnect_btn_navBar.addEventListener('click', () => {
			console.log('Deconnect button clicked');
			handleViewTransitions("vue1", "vue2");
			window.history.back();
		});

		/***********************************************************************/
		/*************************Game History**********************************/
		/***********************************************************************/

		const Game_History_btn = document.getElementById('Game_History_btn');
		const game_history = document.getElementById('game_history');
		const exit_game_history_btn = document.getElementById('exit_game_history_btn');	

		Game_History_btn.addEventListener('click', () => {
			game_history.classList.add('active');
			view1.classList.remove('active');
			btn_back_home.classList.remove('active');
			view5.classList.remove('active');
		});

		exit_game_history_btn.addEventListener('click', () => {
			game_history.classList.remove('active');
			view1.classList.add('active');
			btn_back_home.classList.add('active');
			view5.classList.add('active');
		});


	}
}


export function getPowerUP_value() {
	return powerUP_nb;
}

export function getPowerUP_value_multi() {
	return powerUP_nb_multi;
}