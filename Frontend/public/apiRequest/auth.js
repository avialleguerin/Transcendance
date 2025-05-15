let accessToken = sessionStorage.getItem("accessToken")
let userId = getUserIdFromToken(accessToken);

// async function apiRequest(endpoint, method = "GET", body = null, params = {}) {
// 	const headers = { "Content-Type": "application/json" };
	
// 	if (accessToken)
// 		headers["Authorization"] = `Bearer ${accessToken}`;
// 	Object.keys(params).forEach(key => {
// 		endpoint = endpoint.replace(`:${key}`, encodeURIComponent(params[key]));
// 	});
	
// 	const response = await fetch(`/api/${endpoint}`, {
// 		method,
// 		headers: headers,
// 		credentials: "include",
// 		body: body ? JSON.stringify(body) : null
// 	});
// 	const data = await response.json();
// 	if (response.status === 401) {
// 		if (data.error === "❌ Invalid credentials")
// 			return data;
// 		await refreshToken();
// 		return apiRequest(endpoint, method, body, params);
// 	} else if (response.status === 403) {
// 		console.error("Acces interdit !");
// 	} else if (response.status === 500) {
// 		console.error("Error: Server");
// 	}
	
// 	return data;
// }

async function validate2FA(event) {

	event.preventDefault();
	const userId = sessionStorage.getItem("userId");
	if (!userId) {
		console.error("❌ User ID not found in session storage!");
		return;
	}
	const code = document.getElementById("2fa-code").value;
	try {
		const response = await fetch(`/api/users/verify-2fa`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ code })
		});
		
		const data = await response.json();
		if (data.success) {
			sessionStorage.setItem("accessToken", data.accessToken);
			accessToken = sessionStorage.getItem("accessToken");
			sessionStorage.removeItem("userId")
			console.log("✅ 2FA code valid!");
			document.getElementById("login-resultMessage").textContent = "2FA validated successfully!";
		} else {
			console.error("❌ Invalid 2FA code:", data.error);
			document.getElementById("login-resultMessage").textContent = "Invalid 2FA code!";
		}
	} catch (err) {
		console.error("Erreur lors de la validation du code 2FA :", err);
	}
}

async function activate2FA(event) {

	event.preventDefault();
	const userId = sessionStorage.getItem("userId");
	if (!userId) {
		console.error("❌ User ID not found in session storage!");
		return;
	}
	const code = document.getElementById("activate-2fa-code").value;
	try {
		const response = await fetch(`/api/users/activate-2fa`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ code })
		});
		
		const data = await response.json();
		if (data.success) {
			sessionStorage.setItem("accessToken", data.accessToken);
			accessToken = sessionStorage.getItem("accessToken");
			sessionStorage.removeItem("userId")
			console.log("✅ 2FA code valid!");
			document.getElementById("activate-2fa-resultMessage").textContent = "2FA validated successfully!";
		} else {
			console.error("❌ Invalid 2FA code:", data.error);
			document.getElementById("activate-2fa-resultMessage").textContent = "❌ Invalid 2FA code!";
		}
	} catch (err) {
		console.error("Error when validating 2FA :", err);
	}
}

async function login(event) {
	event.preventDefault();

	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	const response = await fetch('/api/users/login', {
		method: 'PUT',
		body: JSON.stringify({ email, password }),
		headers: { 
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});
	const data = await response.json();
	// const data = await apiRequest("users/login", "PUT", { email, password }, {})
	sessionStorage.setItem("accessToken", data.accessToken)
	accessToken = sessionStorage.getItem("accessToken")
	userId = getUserIdFromToken(accessToken);
	console.log("data: ", data);
	if (!accessToken && !data.success) {
		const resultMessage = document.getElementById("login-resultMessage");
		resultMessage.textContent = data.error;
		console.error("❌ AccessToken is missing !");
	}
	else if (data.success && data.connection_status === "partially_connected" && data.user.doubleAuth_enabled)
	{
		console.log("✅ Valid credentials !", data);
		console.log("DoubleAuth enabled:", data.user.doubleAuth_enabled);
		sessionStorage.setItem("userId", data.user.userId)
		document.getElementById("doubleAuthForm").classList.remove("hidden");
	}
	else if (data.success && data.connection_status === "connected")
	{
		const resultMessage = document.getElementById("login-resultMessage");
		resultMessage.textContent = "Login success !";
		console.log("✅ Connected, Token :", accessToken)
		history.pushState({}, '', '/Game_menu');
		// handleViewTransitions("vue1", "vue2");
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
		const resultMessage = document.getElementById("login-resultMessage");
		resultMessage.textContent = data.error;
		document.getElementById("login-password").value = "";
		console.log(data.error)
	}
}

async function logout(userId) {
	const response = await fetch(`/api/users/logout`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${accessToken}`
		},
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		sessionStorage.removeItem("accessToken")
		accessToken = null
		console.log("✅ Logged out successfully !");
		history.pushState({}, '', '/');
		import('../static/js/views/Home.js').then(module => {
			const Home = module.default;
			const homeInstance = new Home();
			homeInstance.getHtml().then(html => {
				document.getElementById('app').innerHTML = html;
				if (homeInstance.createAccount) {
					homeInstance.createAccount();
				}
			});
		});
	} else
	console.log(data.error)
}

async function register(event) {
	event.preventDefault();

	const username = document.getElementById("register-username").value;
	const email = document.getElementById("register-email").value;
	const password = document.getElementById("register-password").value;
	const confirmPassword = document.getElementById("register-confirm-password").value;
	const resultMessage = document.getElementById("register-resultMessage");

	if (password !== confirmPassword) {
		resultMessage.textContent = "❌ Passwords are different";
		return ;
	}

	const result = await apiRequest("users/add", "POST", { username, email, password }, {})
	
	if (result.success) {
		resultMessage.textContent = `User added : ${result.username} (${result.email})`
		document.getElementById("create_account_id").classList.remove("active")
		document.getElementById("loginform_id").classList.remove("active")
	} else {
		resultMessage.textContent = result.error
	}
};

// async function refreshToken() {
// 	const response = await fetch("/api/refresh-token", {
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		credentials: "include"
// 	});

// 	const data = await response.json()
// 	if (data.success) {
// 		accessToken = data.accessToken
// 		sessionStorage.setItem("accessToken", accessToken)
// 		return true
// 	} else {
// 		console.log(data.error)
// 		return false
// 	}
// }

function getUserIdFromToken(token) {
	if (!token) return null;

	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.userId;
	} catch (error) {
		console.error("Error when decoding token :", error);
		return null;
	}
}

async function refreshInfos() {
	const response = await fetch(`/api/users/refresh-infos`, {
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
	// fetchUsers();
});