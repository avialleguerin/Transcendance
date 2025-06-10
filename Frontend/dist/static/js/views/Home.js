import AbstractView from "./AbstractView.js";
//---
export default class Home extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken && accessToken !== undefined) {
            history;
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
    async getHtml() {
        return /*html*/ `
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

				<!-- Politique de Confidentialité Modal -->
				<div id="privacy-policy-modal" class="cgu-modal">
					<div class="cgu-content">
						<h1>Politique de Confidentialité</h1>
						<div class="cgu-text">
							<h2>1. Introduction</h2>
							<p>Bienvenue dans notre Politique de Confidentialité. Elle décrit comment nous collectons, utilisons et protégeons vos données personnelles.</p>

							<h2>2. Données collectées</h2>
							<p>Nous collectons des données vous concernant lorsque vous utilisez notre service, notamment :</p>
							<ul>
								<li>Données d'identification (ID interne, username, avatar)</li>
								<li>Données d'authentification (via Google Sign-In)</li>
								<li>Données de profil (statut, préférences)</li>
								<li>Données d'utilisation (historique des parties, scores, classement)</li>
							</ul>

							<h2>3. Utilisation des données</h2>
							<p>Nous utilisons vos données pour :</p>
							<ul>
								<li>Fournir et améliorer notre service</li>
								<li>Administrer votre compte</li>
								<li>Vous proposer des fonctionnalités sociales (amis)</li>
								<li>Enregistrer vos statistiques de jeu et classements</li>
							</ul>

							<h2>4. Vos Droits</h2>
							<p>Conformément au RGPD, vous disposez des mêmes droits que ceux mentionnés dans les CGU.</p>

							<h2>5. Modifications</h2>
							<p>Nous nous réservons le droit de modifier cette politique à tout moment. Les utilisateurs seront notifiés des changements importants.</p>
						</div>
						<button id="privacy-policy-back-button" class="cgu-back-button">Retour</button>
					</div>
				</div>

				<div class="login-form" id="loginform_id">
					<h1 id="login-title">LOGIN</h1>
					<div class="form-group"> 
						<form id="loginForm" class="loginForm" onsubmit="login(event)">
							<div class="input-container">
								<label for="username">Username :</label>
								<input type="text" id="login-username" name="username" placeholder="Your username" required>
							</div>
							<div class="input-container">
								<label for="password">Password :</label>
								<input type="password" id="login-password" name="password" placeholder="Your password" required>
							</div>
							<button type="submit" class="connexion" id="validate-login">Login</button>
							<button type="button" class="creer-compte" id="create-Account">Create an account</button>
							<!-- Nouveau bouton Google Sign In -->
							<div class="google-signin-container">
								<button type="button" class="google-signin-btn" id="google-signin-btn">
									<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google">
									Sign in with Google
								</button>
							</div>

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
							<div class="google-signin-container">
								<button type="button" class="google-signin-btn" id="google-signup-btn">
									<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google">
									Sign up with Google
								</button>
							</div>
							<div class="privacy-policy-container">
								<label><a href="#" id="show-privacy-policy" class="cgu-link">Politique de Confidentialité</a></label>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div id="notification-container" class="fixed top-0 left-0 right-0 flex justify-center z-50 mt-4">
				<p id="resultMessage" class="py-2 px-4 rounded shadow-lg transition-all duration-300 transform translate-y-0 opacity-0"></p>
			</div>
`;
    }
    createAccount() {
        //*===== Form Management =====*/
        const loginForm = document.getElementById("loginform_id");
        const createAccountForm = document.getElementById("create_account_id");
        const createAccountButton = document.getElementById("create-Account");
        const alreadyHaveAccountButton = document.getElementById("alreadyHaveAccountButton_id");
        const doubleAuthForm = document.getElementById("doubleAuthForm");
        const backButton = document.getElementById("back");
        createAccountButton.addEventListener("click", () => {
            console.log("createAccountForm");
            loginForm.classList.add("active");
            createAccountForm.classList.add("active");
            document.getElementById("login-username").value = "";
            document.getElementById("login-password").value = "";
        });
        alreadyHaveAccountButton.addEventListener("click", () => {
            console.log("loginForm");
            createAccountForm.classList.remove("active");
            loginForm.classList.remove("active");
            document.getElementById("registerForm").reset();
        });
        //*===== CGU and Privacy Policy Management =====*/
        const showCguLink = document.getElementById("show-cgu");
        const cguModal = document.getElementById("cgu-modal");
        const cguBackButton = document.getElementById("cgu-back-button");
        showCguLink?.addEventListener("click", (e) => { e.preventDefault(); cguModal?.classList.add("active"); });
        cguBackButton?.addEventListener("click", () => { cguModal?.classList.remove("active"); });
        const showPrivacyPolicyLink = document.getElementById("show-privacy-policy");
        const privacyPolicyModal = document.getElementById("privacy-policy-modal");
        const privacyPolicyBackButton = document.getElementById("privacy-policy-back-button");
        showPrivacyPolicyLink?.addEventListener("click", (e) => { e.preventDefault(); privacyPolicyModal?.classList.add("active"); });
        privacyPolicyBackButton?.addEventListener("click", () => { privacyPolicyModal?.classList.remove("active"); });
        //*==== Google Sign-In =====*/
        const googleSignInBtn = document.getElementById("google-signin-btn");
        const googleSignUpBtn = document.getElementById("google-signup-btn");
        const handleGoogleAuth = () => {
            if (typeof tokenClient !== 'undefined' && tokenClient) {
                tokenClient.requestAccessToken();
            }
            else {
                console.error("Client Google OAuth non initialisé");
                notif("Connexion Google non disponible", false);
            }
        };
        googleSignInBtn?.addEventListener("click", handleGoogleAuth);
        googleSignUpBtn?.addEventListener("click", handleGoogleAuth);
        window.addEventListener("load", () => { initGoogleSignIn(); });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3MvSG9tZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQVE3QyxLQUFLO0FBR0wsTUFBTSxDQUFDLE9BQU8sT0FBTyxJQUFLLFNBQVEsWUFBWTtJQUM3QztRQUNDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QixNQUFNLFdBQVcsR0FBbUIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRSxJQUFJLFdBQVcsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDOUMsT0FBTyxDQUFBO1lBQ1AsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN0QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNoQyxNQUFNLGdCQUFnQixHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ3hDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdEMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNoRCxJQUFJLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNoQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDOUIsQ0FBQztnQkFDRixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQztJQUNGLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNaLE9BQU8sUUFBUSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBNk1oQixDQUFDO0lBQUEsQ0FBQztJQUVGLGFBQWE7UUFDWixnQ0FBZ0M7UUFDaEMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxRCxNQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN2RSxNQUFNLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxNQUFNLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUN4RixNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakUsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuRCxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNqQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQXNCLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUMxRSxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFzQixDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFFSCx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekIsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBcUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUVILGtEQUFrRDtRQUNsRCxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRWpFLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUcsYUFBYSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxRQUFRLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBGLE1BQU0scUJBQXFCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sdUJBQXVCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBRXRGLHFCQUFxQixFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlILHVCQUF1QixFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxrQkFBa0IsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEgsOEJBQThCO1FBQzlCLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNyRSxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFckUsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLEVBQUU7WUFDN0IsSUFBSSxPQUFPLFdBQVcsS0FBSyxXQUFXLElBQUksV0FBVyxFQUFFLENBQUM7Z0JBQ3ZELFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2xDLENBQUM7aUJBQU0sQ0FBQztnQkFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7Z0JBQ3BELEtBQUssQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNqRCxDQUFDO1FBQ0YsQ0FBQyxDQUFDO1FBRUYsZUFBZSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdELGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuLy8gaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcbi8vIGltcG9ydCBHYW1lX21lbnUgZnJvbSBcIi4vR2FtZV9tZW51LmpzXCI7XG5cbi8vIETDqWNsYXJhdGlvbnMgZGVzIGZvbmN0aW9ucyBleHRlcm5lc1xuZGVjbGFyZSBmdW5jdGlvbiBub3RpZihtZXNzYWdlOiBzdHJpbmcsIHN1Y2Nlc3M6IGJvb2xlYW4pOiB2b2lkO1xuZGVjbGFyZSBmdW5jdGlvbiBpbml0R29vZ2xlU2lnbkluKCk6IHZvaWQ7XG5kZWNsYXJlIHZhciB0b2tlbkNsaWVudDogYW55O1xuLy8tLS1cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb21lIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwiSG9tZVwiKTtcblx0XHRjb25zdCBhY2Nlc3NUb2tlbiA6IHN0cmluZyB8IG51bGwgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwiYWNjZXNzVG9rZW5cIik7XG5cdFx0aWYgKGFjY2Vzc1Rva2VuICYmIGFjY2Vzc1Rva2VuICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGhpc3Rvcnlcblx0XHRcdGltcG9ydCgnLi9HYW1lX21lbnUuanMnKS50aGVuKG1vZHVsZSA9PiB7XG5cdFx0XHRcdGNvbnN0IEdhbWVNZW51ID0gbW9kdWxlLmRlZmF1bHQ7XG5cdFx0XHRcdGNvbnN0IGdhbWVNZW51SW5zdGFuY2UgPSBuZXcgR2FtZU1lbnUoKTtcblx0XHRcdFx0Z2FtZU1lbnVJbnN0YW5jZS5nZXRIdG1sKCkudGhlbihodG1sID0+IHtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRcdFx0XHRpZiAoZ2FtZU1lbnVJbnN0YW5jZS5nYW1lX21lbnUpIHtcblx0XHRcdFx0XHRcdGdhbWVNZW51SW5zdGFuY2UuZ2FtZV9tZW51KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGFzeW5jIGdldEh0bWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcblx0XHRyZXR1cm4gLypodG1sKi9gXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi4vc3RhdGljL2pzL2Nzcy9ob21lLmNzc1wiPlxuXHRcdFx0PGxpbmsgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmxhY2srT3BzK09uZSZkaXNwbGF5PXN3YXBcIiByZWw9XCJzdHlsZXNoZWV0XCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWxvZ2luXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlxuXHRcdFx0XHRcdDxoMT4gVFJBTlNDRU5ERU5DRSA8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8IS0tIENHVSBNb2RhbCAtLT5cblx0XHRcdFx0PGRpdiBpZD1cImNndS1tb2RhbFwiIGNsYXNzPVwiY2d1LW1vZGFsXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNndS1jb250ZW50XCI+XG5cdFx0XHRcdFx0XHQ8aDE+Q29uZGl0aW9ucyBHw6luw6lyYWxlcyBkJ1V0aWxpc2F0aW9uPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjZ3UtdGV4dFwiPlxuXHRcdFx0XHRcdFx0XHQ8aDI+MS4gSW50cm9kdWN0aW9uPC9oMj5cblx0XHRcdFx0XHRcdFx0PHA+QmllbnZlbnVlIHN1ciBUcmFuc2NlbmRhbmNlLiBFbiB1dGlsaXNhbnQgbm90cmUgYXBwbGljYXRpb24sIHZvdXMgYWNjZXB0ZXogbGVzIHByw6lzZW50ZXMgY29uZGl0aW9ucyBnw6luw6lyYWxlcyBkJ3V0aWxpc2F0aW9uLjwvcD5cblx0XHRcdFx0XHRcdFx0PHA+UmVzcG9uc2FibGUgZHUgdHJhaXRlbWVudDogw4lxdWlwZSBwcm9qZXQgVHJhbnNjZW5kYW5jZSAtIMOJY29sZSA0Mjxicj5cblx0XHRcdFx0XHRcdFx0Q29udGFjdDogb3phc2FoaW5Ac3R1ZGVudC40Mmx5b24uZnI8YnI+XG5cdFx0XHRcdFx0XHRcdETDqWzDqWd1w6kgw6AgbGEgUHJvdGVjdGlvbiBkZXMgRG9ubsOpZXMgKERQTyk6IE0uIFNBSElOIE8uPC9wPlxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0PGgyPjIuIERlc2NyaXB0aW9uIGR1IFNlcnZpY2U8L2gyPlxuXHRcdFx0XHRcdFx0XHQ8cD5UcmFuc2NlbmRhbmNlIGVzdCB1bmUgcGxhdGVmb3JtZSBkZSBqZXUgZW4gbGlnbmUgcGVybWV0dGFudCBhdXggdXRpbGlzYXRldXJzIGRlIGpvdWVyIMOgIFBvbmcgZXQgZCdhdXRyZXMgamV1eCwgZGUgY29tbXVuaXF1ZXIgZXQgZCdpbnRlcmFnaXIgYXZlYyBkJ2F1dHJlcyB1dGlsaXNhdGV1cnMuPC9wPlxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0PGgyPjMuIEluc2NyaXB0aW9uIGV0IENvbXB0ZTwvaDI+XG5cdFx0XHRcdFx0XHRcdDxwPlBvdXIgdXRpbGlzZXIgbm90cmUgc2VydmljZSwgdm91cyBkZXZleiBjcsOpZXIgdW4gY29tcHRlIGF2ZWMgZGVzIGluZm9ybWF0aW9ucyBleGFjdGVzIGV0IMOgIGpvdXIuIE5vdXMgY29sbGVjdG9ucyB1bmlxdWVtZW50IGxlcyBkb25uw6llcyBuw6ljZXNzYWlyZXMgw6AgbGEgZm91cm5pdHVyZSBkZSBub3Mgc2VydmljZXMuPC9wPlxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0PGgyPjQuIENvbXBvcnRlbWVudCBkZXMgVXRpbGlzYXRldXJzPC9oMj5cblx0XHRcdFx0XHRcdFx0PHA+TGVzIHV0aWxpc2F0ZXVycyBzJ2VuZ2FnZW50IMOgIHJlc3BlY3RlciBsZXMgYXV0cmVzIG1lbWJyZXMgZXQgw6AgbmUgcGFzIHB1YmxpZXIgZGUgY29udGVudSBvZmZlbnNhbnQgb3UgaWxsw6lnYWwuPC9wPlxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0PGgyPjUuIFByb3ByacOpdMOpIEludGVsbGVjdHVlbGxlPC9oMj5cblx0XHRcdFx0XHRcdFx0PHA+VG91cyBsZXMgZHJvaXRzIGRlIHByb3ByacOpdMOpIGludGVsbGVjdHVlbGxlIGxpw6lzIMOgIFRyYW5zY2VuZGFuY2UgYXBwYXJ0aWVubmVudCDDoCBsZXVycyBwcm9wcmnDqXRhaXJlcyByZXNwZWN0aWZzLjwvcD5cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdDxoMj42LiBQcm90ZWN0aW9uIGRlcyBEb25uw6llczwvaDI+XG5cdFx0XHRcdFx0XHRcdDxwPk5vdXMgbm91cyBlbmdhZ2VvbnMgw6AgcHJvdMOpZ2VyIHZvcyBkb25uw6llcyBwZXJzb25uZWxsZXMgY29uZm9ybcOpbWVudCBhdSBSw6hnbGVtZW50IEfDqW7DqXJhbCBzdXIgbGEgUHJvdGVjdGlvbiBkZXMgRG9ubsOpZXMgKFJHUEQpLjwvcD5cblx0XHRcdFx0XHRcdFx0PGgzPjYuMSBEb25uw6llcyBjb2xsZWN0w6llczwvaDM+XG5cdFx0XHRcdFx0XHRcdDxwPk5vdXMgY29sbGVjdG9ucyBsZXMgY2F0w6lnb3JpZXMgZGUgZG9ubsOpZXMgc3VpdmFudGVzOlxuXHRcdFx0XHRcdFx0XHQ8dWw+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkRvbm7DqWVzIGQnaWRlbnRpZmljYXRpb24gKElEIGludGVybmUsIHVzZXJuYW1lLCBhdmF0YXIpPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+RG9ubsOpZXMgZCdhdXRoZW50aWZpY2F0aW9uICh2aWEgR29vZ2xlIFNpZ24tSW4pPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+RG9ubsOpZXMgZGUgcHJvZmlsIChzdGF0dXQsIHByw6lmw6lyZW5jZXMpPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+RG9ubsOpZXMgZCd1dGlsaXNhdGlvbiAoaGlzdG9yaXF1ZSBkZXMgcGFydGllcywgc2NvcmVzLCBjbGFzc2VtZW50KTwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHRcdDwvcD5cblx0XHRcdFx0XHRcdFx0PGgzPjYuMiBGaW5hbGl0w6lzIGR1IHRyYWl0ZW1lbnQ8L2gzPlxuXHRcdFx0XHRcdFx0XHQ8cD5Wb3MgZG9ubsOpZXMgc29udCB0cmFpdMOpZXMgcG91ciBsZXMgZmluYWxpdMOpcyBzdWl2YW50ZXM6XG5cdFx0XHRcdFx0XHRcdDx1bD5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+Rm91cm5pdHVyZSBkdSBzZXJ2aWNlIGRlIGpldSBlbiBsaWduZSBUcmFuc2NlbmRhbmNlPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+QWRtaW5pc3RyYXRpb24gZGVzIGNvbXB0ZXMgdXRpbGlzYXRldXJzPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+Rm9uY3Rpb25uYWxpdMOpcyBzb2NpYWxlcyAoYW1pcyk8L2xpPlxuXHRcdFx0XHRcdFx0XHRcdDxsaT5FbnJlZ2lzdHJlbWVudCBkZXMgc3RhdGlzdGlxdWVzIGRlIGpldSBldCBjbGFzc2VtZW50czwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHRcdDwvcD5cblx0XHRcdFx0XHRcdFx0PGgzPjYuMyBEdXLDqWUgZGUgY29uc2VydmF0aW9uPC9oMz5cblx0XHRcdFx0XHRcdFx0PHA+Vm9zIGRvbm7DqWVzIHNvbnQgY29uc2VydsOpZXMgcGVuZGFudCBsYSBkdXLDqWUgZHUgcHJvamV0IGV0IGp1c3F1J8OgIDEgbW9pcyBhcHLDqHMgbCfDqXZhbHVhdGlvbiBmaW5hbGUuPC9wPlxuXHRcdFx0XHRcdFx0XHQ8aDM+Ni40IERlc3RpbmF0YWlyZXMgZGVzIGRvbm7DqWVzPC9oMz5cblx0XHRcdFx0XHRcdFx0PHA+Vm9zIGRvbm7DqWVzIHBldXZlbnQgw6p0cmUgYWNjZXNzaWJsZXMgYXV4OlxuXHRcdFx0XHRcdFx0XHQ8dWw+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPk1lbWJyZXMgZGUgbCfDqXF1aXBlIHByb2pldDwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkNvcnBzIGVuc2VpZ25hbnQgZXQgw6l2YWx1YXRldXJzIGRlIGwnw6ljb2xlIDQyPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+QXV0cmVzIHV0aWxpc2F0ZXVycyAodW5pcXVlbWVudCBwb3VyIGxlcyBkb25uw6llcyBwdWJsaXF1ZXMgZGUgcHJvZmlsKTwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHRcdDwvcD5cblx0XHRcdFx0XHRcdFx0PGgzPjYuNSBWb3MgZHJvaXRzPC9oMz5cblx0XHRcdFx0XHRcdFx0PHA+Q29uZm9ybcOpbWVudCBhdSBSR1BELCB2b3VzIGRpc3Bvc2V6IGRlcyBkcm9pdHMgc3VpdmFudHM6XG5cdFx0XHRcdFx0XHRcdDx1bD5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+RHJvaXQgZCdhY2PDqHMgw6Agdm9zIGRvbm7DqWVzPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+RHJvaXQgZGUgcmVjdGlmaWNhdGlvbjwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkRyb2l0IMOgIGwnZWZmYWNlbWVudCAoXCJkcm9pdCDDoCBsJ291YmxpXCIpPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+RHJvaXQgw6AgbGEgbGltaXRhdGlvbiBkdSB0cmFpdGVtZW50PC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+RHJvaXQgw6AgbGEgcG9ydGFiaWxpdMOpIGRlcyBkb25uw6llczwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkRyb2l0IGQnb3Bwb3NpdGlvbjwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHRcdFBvdXIgZXhlcmNlciBjZXMgZHJvaXRzLCBjb250YWN0ZXotbm91cyDDoDogb3phc2FoaW5Ac3R1ZGVudC40Mmx5b24uZnJcblx0XHRcdFx0XHRcdFx0PC9wPlxuXHRcdFx0XHRcdFx0XHQ8aDM+Ni42IE1lc3VyZXMgZGUgc8OpY3VyaXTDqTwvaDM+XG5cdFx0XHRcdFx0XHRcdDxwPk5vdXMgbWV0dG9ucyBlbiDFk3V2cmUgbGVzIG1lc3VyZXMgdGVjaG5pcXVlcyBldCBvcmdhbmlzYXRpb25uZWxsZXMgc3VpdmFudGVzOlxuXHRcdFx0XHRcdFx0XHQ8dWw+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkNoaWZmcmVtZW50IGRlcyBtb3RzIGRlIHBhc3NlIGV0IGRvbm7DqWVzIHNlbnNpYmxlczwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkF1dGhlbnRpZmljYXRpb24gc8OpY3VyaXPDqWUgKEdvb2dsZSBTaWduLUluKTwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkRvdWJsZSBhdXRoZW50aWZpY2F0aW9uICgyRkEpPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+U2Vzc2lvbnMgc8OpY3VyaXPDqWVzIGF2ZWMgZXhwaXJhdGlvbiAoSldUKTwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPlByb3RlY3Rpb24gY29udHJlIGxlcyB2dWxuw6lyYWJpbGl0w6lzIHdlYiBjb3VyYW50ZXM8L2xpPlxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHRcdFx0XHQ8L3A+XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQ8aDI+Ny4gTW9kaWZpY2F0aW9uIGRlcyBDR1U8L2gyPlxuXHRcdFx0XHRcdFx0XHQ8cD5Ob3VzIG5vdXMgcsOpc2Vydm9ucyBsZSBkcm9pdCBkZSBtb2RpZmllciBjZXMgY29uZGl0aW9ucyDDoCB0b3V0IG1vbWVudC4gTGVzIHV0aWxpc2F0ZXVycyBzZXJvbnQgbm90aWZpw6lzIGRlcyBjaGFuZ2VtZW50cyBpbXBvcnRhbnRzLjwvcD5cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdDxoMj44LiBEdXLDqWUgZXQgUsOpc2lsaWF0aW9uPC9oMj5cblx0XHRcdFx0XHRcdFx0PHA+TCdhY2PDqHMgw6Agbm90cmUgc2VydmljZSBwZXV0IMOqdHJlIHN1c3BlbmR1IG91IHLDqXNpbGnDqSBlbiBjYXMgZGUgbm9uLXJlc3BlY3QgZGVzIHByw6lzZW50ZXMgY29uZGl0aW9ucy48L3A+XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQ8aDI+OS4gVHJhbnNmZXJ0cyBkZSBkb25uw6llczwvaDI+XG5cdFx0XHRcdFx0XHRcdDxwPkF1Y3VuIHRyYW5zZmVydCBkZSBkb25uw6llcyBwZXJzb25uZWxsZXMgbidlc3QgZWZmZWN0dcOpIGVuIGRlaG9ycyBkZSBsJ1VuaW9uIEV1cm9ww6llbm5lLiBUb3V0ZXMgbGVzIGRvbm7DqWVzIHNvbnQgaMOpYmVyZ8OpZXMgc3VyIGRlcyBzZXJ2ZXVycyBzaXR1w6lzIGRhbnMgbCdVRS48L3A+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJjZ3UtYmFjay1idXR0b25cIiBjbGFzcz1cImNndS1iYWNrLWJ1dHRvblwiPlJldG91cjwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8IS0tIFBvbGl0aXF1ZSBkZSBDb25maWRlbnRpYWxpdMOpIE1vZGFsIC0tPlxuXHRcdFx0XHQ8ZGl2IGlkPVwicHJpdmFjeS1wb2xpY3ktbW9kYWxcIiBjbGFzcz1cImNndS1tb2RhbFwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjZ3UtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0PGgxPlBvbGl0aXF1ZSBkZSBDb25maWRlbnRpYWxpdMOpPC9oMT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjZ3UtdGV4dFwiPlxuXHRcdFx0XHRcdFx0XHQ8aDI+MS4gSW50cm9kdWN0aW9uPC9oMj5cblx0XHRcdFx0XHRcdFx0PHA+QmllbnZlbnVlIGRhbnMgbm90cmUgUG9saXRpcXVlIGRlIENvbmZpZGVudGlhbGl0w6kuIEVsbGUgZMOpY3JpdCBjb21tZW50IG5vdXMgY29sbGVjdG9ucywgdXRpbGlzb25zIGV0IHByb3TDqWdlb25zIHZvcyBkb25uw6llcyBwZXJzb25uZWxsZXMuPC9wPlxuXG5cdFx0XHRcdFx0XHRcdDxoMj4yLiBEb25uw6llcyBjb2xsZWN0w6llczwvaDI+XG5cdFx0XHRcdFx0XHRcdDxwPk5vdXMgY29sbGVjdG9ucyBkZXMgZG9ubsOpZXMgdm91cyBjb25jZXJuYW50IGxvcnNxdWUgdm91cyB1dGlsaXNleiBub3RyZSBzZXJ2aWNlLCBub3RhbW1lbnQgOjwvcD5cblx0XHRcdFx0XHRcdFx0PHVsPlxuXHRcdFx0XHRcdFx0XHRcdDxsaT5Eb25uw6llcyBkJ2lkZW50aWZpY2F0aW9uIChJRCBpbnRlcm5lLCB1c2VybmFtZSwgYXZhdGFyKTwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkRvbm7DqWVzIGQnYXV0aGVudGlmaWNhdGlvbiAodmlhIEdvb2dsZSBTaWduLUluKTwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkRvbm7DqWVzIGRlIHByb2ZpbCAoc3RhdHV0LCBwcsOpZsOpcmVuY2VzKTwvbGk+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkRvbm7DqWVzIGQndXRpbGlzYXRpb24gKGhpc3RvcmlxdWUgZGVzIHBhcnRpZXMsIHNjb3JlcywgY2xhc3NlbWVudCk8L2xpPlxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxuXG5cdFx0XHRcdFx0XHRcdDxoMj4zLiBVdGlsaXNhdGlvbiBkZXMgZG9ubsOpZXM8L2gyPlxuXHRcdFx0XHRcdFx0XHQ8cD5Ob3VzIHV0aWxpc29ucyB2b3MgZG9ubsOpZXMgcG91ciA6PC9wPlxuXHRcdFx0XHRcdFx0XHQ8dWw+XG5cdFx0XHRcdFx0XHRcdFx0PGxpPkZvdXJuaXIgZXQgYW3DqWxpb3JlciBub3RyZSBzZXJ2aWNlPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+QWRtaW5pc3RyZXIgdm90cmUgY29tcHRlPC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8bGk+Vm91cyBwcm9wb3NlciBkZXMgZm9uY3Rpb25uYWxpdMOpcyBzb2NpYWxlcyAoYW1pcyk8L2xpPlxuXHRcdFx0XHRcdFx0XHRcdDxsaT5FbnJlZ2lzdHJlciB2b3Mgc3RhdGlzdGlxdWVzIGRlIGpldSBldCBjbGFzc2VtZW50czwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cblx0XHRcdFx0XHRcdFx0PGgyPjQuIFZvcyBEcm9pdHM8L2gyPlxuXHRcdFx0XHRcdFx0XHQ8cD5Db25mb3Jtw6ltZW50IGF1IFJHUEQsIHZvdXMgZGlzcG9zZXogZGVzIG3Dqm1lcyBkcm9pdHMgcXVlIGNldXggbWVudGlvbm7DqXMgZGFucyBsZXMgQ0dVLjwvcD5cblxuXHRcdFx0XHRcdFx0XHQ8aDI+NS4gTW9kaWZpY2F0aW9uczwvaDI+XG5cdFx0XHRcdFx0XHRcdDxwPk5vdXMgbm91cyByw6lzZXJ2b25zIGxlIGRyb2l0IGRlIG1vZGlmaWVyIGNldHRlIHBvbGl0aXF1ZSDDoCB0b3V0IG1vbWVudC4gTGVzIHV0aWxpc2F0ZXVycyBzZXJvbnQgbm90aWZpw6lzIGRlcyBjaGFuZ2VtZW50cyBpbXBvcnRhbnRzLjwvcD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInByaXZhY3ktcG9saWN5LWJhY2stYnV0dG9uXCIgY2xhc3M9XCJjZ3UtYmFjay1idXR0b25cIj5SZXRvdXI8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImxvZ2luLWZvcm1cIiBpZD1cImxvZ2luZm9ybV9pZFwiPlxuXHRcdFx0XHRcdDxoMSBpZD1cImxvZ2luLXRpdGxlXCI+TE9HSU48L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+IFxuXHRcdFx0XHRcdFx0PGZvcm0gaWQ9XCJsb2dpbkZvcm1cIiBjbGFzcz1cImxvZ2luRm9ybVwiIG9uc3VibWl0PVwibG9naW4oZXZlbnQpXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwidXNlcm5hbWVcIj5Vc2VybmFtZSA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImxvZ2luLXVzZXJuYW1lXCIgbmFtZT1cInVzZXJuYW1lXCIgcGxhY2Vob2xkZXI9XCJZb3VyIHVzZXJuYW1lXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInBhc3N3b3JkXCI+UGFzc3dvcmQgOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwibG9naW4tcGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIllvdXIgcGFzc3dvcmRcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiY29ubmV4aW9uXCIgaWQ9XCJ2YWxpZGF0ZS1sb2dpblwiPkxvZ2luPC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY3JlZXItY29tcHRlXCIgaWQ9XCJjcmVhdGUtQWNjb3VudFwiPkNyZWF0ZSBhbiBhY2NvdW50PC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDwhLS0gTm91dmVhdSBib3V0b24gR29vZ2xlIFNpZ24gSW4gLS0+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJnb29nbGUtc2lnbmluLWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZ29vZ2xlLXNpZ25pbi1idG5cIiBpZD1cImdvb2dsZS1zaWduaW4tYnRuXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cImh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2lkZW50aXR5L2ltYWdlcy9nLWxvZ28ucG5nXCIgYWx0PVwiR29vZ2xlXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRTaWduIGluIHdpdGggR29vZ2xlXG5cdFx0XHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdDxmb3JtIGlkPVwiZG91YmxlQXV0aEZvcm1cIiBjbGFzcz1cImRvdWJsZUF1dGhGb3JtXCIgb25zdWJtaXQ9XCJ2ZXJpZnkyRkEoZXZlbnQpXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwiY29kZVwiPjJGQSBDb2RlIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidmVyaWZ5LTJmYS1jb2RlXCIgbmFtZT1cImNvZGVcIiBwbGFjZWhvbGRlcj1cIjEyMzQ1NlwiIHJlcXVpcmVkPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJjb25uZXhpb25cIj5WYWxpZGF0ZTwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBpZD1cImNyZWF0ZV9hY2NvdW50X2lkXCI+XG5cdFx0XHRcdFx0PGgxPlNJR04gSU48L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0XHQ8Zm9ybSBpZD1cInJlZ2lzdGVyRm9ybVwiIG9uc3VibWl0PVwicmVnaXN0ZXIoZXZlbnQpXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwidXNlcm5hbWVcIj5Vc2VybmFtZSA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicmVnaXN0ZXItdXNlcm5hbWVcIiBuYW1lPVwidXNlcm5hbWVcIiBwbGFjZWhvbGRlcj1cIllvdXIgdXNlcm5hbWVcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZCA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cInJlZ2lzdGVyLXBhc3N3b3JkXCIgbmFtZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJZb3VyIHBhc3N3b3JkXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cImNvbmZpcm0tcGFzc3dvcmRcIj5Db25maXJtIHBhc3N3b3JkIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cInJlZ2lzdGVyLWNvbmZpcm0tcGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIkNvbmZpcm0geW91ciBwYXNzd29yZFwiIHJlcXVpcmVkPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lciBjZ3UtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiYWNjZXB0LWNndVwiIG5hbWU9XCJhY2NlcHQtY2d1XCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cImFjY2VwdC1jZ3VcIj5KJ2FjY2VwdGUgbGVzIDxhIGhyZWY9XCIjXCIgaWQ9XCJzaG93LWNndVwiIGNsYXNzPVwiY2d1LWxpbmtcIj5Db25kaXRpb25zIEfDqW7DqXJhbGVzIGQnVXRpbGlzYXRpb248L2E+PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImNvbm5leGlvblwiPlNpZ24gSW48L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjb25uZXhpb25cIiBpZD1cImFscmVhZHlIYXZlQWNjb3VudEJ1dHRvbl9pZFwiPkFscmVhZHkgaGF2ZSBhbiBhY2NvdW50ID88L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImdvb2dsZS1zaWduaW4tY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJnb29nbGUtc2lnbmluLWJ0blwiIGlkPVwiZ29vZ2xlLXNpZ251cC1idG5cIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vaWRlbnRpdHkvaW1hZ2VzL2ctbG9nby5wbmdcIiBhbHQ9XCJHb29nbGVcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFNpZ24gdXAgd2l0aCBHb29nbGVcblx0XHRcdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcml2YWN5LXBvbGljeS1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWw+PGEgaHJlZj1cIiNcIiBpZD1cInNob3ctcHJpdmFjeS1wb2xpY3lcIiBjbGFzcz1cImNndS1saW5rXCI+UG9saXRpcXVlIGRlIENvbmZpZGVudGlhbGl0w6k8L2E+PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGlkPVwibm90aWZpY2F0aW9uLWNvbnRhaW5lclwiIGNsYXNzPVwiZml4ZWQgdG9wLTAgbGVmdC0wIHJpZ2h0LTAgZmxleCBqdXN0aWZ5LWNlbnRlciB6LTUwIG10LTRcIj5cblx0XHRcdFx0PHAgaWQ9XCJyZXN1bHRNZXNzYWdlXCIgY2xhc3M9XCJweS0yIHB4LTQgcm91bmRlZCBzaGFkb3ctbGcgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwIHRyYW5zZm9ybSB0cmFuc2xhdGUteS0wIG9wYWNpdHktMFwiPjwvcD5cblx0XHRcdDwvZGl2PlxuYDt9XG5cblx0Y3JlYXRlQWNjb3VudCgpIHtcblx0XHQvLyo9PT09PSBGb3JtIE1hbmFnZW1lbnQgPT09PT0qL1xuXHRcdGNvbnN0IGxvZ2luRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5mb3JtX2lkXCIpO1xuXHRcdGNvbnN0IGNyZWF0ZUFjY291bnRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVfYWNjb3VudF9pZFwiKTtcblx0XHRjb25zdCBjcmVhdGVBY2NvdW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGUtQWNjb3VudFwiKTtcblx0XHRjb25zdCBhbHJlYWR5SGF2ZUFjY291bnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFscmVhZHlIYXZlQWNjb3VudEJ1dHRvbl9pZFwiKTtcblx0XHRjb25zdCBkb3VibGVBdXRoRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZG91YmxlQXV0aEZvcm1cIik7XG5cdFx0Y29uc3QgYmFja0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja1wiKTtcblxuXHRcdGNyZWF0ZUFjY291bnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiY3JlYXRlQWNjb3VudEZvcm1cIik7XG5cdFx0XHRsb2dpbkZvcm0uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdGNyZWF0ZUFjY291bnRGb3JtLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi11c2VybmFtZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XG5cdFx0XHQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1wYXNzd29yZFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XG5cdFx0fSk7XG5cblx0XHRhbHJlYWR5SGF2ZUFjY291bnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwibG9naW5Gb3JtXCIpO1xuXHRcdFx0Y3JlYXRlQWNjb3VudEZvcm0uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdGxvZ2luRm9ybS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVnaXN0ZXJGb3JtXCIpIGFzIEhUTUxGb3JtRWxlbWVudCkucmVzZXQoKTtcblx0XHR9KTtcblxuXHRcdC8vKj09PT09IENHVSBhbmQgUHJpdmFjeSBQb2xpY3kgTWFuYWdlbWVudCA9PT09PSovXG5cdFx0Y29uc3Qgc2hvd0NndUxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3ctY2d1XCIpO1xuXHRcdGNvbnN0IGNndU1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjZ3UtbW9kYWxcIik7XG5cdFx0Y29uc3QgY2d1QmFja0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2d1LWJhY2stYnV0dG9uXCIpO1xuXHRcdFxuXHRcdHNob3dDZ3VMaW5rPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBjZ3VNb2RhbD8uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgfSk7XG5cdFx0Y2d1QmFja0J1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgY2d1TW9kYWw/LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7IH0pO1xuXG4gICAgICAgIGNvbnN0IHNob3dQcml2YWN5UG9saWN5TGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvdy1wcml2YWN5LXBvbGljeVwiKTtcbiAgICAgICAgY29uc3QgcHJpdmFjeVBvbGljeU1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcml2YWN5LXBvbGljeS1tb2RhbFwiKTtcbiAgICAgICAgY29uc3QgcHJpdmFjeVBvbGljeUJhY2tCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaXZhY3ktcG9saWN5LWJhY2stYnV0dG9uXCIpO1xuXG4gICAgICAgIHNob3dQcml2YWN5UG9saWN5TGluaz8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7IGUucHJldmVudERlZmF1bHQoKTsgcHJpdmFjeVBvbGljeU1vZGFsPy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpOyB9KTtcbiAgICAgICAgcHJpdmFjeVBvbGljeUJhY2tCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7IHByaXZhY3lQb2xpY3lNb2RhbD8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTsgfSk7XG5cblx0XHQvLyo9PT09IEdvb2dsZSBTaWduLUluID09PT09Ki9cblx0XHRjb25zdCBnb29nbGVTaWduSW5CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvb2dsZS1zaWduaW4tYnRuXCIpO1xuXHRcdGNvbnN0IGdvb2dsZVNpZ25VcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ29vZ2xlLXNpZ251cC1idG5cIik7XG5cblx0XHRjb25zdCBoYW5kbGVHb29nbGVBdXRoID0gKCkgPT4ge1xuXHRcdFx0aWYgKHR5cGVvZiB0b2tlbkNsaWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdG9rZW5DbGllbnQpIHtcblx0XHRcdFx0dG9rZW5DbGllbnQucmVxdWVzdEFjY2Vzc1Rva2VuKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiQ2xpZW50IEdvb2dsZSBPQXV0aCBub24gaW5pdGlhbGlzw6lcIik7XG5cdFx0XHRcdG5vdGlmKFwiQ29ubmV4aW9uIEdvb2dsZSBub24gZGlzcG9uaWJsZVwiLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGdvb2dsZVNpZ25JbkJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUdvb2dsZUF1dGgpO1xuXHRcdGdvb2dsZVNpZ25VcEJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUdvb2dsZUF1dGgpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7IGluaXRHb29nbGVTaWduSW4oKTsgfSk7XG5cdH1cbn0iXX0=