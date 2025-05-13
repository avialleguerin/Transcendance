import AbstractView from "./AbstractView.js";
// import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
// import Game_menu from "./Game_menu.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
		const accessToken = sessionStorage.getItem("accessToken");
		if (accessToken) {
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
		return `
			<link rel="stylesheet" href="./static/js/css/home.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="title">
					<h1> TRANSCENDENCE </h1>
				</div>
				<div class="login-form" id="loginform_id">
					<h1>LOGIN</h1>
					<form class="form-group" id="loginForm" onsubmit="login(event)">
						<div class="input-container">
							<label for="email">Email :</label>
							<input type="email" id="login-email" name="email" placeholder="email" required>
						</div>

						<div class="input-container">
							<label for="password">Password :</label>
							<input type="password" id="login-password" name="password" placeholder="Your password" required>
						</div>
						<button type="submit" class="connexion">Login</button>
						<button class="creer-compte" id="create-Account">Create an account</button>
						<p id="login-resultMessage"></p>
					</form>
				</div>
				<div class="register-form" id="create_account_id">
					<h1>SIGN IN</h1>
					<form class="form-group" id="addForm" onsubmit="register(event)">
						<div class="input-container">
							<label for="username">Username :</label>
							<input type="text" id="add-username" name="username" placeholder="Your username" required>
						</div>

						<div class="input-container">
							<label for="email">Email :</label>
							<input type="email" id="add-email" name="email" placeholder="Your email" required>
						</div>

						<div class="input-container">
							<label for="password">Password :</label>
							<input type="password" id="add-password" name="password" placeholder="Your password" required>
						</div>

						<div class="input-container">
							<label for="confirm-password">Confirm password :</label>
							<input type="password" id="add-confirm-password" name="password" placeholder="Confirm your password" required>
						</div>
						<button type="submit" class="connexion">Sign In</button>
						<button class="connexion" id="alreadyHaveAccountButton_id">Already have an account?</button>
						<p id="add-resultMessage"></p>
					</form>
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
		});

		alreadyHaveAccountButton.addEventListener("click", () => {
			console.log("loginForm");
			createAccountForm.classList.remove("active");
			loginForm.classList.remove("active");
		});
	}
}
