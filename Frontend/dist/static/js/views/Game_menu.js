import AbstractView from "./AbstractView.js";
import { startGame } from "../../../srcs/game/gameplay/babylon.js";
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
let powerUP_nb = 0;
let powerUP_nb_multi = 0;
if (localStorage.getItem('historyIsVisible') === null) {
    localStorage.setItem('historyIsVisible', 'false');
}
console.log("historyIsVisible:", localStorage.getItem('historyIsVisible'));
export default class Game_menu extends AbstractView {
    constructor() {
        super();
        this.setTitle("Game_menu");
        const accessToken = sessionStorage.getItem('accessToken');
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
	`;
    }
    // init_solo_game() {
    // 	document.getElementById("solo_1v1_btn").addEventListener("click", () => {
    // 		console.log("Solo 1v1 game started");
    // 		startGame();
    // 		handleViewTransitions("vue3", "vue2");
    // 	});
    // }
    // initEvents() {
    // 	document.getElementById("multiplayer_btn").addEventListener("click", () => {
    // 		// console.log("Multiplayer 2v2 game started");
    // 		startMultiGame();
    // 		handleViewTransitions("vue3", "vue2");
    // 	});
    // }
    // tournament_view() {
    // 	document.getElementById("tournament_view").addEventListener("click", () => {
    // 		// console.log("Tournament view started");
    // 		handleViewTransitions("tournament");
    // 	});
    // }
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
        // Modifier l'event listener d'ouverture des CGU
        showCguLink?.addEventListener("click", (e) => {
            e.preventDefault();
            cguModal?.classList.add("active");
            // Ajouter cette ligne pour empêcher le scroll du contenu derrière
            document.body.style.overflow = "hidden";
        });
        // Modifier les listeners de fermeture aussi
        cguBackButton?.addEventListener("click", () => {
            cguModal?.classList.remove("active");
            // Réactiver le scroll quand on ferme
            document.body.style.overflow = "";
        });
        // Ajout : fermer le modal en cliquant à l'extérieur
        cguModal?.addEventListener("click", (event) => {
            if (event.target === cguModal) {
                cguModal?.classList.remove("active");
                // Réactiver le scroll quand on ferme
                document.body.style.overflow = "";
            }
        });
        // Gestion de la Politique de Confidentialité
        const showPrivacyPolicyLink = document.getElementById("show-privacy-policy");
        const privacyPolicyModal = document.getElementById("privacy-policy-modal");
        const privacyPolicyBackButton = document.getElementById("privacy-policy-back-button");
        // Modifier l'event listener d'ouverture de la Politique de Confidentialité
        showPrivacyPolicyLink?.addEventListener("click", (e) => {
            e.preventDefault();
            privacyPolicyModal?.classList.add("active");
            // Ajouter cette ligne pour empêcher le scroll du contenu derrière
            document.body.style.overflow = "hidden";
        });
        // Modifier les listeners de fermeture aussi
        privacyPolicyBackButton?.addEventListener("click", () => {
            privacyPolicyModal?.classList.remove("active");
            // Réactiver le scroll quand on ferme
            document.body.style.overflow = "";
        });
        // Ajout : fermer le modal en cliquant à l'extérieur
        privacyPolicyModal?.addEventListener("click", (event) => {
            if (event.target === privacyPolicyModal) {
                privacyPolicyModal?.classList.remove("active");
                // Réactiver le scroll quand on ferme
                document.body.style.overflow = "";
            }
        });
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
        const active_fa = document.getElementById('active_fa');
        ;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZV9tZW51LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy9HYW1lX21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSx3Q0FBd0MsQ0FBQztBQUNqRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDeEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDcEYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHFCQUFxQixFQUFFLE1BQU0sMEVBQTBFLENBQUM7QUFDL0ksT0FBTyxFQUFFLHdCQUF3QixFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0VBQXNFLENBQUM7QUFDeEksT0FBTyxFQUFFLDJCQUEyQixFQUFFLDRCQUE0QixFQUFFLE1BQU0scUVBQXFFLENBQUM7QUFDaEosT0FBTyxFQUFFLHdDQUF3QyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0scUZBQXFGLENBQUM7QUFDakwsT0FBTyxFQUFFLCtCQUErQixFQUFFLGdDQUFnQyxFQUFFLE1BQU0sMEVBQTBFLENBQUM7QUFDN0osT0FBTyxFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNuRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsOEJBQThCLEVBQUUsdUNBQXVDLEVBQUUsOEJBQThCLEVBQUUsK0JBQStCLEVBQUUsOEJBQThCLEVBQUUsK0JBQStCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNwVCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsMkJBQTJCLEVBQUUsa0JBQWtCLEVBQUUscUNBQXFDLEVBQUUsb0NBQW9DLEVBQUUsb0NBQW9DLEVBQUUscUNBQXFDLEVBQUUsb0NBQW9DLEVBQUUscUNBQXFDLEVBQUUsb0NBQW9DLEVBQUUscUNBQXFDLEVB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Q3ZDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDMUUscUJBQXFCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEO0FBS0QsTUFBTSxVQUFVLGdCQUFnQjtJQUMvQixPQUFPLFVBQVUsQ0FBQztBQUNuQixDQUFDO0FBRUQsTUFBTSxVQUFVLHNCQUFzQjtJQUNyQyxPQUFPLGdCQUFnQixDQUFDO0FBQ3pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuaW1wb3J0IHsgc3RhcnRHYW1lLCBzdGFydEFJX0dhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IHN0YXJ0TXVsdGlHYW1lIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9iYWJ5bG9uLmpzXCI7XG5pbXBvcnQgeyBoYW5kbGVWaWV3VHJhbnNpdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3ZpZXdzL2NhbWVyYS5qc1wiO1xuaW1wb3J0IHsgaW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaCwgcmVzZXRfcG93ZXJVUF9ncmVuYWRlIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX0dyZW5hZGVGbGFzaC5qc1wiO1xuaW1wb3J0IHsgaW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlLCByZXNldF9wb3dlclVQX3RlYW1tYXRlIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX3RlYW1tYXRlLmpzXCI7XG5pbXBvcnQgeyBpbml0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIsIHJlc2V0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3NvbG8vMXYxX3BsYXllci9pbml0X3Bvd2VyVVBfaW52ZXJzZS5qc1wiO1xuaW1wb3J0IHsgaW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaF90ZWFtX3BsYXllciwgcmVzZXRfcG93ZXJVUF9ncmVuYWRlVGVhbV9wbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L211bHRpcGxheWVyLzJ2Ml9nYW1lL2luaXRfcG93ZXJVUF9HZXJuYWRlRmxhc2hfbXVsdGkuanNcIjtcbmltcG9ydCB7IGluaXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIsIHJlc2V0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9tdWx0aXBsYXllci8ydjJfZ2FtZS9pbml0X3Bvd2VyX3VwX2ZyZWV6ZS5qc1wiO1xuaW1wb3J0IHsgZ2V0VmFsdWVfbGVhdmVfZ2FtZSwgc2V0TGVhdmVHYW1lVmFyIH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBlbmFibGVfc2tpbl9wZXJzb19wbGF5ZXJfc29sbywgZGlzYWJsZV9za2luX3BlcnNvX3BsYXllcl9zb2xvLCBkaXNhYmxlX3NraW5fcGVyc29fcGxheWVyX3NvbG9fYW5kX3NhdmUsIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfbGVmdCwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9yaWdodCwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyMl9sZWZ0LCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX3JpZ2h0IH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvL3NraW4vaW5pdF9za2luX3BlcnNvLmpzXCI7XG5pbXBvcnQgeyBlbmFibGVfc2tpbl9tdWx0aSwgZGlzYWJsZV9za2luX2FuZF9zYXZlX211bHRpLCBkaXNhYmxlX3NraW5fbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfcmlnaHRfbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfbGVmdF9tdWx0aSwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyMl9sZWZ0X211bHRpLCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX3JpZ2h0X211bHRpLCBzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIzX2xlZnRfbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjNfcmlnaHRfbXVsdGksIHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjRfbGVmdF9tdWx0aSwgc3dpdGNoX3NraW5fcGVyc29fcGxheWVyNF9yaWdodF9tdWx0aSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvbXVsdGlwbGF5ZXIvaW5pdF9za2luX3BlcnNvX211bHRpLmpzXCI7XG5pbXBvcnQgeyBnZXRfc2tpbl9pc19pbml0IH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvL3NraW4vaW5pdF9za2luX3V0aWxzLmpzXCI7XG5cblxubGV0IHBvd2VyVVBfbmIgPSAwO1xubGV0IHBvd2VyVVBfbmJfbXVsdGkgPSAwO1xuXG5pZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpc3RvcnlJc1Zpc2libGUnKSA9PT0gbnVsbCkge1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaGlzdG9yeUlzVmlzaWJsZScsICdmYWxzZScpO1xufVxuXG5jb25zb2xlLmxvZyhcImhpc3RvcnlJc1Zpc2libGU6XCIsIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdoaXN0b3J5SXNWaXNpYmxlJykpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lX21lbnUgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0VGl0bGUoXCJHYW1lX21lbnVcIik7XG5cdFx0Y29uc3QgYWNjZXNzVG9rZW46IHN0cmluZyB8IG51bGwgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhY2Nlc3NUb2tlbicpO1xuXHRcdGlmICghYWNjZXNzVG9rZW4gfHwgYWNjZXNzVG9rZW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCAnLycpO1xuXHRcdFx0aW1wb3J0KCcuL0hvbWUuanMnKS50aGVuKChtb2R1bGU6IGFueSkgPT4ge1xuXHRcdFx0XHRjb25zdCBIb21lID0gbW9kdWxlLmRlZmF1bHQ7XG5cdFx0XHRcdGNvbnN0IGhvbWVJbnN0YW5jZSA9IG5ldyBIb21lKCk7XG5cdFx0XHRcdGhvbWVJbnN0YW5jZS5nZXRIdG1sKCkudGhlbigoaHRtbDogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgYXBwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcblx0XHRcdFx0XHRpZiAoYXBwRWxlbWVudCkge1xuXHRcdFx0XHRcdFx0YXBwRWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xuXHRcdFx0XHRcdFx0aWYgKGhvbWVJbnN0YW5jZS5jcmVhdGVBY2NvdW50ICYmIHR5cGVvZiBob21lSW5zdGFuY2UuY3JlYXRlQWNjb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHRob21lSW5zdGFuY2UuY3JlYXRlQWNjb3VudCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBnZXRIdG1sKCk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0cmV0dXJuIC8qaHRtbCovYFxuXHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLi9zdGF0aWMvanMvY3NzL2dhbWVfbWVudS5jc3NcIj5cblx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwibmF2YmFyX21lbnVcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJwcm9maWxlX3Bob3RvX2NpcmNsZV9uYXZfYmFyXCIgaWQ9XCJwcm9maWxlX3Bob3RvX2NpcmNsZV9uYXZfYmFyXCI+PGltZyBzcmM9XCIuL3VwbG9hZHMvJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvZmlsZV9waWN0dXJlJyl9XCIgYWx0PVwicHJvZmlsZSBwaWN0dXJlXCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBib3JkZXItcmFkaXVzOiA1MCU7IG9iamVjdC1maXQ6IGNvdmVyO1wiPjwvZGl2PlxuXHRcdFx0PGgxIGNsYXNzPVwicGxheWVyX25hbWVcIj4ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKCdQbGF5ZXIxJyl9PC9oMT5cblx0XHRcdDxidXR0b24gY2xhc3M9XCJvcHRpb25fbmF2QmFyXCIgaWQ9XCJvcHRpb25fYnRuX25hdkJhclwiIG9uY2xpY2s9XCJ0b2dnbGVQYW5lbChldmVudClcIj5cblx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL21lbnUuc3ZnXCIgYWx0PVwibGVhdmVcIj5cblx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XG5cdFx0PC9kaXY+XG5cblxuXHRcdDxkaXYgaWQ9XCJjZ3UtbW9kYWxcIiBjbGFzcz1cImNndS1tb2RhbFwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cImNndS1jb250ZW50XCI+XG5cdFx0XHRcdDxoMT5Db25kaXRpb25zIEfDqW7DqXJhbGVzIGQnVXRpbGlzYXRpb248L2gxPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2d1LXRleHRcIj5cblx0XHRcdFx0XHQ8aDI+MS4gSW50cm9kdWN0aW9uPC9oMj5cblx0XHRcdFx0XHQ8cD5CaWVudmVudWUgc3VyIFRyYW5zY2VuZGFuY2UuIEVuIHV0aWxpc2FudCBub3RyZSBhcHBsaWNhdGlvbiwgdm91cyBhY2NlcHRleiBsZXMgcHLDqXNlbnRlcyBjb25kaXRpb25zIGfDqW7DqXJhbGVzIGQndXRpbGlzYXRpb24uPC9wPlxuXHRcdFx0XHRcdDxwPlJlc3BvbnNhYmxlIGR1IHRyYWl0ZW1lbnQ6IMOJcXVpcGUgcHJvamV0IFRyYW5zY2VuZGFuY2UgLSDDiWNvbGUgNDI8YnI+XG5cdFx0XHRcdFx0Q29udGFjdDogb3phc2FoaW5Ac3R1ZGVudC40Mmx5b24uZnI8YnI+XG5cdFx0XHRcdFx0RMOpbMOpZ3XDqSDDoCBsYSBQcm90ZWN0aW9uIGRlcyBEb25uw6llcyAoRFBPKTogTS4gU0FISU4gTy48L3A+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjIuIERlc2NyaXB0aW9uIGR1IFNlcnZpY2U8L2gyPlxuXHRcdFx0XHRcdDxwPlRyYW5zY2VuZGFuY2UgZXN0IHVuZSBwbGF0ZWZvcm1lIGRlIGpldSBlbiBsaWduZSBwZXJtZXR0YW50IGF1eCB1dGlsaXNhdGV1cnMgZGUgam91ZXIgw6AgUG9uZyBldCBkJ2F1dHJlcyBqZXV4LCBkZSBjb21tdW5pcXVlciBldCBkJ2ludGVyYWdpciBhdmVjIGQnYXV0cmVzIHV0aWxpc2F0ZXVycy48L3A+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjMuIEluc2NyaXB0aW9uIGV0IENvbXB0ZTwvaDI+XG5cdFx0XHRcdFx0PHA+UG91ciB1dGlsaXNlciBub3RyZSBzZXJ2aWNlLCB2b3VzIGRldmV6IGNyw6llciB1biBjb21wdGUgYXZlYyBkZXMgaW5mb3JtYXRpb25zIGV4YWN0ZXMgZXQgw6Agam91ci4gTm91cyBjb2xsZWN0b25zIHVuaXF1ZW1lbnQgbGVzIGRvbm7DqWVzIG7DqWNlc3NhaXJlcyDDoCBsYSBmb3Vybml0dXJlIGRlIG5vcyBzZXJ2aWNlcy48L3A+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjQuIENvbXBvcnRlbWVudCBkZXMgVXRpbGlzYXRldXJzPC9oMj5cblx0XHRcdFx0XHQ8cD5MZXMgdXRpbGlzYXRldXJzIHMnZW5nYWdlbnQgw6AgcmVzcGVjdGVyIGxlcyBhdXRyZXMgbWVtYnJlcyBldCDDoCBuZSBwYXMgcHVibGllciBkZSBjb250ZW51IG9mZmVuc2FudCBvdSBpbGzDqWdhbC48L3A+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjUuIFByb3ByacOpdMOpIEludGVsbGVjdHVlbGxlPC9oMj5cblx0XHRcdFx0XHQ8cD5Ub3VzIGxlcyBkcm9pdHMgZGUgcHJvcHJpw6l0w6kgaW50ZWxsZWN0dWVsbGUgbGnDqXMgw6AgVHJhbnNjZW5kYW5jZSBhcHBhcnRpZW5uZW50IMOgIGxldXJzIHByb3ByacOpdGFpcmVzIHJlc3BlY3RpZnMuPC9wPlxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdDxoMj42LiBQcm90ZWN0aW9uIGRlcyBEb25uw6llczwvaDI+XG5cdFx0XHRcdFx0PHA+Tm91cyBub3VzIGVuZ2FnZW9ucyDDoCBwcm90w6lnZXIgdm9zIGRvbm7DqWVzIHBlcnNvbm5lbGxlcyBjb25mb3Jtw6ltZW50IGF1IFLDqGdsZW1lbnQgR8OpbsOpcmFsIHN1ciBsYSBQcm90ZWN0aW9uIGRlcyBEb25uw6llcyAoUkdQRCkuPC9wPlxuXHRcdFx0XHRcdDxoMz42LjEgRG9ubsOpZXMgY29sbGVjdMOpZXM8L2gzPlxuXHRcdFx0XHRcdDxwPk5vdXMgY29sbGVjdG9ucyBsZXMgY2F0w6lnb3JpZXMgZGUgZG9ubsOpZXMgc3VpdmFudGVzOlxuXHRcdFx0XHRcdDx1bD5cblx0XHRcdFx0XHRcdDxsaT5Eb25uw6llcyBkJ2lkZW50aWZpY2F0aW9uIChJRCBpbnRlcm5lLCB1c2VybmFtZSwgYXZhdGFyKTwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+RG9ubsOpZXMgZCdhdXRoZW50aWZpY2F0aW9uICh2aWEgR29vZ2xlIFNpZ24tSW4pPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Eb25uw6llcyBkZSBwcm9maWwgKHN0YXR1dCwgcHLDqWbDqXJlbmNlcyk8L2xpPlxuXHRcdFx0XHRcdFx0PGxpPkRvbm7DqWVzIGQndXRpbGlzYXRpb24gKGhpc3RvcmlxdWUgZGVzIHBhcnRpZXMsIHNjb3JlcywgY2xhc3NlbWVudCk8L2xpPlxuXHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0PC9wPlxuXHRcdFx0XHRcdDxoMz42LjIgRmluYWxpdMOpcyBkdSB0cmFpdGVtZW50PC9oMz5cblx0XHRcdFx0XHQ8cD5Wb3MgZG9ubsOpZXMgc29udCB0cmFpdMOpZXMgcG91ciBsZXMgZmluYWxpdMOpcyBzdWl2YW50ZXM6XG5cdFx0XHRcdFx0PHVsPlxuXHRcdFx0XHRcdFx0PGxpPkZvdXJuaXR1cmUgZHUgc2VydmljZSBkZSBqZXUgZW4gbGlnbmUgVHJhbnNjZW5kYW5jZTwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+QWRtaW5pc3RyYXRpb24gZGVzIGNvbXB0ZXMgdXRpbGlzYXRldXJzPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Gb25jdGlvbm5hbGl0w6lzIHNvY2lhbGVzIChhbWlzKTwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+RW5yZWdpc3RyZW1lbnQgZGVzIHN0YXRpc3RpcXVlcyBkZSBqZXUgZXQgY2xhc3NlbWVudHM8L2xpPlxuXHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0PC9wPlxuXHRcdFx0XHRcdDxoMz42LjMgRHVyw6llIGRlIGNvbnNlcnZhdGlvbjwvaDM+XG5cdFx0XHRcdFx0PHA+Vm9zIGRvbm7DqWVzIHNvbnQgY29uc2VydsOpZXMgcGVuZGFudCBsYSBkdXLDqWUgZHUgcHJvamV0IGV0IGp1c3F1J8OgIDEgbW9pcyBhcHLDqHMgbCfDqXZhbHVhdGlvbiBmaW5hbGUuPC9wPlxuXHRcdFx0XHRcdDxoMz42LjQgRGVzdGluYXRhaXJlcyBkZXMgZG9ubsOpZXM8L2gzPlxuXHRcdFx0XHRcdDxwPlZvcyBkb25uw6llcyBwZXV2ZW50IMOqdHJlIGFjY2Vzc2libGVzIGF1eDpcblx0XHRcdFx0XHQ8dWw+XG5cdFx0XHRcdFx0XHQ8bGk+TWVtYnJlcyBkZSBsJ8OpcXVpcGUgcHJvamV0PC9saT5cblx0XHRcdFx0XHRcdDxsaT5Db3JwcyBlbnNlaWduYW50IGV0IMOpdmFsdWF0ZXVycyBkZSBsJ8OpY29sZSA0MjwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+QXV0cmVzIHV0aWxpc2F0ZXVycyAodW5pcXVlbWVudCBwb3VyIGxlcyBkb25uw6llcyBwdWJsaXF1ZXMgZGUgcHJvZmlsKTwvbGk+XG5cdFx0XHRcdFx0PC91bD5cblx0XHRcdFx0XHQ8L3A+XG5cdFx0XHRcdFx0PGgzPjYuNSBWb3MgZHJvaXRzPC9oMz5cblx0XHRcdFx0XHQ8cD5Db25mb3Jtw6ltZW50IGF1IFJHUEQsIHZvdXMgZGlzcG9zZXogZGVzIGRyb2l0cyBzdWl2YW50czpcblx0XHRcdFx0XHQ8dWw+XG5cdFx0XHRcdFx0XHQ8bGk+RHJvaXQgZCdhY2PDqHMgw6Agdm9zIGRvbm7DqWVzPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Ecm9pdCBkZSByZWN0aWZpY2F0aW9uPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Ecm9pdCDDoCBsJ2VmZmFjZW1lbnQgKFwiZHJvaXQgw6AgbCdvdWJsaVwiKTwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+RHJvaXQgw6AgbGEgbGltaXRhdGlvbiBkdSB0cmFpdGVtZW50PC9saT5cblx0XHRcdFx0XHRcdDxsaT5Ecm9pdCDDoCBsYSBwb3J0YWJpbGl0w6kgZGVzIGRvbm7DqWVzPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Ecm9pdCBkJ29wcG9zaXRpb248L2xpPlxuXHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0UG91ciBleGVyY2VyIGNlcyBkcm9pdHMsIGNvbnRhY3Rlei1ub3VzIMOgOiBvemFzYWhpbkBzdHVkZW50LjQybHlvbi5mclxuXHRcdFx0XHRcdDwvcD5cblx0XHRcdFx0XHQ8aDM+Ni42IE1lc3VyZXMgZGUgc8OpY3VyaXTDqTwvaDM+XG5cdFx0XHRcdFx0PHA+Tm91cyBtZXR0b25zIGVuIMWTdXZyZSBsZXMgbWVzdXJlcyB0ZWNobmlxdWVzIGV0IG9yZ2FuaXNhdGlvbm5lbGxlcyBzdWl2YW50ZXM6XG5cdFx0XHRcdFx0PHVsPlxuXHRcdFx0XHRcdFx0PGxpPkNoaWZmcmVtZW50IGRlcyBtb3RzIGRlIHBhc3NlIGV0IGRvbm7DqWVzIHNlbnNpYmxlczwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+QXV0aGVudGlmaWNhdGlvbiBzw6ljdXJpc8OpZSAoR29vZ2xlIFNpZ24tSW4pPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Eb3VibGUgYXV0aGVudGlmaWNhdGlvbiAoMkZBKTwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+U2Vzc2lvbnMgc8OpY3VyaXPDqWVzIGF2ZWMgZXhwaXJhdGlvbiAoSldUKTwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+UHJvdGVjdGlvbiBjb250cmUgbGVzIHZ1bG7DqXJhYmlsaXTDqXMgd2ViIGNvdXJhbnRlczwvbGk+XG5cdFx0XHRcdFx0PC91bD5cblx0XHRcdFx0XHQ8L3A+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjcuIE1vZGlmaWNhdGlvbiBkZXMgQ0dVPC9oMj5cblx0XHRcdFx0XHQ8cD5Ob3VzIG5vdXMgcsOpc2Vydm9ucyBsZSBkcm9pdCBkZSBtb2RpZmllciBjZXMgY29uZGl0aW9ucyDDoCB0b3V0IG1vbWVudC4gTGVzIHV0aWxpc2F0ZXVycyBzZXJvbnQgbm90aWZpw6lzIGRlcyBjaGFuZ2VtZW50cyBpbXBvcnRhbnRzLjwvcD5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQ8aDI+OC4gRHVyw6llIGV0IFLDqXNpbGlhdGlvbjwvaDI+XG5cdFx0XHRcdFx0PHA+TCdhY2PDqHMgw6Agbm90cmUgc2VydmljZSBwZXV0IMOqdHJlIHN1c3BlbmR1IG91IHLDqXNpbGnDqSBlbiBjYXMgZGUgbm9uLXJlc3BlY3QgZGVzIHByw6lzZW50ZXMgY29uZGl0aW9ucy48L3A+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjkuIFRyYW5zZmVydHMgZGUgZG9ubsOpZXM8L2gyPlxuXHRcdFx0XHRcdDxwPkF1Y3VuIHRyYW5zZmVydCBkZSBkb25uw6llcyBwZXJzb25uZWxsZXMgbidlc3QgZWZmZWN0dcOpIGVuIGRlaG9ycyBkZSBsJ1VuaW9uIEV1cm9ww6llbm5lLiBUb3V0ZXMgbGVzIGRvbm7DqWVzIHNvbnQgaMOpYmVyZ8OpZXMgc3VyIGRlcyBzZXJ2ZXVycyBzaXR1w6lzIGRhbnMgbCdVRS48L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwiY2d1LWJhY2stYnV0dG9uXCIgY2xhc3M9XCJjZ3UtYmFjay1idXR0b25cIj5SZXRvdXI8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXG5cdFx0PGRpdiBpZD1cInByaXZhY3ktcG9saWN5LW1vZGFsXCIgY2xhc3M9XCJjZ3UtbW9kYWxcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjZ3UtY29udGVudFwiPlxuXHRcdFx0XHQ8aDE+UG9saXRpcXVlIGRlIENvbmZpZGVudGlhbGl0w6k8L2gxPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2d1LXRleHRcIj5cblx0XHRcdFx0XHQ8aDI+MS4gSW50cm9kdWN0aW9uPC9oMj5cblx0XHRcdFx0XHQ8cD5CaWVudmVudWUgZGFucyBub3RyZSBQb2xpdGlxdWUgZGUgQ29uZmlkZW50aWFsaXTDqS4gRWxsZSBkw6ljcml0IGNvbW1lbnQgbm91cyBjb2xsZWN0b25zLCB1dGlsaXNvbnMgZXQgcHJvdMOpZ2VvbnMgdm9zIGRvbm7DqWVzIHBlcnNvbm5lbGxlcy48L3A+XG5cdFx0XHRcdFx0PHA+UmVzcG9uc2FibGUgZHUgdHJhaXRlbWVudDogw4lxdWlwZSBwcm9qZXQgVHJhbnNjZW5kYW5jZSAtIMOJY29sZSA0Mjxicj5cblx0XHRcdFx0XHRDb250YWN0OiBvemFzYWhpbkBzdHVkZW50LjQybHlvbi5mcjxicj5cblx0XHRcdFx0XHREw6lsw6lndcOpIMOgIGxhIFByb3RlY3Rpb24gZGVzIERvbm7DqWVzIChEUE8pOiBNLiBTQUhJTiBPLjwvcD5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQ8aDI+Mi4gRG9ubsOpZXMgY29sbGVjdMOpZXM8L2gyPlxuXHRcdFx0XHRcdDxwPk5vdXMgY29sbGVjdG9ucyBkZXMgZG9ubsOpZXMgdm91cyBjb25jZXJuYW50IGxvcnNxdWUgdm91cyB1dGlsaXNleiBub3RyZSBzZXJ2aWNlLCBub3RhbW1lbnQ6PC9wPlxuXHRcdFx0XHRcdDx1bD5cblx0XHRcdFx0XHRcdDxsaT5Eb25uw6llcyBkJ2lkZW50aWZpY2F0aW9uIChJRCBpbnRlcm5lLCB1c2VybmFtZSwgYXZhdGFyKTwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+RG9ubsOpZXMgZCdhdXRoZW50aWZpY2F0aW9uICh2aWEgR29vZ2xlIFNpZ24tSW4pPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Eb25uw6llcyBkZSBwcm9maWwgKHN0YXR1dCwgcHLDqWbDqXJlbmNlcyk8L2xpPlxuXHRcdFx0XHRcdFx0PGxpPkRvbm7DqWVzIGQndXRpbGlzYXRpb24gKGhpc3RvcmlxdWUgZGVzIHBhcnRpZXMsIHNjb3JlcywgY2xhc3NlbWVudCk8L2xpPlxuXHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjMuIFV0aWxpc2F0aW9uIGRlcyBkb25uw6llczwvaDI+XG5cdFx0XHRcdFx0PHA+Tm91cyB1dGlsaXNvbnMgdm9zIGRvbm7DqWVzIHBvdXI6PC9wPlxuXHRcdFx0XHRcdDx1bD5cblx0XHRcdFx0XHRcdDxsaT5Gb3VybmlyIGV0IGFtw6lsaW9yZXIgbm90cmUgc2VydmljZTwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+QWRtaW5pc3RyZXIgdm90cmUgY29tcHRlPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Wb3VzIHByb3Bvc2VyIGRlcyBmb25jdGlvbm5hbGl0w6lzIHNvY2lhbGVzIChhbWlzKTwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+RW5yZWdpc3RyZXIgdm9zIHN0YXRpc3RpcXVlcyBkZSBqZXUgZXQgY2xhc3NlbWVudHM8L2xpPlxuXHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjQuIFBhcnRhZ2UgZGVzIGRvbm7DqWVzPC9oMj5cblx0XHRcdFx0XHQ8cD5Ob3VzIG5lIHZlbmRvbnMgcGFzIHZvcyBkb25uw6llcyBwZXJzb25uZWxsZXMuIE5vdXMgcG91dm9ucyDDqnRyZSBhbWVuw6lzIMOgIHBhcnRhZ2VyIHZvcyBkb25uw6llcyBhdmVjOjwvcD5cblx0XHRcdFx0XHQ8dWw+XG5cdFx0XHRcdFx0XHQ8bGk+TWVtYnJlcyBkZSBsJ8OpcXVpcGUgcHJvamV0PC9saT5cblx0XHRcdFx0XHRcdDxsaT5Db3JwcyBlbnNlaWduYW50IGV0IMOpdmFsdWF0ZXVycyBkZSBsJ8OpY29sZSA0MjwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+QXV0cmVzIHV0aWxpc2F0ZXVycyAodW5pcXVlbWVudCBwb3VyIGxlcyBkb25uw6llcyBwdWJsaXF1ZXMgZGUgcHJvZmlsKTwvbGk+XG5cdFx0XHRcdFx0PC91bD5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQ8aDI+NS4gU8OpY3VyaXTDqSBkZXMgZG9ubsOpZXM8L2gyPlxuXHRcdFx0XHRcdDxwPk5vdXMgbWV0dG9ucyBlbiDFk3V2cmUgZGVzIG1lc3VyZXMgZGUgc8OpY3VyaXTDqSBwb3VyIHByb3TDqWdlciB2b3MgZG9ubsOpZXMgY29udHJlIHRvdXQgYWNjw6hzIG5vbiBhdXRvcmlzw6ksIGRpdnVsZ2F0aW9uLCBhbHTDqXJhdGlvbiBvdSBkZXN0cnVjdGlvbi48L3A+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjYuIFZvcyBkcm9pdHM8L2gyPlxuXHRcdFx0XHRcdDxwPkNvbmZvcm3DqW1lbnQgYXUgUkdQRCwgdm91cyBkaXNwb3NleiBkZXMgZHJvaXRzIHN1aXZhbnRzIGNvbmNlcm5hbnQgdm9zIGRvbm7DqWVzIHBlcnNvbm5lbGxlczo8L3A+XG5cdFx0XHRcdFx0PHVsPlxuXHRcdFx0XHRcdFx0PGxpPkRyb2l0IGQnYWNjw6hzPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Ecm9pdCBkZSByZWN0aWZpY2F0aW9uPC9saT5cblx0XHRcdFx0XHRcdDxsaT5Ecm9pdCDDoCBsJ2VmZmFjZW1lbnQ8L2xpPlxuXHRcdFx0XHRcdFx0PGxpPkRyb2l0IMOgIGxhIGxpbWl0YXRpb24gZHUgdHJhaXRlbWVudDwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+RHJvaXQgw6AgbGEgcG9ydGFiaWxpdMOpIGRlcyBkb25uw6llczwvbGk+XG5cdFx0XHRcdFx0XHQ8bGk+RHJvaXQgZCdvcHBvc2l0aW9uPC9saT5cblx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHRcdDxwPlBvdXIgZXhlcmNlciBjZXMgZHJvaXRzLCBjb250YWN0ZXotbm91cyDDoDogb3phc2FoaW5Ac3R1ZGVudC40Mmx5b24uZnI8L3A+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGgyPjcuIE1vZGlmaWNhdGlvbnMgZGUgbGEgUG9saXRpcXVlIGRlIENvbmZpZGVudGlhbGl0w6k8L2gyPlxuXHRcdFx0XHRcdDxwPk5vdXMgbm91cyByw6lzZXJ2b25zIGxlIGRyb2l0IGRlIG1vZGlmaWVyIGNldHRlIHBvbGl0aXF1ZSDDoCB0b3V0IG1vbWVudC4gTGVzIHV0aWxpc2F0ZXVycyBzZXJvbnQgbm90aWZpw6lzIGRlcyBjaGFuZ2VtZW50cyBpbXBvcnRhbnRzLjwvcD5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQ8aDI+OC4gQ29udGFjdDwvaDI+XG5cdFx0XHRcdFx0PHA+UG91ciB0b3V0ZSBxdWVzdGlvbiBjb25jZXJuYW50IGNldHRlIFBvbGl0aXF1ZSBkZSBDb25maWRlbnRpYWxpdMOpLCB2ZXVpbGxleiBub3VzIGNvbnRhY3RlciDDoDogb3phc2FoaW5Ac3R1ZGVudC40Mmx5b24uZnI8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwicHJpdmFjeS1wb2xpY3ktYmFjay1idXR0b25cIiBjbGFzcz1cImNndS1iYWNrLWJ1dHRvblwiPlJldG91cjwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cblx0XHQ8ZGl2IGNsYXNzPVwicGFuZWxfb3B0aW9uX25hdmJhclwiIGlkPVwicGFuZWxfb3B0aW9uX25hdmJhclwiPlxuXHRcdFx0PGJ1dHRvbiBjbGFzcz1cIm9wdGlvbi1pbi1wYW5lbFwiIGlkPVwib3B0aW9uX2J0bl9yZW1vdmVcIj5cblx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL21lbnUuc3ZnXCIgYWx0PVwibGVhdmVcIj5cblx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0PGRpdiBjbGFzcz1cImZyaWVuZF9saXN0X2NvbnRhaW5lclwiPlxuXHRcdFx0XHQ8aDE+RlJJRU5EUyBMSVNUPC9oMT5cblxuXHRcdFx0XHQ8IS0tIEJvdXRvbnMgZGUgbmF2aWdhdGlvbiAtLT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImZyaWVuZF90YWJzXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInRhYi1hY2NlcHRlZFwiIGNsYXNzPVwidGFiLWJ0biBhY3RpdmVcIj5GcmllbmQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwidGFiLXBlbmRpbmdcIiBjbGFzcz1cInRhYi1idG5cIj5PbiBob2xkPC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdDwhLS0gU2VjdGlvbnMgZCdhbWlzIC0tPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZnJpZW5kX3NlY3Rpb25zXCI+XG5cdFx0XHRcdFx0PGRpdiBpZD1cInNlY3Rpb24tYWNjZXB0ZWRcIiBjbGFzcz1cImZyaWVuZF9zZWN0aW9uXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlkPVwiZnJpZW5kcy1hY2NlcHRlZFwiIGNsYXNzPVwiZnJpZW5kX2xpc3Rfc2Nyb2xsYWJsZVwiPjwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJzZWN0aW9uLXBlbmRpbmdcIiBjbGFzcz1cImZyaWVuZF9zZWN0aW9uXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxuXHRcdFx0XHRcdFx0PGRpdiBpZD1cImZyaWVuZHMtcGVuZGluZ1wiIGNsYXNzPVwiZnJpZW5kX2xpc3Rfc2Nyb2xsYWJsZVwiPjwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8IS0tIEFqb3V0ZXIgdW4gYW1pIC0tPlxuXHRcdFx0XHQ8Zm9ybSBjbGFzcz1cImFkZF9mcmllbmRfc2VjdGlvblwiIG9uc3VibWl0PVwiYWRkRnJpZW5kKGV2ZW50KVwiPlxuXHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZnJpZW5kX25hbWVfaW5wdXRcIiBwbGFjZWhvbGRlcj1cIlVzZXJuYW1lLi4uXCIgLz5cblx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBpZD1cImFkZF9mcmllbmRfYnRuXCI+QWRkPC9idXR0b24+XG5cdFx0XHRcdDwvZm9ybT5cblx0XHRcdDwvZGl2PlxuXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiZ2FtZV9oaXN0b3J5X25hdkJhclwiIGlkPVwiZ2FtZV9oaXN0b3J5X25hdkJhclwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZ2FtZV9oaXN0b3J5X2NvbnRlbnRfbmF2QmFyXCI+XG5cdFx0XHRcdFx0PGgxPkdBTUUgSElTVE9SWTwvaDE+XG5cblx0XHRcdFx0XHQ8dGFibGUgY2xhc3M9XCJnYW1lX2hpc3Rvcnlfc2Nyb2xsYWJsZV9uYXZCYXJcIj5cblx0XHRcdFx0XHRcdDwhLS0gR2FtZSAxIC0tPlxuXHRcdFx0XHRcdFx0PHRib2R5IGlkPVwiZ2FtZXMtdGFibGVcIj48L3Rib2R5PlxuXHRcdFx0XHRcdDwvdGFibGU+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8YnV0dG9uIGNsYXNzPVwiZGVjb25leGlvbl9uYXZCYXJcIiBpZD1cImRlY29ubmVjdF9idG5fbmF2QmFyXCIgb25jbGljaz1cImxvZ291dCgpXCI+RGlzY29ubmVjdDwvYnV0dG9uPlxuXHRcdDwvZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJ2aWV3MVwiIGlkPVwidmlldzFcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3MS1jb250ZW50XCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJ2aWV3MV9idG5cIiBjbGFzcz1cImJ0blwiPkdBTUUgTU9ERTwvYnV0dG9uPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwic2V0dGluZ3NfYnRuXCIgY2xhc3M9XCJidG5cIj5TRVRUSU5HUzwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdFx0PGRpdiBjbGFzcz1cImJhY2staG9tZVwiIGlkPVwiYmFjay1ob21lXCI+XG5cdFx0XHQ8YnV0dG9uIGlkPVwiYnRuX2JhY2tfaG9tZVwiIGNsYXNzPVwiYnRuXCI+QkFDSzwvYnV0dG9uPlxuXHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBpZD1cImNvbnRhaW5lclwiIGNsYXNzPVwiY29udGFpbmVyX21lbnVcIj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cImJ0bl9qb3VlclwiPlxuXHRcdFx0XHRcdDxoMT5QTEFZPC9oMT5cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3MlwiIGlkPVwidmlldzJcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzItY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPkNIT09TRSBZT1VSIEdBTUUgTU9ERTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlkPVwiZ2FtZV9tb2RlX2J0blwiIGNsYXNzPVwiZ2FtZV9tb2RlX2J0blwiPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwic29sb1wiIGNsYXNzPVwiYnRuXCI+U09MTzwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwibXVsdGlwbGF5ZXJcIiBjbGFzcz1cImJ0blwiPk1VTFRJUExBWUVSPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDxhIGlkPVwidG91cm5hbWVudF92aWV3XCIgY2xhc3M9XCJidG5fdG91cm5hbWVudFwiIGhyZWY9XCIvdG91cm5hbWVudFwiIGRhdGEtbGluaz5UT1VSTkFNRU5UPC9hPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwicGxhdGZvcm1lcl92aWV3XCIgY2xhc3M9XCJidG5cIj5QTEFURk9STUVSPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3M1wiIGlkPVwidmlldzNcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzMtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPlNPTE8gR0FNRSBNT0RFPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgaWQ9XCJnYW1lX21vZGVfYnRuXCIgY2xhc3M9XCJnYW1lX21vZGVfYnRuXCI+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJwcmVwYXJfZ2FtZV8xdjFcIiBjbGFzcz1cImJ0blwiPjF2MTwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXczXCIgY2xhc3M9XCJidG5cIj5CQUNLIFRPIE1FTlU8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3NFwiIGlkPVwidmlldzRcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzQtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPk1VTFRJUExBWUVSIEdBTUUgTU9ERTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlkPVwiZ2FtZV9tb2RlX2J0blwiIGNsYXNzPVwiZ2FtZV9tb2RlX2J0blwiPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwicHJlcGFyX2dhbWVfbXVsdGlcIiBjbGFzcz1cImJ0blwiPjJ2MjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXc0XCIgY2xhc3M9XCJidG5cIj5CQUNLIFRPIE1FTlU8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3NVwiIGlkPVwidmlldzVcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzUtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPlNFVFRJTkdTPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgaWQ9XCJzZWxlY3RfcGFyYW1ldHJlc1wiIGNsYXNzPVwic2VsZWN0X3BhcmFtZXRyZXNcIj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInByb2ZpbGVfcGFycmFtZXRyZV9idG5cIiBjbGFzcz1cImJ0blwiPlBST0ZJTEU8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInBhcnJhbWV0cmVfamV1eF9idG5cIiBjbGFzcz1cImJ0blwiPkdBTUU8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cIkdhbWVfSGlzdG9yeV9idG5cIiBjbGFzcz1cImJ0blwiIG9uY2xpY2s9XCJmZXRjaF91c2VyX2dhbWVzX2JpZygnJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnUGxheWVyMScpfScpXCI+R0FNRSBISVNUT1JZPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBhcmFtZXRyZXNfamV1XCIgaWQ9XCJwYXJhbWV0cmVzX2pldVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwYXJhbWV0cmVzX2pldV9jb250ZW50XCIgaWQ9XCJwYXJhbWV0cmVfamV1eF9jb250ZW50XCI+XG5cdFx0XHRcdFx0XHQ8aDE+R0FNRSBTRVRUSU5HUzwvaDE+XG5cdFx0XHRcdFx0XHQ8aDI+UE9ORzwvaDI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFyYW1ldHJlX21vZGVfamV1XCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RlX2RlX2pldV9zb2xvX3BhcmFtZXRyZVwiPlxuXHRcdFx0XHRcdFx0XHQ8aDM+U29sbyBHYW1lIE1vZGU8L2gzPlxuXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJqb3VldXJfdG91Y2hcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiam91ZXVyXCIgaWQ9XCJqb3VldXIxXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD5QbGF5ZXIgMTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250cm9sc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Nb3ZlbWVudDogVyAvIFM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVA6IFogLyBYIC8gQzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJqb3VldXJcIiBpZD1cImpvdWV1cjJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPlBsYXllciAyPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRyb2xzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxwPk1vdmVtZW50OiDirIYgLyDirIc8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVA6IDEgLyAyIC8gMzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kZV9kZV9qZXVfbXVsdGlfcGFyYW1ldHJlXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGgzPk11bHRpcGxheWVyIEdhbWUgTW9kZTwvaDM+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImpvdWV1cl90b3VjaFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImpvdWV1clwiIGlkPVwiam91ZXVyMVwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5QbGF5ZXIgMTwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRyb2xzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+TW92ZW1lbnQ6IFcgLyBTPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVA6IFogLyBYIC8gQzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJqb3VldXJcIiBpZD1cImpvdWV1cjJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UGxheWVyIDI8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250cm9sc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwPk1vdmVtZW50OiBFIC8gRDwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Qb3dlclVQOiBaIC8gWCAvIEM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiam91ZXVyXCIgaWQ9XCJqb3VldXIzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxwPlBsYXllciAzPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udHJvbHNcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Nb3ZlbWVudDogTyAvIEw8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+UG93ZXJVUDogMSAvIDIgLyAzPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImpvdWV1clwiIGlkPVwiam91ZXVyNFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5QbGF5ZXIgNDwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRyb2xzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PHA+TW92ZW1lbnQ6IOKshiAvIOKshzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cD5Qb3dlclVQOiAxIC8gMiAvIDM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHQgIDwvZGl2PlxuXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwYXJyYW1ldHJlc19wcm9maWxlXCIgaWQ9XCJwYXJhbWV0cmVzX3Byb2ZpbGVcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFyYW1ldHJlc19wcm9maWxlX2NvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMT5QUk9GSUxFIFNFVFRJTkdTPC9oMT5cblx0XHRcdFx0XHRcdDxmb3JtIGlkPVwibW9kaWZfcHJvZmlsXCIgY2xhc3M9XCJtb2RpZl9wcm9maWxlXCIgb25zdWJtaXQ9XCJhY2Nlc3NQcm9maWxlSW5mbyhldmVudClcIj5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cIm1kcFwiPlBhc3N3b3JkPC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuX3ZhbGlkZXJfbWRwXCI+VmFsaWRlcjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInByb2ZpbGVfcGFyYW1fdW5sb2NrZWRcIiBpZD1cInByb2ZpbGVfcGFyYW1fdW5sb2NrZWRfaWRcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBob3RvX3Byb2ZpbGVcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZmlsZV9waG90b19jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9maWxlX3Bob3RvX2NpcmNsZVwiIGlkPVwicHJvZmlsZV9waG90b19jaXJjbGVcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDxmb3JtIGlkPVwidXBsb2FkRm9ybVwiIGVuY3R5cGU9XCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgb25zdWJtaXQ9XCJjaGFuZ2VQcm9maWxlUGljdHVyZShldmVudClcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJmaWxlXCIgbmFtZT1cImltYWdlXCIgaWQ9XCJwcm9maWxlX3Bob3RvX2lucHV0XCIgYWNjZXB0PVwiaW1hZ2UvKlwiIC8+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9XCJkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZmlsZV9waG90b19pbnB1dCcpLmNsaWNrKClcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRDaG9vc2UgRmlsZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBpZD1cImZpbGVOYW1lXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlVwbG9hZDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGZvcm0gaWQ9XCJ1cGRhdGVQcm9maWxlRm9ybVwiIG9uc3VibWl0PVwidXBkYXRlUHJvZmlsZUluZm8oZXZlbnQpXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0X2NvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInVzZXJuYW1lXCI+Q2hhbmdlIHVzZXJuYW1lPC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiY2hhbmdlX3VzZXJuYW1lXCIgbmFtZT1cInVzZXJuYW1lXCI+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0X2NvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInBhc3N3b3JkXCI+Q2hhbmdlIHBhc3N3b3JkPC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cImNoYW5nZV9wYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiKioqKioqXCI+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0X2NvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cImNvbmZpcm1fcGFzc3dvcmRcIj5Db25maXJtIG5ldyBwYXNzd29yZDwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJjb25maXJtX2NoYW5nZV9wYXNzd29yZFwiIG5hbWU9XCJjb25maXJtX3Bhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCIqKioqKipcIj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGlkPVwiZmFfc2VsZWN0b3JcIiBjbGFzcz1cImZhX3NlbGVjdG9yXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD4yRkEgOjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cImFjdGl2ZV9mYVwiIGNsYXNzPVwiYWN0aXZlX2ZhXCIgb25jaGFuZ2U9XCJ0aGlzLmNoZWNrZWQgPyB1cGRhdGVfZG91YmxlQXV0aCgpIDogdXBkYXRlX2RvdWJsZUF1dGgoKVwiIC8+PC9wPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGlkPVwidmFsaWRfcHJvZmlsZV9pbmZvXCIgY2xhc3M9XCJ2YWxpZF9wcm9maWxlX2luZm9fYnRuXCI+VmFsaWRlcjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJidG5fZGVjb25uZWN0XCI+XG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImRlY29ubmVjdF9idG5cIiBjbGFzcz1cImJ0bl9kZWNvbm5lY3RfYnRuXCIgb25jbGljaz1cImxvZ291dCgpXCI+RGVjb25uZXhpb248L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJidG5fZGVsZXRlXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImRlbGV0ZV9idG5cIiBjbGFzcz1cImJ0bl9kZWxldGVfYnRuXCIgb25jbGljaz1cImRlbGV0ZV9hY2NvdW50KClcIj5EZWxldGUgYWNjb3VudDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImV4cG9ydF9idG5cIj5cblx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiZXhwb3J0X2J0blwiIGNsYXNzPVwiYnRuX2V4cG9ydF9idG5cIiBvbmNsaWNrPVwiZXhwb3J0X2RhdGEoKVwiPkV4cG9ydCBkYXRhPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYW5vbnltaXplX2J0blwiPlxuXHRcdFx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJhbm9ueW1pemVfYnRuXCIgY2xhc3M9XCJidG5fYW5vbnltaXplX2J0blwiIG9uY2xpY2s9XCJhbm9ueW1pemVfdXNlcigpXCI+QW5vbnltaXplIG1lPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2d1LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYWNjZXB0LWNndVwiPjxhIGhyZWY9XCIjXCIgaWQ9XCJzaG93LWNndVwiIGNsYXNzPVwiY2d1LWxpbmtcIj5Db25kaXRpb25zIEfDqW7DqXJhbGVzIGQnVXRpbGlzYXRpb248L2E+PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJpdmFjeS1wb2xpY3ktY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJhY2NlcHQtcHJpdmFjeS1wb2xpY3lcIj48YSBocmVmPVwiI1wiIGlkPVwic2hvdy1wcml2YWN5LXBvbGljeVwiIGNsYXNzPVwiY2d1LWxpbmtcIj5Qb2xpdGlxdWUgZGUgQ29uZmlkZW50aWFsaXTDqTwvYT48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2hvb3NlX3lvdXJfb3Bwb25lbnRfMXYxXCIgaWQ9XCJjaG9vc2VfeW91cl9vcHBvbmVudF8xdjFfaWRcIj5cblx0XHRcdFx0XHQ8Zm9ybSBjbGFzcz1cImNob29zZV95b3VyX29wcG9uZW50XzF2MV9jb250ZW50XCIgaWQ9XCJjaG9vc2VfeW91cl9vcHBvbmVudF8xdjFfZm9ybVwiIG9uc3VibWl0PVwibG9naW5fMXYxKGV2ZW50KVwiPlxuXHRcdFx0XHRcdFx0PGgxPkNPTk5FQ1QgWU9VUiBPUFBPTkVOVDwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyLXNlY3Rpb25cIj5cblx0XHRcdFx0XHRcdFx0PHA+UExBWUVSIDI8L3A+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwidXNlcm5hbWUyXCI+VXNlcm5hbWUgOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCIxdjEtdXNlcm5hbWUyXCIgbmFtZT1cInVzZXJuYW1lMlwiIHBsYWNlaG9sZGVyPVwiUGxheWVyIDIgdXNlcm5hbWVcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGFzc3dvcmQyXCI+UGFzc3dvcmQgOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwiMXYxLXBhc3N3b3JkMlwiIG5hbWU9XCJwYXNzd29yZDJcIiBwbGFjZWhvbGRlcj1cIlBsYXllciAyIHBhc3N3b3JkXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInZhbGlkZXJfb3Bwb25lbnRfYnRuXzF2MVwiIGlkPVwidmFsaWRhdGUtb3Bwb25lbnQtbG9naW5cIj5WYWxpZGVyPC9idXR0b24+XG5cdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2hvb3NlX3lvdXJfb3Bwb25lbnRfcGxhdGZvcm1lclwiIGlkPVwiY2hvb3NlX3lvdXJfb3Bwb25lbnRfcGxhdGZvcm1lcl9pZFwiPlxuXHRcdFx0XHRcdDxmb3JtIGNsYXNzPVwiY2hvb3NlX3lvdXJfb3Bwb25lbnRfcGxhdGZvcm1lcl9jb250ZW50XCIgaWQ9XCJjaG9vc2VfeW91cl9vcHBvbmVudF9wbGF0Zm9ybWVyX2Zvcm1cIiBvbnN1Ym1pdD1cImxvZ2luX3BsYXRmb3JtZXIoZXZlbnQpXCI+XG5cdFx0XHRcdFx0XHQ8aDE+Q09OTkVDVCBZT1VSIE9QUE9ORU5UPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXItc2VjdGlvblwiPlxuXHRcdFx0XHRcdFx0XHQ8cD5QTEFZRVIgMjwvcD5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJ1c2VybmFtZTJcIj5Vc2VybmFtZSA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInBsYXRmb3JtZXItdXNlcm5hbWUyXCIgbmFtZT1cInVzZXJuYW1lMlwiIHBsYWNlaG9sZGVyPVwiUGxheWVyIDIgdXNlcm5hbWVcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGFzc3dvcmQyXCI+UGFzc3dvcmQgOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwicGxhdGZvcm1lci1wYXNzd29yZDJcIiBuYW1lPVwicGFzc3dvcmQyXCIgcGxhY2Vob2xkZXI9XCJQbGF5ZXIgMiBwYXNzd29yZFwiIHJlcXVpcmVkPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJ2YWxpZGVyX29wcG9uZW50X2J0bl9wbGF0Zm9ybWVyXCIgaWQ9XCJ2YWxpZGF0ZS1vcHBvbmVudC1wbGF0Zm9ybWVyLWxvZ2luXCI+VmFsaWRhdGU8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDxhIHN0eWxlPVwiZGlzcGxheTpub25lXCIgY2xhc3M9XCJ2YWxpZGVyX29wcG9uZW50X2J0bl9wbGF0Zm9ybWVyXCIgaHJlZj1cIi9QbGF0Zm9ybVZpZXdcIiBpZD1cInN0YXJ0LXBsYXRmb3JtZXJcIiBkYXRhLWxpbms+U3RhcnQ8L2E+XG5cdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHQ8L2Rpdj5cblxuXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjaG9vc2VfeW91cl9vcHBvbmVudF9tdWx0aVwiIGlkPVwiY2hvb3NlX3lvdXJfb3Bwb25lbnRfbXVsdGlfaWRcIj5cblx0XHRcdFx0XHQ8Zm9ybSBjbGFzcz1cImNob29zZV95b3VyX29wcG9uZW50X211bHRpX2NvbnRlbnRcIiBpZD1cImNob29zZV95b3VyX29wcG9uZW50X211bHRpX2Zvcm1cIiBvbmNsaWNrPVwibG9naW5fMnYyKGV2ZW50KVwiPlxuXHRcdFx0XHRcdFx0PGgxPkNPTk5FQ1QgWU9VUiBPUFBPTkVOVFM8L2gxPlxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyLXNlY3Rpb25cIj5cblx0XHRcdFx0XHRcdDxwPlBMQVlFUiAyPC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwidXNlcm5hbWUyXCI+VXNlcm5hbWUgOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiMnYyLXVzZXJuYW1lMlwiIG5hbWU9XCJ1c2VybmFtZTJcIiBwbGFjZWhvbGRlcj1cIlBsYXllciAyIHVzZXJuYW1lXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInBhc3N3b3JkMlwiPlBhc3N3b3JkIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCIydjItcGFzc3dvcmQyXCIgbmFtZT1cInBhc3N3b3JkMlwiIHBsYWNlaG9sZGVyPVwiUGxheWVyIDIgcGFzc3dvcmRcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXItc2VjdGlvblwiPlxuXHRcdFx0XHRcdFx0PHA+UExBWUVSIDM8L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJ1c2VybmFtZTNcIj5Vc2VybmFtZSA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCIydjItdXNlcm5hbWUzXCIgbmFtZT1cInVzZXJuYW1lM1wiIHBsYWNlaG9sZGVyPVwiUGxheWVyIDMgdXNlcm5hbWVcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGFzc3dvcmQzXCI+UGFzc3dvcmQgOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cIjJ2Mi1wYXNzd29yZDNcIiBuYW1lPVwicGFzc3dvcmQzXCIgcGxhY2Vob2xkZXI9XCJQbGF5ZXIgMyBwYXNzd29yZFwiIHJlcXVpcmVkPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllci1zZWN0aW9uXCI+XG5cdFx0XHRcdFx0XHQ8cD5QTEFZRVIgNDwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInVzZXJuYW1lNFwiPlVzZXJuYW1lIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cIjJ2Mi11c2VybmFtZTRcIiBuYW1lPVwidXNlcm5hbWU0XCIgcGxhY2Vob2xkZXI9XCJQbGF5ZXIgNCB1c2VybmFtZVwiIHJlcXVpcmVkPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwYXNzd29yZDRcIj5QYXNzd29yZCA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwiMnYyLXBhc3N3b3JkNFwiIG5hbWU9XCJwYXNzd29yZDRcIiBwbGFjZWhvbGRlcj1cIlBsYXllciA0IHBhc3N3b3JkXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInZhbGlkZXJfb3Bwb25lbnRfYnRuXCIgaWQ9XCJ2YWxpZGF0ZV9tdWx0aV9vcHBvbmVudFwiPlZhbGlkZXI8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHRcdDwvZGl2PlxuXG5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzZcIiBpZD1cInZpZXc2XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXc2LWNvbnRlbnRcIj5cblx0XHRcdFx0XHRcdDxoMSBpZD1cImN1c3RvbV90YV9nYW1lXCI+Q1VTVE9NSVpFIFlPVVIgR0FNRTwvaDE+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUFwiPlxuXHRcdFx0XHRcdFx0XHQ8cD5Qb3dlclVQOiA8c3BhbiBpZD1cInBvd2VyX3VwX2luZm9faWRcIiBjbGFzcz1cInBvd2VyX3VwX2luZm9cIj48L3NwYW4+PHNwYW4gaWQ9XCJwb3dlclVQXCIgY2xhc3M9XCJhY3RpdmVfcG93ZXJVUFwiPjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0XHRcdDxkaXYgaWQ9XCJwb3dlcl9zZWxlY3RvclwiIGNsYXNzPVwicG93ZXJfc2VsZWN0b3JcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPjE8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzFcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+MzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfM1wiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD41PC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF81XCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJza2luXCIgaWQ9XCJza2luXCI+XG5cdFx0XHRcdFx0XHRcdDxwPkN1c3RvbSBTa2luOiA8c3BhbiBpZD1cInNraW5fcGVyc29cIiBjbGFzcz1cInNraW5fcGVyc29cIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YSBpZD1cInNvbG9fMXYxX2J0blwiIGNsYXNzPVwiYnRuXCIgaHJlZj1cIi9zb2xvX2dhbWVfMXYxXCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5TdGFydCBHYW1lPC9hPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3OFwiIGlkPVwidmlldzhcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzgtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxIGlkPVwiY3VzdG9tX3RhX2dhbWVfbXVsdGlcIj5DVVNUT01JWkUgWU9VUiBNVUxUSVBMQVlFUiBHQU1FPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQXCI+XG5cdFx0XHRcdFx0XHRcdDxwPlBvd2VyVVA6IDxzcGFuIGlkPVwicG93ZXJfdXBfaW5mb19pZF9tdWx0aVwiIGNsYXNzPVwicG93ZXJfdXBfaW5mb1wiPjwvc3Bhbj48c3BhbiBpZD1cInBvd2VyVVBfbXVsdGlcIiBjbGFzcz1cImFjdGl2ZV9wb3dlclVQXCI+PC9zcGFuPjwvcD5cblx0XHRcdFx0XHRcdFx0PGRpdiBpZD1cInBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGlcIiBjbGFzcz1cInBvd2VyX3NlbGVjdG9yXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD4xPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGlcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+MzwvcD5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfM19nYW1lX211bHRpXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPjU8L3A+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2tpblwiIGlkPVwic2tpbl9tdWx0aVwiPlxuXHRcdFx0XHRcdFx0XHQ8cD5DdXN0b20gU2tpbjogPHNwYW4gaWQ9XCJza2luX3BlcnNvX2dhbWVfbXVsdGlcIiBjbGFzcz1cInNraW5fcGVyc29cIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YSBpZD1cIm11bHRpcGxheWVyX2J0blwiIGNsYXNzPVwiYnRuXCIgaHJlZj1cIi9tdWx0aV9wbGF5ZXJfZ2FtZVwiIGNsYXNzPVwibmF2LWxpbmtcIiBkYXRhLWxpbms+U3RhcnQgR2FtZTwvYT5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblxuXHRcdFx0PGZvcm0gaWQ9XCJjb2RlX3ZhbGlkYXRpb25faWRcIiBjbGFzcz1cImNvZGVfdmFsaWRhdGlvbiBoaWRkZW5cIiBvbnN1Ym1pdD1cImFjdGl2YXRlMkZBKGV2ZW50KVwiPlxuXHRcdFx0XHQ8aW1nIGlkPVwicXJDb2RlXCIgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90aW1lci1yZXNldC5zdmdcIiBzdHlsZT1cIndpZHRoOmF1dG9cIiBhbHQ9XCJkZWxheVwiPlxuXHRcdFx0XHQ8bGFiZWwgZm9yPVwiY29kZVwiPmNvZGU8L2xhYmVsPlxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cImNvZGVcIiBpZD1cImFjdGl2YXRlLTJmYS1jb2RlXCIgbmFtZT1cImNvZGVcIiBwbGFjZWhvbGRlcj1cImNvZGVcIiByZXF1aXJlZD5cblx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG5fdmFsaWRlcl9xcl9jb2RlXCI+VmFsaWRhdGU8L2J1dHRvbj5cblx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjYW5jZWxfZmFcIiBpZD1cImNhbmNlbF9mYVwiPlg8L2J1dHRvbj5cblx0XHRcdDwvZm9ybT5cblxuXHRcdFx0PGRpdiBjbGFzcz1cImdhbWVfaGlzdG9yeVwiIGlkPVwiZ2FtZV9oaXN0b3J5XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJnYW1lX2hpc3RvcnlfY29udGVudFwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJnYW1lX2hpc3RvcnlfaGVhZGVyXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZmlsZV9waG90b19jaXJjbGVfR2FtZV9IaXN0b3J5XCIgaWQ9XCJwcm9maWxlX3Bob3RvX2NpcmNsZV9HYW1lX0hpc3RvcnlcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDxoMSBpZD1cImdhbWVfaGlzdG9yeV91c2VybmFtZVwiPjwvaDE+XG5cdFx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZ2FtZV9zdGF0aXN0aWNzX2hpc3RvcnlcIj5cblx0XHRcdFx0XHRcdDxoMT5HQU1FIFNUQVRJU1RJQ1M8L2gxPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJnYW1lX3N0YXRpc3RpY3NfY29udGVudF9oaXN0b3J5XCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZ2FtZV9zdGF0aXN0aWNzX2luZm9fZ3JvdXBcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImdhbWVfc3RhdGlzdGljc19pbmZvX2Jsb2NrXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHA+R2FtZXMgV29uIDogPHNwYW4gaWQ9XCJnYW1lc193b25faGlzdG9yeVwiIGNsYXNzPVwiZ2FtZXNfd29uX2hpc3RvcnkgdGV4dC1zaGFkb3ctZ3JlZW5cIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxwPkdhbWVzIExvc3QgOiA8c3BhbiBpZD1cImdhbWVzX2xvc3RfaGlzdG9yeVwiIGNsYXNzPVwiZ2FtZXNfbG9zdF9oaXN0b3J5IHRleHQtc2hhZG93LXJlZFwiPjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZ2FtZV9zdGF0aXN0aWNzX2luZm9fYmxvY2tcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD5HYW1lcyBQbGF5ZWQgOiA8c3BhbiBpZD1cImdhbWVzX3BsYXllZF9oaXN0b3J5XCIgY2xhc3M9XCJnYW1lc19sb3N0X2hpc3RvcnlcIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxwPldpbiBSYXRlIDogPHNwYW4gaWQ9XCJ3aW5fcmF0ZV9oaXN0b3J5XCIgY2xhc3M9XCJ3aW5fcmF0ZV9oaXN0b3J5IHRleHQtc2hhZG93LW9yYW5nZVwiPjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZ2FtZV9oaXN0b3J5X2luZm9cIj5cblx0XHRcdFx0XHRcdDxoMT5HQU1FIEhJU1RPUlk8L2gxPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdDx0YWJsZSBjbGFzcz1cImdhbWVfaGlzdG9yeV9zY3JvbGxhYmxlXCI+XG5cdFx0XHRcdFx0XHQ8IS0tIEdhbWUgMSAtLT5cblx0XHRcdFx0XHRcdDx0Ym9keSBpZD1cImdhbWVzLXRhYmxlLWJpZ1wiPlxuXHRcdFx0XHRcdFx0PC90Ym9keT5cblx0XHRcdFx0XHQ8L3RhYmxlPlxuXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImV4aXRfZ2FtZV9oaXN0b3J5XCIgaWQ9XCJleGl0X2dhbWVfaGlzdG9yeVwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImV4aXRfZ2FtZV9oaXN0b3J5X2J0blwiIGNsYXNzPVwiZXhpdF9nYW1lX2hpc3RvcnlfYnRuXCI+XG5cdFx0XHRcdFx0XHRcdFhcblx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXG5cblx0XHRcdDxkaXYgY2xhc3M9XCJiYWNrXCIgaWQ9XCJiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2XCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJiYWNrX3RvX21lbnVfdmlldzZcIiBjbGFzcz1cImJ0bl9iYWNrXCI+QkFDSzwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiYmFja1wiIGlkPVwiYmFja190b19zZWxlY3RfbW9kZV9wbGF0Zm9ybWVyXCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJiYWNrX3RvX3NlbGVjdF9tb2RlX3BsYXRmb3JtZXJcIiBjbGFzcz1cImJ0bl9iYWNrXCI+QkFDSzwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiYmFja1wiIGlkPVwiYmFja190b19zZWxlY3RfbW9kZV92aWV3N1wiPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXc3XCIgY2xhc3M9XCJidG5fYmFja1wiPkJBQ0s8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cImJhY2tcIiBpZD1cImJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzhcIj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3OFwiIGNsYXNzPVwiYnRuX2JhY2tcIj5CQUNLPC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjaG9vc2VfeW91cl9za2luXCIgaWQ9XCJjaG9vc2VfeW91cl9za2luXCI+XG5cdFx0XHRcdDxoMT5DVVNUT01JWkUgWU9VUiBTS0lOPC9oMT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcjFcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fbGVmdFwiIGlkPVwic3dpdGNoX3Nrbl9sZWZ0X2lkMVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9yaWdodFwiIGlkPVwic3dpdGNoX3Nrbl9yaWdodF9pZDFcIj48L2J1dHRvbj5cblx0XHRcdFx0XHQ8cCBpZD1cIjF2MS1vcG9uZW50LXVzZXJuYW1lMVwiPiR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1BsYXllcjEnKX08L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyMlwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9sZWZ0XCIgaWQ9XCJzd2l0Y2hfc2tuX2xlZnRfaWQyXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX3JpZ2h0XCIgaWQ9XCJzd2l0Y2hfc2tuX3JpZ2h0X2lkMlwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxwIGlkPVwiMXYxLW9wb25lbnQtdXNlcm5hbWUyXCI+JHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnUGxheWVyMicpfTwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJ2YWxpZGVfdG9uX3NraW5cIiBjbGFzcz1cImJ0blwiPkNvbmZpcm08L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpXCIgaWQ9XCJjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGlcIj5cblx0XHRcdFx0PGgxPkNVU1RPTUlaRSBZT1VSIFNLSU48L2gxPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyMV9nYW1lX211bHRpXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX2xlZnRcIiBpZD1cInN3aXRjaF9za25fbGVmdF9pZDFfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9yaWdodFwiIGlkPVwic3dpdGNoX3Nrbl9yaWdodF9pZDFfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxwIGlkPVwiMnYyLW9wb25lbnQtdXNlcm5hbWUxXCI+JHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnUGxheWVyMScpfTwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwbGF5ZXIyX2dhbWVfbXVsdGlcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fbGVmdFwiIGlkPVwic3dpdGNoX3Nrbl9sZWZ0X2lkMl9nYW1lX211bHRpXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX3JpZ2h0XCIgaWQ9XCJzd2l0Y2hfc2tuX3JpZ2h0X2lkMl9nYW1lX211bHRpXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PHAgaWQ9XCIydjItb3BvbmVudC11c2VybmFtZTJcIj4ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKCdQbGF5ZXIyJyl9PC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYXllcjNfZ2FtZV9tdWx0aVwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9sZWZ0XCIgaWQ9XCJzd2l0Y2hfc2tuX2xlZnRfaWQzX2dhbWVfbXVsdGlcIj48L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwic3dpdGNoX3NraW5fcmlnaHRcIiBpZD1cInN3aXRjaF9za25fcmlnaHRfaWQzX2dhbWVfbXVsdGlcIj48L2J1dHRvbj5cblx0XHRcdFx0XHQ8cCBpZD1cIjJ2Mi1vcG9uZW50LXVzZXJuYW1lM1wiPiR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1BsYXllcjMnKX08L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGxheWVyNF9nYW1lX211bHRpXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInN3aXRjaF9za2luX2xlZnRcIiBpZD1cInN3aXRjaF9za25fbGVmdF9pZDRfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJzd2l0Y2hfc2tpbl9yaWdodFwiIGlkPVwic3dpdGNoX3Nrbl9yaWdodF9pZDRfZ2FtZV9tdWx0aVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDxwIGlkPVwiMnYyLW9wb25lbnQtdXNlcm5hbWU0XCI+JHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnUGxheWVyNCcpfTwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJ2YWxpZGVfdG9uX3NraW5fZ2FtZV9tdWx0aVwiIGNsYXNzPVwiYnRuXCI+Q29uZmlybTwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGlkPVwiY29udGFpbmVyX2luZm9fcG93ZXJfdXBcIiBjbGFzcz1cImNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGV4dF9wb3dlclVQXCI+XG5cdFx0XHRcdDxoMT5Qb3dlci1VUDwvaDE+XG5cdFx0XHRcdDxwIGNsYXNzPVwiZXhwbGljYXRpb25fZ2VuZXJhbFwiPlRoZSBQb3dlci1VcCBpcyBhIGJvbnVzIHRoYXQgZ2l2ZXMgeW91IGFuIGFkdmFudGFnZSBvdmVyIHlvdXIgb3Bwb25lbnQuIEJ5IGVuYWJsaW5nIHRoaXMgb3B0aW9uLCB5b3Ugd2lsbCBzdGFydCB0aGUgbWF0Y2ggd2l0aCBhdCBsZWFzdCBvbmUgUG93ZXItVXAgb2YgZWFjaCB0eXBlLiBZb3UgY2FuIGFsc28gY3VzdG9taXplIHRoaXMgYW1vdW50IGFuZCBzdGFydCB3aXRoIHRocmVlIG9yIGZpdmUgb2YgZWFjaC48L3A+XG5cdFx0XHRcdDxwIGNsYXNzPVwiZXhwbGljYXRpb25fcG93ZXJVUF9ncmVuYWRlXCI+VGhlIEZsYXNoIEdyZW5hZGUgUG93ZXItVXAgYWxsb3dzIHlvdSB0byB0aHJvdyBhIGdyZW5hZGUgdGhhdCB3aWxsIGJsaW5kIHlvdXIgb3Bwb25lbnQuIEJ1dCBiZSBjYXJlZnVsISBJdCB3b3JrcyBpbiBhIHNpbXBsZSB3YXk6IGl0IGNvbXBsZXRlbHkgZGFya2VucyB0aGUgZ2FtZSBzY3JlZW4sIG1lYW5pbmcgZXZlbiB0aGUgb25lIHdobyB0aHJvd3MgaXQgZ2V0cyBibGluZGVkLjwvcD5cblx0XHRcdFx0PHAgY2xhc3M9XCJleHBsaWNhdGlvbl9wb3dlclVQX3RlYW1tYXRlXCI+VGhlIFRlYW1tYXRlIFBvd2VyLVVwIGxldHMgeW91IGNhbGwgaW4gYSBuZXcgcGxheWVyIHRvIGpvaW4gdGhlIGdhbWUgZm9yIGEgc2hvcnQgdGltZS4gWW91IGNhbiBtb3ZlIHRoZW0gdXNpbmcgRS9EIGZvciBwbGF5ZXIgMSBhbmQgTy9MIGZvciBwbGF5ZXIgMi48L3A+XG5cdFx0XHRcdDxwIGNsYXNzPVwiZXhwbGljYXRpb25fcG93ZXJVUF9pbnZlcnNlXCI+VGhlIFJldmVyc2UgUG93ZXItVXAgbGV0cyB5b3UgaW52ZXJ0IHlvdXIgb3Bwb25lbnTigJlzIGNvbnRyb2xzIGZvciBhIHNob3J0IGR1cmF0aW9uLjwvcD5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImRlbGF5X3Bvd2VyVVBfMVwiPlxuXHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90aW1lci1yZXNldC5zdmdcIiBhbHQ9XCJkZWxheVwiPlxuXHRcdFx0XHRcdDxwPkNPT0xET1dOIFRJTUU6IDEwczwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJkZWxheV9wb3dlclVQXzJcIj5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdGltZXItcmVzZXQuc3ZnXCIgYWx0PVwiZGVsYXlcIj5cblx0XHRcdFx0XHQ8cD5DT09MRE9XTiBUSU1FOiAxNXM8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZGVsYXlfcG93ZXJVUF8zXCI+XG5cdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RpbWVyLXJlc2V0LnN2Z1wiIGFsdD1cImRlbGF5XCI+XG5cdFx0XHRcdFx0PHA+Q09PTERPV04gVElNRTogMTBzPC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lcl9pbWFnZV9wb3dlclVQXCI+XG5cdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9ncmVuYWRlX25vX2JnLnBuZ1wiIGFsdD1cImdyZW5hZGVcIiBjbGFzcz1cImdyZW5hZGVcIj5cblx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RlYW1tYXRlX25vX2JnLnBuZ1wiIGFsdD1cInRlYW1tYXRlXCIgY2xhc3M9XCJ0ZWFtbWF0ZVwiPlxuXHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvcmV2ZXJzZV9ub19iZy5wbmdcIiBhbHQ9XCJpbnZlcnNlX3BsYXllclwiIGNsYXNzPVwiaW52ZXJzZV9wbGF5ZXJcIj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBpZD1cImV4aXRfcG93ZXJVUF9pbmZvXCIgY2xhc3M9XCJleGl0X3Bvd2VyVVBfaW5mb1wiPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwiZXhpdF9wb3dlclVQX2luZm9fYnRuXCIgY2xhc3M9XCJidG5cIj5cblx0XHRcdFx0XHRYXG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cblx0XHQ8ZGl2IGlkPVwiY29udGFpbmVyX2luZm9fcG93ZXJfdXBfbXVsdGlcIiBjbGFzcz1cImNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGV4dF9wb3dlclVQXCI+XG5cdFx0XHRcdDxoMT5Qb3dlci1VUDwvaDE+XG5cdFx0XHRcdDxwIGNsYXNzPVwiZXhwbGljYXRpb25fZ2VuZXJhbFwiPlRoZSBQb3dlci1VcCBpcyBhIGJvbnVzIHRoYXQgZ2l2ZXMgeW91IGFuIGFkdmFudGFnZSBvdmVyIHlvdXIgb3Bwb25lbnQuIEJ5IGVuYWJsaW5nIHRoaXMgb3B0aW9uLCB5b3Ugd2lsbCBzdGFydCB0aGUgbWF0Y2ggd2l0aCBhdCBsZWFzdCBvbmUgUG93ZXItVXAgb2YgZWFjaCB0eXBlLiBZb3UgY2FuIGFsc28gY3VzdG9taXplIHRoaXMgYW1vdW50IGFuZCBzdGFydCB3aXRoIHRocmVlIG9yIGZpdmUgb2YgZWFjaC48L3A+XG5cdFx0XHRcdDxwIGNsYXNzPVwiZXhwbGljYXRpb25fcG93ZXJVUF9ncmVuYWRlX211bHRpXCI+VGhlIEZsYXNoIEdyZW5hZGUgUG93ZXItVXAgbGV0cyB5b3UgdGhyb3cgYSBncmVuYWRlIHRoYXQgYmxpbmRzIHlvdXIgb3Bwb25lbnQuIEJ1dCBiZSBjYXJlZnVsISBJdCB3b3JrcyBzaW1wbHk6IGl0IGNvbXBsZXRlbHkgZGFya2VucyB0aGUgZ2FtZSBzY3JlZW4sIG1lYW5pbmcgZXZlbiB0aGUgb25lIHdobyB0aHJvd3MgaXQgaXMgYmxpbmRlZC48L3A+XG5cdFx0XHRcdDxwIGNsYXNzPVwiZXhwbGljYXRpb25fcG93ZXJVUF9mcmVlemVcIj5UaGUgRnJlZXplIFBvd2VyLVVwIHRlbXBvcmFyaWx5IGltbW9iaWxpemVzIHRoZSBvcHBvc2luZyB0ZWFtLjwvcD5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImRlbGF5X3Bvd2VyVVBfMV9tdWx0aVwiPlxuXHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90aW1lci1yZXNldC5zdmdcIiBhbHQ9XCJkZWxheVwiPlxuXHRcdFx0XHRcdDxwPkNPT0xET1dOIFRJTUU6IDEwczwvcD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJkZWxheV9wb3dlclVQXzJfbXVsdGlcIj5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdGltZXItcmVzZXQuc3ZnXCIgYWx0PVwiZGVsYXlcIj5cblx0XHRcdFx0XHQ8cD5DT09MRE9XTiBUSU1FOiAxMHM8L3A+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyX2ltYWdlX3Bvd2VyVVBfbXVsdGlcIj5cblx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2dyZW5hZGVfbm9fYmcucG5nXCIgYWx0PVwiZ3JlbmFkZVwiIGNsYXNzPVwiZ3JlbmFkZVwiPlxuXHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvZnJlZXplX25vX2JnLnBuZ1wiIGFsdD1cImZyZWV6ZVwiIGNsYXNzPVwiZnJlZXplXCI+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgaWQ9XCJleGl0X3Bvd2VyVVBfaW5mb19tdWx0aVwiIGNsYXNzPVwiZXhpdF9wb3dlclVQX2luZm9cIj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cImV4aXRfcG93ZXJVUF9pbmZvX2J0bl9tdWx0aVwiIGNsYXNzPVwiYnRuXCI+XG5cdFx0XHRcdFx0WFxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRcdDxkaXYgaWQ9XCJub3RpZmljYXRpb24tY29udGFpbmVyXCIgY2xhc3M9XCJmaXhlZCB0b3AtMCBsZWZ0LTAgcmlnaHQtMCBmbGV4IGp1c3RpZnktY2VudGVyIHotNTAgbXQtNFwiPlxuXHRcdFx0PHAgaWQ9XCJyZXN1bHRNZXNzYWdlXCIgY2xhc3M9XCJweS0yIHB4LTQgcm91bmRlZCBzaGFkb3ctbGcgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwIHRyYW5zZm9ybSB0cmFuc2xhdGUteS0wIG9wYWNpdHktMFwiPjwvcD5cblx0XHQ8L2Rpdj5cblx0YDt9XG5cblx0Ly8gaW5pdF9zb2xvX2dhbWUoKSB7XG5cdC8vIFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb2xvXzF2MV9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0Ly8gXHRcdGNvbnNvbGUubG9nKFwiU29sbyAxdjEgZ2FtZSBzdGFydGVkXCIpO1xuXHQvLyBcdFx0c3RhcnRHYW1lKCk7XG5cdC8vIFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUzXCIsIFwidnVlMlwiKTtcblx0Ly8gXHR9KTtcblx0Ly8gfVxuXG5cdC8vIGluaXRFdmVudHMoKSB7XG5cdC8vIFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtdWx0aXBsYXllcl9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0Ly8gXHRcdC8vIGNvbnNvbGUubG9nKFwiTXVsdGlwbGF5ZXIgMnYyIGdhbWUgc3RhcnRlZFwiKTtcblx0Ly8gXHRcdHN0YXJ0TXVsdGlHYW1lKCk7XG5cdC8vIFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUzXCIsIFwidnVlMlwiKTtcblx0Ly8gXHR9KTtcblx0Ly8gfVxuXG5cblx0Ly8gdG91cm5hbWVudF92aWV3KCkge1xuXHQvLyBcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG91cm5hbWVudF92aWV3XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdC8vIFx0XHQvLyBjb25zb2xlLmxvZyhcIlRvdXJuYW1lbnQgdmlldyBzdGFydGVkXCIpO1xuXHQvLyBcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidG91cm5hbWVudFwiKTtcblx0Ly8gXHR9KTtcblx0Ly8gfVxuXG5cdGhhbmRsZURlY29ubmVjdGlvbigpIHtcblx0XHRjb25zdCBkZWNvbm5lY3RfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWNvbm5lY3RfYnRuXCIpO1xuXG5cdFx0ZGVjb25uZWN0X2J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlMVwiLCBcInZ1ZTJcIik7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIkJhY2sgdG8gaG9tZSBwYWdlXCIpO1xuXHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH0pO1xuXHR9XG5cblx0Z2FtZV9tZW51KClcblx0e1xuXHRcdGNvbnN0IGJ0bl9qb3VlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5fam91ZXInKTtcblx0XHRjb25zdCB2aWV3MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3MScpO1xuXHRcdGNvbnN0IHZpZXcyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXcyJyk7XG5cdFx0Y29uc3QgdmlldzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzMnKTtcblx0XHRjb25zdCB2aWV3NCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3NCcpO1xuXHRcdGNvbnN0IHZpZXcxX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3MV9idG4nKTtcblx0XHRjb25zdCBzZXR0aW5nc19idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3NfYnRuJyk7XG5cdFx0Y29uc3Qgc29sbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb2xvJyk7XG5cdFx0Y29uc3QgbXVsdGlwbGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVsdGlwbGF5ZXInKTtcblx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlldzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXczJyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXc0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3NCcpO1xuXHRcdGNvbnN0IGJ0bl9iYWNrX2hvbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFjay1ob21lJyk7XG5cdFx0Y29uc3QgdmlldzUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzUnKTtcblx0XHRjb25zdCB2aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3NicpO1xuXHRcdGNvbnN0IHZpZXc3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXc3Jyk7XG5cdFx0Y29uc3QgdmlldzggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzgnKTtcblx0XHRjb25zdCBwcmVwYXJfZ2FtZV8xdjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlcGFyX2dhbWVfMXYxJyk7XG5cdFx0Y29uc3QgcHJlcGFyX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlcGFyX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlldzYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXc2Jyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXc3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3NycpO1xuXHRcdGNvbnN0IGJhY2tfdG9fbWVudV92aWV3OCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlldzgnKTtcblx0XHRjb25zdCBwb3dlclVQID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bvd2VyVVAnKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzEnKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF8zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzMnKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF81ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzUnKTtcblx0XHRjb25zdCBwb3dlcl9zZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlcl9zZWxlY3RvcicpO1xuXHRcdGNvbnN0IHNraW5fcGVyc28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbl9wZXJzbycpO1xuXHRcdGNvbnN0IGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19zZWxlY3RfbW9kZV92aWV3NicpO1xuXHRcdGNvbnN0IGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19zZWxlY3RfbW9kZV92aWV3NycpO1xuXHRcdGNvbnN0IGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19zZWxlY3RfbW9kZV92aWV3OCcpO1xuXHRcdGNvbnN0IGNob29zZV95b3VyX29wcG9uZW50X3BsYXRmb3JtZXJfZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaG9vc2VfeW91cl9vcHBvbmVudF9wbGF0Zm9ybWVyX2Zvcm0nKTtcblxuXHRcdC8vIGNvbnN0IGJhY2tfdG9fbWVudV92aWV3X3RvdXJuYW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXdfdG91cm5hbWVudCcpO1xuXG5cdFx0Ly8qPT09PSBDR1UgJiBQcml2YWN5IFBvbGljeSBNb2RhbHMgPT09PSovXG5cdFx0Y29uc3Qgc2hvd0NndUxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3ctY2d1XCIpO1xuXHRcdGNvbnN0IGNndU1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjZ3UtbW9kYWxcIik7XG5cdFx0Y29uc3QgY2d1QmFja0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2d1LWJhY2stYnV0dG9uXCIpO1xuXHRcdFxuXHRcdC8vIE1vZGlmaWVyIGwnZXZlbnQgbGlzdGVuZXIgZCdvdXZlcnR1cmUgZGVzIENHVVxuXHRcdHNob3dDZ3VMaW5rPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGNndU1vZGFsPy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0Ly8gQWpvdXRlciBjZXR0ZSBsaWduZSBwb3VyIGVtcMOqY2hlciBsZSBzY3JvbGwgZHUgY29udGVudSBkZXJyacOocmVcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuXHRcdH0pO1xuXG5cdFx0Ly8gTW9kaWZpZXIgbGVzIGxpc3RlbmVycyBkZSBmZXJtZXR1cmUgYXVzc2lcblx0XHRjZ3VCYWNrQnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y2d1TW9kYWw/LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHQvLyBSw6lhY3RpdmVyIGxlIHNjcm9sbCBxdWFuZCBvbiBmZXJtZVxuXHRcdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiXCI7XG5cdFx0fSk7XG5cblx0XHQvLyBBam91dCA6IGZlcm1lciBsZSBtb2RhbCBlbiBjbGlxdWFudCDDoCBsJ2V4dMOpcmlldXJcblx0XHRjZ3VNb2RhbD8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuXHRcdFx0aWYgKGV2ZW50LnRhcmdldCA9PT0gY2d1TW9kYWwpIHtcblx0XHRcdFx0Y2d1TW9kYWw/LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRcdC8vIFLDqWFjdGl2ZXIgbGUgc2Nyb2xsIHF1YW5kIG9uIGZlcm1lXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcIlwiO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gR2VzdGlvbiBkZSBsYSBQb2xpdGlxdWUgZGUgQ29uZmlkZW50aWFsaXTDqVxuICAgICAgICBjb25zdCBzaG93UHJpdmFjeVBvbGljeUxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3ctcHJpdmFjeS1wb2xpY3lcIik7XG4gICAgICAgIGNvbnN0IHByaXZhY3lQb2xpY3lNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpdmFjeS1wb2xpY3ktbW9kYWxcIik7XG4gICAgICAgIGNvbnN0IHByaXZhY3lQb2xpY3lCYWNrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcml2YWN5LXBvbGljeS1iYWNrLWJ1dHRvblwiKTtcblxuICAgICAgICAvLyBNb2RpZmllciBsJ2V2ZW50IGxpc3RlbmVyIGQnb3V2ZXJ0dXJlIGRlIGxhIFBvbGl0aXF1ZSBkZSBDb25maWRlbnRpYWxpdMOpXG4gICAgICAgIHNob3dQcml2YWN5UG9saWN5TGluaz8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBwcml2YWN5UG9saWN5TW9kYWw/LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAvLyBBam91dGVyIGNldHRlIGxpZ25lIHBvdXIgZW1ww6pjaGVyIGxlIHNjcm9sbCBkdSBjb250ZW51IGRlcnJpw6hyZVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1vZGlmaWVyIGxlcyBsaXN0ZW5lcnMgZGUgZmVybWV0dXJlIGF1c3NpXG4gICAgICAgIHByaXZhY3lQb2xpY3lCYWNrQnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgcHJpdmFjeVBvbGljeU1vZGFsPy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgLy8gUsOpYWN0aXZlciBsZSBzY3JvbGwgcXVhbmQgb24gZmVybWVcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcIlwiO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBam91dCA6IGZlcm1lciBsZSBtb2RhbCBlbiBjbGlxdWFudCDDoCBsJ2V4dMOpcmlldXJcbiAgICAgICAgcHJpdmFjeVBvbGljeU1vZGFsPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBwcml2YWN5UG9saWN5TW9kYWwpIHtcbiAgICAgICAgICAgICAgICBwcml2YWN5UG9saWN5TW9kYWw/LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgLy8gUsOpYWN0aXZlciBsZSBzY3JvbGwgcXVhbmQgb24gZmVybWVcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblx0XHRidG5fam91ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnSk9VRVIgYnV0dG9uIGNsaWNrZWQnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2pvdWVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0fSk7XG5cblx0XHR2aWV3MV9idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnTW9kZSBkZSBqZXV4IGJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0XHRcblx0XHRcdGlmICh2aWV3NS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHZpZXc1LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH0gXG5cdFx0XHRlbHNlIGlmICghdmlldzIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGxldCBza2luID0gZ2V0X3NraW5faXNfaW5pdCgpO1xuXHRcdGNvbnN0IHNraW5faWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbicpO1xuXHRcdGNvbnN0IHNraW5faWRfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbl9tdWx0aScpO1xuXG5cdFx0Y29uc29sZS5sb2coJ3NraW5faWQnLCBza2luKTtcblxuXHRcdGlmIChza2luID09IGZhbHNlKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnc2tpbl9pZCcpO1xuXHRcdFx0c2tpbl9pZC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdHNraW5faWRfbXVsdGkuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c2tpbl9pZC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRcdHNraW5faWRfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0fVxuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqU0VUVElOR1MqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblx0XHRzZXR0aW5nc19idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3Mi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqTU9ERV9ERV9KRVVYKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblx0XHRzb2xvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3My5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdG11bHRpcGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3NC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKkJBQ0tfVE9fTUVOVSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGlmICghdmlldzMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ3ZpZXczIGlzIGFjdGl2ZScpO1xuXHRcdFx0YmFja190b19tZW51X3ZpZXczLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHR2aWV3My5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCF2aWV3NC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRjb25zb2xlLmxvZygndmlldzQgaXMgYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX21lbnVfdmlldzQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdHZpZXc0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBiYWNrX3RvX21lbnVfdmlld190b3VybmFtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlMlwiLCBcInRvdXJuYW1lbnRcIik7XG5cdFx0Ly8gXHR0b3VybmFtZW50X3ZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHQvLyBcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0fSAsIDEwMDApO1xuXHRcdC8vIH0pO1xuXG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKipCQUNLX0hPTUUqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cblx0XHRidG5fYmFja19ob21lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0aWYgKHZpZXcyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0dmlldzIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fam91ZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmlldzUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHR2aWV3NS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzEuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdGJ0bl9qb3Vlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0Ly8gcHJlcGFyX2dhbWVfMXYxLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0dmlldzMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gXHR2aWV3Ni5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHQvLyBcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Ly8gfSk7XG5cblx0XHRjb25zdCBjaG9vc2VfeW91cl9vcHBvbmVudF8xdjFfZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaG9vc2VfeW91cl9vcHBvbmVudF8xdjFfZm9ybScpO1xuXHRcdC8vIGNvbnN0IHZhbGlkYXRlX2xvZ2luID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhbGlkYXRlLW9wcG9uZW50LWxvZ2luJyk7XG5cblx0XHRwcmVwYXJfZ2FtZV8xdjEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnUHJlcGFyIGdhbWUgMXYxIGNsaWNrZWQnKTtcblx0XHRcdHZpZXczLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0Y2hvb3NlX3lvdXJfb3Bwb25lbnRfMXYxX2Zvcm0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0Y29udGFpbmVyX21lbnUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRjb250YWluZXJfbWVudS5zY3JvbGxUb3AgPSAwOyAvLyBSZXNldCBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIHRvcFxuXHRcdH0pO1xuXG5cdFx0Ly8gdmFsaWRhdGVfbG9naW4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0Ly8gXHRjb25zb2xlLmxvZygnUHJlcGFyIGdhbWUgMXYxIGNsaWNrZWQnKTtcblx0XHQvLyBcdGNob29zZV95b3VyX29wcG9uZW50XzF2MV9mb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ni5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHQvLyBcdHZpZXc2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0Y29udGFpbmVyX21lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gfSk7XG5cblxuXHRcdC8vIHByZXBhcl9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0dmlldzQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gXHR2aWV3OC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHQvLyBcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzguY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Ly8gfSk7XG5cdFx0XG5cdFx0Y29uc3QgY2hvb3NlX3lvdXJfb3Bwb25lbnRfbXVsdGlfZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaG9vc2VfeW91cl9vcHBvbmVudF9tdWx0aV9mb3JtJyk7XG5cdFx0Y29uc3QgdmFsaWRhdGVfbXVsdGlfb3Bwb25lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmFsaWRhdGVfbXVsdGlfb3Bwb25lbnQnKTtcblxuXHRcdHByZXBhcl9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRjaG9vc2VfeW91cl9vcHBvbmVudF9tdWx0aV9mb3JtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3OC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGNvbnRhaW5lcl9tZW51LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0Y29udGFpbmVyX21lbnUuc2Nyb2xsVG9wID0gMDtcblx0XHR9KTtcblxuXHRcdC8vIHZhbGlkYXRlX211bHRpX29wcG9uZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0Y29uc29sZS5sb2coJ1ByZXBhciBnYW1lIG11bHRpIGNsaWNrZWQnKTtcblx0XHQvLyBcdGNob29zZV95b3VyX29wcG9uZW50X211bHRpX2Zvcm0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0dmlldzguY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRjb250YWluZXJfbWVudS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHQvLyB9KTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKkJBQ0tfVE9fTUVOVSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGJhY2tfdG9fbWVudV92aWV3Ni5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXc2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXG5cblx0XHRcdGlmIChjaG9vc2VfeW91cl9vcHBvbmVudF8xdjFfZm9ybS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdGNob29zZV95b3VyX29wcG9uZW50XzF2MV9mb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3My5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0Y29udGFpbmVyX21lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdGNvbnRhaW5lcl9tZW51LnNjcm9sbFRvcCA9IDA7XG5cdFx0XHR9XG5cdFx0XG5cbiAgICAgICAgICAgIGlmIChza2luX3BlcnNvLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdHNraW5fcGVyc28uY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgIGlmIChjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdHNvbG9fMXYxX2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0XHRjdXN0b21fdGFfZ2FtZS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG4gICAgICAgICAgICBpZiAocG93ZXJfc2VsZWN0b3IuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRwb3dlcl9zZWxlY3Rvci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0cG93ZXJVUC5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX3RlYW1tYXRlKCk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIoKTtcblx0XHRcdFx0cG93ZXJVUF9uYiA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8xLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuICAgICAgICAgICAgICAgIGlmIChudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfMy5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRjb25zdCBza2luX3BlcnNvX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbl9wZXJzb19nYW1lX211bHRpJyk7XG5cblx0XHRiYWNrX3RvX21lbnVfdmlldzcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnQmFjayB0byBtZW51IHZpZXc3IGNsaWNrZWQnKTtcblx0XHRcdHZpZXczLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc3LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgaWYgKHNraW5fcGVyc28uY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0c2tpbl9wZXJzby5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgaWYgKGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRcdGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0c29sb18xdjFfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdFx0ZGlzYWJsZV9za2luX3BlcnNvX3BsYXllcl9zb2xvKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cbiAgICAgICAgICAgIGlmIChwb3dlcl9zZWxlY3Rvci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRwb3dlclVQLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0cmVzZXRfcG93ZXJVUF9ncmVuYWRlKCk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfdGVhbW1hdGUoKTtcblx0XHRcdFx0cmVzZXRfcG93ZXJVUF9pbnZlcnNlX3BsYXllcigpO1xuXHRcdFx0XHRwb3dlclVQX25iID0gMDtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuICAgICAgICAgICAgICAgIGlmIChudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGJhY2tfdG9fbWVudV92aWV3OC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXc4LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0aWYgKGNob29zZV95b3VyX29wcG9uZW50X211bHRpX2Zvcm0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRjaG9vc2VfeW91cl9vcHBvbmVudF9tdWx0aV9mb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3NC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0Y29udGFpbmVyX21lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdGNvbnRhaW5lcl9tZW51LnNjcm9sbFRvcCA9IDA7XG5cdFx0XHR9XG4gICAgICAgICAgICBpZiAoc2tpbl9wZXJzb19nYW1lX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdHNraW5fcGVyc29fZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgaWYgKGNob29zZV95b3VyX3NraW5fZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdFx0Y2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdG11bHRpcGxheWVyX2J0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0XHRjdXN0b21fdGFfZ2FtZV9tdWx0aS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0XHRcdGRpc2FibGVfc2tpbl9tdWx0aSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG4gICAgICAgICAgICBpZiAocG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyVVBfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2dyZW5hZGVUZWFtX3BsYXllcigpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2ZyZWV6ZV9UZWFtX3BsYXllcigpO1xuXHRcdFx0XHRwb3dlclVQX25iID0gMDtcblx0XHRcdFx0cG93ZXJVUF9uYl9tdWx0aSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyX3Bvd2VyVVBfM19nYW1lX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfM19nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuICAgICAgICAgICAgICAgIGlmIChudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqUE9XRVJfVVBfU09MTyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdHBvd2VyVVAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRwb3dlclVQLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblxuXHRcdFx0aWYgKHBvd2VyVVAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1Bvd2VyVVAgaXMgYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2dyZW5hZGUoKTtcblx0XHRcdFx0cmVzZXRfcG93ZXJVUF90ZWFtbWF0ZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2ludmVyc2VfcGxheWVyKCk7XG5cdFx0XHRcdHBvd2VyVVBfbmIgPSAwO1xuXHRcdFx0XHRwb3dlclVQX25iX211bHRpID0gMDtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuICAgICAgICAgICAgICAgIGlmIChudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnMSBwb3dlclVQIHNlbGVjdGVkIGFuZCAzIGFuZCA1IHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2goMSk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfdGVhbW1hdGUoMSk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIoMSk7XG5cdFx0XHRwb3dlclVQX25iID0gMTtcblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnMyBwb3dlclVQIHNlbGVjdGVkIGFuZCAxIGFuZCA1IHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2goMyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfdGVhbW1hdGUoMyk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIoMyk7XG5cdFx0XHRwb3dlclVQX25iID0gMztcblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMy5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnNSBwb3dlclVQIHNlbGVjdGVkIGFuZCAxIGFuZCAzIHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2goNSk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfdGVhbW1hdGUoNSk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIoNSk7XG5cdFx0XHRwb3dlclVQX25iID0gNTtcblx0XHR9KTtcblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKipQT1dFUl9VUF9tdWx0aSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Y29uc3QgcG93ZXJVUF9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlclVQX211bHRpJyk7XG5cdFx0Y29uc3QgbnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3QgcG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpJyk7XG5cblx0XHRwb3dlclVQX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0cG93ZXJVUF9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cblx0XHRcdGlmIChwb3dlclVQX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGFjdGl2ZScpO1xuXHRcdFx0XHRwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZVRlYW1fcGxheWVyKCk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyKCk7XG5cdFx0XHRcdHBvd2VyVVBfbmIgPSAwO1xuXHRcdFx0XHRwb3dlclVQX25iX211bHRpID0gMDtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdFx0bnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdFx0fVxuICAgICAgICAgICAgICAgIGlmIChudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0XHRudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRcdG51bWJlcl9wb3dlclVQXzVfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdGNvbnNvbGUubG9nKCcxIHBvd2VyVVAgc2VsZWN0ZWQgYW5kIDMgYW5kIDUgdW5zZWxlY3RlZCcpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaF90ZWFtX3BsYXllcigxKTtcblx0XHRcdGluaXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIoMSk7XG5cdFx0XHRwb3dlclVQX25iX211bHRpID0gMTtcblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdGNvbnNvbGUubG9nKCczIHBvd2VyVVAgc2VsZWN0ZWQgYW5kIDEgYW5kIDUgdW5zZWxlY3RlZCcpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaF90ZWFtX3BsYXllcigzKTtcblx0XHRcdGluaXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIoMyk7XG5cdFx0XHRwb3dlclVQX25iX211bHRpID0gMztcblx0XHR9KTtcblx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnNSBwb3dlclVQIHNlbGVjdGVkIGFuZCAxIGFuZCAzIHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2hfdGVhbV9wbGF5ZXIoNSk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyKDUpO1xuXHRcdFx0cG93ZXJVUF9uYl9tdWx0aSA9IDU7XG5cdFx0fSk7XG4gICAgICAgIGlmIChnZXRWYWx1ZV9sZWF2ZV9nYW1lKCkgPT0gdHJ1ZSkge1xuXHRcdFx0cG93ZXJVUF9uYiA9IDA7XG5cdFx0XHRwb3dlclVQX25iX211bHRpID0gMDtcblx0XHRcdHNldExlYXZlR2FtZVZhcihmYWxzZSk7XG5cdFx0fVxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKipTS0lOLVNPTE8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdGNvbnN0IGNob29zZV95b3VyX3NraW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hvb3NlX3lvdXJfc2tpbicpO1xuXHRcdGNvbnN0IHZhbGlkZV90b25fc2tpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWxpZGVfdG9uX3NraW4nKTtcblx0XHRjb25zdCBjdXN0b21fdGFfZ2FtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21fdGFfZ2FtZScpO1xuXHRcdGNvbnN0IHNvbG9fMXYxX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb2xvXzF2MV9idG4nKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX2xlZnRfaWQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fbGVmdF9pZDEnKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX3JpZ2h0X2lkMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX3JpZ2h0X2lkMScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fbGVmdF9pZDIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9sZWZ0X2lkMicpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fcmlnaHRfaWQyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fcmlnaHRfaWQyJyk7XG5cblx0XHRza2luX3BlcnNvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0c2tpbl9wZXJzby5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cdFx0XHRcblx0XHRcdGlmIChza2luX3BlcnNvLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdTa2luIHBlcnNvIGlzIGFjdGl2ZScpO1xuXHRcdFx0XHRjaG9vc2VfeW91cl9za2luLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRzb2xvXzF2MV9idG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdFx0Y3VzdG9tX3RhX2dhbWUuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuXHRcdFx0XHRlbmFibGVfc2tpbl9wZXJzb19wbGF5ZXJfc29sbygpO1xuXG5cdFx0XHRcdHZhbGlkZV90b25fc2tpbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgLy8gTk9URSAtIEkgcmVtb3ZlZCB0aGUgaWYgc3RhdGVtZW50IGhlcmVcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnVmFsaWRlIHRvbiBza2luIGJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0XHRcdFx0Y2hvb3NlX3lvdXJfc2tpbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0XHRzb2xvXzF2MV9idG4uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRcdFx0Y3VzdG9tX3RhX2dhbWUuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblx0XHRcdFx0XHRkaXNhYmxlX3NraW5fcGVyc29fcGxheWVyX3NvbG9fYW5kX3NhdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG4gICAgICAgICAgICBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1NraW4gcGVyc28gaXMgaW5hY3RpdmUnKTtcblx0XHRcdFx0aWYgKGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRcdGNob29zZV95b3VyX3NraW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0c29sb18xdjFfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdFx0ZGlzYWJsZV9za2luX3BlcnNvX3BsYXllcl9zb2xvKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gbGVmdCBpZDEgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9sZWZ0KCk7XG5cdFx0fSk7XG5cblx0XHRzd2l0Y2hfc2tuX3JpZ2h0X2lkMS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiByaWdodCBpZDEgY2xpY2tlZCcpO1xuXHRcdFx0c3dpdGNoX3NraW5fcGVyc29fcGxheWVyMV9yaWdodCgpO1xuXHRcdH0pO1xuXG5cdFx0c3dpdGNoX3Nrbl9sZWZ0X2lkMi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkMiBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX2xlZnQoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ1N3aXRjaCBza2luIHJpZ2h0IGlkMiBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX3JpZ2h0KCk7XG5cdFx0fSk7XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKipTS0lOX01VTFRJKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Y29uc3QgY2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nob29zZV95b3VyX3NraW5fZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHZhbGlkZV90b25fc2tpbl9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhbGlkZV90b25fc2tpbl9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9sZWZ0X2lkMV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fbGVmdF9pZDFfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fcmlnaHRfaWQxX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9yaWdodF9pZDFfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fbGVmdF9pZDJfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX2xlZnRfaWQyX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX3JpZ2h0X2lkMl9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fcmlnaHRfaWQyX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBzd2l0Y2hfc2tuX2xlZnRfaWQzX2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9sZWZ0X2lkM19nYW1lX211bHRpJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9yaWdodF9pZDNfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hfc2tuX3JpZ2h0X2lkM19nYW1lX211bHRpJyk7XG5cdFx0Y29uc3Qgc3dpdGNoX3Nrbl9sZWZ0X2lkNF9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N3aXRjaF9za25fbGVmdF9pZDRfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IHN3aXRjaF9za25fcmlnaHRfaWQ0X2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoX3Nrbl9yaWdodF9pZDRfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IGN1c3RvbV90YV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbV90YV9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3QgbXVsdGlwbGF5ZXJfYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ211bHRpcGxheWVyX2J0bicpO1xuXG5cdFx0c2tpbl9wZXJzb19nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0c2tpbl9wZXJzb19nYW1lX211bHRpLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblx0XHRcdFxuXHRcdFx0aWYgKHNraW5fcGVyc29fZ2FtZV9tdWx0aS5jbGFzc0xpc3QuY29udGFpbnMoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU2tpbiBwZXJzbyBpcyBhY3RpdmUnKTtcblx0XHRcdFx0Y2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRtdWx0aXBsYXllcl9idG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdFx0Y3VzdG9tX3RhX2dhbWVfbXVsdGkuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuXHRcdFx0XHRlbmFibGVfc2tpbl9tdWx0aSgpO1xuXG5cdFx0XHRcdHZhbGlkZV90b25fc2tpbl9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyAvLyBOT1RFIC0gSSByZW1vdmVkIHRoZSBpZiBzdGF0ZW1lbnQgaGVyZSBmb3IgVHlwZXNjcmlwdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdWYWxpZGUgdG9uIHNraW4gYnV0dG9uIGNsaWNrZWQnKTtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0bXVsdGlwbGF5ZXJfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lX211bHRpLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdFx0ZGlzYWJsZV9za2luX2FuZF9zYXZlX211bHRpKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU2tpbiBwZXJzbyBpcyBpbmFjdGl2ZScpO1xuXHRcdFx0XHRpZiAoY2hvb3NlX3lvdXJfc2tpbl9nYW1lX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0XHRjaG9vc2VfeW91cl9za2luX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0bXVsdGlwbGF5ZXJfYnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRcdGN1c3RvbV90YV9nYW1lX211bHRpLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cdFx0XHRcdFx0ZGlzYWJsZV9za2luX211bHRpKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDFfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkMSBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIxX2xlZnRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQxX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gcmlnaHQgaWQxIGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjFfcmlnaHRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDJfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkMiBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIyX2xlZnRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQyX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gcmlnaHQgaWQyIGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjJfcmlnaHRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDNfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkMyBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXIzX2xlZnRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQzX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gcmlnaHQgaWQzIGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjNfcmlnaHRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fbGVmdF9pZDRfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdTd2l0Y2ggc2tpbiBsZWZ0IGlkNCBjbGlja2VkJyk7XG5cdFx0XHRzd2l0Y2hfc2tpbl9wZXJzb19wbGF5ZXI0X2xlZnRfbXVsdGkoKTtcblx0XHR9KTtcblxuXHRcdHN3aXRjaF9za25fcmlnaHRfaWQ0X2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnU3dpdGNoIHNraW4gcmlnaHQgaWQ0IGNsaWNrZWQnKTtcblx0XHRcdHN3aXRjaF9za2luX3BlcnNvX3BsYXllcjRfcmlnaHRfbXVsdGkoKTtcblx0XHR9KTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKlBPV0VSX1VQX0lORk8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5cdFx0Y29uc3QgcG93ZXJfdXBfaW5mb19pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlcl91cF9pbmZvX2lkJyk7XG5cdFx0Y29uc3QgY29udGFpbmVyX2luZm9fcG93ZXJfdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyX2luZm9fcG93ZXJfdXAnKTtcblx0XHRjb25zdCBleGl0X3Bvd2VyVVBfaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGl0X3Bvd2VyVVBfaW5mbycpO1xuXG5cdFx0cG93ZXJfdXBfaW5mb19pZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0ZXhpdF9wb3dlclVQX2luZm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb250YWluZXJfaW5mb19wb3dlcl91cC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ni5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKlBPV0VSX1VQX0lORk9fTVVMVEkqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGNvbnN0IHBvd2VyX3VwX2luZm9faWRfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG93ZXJfdXBfaW5mb19pZF9tdWx0aScpO1xuXHRcdGNvbnN0IGNvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcl9pbmZvX3Bvd2VyX3VwX211bHRpJyk7XG5cdFx0Y29uc3QgZXhpdF9wb3dlclVQX2luZm9fbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhpdF9wb3dlclVQX2luZm9fbXVsdGknKTtcblxuXHRcdHBvd2VyX3VwX2luZm9faWRfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb250YWluZXJfaW5mb19wb3dlcl91cF9tdWx0aS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc4LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3OC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdGV4aXRfcG93ZXJVUF9pbmZvX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29udGFpbmVyX2luZm9fcG93ZXJfdXBfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3OC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzguY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKipQQVJSQU1FVFJFIEpFVSBFVCBQUk9GSUxFKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGNvbnN0IHBhcmFtZXRyZV9qZXUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFycmFtZXRyZV9qZXV4X2J0bicpO1xuXHRcdGNvbnN0IHBhcmFtZXRyZV9wcm9maWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2ZpbGVfcGFycmFtZXRyZV9idG4nKTtcblx0XHRjb25zdCBwYXJhbWV0cmVfamV1X3ZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFyYW1ldHJlc19qZXUnKTtcblx0XHRjb25zdCBwYXJhbWV0cmVfcHJvZmlsZV92aWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhcmFtZXRyZXNfcHJvZmlsZScpO1xuXHRcdGNvbnN0IGNvbnRhaW5lcl9tZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuXG5cdFx0cGFyYW1ldHJlX2pldS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdQYXJyYW1ldHJlIGpldSBjbGlja2VkJyk7XG5cdFx0XHRwYXJhbWV0cmVfamV1X3ZpZXcuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3NS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGNvbnRhaW5lcl9tZW51LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGNvbnRhaW5lcl9tZW51LnNjcm9sbFRvcCA9IDA7XG5cblx0XHR9KTtcblx0XHRcblx0XHRwYXJhbWV0cmVfcHJvZmlsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdQYXJyYW1ldHJlIHByb2ZpbGUgY2xpY2tlZCcpO1xuXHRcdFx0cGFyYW1ldHJlX3Byb2ZpbGVfdmlldy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGNvbnRhaW5lcl9tZW51LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0Y29udGFpbmVyX21lbnUuc2Nyb2xsVG9wID0gMDtcblxuXHRcdH0pO1xuXG5cblx0XHRidG5fYmFja19ob21lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0aWYgKHBhcmFtZXRyZV9qZXVfdmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHBhcmFtZXRyZV9qZXVfdmlldy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdC8vIGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRjb250YWluZXJfbWVudS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0Y29udGFpbmVyX21lbnUuc2Nyb2xsVG9wID0gMDtcblxuXHRcdFx0fVxuXHRcdFx0aWYgKHBhcmFtZXRyZV9wcm9maWxlX3ZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRwYXJhbWV0cmVfcHJvZmlsZV92aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3NS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0Ly8gYnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdGNvbnRhaW5lcl9tZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRjb250YWluZXJfbWVudS5zY3JvbGxUb3AgPSAwO1xuXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKipQYXJhbWV0cmVfcHJvZmlsKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGNvbnN0IHZhbGlkX21kcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWxpZF9tZHAnKTtcblx0XHRjb25zdCBtb2RpZl9wcm9maWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kaWZfcHJvZmlsJyk7XG5cdFx0Ly8gY29uc3QgbW9kaWZfcHJvZmlsX3Bob3RvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2ZpbGVfcGhvdG9fY2lyY2xlJyk7XG5cdFx0Y29uc3QgcHJvZmlsZV9wYXJhbV91bmxvY2tlZF9pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9maWxlX3BhcmFtX3VubG9ja2VkX2lkJyk7XG5cdFx0Y29uc3QgdmFsaWRfcHJvZmlsZV9pbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZhbGlkX3Byb2ZpbGVfaW5mbycpO1xuXHRcdGNvbnN0IGZhX3NlbGVjdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhX3NlbGVjdG9yJyk7XG5cdFx0Y29uc3QgYWN0aXZlX2ZhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGl2ZV9mYScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7O1xuXG5cblx0XHQvLyB2YWxpZF9tZHAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0Ly8gXHRjb25zb2xlLmxvZygnVmFsaWRlIG1kcCBjbGlja2VkJyk7XG5cdFx0Ly8gXHRtb2RpZl9wcm9maWwuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0Ly8gXHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0cHJvZmlsZV9wYXJhbV91bmxvY2tlZF9pZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHQvLyB9KTtcblxuXHRcdC8vIG1vZGlmX3Byb2ZpbF9waG90by5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHQvLyBcdGNvbnNvbGUubG9nKCdtb2RpZiBwcm9maWxlIHBob3RvIGNsaWNrZWQnKTtcblx0XHQvLyBcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZmlsZV9waG90b19pbnB1dFwiKS5jbGljaygpO1xuXHRcdC8vIFx0Y2hhbmdlUHJvZmlsZVBpY3R1cmUoKTtcblx0XHQvLyB9KTtcblxuXHRcdC8vIHZhbGlkX3Byb2ZpbGVfaW5mby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHQvLyBcdGNvbnNvbGUubG9nKCdWYWxpZGUgcHJvZmlsZSBpbmZvIGNsaWNrZWQnKTtcblx0XHQvLyBcdHByb2ZpbGVfcGFyYW1fdW5sb2NrZWRfaWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRtb2RpZl9wcm9maWwuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0Ly8gXHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIH0pO1xuXG5cdFx0Y29uc3QgY29kZV92YWxpZGF0aW9uX2lkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVfdmFsaWRhdGlvbl9pZCcpO1xuXHRcdGNvbnN0IGNhbmNlbF9mYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW5jZWxfZmEnKTtcblxuXHRcdGFjdGl2ZV9mYS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRpZiAoYWN0aXZlX2ZhLmNoZWNrZWQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0ZBIGlzIGFjdGl2ZScpO1xuXHRcdFx0XHRjb2RlX3ZhbGlkYXRpb25faWQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdGZhX3NlbGVjdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGQSBpcyBpbmFjdGl2ZScpO1xuXHRcdFx0XHQvLyBmYV9zZWxlY3Rvci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0ZmFfc2VsZWN0b3IuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGNhbmNlbF9mYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdDYW5jZWwgRkEgY2xpY2tlZCcpO1xuXHRcdFx0Y29kZV92YWxpZGF0aW9uX2lkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0ZmFfc2VsZWN0b3IuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdFx0XHRhY3RpdmVfZmEuY2hlY2tlZCA9IGZhbHNlO1xuXHRcdH0pO1xuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKipwbGF0Zm9ybWVyKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdGNvbnN0IHBsYXRmb3JtZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxhdGZvcm1lcl92aWV3Jyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV9wbGF0Zm9ybWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fc2VsZWN0X21vZGVfcGxhdGZvcm1lcicpO1xuXG5cdFx0cGxhdGZvcm1lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3Mi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0Y2hvb3NlX3lvdXJfb3Bwb25lbnRfcGxhdGZvcm1lcl9mb3JtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV9wbGF0Zm9ybWVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0Y29udGFpbmVyX21lbnUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRjb250YWluZXJfbWVudS5zY3JvbGxUb3AgPSAwOyAvLyBSZXNldCBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIHRvcFxuXHRcdH0pO1xuXG5cdFx0YmFja190b19zZWxlY3RfbW9kZV9wbGF0Zm9ybWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ0JhY2sgdG8gc2VsZWN0IG1vZGUgcGxhdGZvcm1lciBjbGlja2VkJyk7XG5cdFx0XHRjaG9vc2VfeW91cl9vcHBvbmVudF9wbGF0Zm9ybWVyX2Zvcm0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRiYWNrX3RvX3NlbGVjdF9tb2RlX3BsYXRmb3JtZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGNvbnRhaW5lcl9tZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0Y29udGFpbmVyX21lbnUuc2Nyb2xsVG9wID0gMDsgLy8gUmVzZXQgc2Nyb2xsIHBvc2l0aW9uIHRvIHRoZSB0b3Bcblx0XHR9KTtcblxuXHRcdC8vIGNvbnN0IHZhbGlkZXJfb3Bwb25lbnRfYnRuX3BsYXRmb3JtZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmFsaWRlcl9vcHBvbmVudF9idG5fcGxhdGZvcm1lcicpO1xuXG5cdFx0Ly8gdmFsaWRlcl9vcHBvbmVudF9idG5fcGxhdGZvcm1lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHQvLyBcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTJcIiwgXCJwbGF0Zm9ybWVyXCIpO1xuXHRcdC8vIH0pO1xuXHRcdC8vIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvLyAvKioqKioqKioqKioqKioqKioqKioqKioqKk9wdGlvbiBkZWNvbm5lY3RlZCoqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0Ly8gLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Ly8gY29uc3Qgb3B0aW9uX2RlY29ubmVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHRpb25fZGVjb25uZWN0Jyk7XG5cdFx0Ly8gY29uc3Qgb3B0aW9uX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHRpb25fYnRuJyk7XG5cdFx0Ly8gY29uc3Qgb3B0aW9uX2RlY29ubmVjdGVkX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHRpb25fZGVjb25uZWN0ZWRfYnRuJyk7XG5cblx0XHQvLyBvcHRpb25fYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0Y29uc29sZS5sb2coJ09wdGlvbiBkZWNvbm5lY3QgY2xpY2tlZCcpO1xuXHRcdC8vIFx0b3B0aW9uX2RlY29ubmVjdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcdFxuXHRcdC8vIFx0dmlldzUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0dmlldzEuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0Ly8gfSk7XG5cblx0XHQvLyBvcHRpb25fZGVjb25uZWN0ZWRfYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdC8vIFx0Y29uc29sZS5sb2coJ09wdGlvbiBkZWNvbm5lY3QgYmFjayBjbGlja2VkJyk7XG5cdFx0Ly8gXHRvcHRpb25fZGVjb25uZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0dmlldzUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Ly8gXHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIFx0dmlldzEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0Ly8gfSk7XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKm5hdmJhcioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Y29uc3Qgb3B0aW9uX2J0bl9uYXZCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3B0aW9uX2J0bl9uYXZCYXInKTtcblx0XHRjb25zdCBwYW5lbF9vcHRpb25fbmF2YmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbmVsX29wdGlvbl9uYXZiYXInKTtcblx0XHRjb25zdCBvcHRpb25fYnRuX3JlbW92ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHRpb25fYnRuX3JlbW92ZScpO1xuXHRcdGNvbnN0IGRlY29ubmVjdF9idG5fbmF2QmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlY29ubmVjdF9idG5fbmF2QmFyJyk7XG5cblx0XHRvcHRpb25fYnRuX25hdkJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdPcHRpb24gZGVjb25uZWN0IGNsaWNrZWQnKTtcblx0XHRcdHBhbmVsX29wdGlvbl9uYXZiYXIuY2xhc3NMaXN0LnJlbW92ZSgncmVtb3ZlJyk7IC8vIHJldGlyZSBsJ2FuaW1hdGlvbiBkZSBmZXJtZXR1cmVcblx0XHRcdHZvaWQgcGFuZWxfb3B0aW9uX25hdmJhci5vZmZzZXRXaWR0aDsgLy8gZm9yY2UgbGUgcmVmbG93IHBvdXIgcmVsYW5jZXIgbCdhbmltYXRpb24gc2kgYmVzb2luXG5cdFx0XHRwYW5lbF9vcHRpb25fbmF2YmFyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0b3B0aW9uX2J0bl9yZW1vdmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnT3B0aW9uIGRlY29ubmVjdCBiYWNrIGNsaWNrZWQnKTtcblx0XHRcdC8vIHBhbmVsX29wdGlvbl9uYXZiYXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IC8vIHJldGlyZSBsJ2FuaW1hdGlvbiBk4oCZb3V2ZXJ0dXJlXG5cdFx0XHRwYW5lbF9vcHRpb25fbmF2YmFyLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZScpO1xuXHRcdH0pO1xuXG5cdFx0ZGVjb25uZWN0X2J0bl9uYXZCYXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnRGVjb25uZWN0IGJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUxXCIsIFwidnVlMlwiKTtcblx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHR9KTtcblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKkdhbWUgSGlzdG9yeSoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0Y29uc3QgR2FtZV9IaXN0b3J5X2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdHYW1lX0hpc3RvcnlfYnRuJyk7XG5cdFx0Y29uc3QgZ2FtZV9oaXN0b3J5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWVfaGlzdG9yeScpO1xuXHRcdGNvbnN0IGV4aXRfZ2FtZV9oaXN0b3J5X2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGl0X2dhbWVfaGlzdG9yeV9idG4nKTtcdFxuXG5cdFx0R2FtZV9IaXN0b3J5X2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGdhbWVfaGlzdG9yeS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJoaXN0b3J5SXNWaXNpYmxlXCIsIFwidHJ1ZVwiKTtcblx0XHR9KTtcblxuXHRcdGV4aXRfZ2FtZV9oaXN0b3J5X2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGdhbWVfaGlzdG9yeS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJoaXN0b3J5SXNWaXNpYmxlXCIsIFwiZmFsc2VcIik7XG5cdFx0fSk7XG5cblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvbG9fMXYxX2J0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJTb2xvIDF2MSBnYW1lIHN0YXJ0ZWRcIik7XG5cdFx0XHRzdGFydEdhbWUoKTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTNcIiwgXCJ2dWUyXCIpO1xuXHRcdH0pO1xuXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtdWx0aXBsYXllcl9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiTXVsdGlwbGF5ZXIgMnYyIGdhbWUgc3RhcnRlZFwiKTtcblx0XHRcdHN0YXJ0TXVsdGlHYW1lKCk7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUzXCIsIFwidnVlMlwiKTtcblx0XHR9KTtcblxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG91cm5hbWVudF92aWV3XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIlRvdXJuYW1lbnQgdmlldyBzdGFydGVkXCIpO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidG91cm5hbWVudFwiKTtcblx0XHR9KTtcblxuXHRcdGNvbnN0IGFjY2VwdGVkU2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWN0aW9uLWFjY2VwdGVkJyk7XG5cdFx0Y29uc3QgcGVuZGluZ1NlY3Rpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VjdGlvbi1wZW5kaW5nJyk7XG5cblx0XHRjb25zdCBidG5BY2NlcHRlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWItYWNjZXB0ZWQnKTtcblx0XHRjb25zdCBidG5QZW5kaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYi1wZW5kaW5nJyk7XG5cblx0XHRidG5BY2NlcHRlZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGFjY2VwdGVkU2VjdGlvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdHBlbmRpbmdTZWN0aW9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRidG5BY2NlcHRlZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJ0blBlbmRpbmcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRidG5QZW5kaW5nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0YWNjZXB0ZWRTZWN0aW9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRwZW5kaW5nU2VjdGlvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdGJ0bkFjY2VwdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuUGVuZGluZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnQtcGxhdGZvcm1lclwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInBsYXRmb3JtZXJcIiwgXCJ2dWUyXCIpO1xuXHRcdH0pO1xuXHR9XG59XG5cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3dlclVQX3ZhbHVlKCkge1xuXHRyZXR1cm4gcG93ZXJVUF9uYjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKSB7XG5cdHJldHVybiBwb3dlclVQX25iX211bHRpO1xufSJdfQ==