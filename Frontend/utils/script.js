// console.log("Le script admin.js est bien chargé !");

async function fetchUsers() {
	try {
		const response = await fetch('/api/users');
		const users = await response.json();

		// const tbody = document.getElementById('users-table');
		// tbody.innerHTML = '';
		// users.forEach(user => {
		// 	const tr = document.createElement('tr');
		// 	tr.innerHTML = `
		// 		<td class="border px-4 py-2">${user.id}</td>
		// 		<td class="border px-4 py-2">${user.username}</td>
		// 		<td class="border px-4 py-2">${user.email}</td>
		// 		<td class="border px-4 py-2">
		// 			<button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteUser(${user.id})">Supprimer</button>
		// 		</td>
		// 	`;
		// 	tbody.appendChild(tr);
		// });

		document.getElementById('users-table').innerHTML = users.map(user => `
			<tr>
				<td class="border px-4 py-2">${user.id}</td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">${user.password}</td>
				<td class="border px-4 py-2">${user.connected === 1 ? "Yes" : "No"}</td>
				<td class="border px-4 py-2">${user.admin === 1 ? "Yes" : "No"}</td>
				<td class="border px-4 py-2">
					<button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="logoutUser(${user.id})">Logout</button>
					<button class="bg-orange-500 text-white px-2 py-1 rounded" onclick="adminUser(${user.id})">Admin</button>
					<button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteUser(${user.id})">Supprimer</button>
				</td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des utilisateurs :', err);
	}
}

async function fetchUserProfile() {
	const accessToken = sessionStorage.getItem("accessToken")
	if (!accessToken) {
		console.error("❌ Aucun accessToken disponible !");
		return;
	}
	try {
		console.log("🔹 Envoi de la requête à /api/profile...");
		console.log("🔹 Token actuel :", accessToken);
		const response = await fetch('/api/profile', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		if (!response.ok) {
			throw new Error(`❌ Erreur HTTP ${response.status}`);
		}

		const data = await response.json();
		console.log("✅ Réponse reçue :", data);

		if (!data.user) {
			console.error("❌ Aucun utilisateur dans la réponse !");
			return;
		}

		const user = data.user;
		console.log("✅ Utilisateur récupéré :", user);

		// Insérer les données dans le tableau HTML
		document.getElementById('user-table').innerHTML = `
			<tr>
				<td class="border px-4 py-2">${user.id}</td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td> <!-- Masquer le mot de passe -->
				<td class="border px-4 py-2">${user.admin === 1 ? "Yes" : "No"}</td>
			</tr>
		`;
		console.log("✅ Profil affiché dans le DOM !");
	} catch (err) {
		console.error('❌ Erreur lors de la récupération du profil :', err);
	}
}

async function logoutUser(id) {
	try {
		const response = await fetch(`/api/users/logout/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id })
		});
		if (response.ok)
			fetchUsers();
		else {
			const error = await response.json();
			alert('Erreur : ' + error.error);
		}
	} catch (err) {
		console.error('Error :', err);
	}
}

async function adminUser(id) {
	try {
		const response = await fetch(`/api/users/admin/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id })
		});
		if (response.ok)
			fetchUsers();
		else {
			const error = await response.json();
			alert('Erreur : ' + error.error);
		}
	} catch (err) {
		console.error('Error :', err);
	}
}

async function deleteUser(id) {
	if (confirm('Do you really want to delete this user ?')) {
		try {
			const response = await fetch(`/api/users/delete/${id}`, { method: 'DELETE' });
			if (response.ok)
				fetchUsers();
			else {
				const error = await response.json();
				alert('Erreur : ' + error.error);
			}
		} catch (err) {
			console.error('Erreur lors de la suppression :', err);
		}
	}
}

// Charger la liste des utilisateurs lors du chargement de la page
// window.addEventListener('DOMContentLoaded', fetchUsers);
// window.addEventListener('DOMContentLoaded', fetchUserProfile);
window.addEventListener('DOMContentLoaded', () => {
	const accessToken = sessionStorage.getItem("accessToken");
	if (accessToken) {
		console.log("✅ Access Token récupéré depuis sessionStorage :", accessToken);
		fetchUserProfile(accessToken);
	} else {
		console.warn("⚠️ Aucun accessToken trouvé, l'utilisateur doit se reconnecter.");
	}
	fetchUsers();
});



document.getElementById("addForm").addEventListener("submit", async function (event) {
	event.preventDefault(); // Empêche le rechargement de la page

	const username = document.getElementById("add-username").value;
	const email = document.getElementById("add-email").value;
	const password = document.getElementById("add-password").value;
	console.log("Username: ", username)
	console.log("Email: ", email)
	console.log("Password: ", password)
	const response = await fetch("/api/users/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, email, password })
	});

	const result = await response.json();
	const resultMessage = document.getElementById("add-resultMessage");
	
	if (result.success) {
		resultMessage.textContent = `User added : ${result.username} (${result.email})`;
		resultMessage.classList.add("text-green-500");
		
		setTimeout(() => {
			location.reload(); // Rafraîchit la page après 1 seconde
		}, 300);
	} else {
		resultMessage.textContent = "Error : " + result.message;
		resultMessage.classList.add("text-red-500");
	}
});

document.getElementById("loginForm").addEventListener("submit", async function (event) {
	event.preventDefault();
	console.log("Form submitted")
	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;

	console.log("Email: ", email)
	console.log("Password: ", password)
	const response = await fetch("/api/users/login", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password })
	});

	const result = await response.json();
	const resultMessage = document.getElementById("login-resultMessage");
	if (result.success && result.accessToken) {
		sessionStorage.setItem("accessToken", result.accessToken);
		resultMessage.textContent = `User Connected : ${result.username} (${result.email})`;
		resultMessage.classList.add("text-green-500");
		
		setTimeout(() => {
			location.reload();
		}, 300);
	} else {
		resultMessage.textContent = "Error : " + result.message;
		resultMessage.classList.add("text-red-500");
	}
});