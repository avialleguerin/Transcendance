import AbstractView from "./AbstractView.js";
// import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
// import Game_menu from "./Game_menu.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
		const accessToken = sessionStorage.getItem("accessToken");
		if (accessToken && accessToken !== "undefined") {
			history.pushState({}, '', '/Game_menu');
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
			// handleViewTransitions("vue1", "vue2");
		}
	}

	async getHtml() {
		return /*html*/`
			<link rel="stylesheet" href="./static/js/css/home.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="title">
					<h1> TRANSCENDENCE </h1>
				</div>
				<div class="login-form" id="loginform_id">
					<h1>LOGIN</h1>
					<div class="form-group">
						<form id="loginForm" onsubmit="login(event)">
						<div class="input-container">
							<label for="email">Email :</label>
								<input type="email" id="login-email" name="email" placeholder="Your email" required>
						</div>

							<div class="input-container">
								<label for="password">Password :</label>
								<input type="password" id="login-password" name="password" placeholder="Your password" required>
							</div>
							<button type="submit" class="connexion">Login</button>
							<button type="button" class="creer-compte" id="create-Account">Create an account</button>
							<p id="login-resultMessage" style="color:white"></p>
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
							<button type="submit" class="connexion">Sign In</button>
							<button type="button" class="connexion" id="alreadyHaveAccountButton_id">Already have an account ?</button>
							<p id="register-resultMessage" style="color:white"></p>
						</form>
					</div>
				</div>
			</div>
		`;
	}

	createAccount() {

		console.log("createAccount");

		const loginForm = document.getElementById("loginform_id");
		const createAccountForm = document.getElementById("create_account_id");
		const createAccountButton = document.getElementById("create-Account");
		const alreadyHaveAccountButton = document.getElementById("alreadyHaveAccountButton_id");

		createAccountButton.addEventListener("click", () => {
			console.log("createAccountForm");
			loginForm.classList.add("active");
			createAccountForm.classList.add("active");
			document.getElementById("login-email").value = ""
			document.getElementById("login-password").value = ""
			document.getElementById("login-resultMessage").textContent = ""
		});

		alreadyHaveAccountButton.addEventListener("click", () => {
			console.log("loginForm");
			createAccountForm.classList.remove("active");
			loginForm.classList.remove("active");
			document.getElementById("registerForm").reset();
			document.getElementById("register-resultMessage").textContent = ""
		});
	}
}