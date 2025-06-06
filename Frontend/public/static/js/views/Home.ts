import AbstractView from "./AbstractView.js";
// import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
// import Game_menu from "./Game_menu.js";

// Déclarations des fonctions externes
declare function notif(message: string, success: boolean): void;
declare function initGoogleSignIn(): void;
declare var tokenClient: any;
//---


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
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="fixed top-0 left-0 w-full h-full flex items-center justify-center z-10 pointer-events-auto bg-black bg-opacity-30 backdrop-blur-sm">
				<!-- Title -->
				<div class="absolute top-4 right-20">
					<h1 class="text-5xl font-black text-white drop-shadow-lg" style="font-family: 'Black Ops One', sans-serif;">TRANSCENDENCE</h1>
				</div>

				<!-- CGU Modal -->
				<div id="cgu-modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-lg hidden justify-center items-center z-50 overflow-y-auto">
					<div class="w-4/5 max-w-4xl max-h-[80vh] bg-white bg-opacity-10 backdrop-blur-[20px] rounded-3xl p-8 shadow-2xl overflow-y-auto border border-white border-opacity-15 scrollbar-hide">
						<h1 class="text-center text-3xl text-white mb-8 drop-shadow-md tracking-wide" style="font-family: 'Black Ops One', sans-serif;">Conditions Générales d'Utilisation</h1>
						<div class="text-white text-opacity-90 leading-relaxed mb-5 px-3">
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">1. Introduction</h2>
							<p class="mb-4">Bienvenue sur Transcendance. En utilisant notre application, vous acceptez les présentes conditions générales d'utilisation.</p>
							<p class="mb-4">Responsable du traitement: Équipe projet Transcendance - École 42<br>
							Contact: ozasahin@student.42lyon.fr<br>
							Délégué à la Protection des Données (DPO): M. SAHIN O.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">2. Description du Service</h2>
							<p class="mb-4">Transcendance est une plateforme de jeu en ligne permettant aux utilisateurs de jouer à Pong et d'autres jeux, de communiquer et d'interagir avec d'autres utilisateurs.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">3. Inscription et Compte</h2>
							<p class="mb-4">Pour utiliser notre service, vous devez créer un compte avec des informations exactes et à jour. Nous collectons uniquement les données nécessaires à la fourniture de nos services.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">4. Comportement des Utilisateurs</h2>
							<p class="mb-4">Les utilisateurs s'engagent à respecter les autres membres et à ne pas publier de contenu offensant ou illégal.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">5. Propriété Intellectuelle</h2>
							<p class="mb-4">Tous les droits de propriété intellectuelle liés à Transcendance appartiennent à leurs propriétaires respectifs.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">6. Protection des Données</h2>
							<p class="mb-4">Nous nous engageons à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.1 Données collectées</h3>
							<p class="mb-4">Nous collectons les catégories de données suivantes:
							<ul class="ml-5 list-disc">
								<li class="mb-1">Données d'identification (ID interne, username, avatar)</li>
								<li class="mb-1">Données d'authentification (via Google Sign-In)</li>
								<li class="mb-1">Données de profil (statut, préférences)</li>
								<li class="mb-1">Données d'utilisation (historique des parties, scores, classement)</li>
							</ul>
							</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.2 Finalités du traitement</h3>
							<p class="mb-4">Vos données sont traitées pour les finalités suivantes:
							<ul class="ml-5 list-disc">
								<li class="mb-1">Fourniture du service de jeu en ligne Transcendance</li>
								<li class="mb-1">Administration des comptes utilisateurs</li>
								<li class="mb-1">Fonctionnalités sociales (amis)</li>
								<li class="mb-1">Enregistrement des statistiques de jeu et classements</li>
							</ul>
							</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.3 Durée de conservation</h3>
							<p class="mb-4">Vos données sont conservées pendant la durée du projet et jusqu'à 1 mois après l'évaluation finale.</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.4 Destinataires des données</h3>
							<p class="mb-4">Vos données peuvent être accessibles aux:
							<ul class="ml-5 list-disc">
								<li class="mb-1">Membres de l'équipe projet</li>
								<li class="mb-1">Corps enseignant et évaluateurs de l'école 42</li>
								<li class="mb-1">Autres utilisateurs (uniquement pour les données publiques de profil)</li>
							</ul>
							</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.5 Vos droits</h3>
							<p class="mb-4">Conformément au RGPD, vous disposez des droits suivants:
							<ul class="ml-5 list-disc">
								<li class="mb-1">Droit d'accès à vos données</li>
								<li class="mb-1">Droit de rectification</li>
								<li class="mb-1">Droit à l'effacement ("droit à l'oubli")</li>
								<li class="mb-1">Droit à la limitation du traitement</li>
								<li class="mb-1">Droit à la portabilité des données</li>
								<li class="mb-1">Droit d'opposition</li>
							</ul>
							Pour exercer ces droits, contactez-nous à: ozasahin@student.42lyon.fr
							</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.6 Mesures de sécurité</h3>
							<p class="mb-4">Nous mettons en œuvre les mesures techniques et organisationnelles suivantes:
							<ul class="ml-5 list-disc">
								<li class="mb-1">Chiffrement des mots de passe et données sensibles</li>
								<li class="mb-1">Authentification sécurisée (Google Sign-In)</li>
								<li class="mb-1">Double authentification (2FA)</li>
								<li class="mb-1">Sessions sécurisées avec expiration (JWT)</li>
								<li class="mb-1">Protection contre les vulnérabilités web courantes</li>
							</ul>
							</p>
							
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">7. Modification des CGU</h2>
							<p class="mb-4">Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront notifiés des changements importants.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">8. Durée et Résiliation</h2>
							<p class="mb-4">L'accès à notre service peut être suspendu ou résilié en cas de non-respect des présentes conditions.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">9. Transferts de données</h2>
							<p class="mb-4">Aucun transfert de données personnelles n'est effectué en dehors de l'Union Européenne. Toutes les données sont hébergées sur des serveurs situés dans l'UE.</p>
						</div>
						<button id="cgu-back-button" class="block w-36 mx-auto mt-8 px-4 py-3 bg-white bg-opacity-15 text-white border-none rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm border border-white border-opacity-10 tracking-wide hover:bg-opacity-25 hover:shadow-lg hover:shadow-white hover:shadow-opacity-40 hover:-translate-y-1" style="font-family: 'Black Ops One', sans-serif;">Retour</button>
					</div>
				</div>

				<!-- Politique de Confidentialité Modal -->
				<div id="privacy-policy-modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-lg hidden justify-center items-center z-50 overflow-y-auto">
					<div class="w-4/5 max-w-4xl max-h-[80vh] bg-white bg-opacity-10 backdrop-blur-[20px] rounded-3xl p-8 shadow-2xl overflow-y-auto border border-white border-opacity-15 scrollbar-hide">
						<h1 class="text-center text-3xl text-white mb-8 drop-shadow-md tracking-wide" style="font-family: 'Black Ops One', sans-serif;">Politique de Confidentialité</h1>
						<div class="text-white text-opacity-90 leading-relaxed mb-5 px-3">
							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">1. Introduction</h2>
							<p class="mb-4">Bienvenue dans notre Politique de Confidentialité. Elle décrit comment nous collectons, utilisons et protégeons vos données personnelles.</p>

							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">2. Données collectées</h2>
							<p class="mb-4">Nous collectons des données vous concernant lorsque vous utilisez notre service, notamment :</p>
							<ul class="ml-5 list-disc">
								<li class="mb-1">Données d'identification (ID interne, username, avatar)</li>
								<li class="mb-1">Données d'authentification (via Google Sign-In)</li>
								<li class="mb-1">Données de profil (statut, préférences)</li>
								<li class="mb-1">Données d'utilisation (historique des parties, scores, classement)</li>
							</ul>

							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">3. Utilisation des données</h2>
							<p class="mb-4">Nous utilisons vos données pour :</p>
							<ul class="ml-5 list-disc">
								<li class="mb-1">Fournir et améliorer notre service</li>
								<li class="mb-1">Administrer votre compte</li>
								<li class="mb-1">Vous proposer des fonctionnalités sociales (amis)</li>
								<li class="mb-1">Enregistrer vos statistiques de jeu et classements</li>
							</ul>

							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">4. Vos Droits</h2>
							<p class="mb-4">Conformément au RGPD, vous disposez des mêmes droits que ceux mentionnés dans les CGU.</p>

							<h2 class="text-xl mt-6 text-blue-300 tracking-wide" style="font-family: 'Black Ops One', sans-serif;">5. Modifications</h2>
							<p class="mb-4">Nous nous réservons le droit de modifier cette politique à tout moment. Les utilisateurs seront notifiés des changements importants.</p>
						</div>
						<button id="privacy-policy-back-button" class="block w-36 mx-auto mt-8 px-4 py-3 bg-white bg-opacity-15 text-white border-none rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm border border-white border-opacity-10 tracking-wide hover:bg-opacity-25 hover:shadow-lg hover:shadow-white hover:shadow-opacity-40 hover:-translate-y-1" style="font-family: 'Black Ops One', sans-serif;">Retour</button>
					</div>
				</div>

				<!-- Login Form -->
				<div class="absolute top-1/2 left-1/5 transform -translate-y-1/2 w-[30%] h-[55%] flex flex-col items-center justify-center bg-cover bg-no-repeat bg-center" id="loginform_id" style="background-image: url('./static/js/srcs/game/assets/image/homeV2.svg');">
					<h1 id="login-title" class="absolute top-[5%] left-1/2 transform -translate-x-1/2 text-white text-xl flex justify-center items-center drop-shadow-lg" style="font-family: 'Black Ops One', sans-serif;">LOGIN</h1>
					<div class="form-group"> 
						<form id="loginForm" class="loginForm flex flex-col items-center justify-center gap-5" onsubmit="login(event)">
							<div class="w-80 bg-white bg-opacity-10 backdrop-blur-lg p-5 rounded-2xl shadow-lg flex flex-col gap-5 absolute top-[53%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<div class="flex items-center gap-3 w-full">
									<label for="username" class="text-white text-sm w-[30%] text-right" style="font-family: 'Black Ops One', sans-serif;">Username :</label>
									<input type="text" id="login-username" name="username" placeholder="Your username" required class="w-[60%] p-3 border-none rounded-lg text-base outline-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:border focus:border-white focus:shadow-lg focus:shadow-white">
								</div>
								<div class="flex items-center gap-3 w-full">
									<label for="password" class="text-white text-sm w-[30%] text-right" style="font-family: 'Black Ops One', sans-serif;">Password :</label>
									<input type="password" id="login-password" name="password" placeholder="Your password" required class="w-[60%] p-3 border-none rounded-lg text-base outline-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:border focus:border-white focus:shadow-lg focus:shadow-white">
								</div>
								<button type="submit" class="connexion w-full p-3 border-none rounded-lg bg-white bg-opacity-15 text-black cursor-pointer mt-3 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-white" style="font-family: 'Black Ops One', sans-serif; font-size: 0.6vw;">Login</button>
								<button type="button" class="creer-compte w-full p-3 border-none rounded-lg bg-white bg-opacity-15 text-black cursor-pointer mt-3 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-white" id="create-Account" style="font-family: 'Black Ops One', sans-serif; font-size: 0.6vw;">Create an account</button>
								<!-- Google Sign In Button -->
								<div class="google-signin-container mt-4 flex justify-center w-full">
									<button type="button" class="google-signin-btn flex justify-center items-center gap-3 bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 text-sm cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-gray-50" id="google-signin-btn" style="font-family: 'Black Ops One', sans-serif;">
										<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5">
										Sign in with Google
									</button>
								</div>
							</div>
						</form>
						
						<form id="doubleAuthForm" class="doubleAuthForm hidden w-80 bg-white bg-opacity-10 backdrop-blur-lg p-5 rounded-2xl shadow-lg flex-col gap-5 absolute top-[53%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" onsubmit="verify2FA(event)">
							<div class="flex items-center gap-3 w-full">
								<label for="code" class="text-white text-sm w-[30%] text-right" style="font-family: 'Black Ops One', sans-serif;">2FA Code :</label>
								<input type="text" id="verify-2fa-code" name="code" placeholder="123456" required class="w-[60%] p-3 border-none rounded-lg text-base outline-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:border focus:border-white focus:shadow-lg focus:shadow-white">
							</div>
							<button type="submit" class="connexion w-full p-3 border-none rounded-lg bg-white bg-opacity-15 text-black cursor-pointer mt-3 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-white" style="font-family: 'Black Ops One', sans-serif;">Validate</button>
						</form>
					</div>
				</div>

				<!-- Register Form -->
				<div class="register-form absolute top-1/2 left-1/5 transform -translate-y-1/2 w-[30%] h-[55%] hidden flex-col items-center justify-center bg-cover bg-no-repeat bg-center" id="create_account_id" style="background-image: url('./static/js/srcs/game/assets/image/homeV2.svg');">
					<h1 class="absolute top-[5%] left-1/2 transform -translate-x-1/2 text-white text-xl flex justify-center items-center drop-shadow-lg" style="font-family: 'Black Ops One', sans-serif;">SIGN IN</h1>
					<div class="form-group">
						<form id="registerForm" onsubmit="register(event)">
							<div class="w-80 bg-white bg-opacity-10 backdrop-blur-lg p-5 rounded-2xl shadow-lg flex flex-col gap-5 absolute top-[53%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<div class="flex items-center gap-3 w-full">
									<label for="username" class="text-white text-sm w-[30%] text-right" style="font-family: 'Black Ops One', sans-serif;">Username :</label>
									<input type="text" id="register-username" name="username" placeholder="Your username" required class="w-[60%] p-3 border-none rounded-lg text-base outline-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:border focus:border-white focus:shadow-lg focus:shadow-white">
								</div>
								<div class="flex items-center gap-3 w-full">
									<label for="password" class="text-white text-sm w-[30%] text-right" style="font-family: 'Black Ops One', sans-serif;">Password :</label>
									<input type="password" id="register-password" name="password" placeholder="Your password" required class="w-[60%] p-3 border-none rounded-lg text-base outline-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:border focus:border-white focus:shadow-lg focus:shadow-white">
								</div>
								<div class="flex items-center gap-3 w-full">
									<label for="confirm-password" class="text-white text-sm w-[30%] text-right" style="font-family: 'Black Ops One', sans-serif;">Confirm password :</label>
									<input type="password" id="register-confirm-password" name="password" placeholder="Confirm your password" required class="w-[60%] p-3 border-none rounded-lg text-base outline-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:border focus:border-white focus:shadow-lg focus:shadow-white">
								</div>
								<div class="flex items-start my-3 w-full">
									<input type="checkbox" id="accept-cgu" name="accept-cgu" required class="w-auto flex-shrink-0 w-5 mt-1 mr-3">
									<label for="accept-cgu" class="flex-1 text-left text-sm break-words whitespace-normal text-white" style="font-family: 'Black Ops One', sans-serif;">J'accepte les <a href="#" id="show-cgu" class="text-blue-300 underline transition-colors duration-200 hover:text-white">Conditions Générales d'Utilisation</a></label>
								</div>
								
								<button type="submit" class="connexion w-full p-3 border-none rounded-lg bg-white bg-opacity-15 text-black cursor-pointer mt-3 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-white" style="font-family: 'Black Ops One', sans-serif;">Sign In</button>
								<button type="button" class="connexion w-full p-3 border-none rounded-lg bg-white bg-opacity-15 text-black cursor-pointer mt-3 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-white" id="alreadyHaveAccountButton_id" style="font-family: 'Black Ops One', sans-serif;">Already have an account ?</button>
								<div class="google-signin-container mt-4 flex justify-center w-full">
									<button type="button" class="google-signin-btn flex justify-center items-center gap-3 bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 text-sm cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-gray-50" id="google-signup-btn" style="font-family: 'Black Ops One', sans-serif;">
										<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5">
										Sign up with Google
									</button>
								</div>
								<div class="privacy-policy-container flex justify-center mt-5">
									<label class="text-center text-sm text-blue-300" style="font-family: 'Black Ops One', sans-serif;"><a href="#" id="show-privacy-policy" class="text-blue-300 underline transition-colors duration-200 hover:text-white">Politique de Confidentialité</a></label>
								</div>
							</div>
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

		// Gestion de la Politique de Confidentialité
        const showPrivacyPolicyLink = document.getElementById("show-privacy-policy");
        const privacyPolicyModal = document.getElementById("privacy-policy-modal");
        const privacyPolicyBackButton = document.getElementById("privacy-policy-back-button");

        // Afficher la Politique de Confidentialité quand on clique sur le lien
        showPrivacyPolicyLink?.addEventListener("click", (e) => {
            e.preventDefault();
            privacyPolicyModal?.classList.add("active");
        });

        // Cacher la Politique de Confidentialité quand on clique sur "Retour"
        privacyPolicyBackButton?.addEventListener("click", () => {
            privacyPolicyModal?.classList.remove("active");
        });
		

		createAccountButton.addEventListener("click", () => {
			console.log("createAccountForm");
			loginForm.classList.add("active");
			createAccountForm.classList.add("active");
			(document.getElementById("login-username") as HTMLInputElement).value = "";
			(document.getElementById("login-password") as HTMLInputElement).value = "";
		});

		alreadyHaveAccountButton.addEventListener("click", () => {
			console.log("loginForm");
			createAccountForm.classList.remove("active");
			loginForm.classList.remove("active");
			(document.getElementById("registerForm") as HTMLFormElement).reset();
		});

		//* GOOGLE SIGN IN
		// Ajouter l'événement pour le bouton Google
		const googleSignInBtn = document.getElementById("google-signin-btn");
		const googleSignUpBtn = document.getElementById("google-signup-btn");

		const handleGoogleAuth = () => {
			if (typeof tokenClient !== 'undefined' && tokenClient) {
				tokenClient.requestAccessToken();
			} else {
				console.error("Client Google OAuth non initialisé");
				notif("Connexion Google non disponible", false);
			}
		};

		googleSignInBtn?.addEventListener("click", handleGoogleAuth);
		googleSignUpBtn?.addEventListener("click", handleGoogleAuth);

		// Initialiser Google Sign In
		window.addEventListener("load", () => {
			initGoogleSignIn();
		});

	}
}