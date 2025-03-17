
async function logout(userId) {
	const sessionId = localStorage.getItem('sessionId');
	console.log("🆔 Session ID récupéré :", sessionId);
	const response = await fetch(`/api/users/logout/:${ userId }`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userId, sessionId }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		fetchUsers();
		console.log("✅ Déconnecté avec succès !");
		localStorage.removeItem('sessionId');
		localStorage.removeItem('userId');
		setTimeout(() => {
			location.reload();
		}, 300);
	} else
		console.log(data.error)
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

	const result = await apiRequest("users/add", "POST", { username, email, password })

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

async function login(event) {
	event.preventDefault();

	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	const userId = localStorage.getItem("userId")
	const sessionId = localStorage.getItem("sessionId")
	if (userId && sessionId)
	{
		console.error("❌ User already connected !");
		return ;
	}
	const response = await fetch("/api/users/login", {
		method: 'PUT',
		// body: JSON.stringify({ email, password, userId, sessionId }),
		body: JSON.stringify({ email, password }),
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
	});
	const data = await response.json();
	accessToken = data.accessToken
	if (!data.accessToken) {
		console.error("❌ Aucun accessToken reçue !");
	}
	if (data.success) {
		console.log("✅ Connected, Token :", accessToken)
		localStorage.setItem('sessionId', data.sessionId);
		localStorage.setItem('userId', data.userId);
		setTimeout(() => {
			location.reload();
		}, 300);
	} else
		console.log("Error :", data.error)
	fetchUserProfile();
}


async function apiRequest(endpoint, method = "GET", body = null, params = {}) {
	const headers = { "Content-Type": "application/json" };

	console.log("accessToken in apiRequest :", window.accessToken)

	if (window.accessToken)
		headers["Authorization"] = `Bearer ${window.accessToken}`;

	Object.keys(params).forEach(key => {
		endpoint = endpoint.replace(`:${key}`, encodeURIComponent(params[key]));
	});

	const response = await fetch(`/api/${endpoint}`, {
		method,
		headers,
		credentials: "include",
		body: body ? JSON.stringify(body) : null
	});

	if (response.status === 401) {
		console.warn("Token expired... ");
		await refreshToken();
		return apiRequest(endpoint, method, body, params);
	} else if (response.status === 403) {
		console.error("Acces interdit !");
	} else if (response.status === 500) {
		console.error("Error: Server");
	}

	return response.json();
}

async function refreshToken() {
	console.log("je passe pour refresh le token access")

	const response = await fetch("/api/refresh-token", {
		method: "POST",
		credentials: "include"
	});

	if (response.success) {
		const data = await response.json();
		console.log("🔄 Token rafraîchi :", data.accessToken);
		return true
	}
	return false
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

async function fetchProfile() {
	const sessionId = localStorage.getItem('sessionId'); // Fonction pour récupérer le cookie sessionId
	const userId = localStorage.getItem('userId'); // Fonction pour récupérer l'ID de l'utilisateur
	console.log("🆔 Session ID récupéré :", sessionId);
	console.log("🆔 ID de l'utilisateur récupéré :", userId);
	const response = await fetch('/api/users/get-access-token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ sessionId, userId }),
		credentials: 'include'
	});
	const data = await response.json();
	console.log("Access token récupéré :", data.accessToken);
	if (data.accessToken) {
		const profileResponse = await fetch('/api/profile', {
			method: 'GET',
			headers: { Authorization: `Bearer ${data.accessToken}` },
			credentials: 'include'
		});
		const profileData = await profileResponse.json();
		if (!profileData.user) {
			console.error("Aucun utilisateur dans la réponse !");
			return;
		}
	
		const user = profileData.user;
	
		document.getElementById('user-table').innerHTML = `
			<tr>
				<td class="border px-4 py-2">${user.userId}</td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td> <!-- Masquer le mot de passe -->
				<td class="border px-4 py-2">${user.role}</td>
			</tr>
		`;
	} else {
		console.log("❌ Aucun accessToken reçu:", data.error);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	fetchUsers();
	fetchProfile();
	// fetchUserProfile();
});