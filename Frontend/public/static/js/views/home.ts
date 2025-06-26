import AbstractView from "./AbstractView.js";
import { login, register, verify2FA, initGoogleSignIn, tokenClient } from '../../../api/auth.js';


export default class Home extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
	}

	async getHtml(): Promise<string> {
		return /*html*/`
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
			<style>
				/* Reset et styles de base */
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
					font-family: "Open Sans", sans-serif;
				}
				
				body::before {
					content: "";
					position: absolute;
					width: 100%;
					height: 100%;
					background-position: center;
					background-size: cover;
				}
				
				/* Custom styles for notifications */
				
				/* Centered content styles to replace absolute positioning */
				.center-content {
					display: flex;
					justify-content: center;
					align-items: center;	
					height: 100%;
					width: 100%;
				}
				
				/* Glassmorphism styles */
				.glassmorphism {
					background: rgba(255, 255, 255, 0.1);
					backdrop-filter: blur(10px);
					-webkit-backdrop-filter: blur(10px);
					-moz-backdrop-filter: blur(10px);
					border-radius: 15px;
					border: 1px solid rgba(255, 255, 255, 0.2);
					box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
					/* Fallback for browsers that don't support backdrop-filter */
					background: rgba(255, 255, 255, 0.7);
				}
				
				/* Floating label animation */
				.input-field {
					position: relative;
					border-bottom: 2px solid #ccc;
					margin: 15px 0;
				}
				
				.input-field label {
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					color: #fff;
					font-size: 16px;
					pointer-events: none;
					transition: 0.15s ease;
				}
				
				.input-field input {
					width: 100%;
					height: 40px;
					background: transparent;
					border: none;
					outline: none;
					font-size: 16px;
					color: #fff;
					caret-color: #fff !important;
				}
				
				/* Force white cursor color on all inputs */
				input {
					caret-color: #fff !important;
				}
				
				.input-field input:focus ~ label,
				.input-field input:valid ~ label {
					font-size: 0.8rem;
					top: 10px;
					transform: translateY(-120%);
				}
				
				/* Password toggle button styles */
				.toggle-password {
					background: transparent !important;
					border: none !important;
					padding: 0 !important;
				}
				
				/* Login form styles */
				.wrapper {
					width: 50vw;
					max-width: 600px;
					min-width: 400px;
					border-radius: 8px;
					padding: 40px;
					text-align: center;
					border: 1px solid rgba(255, 255, 255, 0.5);
					backdrop-filter: blur(8px);
					-webkit-backdrop-filter: blur(8px);
					-moz-backdrop-filter: blur(8px);
					/* Fallback for browsers that don't support backdrop-filter */
					@supports not (backdrop-filter: blur(8px)) and not (-webkit-backdrop-filter: blur(8px)) {
						background: rgba(255, 255, 255, 0.7);
					}
				}
				
				#login-div {
					width: 50vw;
					max-width: 600px;
					min-width: 400px;
					margin: 0;
					font-family: 'Open Sans', sans-serif;
				}
				
				#register-div {
					width: 50vw;
					max-width: 600px;
					min-width: 400px;
					margin: 0;
					font-family: 'Open Sans', sans-serif;
				}
				
				form {
					display: flex;
					flex-direction: column;
				}
				
				h2 {
					font-size: 2rem;
					margin-bottom: 20px;
					color: #fff;
				}
				
				button {
					background: #fff;
					color: #000;
					font-weight: 600;
					border: none;
					padding: 12px 20px;
					cursor: pointer;
					border-radius: 3px;
					font-size: 16px;
					border: 2px solid transparent;
					transition: 0.3s ease;
				}
				
				button:hover {
					color: #fff;
					border-color: #fff;
					background: rgba(255, 255, 255, 0.15);
				}
				
				.register {
					text-align: center;
					margin-top: 30px;
					color: #fff;
				}
				
				/* Notification styles */
				.notification-container {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					display: flex;
					justify-content: center;
					z-index: 9999;
					margin-top: 20px;
				}
				
				.notification-message {
					padding: 10px 20px;
					border-radius: 4px;
					box-shadow: 0 2px 10px rgba(0,0,0,0.2);
					font-weight: 500;
					transition: all 0.3s ease;
					opacity: 0;
					transform: translateY(-20px);
				}
				
				.notification-success {
					background-color: #48bb78;
					color: white;
				}
				
				.notification-error {
					background-color: #f56565;
					color: white;
				}
				
				.notification-visible {
					opacity: 1;
					transform: translateY(0);
				}
				.notification-container {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					display: flex;
					justify-content: center;
					z-index: 9999;
					margin-top: 20px;
				}
				
				.notification-message {
					padding: 10px 20px;
					border-radius: 4px;
					box-shadow: 0 2px 10px rgba(0,0,0,0.2);
					font-weight: 500;
					transition: all 0.3s ease;
					opacity: 0;
					transform: translateY(-20px);
				}
				
				.notification-success {
					background-color: #48bb78;
					color: white;
				}
				
				.notification-error {
					background-color: #f56565;
					color: white;
				}
				
				.notification-visible {
					opacity: 1;
					transform: translateY(0);
				}
			</style>
			<div class="fixed top-0 left-0 w-full h-full flex items-center z-10 pointer-events-auto bg-black bg-opacity-30 backdrop-blur-sm">
				<div class="w-1/2 h-full flex items-center justify-end pr-8">
					<!-- Forms will be placed here -->
				</div>
				<div class="fixed top-4 right-20">
					<h1 class="text-4xl lg:text-5xl font-black text-white drop-shadow-lg" style="font-family: 'Black Ops One', sans-serif; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);"> TRANSCENDENCE </h1>
				</div>

				<div id="cgu-modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 hidden justify-center items-center z-50 overflow-y-auto backdrop-blur-lg">
					<div class="w-4/5 max-w-4xl max-h-4/5 bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl overflow-y-auto border border-white border-opacity-15" style="scrollbar-width: none; -ms-overflow-style: none;">
						<style>
							.cgu-content::-webkit-scrollbar { display: none; }
						</style>
						<h1 class="text-center text-3xl text-white mb-8 drop-shadow-md" style="font-family: 'Black Ops One', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); letter-spacing: 1px;">Terms of Use</h1>
						<div class="text-white text-opacity-90 leading-relaxed mb-5 px-3">
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">1. Introduction</h2>
							<p>Welcome to Transcendence. By using our application, you accept these terms of use.</p>
							<p>Data controller: Transcendence Project Team - 42 School<br>
							Contact: ozasahin@student.42lyon.fr<br>
							Data Protection Officer (DPO): Mr. SAHIN O.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">2. Service Description</h2>
							<p>Transcendence is an online gaming platform allowing users to play Pong and other games, communicate and interact with other users.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">3. Registration and Account</h2>
							<p>To use our service, you must create an account with accurate and up-to-date information. We only collect data necessary for providing our services.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">4. User Behavior</h2>
							<p>Users agree to respect other members and not publish offensive or illegal content.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">5. Intellectual Property</h2>
							<p>All intellectual property rights related to Transcendence belong to their respective owners.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">6. Data Protection</h2>
							<p>We are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR).</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.1 Data collected</h3>
							<p>We collect the following categories of data:
							<ul class="ml-5">
								<li class="mb-1">Identification data (internal ID, username, avatar)</li>
								<li class="mb-1">Authentication data (via Google Sign-In)</li>
								<li class="mb-1">Profile data (status, preferences)</li>
								<li class="mb-1">Usage data (game history, scores, rankings)</li>
							</ul>
							</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.2 Processing purposes</h3>
							<p>Your data is processed for the following purposes:
							<ul class="ml-5">
								<li class="mb-1">Provision of the Transcendence online game service</li>
								<li class="mb-1">User account administration</li>
								<li class="mb-1">Social features (friends)</li>
								<li class="mb-1">Recording game statistics and rankings</li>
							</ul>
							</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.3 Retention period</h3>
							<p>Your data is kept for the duration of the project and up to 1 month after the final evaluation.</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.4 Data recipients</h3>
							<p>Your data may be accessible to:
							<ul class="ml-5">
								<li class="mb-1">Project team members</li>
								<li class="mb-1">Teaching staff and evaluators at École 42</li>
								<li class="mb-1">Other users (only for public profile data)</li>
							</ul>
							</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.5 Your rights</h3>
							<p>In accordance with GDPR, you have the following rights:
							<ul class="ml-5">
								<li class="mb-1">Right of access to your data</li>
								<li class="mb-1">Right to rectification</li>
								<li class="mb-1">Right to erasure ("right to be forgotten")</li>
								<li class="mb-1">Right to restriction of processing</li>
								<li class="mb-1">Right to data portability</li>
								<li class="mb-1">Right to object</li>
							</ul>
							To exercise these rights, contact us at: ozasahin@student.42lyon.fr
							</p>
							<h3 class="text-lg mt-4 text-blue-200 ml-3" style="font-family: 'Black Ops One', sans-serif;">6.6 Security measures</h3>
							<p>We implement the following technical and organizational measures:
							<ul class="ml-5">
								<li class="mb-1">Encryption of passwords and sensitive data</li>
								<li class="mb-1">Secure authentication (Google Sign-In)</li>
								<li class="mb-1">Two-factor authentication (2FA)</li>
								<li class="mb-1">Secure sessions with expiration (JWT)</li>
								<li class="mb-1">Protection against common web vulnerabilities</li>
							</ul>
							</p>
							
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">7. Terms Modification</h2>
							<p>We reserve the right to modify these terms at any time. Users will be notified of important changes.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">8. Duration and Termination</h2>
							<p>Access to our service may be suspended or terminated in case of non-compliance with these terms.</p>
							
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">9. Data Transfers</h2>
							<p>No personal data is transferred outside the European Union. All data is hosted on servers located in the EU.</p>
						</div>
						<button id="cgu-back-button" class="block w-40 mx-auto mt-8 px-4 py-3 bg-white bg-opacity-15 text-white border-none rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm border border-white border-opacity-10 tracking-wide hover:bg-opacity-25 hover:shadow-white hover:shadow-md hover:-translate-y-1" style="font-family: 'Black Ops One', sans-serif;">Back</button>
					</div>
				</div>

				<div id="privacy-policy-modal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 hidden justify-center items-center z-50 overflow-y-auto backdrop-blur-lg">
					<div class="w-4/5 max-w-4xl max-h-4/5 bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl overflow-y-auto border border-white border-opacity-15" style="scrollbar-width: none; -ms-overflow-style: none;">
						<h1 class="text-center text-3xl text-white mb-8 drop-shadow-md" style="font-family: 'Black Ops One', sans-serif; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); letter-spacing: 1px;">Privacy Policy</h1>
						<div class="text-white text-opacity-90 leading-relaxed mb-5 px-3">
							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">1. Introduction</h2>
							<p>Welcome to our Privacy Policy. It describes how we collect, use, and protect your personal data.</p>

							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">2. Data Collected</h2>
							<p>We collect data about you when you use our service, including:</p>
							<ul class="ml-5">
								<li class="mb-1">Identification data (internal ID, username, avatar)</li>
								<li class="mb-1">Authentication data (via Google Sign-In)</li>
								<li class="mb-1">Profile data (status, preferences)</li>
								<li class="mb-1">Usage data (game history, scores, rankings)</li>
							</ul>

							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">3. Data Usage</h2>
							<p>We use your data to:</p>
							<ul class="ml-5">
								<li class="mb-1">Provide and improve our service</li>
								<li class="mb-1">Administer your account</li>
								<li class="mb-1">Offer social features (friends)</li>
								<li class="mb-1">Record your game statistics and rankings</li>
							</ul>

							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">4. Your Rights</h2>
							<p>In accordance with GDPR, you have the same rights as mentioned in the Terms of Use.</p>

							<h2 class="text-xl mt-6 text-blue-300 drop-shadow-sm" style="font-family: 'Black Ops One', sans-serif; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">5. Modifications</h2>
							<p>We reserve the right to modify this policy at any time. Users will be notified of important changes.</p>
						</div>
						<button id="privacy-policy-back-button" class="block w-40 mx-auto mt-8 px-4 py-3 bg-white bg-opacity-15 text-white border-none rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm border border-white border-opacity-10 tracking-wide hover:bg-opacity-25 hover:shadow-white hover:shadow-md hover:-translate-y-1" style="font-family: 'Black Ops One', sans-serif;">Back</button>
					</div>
				</div>
			<div class="fixed top-0 left-0 w-full h-full flex items-center z-10 pointer-events-auto bg-black bg-opacity-30 backdrop-blur-sm">
				<div class="w-1/2 h-full flex items-center justify-end pr-8">
					<div id="login-div" class="wrapper">
						<h2 id="login-title">Login</h2>
					<form id="login-form">
						<div class="input-field">
							<input type="text" id="login-username" name="username" required>
							<label for="login-username">Username</label>
						</div>
						
						<div class="input-field">
							<div class="relative w-full">
								<input type="password" id="login-password" name="password" required>
								<label for="login-password">Password</label>
								<button type="button" class="toggle-password absolute right-0 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								</button>
							</div>
						</div>
						
						<button type="submit" id="login-submit">Login</button>
						
						<div class="flex justify-center mt-6">
							<button type="button" id="google-signin-btn" class="flex items-center justify-center gap-2 bg-white text-gray-800 rounded py-2 px-4 w-full">
								<img src="/assets/image/gg_icon.png" alt="Google" class="w-5 h-5">
								<span>Sign in with Google</span>
							</button>
						</div>
						
						<div class="register">
							<p>Don't have an account? <a href="#" id="create-Account" class="text-gray-200 hover:underline">Register</a></p>
						</div>
					</form>					</div>
					<div id="register-div" class="wrapper hidden">
						<h2 id="register-title">Register</h2>
					<form id="register-form">
						<div class="input-field">
							<input type="text" id="register-username" name="username" required>
							<label for="register-username">Username</label>
						</div>
						
						<div class="input-field">
							<div class="relative w-full">
								<input type="password" id="register-password" name="password" required>
								<label for="register-password">Password</label>
								<button type="button" class="toggle-password absolute right-0 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								</button>
							</div>
						</div>
						
						<div class="input-field">
							<div class="relative w-full">
								<input type="password" id="register-confirm-password" name="confirmPassword" required>
								<label for="register-confirm-password">Confirm Password</label>
								<button type="button" class="toggle-password absolute right-0 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								</button>
							</div>
						</div>
						
						<div class="flex items-start my-4 w-full">
							<input type="checkbox" id="accept-cgu" name="accept-cgu" required class="w-auto flex-shrink-0 mt-1 mr-3">
							<label for="accept-cgu" class="flex-1 text-left text-sm break-words whitespace-normal text-white">J'accepte les <a href="#" id="show-cgu" class="text-blue-300 underline transition-colors duration-200 hover:text-white">Conditions Générales d'Utilisation</a></label>
						</div>
						
						<button type="submit" id="register-submit">Register</button>
						
						<div class="flex justify-center mt-6">
							<button type="button" id="google-signup-btn" class="flex items-center justify-center gap-2 bg-white text-gray-800 rounded py-2 px-4 w-full">
								<img src="/assets/image/gg_icon.png" alt="Google" class="w-5 h-5">
								<span>Sign up with Google</span>
							</button>
						</div>
						
						<div class="register">
							<p>Already have an account? <a href="#" id="login-link" class="text-gray-200 hover:underline">Login</a></p>
						</div>
					</form>
					</div>
				</div>
`;}
	createAccount() {
		//*===== Form Management =====*/
		const loginDiv = document.getElementById("login-div");
		const registerDiv = document.getElementById("register-div");
		const loginFormBtn = document.getElementById("login-form");
		const registerFormBtn = document.getElementById("register-form");
		const doubleAuthForm = document.getElementById("doubleAuthForm");
		const createAccountButton = document.getElementById("create-Account");
		const loginLink = document.getElementById("login-link");

		loginFormBtn?.addEventListener("submit", async (event) => { await login(event); });
		registerFormBtn?.addEventListener("submit", async (event) => { await register(event); });
		doubleAuthForm?.addEventListener("submit", async (event) => { await verify2FA(event); });

		createAccountButton?.addEventListener("click", () => {
			loginDiv?.classList.add("hidden");
			registerDiv?.classList.remove("hidden");
			(document.getElementById("login-username") as HTMLInputElement).value = "";
			(document.getElementById("login-password") as HTMLInputElement).value = "";
		});

		loginLink?.addEventListener("click", (e) => {
			e.preventDefault();
			registerDiv?.classList.add("hidden");
			loginDiv?.classList.remove("hidden");
			(document.getElementById("register-form") as HTMLFormElement).reset();
		});

		//*===== CGU and Privacy Policy Management =====*/
		const showCguLink = document.getElementById("show-cgu");
		const cguModal = document.getElementById("cgu-modal");
		const cguBackButton = document.getElementById("cgu-back-button");
		
		showCguLink?.addEventListener("click", (e) => { 
			e.preventDefault(); 
			cguModal?.classList.remove("hidden");
			cguModal?.classList.add("flex");
		});
		cguBackButton?.addEventListener("click", () => { 
			cguModal?.classList.add("hidden");
			cguModal?.classList.remove("flex");
		});

		const showPrivacyPolicyLink = document.getElementById("show-privacy-policy");
		const privacyPolicyModal = document.getElementById("privacy-policy-modal");
		const privacyPolicyBackButton = document.getElementById("privacy-policy-back-button");

		showPrivacyPolicyLink?.addEventListener("click", (e) => { 
			e.preventDefault(); 
			privacyPolicyModal?.classList.remove("hidden");
			privacyPolicyModal?.classList.add("flex");
		});
		privacyPolicyBackButton?.addEventListener("click", () => { 
			privacyPolicyModal?.classList.add("hidden");
			privacyPolicyModal?.classList.remove("flex");
		});

		//*==== Password Toggle Functionality =====*/
		const togglePasswordButtons = document.querySelectorAll('.toggle-password');
		
		togglePasswordButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				const input = button.parentElement?.querySelector('input[type="password"], input[type="text"]') as HTMLInputElement;
				const svg = button.querySelector('svg');
				
				if (input && svg) {
					if (input.type === 'password') {
						input.type = 'text';
						// Icône œil barré (masquer)
						svg.innerHTML = `
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
						`;
					} else {
						input.type = 'password';
						// Icône œil normal (afficher)
						svg.innerHTML = `
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						`;
					}
				}
			});
		});

		//*==== Google Sign-In =====*/
		const googleSignInBtn = document.getElementById("google-signin-btn");
		const googleSignUpBtn = document.getElementById("google-signup-btn");

		const handleGoogleAuth = () => {
			if (typeof tokenClient !== 'undefined' && tokenClient)
				tokenClient.requestAccessToken();
		};

		googleSignInBtn?.addEventListener("click", handleGoogleAuth);
		googleSignUpBtn?.addEventListener("click", handleGoogleAuth);
		window.addEventListener("load", () => { initGoogleSignIn(); });
	}
}