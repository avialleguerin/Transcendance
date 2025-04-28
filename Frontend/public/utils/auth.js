let accessToken = sessionStorage.getItem("accessToken")
let userId = getUserIdFromToken(accessToken);

async function apiRequest(endpoint, method = "GET", body = null, params = {}) {
	const headers = { "Content-Type": "application/json" };
	
	if (accessToken)
		headers["Authorization"] = `Bearer ${accessToken}`;
	Object.keys(params).forEach(key => {
		endpoint = endpoint.replace(`:${key}`, encodeURIComponent(params[key]));
	});
	
	const response = await fetch(`/api/${endpoint}`, {
		method,
		headers: headers,
		credentials: "include",
		body: body ? JSON.stringify(body) : null
	});
	if (response.status === 401) {
		await refreshToken();
		return apiRequest(endpoint, method, body, params);
	} else if (response.status === 403) {
		console.error("Acces interdit !");
	} else if (response.status === 500) {
		console.error("Error: Server");
	}
	
	return response.json();
}

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
			body: JSON.stringify({ userId, code })
		});
		
		const data = await response.json();
		if (data.success) {
			sessionStorage.setItem("accessToken", data.accessToken);
			accessToken = sessionStorage.getItem("accessToken");
			sessionStorage.removeItem("userId")
			console.log("✅ 2FA code valid!");
			document.getElementById("login-resultMessage").textContent = "2FA validated successfully!";
			document.getElementById("login-resultMessage").classList.add("text-green-500");

			setTimeout(() => {
				location.reload();
			}, 300);
		} else {
			console.error("❌ Invalid 2FA code:", data.error);
			document.getElementById("login-resultMessage").textContent = "Invalid 2FA code!";
			document.getElementById("login-resultMessage").classList.add("text-red-500");
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
			body: JSON.stringify({ userId, code })
		});
		
		const data = await response.json();
		if (data.success) {
			sessionStorage.setItem("accessToken", data.accessToken);
			accessToken = sessionStorage.getItem("accessToken");
			sessionStorage.removeItem("userId")
			console.log("✅ 2FA code valid!");
			document.getElementById("activate-2fa-resultMessage").textContent = "2FA validated successfully!";
			document.getElementById("activate-2fa-resultMessage").classList.add("text-green-500");

			setTimeout(() => {
				location.reload();
			}, 300);
		} else {
			console.error("❌ Invalid 2FA code:", data.error);
			document.getElementById("activate-2fa-resultMessage").textContent = "Invalid 2FA code!";
			document.getElementById("activate-2fa-resultMessage").classList.add("text-red-500");
		}
	} catch (err) {
		console.error("Erreur lors de la validation du code 2FA :", err);
	}
}

async function login(event) {
	event.preventDefault();

	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	const data = await apiRequest("users/login", "PUT", { email, password }, {})
	sessionStorage.setItem("accessToken", data.accessToken)
	accessToken = sessionStorage.getItem("accessToken")
	console.log("data: ", data);
	if (!accessToken && !data.success) {
		const resultMessage = document.getElementById("login-resultMessage");
		resultMessage.textContent = "Error : " + data.error;
		resultMessage.classList.add("text-red-500");
		console.error("❌ Aucun accessToken reçue !");
	}
	else if (data.success && data.connection_status == "partially_connected" && data.user.doubleAuth_enabled)
	{
		fetchUsers();
		console.log("✅ Valid credentials !", data);
		console.log("DoubleAuth enabled:", data.user.doubleAuth_enabled);
		sessionStorage.setItem("userId", data.user.userId)
		document.getElementById("doubleAuthForm").classList.remove("hidden");
	}
	else if (data.success && data.connection_status == "connected")
	{
		const resultMessage = document.getElementById("login-resultMessage");
		resultMessage.textContent = "Login success !";
		resultMessage.classList.add("text-green-500");
		console.log("✅ Connected, Token :", accessToken)
		setTimeout(() => {
			location.reload();
		}, 300);
	} else
		console.log("Error :", data.error)
}

async function logout(userId) {
	const response = await fetch(`/api/users/logout/:${ userId }`, {
		method: 'POST',
		body: JSON.stringify({ userId, accessToken }),
		headers: { 
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		sessionStorage.removeItem("accessToken")
		accessToken = null
		fetchUsers();
		console.log("✅ Déconnecté avec succès !");
	} else
	console.log(data.error)
	setTimeout(() => {
		location.reload();
	}, 300);
}

async function register(event) {
	event.preventDefault();

	const username = document.getElementById("add-username").value;
	const email = document.getElementById("add-email").value;
	const password = document.getElementById("add-password").value;
	const confirmPassword = document.getElementById("add-confirm-password").value;
	const resultMessage = document.getElementById("add-resultMessage");

	if (password !== confirmPassword) {
		resultMessage.textContent = "Error : Fields Password and confirm Password are different";
		resultMessage.classList.add("text-red-500");
		return ;
	}

	const result = await apiRequest("users/add", "POST", { username, email, password }, {})
	
	if (result.success) {
		resultMessage.textContent = `User added : ${result.username} (${result.email})`;
		resultMessage.classList.add("text-green-500");

		setTimeout(() => {
			location.reload();
		}, 300);
	} else {
		resultMessage.textContent = "Error : " + result.error;
		resultMessage.classList.add("text-red-500");
	}
};

async function refreshToken() {
	const response = await fetch("/api/refresh-token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({}),
		credentials: "include"
	});

	const data = await response.json();
	if (data.success) {
		accessToken = data.accessToken
		sessionStorage.setItem("accessToken", accessToken)
		console.log("🔄 Token rafraîchi :", accessToken);
	}
	console.log("Error:", data.error)
}


function getUserIdFromToken(token) {
	if (!token) return null;

	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.userId;
	} catch (error) {
		console.error("Erreur lors du décodage du token :", error);
		return null;
	}
}

async function refreshInfos() {
	const response = await fetch(`/api/users/refresh-infos/:${ userId }`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userId, accessToken }),
		credentials: "include"
	});
	const data = await response.json();
	if (data.success) {
		if (data.connection_status == "connected")
			fetchProfile();
		console.log("Infos refreshed successfully");
	} else {
		console.error("Error refreshing infos:", data.error);
	}
}


window.addEventListener('DOMContentLoaded', () => {
	console.log("accessToken: ", accessToken)
	refreshInfos();
	fetchUsers();
});