async function verify2FA(event) {
	event.preventDefault();
	const userId = sessionStorage.getItem("userId");
	const code = document.getElementById("verify-2fa-code").value;

	try {
		const data = await fetchAPI('/request/user/verify-2fa', 'POST', { userId, code });

		if (data.success) {
			sessionStorage.removeItem("userId")
			console.log("✅ 2FA code valid!");

			history.pushState({}, '', '/Game_menu');
			import('../static/js/views/Game_menu.js').then(module => {
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
	} catch (err) {
		console.error("Erreur lors de la validation du code 2FA :", err);
	}
}

async function login(event) {
	event.preventDefault();

	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	
	try {
		const data = await fetchAPI('/request/user/login', 'POST', { email, password }, true, false);
		
		if (!data.accessToken && !data.success) {
			notif(data.error, false);
		} else if (data.success && data.connection_status === "partially_connected" && data.user.doubleAuth_status) {
			sessionStorage.setItem("userId", data.user.userId);
			document.getElementById("doubleAuthForm").classList.remove("hidden");
			document.getElementById("loginForm").classList.add("active");
			document.getElementById("login-title").textContent = "Double Authentication";
			document.getElementById("doubleAuthForm").classList.add("active");
		} else if (data.success && data.connection_status === "connected") {
			notif(data.message, true);
			console.log("✅ Connected, Token :", sessionStorage.getItem("accessToken"));
			
			history.pushState({}, '', '/Game_menu');
			import('../static/js/views/Game_menu.js').then(module => {
				const GameMenu = module.default;
				const gameMenuInstance = new GameMenu();
				gameMenuInstance.getHtml().then(html => {
					document.getElementById('app').innerHTML = html;
					if (gameMenuInstance.game_menu) {
						gameMenuInstance.game_menu();
					}
				});
			});
			
			document.getElementById("login-email").value = "";
			document.getElementById("login-password").value = "";
		} else {
			notif(data.error, false);
			document.getElementById("login-password").value = "";
			console.log(data.error);
		}
	} catch (err) {
		console.error("Erreur lors de la connexion :", err);
		notif("Erreur de connexion", false);
	}
}

async function loginOpponent(event) {
	event.preventDefault();
	const email = document.getElementById("1v1-email2").value;
	const password = document.getElementById("1v1-password2").value;
	if (!email || !password) {
		notif("Please fill in all fields", false);
		return;
	}

	try {
		const data = await fetchAPI('/request/user/login-opponent', 'POST', { email, password }, true, false);

		if (data.success) {
			notif(data.message, true);
			localStorage.setItem("Player2", data.opponent.username);
			view3.classList.remove('active');
			document.getElementById("choose_your_opponent_1v1_form").classList.remove('active');
			document.getElementById("back_to_select_mode_view6").classList.add('active');
			document.getElementById("view6").classList.add('active');
			document.getElementById("container").classList.remove('active');
			// document.getElementById("player1-username").innerHTML = data.user.username;
			document.getElementById("1v1-oponent-username").innerHTML = localStorage.getItem("Player2");
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Erreur lors de la connexion :", err);
		notif("Erreur de connexion", false);
	}
	document.getElementById("choose_your_opponent_1v1_form").reset();
}

async function logout() {
	try {
		await fetchAPI('/request/user/logout', 'POST', {});
		
		sessionStorage.removeItem("accessToken");
		console.log("✅ Logged out successfully !");
		
		history.pushState({}, '', '/');
		import('../static/js/views/Home.js').then((module) => {
			console.log("Home module loaded");
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
	} catch (err) {
		console.error("Erreur lors de la déconnexion :", err);
	}
}

async function register(event) {
	event.preventDefault();

	const username = document.getElementById("register-username").value;
	const email = document.getElementById("register-email").value;
	const password = document.getElementById("register-password").value;
	const confirmPassword = document.getElementById("register-confirm-password").value;

	if (password !== confirmPassword) {
		notif("Passwords are different", false);
		return;
	}

	try {
		const data = await fetchAPI('/request/user/create-user', 'POST', { username, email, password });
		
		if (data.success) {
			document.getElementById("create_account_id").classList.remove("active");
			document.getElementById("loginform_id").classList.remove("active");
		}
	} catch (err) {
		console.error("Erreur lors de l'inscription :", err);
	}
}

async function refreshInfos() {
	try {
		const data = await fetchAPI('/request/user/refresh-infos', 'POST', {}, true, false);
		
		if (!data.accessToken) {
			sessionStorage.removeItem("accessToken");
			localStorage.clear();
			localStorage.removeItem("Player2");
		} else if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("accessToken") !== "undefined") {
			localStorage.clear();
			localStorage.setItem("Player1", data.user.username);
			history.pushState({}, '', '/Game_menu');
			import('../static/js/views/Game_menu.js').then(module => {
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
		
		if (data.success) {
			console.log("Infos refreshed successfully");
		} else {
			console.error("❌ Error refreshing infos:", data.error);
		}
	} catch (err) {
		console.error("Erreur lors du rafraîchissement des informations :", err);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	refreshInfos();
});