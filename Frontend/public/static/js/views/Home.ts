import AbstractView from "./AbstractView.js";
// import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
// import Game_menu from "./Game_menu.js";


export default class Home extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
		const accessToken : string | null = sessionStorage.getItem("accessToken");
		if (accessToken && accessToken !== undefined) {
			history
			import('./Game_menu.js').then(module => {
				const GameMenu = module.default;
				const gameMenuInstance = new GameMenu();
				gameMenuInstance.getHtml().then(html => {
					document.getElementById('app').innerHTML = html;
					if (gameMenuInstance.game_menu) {
						gameMenuInstance.game_menu();
					}
				});
			});
		}
	}

	async getHtml(): Promise<string> {
		return /*html*/`
			<link rel="stylesheet" href="./static/js/css/home.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container-login">
				<div class="title">
					<h1> TRANSCENDENCE </h1>
				</div>

				<!-- CGU Modal -->
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
								<li>Coordonnées (email)</li>
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

				<div class="login-form" id="loginform_id">
					<h1 id="login-title">LOGIN</h1>
					<div class="form-group"> 
						<form id="loginForm" class="loginForm" onsubmit="login(event)">
							<div class="input-container">
								<label for="email">Email :</label>
								<input type="email" id="login-email" name="email" placeholder="Your email" required>
							</div>
							<div class="input-container">
								<label for="password">Password :</label>
								<input type="password" id="login-password" name="password" placeholder="Your password" required>
							</div>
							<button type="submit" class="connexion" id="validate-login">Login</button>
							<button type="button" class="creer-compte" id="create-Account">Create an account</button>
						</form>
						<form id="doubleAuthForm" class="doubleAuthForm" onsubmit="verify2FA(event)">
							<div class="input-container">
								<label for="code">2FA Code :</label>
								<input type="text" id="verify-2fa-code" name="code" placeholder="123456" required>
							</div>
							<button type="submit" class="connexion">Validate</button>
						</form>
					</div>
				</div>
				<div class="register-form" id="create_account_id">
					<h1>SIGN IN</h1>
					<div class="form-group">
						<form id="registerForm" onsubmit="register(event)">
							<div class="input-container">
								<label for="username">Username :</label>
									<input type="text" id="register-username" name="username" placeholder="Your username" required>
							</div>
							<div class="input-container">
								<label for="email">Email :</label>
									<input type="email" id="register-email" name="email" placeholder="Your email" required>
							</div>
							<div class="input-container">
								<label for="password">Password :</label>
									<input type="password" id="register-password" name="password" placeholder="Your password" required>
							</div>
							<div class="input-container">
								<label for="confirm-password">Confirm password :</label>
									<input type="password" id="register-confirm-password" name="password" placeholder="Confirm your password" required>
							</div>
							<div class="input-container cgu-container">
								<input type="checkbox" id="accept-cgu" name="accept-cgu" required>
								<label for="accept-cgu">J'accepte les <a href="#" id="show-cgu" class="cgu-link">Conditions Générales d'Utilisation</a></label>
							</div>
							<button type="submit" class="connexion">Sign In</button>
							<button type="button" class="connexion" id="alreadyHaveAccountButton_id">Already have an account ?</button>
						</form>
					</div>
				</div>
			</div>
			<div id="notification-container" class="fixed top-0 left-0 right-0 flex justify-center z-50 mt-4">
				<p id="resultMessage" class="py-2 px-4 rounded shadow-lg transition-all duration-300 transform translate-y-0 opacity-0"></p>
			</div>
`;}

	createAccount() {

		console.log("createAccount");

		const loginForm = document.getElementById("loginform_id");
		const createAccountForm = document.getElementById("create_account_id");
		const createAccountButton = document.getElementById("create-Account");
		const alreadyHaveAccountButton = document.getElementById("alreadyHaveAccountButton_id");
		const doubleAuthForm = document.getElementById("doubleAuthForm");
		const backButton = document.getElementById("back");
		
		// Gestion des CGU
		const showCguLink = document.getElementById("show-cgu");
		const cguModal = document.getElementById("cgu-modal");
		const cguBackButton = document.getElementById("cgu-back-button");
		
		// Afficher les CGU quand on clique sur le lien
		showCguLink?.addEventListener("click", (e) => {
			e.preventDefault();
			cguModal?.classList.add("active");
		});
		
		// Cacher les CGU quand on clique sur "Retour"
		cguBackButton?.addEventListener("click", () => {
			cguModal?.classList.remove("active");
		});

		createAccountButton.addEventListener("click", () => {
			console.log("createAccountForm");
			loginForm.classList.add("active");
			createAccountForm.classList.add("active");
			(document.getElementById("login-email") as HTMLInputElement).value = "";
			(document.getElementById("login-password") as HTMLInputElement).value = "";
		});

		alreadyHaveAccountButton.addEventListener("click", () => {
			console.log("loginForm");
			createAccountForm.classList.remove("active");
			loginForm.classList.remove("active");
			(document.getElementById("registerForm") as HTMLFormElement).reset();
		});
	}
}