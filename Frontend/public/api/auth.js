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
			document.getElementById("loginForm").classList.add("hidden");
			document.getElementById("login-title").textContent = "Double Authentication";
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
		} else if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("accessToken") !== "undefined") {
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