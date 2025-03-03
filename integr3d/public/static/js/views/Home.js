import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
	}

	async getHtml() {
		return `
			<link rel="stylesheet" href="./static/js/css/home.css">
			<div class="container">
				<form id="login-form" method="POST">
					<h1>Login Page</h1>
					<div class="form-group">
						<label for="username">Username:</label>
						<input type="text" id="username" name="username" required>
					</div>
					<div class="form-group">
						<label for="email">Email:</label>
						<input type="email" id="email" name="email" required>
					</div>
					<div class="form-group">
						<label for="password">Password:</label>
						<input type="password" id="password" name="password" required>
					</div>
					<div class="form-group">
						<label for="Confirm-password">Confirm-password:</label>
						<input type="Confirm-password" id="Confirm-password" name="Confirm-password" required>
					</div>
					<div class="form-group">
						<button type="submit">Login</button>
					</div>
				</form>
				<button><a href="/Game_menu" class="nav-link" data-link>Jouer</a></button>
			</div>
		`;
	}
}

