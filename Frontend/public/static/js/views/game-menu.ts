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
import { get_skin_is_init } from "../../../srcs/game/gameplay/solo/skin/init_skin_utils.js";
import { homeView, StorageKeys } from "../../../api/utils.js";
import { accessProfileInfo, changeProfilePicture, delete_account, anonymize_user, export_data, enable_doubleAuth, disable_doubleAuth, activate2FA, updateProfileInfo } from "../../../api/userManagement.js";
import { logout, login_1v1, login_2v2, login_platformer } from "../../../api/auth.js";
import { addFriend, fetch_user_games_big, fetch_user_games, fetch_user_friendships } from "../../../api/friendships.js";

let powerUP_nb = 0;
let powerUP_nb_multi = 0;

export default class Game_menu extends AbstractView {
	constructor() {
		super();
		this.setTitle("Game Menu");
		const accessToken: string | null = sessionStorage.getItem('accessToken');
		if (!accessToken || accessToken === undefined)
			homeView();
	}

	async getHtml(): Promise<string> {
		return /*html*/`
		<style>
			/* Glassmorphism grid styles */
			.grid-container {
				position: fixed;
				top: 0;
				left: 0;
				width: 100vw;
				height: 40vh;
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				grid-template-rows: repeat(3, 1fr);
				gap: 20px;
				padding: 120px 100px;
			}

			.grid-button {
				background: rgba(255, 234, 0, 0.05);
				background-size: cover;
				background-position: center;
				background-blend-mode: overlay;
				backdrop-filter: blur(16px);
				-webkit-backdrop-filter: blur(16px);
				-moz-backdrop-filter: blur(16px);
				border: 0.2px solid rgba(255, 255, 1, 0.5);
				border-radius: 7px;
				box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
				color: #FFFFCA;
				font-size: 28px;
				font-weight: 600;
				cursor: pointer;
				transition: all 0.1s ease;
				display: flex;
				align-items: center;
				justify-content: begin;
				position: relative;
				overflow: hidden;
				height: 150px;
				padding: 30px;
				font-weight: 900;
				font-style: italic;
			}

			.grid-button::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				padding: 5px 10px;
				background: linear-gradient(45deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), transparent);
				-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
				-webkit-mask-composite: subtract;
				mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
				mask-composite: subtract;
				pointer-events: none;
			}

			.grid-button:hover {
				border: 1px solid #ffff03;
				box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
				background: linear-gradient(45deg, rgba(255, 234, 0, 1), rgba(153, 140, 0, 0.3));
				transform: translateY(-10px) translateX(5px);
			}

			.grid-button:active {
				transform: translateY(0);
				box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.5);
			}

			#stats-container {
				position: fixed;
				top: 30vh;
				left: 50%;
				transform: translateX(-50%);
				width: 650px;
				height: 500px;
				font-size: 28px;
				background: rgba(0, 0, 0, 0.45);
				backdrop-filter: blur(16px);
				-webkit-backdrop-filter: blur(16px);
				-moz-backdrop-filter: blur(16px);
				border: 1px solid rgba(255, 255, 255, 0.2);
				border-radius: 7px;
				box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
				text-align: center;
				color: white;
				padding: 20px;
			}

			#friends-container {
				position: fixed;
				top: 80vh;
				left: 50%;
				transform: translateX(-50%);
				width: 650px;
				height: 60px;
				font-size: 28px;
				background: rgba(0, 0, 0, 0.45);
				backdrop-filter: blur(16px);
				-webkit-backdrop-filter: blur(16px);
				-moz-backdrop-filter: blur(16px);
				border: 1px solid rgba(255, 255, 255, 0.2);
				border-radius: 7px;
				box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
				color: white;
				text-align: center;
				padding: 5px;
			}

			#logout-container {
				position: fixed;
				bottom: 35px;
				left: 50%;
				transform: translateX(-50%);
				width: fit-content;
				color: #ff0;
				border: none;
				border-radius: 5px;
				padding: 10px 20px;
				font-size: 24px;
				text-align: center;
				cursor: pointer;
				transition: background-color 0.1s ease;
			}

		</style>

		<div class="navbar_menu">
		
			<div class="profile_photo_circle_nav_bar" id="profile_photo_circle_nav_bar"><img src="${StorageKeys.PROFILE_PICTURE}" alt="profile picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></div>
			<h1 id="player_name" class="player_name">${StorageKeys.PLAYER1}</h1>
			<button class="option_navBar" id="option_btn_navBar">
				<img src="../../../srcs/game/assets/image/menu.svg" alt="menu">
			</button>
		</div>

		<div id="cgu-modal" class="cgu-modal">
			<div class="cgu-content">
				<h1>Terms of Service</h1>
				<div class="cgu-text">
					<h2>1. Introduction</h2>
					<p>Welcome to Transcendence. By using our application, you accept these terms of service.</p>
					<p>Data Controller: Transcendence Project Team - École 42<br>
					Contact: ozasahin@student.42lyon.fr<br>
					Data Protection Officer (DPO): Mr. SAHIN O.</p>
					
					<h2>2. Service Description</h2>
					<p>Transcendence is an online gaming platform that allows users to play Pong and other games, communicate and interact with other users.</p>
					
					<h2>3. Registration and Account</h2>
					<p>To use our service, you must create an account with accurate and up-to-date information. We only collect data necessary for providing our services.</p>
					
					<h2>4. User Behavior</h2>
					<p>Users commit to respecting other members and not posting offensive or illegal content.</p>
					
					<h2>5. Intellectual Property</h2>
					<p>All intellectual property rights related to Transcendence belong to their respective owners.</p>
					
					<h2>6. Data Protection</h2>
					<p>We are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR).</p>
					<h3>6.1 Data Collected</h3>
					<p>We collect the following categories of data:
					<ul>
						<li>Identification data (internal ID, username, avatar)</li>
						<li>Authentication data (via Google Sign-In)</li>
						<li>Profile data (status, preferences)</li>
						<li>Usage data (game history, scores, rankings)</li>
					</ul>
					</p>
					<h3>6.2 Processing Purposes</h3>
					<p>Your data is processed for the following purposes:
					<ul>
						<li>Providing the Transcendence online gaming service</li>
						<li>User account administration</li>
						<li>Social features (friends)</li>
						<li>Recording game statistics and rankings</li>
					</ul>
					</p>
					<h3>6.3 Retention Period</h3>
					<p>Your data is retained for the duration of the project and up to 1 month after the final evaluation.</p>
					<h3>6.4 Data Recipients</h3>
					<p>Your data may be accessible to:
					<ul>
						<li>Project team members</li>
						<li>Teaching staff and evaluators from École 42</li>
						<li>Other users (only for public profile data)</li>
					</ul>
					</p>
					<h3>6.5 Your Rights</h3>
					<p>In accordance with GDPR, you have the following rights:
					<ul>
						<li>Right of access to your data</li>
						<li>Right of rectification</li>
						<li>Right to erasure ("right to be forgotten")</li>
						<li>Right to restriction of processing</li>
						<li>Right to data portability</li>
						<li>Right to object</li>
					</ul>
					To exercise these rights, contact us at: ozasahin@student.42lyon.fr
					</p>
					<h3>6.6 Security Measures</h3>
					<p>We implement the following technical and organizational measures:
					<ul>
						<li>Encryption of passwords and sensitive data</li>
						<li>Secure authentication (Google Sign-In)</li>
						<li>Two-factor authentication (2FA)</li>
						<li>Secure sessions with expiration (JWT)</li>
						<li>Protection against common web vulnerabilities</li>
					</ul>
					</p>
					
					<h2>7. Terms Modification</h2>
					<p>We reserve the right to modify these terms at any time. Users will be notified of important changes.</p>
					
					<h2>8. Duration and Termination</h2>
					<p>Access to our service may be suspended or terminated in case of non-compliance with these terms.</p>
					
					<h2>9. Data Transfers</h2>
					<p>No personal data transfers are made outside the European Union. All data is hosted on servers located in the EU.</p>
				</div>
				<button id="cgu-back-button" class="cgu-back-button">Back</button>
			</div>
		</div>

		<div id="privacy-policy-modal" class="cgu-modal">
			<div class="cgu-content">
				<h1>Privacy Policy</h1>
				<div class="cgu-text">
					<h2>1. Introduction</h2>
					<p>Welcome to our Privacy Policy. It describes how we collect, use and protect your personal data.</p>
					<p>Data Controller: Transcendence Project Team - École 42<br>
					Contact: ozasahin@student.42lyon.fr<br>
					Data Protection Officer (DPO): Mr. SAHIN O.</p>
					
					<h2>2. Data Collected</h2>
					<p>We collect data about you when you use our service, including:</p>
					<ul>
						<li>Identification data (internal ID, username, avatar)</li>
						<li>Authentication data (via Google Sign-In)</li>
						<li>Profile data (status, preferences)</li>
						<li>Usage data (game history, scores, rankings)</li>
					</ul>
					
					<h2>3. Data Usage</h2>
					<p>We use your data to:</p>
					<ul>
						<li>Provide and improve our service</li>
						<li>Administer your account</li>
						<li>Offer you social features (friends)</li>
						<li>Record your game statistics and rankings</li>
					</ul>
					
					<h2>4. Data Sharing</h2>
					<p>We do not sell your personal data. We may share your data with:</p>
					<ul>
						<li>Project team members</li>
						<li>Teaching staff and evaluators from École 42</li>
						<li>Other users (only for public profile data)</li>
					</ul>
					
					<h2>5. Data Security</h2>
					<p>We implement security measures to protect your data against unauthorized access, disclosure, alteration or destruction.</p>
					
					<h2>6. Your Rights</h2>
					<p>In accordance with GDPR, you have the following rights regarding your personal data:</p>
					<ul>
						<li>Right of access</li>
						<li>Right of rectification</li>
						<li>Right to erasure</li>
						<li>Right to restriction of processing</li>
						<li>Right to data portability</li>
						<li>Right to object</li>
					</ul>
					<p>To exercise these rights, contact us at: ozasahin@student.42lyon.fr</p>
					
					<h2>7. Privacy Policy Changes</h2>
					<p>We reserve the right to modify this policy at any time. Users will be notified of important changes.</p>
					
					<h2>8. Contact</h2>
					<p>For any questions regarding this Privacy Policy, please contact us at: ozasahin@student.42lyon.fr</p>
				</div>
				<button id="privacy-policy-back-button" class="cgu-back-button">Back</button>
			</div>
		</div>

		

		<div class="grid-container">
			<button class="grid-button" id="grid-btn-1">
				ONE VS ONE
			</button>
			<button class="grid-button" id="grid-btn-2">
				TWO VS TWO
			</button>
			<button class="grid-button" id="grid-btn-3">
				TOURNAMENT
			</button>
		</div>
		<div class="container" id="stats-container">
			<div class="stats">
				<h1>Statistics</h1>
				<p id="games-played">Games Played: 0</p>
				<p id="games-won">Games Won: 0</p>
				<p id="games-lost">Games Lost: 0</p>
				<p id="win-rate">Win Rate: 0%</p>
			</div>
		</div>
		<div class="container" id="friends-container">
				<h1>Friends</h1>
		</div>
		<div class="container" id="logout-container">
			<button id="logout-button">Logout</button>
		</div>
	`;}


	handleDeconnection() {
		const deconnect_btn = document.getElementById("deconnect_btn");

		deconnect_btn?.addEventListener("click", () => {
			handleViewTransitions("vue1", "vue2");
			window.history.back();
		});
	}

	// game_menu()
	// {		// DOM element declarations with null safety
	// 	const btn_jouer = document.getElementById('btn_jouer');
	// 	const view1 = document.getElementById('view1');
	// 	const view2 = document.getElementById('view2');
	// 	const view3 = document.getElementById('view3');
	// 	const view4 = document.getElementById('view4');
	// 	const view1_btn = document.getElementById('view1_btn');
	// 	const settings_btn = document.getElementById('settings_btn');
	// 	const solo = document.getElementById('solo');
	// 	const multiplayer = document.getElementById('multiplayer');
	// 	const back_to_menu_view3 = document.getElementById('back_to_menu_view3');
	// 	const back_to_menu_view4 = document.getElementById('back_to_menu_view4');
	// 	const btn_back_home = document.getElementById('back-home');
	// 	const view5 = document.getElementById('view5');
	// 	const view6 = document.getElementById('view6');
	// 	const view7 = document.getElementById('view7');
	// 	const view8 = document.getElementById('view8');
	// 	const prepar_game_1v1 = document.getElementById('prepar_game_1v1');
	// 	const prepar_game_multi = document.getElementById('prepar_game_multi');
	// 	const back_to_menu_view6 = document.getElementById('back_to_menu_view6');
	// 	const back_to_menu_view7 = document.getElementById('back_to_menu_view7');
	// 	const back_to_menu_view8 = document.getElementById('back_to_menu_view8');
	// 	const powerUP = document.getElementById('powerUP');
	// 	const number_powerUP_1 = document.getElementById('number_powerUP_1');
	// 	const number_powerUP_3 = document.getElementById('number_powerUP_3');
	// 	const number_powerUP_5 = document.getElementById('number_powerUP_5');
	// 	const power_selector = document.getElementById('power_selector');
	// 	const skin_perso = document.getElementById('skin_perso');
	// 	const back_to_select_mode_view6 = document.getElementById('back_to_select_mode_view6');
	// 	const back_to_select_mode_view7 = document.getElementById('back_to_select_mode_view7');
	// 	const back_to_select_mode_view8 = document.getElementById('back_to_select_mode_view8');
	// 	const choose_your_opponent_platformer_form = document.getElementById('choose_your_opponent_platformer_form');
	// 	const choose_your_skin = document.getElementById('choose_your_skin');
	// 	const custom_ta_game = document.getElementById('custom_ta_game');
	// 	const solo_1v1_btn = document.getElementById('solo_1v1_btn');
	// 	const container_menu = document.getElementById('container');
	// 	const choose_your_opponent_multi_form = document.getElementById('choose_your_opponent_multi_form');
	// 	const skin_perso_game_multi = document.getElementById('skin_perso_game_multi');
	// 	const choose_your_skin_game_multi = document.getElementById('choose_your_skin_game_multi');
	// 	const multiplayer_btn = document.getElementById('multiplayer_btn');
	// 	const custom_ta_game_multi = document.getElementById('custom_ta_game_multi');
	// 	const power_selector_game_multi = document.getElementById('power_selector_game_multi');
	// 	const powerUP_multi = document.getElementById('powerUP_multi');
	// 	const number_powerUP_1_game_multi = document.getElementById('number_powerUP_1_game_multi');
	// 	const number_powerUP_3_game_multi = document.getElementById('number_powerUP_3_game_multi');
	// 	const number_powerUP_5_game_multi = document.getElementById('number_powerUP_5_game_multi');
	// 	const valide_ton_skin_game_multi = document.getElementById('valide_ton_skin_game_multi');
	// 	const switch_skn_left_id1_game_multi = document.getElementById('switch_skn_left_id1_game_multi');
	// 	const switch_skn_right_id1_game_multi = document.getElementById('switch_skn_right_id1_game_multi');
	// 	const switch_skn_left_id2_game_multi = document.getElementById('switch_skn_left_id2_game_multi');
	// 	const switch_skn_right_id2_game_multi = document.getElementById('switch_skn_right_id2_game_multi');
	// 	const switch_skn_left_id3_game_multi = document.getElementById('switch_skn_left_id3_game_multi');
	// 	const switch_skn_right_id3_game_multi = document.getElementById('switch_skn_right_id3_game_multi');
	// 	const switch_skn_left_id4_game_multi = document.getElementById('switch_skn_left_id4_game_multi');
	// 	const switch_skn_right_id4_game_multi = document.getElementById('switch_skn_right_id4_game_multi');
	// 	const power_up_info_id = document.getElementById('power_up_info_id');
	// 	const container_info_power_up = document.getElementById('container_info_power_up');
	// 	const exit_powerUP_info = document.getElementById('exit_powerUP_info');
	// 	const power_up_info_id_multi = document.getElementById('power_up_info_id_multi');
	// 	const container_info_power_up_multi = document.getElementById('container_info_power_up_multi');
	// 	const exit_powerUP_info_multi = document.getElementById('exit_powerUP_info_multi');
	// 	const option_btn_navBar = document.getElementById('option_btn_navBar');
	// 	const panel_option_navbar = document.getElementById('panel_option_navbar');
	// 	const option_btn_remove = document.getElementById('option_btn_remove');
	// 	const Game_History_btn = document.getElementById('Game_History_btn');
	// 	const game_history = document.getElementById('game_history');
	// 	const exit_game_history_btn = document.getElementById('exit_game_history_btn');
	// 	const code_validation_id = document.getElementById('code_validation_id');
	// 	const fa_selector = document.getElementById('fa_selector');
	// 	const cancel_fa = document.getElementById('cancel_fa');

	// 	const showCguLink = document.getElementById("show-cgu");
	// 	const cguModal = document.getElementById("cgu-modal");
	// 	const cguBackButton = document.getElementById("cgu-back-button");

	// 	// Apply null safety to initial styling
	// 	if (view1_btn) {
	// 		view1_btn.style.color = '#e6e600';
	// 		view1_btn.style.textShadow = '0 0 10px #e6e600';
	// 		view1_btn.style.cursor = 'default';
	// 	}
		
	// 	showCguLink?.addEventListener("click", (e) => {
	// 		e.preventDefault();
	// 		cguModal?.classList.add("active");
	// 		document.body.style.overflow = "hidden";
	// 	});

	// 	cguBackButton?.addEventListener("click", () => {
	// 		cguModal?.classList.remove("active");
	// 		document.body.style.overflow = "";
	// 	});

	// 	cguModal?.addEventListener("click", (event) => {
	// 		if (event.target === cguModal) {
	// 			cguModal?.classList.remove("active");
	// 			document.body.style.overflow = "";
	// 		}
	// 	});

	// 	const showPrivacyPolicyLink = document.getElementById("show-privacy-policy");
	// 	const privacyPolicyModal = document.getElementById("privacy-policy-modal");
	// 	const privacyPolicyBackButton = document.getElementById("privacy-policy-back-button");

	// 	showPrivacyPolicyLink?.addEventListener("click", (e) => {
	// 		e.preventDefault();
	// 		privacyPolicyModal?.classList.add("active");
	// 		document.body.style.overflow = "hidden";
	// 	});

	// 	privacyPolicyBackButton?.addEventListener("click", () => {
	// 		privacyPolicyModal?.classList.remove("active");
	// 		document.body.style.overflow = "";
	// 	});

	// 	privacyPolicyModal?.addEventListener("click", (event) => {
	// 		if (event.target === privacyPolicyModal) {
	// 			privacyPolicyModal?.classList.remove("active");
	// 			document.body.style.overflow = "";
	// 		}
	// 	});

	// 	btn_jouer?.addEventListener('click', () => {
	// 		view1?.classList.add('active');
	// 		view2?.classList.add('active');
	// 		btn_back_home?.classList.add('active');
	// 		if (btn_jouer) btn_jouer.style.display = 'none';
	// 	});

	// 	view1_btn?.addEventListener('click', () => {
	// 		if (view5?.classList.contains('active')) {
	// 			view5?.classList.remove('active');
	// 			view2?.classList.add('active');
	// 			if (view1_btn) {
	// 				view1_btn.style.color = '#e6e600';
	// 				view1_btn.style.textShadow = '0 0 10px #e6e600';
	// 				view1_btn.style.cursor = 'default';
	// 			}
	// 			if (settings_btn) {
	// 				settings_btn.style.color = 'white';
	// 				settings_btn.style.textShadow = 'none';
	// 				settings_btn.style.cursor = 'pointer';
	// 			}
	// 		}
	// 		else if (view2 && !view2.classList.contains('active'))
	// 			view2?.classList.add('active');
	// 	});

	// 	let skin = get_skin_is_init();
	// 	const skin_id = document.getElementById('skin');
	// 	const skin_id_multi = document.getElementById('skin_multi');


	// 	if (skin == false) {
	// 		skin_id?.classList.add('hidden');
	// 		skin_id_multi?.classList.add('hidden');
	// 	}
	// 	else {
	// 		skin_id?.classList.remove('hidden');
	// 		skin_id_multi?.classList.remove('hidden');
	// 	}


	// 	/***********************************************************************/
	// 	/**************************SETTINGS************************************/
	// 	/***********************************************************************/


	// 	settings_btn?.addEventListener('click', () => {
	// 		view2?.classList.remove('active');
	// 		view5?.classList.add('active');
	// 		if (view1_btn) {
	// 			view1_btn.style.color = 'white';
	// 			view1_btn.style.textShadow = 'none';
	// 			view1_btn.style.cursor = 'pointer';
	// 		}
	// 		if (settings_btn) {
	// 			settings_btn.style.color = 'yellow';
	// 			settings_btn.style.textShadow = '0 0 10px yellow';
	// 			settings_btn.style.cursor = 'default';
	// 		}
	// 	});


	// 	/***********************************************************************/
	// 	/**************************MODE_DE_JEUX********************************/
	// 	/***********************************************************************/


	// 	solo?.addEventListener('click', () => {
	// 		view2?.classList.remove('active');
	// 		view3?.classList.add('active');
	// 		view1?.classList.remove('active');
	// 		btn_back_home?.classList.remove('active');
	// 	});

	// 	multiplayer?.addEventListener('click', () => {
	// 		view2?.classList.remove('active');
	// 		view4?.classList.add('active');
	// 		view1?.classList.remove('active');
	// 		btn_back_home?.classList.remove('active');
	// 	});


	// 	/***********************************************************************/
	// 	/**************************BACK_TO_MENU********************************/
	// 	/***********************************************************************/

	// 	if (view3 && !view3.classList.contains('active')) {
	// 		back_to_menu_view3?.addEventListener('click', () => {
	// 			view3?.classList.remove('active');
	// 			view2?.classList.add('active');
	// 			view1?.classList.add('active');
	// 			btn_back_home?.classList.add('active');
	// 		});
	// 	}

	// 	if (view4 && !view4.classList.contains('active')) {
	// 		back_to_menu_view4?.addEventListener('click', () => {
	// 			view4?.classList.remove('active');
	// 			view2?.classList.add('active');
	// 			view1?.classList.add('active');
	// 			btn_back_home?.classList.add('active');
	// 		});
	// 	}

	// 	/***********************************************************************/
	// 	/**************************BACK_HOME************************************/
	// 	/***********************************************************************/


	// 	btn_back_home?.addEventListener('click', () => {
	// 		if (view2?.classList.contains('active')) {
	// 			view2?.classList.remove('active');
	// 			view1?.classList.remove('active');
	// 			btn_back_home?.classList.remove('active');
	// 			if (btn_jouer) btn_jouer.style.display = 'block';
	// 			if (view1_btn) {
	// 				view1_btn.style.cursor = 'default';
	// 				view1_btn.style.color = 'yellow';
	// 				view1_btn.style.textShadow = '0 0 10px yellow';
	// 			}
	// 			if (settings_btn) {
	// 				settings_btn.style.color = 'white';
	// 				settings_btn.style.textShadow = 'none';
	// 				settings_btn.style.cursor = 'pointer';
	// 			}
	// 		}
	// 		if (view5?.classList.contains('active')) {
	// 			view5?.classList.remove('active');
	// 			view1?.classList.remove('active');
	// 			btn_back_home?.classList.remove('active');
	// 			if (btn_jouer) btn_jouer.style.display = 'block';
	// 			if (view1_btn) {
	// 				view1_btn.style.cursor = 'default';
	// 				view1_btn.style.color = 'yellow';
	// 				view1_btn.style.textShadow = '0 0 10px yellow';
	// 			}
	// 			if (settings_btn) {
	// 				settings_btn.style.color = 'white';
	// 				settings_btn.style.textShadow = 'none';
	// 				settings_btn.style.cursor = 'pointer';
	// 			}
	// 		}

	// 	});		
	// 	const choose_your_opponent_1v1_form = document.getElementById('choose_your_opponent_1v1_form');

	// 	prepar_game_1v1?.addEventListener('click', () => {
	// 		view3?.classList.remove('active');
	// 		choose_your_opponent_1v1_form?.classList.add('active');
	// 		back_to_select_mode_view6?.classList.add('active');
	// 	});
		
	// 	const validate_multi_opponent = document.getElementById('validate_multi_opponent');

	// 	prepar_game_multi?.addEventListener('click', () => {
	// 		view4?.classList.remove('active');
	// 		choose_your_opponent_multi_form?.classList.add('active');
	// 		back_to_select_mode_view8?.classList.add('active');
	// 		container_menu?.classList.add('active');
	// 		if (container_menu) container_menu.scrollTop = 0;
	// 	});

	// 	/***********************************************************************/
	// 	/**************************BACK_TO_MENU********************************/
	// 	/***********************************************************************/

	// 	back_to_menu_view6?.addEventListener('click', () => {
	// 		view6?.classList.remove('active');
	// 		view3?.classList.add('active');
	// 		back_to_select_mode_view6?.classList.remove('active');


	// 		if (choose_your_opponent_1v1_form?.classList.contains('active')) {
	// 			choose_your_opponent_1v1_form?.classList.remove('active');
	// 			back_to_select_mode_view6?.classList.remove('active');
	// 			view3?.classList.add('active');
	// 			container_menu?.classList.remove('active');
	// 			if (container_menu) container_menu.scrollTop = 0;
	// 		}
		

	// 		if (skin_perso?.classList.contains('checked')) {
	// 			skin_perso?.classList.remove('checked');
	// 			if (choose_your_skin?.classList.contains('active')) {
	// 				choose_your_skin?.classList.remove('active');
	// 				if (solo_1v1_btn) solo_1v1_btn.style.display = 'block';
	// 				if (custom_ta_game) custom_ta_game.style.visibility = 'visible';
	// 			}
	// 		}
	// 		if (power_selector?.classList.contains('active')) {
	// 			power_selector?.classList.remove('active');
	// 			powerUP?.classList.remove('checked');
	// 			reset_powerUP_grenade();
	// 			reset_powerUP_teammate();
	// 			reset_powerUP_inverse_player();
	// 			powerUP_nb = 0;
	// 			if (number_powerUP_1?.classList.contains('checked')) {
	// 				number_powerUP_1?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_3?.classList.contains('checked')) {
	// 				number_powerUP_3?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_5?.classList.contains('checked')) {
	// 				number_powerUP_5?.classList.remove('checked');
	// 			}
	// 		}
	// 	});

	// 	back_to_menu_view7?.addEventListener('click', () => {
	// 		view3?.classList.add('active');
	// 		view7?.classList.remove('active');
	// 		back_to_select_mode_view7?.classList.remove('active');
	// 		if (skin_perso?.classList.contains('checked')) {
	// 			skin_perso?.classList.remove('checked');
	// 			if (choose_your_skin?.classList.contains('active')) {
	// 				choose_your_skin?.classList.remove('active');
	// 				if (solo_1v1_btn) solo_1v1_btn.style.display = 'block';
	// 				if (custom_ta_game) custom_ta_game.style.visibility = 'visible';
	// 				disable_skin_perso_player_solo();
	// 			}
	// 		}
	// 		if (power_selector?.classList.contains('active')) {
	// 			power_selector?.classList.remove('active');
	// 			powerUP?.classList.remove('checked');
	// 			reset_powerUP_grenade();
	// 			reset_powerUP_teammate();
	// 			reset_powerUP_inverse_player();
	// 			powerUP_nb = 0;
	// 			if (number_powerUP_1?.classList.contains('checked')) {
	// 				number_powerUP_1?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_3?.classList.contains('checked')) {
	// 				number_powerUP_3?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_5?.classList.contains('checked')) {
	// 				number_powerUP_5?.classList.remove('checked');
	// 			}
	// 		}
	// 	});

	// 	back_to_menu_view8?.addEventListener('click', () => {
	// 		view8?.classList.remove('active');
	// 		view4?.classList.add('active');
	// 		back_to_select_mode_view8?.classList.remove('active');
	// 		if (choose_your_opponent_multi_form?.classList.contains('active')) {
	// 			choose_your_opponent_multi_form?.classList.remove('active');
	// 			back_to_select_mode_view8?.classList.remove('active');
	// 			view4?.classList.add('active');
	// 			container_menu?.classList.remove('active');
	// 			if (container_menu) container_menu.scrollTop = 0;
	// 		}
	// 		if (skin_perso_game_multi?.classList.contains('checked')) {
	// 			skin_perso_game_multi?.classList.remove('checked');
	// 			if (choose_your_skin_game_multi?.classList.contains('active')) {
	// 				choose_your_skin_game_multi?.classList.remove('active');
	// 				if (multiplayer_btn) multiplayer_btn.style.display = 'block';
	// 				if (custom_ta_game_multi) custom_ta_game_multi.style.visibility = 'visible';
	// 				disable_skin_multi();
	// 			}
	// 		}
	// 		if (power_selector_game_multi?.classList.contains('active')) {
	// 			power_selector_game_multi?.classList.remove('active');
	// 			powerUP_multi?.classList.remove('checked');
	// 			reset_powerUP_grenadeTeam_player();
	// 			reset_powerUP_freeze_Team_player();
	// 			powerUP_nb = 0;
	// 			powerUP_nb_multi = 0;
	// 			if (number_powerUP_1_game_multi?.classList.contains('checked')) {
	// 				number_powerUP_1_game_multi?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_3_game_multi?.classList.contains('checked')) {
	// 				number_powerUP_3_game_multi?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_5_game_multi?.classList.contains('checked')) {
	// 				number_powerUP_5_game_multi?.classList.remove('checked');
	// 			}
	// 		}
	// 	});

	// 	/***********************************************************************/
	// 	/**************************POWER_UP_SOLO********************************/
	// 	/***********************************************************************/

	// 	powerUP?.addEventListener('click', () => {
	// 		powerUP?.classList.toggle('checked');

	// 		if (powerUP?.classList.contains('checked'))
	// 			power_selector?.classList.add('active');
	// 		else {
	// 			power_selector?.classList.remove('active');
	// 			reset_powerUP_grenade();
	// 			reset_powerUP_teammate();
	// 			reset_powerUP_inverse_player();
	// 			powerUP_nb = 0;
	// 			powerUP_nb_multi = 0;
	// 			if (number_powerUP_1?.classList.contains('checked')) {
	// 				number_powerUP_1?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_3?.classList.contains('checked')) {
	// 				number_powerUP_3?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_5?.classList.contains('checked')) {
	// 				number_powerUP_5?.classList.remove('checked');
	// 			}
	// 		}
	// 	});

	// 	number_powerUP_1?.addEventListener('click', () => {
	// 		number_powerUP_1?.classList.toggle('checked');
	// 		number_powerUP_3?.classList.remove('checked');
	// 		number_powerUP_5?.classList.remove('checked');
	// 		init_nb_powerUP_grenadeFlash(1);
	// 		init_nb_powerUP_teammate(1);
	// 		init_powerUP_inverse_player(1);
	// 		powerUP_nb = 1;
	// 	});

	// 	number_powerUP_3?.addEventListener('click', () => {
	// 		number_powerUP_3?.classList.toggle('checked');
	// 		number_powerUP_1?.classList.remove('checked');
	// 		number_powerUP_5?.classList.remove('checked');
	// 		init_nb_powerUP_grenadeFlash(3);
	// 		init_nb_powerUP_teammate(3);
	// 		init_powerUP_inverse_player(3);
	// 		powerUP_nb = 3;
	// 	});

	// 	number_powerUP_5?.addEventListener('click', () => {
	// 		number_powerUP_5?.classList.toggle('checked');
	// 		number_powerUP_1?.classList.remove('checked');
	// 		number_powerUP_3?.classList.remove('checked');
	// 		init_nb_powerUP_grenadeFlash(5);
	// 		init_nb_powerUP_teammate(5);
	// 		init_powerUP_inverse_player(5);
	// 		powerUP_nb = 5;
	// 	});

	// 	/***********************************************************************/
	// 	/**************************POWER_UP_multi*******************************/
	// 	/***********************************************************************/

	// 	powerUP_multi?.addEventListener('click', () => {
	// 		powerUP_multi?.classList.toggle('checked');

	// 		if (powerUP_multi?.classList.contains('checked'))
	// 			power_selector_game_multi?.classList.add('active');
	// 		else {
	// 			power_selector_game_multi?.classList.remove('active');
	// 			reset_powerUP_grenadeTeam_player();
	// 			reset_powerUP_freeze_Team_player();
	// 			powerUP_nb = 0;
	// 			powerUP_nb_multi = 0;
	// 			if (number_powerUP_1_game_multi?.classList.contains('checked')) {
	// 				number_powerUP_1_game_multi?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_3_game_multi?.classList.contains('checked')) {
	// 				number_powerUP_3_game_multi?.classList.remove('checked');
	// 			}
	// 			if (number_powerUP_5_game_multi?.classList.contains('checked')) {
	// 				number_powerUP_5_game_multi?.classList.remove('checked');
	// 			}
	// 		}
	// 	});

	// 	number_powerUP_1_game_multi?.addEventListener('click', () => {
	// 		number_powerUP_1_game_multi?.classList.toggle('checked');
	// 		number_powerUP_3_game_multi?.classList.remove('checked');
	// 		number_powerUP_5_game_multi?.classList.remove('checked');
	// 		init_nb_powerUP_grenadeFlash_team_player(1);
	// 		init_powerUP_freeze_Team_player(1);
	// 		powerUP_nb_multi = 1;
	// 	});

	// 	number_powerUP_3_game_multi?.addEventListener('click', () => {
	// 		number_powerUP_3_game_multi?.classList.toggle('checked');
	// 		number_powerUP_1_game_multi?.classList.remove('checked');
	// 		number_powerUP_5_game_multi?.classList.remove('checked');
	// 		init_nb_powerUP_grenadeFlash_team_player(3);
	// 		init_powerUP_freeze_Team_player(3);
	// 		powerUP_nb_multi = 3;
	// 	});
	// 	number_powerUP_5_game_multi?.addEventListener('click', () => {
	// 		number_powerUP_5_game_multi?.classList.toggle('checked');
	// 		number_powerUP_1_game_multi?.classList.remove('checked');
	// 		number_powerUP_3_game_multi?.classList.remove('checked');
	// 		init_nb_powerUP_grenadeFlash_team_player(5);
	// 		init_powerUP_freeze_Team_player(5);
	// 		powerUP_nb_multi = 5;
	// 	});
	// 	if (getValue_leave_game() == true) {
	// 		powerUP_nb = 0;
	// 		powerUP_nb_multi = 0;
	// 		setLeaveGameVar(false);
	// 	}
	// 	/***********************************************************************/
	// 	/**************************SKIN-SOLO************************************/
	// 	/***********************************************************************/
	// 	const valide_ton_skin = document.getElementById('valide_ton_skin');
	// 	const switch_skn_left_id1 = document.getElementById('switch_skn_left_id1');
	// 	const switch_skn_right_id1 = document.getElementById('switch_skn_right_id1');
	// 	const switch_skn_left_id2 = document.getElementById('switch_skn_left_id2');
	// 	const switch_skn_right_id2 = document.getElementById('switch_skn_right_id2');

	// 	skin_perso?.addEventListener('click', () => {
	// 		skin_perso?.classList.toggle('checked');
			
	// 		if (skin_perso?.classList.contains('checked')) {
	// 			choose_your_skin?.classList.add('active');
	// 			if (solo_1v1_btn) solo_1v1_btn.style.display = 'none';
	// 			if (custom_ta_game) custom_ta_game.style.visibility = 'hidden';
	// 			enable_skin_perso_player_solo();

	// 			valide_ton_skin?.addEventListener('click', () => {
	// 				choose_your_skin?.classList.remove('active');
	// 				if (solo_1v1_btn) solo_1v1_btn.style.display = 'block';
	// 				if (custom_ta_game) custom_ta_game.style.visibility = 'visible';
	// 				disable_skin_perso_player_solo_and_save();
	// 			});
	// 		}
	// 		else {
	// 			if (choose_your_skin?.classList.contains('active')) {
	// 				choose_your_skin?.classList.remove('active');
	// 				if (solo_1v1_btn) solo_1v1_btn.style.display = 'block';
	// 				if (custom_ta_game) custom_ta_game.style.visibility = 'visible';
	// 				disable_skin_perso_player_solo();
	// 			}
	// 		}
	// 	});

	// 	switch_skn_left_id1?.addEventListener('click', () => {
	// 		switch_skin_perso_player1_left();
	// 	});

	// 	switch_skn_right_id1?.addEventListener('click', () => {
	// 		switch_skin_perso_player1_right();
	// 	});

	// 	switch_skn_left_id2?.addEventListener('click', () => {
	// 		switch_skin_perso_player2_left();
	// 	});

	// 	switch_skn_right_id2?.addEventListener('click', () => {
	// 		switch_skin_perso_player2_right();
	// 	});


	// 	/***********************************************************************/
	// 	/**************************SKIN_MULTI***********************************/
	// 	/***********************************************************************/

	// 	skin_perso_game_multi?.addEventListener('click', () => {
	// 		skin_perso_game_multi?.classList.toggle('checked');
			
	// 		if (skin_perso_game_multi?.classList.contains('checked')) {
	// 			choose_your_skin_game_multi?.classList.add('active');
	// 			if (multiplayer_btn) multiplayer_btn.style.display = 'none';
	// 			if (custom_ta_game_multi) custom_ta_game_multi.style.visibility = 'hidden';
	// 			enable_skin_multi();

	// 			valide_ton_skin_game_multi?.addEventListener('click', () => {
	// 				choose_your_skin_game_multi?.classList.remove('active');
	// 				if (multiplayer_btn) multiplayer_btn.style.display = 'block';
	// 				if (custom_ta_game_multi) custom_ta_game_multi.style.visibility = 'visible';
	// 				disable_skin_and_save_multi();
	// 			});
	// 		}
	// 		else
	// 		{
	// 			if (choose_your_skin_game_multi?.classList.contains('active')) {
	// 				choose_your_skin_game_multi?.classList.remove('active');
	// 				if (multiplayer_btn) multiplayer_btn.style.display = 'block';
	// 				if (custom_ta_game_multi) custom_ta_game_multi.style.visibility = 'visible';
	// 				disable_skin_multi();
	// 			}
	// 		}
	// 	});

	// 	switch_skn_left_id1_game_multi?.addEventListener('click', () => {
	// 		switch_skin_perso_player1_left_multi();
	// 	});

	// 	switch_skn_right_id1_game_multi?.addEventListener('click', () => {
	// 		switch_skin_perso_player1_right_multi();
	// 	});

	// 	switch_skn_left_id2_game_multi?.addEventListener('click', () => {
	// 		switch_skin_perso_player2_left_multi();
	// 	});

	// 	switch_skn_right_id2_game_multi?.addEventListener('click', () => {
	// 		switch_skin_perso_player2_right_multi();
	// 	});

	// 	switch_skn_left_id3_game_multi?.addEventListener('click', () => {
	// 		switch_skin_perso_player3_left_multi();
	// 	});

	// 	switch_skn_right_id3_game_multi?.addEventListener('click', () => {
	// 		switch_skin_perso_player3_right_multi();
	// 	});

	// 	switch_skn_left_id4_game_multi?.addEventListener('click', () => {
	// 		switch_skin_perso_player4_left_multi();
	// 	});

	// 	switch_skn_right_id4_game_multi?.addEventListener('click', () => {
	// 		switch_skin_perso_player4_right_multi();
	// 	});


	// 	/***********************************************************************/
	// 	/**************************POWER_UP_INFO*******************************/
	// 	/***********************************************************************/

	// 	power_up_info_id?.addEventListener('click', () => {
	// 		container_info_power_up?.classList.add('active');
	// 		view6?.classList.remove('active');
	// 		back_to_select_mode_view6?.classList.remove('active');
	// 	});

	// 	exit_powerUP_info?.addEventListener('click', () => {
	// 		container_info_power_up?.classList.remove('active');
	// 		view6?.classList.add('active');
	// 		back_to_select_mode_view6?.classList.add('active');
	// 	});


	// 	/***********************************************************************/
	// 	/**************************POWER_UP_INFO_MULTI*************************/
	// 	/***********************************************************************/

	// 	power_up_info_id_multi?.addEventListener('click', () => {
	// 		container_info_power_up_multi?.classList.add('active');
	// 		view8?.classList.remove('active');
	// 		back_to_select_mode_view8?.classList.remove('active');
	// 	});

	// 	exit_powerUP_info_multi?.addEventListener('click', () => {
	// 		container_info_power_up_multi?.classList.remove('active');
	// 		view8?.classList.add('active');
	// 		back_to_select_mode_view8?.classList.add('active');
	// 	});

	// 	/***********************************************************************/
	// 	/*************************PARRAMETRE JEU ET PROFILE*********************/
	// 	/***********************************************************************/

	// 	const parametre_jeu = document.getElementById('parrametre_jeux_btn');
	// 	const parametre_profile = document.getElementById('profile_parrametre_btn');
	// 	const parametre_jeu_view = document.getElementById('parametres_jeu');
	// 	const parametre_profile_view = document.getElementById('parametres_profile');

	// 	parametre_jeu?.addEventListener('click', () => {
	// 		parametre_jeu_view?.classList.add('active');
	// 		view5?.classList.remove('active');
	// 		btn_back_home?.classList.remove('active');
	// 		view1?.classList.remove('active');
	// 		container_menu?.classList.add('active');
	// 		btn_back_home?.classList.add('active');
	// 		if (container_menu) container_menu.scrollTop = 0;

	// 	});
		
	// 	parametre_profile?.addEventListener('click', () => {
	// 		parametre_profile_view?.classList.add('active');
	// 		view5?.classList.remove('active');
	// 		btn_back_home?.classList.remove('active');
	// 		view1?.classList.remove('active');
	// 		btn_back_home?.classList.add('active');
	// 		container_menu?.classList.add('active');
	// 		if (container_menu) container_menu.scrollTop = 0;

	// 	});


	// 	btn_back_home?.addEventListener('click', () => {
	// 		if (parametre_jeu_view?.classList.contains('active')) {
	// 			parametre_jeu_view?.classList.remove('active');
	// 			view5?.classList.add('active');
	// 			view1?.classList.add('active');
	// 			container_menu?.classList.remove('active');
	// 			if (container_menu) container_menu.scrollTop = 0;

	// 		}
	// 		if (parametre_profile_view?.classList.contains('active')) {
	// 			parametre_profile_view?.classList.remove('active');
	// 			view5?.classList.add('active');
	// 			view1?.classList.add('active');
	// 			container_menu?.classList.remove('active');
	// 			if (container_menu) container_menu.scrollTop = 0;

	// 		}
	// 	});

	// 	/***********************************************************************/
	// 	/*************************Parametre_profil******************************/
	// 	/***********************************************************************/

	// 	const valid_mdp = document.getElementById('valid_mdp');
	// 	const modif_profil = document.getElementById('modif_profil');
	// 	const profile_param_unlocked_id = document.getElementById('profile_param_unlocked_id');
	// 	const valid_profile_info = document.getElementById('valid_profile_info');
	// 	const active_fa = document.getElementById('active_fa') as HTMLInputElement;

	// 	active_fa?.addEventListener('change', () => {
	// 		if (active_fa?.checked) {
	// 			enable_doubleAuth();
	// 			code_validation_id?.classList.add('active');
	// 			fa_selector?.classList.remove('hidden');
	// 		}
	// 		else {
	// 			disable_doubleAuth();
	// 			fa_selector?.classList.add('hidden');
	// 		}
	// 	});
		

	// 	cancel_fa?.addEventListener('click', () => {
	// 		code_validation_id?.classList.remove('active');
	// 		fa_selector?.classList.add('hidden');
	// 		if (active_fa) active_fa.checked = false;
	// 	});


	// 	/***********************************************************************/
	// 	/*************************platformer************************************/
	// 	/***********************************************************************/

	// 	const platformer = document.getElementById('platformer_view');
	// 	const back_to_select_mode_platformer = document.getElementById('back_to_select_mode_platformer');

	// 	platformer?.addEventListener('click', () => {
	// 		btn_back_home?.classList.remove('active');
	// 		view2?.classList.remove('active');
	// 		view1?.classList.remove('active');
	// 		choose_your_opponent_platformer_form?.classList.add('active');
	// 		back_to_select_mode_platformer?.classList.add('active');
	// 	});

	// 	back_to_select_mode_platformer?.addEventListener('click', () => {
	// 		choose_your_opponent_platformer_form?.classList.remove('active');
	// 		back_to_select_mode_platformer?.classList.remove('active');
	// 		view2?.classList.add('active');
	// 		view1?.classList.add('active');
	// 		btn_back_home?.classList.add('active');
	// 	});

	// 	/***********************************************************************/
	// 	/*************************navbar****************************************/
	// 	/***********************************************************************/

	// 	option_btn_navBar?.addEventListener('click', (event: Event) => {
	// 		panel_option_navbar?.classList.remove('remove'); // retire l'animation de fermeture
	// 		if (panel_option_navbar) void panel_option_navbar.offsetWidth; // force le reflow pour relancer l'animation si besoin
	// 		panel_option_navbar?.classList.add('active');
	// 		if (option_btn_navBar) option_btn_navBar.style.display = 'none';
	// 		fetch_user_friendships();
	// 		fetch_user_games();
	// 	});

	// 	option_btn_remove?.addEventListener('click', () => {
	// 		panel_option_navbar?.classList.add('remove');
	// 		setTimeout(() => {
	// 			if (option_btn_navBar) option_btn_navBar.style.display = 'block';
	// 		}, 800);
	// 	});


	// 	/***********************************************************************/
	// 	/*************************Game History**********************************/
	// 	/***********************************************************************/

	// 	Game_History_btn?.addEventListener('click', () => {
	// 		game_history?.classList.add('active');
	// 		view1?.classList.remove('active');
	// 		btn_back_home?.classList.remove('active');
	// 		view5?.classList.remove('active');
	// 		StorageKeys.HISTORY_IS_VISIBLE = true;
	// 		fetch_user_games_big();
	// 	});

	// 	exit_game_history_btn?.addEventListener('click', () => {
	// 		game_history?.classList.remove('active');
	// 		view1?.classList.add('active');
	// 		btn_back_home?.classList.add('active');
	// 		view5?.classList.add('active');
	// 		StorageKeys.HISTORY_IS_VISIBLE = false;

	// 	});

	// 	document.getElementById("solo_1v1_btn")?.addEventListener("click", () => {
	// 		startGame();
	// 		handleViewTransitions("vue3", "vue2");
	// 	});

	// 	document.getElementById("multiplayer_btn")?.addEventListener("click", () => {
	// 		startMultiGame();
	// 		handleViewTransitions("vue3", "vue2");
	// 	});

	// 	document.getElementById("tournament_view")?.addEventListener("click", () => {
	// 		handleViewTransitions("tournament", "vue2");
	// 	});

	// 	const acceptedSection = document.getElementById('section-accepted');
	// 	const pendingSection = document.getElementById('section-pending');

	// 	const btnAccepted = document.getElementById('tab-accepted');
	// 	const btnPending = document.getElementById('tab-pending');

	// 	btnAccepted?.addEventListener('click', () => {
	// 		if (acceptedSection) acceptedSection.style.display = 'block';
	// 		if (pendingSection) pendingSection.style.display = 'none';
	// 		btnAccepted?.classList.add('active');
	// 		btnPending?.classList.remove('active');
	// 	});

	// 	btnPending?.addEventListener('click', () => {
	// 		if (acceptedSection) acceptedSection.style.display = 'none';
	// 		if (pendingSection) pendingSection.style.display = 'block';
	// 		btnAccepted?.classList.remove('active');
	// 		btnPending?.classList.add('active');
	// 	});

	// 	document.getElementById("start-platformer")?.addEventListener('click', () => {
	// 		handleViewTransitions("platformer", "vue2");
	// 	});


	// 	/***********************************************************************/
	// 	/*************************UserManagement*******************************/
	// 	/***********************************************************************/

	// 	const accessProfileBtn = document.getElementById('modif_profile');
	// 	const changeAvatarBtn = document.getElementById('uploadForm');
	// 	const deleteBtn = document.getElementById('delete_btn');
	// 	const anonymizeBtn = document.getElementById('anonymize_btn');
	// 	const exportBtn = document.getElementById('export_btn');
	// 	const updateProfileBtn = document.getElementById('updateProfileForm');
	// 	const deconnect_btn_navBar = document.getElementById('deconnect_btn_navBar');
	// 	const deconnect_btn = document.getElementById('deconnect_btn');
	// 	const login1v1Btn = document.getElementById('choose_your_opponent_1v1_form');
	// 	const login2v2Btn = document.getElementById('choose_your_opponent_multi_form');
	// 	const add_friend_section = document.getElementById('add_friend_section');

	// 	accessProfileBtn?.addEventListener('submit', (event) => { accessProfileInfo(event); });
	// 	changeAvatarBtn?.addEventListener('submit', (event) => { changeProfilePicture(event); });
	// 	deleteBtn?.addEventListener('click', () => { delete_account(); });
	// 	anonymizeBtn?.addEventListener('click', () => { anonymize_user(); });
	// 	exportBtn?.addEventListener('click', () => { export_data(); });
	// 	code_validation_id?.addEventListener('submit', (event) => { activate2FA(event); });
	// 	updateProfileBtn?.addEventListener('submit', (event) => { updateProfileInfo(event); });
	// 	deconnect_btn_navBar?.addEventListener('click', async () => { await logout(); });
	// 	deconnect_btn?.addEventListener('click', async () => { await logout(); });
	// 	login1v1Btn?.addEventListener('submit', async (event) => { await login_1v1(event); });
	// 	login2v2Btn?.addEventListener('submit', async (event) => { await login_2v2(event); });
	// 	choose_your_opponent_platformer_form?.addEventListener('submit', async (event) => { await login_platformer(event); });
	// 	add_friend_section?.addEventListener('submit', (event) => { addFriend(event); });

	// }
}




export function getPowerUP_value() {
	return powerUP_nb;
}

export function setPowerUP_value(value: number) {
	powerUP_nb = value;
}

export function getPowerUP_value_multi() {
	return powerUP_nb_multi;
}

export function setPowerUP_value_multi(value: number) {
	powerUP_nb_multi = value;
}