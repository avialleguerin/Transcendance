import AbstractView from "./AbstractView.js";
import { initGoogleSignIn, tokenClient } from '../../../api/auth.js';
import { gameMenuView } from '../../../api/utils.js';
import { notif } from '../../../api/utils.js';


export default class Home extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
	}

	async getHtml(): Promise<string> {
		return /*html*/`
			<link rel="stylesheet" href="./static/js/css/home.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container-login">
				<div class="title">
					<h1> TRANSCENDENCE </h1>
				</div>

				<!-- Terms of Use Modal -->
				<div id="cgu-modal" class="cgu-modal">
					<div class="cgu-content">
						<h1>Terms of Use</h1>
						<div class="cgu-text">
							<h2>1. Introduction</h2>
							<p>Welcome to Transcendance. By using our application, you accept these terms of use.</p>
							<p>Data controller: Transcendance Project Team - 42 School<br>
							Contact: ozasahin@student.42lyon.fr<br>
							Data Protection Officer (DPO): Mr. SAHIN O.</p>
							
							<h2>2. Service Description</h2>
							<p>Transcendance is an online gaming platform allowing users to play Pong and other games, communicate and interact with other users.</p>
							
							<h2>3. Registration and Account</h2>
							<p>To use our service, you must create an account with accurate and up-to-date information. We only collect data necessary for providing our services.</p>
							
							<h2>4. User Behavior</h2>
							<p>Users agree to respect other members and not publish offensive or illegal content.</p>
							
							<h2>5. Intellectual Property</h2>
							<p>All intellectual property rights related to Transcendance belong to their respective owners.</p>
							
							<h2>6. Data Protection</h2>
							<p>We are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR).</p>
							<h3>6.1 Data collected</h3>
							<p>We collect the following categories of data:
							<ul>
								<li>Identification data (internal ID, username, avatar)</li>
								<li>Authentication data (via Google Sign-In)</li>
								<li>Profile data (status, preferences)</li>
								<li>Usage data (game history, scores, rankings)</li>
							</ul>
							</p>
							<h3>6.2 Processing purposes</h3>
							<p>Your data is processed for the following purposes:
							<ul>
								<li>Provision of the Transcendance online game service</li>
								<li>User account administration</li>
								<li>Social features (friends)</li>
								<li>Recording game statistics and rankings</li>
							</ul>
							</p>
							<h3>6.3 Retention period</h3>
							<p>Your data is kept for the duration of the project and up to 1 month after the final evaluation.</p>
							<h3>6.4 Data recipients</h3>
							<p>Your data may be accessible to:
							<ul>
								<li>Project team members</li>
								<li>Teaching staff and evaluators at École 42</li>
								<li>Other users (only for public profile data)</li>
							</ul>
							</p>
							<h3>6.5 Your rights</h3>
							<p>In accordance with GDPR, you have the following rights:
							<ul>
								<li>Right of access to your data</li>
								<li>Right to rectification</li>
								<li>Right to erasure ("right to be forgotten")</li>
								<li>Right to restriction of processing</li>
								<li>Right to data portability</li>
								<li>Right to object</li>
							</ul>
							To exercise these rights, contact us at: ozasahin@student.42lyon.fr
							</p>
							<h3>6.6 Security measures</h3>
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
							<p>No personal data is transferred outside the European Union. All data is hosted on servers located in the EU.</p>
						</div>
						<button id="cgu-back-button" class="cgu-back-button">Back</button>
					</div>
				</div>

				<!-- Politique de Confidentialité Modal -->
				<div id="privacy-policy-modal" class="cgu-modal">
					<div class="cgu-content">
						<h1>Privacy Policy</h1>
						<div class="cgu-text">
							<h2>1. Introduction</h2>
							<p>Welcome to our Privacy Policy. It describes how we collect, use, and protect your personal data.</p>

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
								<li>Offer social features (friends)</li>
								<li>Record your game statistics and rankings</li>
							</ul>

							<h2>4. Your Rights</h2>
							<p>In accordance with GDPR, you have the same rights as mentioned in the Terms of Use.</p>

							<h2>5. Modifications</h2>
							<p>We reserve the right to modify this policy at any time. Users will be notified of important changes.</p>
						</div>
						<button id="privacy-policy-back-button" class="cgu-back-button">Back</button>
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
							<div class="google-signin-container">
								<button type="button" class="google-signin-btn" id="google-signin-btn">
									<img src="/assets/image/gg_icon.png" alt="Google">Sign in with Google
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
									<img src="/assets/image/gg_icon.png" alt="Google">
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
`;}

	createAccount() {
		//*===== Form Management =====*/
		const loginForm = document.getElementById("loginform_id");
		const createAccountForm = document.getElementById("create_account_id");
		const createAccountButton = document.getElementById("create-Account");
		const alreadyHaveAccountButton = document.getElementById("alreadyHaveAccountButton_id");

		createAccountButton.addEventListener("click", () => {
			console.debug("Signin Form activated");
			loginForm.classList.add("active");
			createAccountForm.classList.add("active");
			(document.getElementById("login-username") as HTMLInputElement).value = "";
			(document.getElementById("login-password") as HTMLInputElement).value = "";
		});

		alreadyHaveAccountButton.addEventListener("click", () => {
			console.debug("Login Form activated");
			createAccountForm.classList.remove("active");
			loginForm.classList.remove("active");
			(document.getElementById("registerForm") as HTMLFormElement).reset();
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
			console.debug("handleGoogleAuth");
			if (typeof tokenClient !== 'undefined' && tokenClient)
				tokenClient.requestAccessToken();
			else 
				console.error(`Google Auth Token not initialised : typeof=${typeof tokenClient} && ${tokenClient} `);
		};

		googleSignInBtn?.addEventListener("click", handleGoogleAuth);
		googleSignUpBtn?.addEventListener("click", handleGoogleAuth);
		window.addEventListener("load", () => { initGoogleSignIn(); });
	}
}