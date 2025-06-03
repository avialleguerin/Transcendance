async function verify2FA(event) {
	event.preventDefault();
	const userId = sessionStorage.getItem("userId");
	const code = document.getElementById("verify-2fa-code").value;

	try {
		const data = await fetchAPI('/request/user/verify-2fa', 'POST', { userId, code });

		if (data.success) {
			sessionStorage.removeItem("userId")
			localStorage.setItem("Player1", data.username);
			localStorage.setItem("profile_picture", data.profile_picture);
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

	const username = document.getElementById("login-username").value;
	const password = document.getElementById("login-password").value;
	
	try {
		const data = await fetchAPI('/request/user/login', 'POST', { username, password }, true, false);
		
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
			localStorage.setItem("Player1", data.user.username);
			localStorage.setItem("profile_picture", data.user.profile_picture);
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

async function login_1v1(event) {
	event.preventDefault();
	const username = document.getElementById("1v1-username2").value;
	const password = document.getElementById("1v1-password2").value;
	if (!username || !password)
		return notif("Please fill in all fields", false);

	try {
		const data = await fetchAPI('/request/user/login-1v1', 'POST', { username, password }, true, false);
		if (data.success) {
			if (data.player2.username === localStorage.getItem("Player1"))
				return notif("You cannot play against yourself", false);
			notif(data.message, true);
			localStorage.setItem("Player2", data.player2.username);
			document.getElementById("choose_your_opponent_1v1_form").classList.remove('active');
			document.getElementById("back_to_select_mode_view6").classList.add('active');
			document.getElementById("view6").classList.add('active');
			document.getElementById("container").classList.remove('active');
			document.getElementById("1v1-oponent-username1").innerHTML = localStorage.getItem("Player1");
			document.getElementById("1v1-oponent-username2").innerHTML = localStorage.getItem("Player2");
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Erreur lors de la connexion :", err);
		notif("Erreur de connexion", false);
	}
	document.getElementById("choose_your_opponent_1v1_form").reset();
}

async function login_2v2(event) {
	event.preventDefault();
	const username1 = localStorage.getItem("Player1");
	const username2 = document.getElementById("2v2-username2").value;
	const username3 = document.getElementById("2v2-username3").value;
	const username4 = document.getElementById("2v2-username4").value;

	const password2 = document.getElementById("2v2-password2").value;
	const password3 = document.getElementById("2v2-password3").value;
	const password4 = document.getElementById("2v2-password4").value;

	if (!username2 || !password2 || !username3 || !password3 || !username4 || !password4)
		return notif("Please fill in all fields", false);

	try {
		const data = await fetchAPI('/request/user/login-2v2', 'POST', { username2, password2, username3, password3, username4, password4 }, true, false);
		if (data.success) {
			if (username1 === username2 || username1 === username3 || username1 === username4 ||
				username2 === username3 || username2 === username4 || username3 === username4)
				return notif("There can't be the same player 2 times", false);
			notif(data.message, true);
			localStorage.setItem("Player2", data.player2.username);
			localStorage.setItem("Player3", data.player3.username);
			localStorage.setItem("Player4", data.player4.username);
			document.getElementById("choose_your_opponent_multi_form").classList.remove('active');
			document.getElementById("back_to_select_mode_view8").classList.add('active');
			document.getElementById("view8").classList.add('active');
			document.getElementById("container").classList.remove('active');
			document.getElementById("2v2-oponent-username1").innerHTML = localStorage.getItem("Player1");
			document.getElementById("2v2-oponent-username2").innerHTML = localStorage.getItem("Player2");
			document.getElementById("2v2-oponent-username3").innerHTML = localStorage.getItem("Player3");
			document.getElementById("2v2-oponent-username4").innerHTML = localStorage.getItem("Player4");
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Erreur lors de la connexion :", err);
		notif("Erreur de connexion", false);
	}
	document.getElementById("choose_your_opponent_1v1_form").reset();
}

async function login_tournament(event) {
	event.preventDefault();
	const username1 = localStorage.getItem("Player1");
	const username2 = document.getElementById("tournament-username2").value;
	const username3 = document.getElementById("tournament-username3").value;
	const username4 = document.getElementById("tournament-username4").value;

	const password2 = document.getElementById("tournament-password2").value;
	const password3 = document.getElementById("tournament-password3").value;
	const password4 = document.getElementById("tournament-password4").value;

	if (!username2 || !password2 || !username3 || !password3 || !username4 || !password4)
		return notif("Please fill in all fields", false);

	try {
		const data = await fetchAPI('/request/user/login-2v2', 'POST', { username2, password2, username3, password3, username4, password4 }, true, false);
		if (data.success) {
			if (username1 === username2 || username1 === username3 || username1 === username4 ||
				username2 === username3 || username2 === username4 || username3 === username4)
				return notif("There can't be the same player 2 times", false);
			notif(data.message, true);
			localStorage.setItem("Player2", data.player2.username);
			localStorage.setItem("Player3", data.player3.username);
			localStorage.setItem("Player4", data.player4.username);
			document.getElementById("Player1").innerHTML = localStorage.getItem("Player1");
			document.getElementById("Player2").innerHTML = localStorage.getItem("Player2");
			document.getElementById("Player3").innerHTML = localStorage.getItem("Player3");
			document.getElementById("Player4").innerHTML = localStorage.getItem("Player4");
			localStorage.setItem("current_player1", localStorage.getItem("Player1"));
			localStorage.setItem("current_player2", localStorage.getItem("Player2"));
			const tournamentStarted = true;
			localStorage.setItem('tournamentStarted', tournamentStarted.toString());
			document.getElementById("container_name_player").classList.add('hidden');
			document.getElementById("tournament_graphic_id").classList.add('active');
			document.getElementById("start_tournament").style.display = 'none';
			document.getElementById("back_to_menu_view_tournament").style.display = 'none';
			
			// Mettre en surbrillance les joueurs initiaux
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Erreur lors de la connexion :", err);
		notif("Erreur de connexion", false);
	}
}

async function logout() {
	try {
		await fetchAPI('/request/user/logout', 'POST', {});
		
		sessionStorage.clear();
		localStorage.clear();
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
	const password = document.getElementById("register-password").value;
	const confirmPassword = document.getElementById("register-confirm-password").value;

	if (password !== confirmPassword) {
		notif("Passwords are different", false);
		return;
	}

	try {
		const data = await fetchAPI('/request/user/create-user', 'POST', { username, password });
		
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
			notif("Session expired, please log in again", false);
		} else if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("accessToken") !== "undefined") {
			localStorage.clear();
			localStorage.setItem("Player1", data.user.username);
			localStorage.setItem("profile_picture", data.user.profile_picture);
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

window.addEventListener('beforeunload', () => {
	fetchAPI('/request/user/set-offline', 'POST', {});
});
