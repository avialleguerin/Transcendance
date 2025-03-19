import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
	}

	async getHtml() {
		return `
			<link rel="stylesheet" href="./static/js/css/home.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="title">
					<h1> TRANSCENDENCE </h1>
				</div>
				<div class="login-form" id="loginform_id" onsubmit="login(event)">
					<h1>CONNECTE-TOI</h1>
					<form class="form-group" id="loginForm">
						<div class="input-container">
							<label for="email">Email :</label>
							<input type="email" id="login-email" name="email" placeholder="email" required>
						</div>

						<div class="input-container">
							<label for="password">Mot de passe :</label>
							<input type="password" id="login-password" name="password" placeholder="Votre mot de passe" required>
						</div>
						<button type="submit" class="connexion"> Se connecter</button>
						
						
						<button class="creer-compte" id="create-Account">Créer un compte</button>
					</form>
				</div>
				<div class="register-form" id="create_account_id" onsubmit="register(event)">
					<h1>CRÉER UN COMPTE</h1>
					<form class="form-group" id="addForm">
						<div class="input-container">
							<label for="username">Nom :</label>
							<input type="text" id="add-username" name="username" placeholder="Votre nom" required>
						</div>

						<div class="input-container">
							<label for="email">Email :</label>
							<input type="email" id="add-email" name="email" placeholder="Votre email" required>
						</div>

						<div class="input-container">
							<label for="password">Mot de passe :</label>
							<input type="password" id="add-password" name="password" placeholder="Votre mot de passe" required>
						</div>

						<div class="input-container">
							<label for="confirm-password">Confirmer le mot de passe :</label>
							<input type="password" id="add-confirm-password" name="password" placeholder="Confirmer votre mot de passe" required>
						</div>
						<button type="submit" class="connexion">Sign In</button>
						<button class="connexion" id="alreadyHaveAccountButton_id">Déjà un compte ?</button>
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
