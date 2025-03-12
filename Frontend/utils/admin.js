async function fetchUsers() {
	try {
		// const response = await fetch('/api/users');
		// const users = await response.json();
		const users = await apiRequest("users", "GET");

		document.getElementById('users-table').innerHTML = users.map(user => `
			<tr>
				<td class="border px-4 py-2">${user.id}</td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td>
				<td class="border px-4 py-2">${user.connected === 1 ? "Yes" : "No"}</td>
				<td class="border px-4 py-2">${user.role}</td>
				<td class="border px-4 py-2 flex">
					<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="logout(${user.id})">Logout</button>
					<button class="bg-gray-700 hover:bg-orange-500 m-2 text-white px-2 py-1 rounded" onclick="changeRole(${user.id})">Change Role</button>
					<button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="unregister(${user.id})">Delete</button>
				</td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des utilisateurs :', err);
	}
}


// async function fetchUserProfile() {
// 	const accessToken = sessionStorage.getItem("accessToken")

// 	if (!accessToken) {
// 		console.error("❌ Aucun accessToken disponible !");
// 		return;
// 	}
// 	try {
// 		// console.log("🔹 Envoi de la requête à /api/profile...");
// 		// console.log("🔹 Token actuel :", accessToken);
// 		const response = await fetch('/api/profile', {
// 			headers: { Authorization: `Bearer ${accessToken}` }
// 		});

// 		if (!response.ok) {
// 			throw new Error(`Erreur HTTP ${response.status}`);
// 		}

// 		const data = await response.json();
// 		// console.log("✅ Réponse reçue :", data);

// 		if (!data.user) {
// 			console.error("Aucun utilisateur dans la réponse !");
// 			return;
// 		}

// 		const user = data.user;
// 		// console.log("✅ Utilisateur récupéré :", user);

// 		document.getElementById('user-table').innerHTML = `
// 			<tr>
// 				<td class="border px-4 py-2">${user.id}</td>
// 				<td class="border px-4 py-2">${user.username}</td>
// 				<td class="border px-4 py-2">${user.email}</td>
// 				<td class="border px-4 py-2">********</td> <!-- Masquer le mot de passe -->
// 				<td class="border px-4 py-2">${user.admin === 1 ? "Yes" : "No"}</td>
// 			</tr>
// 		`;
// 		// console.log("✅ Profil affiché dans le DOM !");
// 	} catch (err) {
// 		console.error('\x1b[31m%s\x1b[0m', 'Erreur lors de la récupération du profil :', err);
// 	}
// }

// async function fetchUserProfile() {
// 	const accessToken = sessionStorage.getItem("accessToken");

// 	if (!accessToken) {
// 		console.error("❌ Aucun accessToken disponible !");
// 		return;
// 	}

// 	try {
// 		console.log("🔹 Récupération des utilisateurs connectés...");

// 		// 🔥 Requête pour obtenir les utilisateurs connectés
// 		const response = await fetch('/api/users/connected', {
// 			headers: { Authorization: `Bearer ${accessToken}` }
// 		});

// 		if (!response.ok) {
// 			throw new Error(`Erreur HTTP ${response.status}`);
// 		}

// 		const data = await response.json();

// 		if (!data.users || data.users.length === 0) {
// 			console.warn("⚠️ Aucun utilisateur connecté !");
// 			return;
// 		}

// 		// 🔥 Générer les lignes du tableau avec les 10 premiers caractères du token
// 		const userTable = document.getElementById('user-table');
// 		userTable.innerHTML = data.users.map(user => `
// 			<tr>
// 				<td class="border px-4 py-2">${user.id}</td>
// 				<td class="border px-4 py-2">${user.username}</td>
// 				<td class="border px-4 py-2">${user.email}</td>
// 				<td class="border px-4 py-2">${accessToken.substring(0, 10)}...</td> <!-- 🔥 Affiche les 10 premiers caractères -->
// 				<td class="border px-4 py-2">${user.admin === 1 ? "Yes" : "No"}</td>
// 			</tr>
// 		`).join("");

// 		console.log("✅ Utilisateurs connectés affichés !");
// 	} catch (err) {
// 		console.error('\x1b[31m%s\x1b[0m', '❌ Erreur lors de la récupération des utilisateurs connectés :', err);
// 	}
// }

async function changeRole(id) {
	try {
		const accessToken = sessionStorage.getItem("accessToken");
		console.log("🔑 Access Token envoyé :", accessToken);

		const response = await fetch(`/api/users/logout/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			},
			body: JSON.stringify({ id })
		});
		if (response.ok) {
			sessionStorage.removeItem("accessToken");
			fetchUsers();
		} else {
			const error = await response.json();
			alert('Error : ' + error.error);
		}
	} catch (err) {
		console.error('Error :', err);
	}
}

async function unregister(id) {
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




