let accessToken = sessionStorage.getItem("accessToken")

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
		console.log(response.error);
		await refreshToken();
		return apiRequest(endpoint, method, body, params);
	} else if (response.status === 403) {
		console.error("Acces interdit !");
	} else if (response.status === 500) {
		console.error("Error: Server");
	}

	return response.json();
}

async function logout(userId) {
	if (!accessToken)
		return console.log("✅ Vous etes deja deconnecte !");
	const response = await fetch(`/api/users/logout/:${ userId }`, {
		method: 'POST',
		body: JSON.stringify({}),
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`
		},
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		sessionStorage.removeItem("accessToken")
		accessToken = null
		fetchUsers();
		console.log("✅ Déconnecté avec succès !");
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

async function login(event) {
	event.preventDefault();

	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	const data = await apiRequest("users/login", "PUT", { email, password }, {})
	sessionStorage.setItem("accessToken", data.accessToken)
	accessToken = sessionStorage.getItem("accessToken")
	if (!accessToken) {
		console.error("❌ Aucun accessToken reçue !");
	}
	if (data.success) {
		console.log("✅ Connected, Token :", accessToken)
		setTimeout(() => {
			location.reload();
		}, 300);
	} else
		console.log("Error :", data.error)
}



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
	return null
}

async function fetchProfile() {
	if (accessToken) {
		const profileData = await apiRequest("profile", "GET", null, {})
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
		console.log("❌ Aucun accessToken reçu !");
	}
}

window.addEventListener('DOMContentLoaded', () => {
	console.log("accessToken: ", accessToken)
	fetchUsers();
	fetchProfile();
});