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
import { homeView } from "../../../api/utils.js";

let powerUP_nb = 0;
let powerUP_nb_multi = 0;

if (localStorage.getItem('historyIsVisible') === null)
	localStorage.setItem('historyIsVisible', 'false');

export default class Game_menu extends AbstractView {
	constructor() {
		super();
		this.setTitle("Game_menu");
		const accessToken: string | null = sessionStorage.getItem('accessToken');
		if (!accessToken || accessToken === undefined)
			homeView();
	}

	async getHtml(): Promise<string> {
		return /*html*/`
		<link rel="stylesheet" href="./static/js/css/game_menu.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="navbar_menu">
			<div class="profile_photo_circle_nav_bar" id="profile_photo_circle_nav_bar"><img src="./uploads/${localStorage.getItem('profile_picture')}" alt="profile picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></div>
			<h1 class="player_name">${localStorage.getItem('Player1')}</h1>
			<button class="option_navBar" id="option_btn_navBar" onclick="togglePanel(event)">
				<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
			</button>
			
		</div>


		<div id="cgu-modal" class="cgu-modal">
			<div class="cgu-content">
				<h1>Conditions Générales d'Utilisation</h1>
				<div class="cgu-text">
					<h2>1. Introduction</h2>
					<p>Bienvenue sur Transcendance. En utilisant notre application, vous acceptez les présentes conditions générales d'utilisation.</p>
					<p>Responsable du traitement: Équipe projet Transcendance - École 42<br>
					Contact: ozasahin@student.42lyon.fr<br>
					Délégué à la Protection des Données (DPO): M. SAHIN O.</p>
					
					<h2>2. Description du Service</h2>
					<p>Transcendance est une plateforme de jeu en ligne permettant aux utilisateurs de jouer à Pong et d'autres jeux, de communiquer et d'interagir avec d'autres utilisateurs.</p>
					
					<h2>3. Inscription et Compte</h2>
					<p>Pour utiliser notre service, vous devez créer un compte avec des informations exactes et à jour. Nous collectons uniquement les données nécessaires à la fourniture de nos services.</p>
					
					<h2>4. Comportement des Utilisateurs</h2>
					<p>Les utilisateurs s'engagent à respecter les autres membres et à ne pas publier de contenu offensant ou illégal.</p>
					
					<h2>5. Propriété Intellectuelle</h2>
					<p>Tous les droits de propriété intellectuelle liés à Transcendance appartiennent à leurs propriétaires respectifs.</p>
					
					<h2>6. Protection des Données</h2>
					<p>Nous nous engageons à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).</p>
					<h3>6.1 Données collectées</h3>
					<p>Nous collectons les catégories de données suivantes:
					<ul>
						<li>Données d'identification (ID interne, username, avatar)</li>
						<li>Données d'authentification (via Google Sign-In)</li>
						<li>Données de profil (statut, préférences)</li>
						<li>Données d'utilisation (historique des parties, scores, classement)</li>
					</ul>
					</p>
					<h3>6.2 Finalités du traitement</h3>
					<p>Vos données sont traitées pour les finalités suivantes:
					<ul>
						<li>Fourniture du service de jeu en ligne Transcendance</li>
						<li>Administration des comptes utilisateurs</li>
						<li>Fonctionnalités sociales (amis)</li>
						<li>Enregistrement des statistiques de jeu et classements</li>
					</ul>
					</p>
					<h3>6.3 Durée de conservation</h3>
					<p>Vos données sont conservées pendant la durée du projet et jusqu'à 1 mois après l'évaluation finale.</p>
					<h3>6.4 Destinataires des données</h3>
					<p>Vos données peuvent être accessibles aux:
					<ul>
						<li>Membres de l'équipe projet</li>
						<li>Corps enseignant et évaluateurs de l'école 42</li>
						<li>Autres utilisateurs (uniquement pour les données publiques de profil)</li>
					</ul>
					</p>
					<h3>6.5 Vos droits</h3>
					<p>Conformément au RGPD, vous disposez des droits suivants:
					<ul>
						<li>Droit d'accès à vos données</li>
						<li>Droit de rectification</li>
						<li>Droit à l'effacement ("droit à l'oubli")</li>
						<li>Droit à la limitation du traitement</li>
						<li>Droit à la portabilité des données</li>
						<li>Droit d'opposition</li>
					</ul>
					Pour exercer ces droits, contactez-nous à: ozasahin@student.42lyon.fr
					</p>
					<h3>6.6 Mesures de sécurité</h3>
					<p>Nous mettons en œuvre les mesures techniques et organisationnelles suivantes:
					<ul>
						<li>Chiffrement des mots de passe et données sensibles</li>
						<li>Authentification sécurisée (Google Sign-In)</li>
						<li>Double authentification (2FA)</li>
						<li>Sessions sécurisées avec expiration (JWT)</li>
						<li>Protection contre les vulnérabilités web courantes</li>
					</ul>
					</p>
					
					<h2>7. Modification des CGU</h2>
					<p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront notifiés des changements importants.</p>
					
					<h2>8. Durée et Résiliation</h2>
					<p>L'accès à notre service peut être suspendu ou résilié en cas de non-respect des présentes conditions.</p>
					
					<h2>9. Transferts de données</h2>
					<p>Aucun transfert de données personnelles n'est effectué en dehors de l'Union Européenne. Toutes les données sont hébergées sur des serveurs situés dans l'UE.</p>
				</div>
				<button id="cgu-back-button" class="cgu-back-button">Retour</button>
			</div>
		</div>

		<div id="privacy-policy-modal" class="cgu-modal">
			<div class="cgu-content">
				<h1>Politique de Confidentialité</h1>
				<div class="cgu-text">
					<h2>1. Introduction</h2>
					<p>Bienvenue dans notre Politique de Confidentialité. Elle décrit comment nous collectons, utilisons et protégeons vos données personnelles.</p>
					<p>Responsable du traitement: Équipe projet Transcendance - École 42<br>
					Contact: ozasahin@student.42lyon.fr<br>
					Délégué à la Protection des Données (DPO): M. SAHIN O.</p>
					
					<h2>2. Données collectées</h2>
					<p>Nous collectons des données vous concernant lorsque vous utilisez notre service, notamment:</p>
					<ul>
						<li>Données d'identification (ID interne, username, avatar)</li>
						<li>Données d'authentification (via Google Sign-In)</li>
						<li>Données de profil (statut, préférences)</li>
						<li>Données d'utilisation (historique des parties, scores, classement)</li>
					</ul>
					
					<h2>3. Utilisation des données</h2>
					<p>Nous utilisons vos données pour:</p>
					<ul>
						<li>Fournir et améliorer notre service</li>
						<li>Administrer votre compte</li>
						<li>Vous proposer des fonctionnalités sociales (amis)</li>
						<li>Enregistrer vos statistiques de jeu et classements</li>
					</ul>
					
					<h2>4. Partage des données</h2>
					<p>Nous ne vendons pas vos données personnelles. Nous pouvons être amenés à partager vos données avec:</p>
					<ul>
						<li>Membres de l'équipe projet</li>
						<li>Corps enseignant et évaluateurs de l'école 42</li>
						<li>Autres utilisateurs (uniquement pour les données publiques de profil)</li>
					</ul>
					
					<h2>5. Sécurité des données</h2>
					<p>Nous mettons en œuvre des mesures de sécurité pour protéger vos données contre tout accès non autorisé, divulgation, altération ou destruction.</p>
					
					<h2>6. Vos droits</h2>
					<p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles:</p>
					<ul>
						<li>Droit d'accès</li>
						<li>Droit de rectification</li>
						<li>Droit à l'effacement</li>
						<li>Droit à la limitation du traitement</li>
						<li>Droit à la portabilité des données</li>
						<li>Droit d'opposition</li>
					</ul>
					<p>Pour exercer ces droits, contactez-nous à: ozasahin@student.42lyon.fr</p>
					
					<h2>7. Modifications de la Politique de Confidentialité</h2>
					<p>Nous nous réservons le droit de modifier cette politique à tout moment. Les utilisateurs seront notifiés des changements importants.</p>
					
					<h2>8. Contact</h2>
					<p>Pour toute question concernant cette Politique de Confidentialité, veuillez nous contacter à: ozasahin@student.42lyon.fr</p>
				</div>
				<button id="privacy-policy-back-button" class="cgu-back-button">Retour</button>
			</div>
		</div>

		<div class="panel_option_navbar" id="panel_option_navbar">
			<button class="option-in-panel" id="option_btn_remove">
				<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
			</button>
			<div class="friend_list_container">
				<h1>FRIENDS LIST</h1>

				<!-- Boutons de navigation -->
				<div class="friend_tabs">
					<button id="tab-accepted" class="tab-btn active">Friend</button>
					<button id="tab-pending" class="tab-btn">On hold</button>
				</div>

				<!-- Sections d'amis -->
				<div class="friend_sections">
					<div id="section-accepted" class="friend_section">
						<div id="friends-accepted" class="friend_list_scrollable"></div>
					</div>
					<div id="section-pending" class="friend_section" style="display: none;">
						<div id="friends-pending" class="friend_list_scrollable"></div>
					</div>
				</div>

				<!-- Ajouter un ami -->
				<form class="add_friend_section" onsubmit="addFriend(event)">
					<input type="text" id="friend_name_input" placeholder="Username..." />
					<button type="submit" id="add_friend_btn">Add</button>
				</form>
			</div>

			<div class="game_history_navBar" id="game_history_navBar">
				<div class="game_history_content_navBar">
					<h1>GAME HISTORY</h1>

					<table class="game_history_scrollable_navBar">
						<!-- Game 1 -->
						<tbody id="games-table"></tbody>
					</table>
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
							<a id="tournament_view" class="btn_tournament" href="/tournament" data-link>TOURNAMENT</a>
							<button id="platformer_view" class="btn">PLATFORMER</button>
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
							<button id="Game_History_btn" class="btn" onclick="fetch_user_games_big('${localStorage.getItem('Player1')}')">GAME HISTORY</button>
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
							<div class="export_btn">
								<button id="export_btn" class="btn_export_btn" onclick="export_data()">Export data</button>
							</div>
							<div class="anonymize_btn">
								<button id="anonymize_btn" class="btn_anonymize_btn" onclick="anonymize_user()">Anonymize me</button>
							</div>
							<div class="cgu-container">
                                <label for="accept-cgu"><a href="#" id="show-cgu" class="cgu-link">Conditions Générales d'Utilisation</a></label>
                            </div>
                            <div class="privacy-policy-container">
                                <label for="accept-privacy-policy"><a href="#" id="show-privacy-policy" class="cgu-link">Politique de Confidentialité</a></label>
                            </div>
							
						</div>
					</div>
				</div>

				<div class="choose_your_opponent_1v1" id="choose_your_opponent_1v1_id">
					<form class="choose_your_opponent_1v1_content" id="choose_your_opponent_1v1_form" onsubmit="login_1v1(event)">
						<h1>CONNECT YOUR OPPONENT</h1>
						<div class="player-section">
							<p>PLAYER 2</p>
							<div class="input-container">
								<label for="username2">Username :</label>
								<input type="text" id="1v1-username2" name="username2" placeholder="Player 2 username" required>
							</div>
							<div class="input-container">
								<label for="password2">Password :</label>
								<input type="password" id="1v1-password2" name="password2" placeholder="Player 2 password" required>
							</div>
						</div>
						<button type="submit" class="valider_opponent_btn_1v1" id="validate-opponent-login">Valider</button>
					</form>
				</div>

				<div class="choose_your_opponent_platformer" id="choose_your_opponent_platformer_id">
					<form class="choose_your_opponent_platformer_content" id="choose_your_opponent_platformer_form" onsubmit="login_platformer(event)">
						<h1>CONNECT YOUR OPPONENT</h1>
						<div class="player-section">
							<p>PLAYER 2</p>
							<div class="input-container">
								<label for="username2">Username :</label>
								<input type="text" id="platformer-username2" name="username2" placeholder="Player 2 username" required>
							</div>
							<div class="input-container">
								<label for="password2">Password :</label>
								<input type="password" id="platformer-password2" name="password2" placeholder="Player 2 password" required>
							</div>
						</div>
						<button type="submit" class="valider_opponent_btn_platformer" id="validate-opponent-platformer-login">Validate</button>
						<a style="display:none" class="valider_opponent_btn_platformer" href="/PlatformView" id="start-platformer" data-link>Start</a>
					</form>
				</div>


				<div class="choose_your_opponent_multi" id="choose_your_opponent_multi_id">
					<form class="choose_your_opponent_multi_content" id="choose_your_opponent_multi_form" onclick="login_2v2(event)">
						<h1>CONNECT YOUR OPPONENTS</h1>

						<div class="player-section">
						<p>PLAYER 2</p>
						<div class="input-container">
							<label for="username2">Username :</label>
							<input type="text" id="2v2-username2" name="username2" placeholder="Player 2 username" required>
						</div>
						<div class="input-container">
							<label for="password2">Password :</label>
							<input type="password" id="2v2-password2" name="password2" placeholder="Player 2 password" required>
						</div>
						</div>

						<div class="player-section">
						<p>PLAYER 3</p>
						<div class="input-container">
							<label for="username3">Username :</label>
							<input type="text" id="2v2-username3" name="username3" placeholder="Player 3 username" required>
						</div>
						<div class="input-container">
							<label for="password3">Password :</label>
							<input type="password" id="2v2-password3" name="password3" placeholder="Player 3 password" required>
						</div>
						</div>

						<div class="player-section">
						<p>PLAYER 4</p>
						<div class="input-container">
							<label for="username4">Username :</label>
							<input type="text" id="2v2-username4" name="username4" placeholder="Player 4 username" required>
						</div>
						<div class="input-container">
							<label for="password4">Password :</label>
							<input type="password" id="2v2-password4" name="password4" placeholder="Player 4 password" required>
						</div>
						</div>

						<button type="submit" class="valider_opponent_btn" id="validate_multi_opponent">Valider</button>
					</form>
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
						<div class="skin" id="skin">
							<p>Custom Skin: <span id="skin_perso" class="skin_perso"></span></p>
						</div>
						<a id="solo_1v1_btn" class="btn" href="/solo_game_1v1" class="nav-link" data-link>Start Game</a>
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
						<div class="skin" id="skin_multi">
							<p>Custom Skin: <span id="skin_perso_game_multi" class="skin_perso"></span></p>
						</div>
						<a id="multiplayer_btn" class="btn" href="/multi_player_game" class="nav-link" data-link>Start Game</a>
					</div>
				</div>
			</div>

			<form id="code_validation_id" class="code_validation hidden" onsubmit="activate2FA(event)">
				<img id="qrCode" src="../../../srcs/game/assets/image/timer-reset.svg" style="width:auto" alt="delay">
				<label for="code">code</label>
				<input type="code" id="activate-2fa-code" name="code" placeholder="code" required>
				<button type="submit" class="btn_valider_qr_code">Validate</button>
				<button type="button" class="cancel_fa" id="cancel_fa">X</button>
			</form>

			<div class="game_history" id="game_history">
				<div class="game_history_content">
					<div class="game_history_header">
						<div class="profile_photo_circle_Game_History" id="profile_photo_circle_Game_History"></div>
						<h1 id="game_history_username"></h1>
					</div>

					<div class="game_statistics_history">
						<h1>GAME STATISTICS</h1>
					</div>
					<div class="game_statistics_content_history">
						<div class="game_statistics_info_group">
							<div class="game_statistics_info_block">
								<p>Games Won : <span id="games_won_history" class="games_won_history text-shadow-green"></span></p>
								<p>Games Lost : <span id="games_lost_history" class="games_lost_history text-shadow-red"></span></p>
							</div>
							<div class="game_statistics_info_block">
								<p>Games Played : <span id="games_played_history" class="games_lost_history"></span></p>
								<p>Win Rate : <span id="win_rate_history" class="win_rate_history text-shadow-orange"></span></p>
							</div>
						</div>
					</div>

					
					<div class="game_history_info">
						<h1>GAME HISTORY</h1>
					</div>
					
					<table class="game_history_scrollable">
						<!-- Game 1 -->
						<tbody id="games-table-big">
						</tbody>
					</table>

					<div class="exit_game_history" id="exit_game_history">
						<button id="exit_game_history_btn" class="exit_game_history_btn">
							X
						</button>
					</div>
				</div>
			</div>


			<div class="back" id="back_to_select_mode_view6">
				<button id="back_to_menu_view6" class="btn_back">BACK</button>
			</div>
			<div class="back" id="back_to_select_mode_platformer">
				<button id="back_to_select_mode_platformer" class="btn_back">BACK</button>
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
					<p id="1v1-oponent-username1">${localStorage.getItem('Player1')}</p>
				</div>
				<div class="player2">
					<button class="switch_skin_left" id="switch_skn_left_id2"></button>
					<button class="switch_skin_right" id="switch_skn_right_id2"></button>
					<p id="1v1-oponent-username2">${localStorage.getItem('Player2')}</p>
				</div>
				<button id="valide_ton_skin" class="btn">Confirm</button>
			</div>

			<div class="choose_your_skin_game_multi" id="choose_your_skin_game_multi">
				<h1>CUSTOMIZE YOUR SKIN</h1>
				<div class="player1_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id1_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id1_game_multi"></button>
					<p id="2v2-oponent-username1">${localStorage.getItem('Player1')}</p>
				</div>
				<div class="player2_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id2_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id2_game_multi"></button>
					<p id="2v2-oponent-username2">${localStorage.getItem('Player2')}</p>
				</div>
				<div class="player3_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id3_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id3_game_multi"></button>
					<p id="2v2-oponent-username3">${localStorage.getItem('Player3')}</p>
				</div>
				<div class="player4_game_multi">
					<button class="switch_skin_left" id="switch_skn_left_id4_game_multi"></button>
					<button class="switch_skin_right" id="switch_skn_right_id4_game_multi"></button>
					<p id="2v2-oponent-username4">${localStorage.getItem('Player4')}</p>
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
			console.log("Solo 1v1 game started");
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
		const choose_your_opponent_platformer_form = document.getElementById('choose_your_opponent_platformer_form');
		// const back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');

		//*==== CGU & Privacy Policy Modals ====*/
		const showCguLink = document.getElementById("show-cgu");
		const cguModal = document.getElementById("cgu-modal");
		const cguBackButton = document.getElementById("cgu-back-button");
		
		showCguLink?.addEventListener("click", (e) => {
			e.preventDefault();
			cguModal?.classList.add("active");
			document.body.style.overflow = "hidden";
		});

		cguBackButton?.addEventListener("click", () => {
			cguModal?.classList.remove("active");
			document.body.style.overflow = "";
		});

		cguModal?.addEventListener("click", (event) => {
			if (event.target === cguModal) {
				cguModal?.classList.remove("active");
				document.body.style.overflow = "";
			}
		});

        const showPrivacyPolicyLink = document.getElementById("show-privacy-policy");
        const privacyPolicyModal = document.getElementById("privacy-policy-modal");
        const privacyPolicyBackButton = document.getElementById("privacy-policy-back-button");

        showPrivacyPolicyLink?.addEventListener("click", (e) => {
            e.preventDefault();
            privacyPolicyModal?.classList.add("active");
            document.body.style.overflow = "hidden";
        });

        privacyPolicyBackButton?.addEventListener("click", () => {
            privacyPolicyModal?.classList.remove("active");
            document.body.style.overflow = "";
        });

        privacyPolicyModal?.addEventListener("click", (event) => {
            if (event.target === privacyPolicyModal) {
                privacyPolicyModal?.classList.remove("active");
                document.body.style.overflow = "";
            }
        });

		btn_jouer.addEventListener('click', () => {
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
			else if (!view2.classList.contains('active'))
				view2.classList.add('active');
		});

		let skin = get_skin_is_init();
		const skin_id = document.getElementById('skin');
		const skin_id_multi = document.getElementById('skin_multi');

		console.log('skin_id', skin);

		if (skin == false) {
			console.log('skin_id');
			skin_id.classList.add('hidden');
			skin_id_multi.classList.add('hidden');
		}
		else {
			skin_id.classList.remove('hidden');
			skin_id_multi.classList.remove('hidden');
		}


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

		// prepar_game_1v1.addEventListener('click', () => {
		// 	view3.classList.remove('active');
		// 	view6.classList.add('active');
		// 	back_to_select_mode_view6.classList.add('active');
		// });

		const choose_your_opponent_1v1_form = document.getElementById('choose_your_opponent_1v1_form');
		// const validate_login = document.getElementById('validate-opponent-login');

		prepar_game_1v1.addEventListener('click', () => {
			console.log('Prepar game 1v1 clicked');
			view3.classList.remove('active');
			choose_your_opponent_1v1_form.classList.add('active');
			back_to_select_mode_view6.classList.add('active');
			container_menu.classList.add('active');
			container_menu.scrollTop = 0; // Reset scroll position to the top
		});

		// validate_login.addEventListener('click', () => {
		// 	console.log('Prepar game 1v1 clicked');
		// 	choose_your_opponent_1v1_form.classList.remove('active');
		// 	back_to_select_mode_view6.classList.add('active');
		// 	view6.classList.add('active');
		// 	container_menu.classList.remove('active');
		// });


		// prepar_game_multi.addEventListener('click', () => {
		// 	view4.classList.remove('active');
		// 	view8.classList.add('active');
		// 	back_to_select_mode_view8.classList.add('active');
		// });
		
		const choose_your_opponent_multi_form = document.getElementById('choose_your_opponent_multi_form');
		const validate_multi_opponent = document.getElementById('validate_multi_opponent');

		prepar_game_multi.addEventListener('click', () => {
			view4.classList.remove('active');
			choose_your_opponent_multi_form.classList.add('active');
			back_to_select_mode_view8.classList.add('active');
			container_menu.classList.add('active');
			container_menu.scrollTop = 0;
		});

		// validate_multi_opponent.addEventListener('click', () => {
		// 	console.log('Prepar game multi clicked');
		// 	choose_your_opponent_multi_form.classList.remove('active');
		// 	back_to_select_mode_view8.classList.add('active');
		// 	view8.classList.add('active');
		// 	container_menu.classList.remove('active');
		// });


		/***********************************************************************/
		/**************************BACK_TO_MENU********************************/
		/***********************************************************************/

		back_to_menu_view6.addEventListener('click', () => {
			view6.classList.remove('active');
			view3.classList.add('active');
			back_to_select_mode_view6.classList.remove('active');


			if (choose_your_opponent_1v1_form.classList.contains('active')) {
				choose_your_opponent_1v1_form.classList.remove('active');
				back_to_select_mode_view6.classList.remove('active');
				view3.classList.add('active');
				container_menu.classList.remove('active');
				container_menu.scrollTop = 0;
			}
		

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
			if (choose_your_opponent_multi_form.classList.contains('active')) {
				choose_your_opponent_multi_form.classList.remove('active');
				back_to_select_mode_view8.classList.remove('active');
				view4.classList.add('active');
				container_menu.classList.remove('active');
				container_menu.scrollTop = 0;
			}
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
			container_menu.scrollTop = 0;

		});
		
		parametre_profile.addEventListener('click', () => {
			console.log('Parrametre profile clicked');
			parametre_profile_view.classList.add('active');
			view5.classList.remove('active');
			btn_back_home.classList.remove('active');
			view1.classList.remove('active');
			btn_back_home.classList.add('active');
			container_menu.classList.add('active');
			container_menu.scrollTop = 0;

		});


		btn_back_home.addEventListener('click', () => {
			if (parametre_jeu_view.classList.contains('active')) {
				parametre_jeu_view.classList.remove('active');
				view5.classList.add('active');
				// btn_back_home.classList.remove('active');
				view1.classList.add('active');
				container_menu.classList.remove('active');
				container_menu.scrollTop = 0;

			}
			if (parametre_profile_view.classList.contains('active')) {
				parametre_profile_view.classList.remove('active');
				view5.classList.add('active');
				// btn_back_home.classList.remove('active');
				view1.classList.add('active');
				container_menu.classList.remove('active');
				container_menu.scrollTop = 0;

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
		const cancel_fa = document.getElementById('cancel_fa');

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

		cancel_fa.addEventListener('click', () => {
			console.log('Cancel FA clicked');
			code_validation_id.classList.remove('active');
			fa_selector.classList.add('hidden');
			active_fa.checked = false;
		});


		/***********************************************************************/
		/*************************platformer************************************/
		/***********************************************************************/

		const platformer = document.getElementById('platformer_view');
		const back_to_select_mode_platformer = document.getElementById('back_to_select_mode_platformer');

		platformer.addEventListener('click', () => {
			btn_back_home.classList.remove('active');
			view2.classList.remove('active');
			view1.classList.remove('active');
			choose_your_opponent_platformer_form.classList.add('active');
			back_to_select_mode_platformer.classList.add('active');
			container_menu.classList.add('active');
			container_menu.scrollTop = 0; // Reset scroll position to the top
		});

		back_to_select_mode_platformer.addEventListener('click', () => {
			console.log('Back to select mode platformer clicked');
			choose_your_opponent_platformer_form.classList.remove('active');
			back_to_select_mode_platformer.classList.remove('active');
			view2.classList.add('active');
			view1.classList.add('active');
			btn_back_home.classList.add('active');
			container_menu.classList.remove('active');
			container_menu.scrollTop = 0; // Reset scroll position to the top
		});

		// const valider_opponent_btn_platformer = document.getElementById('valider_opponent_btn_platformer');

		// valider_opponent_btn_platformer.addEventListener('click', () => {
		// 	handleViewTransitions("vue2", "platformer");
		// });
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
			panel_option_navbar.classList.remove('remove'); // retire l'animation de fermeture
			void panel_option_navbar.offsetWidth; // force le reflow pour relancer l'animation si besoin
			panel_option_navbar.classList.add('active');
		});

		option_btn_remove.addEventListener('click', () => {
			console.log('Option deconnect back clicked');
			// panel_option_navbar.classList.remove('active'); // retire l'animation d’ouverture
			panel_option_navbar.classList.add('remove');
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
			localStorage.setItem("historyIsVisible", "true");
		});

		exit_game_history_btn.addEventListener('click', () => {
			game_history.classList.remove('active');
			view1.classList.add('active');
			btn_back_home.classList.add('active');
			view5.classList.add('active');
			localStorage.setItem("historyIsVisible", "false");
		});

		document.getElementById("solo_1v1_btn").addEventListener("click", () => {
			console.log("Solo 1v1 game started");
			startGame();
			handleViewTransitions("vue3", "vue2");
		});

		document.getElementById("multiplayer_btn").addEventListener("click", () => {
			// console.log("Multiplayer 2v2 game started");
			startMultiGame();
			handleViewTransitions("vue3", "vue2");
		});

		document.getElementById("tournament_view").addEventListener("click", () => {
			// console.log("Tournament view started");
			handleViewTransitions("tournament");
		});

		const acceptedSection = document.getElementById('section-accepted');
		const pendingSection = document.getElementById('section-pending');

		const btnAccepted = document.getElementById('tab-accepted');
		const btnPending = document.getElementById('tab-pending');

		btnAccepted.addEventListener('click', () => {
			acceptedSection.style.display = 'block';
			pendingSection.style.display = 'none';
			btnAccepted.classList.add('active');
			btnPending.classList.remove('active');
		});

		btnPending.addEventListener('click', () => {
			acceptedSection.style.display = 'none';
			pendingSection.style.display = 'block';
			btnAccepted.classList.remove('active');
			btnPending.classList.add('active');
		});

		document.getElementById("start-platformer").addEventListener('click', () => {
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