async function logout(id) {
	try {
		const response = await apiRequest("users/logout/:id", "PUT", { id }, { id: id })

		if (response.success) {
			window.accessToken = null;
			fetchUsers();
			console.log("✅ Déconnecté avec succès !");
		} else
			console.log(response.error)

	} catch (err) {
		console.error('Error:', err);
	}
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
			location.reload(); // Rafraîchit la page après 1 seconde
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

	const data = await apiRequest("users/login", "PUT", { email, password })

	if (data.success) {
		window.accessToken = data.accessToken
		console.log("✅ Connected, Token :", window.accessToken)
		
		setTimeout(() => {
			location.reload();
		}, 300);
	} else
		console.log("Error :", data.error)
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
		credentials: "include", // ✅ Envoie les cookies (Refresh Token)
		body: body ? JSON.stringify(body) : null
	});

	if (response.status === 401) {
		console.warn("Token expired... ");
		await refreshToken(); // Appel à la fonction de refresh
		return apiRequest(endpoint, method, body, params); // Refaire la requête avec le nouveau token
	} else if (response.status === 403) {
		console.error("Acces interdit !");
		// return null;
	} else if (response.status === 500) {
		console.error("Error: Server");
		// return null;
	}

	return response.json();
}

async function refreshToken() {
	console.log("je passe pour refresh le token access")

	const response = await fetch("/api/refresh-token", {
		method: "POST",
		credentials: "include" // ✅ Envoie le Refresh Token en cookie
	});

	// if (!response.ok) {
	// 	console.error("Échec du rafraîchissement du token");
	// 	return;
	// }

	const data = await response.json();
	if (data.accessToken) {
		window.accessToken = data.accessToken // ✅ Mettre à jour en mémoire
		console.log("🔄 Token rafraîchi :", data.accessToken);
	}

	// sessionStorage.setItem("accessToken", data.accessToken);
	// console.log("🔄 Token rafraîchi :", window.accessToken);
}

window.addEventListener('DOMContentLoaded', () => {

	console.log("AccessToken lors du chargement de la page :", window.accessToken)

	if (window.accessToken) {
		console.log("✅ Access Token récupéré depuis la mémoire :", window.accessToken);
		// fetchUserProfile(window.accessToken);
	} else
		console.warn("⚠️ Aucun accessToken trouvé, l'utilisateur doit se reconnecter.");
	fetchUsers();
});