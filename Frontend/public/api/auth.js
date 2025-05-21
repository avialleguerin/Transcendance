let accessToken = sessionStorage.getItem("accessToken")
// window.accessToken = accessToken;

function notif(message, isSuccess = true) {
	const notification = document.getElementById('resultMessage');
	
	if (notification) {
		if (isSuccess) {
			notification.innerHTML = "<div style='display:flex; align-items:center;'><img src='../srcs/game/assets/image/success.png' style='width:20px; height:20px; margin-right:5px;'><span>" + message + "</span></div>";
			notification.className = "py-2 px-4 rounded shadow-lg bg-green-500 text-white font-medium"
		} else {
			notification.innerHTML = "<div style='display:flex; align-items:center;'><img src='../srcs/game/assets/image/failure.png' style='width:20px; height:20px; margin-right:5px;'><span>" + message + "</span></div>";
			notification.className = "py-2 px-4 rounded shadow-lg bg-red-500 text-white font-medium";
		}

		setTimeout(() => {
			notification.classList.add('opacity-100');
		}, 10);

		setTimeout(() => {
			notification.classList.remove('opacity-100');
			notification.classList.add('opacity-0');
		}, 3000);
	}
}

async function verify2FA(event) {

	event.preventDefault();
	const userId = sessionStorage.getItem("userId");
	const code = document.getElementById("verify-2fa-code").value;
	try {
		const response = await fetch('/request/user/verify-2fa', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId, code })
		});
		
		const data = await response.json();
		if (data.success) {
			sessionStorage.setItem("accessToken", data.accessToken);
			accessToken = sessionStorage.getItem("accessToken");
			sessionStorage.removeItem("userId")
			console.log("✅ 2FA code valid!");
			notif(data.message, true);
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
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Erreur lors de la validation du code 2FA :", err);
	}
}


async function login(event) {
	event.preventDefault();

	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	const response = await fetch('/request/user/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		headers: { 
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});
	const data = await response.json();
	sessionStorage.setItem("accessToken", data.accessToken)
	accessToken = sessionStorage.getItem("accessToken")
	console.log("data: ", data);
	if (!accessToken && !data.success)
		notif(data.error, false);
	else if (data.success && data.connection_status === "partially_connected" && data.user.doubleAuth_status)
	{
		sessionStorage.setItem("userId", data.user.userId);
		document.getElementById("doubleAuthForm").classList.remove("hidden");
		document.getElementById("loginForm").classList.add("hidden");
		document.getElementById("login-title").textContent = "Double Authentication";
	}
	else if (data.success && data.connection_status === "connected")
	{
		notif(data.message, true);
		console.log("✅ Connected, Token :", accessToken)
		console.log("accessToken before Game menu: ", accessToken);
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
		console.log(data.error)
	}
}

async function logout() {
	await fetch('/request/user/logout', {
		method: 'POST',
		headers: { 
			"Authorization": `Bearer ${accessToken}`
		},
		credentials: 'include',
	});
	sessionStorage.removeItem("accessToken")
	accessToken = null
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
}


async function register(event) {
	event.preventDefault();

	const username = document.getElementById("register-username").value;
	const email = document.getElementById("register-email").value;
	const password = document.getElementById("register-password").value;
	const confirmPassword = document.getElementById("register-confirm-password").value;

	if (password !== confirmPassword) {
		notif("Passwords are different", false);
		return ;
	}

	const response = await fetch('/request/user/register', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, email, password }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		notif(data.message, true);
		document.getElementById("create_account_id").classList.remove("active")
		document.getElementById("loginform_id").classList.remove("active")
	} else
		notif(data.error, false);
};

// function getUserIdFromToken(token) {
// 	if (!token) return null;

// 	try {
// 		const payload = JSON.parse(atob(token.split('.')[1]));
// 		return payload.userId;
// 	} catch (error) {
// 		console.error("Error when decoding token :", error);
// 		return null;
// 	}
// }

async function refreshInfos() {
	const response = await fetch('/request/user/refresh-infos', {
		method: "POST",
		headers:
		{
			"Content-Type": "application/json",
			"Authorization": `Bearer ${accessToken}`
		},
		body: JSON.stringify({}),
		credentials: "include"
	});
	const data = await response.json();
	if (!data.accessToken) {
		sessionStorage.removeItem("accessToken");
		accessToken = null;
	} else {
		sessionStorage.setItem("accessToken", data.accessToken);
		accessToken = sessionStorage.getItem("accessToken");
		if (accessToken && accessToken !== "undefined")
		{
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
	}
	if (data.success) {
		console.log("Infos refreshed successfully");
	} else {
		console.error("❌ Error refreshing infos:", data.error);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	console.log("accessToken: ", accessToken)
	refreshInfos();
});